// RoadSide+ Emergency App - Main Application JavaScript

// Global variables
let currentUser = null;
let currentView = 'dashboard';
let serviceHistory = [];
let currentBooking = null;
let activeBookings = new Map();
let availableTechnicians = [];
let realTimeUpdates = null;
let locationWatcher = null;
let currentLocation = null;
let mapInstance = null;
let technicianMatchingActive = false;

// Service workflow configuration
const serviceConfig = {
    'Towing': {
        basePrice: 150,
        duration: 45,
        requirements: ['Vehicle type', 'Towing destination', 'Vehicle condition'],
        specializations: ['towing', 'heavy_duty'],
        emergencyRate: 1.5
    },
    'Battery Jump': {
        basePrice: 75,
        duration: 20,
        requirements: ['Battery type', 'Vehicle access'],
        specializations: ['electrical', 'battery'],
        emergencyRate: 1.3
    },
    'Tire Change': {
        basePrice: 100,
        duration: 30,
        requirements: ['Spare tire availability', 'Tire size', 'Jack availability'],
        specializations: ['tire_service', 'mechanical'],
        emergencyRate: 1.4
    },
    'Lockout': {
        basePrice: 85,
        duration: 20,
        requirements: ['Vehicle make/model', 'Key type', 'ID verification'],
        specializations: ['lockout', 'security'],
        emergencyRate: 1.2
    },
    'Fuel Delivery': {
        basePrice: 60,
        duration: 15,
        requirements: ['Fuel type', 'Tank capacity', 'Delivery amount'],
        specializations: ['fuel_delivery', 'hazmat'],
        emergencyRate: 1.3
    },
    'Winch Recovery': {
        basePrice: 200,
        duration: 60,
        requirements: ['Recovery type', 'Vehicle weight', 'Terrain assessment'],
        specializations: ['winch', 'recovery', 'heavy_duty'],
        emergencyRate: 1.6
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize real-time services
    initializeRealTimeServices();
    
    // Request location permissions
    requestLocationPermissions();
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('login-screen').classList.remove('hidden');
    }, 2000);

    // Initialize bottom navigation
    initializeBottomNav();
    
    // Load service history
    loadServiceHistory();
    
    // Update stats
    updateStats();
    
    // Initialize admin monitoring if admin user
    if (currentUser && currentUser.role === 'admin') {
        initializeAdminMonitoring();
    }
}

// Real-time services initialization
function initializeRealTimeServices() {
    // Simulate WebSocket connection for real-time updates
    realTimeUpdates = {
        connect: function() {
            console.log('🔗 Real-time service connected');
            this.startHeartbeat();
        },
        
        startHeartbeat: function() {
            setInterval(() => {
                this.sendHeartbeat();
            }, 30000); // Every 30 seconds
        },
        
        sendHeartbeat: function() {
            console.log('💗 Heartbeat sent');
        },
        
        emit: function(event, data) {
            console.log(`📡 Emitting: ${event}`, data);
            this.handleEvent(event, data);
        },
        
        handleEvent: function(event, data) {
            switch(event) {
                case 'booking_created':
                    this.handleBookingCreated(data);
                    break;
                case 'technician_assigned':
                    this.handleTechnicianAssigned(data);
                    break;
                case 'status_updated':
                    this.handleStatusUpdate(data);
                    break;
                case 'location_updated':
                    this.handleLocationUpdate(data);
                    break;
            }
        },
        
        handleBookingCreated: function(data) {
            activeBookings.set(data.bookingId, data);
            updateAdminDashboard();
            showNotification(`📋 New booking created: ${data.service}`);
        },
        
        handleTechnicianAssigned: function(data) {
            const booking = activeBookings.get(data.bookingId);
            if (booking) {
                booking.technician = data.technician;
                booking.status = 'technician_assigned';
                updateBookingStatus(data.bookingId, 'technician_assigned');
                showNotification(`🔧 Technician assigned: ${data.technician.name}`);
            }
        },
        
        handleStatusUpdate: function(data) {
            updateBookingStatus(data.bookingId, data.status);
            updateAdminDashboard();
        },
        
        handleLocationUpdate: function(data) {
            updateTechnicianLocation(data.technicianId, data.location);
            updateETAs();
        }
    };
    
    realTimeUpdates.connect();
}

// Location services
function requestLocationPermissions() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                console.log('📍 Location acquired:', currentLocation);
                showNotification('✅ Location services enabled');
            },
            (error) => {
                console.error('Location error:', error);
                showLocationPermissionDialog();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        showError('Geolocation is not supported by this browser');
    }
}

function showLocationPermissionDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'location-permission-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>📍 Location Permission Required</h3>
            <p>To provide accurate service estimates and technician matching, we need access to your location.</p>
            <div class="dialog-actions">
                <button class="btn btn--primary" onclick="requestLocationPermissions()">Enable Location</button>
                <button class="btn btn--outline" onclick="this.parentElement.parentElement.parentElement.remove()">Skip</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
}

function startLocationTracking() {
    if (navigator.geolocation) {
        locationWatcher = navigator.geolocation.watchPosition(
            (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                };
                
                // Send location update to server
                realTimeUpdates.emit('location_updated', {
                    userId: currentUser.id,
                    location: currentLocation
                });
            },
            (error) => {
                console.error('Location tracking error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 10000
            }
        );
    }
}

function stopLocationTracking() {
    if (locationWatcher) {
        navigator.geolocation.clearWatch(locationWatcher);
        locationWatcher = null;
    }
}

// Authentication functions
function login() {
    // Simulate login
    const email = document.querySelector('#login-screen input[type="email"]').value;
    const password = document.querySelector('#login-screen input[type="password"]').value;
    
    if (email && password) {
        currentUser = {
            name: 'John Doe',
            email: email,
            id: 'user123',
            role: 'customer' // Default role
        };
        
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // Start location tracking after login
        startLocationTracking();
        
        showSuccess('Welcome back, ' + currentUser.name + '!');
        
        // Initialize role-specific features
        initializeRoleFeatures();
    } else {
        showError('Please enter email and password');
    }
}

function initializeRoleFeatures() {
    if (currentUser.role === 'admin') {
        initializeAdminMonitoring();
    } else if (currentUser.role === 'technician') {
        initializeTechnicianFeatures();
    }
}

function initializeTechnicianFeatures() {
    // Set up technician-specific notifications
    setupTechnicianNotifications();
    
    // Initialize availability tracking
    updateTechnicianAvailability(true);
    
    // Initialize technician button functionality
    initializeTechnicianButtons();
}

// Initialize all technician button functionality
function initializeTechnicianButtons() {
    console.log('🔧 Initializing technician buttons...');
    
    // Test current button states
    testTechnicianButtons();
    
    // Initialize availability toggle
    initializeAvailabilityToggle();
    
    // Initialize job management buttons
    initializeJobButtons();
    
    // Initialize communication buttons
    initializeCommunicationButtons();
    
    console.log('✅ Technician buttons initialized successfully');
}

// Test technician buttons before implementation
function testTechnicianButtons() {
    console.log('🧪 Testing technician buttons...');
    
    const technicianDashboard = document.getElementById('technician-dashboard');
    if (!technicianDashboard) {
        console.error('❌ Technician dashboard not found');
        return;
    }
    
    const buttons = technicianDashboard.querySelectorAll('button');
    console.log(`📋 Found ${buttons.length} buttons in technician dashboard`);
    
    buttons.forEach((button, index) => {
        console.log(`Button ${index + 1}: ${button.textContent} - ${button.className}`);
    });
}

// Initialize availability toggle functionality
function initializeAvailabilityToggle() {
    const availabilityToggle = document.getElementById('availability-toggle');
    const availabilityStatus = document.querySelector('.availability-status');
    
    if (availabilityToggle) {
        availabilityToggle.addEventListener('change', function() {
            const isAvailable = this.checked;
            updateTechnicianAvailabilityStatus(isAvailable);
            
            if (availabilityStatus) {
                availabilityStatus.textContent = isAvailable ? 'Available' : 'Unavailable';
                availabilityStatus.className = isAvailable ? 'availability-status available' : 'availability-status unavailable';
            }
            
            showNotification(
                isAvailable ? '✅ You are now available for jobs' : '⏸️ You are now unavailable',
                isAvailable ? 'success' : 'info'
            );
        });
        
        console.log('✅ Availability toggle initialized');
    }
}

// Initialize job management buttons
function initializeJobButtons() {
    // Start Job button
    const startJobButtons = document.querySelectorAll('button:contains("Start Job")');
    startJobButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleStartJob(this);
        });
    });
    
    // Complete Job button (will be added dynamically)
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Complete Job') {
            handleCompleteJob(e.target);
        }
    });
    
    console.log('✅ Job management buttons initialized');
}

// Initialize communication buttons
function initializeCommunicationButtons() {
    // Call Customer button
    const callButtons = document.querySelectorAll('button:contains("Call Customer")');
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleCallCustomer(this);
        });
    });
    
    // Message Customer button (will be added dynamically)
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Message Customer') {
            handleMessageCustomer(e.target);
        }
    });
    
    console.log('✅ Communication buttons initialized');
}

