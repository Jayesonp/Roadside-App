// RoadSide+ Fully Functional App

// Application State Management
class RoadSideApp {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('roadside_user')) || {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            memberSince: '2023-01-15',
            isLoggedIn: true
        };
        this.currentDashboard = 'customer';
        this.currentView = 'dashboard';
        this.serviceHistory = JSON.parse(localStorage.getItem('roadside_history')) || [];
        this.supportTickets = JSON.parse(localStorage.getItem('roadside_tickets')) || [];
        this.currentBooking = null;
        this.sosActive = false;
        
        this.init();
    }

    init() {
        // Fix loading sequence
        this.showLoadingScreen();
        
        // Simulate loading time then show app
        setTimeout(() => {
            this.hideLoadingScreen();
            
            // Always show main app for demo (skip login)
            this.showMainApp();
            this.setupEventListeners();
            this.loadUserData();
            this.updateUI();
        }, 1500);
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'none';
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
    }

    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    setupEventListeners() {
        // Navigation event listeners
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) this.showView(view);
            });
        });

        // Service card event listeners
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const serviceId = e.currentTarget.dataset.service;
                if (serviceId) this.selectService(serviceId);
            });
        });

        // Modal close event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    loadUserData() {
        // Load user-specific data
        this.updateUserInfo();
        this.loadServiceHistory();
        this.loadSupportTickets();
    }

    updateUI() {
        this.showView(this.currentView);
        this.showDashboard(this.currentDashboard);
    }

    // User Management
    updateUserInfo() {
        const userNameElements = document.querySelectorAll('.user-name');
        const userAvatarElements = document.querySelectorAll('.user-avatar');
        
        userNameElements.forEach(el => el.textContent = this.currentUser.name);
        userAvatarElements.forEach(el => {
            el.textContent = this.currentUser.name.split(' ').map(n => n[0]).join('');
        });
    }

    login(email, password) {
        // Simulate login process
        this.currentUser = {
            id: '1',
            name: 'John Doe',
            email: email,
            phone: '+1 (555) 123-4567',
            memberSince: '2023-01-15',
            isLoggedIn: true
        };
        
        localStorage.setItem('roadside_user', JSON.stringify(this.currentUser));
        this.showMainApp();
        this.updateUserInfo();
        this.showToast('Login successful!', 'success');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('roadside_user');
        this.showLoginScreen();
        this.showToast('Logged out successfully', 'info');
    }

    // Navigation
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        this.currentView = viewName;
        this.updateViewContent(viewName);
    }

    updateViewContent(viewName) {
        switch(viewName) {
            case 'dashboard':
                this.updateDashboardContent();
                break;
            case 'history':
                this.updateHistoryView();
                break;
            case 'profile':
                this.updateProfileView();
                break;
            case 'support':
                this.updateSupportView();
                break;
        }
    }

    // Dashboard Management
    showDashboard(dashboardType) {
        this.currentDashboard = dashboardType;
        
        // Update dashboard tabs
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-dashboard="${dashboardType}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        this.updateDashboardContent();
        this.showToast(`Switched to ${dashboardType} dashboard`, 'info');
    }

    updateDashboardContent() {
        const dashboardContainer = document.getElementById('dashboard-content');
        if (!dashboardContainer) return;

        let content = '';
        switch(this.currentDashboard) {
            case 'customer':
                content = this.getCustomerDashboard();
                break;
            case 'technician':
                content = this.getTechnicianDashboard();
                break;
            case 'admin':
                content = this.getAdminDashboard();
                break;
            default:
                content = this.getCustomerDashboard();
        }

        dashboardContainer.innerHTML = content;
        this.setupDashboardEventListeners();
    }

    setupDashboardEventListeners() {
        // Re-attach event listeners for dynamically created content
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const serviceId = e.currentTarget.dataset.service;
                if (serviceId) this.selectService(serviceId);
            });
        });
    }

    getCustomerDashboard() {
        return `
            <div class="emergency-banner">
                <div class="emergency-content">
                    <span class="emergency-icon">🚨</span>
                    <div class="emergency-text">
                        <h3>Emergency Assistance</h3>
                        <p>24/7 immediate response</p>
                    </div>
                    <button class="emergency-btn" onclick="app.emergencyCall()">SOS</button>
                </div>
            </div>

            <div class="services-section">
                <h2>Select Service</h2>
                <div class="services-grid">
                    <div class="service-card" data-service="1">
                        <div class="service-icon">🚛</div>
                        <h3>Towing</h3>
                        <p class="service-price">$150</p>
                        <p class="service-time">45 min • 30 min response</p>
                    </div>
                    <div class="service-card" data-service="2">
                        <div class="service-icon">🔋</div>
                        <h3>Battery Jump</h3>
                        <p class="service-price">$75</p>
                        <p class="service-time">20 min • 30 min response</p>
                    </div>
                    <div class="service-card" data-service="3">
                        <div class="service-icon">🛞</div>
                        <h3>Tire Change</h3>
                        <p class="service-price">$100</p>
                        <p class="service-time">30 min • 30 min response</p>
                    </div>
                    <div class="service-card" data-service="4">
                        <div class="service-icon">🔓</div>
                        <h3>Lockout</h3>
                        <p class="service-price">$85</p>
                        <p class="service-time">20 min • 30 min response</p>
                    </div>
                    <div class="service-card" data-service="5">
                        <div class="service-icon">⛽</div>
                        <h3>Fuel Delivery</h3>
                        <p class="service-price">$60</p>
                        <p class="service-time">15 min • 30 min response</p>
                    </div>
                    <div class="service-card" data-service="6">
                        <div class="service-icon">🪝</div>
                        <h3>Winch Recovery</h3>
                        <p class="service-price">$200</p>
                        <p class="service-time">60 min • 45 min response</p>
                    </div>
                </div>
            </div>

            <div class="recent-section">
                <h2>Recent Services</h2>
                <div id="recent-services" class="service-history">
                    ${this.getRecentServicesHTML()}
                </div>
            </div>

            <div class="stats-section">
                <h2>Your Stats</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">${this.serviceHistory.length}</div>
                        <div class="stat-label">Total Services</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$${this.getTotalSpent()}</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">${this.getAverageRating()}</div>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                </div>
            </div>
        `;
    }

    getTechnicianDashboard() {
        return `
            <div class="dashboard-header">
                <h1>🔧 Technician Dashboard</h1>
                <p>Manage your service assignments</p>
            </div>

            <div class="stats-section">
                <h2>Today's Overview</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">8</div>
                        <div class="stat-label">Active Jobs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-value">15</div>
                        <div class="stat-label">Completed Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.9</div>
                        <div class="stat-label">Rating</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$1,250</div>
                        <div class="stat-label">Earnings Today</div>
                    </div>
                </div>
            </div>

            <div class="assignments-section">
                <h2>Current Assignments</h2>
                <div class="assignment-list">
                    <div class="assignment-card urgent">
                        <div class="assignment-header">
                            <span class="service-type">🚛 Towing</span>
                            <span class="priority high">HIGH PRIORITY</span>
                        </div>
                        <div class="assignment-details">
                            <p><strong>Location:</strong> Highway 101, Mile 42</p>
                            <p><strong>Customer:</strong> Sarah Johnson</p>
                            <p><strong>Issue:</strong> Engine failure, needs towing</p>
                            <p><strong>ETA:</strong> 12 minutes</p>
                        </div>
                        <div class="assignment-actions">
                            <button class="btn btn--primary btn--sm" onclick="app.acceptJob('job-001')">Accept</button>
                            <button class="btn btn--outline btn--sm" onclick="app.callCustomer('555-0123')">📞 Call</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAdminDashboard() {
        return `
            <div class="dashboard-header">
                <h1>⚙️ Admin Dashboard</h1>
                <p>System management and analytics</p>
            </div>

            <div class="stats-section">
                <h2>System Overview</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Active Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔧</div>
                        <div class="stat-value">89</div>
                        <div class="stat-label">Active Technicians</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">342</div>
                        <div class="stat-label">Services Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$45,680</div>
                        <div class="stat-label">Revenue Today</div>
                    </div>
                </div>
            </div>

            <div class="admin-controls">
                <h2>System Controls</h2>
                <div class="control-grid">
                    <div class="control-card" onclick="app.openSystemControl('user-management')">
                        <div class="control-icon">👤</div>
                        <h3>User Management</h3>
                        <p>Manage customer accounts and permissions</p>
                    </div>
                    <div class="control-card" onclick="app.openSystemControl('technician-management')">
                        <div class="control-icon">🔧</div>
                        <h3>Technician Management</h3>
                        <p>Monitor and assign technician resources</p>
                    </div>
                    <div class="control-card" onclick="app.openSystemControl('analytics')">
                        <div class="control-icon">📈</div>
                        <h3>Analytics</h3>
                        <p>View detailed system performance metrics</p>
                    </div>
                    <div class="control-card" onclick="app.openSystemControl('system-settings')">
                        <div class="control-icon">⚙️</div>
                        <h3>System Settings</h3>
                        <p>Configure system parameters and features</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Service Management
    selectService(serviceId) {
        const services = {
            1: { id: 1, name: 'Towing', price: 150, icon: '🚛', estimatedTime: 45 },
            2: { id: 2, name: 'Battery Jump', price: 75, icon: '🔋', estimatedTime: 20 },
            3: { id: 3, name: 'Tire Change', price: 100, icon: '🛞', estimatedTime: 30 },
            4: { id: 4, name: 'Lockout', price: 85, icon: '🔓', estimatedTime: 20 },
            5: { id: 5, name: 'Fuel Delivery', price: 60, icon: '⛽', estimatedTime: 25 },
            6: { id: 6, name: 'Winch Recovery', price: 200, icon: '🪝', estimatedTime: 60 }
        };

        const service = services[serviceId];
        if (!service) return;

        this.currentBooking = {
            service: service,
            step: 1,
            details: {},
            estimatedCost: service.price
        };

        this.openBookingModal();
    }

    openBookingModal() {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.updateBookingModal();
        }
    }

    closeBookingModal() {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentBooking = null;
    }

    updateBookingModal() {
        if (!this.currentBooking) return;

        const booking = this.currentBooking;
        
        // Update service display
        const serviceIcon = document.getElementById('selected-service-icon');
        const serviceName = document.getElementById('selected-service-name');
        const servicePrice = document.getElementById('selected-service-price');
        
        if (serviceIcon) serviceIcon.textContent = booking.service.icon;
        if (serviceName) serviceName.textContent = booking.service.name;
        if (servicePrice) servicePrice.textContent = `$${booking.service.price}`;

        // Update steps
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStep = document.getElementById(`booking-step-${booking.step}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    nextBookingStep() {
        if (!this.currentBooking) return;

        if (this.currentBooking.step < 4) {
            this.currentBooking.step++;
            this.updateBookingModal();
        }
    }

    confirmBooking() {
        if (!this.currentBooking) return;

        const serviceRecord = {
            id: this.generateId('service'),
            type: this.currentBooking.service.name,
            date: new Date().toISOString(),
            location: 'Current Location',
            status: 'in_progress',
            technician: 'Mike Rodriguez',
            cost: this.currentBooking.estimatedCost,
            rating: 0,
            duration: `${this.currentBooking.service.estimatedTime} min`
        };

        this.serviceHistory.unshift(serviceRecord);
        this.saveServiceHistory();
        this.closeBookingModal();
        this.showToast('Service booked successfully!', 'success');
        
        // Start tracking
        setTimeout(() => {
            this.openTrackingModal(serviceRecord);
        }, 500);
    }

    // Service History
    loadServiceHistory() {
        this.serviceHistory = JSON.parse(localStorage.getItem('roadside_history')) || [
            {
                id: 'service-001',
                type: 'Battery Jump',
                date: '2024-07-10T14:30:00Z',
                location: 'Main St & 5th Ave',
                status: 'completed',
                technician: 'Mike Rodriguez',
                cost: 75,
                rating: 5,
                duration: '20 min'
            },
            {
                id: 'service-002',
                type: 'Tire Change',
                date: '2024-07-08T09:15:00Z',
                location: 'Highway 101, Mile 42',
                status: 'completed',
                technician: 'Sarah Johnson',
                cost: 100,
                rating: 5,
                duration: '35 min'
            }
        ];
    }

    saveServiceHistory() {
        localStorage.setItem('roadside_history', JSON.stringify(this.serviceHistory));
    }

    updateHistoryView() {
        const historyContainer = document.getElementById('service-history-list');
        if (!historyContainer) return;

        if (this.serviceHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>No Service History</h3>
                    <p>Your service history will appear here</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = this.serviceHistory.map(service => `
            <div class="history-card" onclick="app.viewServiceDetails('${service.id}')">
                <div class="history-header">
                    <div class="service-type">
                        <span class="service-icon">${this.getServiceIcon(service.type)}</span>
                        <span>${service.type}</span>
                    </div>
                    <span class="status status--${service.status === 'completed' ? 'success' : 'info'}">${service.status}</span>
                </div>
                <div class="history-details">
                    <p><strong>Date:</strong> ${this.formatDate(service.date)}</p>
                    <p><strong>Location:</strong> ${service.location}</p>
                    <p><strong>Technician:</strong> ${service.technician}</p>
                    <p><strong>Cost:</strong> $${service.cost}</p>
                    ${service.rating > 0 ? `<div class="rating">${'⭐'.repeat(service.rating)} (${service.rating}/5)</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    getRecentServicesHTML() {
        const recentServices = this.serviceHistory.slice(0, 3);
        if (recentServices.length === 0) {
            return '<p>No recent services</p>';
        }

        return recentServices.map(service => `
            <div class="service-item">
                <div class="service-icon">${this.getServiceIcon(service.type)}</div>
                <div class="service-details">
                    <h4>${service.type}</h4>
                    <p>${this.formatDate(service.date)}</p>
                    <p class="location">${service.location}</p>
                </div>
                <div class="service-status">
                    <span class="status status--success">Completed</span>
                    <div class="rating">${'⭐'.repeat(service.rating || 5)}</div>
                </div>
            </div>
        `).join('');
    }

    // Support System
    loadSupportTickets() {
        this.supportTickets = JSON.parse(localStorage.getItem('roadside_tickets')) || [
            {
                id: 'ticket-001',
                subject: 'Billing Question',
                status: 'resolved',
                date: '2024-07-09T10:30:00Z',
                messages: [
                    { sender: 'user', message: 'I have a question about my last service charge.', timestamp: '2024-07-09T10:30:00Z' },
                    { sender: 'support', message: 'Hi! I\'d be happy to help with your billing question.', timestamp: '2024-07-09T10:35:00Z' }
                ]
            }
        ];
    }

    updateSupportView() {
        const ticketsContainer = document.getElementById('support-tickets');
        if (!ticketsContainer) return;

        if (this.supportTickets.length === 0) {
            ticketsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <h3>No Support Tickets</h3>
                    <p>Your support conversations will appear here</p>
                </div>
            `;
        } else {
            ticketsContainer.innerHTML = this.supportTickets.map(ticket => `
                <div class="support-ticket" onclick="app.openSupportChat('${ticket.id}')">
                    <div class="ticket-header">
                        <h4>${ticket.subject}</h4>
                        <span class="status status--${ticket.status === 'resolved' ? 'success' : 'info'}">${ticket.status}</span>
                    </div>
                    <div class="ticket-preview">
                        <p>${ticket.messages[ticket.messages.length - 1].message}</p>
                        <span class="ticket-date">${this.formatDate(ticket.date)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Profile Management
    updateProfileView() {
        const user = this.currentUser;
        
        // Update profile form fields
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profilePhone = document.getElementById('profile-phone');
        
        if (profileName) profileName.value = user.name;
        if (profileEmail) profileEmail.value = user.email;
        if (profilePhone) profilePhone.value = user.phone;

        // Update stats display
        const totalServices = document.getElementById('profile-total-services');
        const totalSpent = document.getElementById('profile-total-spent');
        const memberSince = document.getElementById('profile-member-since');
        
        if (totalServices) totalServices.textContent = this.serviceHistory.length;
        if (totalSpent) totalSpent.textContent = `$${this.getTotalSpent()}`;
        if (memberSince) memberSince.textContent = this.formatDate(user.memberSince);
    }

    saveProfile() {
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profilePhone = document.getElementById('profile-phone');

        if (profileName) this.currentUser.name = profileName.value;
        if (profileEmail) this.currentUser.email = profileEmail.value;
        if (profilePhone) this.currentUser.phone = profilePhone.value;

        localStorage.setItem('roadside_user', JSON.stringify(this.currentUser));
        this.updateUserInfo();
        this.showToast('Profile updated successfully', 'success');
    }

    // Emergency SOS
    emergencyCall() {
        if (this.sosActive) {
            this.cancelSOS();
            return;
        }

        this.sosActive = true;
        this.openSOSModal();
    }

    openSOSModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'sos-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content sos-modal">
                <div class="sos-header">
                    <div class="sos-icon">🚨</div>
                    <h2>EMERGENCY SOS ACTIVATED</h2>
                    <p>Emergency services have been notified</p>
                </div>
                <div class="sos-body">
                    <div class="sos-countdown">
                        <div class="countdown-circle">
                            <span id="countdown-number">30</span>
                        </div>
                        <p>Emergency dispatch in <span id="countdown-text">30</span> seconds</p>
                    </div>
                    <div class="sos-actions">
                        <button onclick="app.cancelSOS()" class="btn btn--outline btn--full-width">Cancel Emergency</button>
                        <button onclick="app.immediateDispatch()" class="btn btn--primary btn--full-width">Dispatch Now</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.startSOSCountdown();
    }

    startSOSCountdown() {
        let countdown = 30;
        const countdownNumber = document.getElementById('countdown-number');
        const countdownText = document.getElementById('countdown-text');
        
        this.sosInterval = setInterval(() => {
            countdown--;
            if (countdownNumber) countdownNumber.textContent = countdown;
            if (countdownText) countdownText.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(this.sosInterval);
                this.dispatchEmergency();
            }
        }, 1000);
    }

    cancelSOS() {
        this.sosActive = false;
        
        if (this.sosInterval) {
            clearInterval(this.sosInterval);
        }
        
        const modal = document.getElementById('sos-modal');
        if (modal) {
            modal.remove();
        }
        
        this.showToast('Emergency SOS cancelled', 'info');
    }

    immediateDispatch() {
        if (this.sosInterval) {
            clearInterval(this.sosInterval);
        }
        this.dispatchEmergency();
    }

    dispatchEmergency() {
        const modal = document.getElementById('sos-modal');
        if (modal) {
            modal.innerHTML = `
                <div class="modal-content sos-modal">
                    <div class="sos-header success">
                        <div class="sos-icon">✅</div>
                        <h2>EMERGENCY DISPATCHED</h2>
                        <p>Help is on the way</p>
                    </div>
                    <div class="sos-body">
                        <div class="dispatch-info">
                            <h3>Emergency Services Notified</h3>
                            <ul>
                                <li>🚓 Police ETA: 8 minutes</li>
                                <li>🚑 Medical ETA: 12 minutes</li>
                                <li>🚒 Fire Department on standby</li>
                            </ul>
                            <p><strong>Incident ID:</strong> EMG-${Date.now()}</p>
                        </div>
                        <button onclick="app.closeEmergencyModal()" class="btn btn--primary btn--full-width">Close</button>
                    </div>
                </div>
            `;
        }
        
        // Add to service history
        const emergencyService = {
            id: this.generateId('emergency'),
            type: 'Emergency SOS',
            date: new Date().toISOString(),
            location: 'Current GPS Location',
            status: 'in_progress',
            technician: 'Emergency Services',
            cost: 0,
            rating: 0,
            duration: 'Active'
        };
        
        this.serviceHistory.unshift(emergencyService);
        this.saveServiceHistory();
    }

    closeEmergencyModal() {
        this.sosActive = false;
        const modal = document.getElementById('sos-modal');
        if (modal) {
            modal.remove();
        }
    }

    // System Controls (Admin)
    openSystemControl(controlType) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'system-control-modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content system-control-modal">
                <div class="modal-header">
                    <h2 id="system-control-title">${this.getControlTitle(controlType)}</h2>
                    <button class="close-btn" onclick="app.closeSystemControlModal()">×</button>
                </div>
                <div class="modal-body">
                    <div id="system-control-content">
                        ${this.getControlContent(controlType)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getControlTitle(controlType) {
        const titles = {
            'user-management': '👤 User Management System',
            'technician-management': '🔧 Technician Management System', 
            'analytics': '📈 System Analytics Dashboard',
            'system-settings': '⚙️ System Settings & Configuration'
        };
        return titles[controlType] || 'System Control';
    }

    getControlContent(controlType) {
        switch(controlType) {
            case 'user-management':
                return this.getUserManagementContent();
            case 'technician-management':
                return this.getTechnicianManagementContent();
            case 'analytics':
                return this.getAnalyticsContent();
            case 'system-settings':
                return this.getSystemSettingsContent();
            default:
                return '<p>Control panel content loading...</p>';
        }
    }

    getUserManagementContent() {
        return `
            <div class="control-panel">
                <div class="control-tabs">
                    <div class="control-tab active" onclick="showControlTab('users-overview')">Overview</div>
                    <div class="control-tab" onclick="showControlTab('users-accounts')">User Accounts</div>
                    <div class="control-tab" onclick="showControlTab('users-permissions')">Permissions</div>
                </div>
                
                <div id="users-overview" class="control-content active">
                    <div class="overview-stats">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-details">
                                <h3>Total Users</h3>
                                <div class="stat-value">2,847</div>
                                <div class="stat-change positive">+12.5% this month</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">✅</div>
                            <div class="stat-details">
                                <h3>Active Users</h3>
                                <div class="stat-value">2,156</div>
                                <div class="stat-change positive">+8.3% this week</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="users-accounts" class="control-content">
                    <div class="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>john@email.com</td>
                                    <td><span class="status-badge active">Active</span></td>
                                    <td>
                                        <button class="btn-icon">✏️</button>
                                        <button class="btn-icon">👁️</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="users-permissions" class="control-content">
                    <div class="permissions-grid">
                        <div class="permission-group">
                            <h3>Customer Permissions</h3>
                            <div class="permission-list">
                                <label class="permission-item">
                                    <input type="checkbox" checked> Book Services
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" checked> View History
                                </label>
                                <label class="permission-item">
                                    <input type="checkbox" checked> Emergency SOS
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTechnicianManagementContent() {
        return `
            <div class="control-panel">
                <h3>Technician Management</h3>
                <p>Manage technician assignments and performance</p>
                <div class="tech-stats">
                    <div class="stat-card">
                        <h4>47</h4>
                        <p>Total Technicians</p>
                    </div>
                    <div class="stat-card">
                        <h4>32</h4>
                        <p>Online Now</p>
                    </div>
                    <div class="stat-card">
                        <h4>18</h4>
                        <p>Active Jobs</p>
                    </div>
                </div>
            </div>
        `;
    }

    getAnalyticsContent() {
        return `
            <div class="control-panel">
                <h3>System Analytics</h3>
                <div class="analytics-grid">
                    <div class="metric-card">
                        <h4>$234,567</h4>
                        <p>Total Revenue</p>
                        <span class="trend up">+15.2%</span>
                    </div>
                    <div class="metric-card">
                        <h4>1,847</h4>
                        <p>Services Completed</p>
                        <span class="trend up">+8.7%</span>
                    </div>
                    <div class="metric-card">
                        <h4>4.8/5.0</h4>
                        <p>Customer Satisfaction</p>
                        <span class="trend up">+0.1</span>
                    </div>
                </div>
            </div>
        `;
    }

    getSystemSettingsContent() {
        return `
            <div class="control-panel">
                <h3>System Settings</h3>
                <div class="settings-section">
                    <div class="setting-group">
                        <label>System Name</label>
                        <input type="text" class="form-control" value="RoadSide+ Emergency System">
                    </div>
                    <div class="setting-group">
                        <label>Default Response Time (minutes)</label>
                        <input type="number" class="form-control" value="30">
                    </div>
                    <div class="setting-toggle">
                        <label class="toggle-label">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                            Enable 24/7 Operations
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    closeSystemControlModal() {
        const modal = document.getElementById('system-control-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Utility Functions
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getServiceIcon(serviceType) {
        const icons = {
            'Towing': '🚛',
            'Battery Jump': '🔋',
            'Tire Change': '🛞',
            'Lockout': '🔓',
            'Fuel Delivery': '⛽',
            'Winch Recovery': '🪝',
            'Emergency SOS': '🚨'
        };
        return icons[serviceType] || '🔧';
    }

    getTotalSpent() {
        return this.serviceHistory.reduce((total, service) => total + (service.cost || 0), 0);
    }

    getAverageRating() {
        const ratedServices = this.serviceHistory.filter(service => service.rating > 0);
        if (ratedServices.length === 0) return '0.0';
        
        const average = ratedServices.reduce((sum, service) => sum + service.rating, 0) / ratedServices.length;
        return average.toFixed(1);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Additional methods for technician dashboard
    acceptJob(jobId) {
        this.showToast(`Job ${jobId} accepted. Customer notified.`, 'success');
    }

    callCustomer(phoneNumber) {
        this.showToast(`Calling customer: ${phoneNumber}`, 'info');
    }

    // Tracking modal
    openTrackingModal(service) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'tracking-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content tracking-modal">
                <div class="modal-header">
                    <h2>Service Tracking</h2>
                    <button class="close-btn" onclick="app.closeTrackingModal()">×</button>
                </div>
                <div class="modal-body">
                    <div id="tracking-status">
                        <div class="status-icon">🚗</div>
                        <h3>Technician En Route</h3>
                        <p>Your technician is on the way</p>
                        <div class="eta">
                            <span>ETA: <span id="eta-time">${service.duration}</span></span>
                        </div>
                    </div>
                    <div class="tracking-actions">
                        <button onclick="app.callTechnician()" class="btn btn--outline">📞 Call Technician</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.startServiceTracking(service);
    }

    closeTrackingModal() {
        const modal = document.getElementById('tracking-modal');
        if (modal) {
            modal.remove();
        }
    }

    startServiceTracking(service) {
        let timeRemaining = parseInt(service.duration) || 15;
        const etaElement = document.getElementById('eta-time');
        
        const interval = setInterval(() => {
            timeRemaining--;
            if (etaElement) {
                etaElement.textContent = `${timeRemaining} minutes`;
            }
            
            if (timeRemaining <= 0) {
                clearInterval(interval);
                const statusElement = document.getElementById('tracking-status');
                if (statusElement) {
                    statusElement.innerHTML = `
                        <div class="status-icon">✅</div>
                        <h3>Service Completed</h3>
                        <p>Your technician has finished the service</p>
                    `;
                }
                
                // Update service status
                const serviceIndex = this.serviceHistory.findIndex(s => s.id === service.id);
                if (serviceIndex !== -1) {
                    this.serviceHistory[serviceIndex].status = 'completed';
                    this.serviceHistory[serviceIndex].rating = 5;
                    this.saveServiceHistory();
                }
                
                setTimeout(() => {
                    this.closeTrackingModal();
                    this.showView('dashboard');
                }, 3000);
            }
        }, 2000); // Faster for demo
    }

    callTechnician() {
        this.showToast('Calling technician: +1 (555) 123-4567', 'info');
    }

    // Service details modal
    viewServiceDetails(serviceId) {
        const service = this.serviceHistory.find(s => s.id === serviceId);
        if (!service) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Service Details</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="service-detail-card">
                        <div class="service-header">
                            <span class="service-icon">${this.getServiceIcon(service.type)}</span>
                            <h3>${service.type}</h3>
                        </div>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Date & Time</label>
                                <span>${this.formatDate(service.date)}</span>
                            </div>
                            <div class="detail-item">
                                <label>Location</label>
                                <span>${service.location}</span>
                            </div>
                            <div class="detail-item">
                                <label>Technician</label>
                                <span>${service.technician}</span>
                            </div>
                            <div class="detail-item">
                                <label>Duration</label>
                                <span>${service.duration}</span>
                            </div>
                            <div class="detail-item">
                                <label>Cost</label>
                                <span>$${service.cost}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status</label>
                                <span class="status status--${service.status === 'completed' ? 'success' : 'info'}">${service.status}</span>
                            </div>
                            ${service.rating > 0 ? `
                                <div class="detail-item">
                                    <label>Rating</label>
                                    <span>${'⭐'.repeat(service.rating)} (${service.rating}/5)</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Support chat
    openSupportChat(ticketId) {
        const ticket = this.supportTickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content support-chat">
                <div class="modal-header">
                    <h2>${ticket.subject}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="chat-messages" id="chat-messages-${ticketId}">
                        ${ticket.messages.map(msg => `
                            <div class="message ${msg.sender === 'user' ? 'user-message' : 'support-message'}">
                                <div class="message-content">${msg.message}</div>
                                <div class="message-time">${this.formatDate(msg.timestamp)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input-${ticketId}" placeholder="Type your message..." class="form-control">
                        <button onclick="app.sendSupportMessage('${ticketId}')" class="btn btn--primary">Send</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    sendSupportMessage(ticketId) {
        const input = document.getElementById(`chat-input-${ticketId}`);
        const message = input.value.trim();
        
        if (!message) return;
        
        const ticket = this.supportTickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        // Add user message
        ticket.messages.push({
            sender: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Simulate support response
        setTimeout(() => {
            ticket.messages.push({
                sender: 'support',
                message: 'Thank you for your message. Our team is reviewing your request.',
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('roadside_tickets', JSON.stringify(this.supportTickets));
            
            // Update chat display
            const chatContainer = document.getElementById(`chat-messages-${ticketId}`);
            if (chatContainer) {
                chatContainer.innerHTML = ticket.messages.map(msg => `
                    <div class="message ${msg.sender === 'user' ? 'user-message' : 'support-message'}">
                        <div class="message-content">${msg.message}</div>
                        <div class="message-time">${this.formatDate(msg.timestamp)}</div>
                    </div>
                `).join('');
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 1000);
        
        input.value = '';
        localStorage.setItem('roadside_tickets', JSON.stringify(this.supportTickets));
        
        // Update chat display immediately for user message
        const chatContainer = document.getElementById(`chat-messages-${ticketId}`);
        if (chatContainer) {
            chatContainer.innerHTML = ticket.messages.map(msg => `
                <div class="message ${msg.sender === 'user' ? 'user-message' : 'support-message'}">
                    <div class="message-content">${msg.message}</div>
                    <div class="message-time">${this.formatDate(msg.timestamp)}</div>
                </div>
            `).join('');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
}

// Global functions for tab switching
function showControlTab(tabId) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.control-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.control-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    const content = document.getElementById(tabId);
    if (content) {
        content.classList.add('active');
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new RoadSideApp();
});