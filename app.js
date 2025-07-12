class RoadSideApp {
    constructor() {
        this.currentDashboard = 'customer';
        this.currentView = 'dashboard';
        this.serviceHistory = [];
        this.supportTickets = [];
    }

    init() {
        console.log('Initializing RoadSide+ App...');
        
        // Start app immediately
        setTimeout(() => {
            this.startApp();
        }, 100);
    }

    startApp() {
        try {
            console.log('Starting app immediately...');
            
            // Hide loading screen and show main app
            const loadingScreen = document.getElementById('loading-screen');
            const mainApp = document.getElementById('main-app');
            
            if (loadingScreen) {
                loadingScreen.classList.remove('active');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            
            if (mainApp) {
                mainApp.style.display = 'block';
                mainApp.style.visibility = 'visible';
                setTimeout(() => {
                    mainApp.style.opacity = '1';
                }, 100);
            }
            
            // Initialize app features
            this.setupEventListeners();
            this.loadInitialData();
            this.showDashboard('customer');
            
            console.log('✅ RoadSide+ App loaded successfully');
        } catch (error) {
            console.error('Error starting app:', error);
            // Force show main app even if there's an error
            this.forceShowApp();
        }
    }

    forceShowApp() {
        console.log('Force showing app...');
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.style.opacity = '0';
        }
        if (mainApp) {
            mainApp.style.display = 'block';
            mainApp.style.visibility = 'visible';
            mainApp.style.opacity = '1';
        }
        
        this.setupEventListeners();
        this.loadInitialData();
        this.showDashboard('customer');
    }

    setupEventListeners() {
        // Bottom navigation
        const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                if (view) {
                    this.showView(view);
                    this.updateBottomNav(view);
                }
            });
        });

        // Dashboard tabs
        const dashboardTabs = document.querySelectorAll('.dashboard-tabs .tab');
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const dashboard = tab.textContent.toLowerCase().trim();
                if (dashboard.includes('customer')) this.showDashboard('customer');
                else if (dashboard.includes('technician')) this.showDashboard('technician');
                else if (dashboard.includes('admin')) this.showDashboard('admin');
                else if (dashboard.includes('partner')) this.showDashboard('partner');
                else if (dashboard.includes('security')) this.showDashboard('security');
            });
        });
    }

    loadInitialData() {
        // Load demo service history
        this.serviceHistory = [
            {
                id: 'TW-2024-001',
                service: 'Towing',
                date: '2024-01-10',
                status: 'Completed',
                technician: 'Mike Rodriguez',
                rating: 5,
                cost: 150,
                location: '1234 Main St'
            },
            {
                id: 'BJ-2024-002',
                service: 'Battery Jump',
                date: '2024-01-05',
                status: 'Completed',
                technician: 'Sarah Chen',
                rating: 5,
                cost: 75,
                location: '5678 Oak Ave'
            }
        ];

        // Update stats
        this.updateStats();
        this.updateRecentServices();
    }

    showDashboard(type) {
        this.currentDashboard = type;
        
        // Update dashboard tabs
        const tabs = document.querySelectorAll('.dashboard-tabs .tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Find and activate the correct tab
        tabs.forEach(tab => {
            const tabText = tab.textContent.toLowerCase();
            if (tabText.includes(type)) {
                tab.classList.add('active');
            }
        });

        // Update dashboard content based on type
        const dashboardView = document.getElementById('dashboard-view');
        if (dashboardView) {
            dashboardView.innerHTML = this.getDashboardContent(type);
        }

        console.log(`Switched to ${type} dashboard`);
    }

    getDashboardContent(type) {
        switch (type) {
            case 'customer':
                return this.getCustomerDashboard();
            case 'technician':
                return this.getTechnicianDashboard();
            case 'admin':
                return this.getAdminDashboard();
            case 'partner':
                return this.getPartnerDashboard();
            case 'security':
                return this.getSecurityDashboard();
            default:
                return this.getCustomerDashboard();
        }
    }

    getCustomerDashboard() {
        return `
            <!-- Emergency Banner -->
            <div class="emergency-banner">
                <div class="emergency-content">
                    <span class="emergency-icon">🚨</span>
                    <div class="emergency-text">
                        <h3>Emergency Assistance</h3>
                        <p>24/7 immediate response</p>
                    </div>
                    <button class="emergency-btn" onclick="App.emergencyCall()">SOS</button>
                </div>
            </div>

            <!-- Services Section -->
            <div class="services-section">
                <h2>Select Service</h2>
                <div class="services-grid">
                    <div class="service-card" onclick="App.selectService(1, 'Towing', 150)">
                        <div class="service-icon">🚛</div>
                        <h3>Towing</h3>
                        <p class="service-price">$150</p>
                        <p class="service-time">45 min • 30 min response</p>
                    </div>
                    <div class="service-card" onclick="App.selectService(2, 'Battery Jump', 75)">
                        <div class="service-icon">🔋</div>
                        <h3>Battery Jump</h3>
                        <p class="service-price">$75</p>
                        <p class="service-time">20 min • 30 min response</p>
                    </div>
                    <div class="service-card" onclick="App.selectService(3, 'Tire Change', 100)">
                        <div class="service-icon">🛞</div>
                        <h3>Tire Change</h3>
                        <p class="service-price">$100</p>
                        <p class="service-time">30 min • 30 min response</p>
                    </div>
                    <div class="service-card" onclick="App.selectService(4, 'Lockout', 85)">
                        <div class="service-icon">🔓</div>
                        <h3>Lockout</h3>
                        <p class="service-price">$85</p>
                        <p class="service-time">20 min • 30 min response</p>
                    </div>
                    <div class="service-card" onclick="App.selectService(5, 'Fuel Delivery', 60)">
                        <div class="service-icon">⛽</div>
                        <h3>Fuel Delivery</h3>
                        <p class="service-price">$60</p>
                        <p class="service-time">15 min • 30 min response</p>
                    </div>
                    <div class="service-card" onclick="App.selectService(6, 'Winch Recovery', 200)">
                        <div class="service-icon">🪝</div>
                        <h3>Winch Recovery</h3>
                        <p class="service-price">$200</p>
                        <p class="service-time">60 min • 45 min response</p>
                    </div>
                </div>
            </div>

            <!-- Recent Services -->
            <div class="recent-section">
                <h2>Recent Services</h2>
                <div id="recent-services" class="service-history">
                    ${this.getRecentServicesHTML()}
                </div>
            </div>

            <!-- Dashboard Stats -->
            <div class="stats-section">
                <h2>Your Stats</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value" id="total-services">${this.serviceHistory.length}</div>
                        <div class="stat-label">Total Services</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value" id="total-spent">$${this.getTotalSpent()}</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value" id="avg-rating">${this.getAverageRating()}</div>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                </div>
            </div>
        `;
    }

    getTechnicianDashboard() {
        return `
            <div class="technician-dashboard">
                <div class="dashboard-header">
                    <h2>🔧 Technician Dashboard</h2>
                    <p>Manage your service assignments and performance</p>
                </div>
                
                <div class="tech-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📋</div>
                        <div class="stat-value">8</div>
                        <div class="stat-label">Active Jobs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-value">12 min</div>
                        <div class="stat-label">Avg Response</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.9</div>
                        <div class="stat-label">Rating</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$2,450</div>
                        <div class="stat-label">This Week</div>
                    </div>
                </div>

                <div class="active-jobs-section">
                    <h3>Active Assignments</h3>
                    <div class="job-cards">
                        <div class="job-card priority-high">
                            <div class="job-header">
                                <span class="job-type">🚛 Towing</span>
                                <span class="priority">High Priority</span>
                            </div>
                            <div class="job-details">
                                <p><strong>Location:</strong> 1234 Main St</p>
                                <p><strong>Customer:</strong> John Smith</p>
                                <p><strong>ETA:</strong> 15 minutes</p>
                            </div>
                            <div class="job-actions">
                                <button class="btn btn--primary btn--sm">Navigate</button>
                                <button class="btn btn--outline btn--sm">Call Customer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAdminDashboard() {
        return `
            <div class="admin-dashboard">
                <div class="dashboard-header">
                    <h2>⚙️ Admin Dashboard</h2>
                    <p>System management and oversight</p>
                </div>
                
                <div class="admin-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Active Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔧</div>
                        <div class="stat-value">56</div>
                        <div class="stat-label">Technicians</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-value">$125K</div>
                        <div class="stat-label">Monthly Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">98.5%</div>
                        <div class="stat-label">Success Rate</div>
                    </div>
                </div>

                <div class="system-controls-section">
                    <h3>System Controls</h3>
                    <div class="controls-grid">
                        <div class="control-card" onclick="App.openSystemControl('users')">
                            <div class="control-icon">👤</div>
                            <h4>User Management</h4>
                            <p>Manage customer accounts and permissions</p>
                        </div>
                        <div class="control-card" onclick="App.openSystemControl('technicians')">
                            <div class="control-icon">🔧</div>
                            <h4>Technician Management</h4>
                            <p>Monitor and assign technician resources</p>
                        </div>
                        <div class="control-card" onclick="App.openSystemControl('analytics')">
                            <div class="control-icon">📊</div>
                            <h4>Analytics</h4>
                            <p>View detailed system performance metrics</p>
                        </div>
                        <div class="control-card" onclick="App.openSystemControl('settings')">
                            <div class="control-icon">⚙️</div>
                            <h4>System Settings</h4>
                            <p>Configure system parameters and features</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPartnerDashboard() {
        return `
            <div class="partner-dashboard">
                <div class="dashboard-header">
                    <h2>🤝 Partner Dashboard</h2>
                    <p>Partnership management and collaboration</p>
                </div>
                
                <div class="partner-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🏢</div>
                        <div class="stat-value">23</div>
                        <div class="stat-label">Active Partners</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📋</div>
                        <div class="stat-value">156</div>
                        <div class="stat-label">Referrals</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$45K</div>
                        <div class="stat-label">Commission</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.8</div>
                        <div class="stat-label">Partner Rating</div>
                    </div>
                </div>

                <div class="partner-network-section">
                    <h3>Partner Network</h3>
                    <div class="partner-cards">
                        <div class="partner-card">
                            <div class="partner-info">
                                <h4>AutoCare Plus</h4>
                                <p>Automotive Service Provider</p>
                                <span class="status active">Active</span>
                            </div>
                            <div class="partner-stats">
                                <span>45 Referrals</span>
                                <span>4.9★</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSecurityDashboard() {
        return `
            <div class="security-dashboard">
                <div class="dashboard-header">
                    <h2>🛡️ Security Dashboard</h2>
                    <p>System security and threat monitoring</p>
                </div>
                
                <div class="security-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🔒</div>
                        <div class="stat-value">99.9%</div>
                        <div class="stat-label">System Uptime</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🚨</div>
                        <div class="stat-value">0</div>
                        <div class="stat-label">Active Threats</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔐</div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Secure Sessions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">A+</div>
                        <div class="stat-label">Security Grade</div>
                    </div>
                </div>

                <div class="security-alerts-section">
                    <h3>Security Status</h3>
                    <div class="alert-item success">
                        <span class="alert-icon">✅</span>
                        <div class="alert-content">
                            <h4>System Secure</h4>
                            <p>All security protocols are functioning normally</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showView(view) {
        this.currentView = view;
        
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(v => v.classList.remove('active'));
        
        // Show selected view
        const targetView = document.getElementById(`${view}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Load view-specific content
        switch (view) {
            case 'history':
                this.loadServiceHistory();
                break;
            case 'support':
                this.loadSupportContent();
                break;
            case 'profile':
                this.loadProfileContent();
                break;
        }
    }

    updateBottomNav(activeView) {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === activeView) {
                item.classList.add('active');
            }
        });
    }

    loadServiceHistory() {
        const historyContainer = document.getElementById('history-view');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="history-content">
                    <h2>Service History</h2>
                    <div class="service-history-list">
                        ${this.serviceHistory.map(service => `
                            <div class="history-item">
                                <div class="service-info">
                                    <h4>${service.service}</h4>
                                    <p><strong>Date:</strong> ${service.date}</p>
                                    <p><strong>Location:</strong> ${service.location}</p>
                                    <p><strong>Technician:</strong> ${service.technician}</p>
                                    <p><strong>Cost:</strong> $${service.cost}</p>
                                </div>
                                <div class="service-status ${service.status.toLowerCase()}">${service.status}</div>
                                <div class="service-rating">
                                    ${'★'.repeat(service.rating)}${'☆'.repeat(5 - service.rating)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    loadSupportContent() {
        const supportContainer = document.getElementById('support-view');
        if (supportContainer) {
            supportContainer.innerHTML = `
                <div class="support-content">
                    <h2>Support Center</h2>
                    <div class="support-options">
                        <div class="support-card" onclick="App.openNewSupportRequest()">
                            <div class="support-icon">🎫</div>
                            <h3>New Support Request</h3>
                            <p>Submit a ticket for assistance</p>
                        </div>
                        <div class="support-card" onclick="App.openEmergencyContact()">
                            <div class="support-icon">🚨</div>
                            <h3>Emergency Contact</h3>
                            <p>24/7 emergency assistance</p>
                        </div>
                        <div class="support-card" onclick="App.openFAQ()">
                            <div class="support-icon">❓</div>
                            <h3>FAQ</h3>
                            <p>Frequently asked questions</p>
                        </div>
                        <div class="support-card" onclick="App.openLiveChat()">
                            <div class="support-icon">💬</div>
                            <h3>Live Chat</h3>
                            <p>Chat with support agent</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadProfileContent() {
        const profileContainer = document.getElementById('profile-view');
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div class="profile-content">
                    <h2>My Profile</h2>
                    <div class="profile-info">
                        <div class="profile-avatar">👤</div>
                        <div class="profile-details">
                            <h3>John Doe</h3>
                            <p>john.doe@email.com</p>
                            <p>Customer since: January 2024</p>
                        </div>
                    </div>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Services</span>
                            <span class="stat-value">${this.serviceHistory.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Spent</span>
                            <span class="stat-value">$${this.getTotalSpent()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Average Rating</span>
                            <span class="stat-value">${this.getAverageRating()}★</span>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn--primary">Edit Profile</button>
                        <button class="btn btn--outline">Settings</button>
                        <button class="btn btn--outline">Logout</button>
                    </div>
                </div>
            `;
        }
    }

    selectService(id, name, price) {
        console.log(`Service selected: ${name} - $${price}`);
        
        // Store selected service data
        window.selectedService = {
            id: id,
            name: name,
            price: price,
            icon: this.getServiceIcon(name)
        };
        
        // Show booking modal
        this.showBookingModal();
        
        // Show success toast
        this.showToast(`${name} service selected - $${price}`, 'success');
    }

    getServiceIcon(serviceName) {
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

    showBookingModal() {
        const modal = document.getElementById('booking-modal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Update modal content with selected service
            if (window.selectedService) {
                const iconEl = document.getElementById('selected-service-icon');
                const nameEl = document.getElementById('selected-service-name');
                const priceEl = document.getElementById('selected-service-price');
                
                if (iconEl) iconEl.textContent = window.selectedService.icon;
                if (nameEl) nameEl.textContent = window.selectedService.name;
                if (priceEl) priceEl.textContent = `$${window.selectedService.price}`;
            }
        }
    }

    emergencyCall() {
        this.showToast('Connecting to emergency services...', 'warning');
        setTimeout(() => {
            this.showToast('Emergency services contacted! Help is on the way.', 'success');
        }, 2000);
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Utility methods
    getRecentServicesHTML() {
        if (this.serviceHistory.length === 0) {
            return '<p class="no-services">No recent services</p>';
        }
        
        return this.serviceHistory.slice(0, 3).map(service => `
            <div class="service-item">
                <div class="service-info">
                    <h4>${service.service}</h4>
                    <p>${service.date} • ${service.location}</p>
                </div>
                <div class="service-status">${service.status}</div>
            </div>
        `).join('');
    }

    getTotalSpent() {
        return this.serviceHistory.reduce((total, service) => total + service.cost, 0);
    }

    getAverageRating() {
        if (this.serviceHistory.length === 0) return '0.0';
        const total = this.serviceHistory.reduce((sum, service) => sum + service.rating, 0);
        return (total / this.serviceHistory.length).toFixed(1);
    }

    updateStats() {
        const totalEl = document.getElementById('total-services');
        const spentEl = document.getElementById('total-spent');
        const ratingEl = document.getElementById('avg-rating');
        
        if (totalEl) totalEl.textContent = this.serviceHistory.length;
        if (spentEl) spentEl.textContent = `$${this.getTotalSpent()}`;
        if (ratingEl) ratingEl.textContent = this.getAverageRating();
    }

    updateRecentServices() {
        const container = document.getElementById('recent-services');
        if (container) {
            container.innerHTML = this.getRecentServicesHTML();
        }
    }

    // Support Center Methods
    openNewSupportRequest() {
        const modal = document.getElementById('support-request-modal');
        if (modal) modal.style.display = 'flex';
    }

    openEmergencyContact() {
        const modal = document.getElementById('emergency-contact-modal');
        if (modal) modal.style.display = 'flex';
    }

    openFAQ() {
        const modal = document.getElementById('faq-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.loadFAQContent();
        }
    }

    openLiveChat() {
        const modal = document.getElementById('live-chat-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.initializeChat();
        }
    }

    loadFAQContent() {
        const container = document.getElementById('faq-content');
        if (container) {
            container.innerHTML = `
                <div class="faq-category">
                    <h3>Service & Booking</h3>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                            How do I book a service?
                        </div>
                        <div class="faq-answer">
                            Simply select a service from the dashboard, fill in your location details, and confirm your booking. A technician will be dispatched immediately.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                            How long does it take for help to arrive?
                        </div>
                        <div class="faq-answer">
                            Our average response time is 30 minutes or less. You'll receive real-time updates on your technician's location.
                        </div>
                    </div>
                </div>
                <div class="faq-category">
                    <h3>Pricing & Payment</h3>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                            How much do services cost?
                        </div>
                        <div class="faq-answer">
                            Pricing varies by service type. Towing starts at $150, Battery Jump at $75, Tire Change at $100. All prices are displayed upfront.
                        </div>
                    </div>
                </div>
            `;
        }
    }

    initializeChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && messagesContainer.children.length === 0) {
            messagesContainer.innerHTML = `
                <div class="chat-message support">
                    <div class="message-avatar">👩‍💼</div>
                    <div class="message-content">
                        <div class="message-text">Hello! I'm Sarah from RoadSide+ support. How can I help you today?</div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');
        
        if (input && messagesContainer && input.value.trim()) {
            const message = input.value.trim();
            
            // Add user message
            messagesContainer.innerHTML += `
                <div class="chat-message user">
                    <div class="message-content">
                        <div class="message-text">${message}</div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    </div>
                    <div class="message-avatar">👤</div>
                </div>
            `;
            
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Simulate support response
            setTimeout(() => {
                const responses = [
                    "I understand your concern. Let me help you with that.",
                    "That's a great question! Here's what I can tell you...",
                    "I'll be happy to assist you with this issue.",
                    "Let me check our system for the best solution.",
                    "Thanks for reaching out! I can definitely help with that."
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                messagesContainer.innerHTML += `
                    <div class="chat-message support">
                        <div class="message-avatar">👩‍💼</div>
                        <div class="message-content">
                            <div class="message-text">${response}</div>
                            <div class="message-time">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                `;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000 + Math.random() * 2000);
        }
    }

    // Modal close methods
    closeSupportRequestModal() {
        const modal = document.getElementById('support-request-modal');
        if (modal) modal.style.display = 'none';
    }

    closeEmergencyContactModal() {
        const modal = document.getElementById('emergency-contact-modal');
        if (modal) modal.style.display = 'none';
    }

    closeFAQModal() {
        const modal = document.getElementById('faq-modal');
        if (modal) modal.style.display = 'none';
    }

    closeLiveChatModal() {
        const modal = document.getElementById('live-chat-modal');
        if (modal) modal.style.display = 'none';
    }

    openSystemControl(type) {
        const modal = document.getElementById('system-control-modal');
        const content = document.getElementById('system-control-content');
        const title = document.getElementById('system-control-title');
        
        if (modal && content && title) {
            title.textContent = this.getSystemControlTitle(type);
            content.innerHTML = this.getSystemControlContent(type);
            modal.style.display = 'flex';
        }
    }

    getSystemControlTitle(type) {
        const titles = {
            'users': 'User Management',
            'technicians': 'Technician Management', 
            'analytics': 'System Analytics',
            'settings': 'System Settings'
        };
        return titles[type] || 'System Control';
    }

    getSystemControlContent(type) {
        switch (type) {
            case 'users':
                return `
                    <div class="system-control-tabs">
                        <div class="tab active" onclick="this.parentElement.querySelector('.active').classList.remove('active'); this.classList.add('active');">Overview</div>
                        <div class="tab" onclick="this.parentElement.querySelector('.active').classList.remove('active'); this.classList.add('active');">User Accounts</div>
                        <div class="tab" onclick="this.parentElement.querySelector('.active').classList.remove('active'); this.classList.add('active');">Permissions</div>
                    </div>
                    <div class="control-content">
                        <div class="user-stats">
                            <div class="stat-item">
                                <span class="stat-label">Total Users</span>
                                <span class="stat-value">1,247</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Active Today</span>
                                <span class="stat-value">456</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">New This Week</span>
                                <span class="stat-value">23</span>
                            </div>
                        </div>
                        <div class="user-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Last Active</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>John Doe</td>
                                        <td>john@example.com</td>
                                        <td><span class="status active">Active</span></td>
                                        <td>2 hours ago</td>
                                        <td>
                                            <button class="btn btn--sm">Edit</button>
                                            <button class="btn btn--sm btn--outline">View</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Jane Smith</td>
                                        <td>jane@example.com</td>
                                        <td><span class="status active">Active</span></td>
                                        <td>1 day ago</td>
                                        <td>
                                            <button class="btn btn--sm">Edit</button>
                                            <button class="btn btn--sm btn--outline">View</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            case 'analytics':
                return `
                    <div class="analytics-dashboard">
                        <div class="analytics-stats">
                            <div class="stat-card">
                                <h4>Daily Revenue</h4>
                                <div class="stat-value">$12,450</div>
                                <div class="stat-change positive">+15.3%</div>
                            </div>
                            <div class="stat-card">
                                <h4>Services Completed</h4>
                                <div class="stat-value">89</div>
                                <div class="stat-change positive">+8.2%</div>
                            </div>
                            <div class="stat-card">
                                <h4>Customer Satisfaction</h4>
                                <div class="stat-value">4.8/5</div>
                                <div class="stat-change positive">+0.2</div>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return `<p>System control panel for ${type}</p>`;
        }
    }

    closeSystemControlModal() {
        const modal = document.getElementById('system-control-modal');
        if (modal) modal.style.display = 'none';
    }
}

// Global functions for onclick handlers
function login() {
    console.log('Login clicked');
    App.showToast('Login successful!', 'success');
}

function showRegister() {
    console.log('Register clicked');
}

function toggleNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
    }
}

function closeNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    if (drawer) {
        drawer.classList.remove('open');
    }
}

function showDashboard(type) {
    if (window.App) {
        App.showDashboard(type);
    }
}

function selectService(id, name, price) {
    if (window.App) {
        App.selectService(id, name, price);
    }
}

function emergencyCall() {
    if (window.App) {
        App.emergencyCall();
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.style.display = 'none';
}

function nextBookingStep() {
    console.log('Next booking step');
}

function confirmBooking() {
    if (window.App) {
        App.showToast('Booking confirmed! Technician dispatched.', 'success');
        closeBookingModal();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    window.App = new RoadSideApp();
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.App) {
            window.App = new RoadSideApp();
        }
    });
} else {
    if (!window.App) {
        window.App = new RoadSideApp();
    }
}