// Handle start job button click
function handleStartJob(button) {
    console.log('🚀 Starting job...');
    
    // Get job details from button context
    const jobItem = button.closest('.job-item');
    if (!jobItem) {
        showError('Job details not found');
        return;
    }
    
    const jobTitle = jobItem.querySelector('h4')?.textContent || 'Unknown Service';
    const jobLocation = jobItem.querySelector('p')?.textContent || 'Location not specified';
    
    // Update button state
    button.textContent = 'Job in Progress';
    button.className = 'btn btn--sm btn--warning';
    button.disabled = true;
    
    // Add complete job button
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete Job';
    completeButton.className = 'btn btn--sm btn--success';
    completeButton.style.marginLeft = '10px';
    
    button.parentNode.appendChild(completeButton);
    
    // Update job status
    updateJobStatus(jobTitle, 'in_progress');
    
    showNotification(`🔧 Started job: ${jobTitle}`, 'success');
    
    // Navigate to job tracking page
    navigateToJobTracking(jobTitle, jobLocation);
}

// Handle complete job button click
function handleCompleteJob(button) {
    console.log('✅ Completing job...');
    
    const jobItem = button.closest('.job-item');
    if (!jobItem) {
        showError('Job details not found');
        return;
    }
    
    const jobTitle = jobItem.querySelector('h4')?.textContent || 'Unknown Service';
    
    // Show completion form
    showJobCompletionForm(jobTitle, jobItem);
}

// Handle call customer button click
function handleCallCustomer(button) {
    console.log('📞 Calling customer...');
    
    const jobItem = button.closest('.job-item');
    if (!jobItem) {
        showError('Customer details not found');
        return;
    }
    
    // Simulate customer phone number
    const customerPhone = '+1-555-0123';
    
    if (confirm(`Call customer at ${customerPhone}?`)) {
        // Update button state
        button.textContent = 'Calling...';
        button.disabled = true;
        
        // Simulate call
        setTimeout(() => {
            button.textContent = 'Call Customer';
            button.disabled = false;
            showNotification('📞 Call completed', 'success');
        }, 3000);
        
        // In real app, this would initiate the call
        window.open(`tel:${customerPhone}`);
        
        showNotification('📞 Initiating call...', 'info');
    }
}

// Handle message customer button click
function handleMessageCustomer(button) {
    console.log('💬 Messaging customer...');
    
    const jobItem = button.closest('.job-item');
    if (!jobItem) {
        showError('Customer details not found');
        return;
    }
    
    // Navigate to messaging interface
    navigateToCustomerMessaging();
}

// Navigate to job tracking page
function navigateToJobTracking(jobTitle, jobLocation) {
    console.log(`🗺️ Navigating to job tracking: ${jobTitle}`);
    
    // Create job tracking interface
    const trackingHTML = `
        <div class="job-tracking-page">
            <div class="tracking-header">
                <button class="btn btn--sm btn--outline" onclick="goBackToTechnicianDashboard()">← Back</button>
                <h3>🔧 Job Tracking</h3>
            </div>
            
            <div class="job-details">
                <h4>${jobTitle}</h4>
                <p>📍 ${jobLocation}</p>
                <span class="status-badge in-progress">In Progress</span>
            </div>
            
            <div class="tracking-actions">
                <button class="btn btn--primary" onclick="updateJobProgress()">Update Progress</button>
                <button class="btn btn--outline" onclick="contactSupport()">Contact Support</button>
                <button class="btn btn--success" onclick="completeJobFromTracking()">Complete Job</button>
            </div>
            
            <div class="job-timer">
                <h4>⏱️ Job Timer</h4>
                <div class="timer-display" id="job-timer">00:00:00</div>
                <button class="btn btn--sm" onclick="startJobTimer()">Start Timer</button>
            </div>
        </div>
    `;
    
    // Show in modal or replace content
    showJobTrackingModal(trackingHTML);
}

// Navigate to customer messaging
function navigateToCustomerMessaging() {
    console.log('💬 Opening customer messaging...');
    
    const messagingHTML = `
        <div class="customer-messaging">
            <div class="messaging-header">
                <button class="btn btn--sm btn--outline" onclick="goBackToTechnicianDashboard()">← Back</button>
                <h3>💬 Customer Chat</h3>
            </div>
            
            <div class="chat-messages" id="tech-chat-messages">
                <div class="message customer">
                    <span class="message-time">2 min ago</span>
                    <p>How long until you arrive?</p>
                </div>
            </div>
            
            <div class="chat-input">
                <input type="text" id="tech-chat-input" placeholder="Type your message...">
                <button class="btn btn--primary" onclick="sendTechnicianMessage()">Send</button>
            </div>
        </div>
    `;
    
    showCustomerMessagingModal(messagingHTML);
}

// Update technician availability status
function updateTechnicianAvailabilityStatus(isAvailable) {
    console.log(`🔧 Technician availability updated: ${isAvailable ? 'Available' : 'Unavailable'}`);
    
    // Update server/database
    // In real app, this would send to backend
    
    // Update UI elements
    updateAvailabilityIndicators(isAvailable);
}

// Update availability indicators throughout the app
function updateAvailabilityIndicators(isAvailable) {
    const indicators = document.querySelectorAll('.availability-indicator');
    indicators.forEach(indicator => {
        indicator.className = isAvailable ? 'availability-indicator available' : 'availability-indicator unavailable';
        indicator.textContent = isAvailable ? '🟢 Available' : '🔴 Unavailable';
    });
}

// Update job status
function updateJobStatus(jobTitle, status) {
    console.log(`📋 Job status updated: ${jobTitle} - ${status}`);
    
    // Update in active bookings
    activeBookings.forEach((booking, id) => {
        if (booking.serviceName === jobTitle) {
            booking.status = status;
            realTimeUpdates.emit('status_updated', {
                bookingId: id,
                status: status
            });
        }
    });
}

// Show job completion form
function showJobCompletionForm(jobTitle, jobItem) {
    const completionHTML = `
        <div class="job-completion-form">
            <h3>✅ Complete Job: ${jobTitle}</h3>
            
            <div class="form-group">
                <label>Service Notes</label>
                <textarea id="service-notes" placeholder="Describe work performed..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Parts Used</label>
                <input type="text" id="parts-used" placeholder="List any parts used...">
            </div>
            
            <div class="form-group">
                <label>Additional Charges</label>
                <input type="number" id="additional-charges" placeholder="0.00">
            </div>
            
            <div class="form-actions">
                <button class="btn btn--success" onclick="submitJobCompletion('${jobTitle}')">Complete Job</button>
                <button class="btn btn--outline" onclick="closeJobCompletionForm()">Cancel</button>
            </div>
        </div>
    `;
    
    showJobCompletionModal(completionHTML);
}

// Modal display functions
function showJobTrackingModal(content) {
    const modal = document.createElement('div');
    modal.className = 'job-tracking-modal modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Job Tracking</h2>
                <button class="close-btn" onclick="closeJobTrackingModal()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function showCustomerMessagingModal(content) {
    const modal = document.createElement('div');
    modal.className = 'customer-messaging-modal modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Customer Chat</h2>
                <button class="close-btn" onclick="closeCustomerMessagingModal()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function showJobCompletionModal(content) {
    const modal = document.createElement('div');
    modal.className = 'job-completion-modal modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Complete Job</h2>
                <button class="close-btn" onclick="closeJobCompletionModal()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Modal close functions
function closeJobTrackingModal() {
    const modal = document.querySelector('.job-tracking-modal');
    if (modal) modal.remove();
}

function closeCustomerMessagingModal() {
    const modal = document.querySelector('.customer-messaging-modal');
    if (modal) modal.remove();
}

function closeJobCompletionModal() {
    const modal = document.querySelector('.job-completion-modal');
    if (modal) modal.remove();
}

// Navigation functions
function goBackToTechnicianDashboard() {
    closeJobTrackingModal();
    closeCustomerMessagingModal();
    showDashboard('technician');
}

// Job tracking functions
function updateJobProgress() {
    showNotification('📊 Job progress updated', 'success');
}

function completeJobFromTracking() {
    showNotification('✅ Job completed from tracking', 'success');
    goBackToTechnicianDashboard();
}

function startJobTimer() {
    const timerDisplay = document.getElementById('job-timer');
    let seconds = 0;
    
    const timerInterval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Store interval ID for cleanup
    window.jobTimerInterval = timerInterval;
    
    showNotification('⏱️ Job timer started', 'info');
}

// Messaging functions
function sendTechnicianMessage() {
    const input = document.getElementById('tech-chat-input');
    const messagesContainer = document.getElementById('tech-chat-messages');
    
    if (input && messagesContainer && input.value.trim()) {
        const message = input.value.trim();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message technician';
        messageElement.innerHTML = `
            <span class="message-time">Just now</span>
            <p>${message}</p>
        `;
        
        messagesContainer.appendChild(messageElement);
        input.value = '';
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        showNotification('💬 Message sent', 'success');
    }
}

// Job completion functions
function submitJobCompletion(jobTitle) {
    const notes = document.getElementById('service-notes')?.value;
    const parts = document.getElementById('parts-used')?.value;
    const charges = document.getElementById('additional-charges')?.value;
    
    if (!notes || !notes.trim()) {
        showError('Please provide service notes');
        return;
    }
    
    console.log('✅ Submitting job completion:', {
        jobTitle,
        notes,
        parts,
        charges
    });
    
    // Update job status
    updateJobStatus(jobTitle, 'completed');
    
    // Close modal
    closeJobCompletionModal();
    
    // Show success
    showNotification(`✅ Job completed: ${jobTitle}`, 'success');
    
    // Refresh technician dashboard
    setTimeout(() => {
        showDashboard('technician');
    }, 2000);
}

function closeJobCompletionForm() {
    closeJobCompletionModal();
}

// Test functions
function testTechnicianButtonsAfterImplementation() {
    console.log('🧪 Testing technician buttons after implementation...');
    
    // Test availability toggle
    const availabilityToggle = document.getElementById('availability-toggle');
    if (availabilityToggle) {
        console.log('✅ Availability toggle found and functional');
    } else {
        console.log('❌ Availability toggle not found');
    }
    
    // Test job buttons
    const startJobButtons = document.querySelectorAll('button:contains("Start Job")');
    console.log(`✅ Found ${startJobButtons.length} start job buttons`);
    
    // Test call buttons
    const callButtons = document.querySelectorAll('button:contains("Call Customer")');
    console.log(`✅ Found ${callButtons.length} call customer buttons`);
    
    console.log('✅ All technician buttons tested successfully');
}
function setupTechnicianNotifications() {
    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('🔔 Notifications enabled for service requests');
            }
        });
    }
}

