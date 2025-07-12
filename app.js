// RoadSide+ Emergency App - Main Application JavaScript

// Global variables
let currentUser = null;
let currentView = 'dashboard';
let serviceHistory = [];
let currentBooking = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
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
            id: 'user123'
        };
        
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        showSuccess('Welcome back, ' + currentUser.name + '!');
    } else {
        showError('Please enter email and password');
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
        timestamp: new Date()
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
    }
}

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
        // Add to service history
        serviceHistory.unshift({
            id: 'RS-' + Date.now(),
            service: currentBooking.serviceName,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: 'In Progress',
            price: currentBooking.servicePrice,
            rating: null
        });
        
        // Update display
        loadServiceHistory();
        updateStats();
        
        // Close modal and show tracking
        closeBookingModal();
        showModal('tracking-modal');
        
        showSuccess('Booking confirmed! Technician is being assigned.');
        
        // Simulate technician assignment
        setTimeout(() => {
            showNotification('Technician assigned! Mike Rodriguez is on the way.');
        }, 3000);
    }
}

function callTechnician() {
    showNotification('Calling technician...');
    // In real app, this would initiate a phone call
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
    showNotification('User management interface would open here');
}

function manageTechnicians() {
    showNotification('Technician management interface would open here');
}

function viewAnalytics() {
    showNotification('Analytics dashboard would open here');
}

function systemSettings() {
    showNotification('System settings would open here');
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