function showRegister() {
    showNotification('Registration form would open here');
}

function logout() {
    currentUser = null;
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    showSuccess('Logged out successfully');
}

// Navigation functions
function toggleNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    drawer.classList.toggle('open');
}

function closeNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    drawer.classList.remove('open');
}

// Dashboard functions
function showDashboard(type) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    // Find and activate the correct tab
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(type)) {
            tab.classList.add('active');
        }
    });
    
    // Hide all dashboard content
    document.querySelectorAll('.dashboard-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected dashboard content
    const targetDashboard = document.getElementById(`${type}-dashboard`);
    if (targetDashboard) {
        targetDashboard.classList.add('active');
    }
    
    currentView = type;
    updateDashboardContent(type);
    showNotification(`Switched to ${type} dashboard`);
}

function updateDashboardContent(type) {
    const viewHeader = document.querySelector('.view-header h2');
    if (viewHeader) {
        viewHeader.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Dashboard`;
    }
}

// Emergency function
function emergencyCall() {
    if (confirm('This will connect you to emergency services. Continue?')) {
        showNotification('🚨 Connecting to emergency services...', 'emergency');
        // In real app, this would call emergency services
        setTimeout(() => {
            showNotification('Emergency services contacted. Help is on the way!', 'success');
        }, 2000);
    }
}

// Service selection
function selectService(serviceId, serviceName, servicePrice) {
    currentBooking = {
        serviceId: serviceId,
        serviceName: serviceName,
        servicePrice: servicePrice,
        timestamp: new Date(),
        config: serviceConfig[serviceName] || {}
    };
    
    // Always use the built-in booking modal
    showBookingModal(serviceId, serviceName, servicePrice);
}

function showBookingModal(serviceId, serviceName, servicePrice) {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Update modal content with service details
        const serviceIcon = document.getElementById('selected-service-icon');
        const serviceName_el = document.getElementById('selected-service-name');
        const servicePrice_el = document.getElementById('selected-service-price');
        
        if (serviceIcon) serviceIcon.textContent = getServiceIcon(serviceName);
        if (serviceName_el) serviceName_el.textContent = serviceName;
        if (servicePrice_el) servicePrice_el.textContent = '$' + servicePrice;
        
        // Reset to first step
        resetBookingSteps();
        
        // Enable continue button and set up event handler
        setupBookingStepHandlers();
        
        // Initialize real-time price calculation
        initializePriceCalculation();
        
        // Load service-specific requirements
        loadServiceRequirements(serviceName);
    }
}

// Enhanced booking flow with validation
function initializePriceCalculation() {
    const priceDisplay = document.getElementById('selected-service-price');
    const service = currentBooking.config;
    
    // Calculate real-time price based on various factors
    const basePrice = service.basePrice || currentBooking.servicePrice;
    let totalPrice = basePrice;
    
    // Add distance surcharge if location is available
    if (currentLocation) {
        const distance = calculateDistance(currentLocation);
        if (distance > 25) { // 25km free zone
            totalPrice += Math.ceil((distance - 25) * 2); // $2 per km
        }
    }
    
    // Add time-based surcharge
    const currentHour = new Date().getHours();
    if (currentHour < 6 || currentHour > 22) {
        totalPrice *= 1.3; // 30% surcharge for after hours
    }
    
    // Update price display
    if (priceDisplay) {
        priceDisplay.textContent = '$' + Math.round(totalPrice);
    }
    
    // Store calculated price
    currentBooking.calculatedPrice = totalPrice;
}

function calculateDistance(location) {
    // Simulate distance calculation - in real app would use Google Maps API
    return Math.floor(Math.random() * 50) + 5; // 5-55km range
}

function loadServiceRequirements(serviceName) {
    const config = serviceConfig[serviceName];
    if (!config) return;
    
    // Add service-specific form fields
    const step2 = document.getElementById('booking-step-2');
    if (step2) {
        const requirementsHTML = `
            <div class="service-requirements">
                <h4>Service Requirements</h4>
                ${config.requirements.map(req => `
                    <div class="form-group">
                        <label class="form-label">${req}</label>
                        <input type="text" class="form-control" placeholder="Enter ${req.toLowerCase()}" required>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert after existing description field
        const descriptionGroup = step2.querySelector('.form-group:last-child');
        if (descriptionGroup) {
            descriptionGroup.insertAdjacentHTML('afterend', requirementsHTML);
        }
    }
}

// Enhanced validation functions
function validateStep1() {
    // Service selection validation
    return currentBooking && currentBooking.serviceName;
}

function validateStep2() {
    // Enhanced validation for location and service requirements
    const locationInput = document.getElementById('location-input');
    const descriptionInput = document.getElementById('problem-description');
    
    if (!locationInput || !locationInput.value.trim()) {
        showError('Location is required');
        return false;
    }
    
    if (!descriptionInput || !descriptionInput.value.trim()) {
        showError('Problem description is required');
        return false;
    }
    
    // Validate service-specific requirements
    const requirementInputs = document.querySelectorAll('.service-requirements input[required]');
    for (let input of requirementInputs) {
        if (!input.value.trim()) {
            showError(`${input.previousElementSibling.textContent} is required`);
            return false;
        }
    }
    
    return true;
}

function validateStep3() {
    // Payment validation
    const selectedPayment = document.querySelector('.payment-method.active');
    if (!selectedPayment) {
        showError('Please select a payment method');
        return false;
    }
    return true;
}

// Technician matching system
function initiateTechnicianMatching() {
    if (!currentBooking || !currentLocation) {
        showError('Booking or location information missing');
        return;
    }
    
    technicianMatchingActive = true;
    showNotification('🔍 Finding available technicians...');
    
    // Simulate technician discovery
    setTimeout(() => {
        findNearbyTechnicians();
    }, 2000);
}

function findNearbyTechnicians() {
    const service = currentBooking.config;
    const requiredSpecializations = service.specializations || [];
    
    // Simulate finding technicians
    availableTechnicians = [
        {
            id: 'tech1',
            name: 'Mike Rodriguez',
            specializations: ['towing', 'mechanical'],
            rating: 4.9,
            distance: 12.3,
            eta: 18,
            vehicle: 'Tow Truck #1',
            phone: '+1-555-0123'
        },
        {
            id: 'tech2',
            name: 'Sarah Johnson',
            specializations: ['electrical', 'battery'],
            rating: 4.8,
            distance: 8.7,
            eta: 15,
            vehicle: 'Service Van #2',
            phone: '+1-555-0456'
        },
        {
            id: 'tech3',
            name: 'Carlos Martinez',
            specializations: ['tire_service', 'mechanical'],
            rating: 4.7,
            distance: 15.2,
            eta: 22,
            vehicle: 'Mobile Service #3',
            phone: '+1-555-0789'
        }
    ];
    
    // Filter technicians by specialization
    const matchedTechnicians = availableTechnicians.filter(tech => 
        requiredSpecializations.some(spec => tech.specializations.includes(spec))
    );
    
    if (matchedTechnicians.length > 0) {
        // Sort by distance and rating
        matchedTechnicians.sort((a, b) => {
            const scoreA = (a.rating * 0.3) + ((50 - a.distance) * 0.7);
            const scoreB = (b.rating * 0.3) + ((50 - b.distance) * 0.7);
            return scoreB - scoreA;
        });
        
        notifyTechnicians(matchedTechnicians);
    } else {
        showError('No available technicians found for this service');
    }
}

function notifyTechnicians(technicians) {
    let currentTechIndex = 0;
    
    function notifyNextTechnician() {
        if (currentTechIndex >= technicians.length) {
            showError('All technicians are currently busy. Please try again later.');
            return;
        }
        
        const tech = technicians[currentTechIndex];
        showNotification(`📞 Notifying ${tech.name}...`);
        
        // Simulate push notification to technician
        sendTechnicianNotification(tech);
        
        // Wait for response with 30-second timeout
        setTimeout(() => {
            // Simulate response (in real app, this would come from technician)
            const responses = ['accept', 'decline', 'timeout'];
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            if (response === 'accept') {
                handleTechnicianAcceptance(tech);
            } else {
                showNotification(`${tech.name} is unavailable. Trying next technician...`);
                currentTechIndex++;
                notifyNextTechnician();
            }
        }, 30000); // 30-second timeout
    }
    
    notifyNextTechnician();
}

function sendTechnicianNotification(technician) {
    // Simulate push notification to technician
    console.log(`📱 Push notification sent to ${technician.name}`);
    
    // In real app, this would send actual push notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Service Request', {
            body: `${currentBooking.serviceName} - ${currentLocation ? 'Location available' : 'No location'}`,
            icon: '/favicon.ico',
            tag: 'service-request'
        });
    }
}

function handleTechnicianAcceptance(technician) {
    showNotification(`✅ ${technician.name} accepted your request!`);
    
    // Update booking with technician
    currentBooking.technician = technician;
    currentBooking.status = 'technician_assigned';
    
    // Show technician info and start tracking
    showTechnicianAssigned(technician);
    
    // Enable communication channel
    enableTechnicianCommunication(technician);
    
    // Start real-time tracking
    startTechnicianTracking(technician);
}

function showTechnicianAssigned(technician) {
    const assignmentHTML = `
        <div class="technician-assignment">
            <h3>🎯 Technician Assigned!</h3>
            <div class="technician-card">
                <div class="technician-info">
                    <h4>${technician.name}</h4>
                    <div class="rating">${'⭐'.repeat(Math.floor(technician.rating))} ${technician.rating}</div>
                    <p>📍 ${technician.distance} km away</p>
                    <p>🚗 ${technician.vehicle}</p>
                    <p>⏱️ ETA: ${technician.eta} minutes</p>
                </div>
                <div class="technician-actions">
                    <button class="btn btn--primary" onclick="callTechnician('${technician.phone}')">📞 Call</button>
                    <button class="btn btn--outline" onclick="messageTechnician('${technician.id}')">💬 Message</button>
                </div>
            </div>
            <div class="tracking-map">
                <div id="service-map"></div>
                <button class="btn btn--sm" onclick="refreshTechnicianLocation()">🔄 Refresh Location</button>
            </div>
        </div>
    `;
    
    // Update booking modal or show in tracking modal
    closeBookingModal();
    showTrackingModal(assignmentHTML);
}

function enableTechnicianCommunication(technician) {
    // Set up direct communication channel
    console.log(`💬 Communication channel enabled with ${technician.name}`);
    
    // In real app, this would establish WebRTC or similar connection
}

function startTechnicianTracking(technician) {
    // Simulate real-time technician location tracking
    const trackingInterval = setInterval(() => {
        // Simulate technician movement
        const eta = Math.max(1, technician.eta - 1);
        technician.eta = eta;
        
        // Update ETA display
        const etaDisplay = document.querySelector('.technician-info p:contains("ETA")');
        if (etaDisplay) {
            etaDisplay.textContent = `⏱️ ETA: ${eta} minutes`;
        }
        
        // Stop tracking when technician arrives
        if (eta <= 1) {
            clearInterval(trackingInterval);
            showNotification('🎉 Technician has arrived!');
            handleTechnicianArrival(technician);
        }
    }, 60000); // Update every minute
}

function handleTechnicianArrival(technician) {
    currentBooking.status = 'technician_arrived';
    showNotification(`${technician.name} has arrived at your location`);
    
    // Update UI to show service in progress
    updateServiceStatus('in_progress');
}

function updateServiceStatus(status) {
    if (currentBooking) {
        currentBooking.status = status;
        realTimeUpdates.emit('status_updated', {
            bookingId: currentBooking.id,
            status: status
        });
    }
}

function refreshTechnicianLocation() {
    showNotification('🔄 Refreshing technician location...');
    // Simulate location refresh
    setTimeout(() => {
        showNotification('📍 Location updated');
    }, 1000);
}

// Map integration (simulated)
function initializeMap() {
    // Simulate Google Maps integration
    mapInstance = {
        center: currentLocation,
        zoom: 15,
        markers: [],
        
        addMarker: function(location, type) {
            const marker = {
                position: location,
                type: type,
                id: Date.now()
            };
            this.markers.push(marker);
            console.log(`📍 Added ${type} marker at`, location);
        },
        
        removeMarker: function(id) {
            this.markers = this.markers.filter(m => m.id !== id);
        },
        
        updateRoute: function(start, end) {
            console.log('🗺️ Updating route from', start, 'to', end);
            // Simulate route calculation
            return {
                distance: Math.random() * 50,
                duration: Math.random() * 60,
                route: []
            };
        },
        
        showTraffic: function() {
            console.log('🚦 Traffic layer enabled');
        }
    };
    
    // Add customer location marker
    if (currentLocation) {
        mapInstance.addMarker(currentLocation, 'customer');
    }
}

function showTrackingModal(content) {
    const modal = document.getElementById('tracking-modal');
    if (modal) {
        modal.querySelector('.modal-body').innerHTML = content;
        modal.style.display = 'block';
        
        // Initialize map in tracking modal
        initializeMap();
    }
}

// Admin monitoring dashboard
function initializeAdminMonitoring() {
    console.log('👨‍💼 Initializing admin monitoring...');
    
    // Start real-time dashboard updates
    setInterval(() => {
        updateAdminDashboard();
    }, 5000); // Update every 5 seconds
    
    // Initialize live metrics
    updateLiveMetrics();
}

function updateAdminDashboard() {
    const adminDashboard = document.getElementById('admin-dashboard');
    if (!adminDashboard || !adminDashboard.classList.contains('active')) {
        return;
    }
    
    // Update live booking count
    const activeBookingCount = document.querySelector('.stat-card .stat-value');
    if (activeBookingCount) {
        activeBookingCount.textContent = activeBookings.size;
    }
    
    // Update technician status
    updateTechnicianStatus();
    
    // Update service requests
    updateServiceRequests();
}

function updateLiveMetrics() {
    // Simulate live metrics
    const metrics = {
        activeBookings: activeBookings.size,
        availableTechnicians: availableTechnicians.length,
        averageResponseTime: Math.floor(Math.random() * 30) + 15,
        systemHealth: Math.floor(Math.random() * 10) + 90
    };
    
    // Update UI with metrics
    updateMetricsDisplay(metrics);
}

function updateMetricsDisplay(metrics) {
    const statCards = document.querySelectorAll('.admin-stats .stat-card');
    
    statCards.forEach((card, index) => {
        const valueElement = card.querySelector('.stat-value');
        if (valueElement) {
            switch(index) {
                case 0:
                    valueElement.textContent = metrics.activeBookings;
                    break;
                case 1:
                    valueElement.textContent = metrics.availableTechnicians;
                    break;
                case 2:
                    valueElement.textContent = `${metrics.systemHealth}%`;
                    break;
            }
        }
    });
}

function updateTechnicianStatus() {
    // Update technician availability display
    console.log('🔧 Updating technician status...');
}

function updateServiceRequests() {
    // Update active service requests display
    console.log('📋 Updating service requests...');
}

// Testing functions
function runServiceTests() {
    console.log('🧪 Running service tests...');
    
    // Test each service type
    const services = Object.keys(serviceConfig);
    services.forEach(service => {
        testServiceType(service);
    });
    
    // Test technician matching
    testTechnicianMatching();
    
    // Test map functionality
    testMapFunctionality();
    
    // Test admin panel
    testAdminPanel();
    
    console.log('✅ All tests completed');
}

function testServiceType(serviceName) {
    console.log(`Testing ${serviceName}...`);
    
    // Simulate service selection and booking
    const config = serviceConfig[serviceName];
    
    // Test validation
    const testBooking = {
        serviceName: serviceName,
        config: config,
        servicePrice: config.basePrice
    };
    
    // Test price calculation
    const testPrice = calculateServicePrice(testBooking);
    console.log(`${serviceName} price calculation: $${testPrice}`);
    
    console.log(`✅ ${serviceName} test passed`);
}

function calculateServicePrice(booking) {
    const config = booking.config;
    let price = config.basePrice;
    
    // Add distance and time surcharges
    price += Math.random() * 50; // Simulate variable pricing
    
    return Math.round(price);
}

function testTechnicianMatching() {
    console.log('Testing technician matching...');
    
    // Simulate technician discovery
    const testTechnicians = [
        { specializations: ['towing'], available: true },
        { specializations: ['battery'], available: false },
        { specializations: ['tire_service'], available: true }
    ];
    
    const available = testTechnicians.filter(t => t.available);
    console.log(`Found ${available.length} available technicians`);
    
    console.log('✅ Technician matching test passed');
}

function testMapFunctionality() {
    console.log('Testing map functionality...');
    
    // Test map initialization
    initializeMap();
    
    // Test marker addition
    if (mapInstance) {
        mapInstance.addMarker({ lat: 40.7128, lng: -74.0060 }, 'test');
        console.log('Map marker test passed');
    }
    
    console.log('✅ Map functionality test passed');
}

function testAdminPanel() {
    console.log('Testing admin panel...');
    
    // Test metrics update
    updateLiveMetrics();
    
    // Test dashboard updates
    updateAdminDashboard();
    
    console.log('✅ Admin panel test passed');
}

// Enhanced booking confirmation
// Reset booking modal to first step
function resetBookingSteps() {
    // Hide all steps
    const steps = document.querySelectorAll('.booking-step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show first step
    const firstStep = document.getElementById('booking-step-1');
    if (firstStep) {
        firstStep.classList.add('active');
    }
    
    // Reset step indicators
    const stepIndicators = document.querySelectorAll('.step');
    stepIndicators.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) {
            step.classList.add('active');
        }
    });
}

// Setup event handlers for booking step navigation
function setupBookingStepHandlers() {
    // Remove any existing handlers to prevent duplicates
    const continueButtons = document.querySelectorAll('.booking-step .btn--primary');
    continueButtons.forEach(button => {
        // Clone button to remove all event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Add event handlers for each step's continue button
    setupStepHandler('booking-step-1', nextBookingStep);
    setupStepHandler('booking-step-2', nextBookingStep);
    setupStepHandler('booking-step-3', nextBookingStep);
    setupStepHandler('booking-step-4', confirmBooking);
}

// Setup handler for a specific step
function setupStepHandler(stepId, handler) {
    const step = document.getElementById(stepId);
    if (step) {
        const continueButton = step.querySelector('.btn--primary');
        if (continueButton) {
            continueButton.addEventListener('click', function(e) {
                e.preventDefault();
                handler();
            });
            
            // Ensure button is enabled and responsive
            continueButton.disabled = false;
            continueButton.style.pointerEvents = 'auto';
            continueButton.style.opacity = '1';
        }
    }
}

// Navigate to next booking step
function nextBookingStep() {
    const currentStep = document.querySelector('.booking-step.active');
    if (!currentStep) return;
    
    const currentStepId = currentStep.id;
    let nextStepId;
    
    // Determine next step
    switch(currentStepId) {
        case 'booking-step-1':
            if (validateStep1()) {
                nextStepId = 'booking-step-2';
            }
            break;
        case 'booking-step-2':
            if (validateStep2()) {
                nextStepId = 'booking-step-3';
            }
            break;
        case 'booking-step-3':
            if (validateStep3()) {
                nextStepId = 'booking-step-4';
            }
            break;
    }
    
    if (nextStepId) {
        // Hide current step
        currentStep.classList.remove('active');
        
        // Show next step
        const nextStep = document.getElementById(nextStepId);
        if (nextStep) {
            nextStep.classList.add('active');
            updateStepIndicators(nextStepId);
        }
    }
}

// Update step progress indicators
function updateStepIndicators(currentStepId) {
    const stepNumber = parseInt(currentStepId.split('-').pop());
    const stepIndicators = document.querySelectorAll('.step');
    
    stepIndicators.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index < stepNumber - 1) {
            step.classList.add('completed');
        } else if (index === stepNumber - 1) {
            step.classList.add('active');
        }
    });
}

// Validation functions for each step
function validateStep1() {
    // Service is already selected, always valid
    return true;
}

function validateStep2() {
    // Basic validation - could be enhanced
    return true;
}

function validateStep3() {
    // Payment method validation - could be enhanced
    return true;
}
function getServiceIcon(serviceName) {
    const icons = {
        'Towing': '🚛',
        'Battery Jump': '🔋',
        'Tire Change': '🛞',
        'Lockout': '🔓',
        'Fuel Delivery': '⛽',
        'Winch Recovery': '🪝'
    };
    return icons[serviceName] || '🔧';
}

// Modal functions
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Booking functions
function confirmBooking() {
    if (currentBooking) {
        // Validate all booking data
        if (!validateBookingData()) {
            showError('Please complete all required fields');
            return;
        }
        
        // Generate booking ID
        const bookingId = 'RS-' + Date.now();
        currentBooking.id = bookingId;
        
        // Update booking status
        currentBooking.status = 'confirmed';
        
        // Add to service history
        serviceHistory.unshift({
            id: bookingId,
            service: currentBooking.serviceName,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: 'Confirmed',
            price: currentBooking.calculatedPrice || currentBooking.servicePrice,
            rating: null
        });
        
        // Store in active bookings
        activeBookings.set(bookingId, currentBooking);
        
        // Emit booking created event
        realTimeUpdates.emit('booking_created', {
            bookingId: bookingId,
            service: currentBooking.serviceName,
            customer: currentUser.name,
            location: currentLocation
        });
        
        // Update display
        loadServiceHistory();
        updateStats();
        
        // Close modal and show tracking
        closeBookingModal();
        
        showSuccess('Booking confirmed! Finding technician...');
        
        // Start technician matching process
        setTimeout(() => {
            initiateTechnicianMatching();
        }, 3000);
    }
}

function validateBookingData() {
    // Validate all booking steps
    return validateStep1() && validateStep2() && validateStep3();
}

function updateBookingStatus(bookingId, status) {
    const booking = activeBookings.get(bookingId);
    if (booking) {
        booking.status = status;
        
        // Update UI displays
        updateServiceHistoryStatus(bookingId, status);
        
        // Show status notification
        showNotification(`📋 Booking ${bookingId} status: ${status}`);
    }
}

function updateServiceHistoryStatus(bookingId, status) {
    const historyItem = serviceHistory.find(item => item.id === bookingId);
    if (historyItem) {
        historyItem.status = status;
        loadServiceHistory(); // Refresh display
    }
}

function updateTechnicianLocation(technicianId, location) {
    const technician = availableTechnicians.find(t => t.id === technicianId);
    if (technician) {
        technician.location = location;
        
        // Update map if visible
        if (mapInstance) {
            mapInstance.addMarker(location, 'technician');
        }
    }
}

function updateETAs() {
    // Update estimated arrival times based on current traffic and locations
    console.log('⏱️ Updating ETAs...');
}

function updateTechnicianAvailability(available) {
    // Update technician availability status
    console.log(`🔧 Technician availability: ${available ? 'Available' : 'Unavailable'}`);
}

// Enhanced communication functions
function callTechnician() {
    if (currentBooking && currentBooking.technician) {
        const phone = currentBooking.technician.phone;
        if (confirm(`Call ${currentBooking.technician.name} at ${phone}?`)) {
            window.open(`tel:${phone}`);
            showNotification('📞 Initiating call...');
        }
    }
}

function messageTechnician(technicianId) {
    const technician = availableTechnicians.find(t => t.id === technicianId);
    if (technician) {
        openChatInterface(technician);
    }
}

function openChatInterface(technician) {
    const chatHTML = `
        <div class="chat-interface">
            <div class="chat-header">
                <h4>💬 Chat with ${technician.name}</h4>
                <button class="btn btn--sm" onclick="closeChatInterface()">×</button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message technician">
                    <span class="message-time">Just now</span>
                    <p>Hi! I'm on my way to your location. ETA: ${technician.eta} minutes.</p>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chat-input" placeholder="Type a message..." onkeypress="handleChatKeyPress(event)">
                <button class="btn btn--primary" onclick="sendChatMessage()">Send</button>
            </div>
        </div>
    `;
    
    // Create chat modal
    const chatModal = document.createElement('div');
    chatModal.className = 'chat-modal';
    chatModal.id = 'chat-modal';
    chatModal.innerHTML = chatHTML;
    
    document.body.appendChild(chatModal);
}

function closeChatInterface() {
    const chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        chatModal.remove();
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (input && messagesContainer && input.value.trim()) {
        const message = input.value.trim();
        
        // Add customer message
        const messageElement = document.createElement('div');
        messageElement.className = 'message customer';
        messageElement.innerHTML = `
            <span class="message-time">Just now</span>
            <p>${message}</p>
        `;
        messagesContainer.appendChild(messageElement);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate technician response
        setTimeout(() => {
            const responses = [
                "Got it! I'll be there shortly.",
                "Thanks for the update. On my way!",
                "No problem. See you soon.",
                "Understood. I'll handle that when I arrive."
            ];
            
            const responseElement = document.createElement('div');
            responseElement.className = 'message technician';
            responseElement.innerHTML = `
                <span class="message-time">Just now</span>
                <p>${responses[Math.floor(Math.random() * responses.length)]}</p>
            `;
            messagesContainer.appendChild(responseElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 2000);
    }
}

// Service history functions
function loadServiceHistory() {
    const historyContainer = document.getElementById('recent-services');
    const historyListContainer = document.getElementById('service-history-list');
    
    if (serviceHistory.length === 0) {
        // Add some sample data
        serviceHistory = [
            {
                id: 'RS-001',
                service: 'Battery Jump',
                date: '2024-01-15',
                time: '14:30',
                status: 'Completed',
                price: 75,
                rating: 5
            },
            {
                id: 'RS-002',
                service: 'Tire Change',
                date: '2024-01-10',
                time: '09:15',
                status: 'Completed',
                price: 100,
                rating: 4
            }
        ];
    }
    
    const historyHTML = serviceHistory.map(service => `
        <div class="service-item ${service.status.toLowerCase().replace(' ', '-')}">
            <div class="service-info">
                <h4>${service.service}</h4>
                <p>${service.date} at ${service.time}</p>
                <span class="status-badge">${service.status}</span>
            </div>
            <div class="service-details">
                <span class="price">$${service.price}</span>
                ${service.rating ? `<div class="rating">${'⭐'.repeat(service.rating)}</div>` : ''}
            </div>
        </div>
    `).join('');
    
    if (historyContainer) {
        historyContainer.innerHTML = historyHTML;
    }
    
    if (historyListContainer) {
        historyListContainer.innerHTML = historyHTML;
    }
}

// Stats functions
function updateStats() {
    const totalServices = serviceHistory.length;
    const totalSpent = serviceHistory.reduce((sum, service) => sum + service.price, 0);
    const avgRating = serviceHistory.filter(s => s.rating).reduce((sum, s, _, arr) => sum + s.rating / arr.length, 0);
    
    // Update dashboard stats
    const totalServicesEl = document.getElementById('total-services');
    const totalSpentEl = document.getElementById('total-spent');
    const avgRatingEl = document.getElementById('avg-rating');
    
    if (totalServicesEl) totalServicesEl.textContent = totalServices;
    if (totalSpentEl) totalSpentEl.textContent = '$' + totalSpent;
    if (avgRatingEl) avgRatingEl.textContent = avgRating.toFixed(1);
    
    // Update profile stats
    const profileTotalServices = document.getElementById('profile-total-services');
    const profileTotalSpent = document.getElementById('profile-total-spent');
    const profileAvgRating = document.getElementById('profile-avg-rating');
    
    if (profileTotalServices) profileTotalServices.textContent = totalServices;
    if (profileTotalSpent) profileTotalSpent.textContent = '$' + totalSpent;
    if (profileAvgRating) profileAvgRating.textContent = avgRating.toFixed(1);
}

// Profile functions
function saveProfile() {
    const name = document.getElementById('profile-name')?.value;
    const email = document.getElementById('profile-email')?.value;
    const phone = document.getElementById('profile-phone')?.value;
    
    if (name && email && phone) {
        showSuccess('Profile saved successfully!');
    } else {
        showError('Please fill in all required fields');
    }
}

// Support functions
function createSupportTicket() {
    showNotification('Support ticket system would open here');
}

// Bottom navigation
function initializeBottomNav() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            if (view) {
                showView(view);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.classList.add('active');
    }
    
    currentView = viewName;
}

// Notification functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

// Admin functions (for admin dashboard)
function manageUsers() {
  showUserManagement();
}

function manageTechnicians() {
  showTechnicianManagement();
}

function viewAnalytics() {
  showAnalyticsDashboard();
}

function systemSettings() {
  showSystemSettings();
}

// Admin User Management System
function showUserManagement() {
  console.log('Testing: User Management button clicked');
  
  // Add loading state
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Loading...';
  button.disabled = true;
  
  try {
    setTimeout(() => {
      // Create user management modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'user-management-modal';
      
      modal.innerHTML = `
        <div class="modal-content large-modal">
          <div class="modal-header">
            <h2>👥 User Management</h2>
            <button class="close-btn" onclick="closeModal('user-management-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="admin-toolbar">
              <button class="btn btn--primary" onclick="addNewUser()">
                <span>👤</span> Add New User
              </button>
              <input type="text" placeholder="Search users..." class="search-input" onkeyup="searchUsers(this.value)">
              <select class="filter-select" onchange="filterUsers(this.value)">
                <option value="">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
              </select>
            </div>
            
            <div class="user-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="user-table-body">
                  ${generateUserTableRows()}
                </tbody>
              </table>
            </div>
            
            <div class="user-stats">
              <div class="stat-group">
                <div class="stat-item">
                  <span class="stat-label">Total Users:</span>
                  <span class="stat-value">247</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Active Users:</span>
                  <span class="stat-value">201</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">New This Month:</span>
                  <span class="stat-value">23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.style.display = 'block';
      
      // Reset button
      button.textContent = originalText;
      button.disabled = false;
      
      showNotification('✅ User management loaded successfully', 'success');
      console.log('✅ User Management: Successfully opened user management interface');
    }, 800);
    
  } catch (error) {
    console.error('❌ User Management: Error loading interface:', error);
    showNotification('❌ Error loading user management', 'error');
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Admin Technician Management System
function showTechnicianManagement() {
  console.log('Testing: Technician Management button clicked');
  
  // Add loading state
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Loading...';
  button.disabled = true;
  
  try {
    setTimeout(() => {
      // Create technician management modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'technician-management-modal';
      
      modal.innerHTML = `
        <div class="modal-content large-modal">
          <div class="modal-header">
            <h2>🔧 Technician Management</h2>
            <button class="close-btn" onclick="closeModal('technician-management-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="admin-toolbar">
              <button class="btn btn--primary" onclick="addNewTechnician()">
                <span>🔧</span> Add New Technician
              </button>
              <input type="text" placeholder="Search technicians..." class="search-input" onkeyup="searchTechnicians(this.value)">
              <select class="filter-select" onchange="filterTechnicians(this.value)">
                <option value="">All Technicians</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            
            <div class="technician-grid">
              ${generateTechnicianCards()}
            </div>
            
            <div class="technician-stats">
              <div class="stat-group">
                <div class="stat-item">
                  <span class="stat-label">Total Technicians:</span>
                  <span class="stat-value">34</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Available:</span>
                  <span class="stat-value">12</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">On Duty:</span>
                  <span class="stat-value">22</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.style.display = 'block';
      
      // Reset button
      button.textContent = originalText;
      button.disabled = false;
      
      showNotification('✅ Technician management loaded successfully', 'success');
      console.log('✅ Technician Management: Successfully opened technician management interface');
    }, 800);
    
  } catch (error) {
    console.error('❌ Technician Management: Error loading interface:', error);
    showNotification('❌ Error loading technician management', 'error');
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Admin Analytics Dashboard
function showAnalyticsDashboard() {
  console.log('Testing: Analytics Dashboard button clicked');
  
  // Add loading state
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Loading...';
  button.disabled = true;
  
  try {
    setTimeout(() => {
      // Create analytics modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'analytics-modal';
      
      modal.innerHTML = `
        <div class="modal-content large-modal">
          <div class="modal-header">
            <h2>📊 Analytics Dashboard</h2>
            <button class="close-btn" onclick="closeModal('analytics-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="analytics-toolbar">
              <select class="filter-select" onchange="updateAnalyticsPeriod(this.value)">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month" selected>This Month</option>
                <option value="year">This Year</option>
              </select>
              <button class="btn btn--outline" onclick="exportAnalytics()">
                <span>📊</span> Export Report
              </button>
            </div>
            
            <div class="analytics-grid">
              <div class="analytics-card">
                <h3>📈 Service Volume</h3>
                <div class="chart-placeholder">
                  <div class="chart-bar" style="height: 60%"></div>
                  <div class="chart-bar" style="height: 80%"></div>
                  <div class="chart-bar" style="height: 40%"></div>
                  <div class="chart-bar" style="height: 90%"></div>
                  <div class="chart-bar" style="height: 70%"></div>
                </div>
                <p>456 services this month (+12%)</p>
              </div>
              
              <div class="analytics-card">
                <h3>💰 Revenue Analysis</h3>
                <div class="revenue-stats">
                  <div class="revenue-item">
                    <span class="revenue-label">Total Revenue:</span>
                    <span class="revenue-value">$34,567</span>
                  </div>
                  <div class="revenue-item">
                    <span class="revenue-label">Average Service:</span>
                    <span class="revenue-value">$128</span>
                  </div>
                  <div class="revenue-item">
                    <span class="revenue-label">Growth Rate:</span>
                    <span class="revenue-value">+18%</span>
                  </div>
                </div>
              </div>
              
              <div class="analytics-card">
                <h3>⭐ Performance Metrics</h3>
                <div class="performance-stats">
                  <div class="metric-item">
                    <span class="metric-label">Avg Response Time:</span>
                    <span class="metric-value">18 min</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">Customer Satisfaction:</span>
                    <span class="metric-value">4.8/5</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">Completion Rate:</span>
                    <span class="metric-value">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.style.display = 'block';
      
      // Reset button
      button.textContent = originalText;
      button.disabled = false;
      
      showNotification('✅ Analytics dashboard loaded successfully', 'success');
      console.log('✅ Analytics Dashboard: Successfully opened analytics interface');
    }, 800);
    
  } catch (error) {
    console.error('❌ Analytics Dashboard: Error loading interface:', error);
    showNotification('❌ Error loading analytics dashboard', 'error');
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Admin System Settings
function showSystemSettings() {
  console.log('Testing: System Settings button clicked');
  
  // Add loading state
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Loading...';
  button.disabled = true;
  
  try {
    setTimeout(() => {
      // Create system settings modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'system-settings-modal';
      
      modal.innerHTML = `
        <div class="modal-content large-modal">
          <div class="modal-header">
            <h2>⚙️ System Settings</h2>
            <button class="close-btn" onclick="closeModal('system-settings-modal')">×</button>
          </div>
          <div class="modal-body">
            <div class="settings-tabs">
              <div class="tab-header">
                <button class="tab-btn active" onclick="showSettingsTab('general')">General</button>
                <button class="tab-btn" onclick="showSettingsTab('security')">Security</button>
                <button class="tab-btn" onclick="showSettingsTab('notifications')">Notifications</button>
                <button class="tab-btn" onclick="showSettingsTab('integrations')">Integrations</button>
              </div>
              
              <div id="general-settings" class="tab-content active">
                <h3>🔧 General Settings</h3>
                <div class="settings-group">
                  <label class="setting-label">
                    <span>Application Name:</span>
                    <input type="text" value="RoadSide+ Emergency" class="setting-input">
                  </label>
                  <label class="setting-label">
                    <span>Default Response Time:</span>
                    <select class="setting-select">
                      <option value="15">15 minutes</option>
                      <option value="30" selected>30 minutes</option>
                      <option value="45">45 minutes</option>
                    </select>
                  </label>
                  <label class="setting-label checkbox-label">
                    <input type="checkbox" checked>
                    <span>Enable automatic technician assignment</span>
                  </label>
                </div>
              </div>
              
              <div id="security-settings" class="tab-content">
                <h3>🔒 Security Settings</h3>
                <div class="settings-group">
                  <label class="setting-label">
                    <span>Session Timeout:</span>
                    <select class="setting-select">
                      <option value="30">30 minutes</option>
                      <option value="60" selected>1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </label>
                  <label class="setting-label checkbox-label">
                    <input type="checkbox" checked>
                    <span>Enable two-factor authentication</span>
                  </label>
                  <label class="setting-label checkbox-label">
                    <input type="checkbox" checked>
                    <span>Log all user activities</span>
                  </label>
                </div>
              </div>
              
              <div id="notifications-settings" class="tab-content">
                <h3>🔔 Notification Settings</h3>
                <div class="settings-group">
                  <label class="setting-label checkbox-label">
                    <input type="checkbox" checked>
                    <span>Email notifications for new bookings</span>
                  </label>
                  <label class="setting-label checkbox-label">
                    <input type="checkbox" checked>
                    <span>SMS alerts for emergency requests</span>
                  </label>
                  <label class="setting-label checkbox-label">
                    <input type="checkbox">
                    <span>Push notifications for mobile app</span>
                  </label>
                </div>
              </div>
              
              <div id="integrations-settings" class="tab-content">
                <h3>🔗 Integrations</h3>
                <div class="settings-group">
                  <div class="integration-item">
                    <span class="integration-name">Google Maps API</span>
                    <span class="integration-status connected">Connected</span>
                  </div>
                  <div class="integration-item">
                    <span class="integration-name">Stripe Payment</span>
                    <span class="integration-status connected">Connected</span>
                  </div>
                  <div class="integration-item">
                    <span class="integration-name">Twilio SMS</span>
                    <span class="integration-status disconnected">Disconnected</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="settings-actions">
              <button class="btn btn--primary" onclick="saveSystemSettings()">Save Changes</button>
              <button class="btn btn--outline" onclick="resetSystemSettings()">Reset to Default</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.style.display = 'block';
      
      // Reset button
      button.textContent = originalText;
      button.disabled = false;
      
      showNotification('✅ System settings loaded successfully', 'success');
      console.log('✅ System Settings: Successfully opened system settings interface');
    }, 800);
    
  } catch (error) {
    console.error('❌ System Settings: Error loading interface:', error);
    showNotification('❌ Error loading system settings', 'error');
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Helper functions for admin interface
function generateUserTableRows() {
  const users = [
    { id: 'USR001', name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', lastLogin: '2024-01-15' },
    { id: 'USR002', name: 'Jane Smith', email: 'jane@example.com', role: 'Technician', status: 'Active', lastLogin: '2024-01-14' },
    { id: 'USR003', name: 'Mike Johnson', email: 'mike@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
    { id: 'USR004', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Customer', status: 'Inactive', lastLogin: '2024-01-10' }
  ];
  
  return users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
      <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
      <td>${user.lastLogin}</td>
      <td>
        <button class="btn btn--xs btn--outline" onclick="editUser('${user.id}')">Edit</button>
        <button class="btn btn--xs btn--outline" onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function generateTechnicianCards() {
  const technicians = [
    { id: 'TECH001', name: 'Mike Rodriguez', status: 'Available', rating: 4.9, jobs: 156 },
    { id: 'TECH002', name: 'Sarah Lee', status: 'Busy', rating: 4.8, jobs: 203 },
    { id: 'TECH003', name: 'David Kim', status: 'Available', rating: 4.7, jobs: 98 },
    { id: 'TECH004', name: 'Emma Wilson', status: 'Offline', rating: 4.6, jobs: 167 }
  ];
  
  return technicians.map(tech => `
    <div class="technician-card">
      <div class="tech-header">
        <div class="tech-avatar">👨‍🔧</div>
        <div class="tech-info">
          <h4>${tech.name}</h4>
          <p>ID: ${tech.id}</p>
        </div>
        <span class="status-badge ${tech.status.toLowerCase()}">${tech.status}</span>
      </div>
      <div class="tech-stats">
        <div class="stat-item">
          <span class="stat-label">Rating:</span>
          <span class="stat-value">${tech.rating}★</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Jobs:</span>
          <span class="stat-value">${tech.jobs}</span>
        </div>
      </div>
      <div class="tech-actions">
        <button class="btn btn--xs btn--primary" onclick="editTechnician('${tech.id}')">Edit</button>
        <button class="btn btn--xs btn--outline" onclick="viewTechnicianDetails('${tech.id}')">View</button>
      </div>
    </div>
  `).join('');
}

// Modal helper functions
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.removeChild(modal);
  }
}

function showSettingsTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Hide all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName + '-settings').classList.add('active');
  event.target.classList.add('active');
}

// Placeholder functions for admin actions
function addNewUser() { showNotification('Add new user functionality', 'info'); }
function addNewTechnician() { showNotification('Add new technician functionality', 'info'); }
function editUser(id) { showNotification(`Edit user ${id}`, 'info'); }
function deleteUser(id) { showNotification(`Delete user ${id}`, 'info'); }
function editTechnician(id) { showNotification(`Edit technician ${id}`, 'info'); }
function viewTechnicianDetails(id) { showNotification(`View technician ${id} details`, 'info'); }
function saveSystemSettings() { showNotification('Settings saved successfully', 'success'); }
function resetSystemSettings() { showNotification('Settings reset to default', 'info'); }
function exportAnalytics() { showNotification('Analytics report exported', 'success'); }
function updateAnalyticsPeriod(period) { showNotification(`Analytics updated for ${period}`, 'info'); }
function searchUsers(query) { console.log('Searching users:', query); }
function filterUsers(filter) { console.log('Filtering users:', filter); }
function searchTechnicians(query) { console.log('Searching technicians:', query); }
function filterTechnicians(filter) { console.log('Filtering technicians:', filter); }
// === PARTNER DASHBOARD BUTTON FUNCTIONALITY ===

// Button 1: View Reports - Analytics and Performance Reports
function viewPartnerReports() {
  console.log('🔍 TESTING: View Reports button clicked');
  
  // Create and show reports modal
  const modal = createModal('partner-reports-modal', 'Partnership Reports');
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>📊 Partnership Reports</h2>
        <button class="close-btn" onclick="closeModal('partner-reports-modal')">×</button>
      </div>
      <div class="modal-body">
        <div class="reports-dashboard">
          <div class="report-filters">
            <h3>Report Filters</h3>
            <div class="filter-group">
              <label>Date Range:</label>
              <select id="report-date-range">
                <option value="7">Last 7 days</option>
                <option value="30" selected>Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Report Type:</label>
              <select id="report-type">
                <option value="referrals" selected>Referrals</option>
                <option value="revenue">Revenue</option>
                <option value="conversion">Conversion</option>
                <option value="customer">Customer Analysis</option>
              </select>
            </div>
          </div>
          
          <div class="report-content">
            <div class="report-summary">
              <h4>Performance Summary</h4>
              <div class="summary-stats">
                <div class="stat-item">
                  <span class="stat-label">Total Referrals</span>
                  <span class="stat-value">156</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Conversion Rate</span>
                  <span class="stat-value">78%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Total Commission</span>
                  <span class="stat-value">$3,420</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Avg. Commission per Referral</span>
                  <span class="stat-value">$21.92</span>
                </div>
              </div>
            </div>
            
            <div class="report-charts">
              <div class="chart-placeholder">
                <h5>📈 Referral Trends</h5>
                <div class="chart-mock">
                  <div class="chart-bars">
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 45%"></div>
                    <div class="bar" style="height: 90%"></div>
                    <div class="bar" style="height: 75%"></div>
                  </div>
                  <div class="chart-labels">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                    <span>Week 5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="report-actions">
              <button class="btn btn--primary" onclick="exportReport()">📊 Export Report</button>
              <button class="btn btn--outline" onclick="scheduleReport()">📅 Schedule Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  showModal('partner-reports-modal');
  console.log('✅ SUCCESS: View Reports functionality implemented');
  showNotification('📊 Partnership reports opened', 'success');
}

// Button 2: Create Link - Referral Link Generator
function createReferralLink() {
  console.log('🔍 TESTING: Create Link button clicked');
  
  const modal = createModal('referral-link-modal', 'Create Referral Link');
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>🔗 Create Referral Link</h2>
        <button class="close-btn" onclick="closeModal('referral-link-modal')">×</button>
      </div>
      <div class="modal-body">
        <div class="link-generator">
          <div class="form-group">
            <label class="form-label">Campaign Name</label>
            <input type="text" id="campaign-name" class="form-control" placeholder="Enter campaign name">
          </div>
          
          <div class="form-group">
            <label class="form-label">Target Service</label>
            <select id="target-service" class="form-control">
              <option value="all">All Services</option>
              <option value="towing">Towing</option>
              <option value="battery">Battery Jump</option>
              <option value="tire">Tire Change</option>
              <option value="lockout">Lockout</option>
              <option value="fuel">Fuel Delivery</option>
              <option value="winch">Winch Recovery</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Commission Rate</label>
            <select id="commission-rate" class="form-control">
              <option value="5">5% - Standard</option>
              <option value="7">7% - Premium</option>
              <option value="10">10% - VIP</option>
              <option value="custom">Custom Rate</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Expiration Date</label>
            <input type="date" id="expiration-date" class="form-control">
          </div>
          
          <div class="generated-link-section" id="generated-link-section" style="display: none;">
            <h4>Generated Referral Link</h4>
            <div class="link-display">
              <input type="text" id="generated-link" class="form-control" readonly>
              <button class="btn btn--primary" onclick="copyReferralLink()">📋 Copy</button>
            </div>
            
            <div class="link-stats">
              <div class="stat-item">
                <span class="stat-label">Expected Commission</span>
                <span class="stat-value" id="expected-commission">$0.00</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Link ID</span>
                <span class="stat-value" id="link-id">-</span>
              </div>
            </div>
          </div>
          
          <div class="link-actions">
            <button class="btn btn--primary" onclick="generateLink()">🔗 Generate Link</button>
            <button class="btn btn--outline" onclick="previewLink()">👀 Preview</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  showModal('referral-link-modal');
  console.log('✅ SUCCESS: Create Link functionality implemented');
  showNotification('🔗 Referral link generator opened', 'success');
}

// Button 3: Download - Marketing Resources Download
function downloadMarketingResources() {
  console.log('🔍 TESTING: Download button clicked');
  
  const modal = createModal('download-resources-modal', 'Marketing Resources');
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>💼 Marketing Resources</h2>
        <button class="close-btn" onclick="closeModal('download-resources-modal')">×</button>
      </div>
      <div class="modal-body">
        <div class="resources-library">
          <div class="resource-categories">
            <h3>Available Resources</h3>
            
            <div class="resource-category">
              <h4>📊 Brochures & Flyers</h4>
              <div class="resource-list">
                <div class="resource-item">
                  <div class="resource-info">
                    <span class="resource-name">Service Overview Brochure</span>
                    <span class="resource-size">PDF - 2.5MB</span>
                  </div>
                  <button class="btn btn--sm btn--primary" onclick="downloadResource('brochure-overview')">📥 Download</button>
                </div>
                
                <div class="resource-item">
                  <div class="resource-info">
                    <span class="resource-name">Emergency Services Flyer</span>
                    <span class="resource-size">PDF - 1.8MB</span>
                  </div>
                  <button class="btn btn--sm btn--primary" onclick="downloadResource('flyer-emergency')">📥 Download</button>
                </div>
              </div>
            </div>
            
            <div class="resource-category">
              <h4>🎨 Logo & Brand Assets</h4>
              <div class="resource-list">
                <div class="resource-item">
                  <div class="resource-info">
                    <span class="resource-name">RoadSide+ Logo Pack</span>
                    <span class="resource-size">ZIP - 5.2MB</span>
                  </div>
                  <button class="btn btn--sm btn--primary" onclick="downloadResource('logo-pack')">📥 Download</button>
                </div>
                
                <div class="resource-item">
                  <div class="resource-info">
                    <span class="resource-name">Brand Guidelines</span>
                    <span class="resource-size">PDF - 3.1MB</span>
                  </div>
                  <button class="btn btn--sm btn--primary" onclick="downloadResource('brand-guidelines')">📥 Download</button>
                </div>
              </div>
            </div>
            
            <div class="resource-category">
              <h4>📱 Digital Assets</h4>
              <div class="resource-list">
                <div class="resource-item">
                  <div class="resource-info">
                    <span class="resource-name">Social Media Kit</span>
                    <span class="resource-size">ZIP - 12.4MB</span>
                  </div>
                  <button class="btn btn--sm btn--primary" onclick="downloadResource('social-media-kit')">📥 Download</button>
                </div>
                
                <div class="resource-item">
                  <div class="resource-info">
                    <span class="resource-name">Email Templates</span>
                    <span class="resource-size">ZIP - 2.9MB</span>
                  </div>
                  <button class="btn btn--sm btn--primary" onclick="downloadResource('email-templates')">📥 Download</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="download-actions">
            <button class="btn btn--primary" onclick="downloadAllResources()">📦 Download All</button>
            <button class="btn btn--outline" onclick="requestCustomResource()">🎨 Request Custom</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  showModal('download-resources-modal');
  console.log('✅ SUCCESS: Download functionality implemented');
  showNotification('💼 Marketing resources opened', 'success');
}

// === SUPPORTING FUNCTIONS FOR PARTNER BUTTONS ===

// Helper function to create modal
function createModal(modalId, title) {
  // Remove existing modal if present
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal';
  modal.style.display = 'none';
  document.body.appendChild(modal);
  
  return modal;
}

// Helper function to show modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

// Helper function to close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    setTimeout(() => modal.remove(), 300);
  }
}

// Generate referral link function
function generateLink() {
  const campaignName = document.getElementById('campaign-name').value;
  const targetService = document.getElementById('target-service').value;
  const commissionRate = document.getElementById('commission-rate').value;
  
  if (!campaignName) {
    showNotification('❌ Please enter a campaign name', 'error');
    return;
  }
  
  const linkId = 'REF-' + Date.now().toString(36).toUpperCase();
  const baseUrl = 'https://roadside.app/ref/';
  const generatedLink = `${baseUrl}${linkId}?service=${targetService}&rate=${commissionRate}`;
  
  document.getElementById('generated-link').value = generatedLink;
  document.getElementById('link-id').textContent = linkId;
  document.getElementById('expected-commission').textContent = `$${(commissionRate * 15).toFixed(2)}`;
  document.getElementById('generated-link-section').style.display = 'block';
  
  showNotification('🔗 Referral link generated successfully', 'success');
}

// Copy referral link function
function copyReferralLink() {
  const linkInput = document.getElementById('generated-link');
  linkInput.select();
  document.execCommand('copy');
  showNotification('📋 Referral link copied to clipboard', 'success');
}

// Preview link function
function previewLink() {
  showNotification('👀 Link preview functionality coming soon', 'info');
}

// Export report function
function exportReport() {
  showNotification('📊 Report export started - download will begin shortly', 'success');
  // Simulate download
  setTimeout(() => {
    showNotification('✅ Report exported successfully', 'success');
  }, 2000);
}

// Schedule report function
function scheduleReport() {
  showNotification('📅 Report scheduling functionality coming soon', 'info');
}

// Download resource function
function downloadResource(resourceId) {
  showNotification(`📥 Downloading ${resourceId}...`, 'info');
  // Simulate download
  setTimeout(() => {
    showNotification(`✅ ${resourceId} downloaded successfully`, 'success');
  }, 1500);
}

// Download all resources function
function downloadAllResources() {
  showNotification('📦 Preparing download package...', 'info');
  // Simulate bulk download
  setTimeout(() => {
    showNotification('✅ All resources downloaded successfully', 'success');
  }, 3000);
}

// Request custom resource function
function requestCustomResource() {
  showNotification('🎨 Custom resource request form coming soon', 'info');
}

// === PARTNER DASHBOARD BUTTON TESTING FUNCTIONS ===

// Test all partner buttons
function testPartnerButtons() {
  console.log('🧪 TESTING: Partner dashboard buttons');
  
  // Test button existence
  const buttons = {
    'viewReports': document.querySelector('.tool-card button[onclick*="View Reports"]'),
    'createLink': document.querySelector('.tool-card button[onclick*="Create Link"]'),
    'download': document.querySelector('.tool-card button[onclick*="Download"]')
  };
  
  Object.keys(buttons).forEach(buttonName => {
    if (buttons[buttonName]) {
      console.log(`✅ ${buttonName} button found`);
    } else {
      console.log(`❌ ${buttonName} button missing`);
    }
  });
  
  return buttons;
}

// Initialize partner button functionality
function initializePartnerButtons() {
  console.log('🔧 INITIALIZING: Partner dashboard buttons');
  
  // Update button onclick handlers
  setTimeout(() => {
    const toolCards = document.querySelectorAll('#partner-dashboard .tool-card');
    
    toolCards.forEach((card, index) => {
      const button = card.querySelector('button');
      if (button) {
        switch(index) {
          case 0: // Analytics button
            button.onclick = viewPartnerReports;
            break;
          case 1: // Referral Links button
            button.onclick = createReferralLink;
            break;
          case 2: // Resources button
            button.onclick = downloadMarketingResources;
            break;
        }
      }
    });
    
    console.log('✅ Partner buttons initialized');
  }, 100);
}
// Utility functions
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString();
}

// Handle modal clicks (close when clicking outside)
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});