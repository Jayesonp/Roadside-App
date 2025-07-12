class RoadSideApp {
    constructor() {
        this.currentDashboard = 'customer';
        this.currentView = 'dashboard';
        this.serviceHistory = [];
        this.supportTickets = [];
    }

    init() {
        console.log('Initializing RoadSide+ App...');
        this.technicianStatus = 'online';
        this.activeJobs = [
            {
                id: 1,
                service: 'Towing',
                customer: 'John Smith',
                location: '1234 Main St, Downtown',
                time: 'Due in 15 mins',
                priority: 'HIGH',
                status: 'assigned',
                description: 'Vehicle breakdown on highway, need immediate towing to nearest garage.',
                phone: '(555) 123-4567'
            },
            {
                id: 2,
                service: 'Battery Jump',
                customer: 'Sarah Johnson',
                location: '5678 Oak Ave, Midtown',
                time: 'Due in 25 mins',
                priority: 'MEDIUM',
                status: 'en_route',
                description: 'Car won\'t start, likely dead battery in parking lot.',
                phone: '(555) 987-6543'
            },
            {
                id: 3,
                service: 'Tire Change',
                customer: 'Mike Davis',
                location: '9012 Pine Rd, Uptown',
                time: 'Due in 45 mins',
                priority: 'LOW',
                status: 'assigned',
                description: 'Flat tire on residential street, customer has spare.',
                phone: '(555) 456-7890'
            }
        ];
        
        this.recentCompletions = [
            { service: 'Towing', location: 'Downtown Plaza', rating: 5, earnings: 150 },
            { service: 'Battery Jump', location: 'Shopping Mall', rating: 4, earnings: 75 },
            { service: 'Lockout', location: 'Office Complex', rating: 5, earnings: 85 },
            { service: 'Fuel Delivery', location: 'Highway 101', rating: 4, earnings: 60 }
        ];
        
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

    // Technician Dashboard Methods
    toggleTechnicianStatus() {
        this.technicianStatus = this.technicianStatus === 'online' ? 'offline' : 'online';
        this.showToast(`Status changed to ${this.technicianStatus}`, 'success');
        this.showDashboard('technician');
    }

    updateLocation() {
        this.showToast('Location updated successfully', 'success');
    }

    viewTechProfile() {
        this.showToast('Opening technician profile...', 'info');
    }

    acceptNextJob() {
        const availableJob = this.activeJobs.find(job => job.status === 'assigned');
        if (availableJob) {
            availableJob.status = 'en_route';
            this.showToast(`Accepted job: ${availableJob.service}`, 'success');
            this.showDashboard('technician');
        } else {
            this.showToast('No available jobs to accept', 'info');
        }
    }

    reportIssue() {
        this.showToast('Opening issue report form...', 'info');
    }

    requestSupport() {
        this.showToast('Connecting to dispatch support...', 'info');
    }

    viewSchedule() {
        this.showToast('Opening schedule view...', 'info');
    }

    // Admin Dashboard Methods
    openSystemSettings() {
        this.showToast('Opening system settings...', 'info');
    }

    viewActiveUsers() {
        this.showToast('Loading active users report...', 'info');
    }

    viewActiveTechnicians() {
        this.showToast('Loading technician status report...', 'info');
    }

    viewTodaysJobs() {
        this.showToast('Loading today\'s job analytics...', 'info');
    }

    viewRevenue() {
        this.showToast('Loading revenue analytics...', 'info');
    }

    addNewTechnician() {
        this.showToast('Opening technician registration form...', 'info');
    }

    viewReports() {
        this.showToast('Loading comprehensive reports...', 'info');
    }

    manageUsers() {
        this.showToast('Opening user management panel...', 'info');
    }

    systemMaintenance() {
        this.showToast('Opening system maintenance tools...', 'info');
    }

    // Partner Dashboard Methods
    inviteNewPartner() {
        this.showToast('Opening partner invitation form...', 'info');
    }

    viewPartnerNetwork() {
        this.showToast('Loading partner network analytics...', 'info');
    }

    viewReferrals() {
        this.showToast('Loading referral tracking data...', 'info');
    }

    viewCommissions() {
        this.showToast('Loading commission reports...', 'info');
    }

    viewConversionRate() {
        this.showToast('Loading conversion analytics...', 'info');
    }

    generateReferralLink() {
        this.showToast('Generating new referral link...', 'success');
    }

    downloadMarketingMaterials() {
        this.showToast('Preparing marketing materials download...', 'info');
    }

    trackPerformance() {
        this.showToast('Loading performance analytics...', 'info');
    }

    manageCommissions() {
        this.showToast('Opening commission center...', 'info');
    }

    // Security Dashboard Methods
    viewThreatDetails() {
        this.showToast('Loading threat analysis report...', 'info');
    }

    viewFailedLogins() {
        this.showToast('Loading failed login attempts...', 'info');
    }

    viewActiveSessions() {
        this.showToast('Loading active session monitor...', 'info');
    }

    viewSecurityScore() {
        this.showToast('Loading security score details...', 'info');
    }

    runSecurityScan() {
        this.showToast('Initiating comprehensive security scan...', 'info');
    }

    viewAuditLogs() {
        this.showToast('Loading system audit logs...', 'info');
    }

    manageAccessControl() {
        this.showToast('Opening access control panel...', 'info');
    }

    configureFirewall() {
        this.showToast('Opening firewall configuration...', 'info');
    }

    investigateEvent(eventType) {
        this.showToast(`Investigating ${eventType} event...`, 'info');
    }

    viewScanResults() {
        this.showToast('Loading security scan results...', 'info');
    }

    getTechnicianJobCards() {
        const jobs = [
            {
                id: 'TW-001',
                type: 'Towing',
                icon: '🚛',
                priority: 'high',
                customer: 'John Smith',
                location: '1234 Main St, City, State',
                phone: '(555) 123-4567',
                eta: '15 minutes',
                distance: '2.3 miles',
                price: '$150',
                description: 'Vehicle won\'t start, needs towing to nearest garage',
                status: 'assigned'
            },
            {
                id: 'BJ-002',
                type: 'Battery Jump',
                icon: '🔋',
                priority: 'medium',
                customer: 'Sarah Johnson',
                location: '5678 Oak Ave, City, State',
                phone: '(555) 987-6543',
                eta: '25 minutes',
                distance: '4.1 miles',
                price: '$75',
                description: 'Car battery died in parking lot',
                status: 'en_route'
            },
            {
                id: 'TC-003',
                type: 'Tire Change',
                icon: '🛞',
                priority: 'high',
                customer: 'Mike Rodriguez',
                location: '9012 Pine St, City, State',
                phone: '(555) 456-7890',
                eta: '10 minutes',
                distance: '1.5 miles',
                price: '$100',
                description: 'Flat tire on highway, spare available',
                status: 'arriving'
            }
        ];

        return jobs.map(job => `
            <div class="job-card priority-${job.priority} status-${job.status}" data-job-id="${job.id}">
                <div class="job-header">
                    <div class="job-type-info">
                        <span class="job-type">${job.icon} ${job.type}</span>
                        <span class="job-id">#${job.id}</span>
                    </div>
                    <div class="job-priority-status">
                        <span class="priority priority-${job.priority}">${job.priority.toUpperCase()} PRIORITY</span>
                        <span class="job-status status-${job.status}">${this.formatJobStatus(job.status)}</span>
                    </div>
                </div>
                
                <div class="job-details">
                    <div class="job-info-grid">
                        <div class="info-item">
                            <strong>Customer:</strong> ${job.customer}
                        </div>
                        <div class="info-item">
                            <strong>Location:</strong> ${job.location}
                        </div>
                        <div class="info-item">
                            <strong>Phone:</strong> ${job.phone}
                        </div>
                        <div class="info-item">
                            <strong>ETA:</strong> ${job.eta}
                        </div>
                        <div class="info-item">
                            <strong>Distance:</strong> ${job.distance}
                        </div>
                        <div class="info-item">
                            <strong>Price:</strong> ${job.price}
                        </div>
                    </div>
                    <div class="job-description">
                        <strong>Description:</strong> ${job.description}
                    </div>
                </div>
                
                <div class="job-actions">
                    ${this.getJobActionButtons(job)}
                </div>
            </div>
        `).join('');
    }

    getJobActionButtons(job) {
        switch (job.status) {
            case 'assigned':
                return `
                    <button onclick="App.acceptJob('${job.id}')" class="btn btn--primary btn--sm">Accept Job</button>
                    <button onclick="App.navigateToJob('${job.id}')" class="btn btn--outline btn--sm">📍 Navigate</button>
                    <button onclick="App.callCustomer('${job.phone}', '${job.customer}')" class="btn btn--outline btn--sm">📞 Call</button>
                    <button onclick="App.declineJob('${job.id}')" class="btn btn--danger btn--sm">Decline</button>
                `;
            case 'en_route':
                return `
                    <button onclick="App.arriveAtJob('${job.id}')" class="btn btn--primary btn--sm">I've Arrived</button>
                    <button onclick="App.navigateToJob('${job.id}')" class="btn btn--outline btn--sm">📍 Navigate</button>
                    <button onclick="App.callCustomer('${job.phone}', '${job.customer}')" class="btn btn--outline btn--sm">📞 Call</button>
                    <button onclick="App.reportDelay('${job.id}')" class="btn btn--warning btn--sm">Report Delay</button>
                `;
            case 'arriving':
                return `
                    <button onclick="App.startJob('${job.id}')" class="btn btn--primary btn--sm">Start Service</button>
                    <button onclick="App.callCustomer('${job.phone}', '${job.customer}')" class="btn btn--outline btn--sm">📞 Call</button>
                    <button onclick="App.reportIssue('${job.id}')" class="btn btn--warning btn--sm">Report Issue</button>
                `;
            default:
                return `
                    <button onclick="App.viewJobDetails('${job.id}')" class="btn btn--outline btn--sm">View Details</button>
                `;
        }
    }

    formatJobStatus(status) {
        const statusMap = {
            'assigned': 'Assigned',
            'en_route': 'En Route',
            'arriving': 'Arriving',
            'in_progress': 'In Progress',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    getCompletedJobsHTML() {
        const completedJobs = [
            { id: 'TW-098', type: 'Towing', customer: 'Emma Wilson', time: '2 hours ago', rating: 5, earnings: '$150' },
            { id: 'BJ-097', type: 'Battery Jump', customer: 'David Brown', time: '4 hours ago', rating: 5, earnings: '$75' },
            { id: 'TC-096', type: 'Tire Change', customer: 'Lisa Garcia', time: '6 hours ago', rating: 4, earnings: '$100' }
        ];

        return completedJobs.map(job => `
            <div class="completed-job-item">
                <div class="job-info">
                    <span class="job-type">${job.type}</span>
                    <span class="job-customer">${job.customer}</span>
                    <span class="job-time">${job.time}</span>
                </div>
                <div class="job-results">
                    <span class="job-rating">${'★'.repeat(job.rating)}${'☆'.repeat(5-job.rating)}</span>
                    <span class="job-earnings">${job.earnings}</span>
                </div>
            </div>
        `).join('');
    }

    // Technician Action Methods
    toggleTechnicianStatus() {
        this.showToast('Status updated to Off Duty', 'info');
    }

    viewTechnicianJobs() {
        this.showToast('Viewing all active jobs', 'info');
    }

    viewResponseMetrics() {
        this.showToast('Opening response time analytics', 'info');
    }

    viewRatings() {
        this.showToast('Viewing customer ratings and feedback', 'info');
    }

    viewEarnings() {
        this.showToast('Opening earnings report', 'info');
    }

    acceptNextJob() {
        this.showToast('Looking for next available job...', 'info');
        setTimeout(() => {
            this.showToast('New job assigned! Check Active Assignments.', 'success');
        }, 2000);
    }

    reportIssue(jobId = null) {
        const message = jobId ? `Reporting issue for job #${jobId}` : 'Opening issue report form';
        this.showToast(message, 'warning');
    }

    requestSupport() {
        this.showToast('Contacting dispatch for support...', 'info');
    }

    updateLocation() {
        this.showToast('Updating GPS location...', 'info');
        setTimeout(() => {
            this.showToast('Location updated successfully', 'success');
        }, 1500);
    }

    filterJobs(priority) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const message = priority === 'all' ? 'Showing all jobs' : `Filtering ${priority} priority jobs`;
        this.showToast(message, 'info');
    }

    // Job Action Methods
    acceptJob(jobId) {
        this.showToast(`Job #${jobId} accepted! Starting navigation...`, 'success');
        this.updateJobStatus(jobId, 'en_route');
    }

    navigateToJob(jobId) {
        this.showToast(`Opening navigation to job #${jobId}`, 'info');
    }

    callCustomer(phone, name) {
        this.showToast(`Calling ${name} at ${phone}`, 'info');
    }

    declineJob(jobId) {
        this.showToast(`Job #${jobId} declined. Notifying dispatch...`, 'warning');
        this.removeJobFromList(jobId);
    }

    arriveAtJob(jobId) {
        this.showToast(`Marked as arrived at job #${jobId}`, 'success');
        this.updateJobStatus(jobId, 'arriving');
    }

    startJob(jobId) {
        this.showToast(`Starting service for job #${jobId}`, 'success');
        this.updateJobStatus(jobId, 'in_progress');
    }

    reportDelay(jobId) {
        this.showToast(`Reporting delay for job #${jobId}`, 'warning');
    }

    updateJobStatus(jobId, newStatus) {
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) {
            jobCard.className = jobCard.className.replace(/status-\w+/, `status-${newStatus}`);
            const statusSpan = jobCard.querySelector('.job-status');
            if (statusSpan) {
                statusSpan.textContent = this.formatJobStatus(newStatus);
            }
        }
    }

    removeJobFromList(jobId) {
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) {
            jobCard.style.opacity = '0';
            setTimeout(() => jobCard.remove(), 300);
        }
    }

    getJobActions(job) {
        switch(job.status) {
            case 'assigned':
                return `
                    <button class="btn btn--primary btn--sm" onclick="App.acceptJob(${job.id})">✅ Accept</button>
                    <button class="btn btn--outline btn--sm" onclick="App.navigateToJob(${job.id})">🗺️ Navigate</button>
                    <button class="btn btn--outline btn--sm" onclick="App.callCustomer('${job.phone}')">📞 Call</button>
                    <button class="btn btn--danger btn--sm" onclick="App.declineJob(${job.id})">❌ Decline</button>
                `;
            case 'en_route':
                return `
                    <button class="btn btn--success btn--sm" onclick="App.markArrived(${job.id})">📍 Arrived</button>
                    <button class="btn btn--outline btn--sm" onclick="App.navigateToJob(${job.id})">🗺️ Navigate</button>
                    <button class="btn btn--outline btn--sm" onclick="App.callCustomer('${job.phone}')">📞 Call</button>
                    <button class="btn btn--warning btn--sm" onclick="App.reportDelay(${job.id})">⏰ Report Delay</button>
                `;
            case 'arriving':
                return `
                    <button class="btn btn--success btn--sm" onclick="App.startService(${job.id})">🔧 Start Service</button>
                    <button class="btn btn--outline btn--sm" onclick="App.callCustomer('${job.phone}')">📞 Call</button>
                    <button class="btn btn--warning btn--sm" onclick="App.reportIssue(${job.id})">⚠️ Report Issue</button>
                `;
            default:
                return `
                    <button class="btn btn--primary btn--sm" onclick="App.acceptJob(${job.id})">✅ Accept</button>
                `;
        }
    }

    // Supabase Authentication Methods
    async supabaseSignUp(email, password, firstName, lastName) {
        try {
            const response = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Store session info
                if (data.data.session) {
                    localStorage.setItem('supabase_session', JSON.stringify(data.data.session));
                }
                localStorage.setItem('user_data', JSON.stringify(data.data.user));
                
                this.showToast('Account created successfully!', 'success');
                this.showLogin();
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        }
    }

    async supabaseSignIn(email, password) {
        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Store session info
                if (data.data.session) {
                    localStorage.setItem('supabase_session', JSON.stringify(data.data.session));
                }
                localStorage.setItem('user_data', JSON.stringify(data.data.user));
                
                this.showToast('Login successful!', 'success');
                this.showMainApp();
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        }
    }

    async supabaseSignOut() {
        try {
            const session = JSON.parse(localStorage.getItem('supabase_session') || '{}');
            
            const response = await fetch('/api/v1/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            // Clear local storage regardless of response
            localStorage.removeItem('supabase_session');
            localStorage.removeItem('user_data');
            
            this.showToast('Logged out successfully!', 'success');
            this.showLogin();
        } catch (error) {
            // Still clear local storage on error
            localStorage.removeItem('supabase_session');
            localStorage.removeItem('user_data');
            this.showToast('Logged out', 'info');
            this.showLogin();
        }
    }

    // Authentication Methods
    login() {
        const emailInput = document.querySelector('#login-screen input[type="email"]');
        const passwordInput = document.querySelector('#login-screen input[type="password"]');
        
        const email = emailInput?.value?.trim();
        const password = passwordInput?.value?.trim();

        if (!email || !password) {
            this.showToast('Please enter both email and password', 'error');
            return;
        }

        // Use Supabase authentication
        this.supabaseSignIn(email, password);
    }

    register() {
        const emailInput = document.querySelector('#register-screen input[type="email"]');
        const passwordInput = document.querySelector('#register-screen input[type="password"]');
        const firstNameInput = document.querySelector('#register-screen input[name="firstName"]');
        const lastNameInput = document.querySelector('#register-screen input[name="lastName"]');
        
        const email = emailInput?.value?.trim();
        const password = passwordInput?.value?.trim();
        const firstName = firstNameInput?.value?.trim();
        const lastName = lastNameInput?.value?.trim();

        if (!email || !password || !firstName || !lastName) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Use Supabase authentication
        this.supabaseSignUp(email, password, firstName, lastName);
    }

    logout() {
        // Use Supabase sign out
        this.supabaseSignOut();
    }

    showLogin() {
        // Hide all screens and show login
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-screen').style.display = 'block';
    }

    showMainApp() {
        // Hide all screens and show main app
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        const mainApp = document.getElementById('main-app');
        if (mainApp) mainApp.style.display = 'block';
    }

    showRegister() {
        // Create register screen if it doesn't exist
        let registerScreen = document.getElementById('register-screen');
        if (!registerScreen) {
            registerScreen = document.createElement('div');
            registerScreen.id = 'register-screen';
            registerScreen.className = 'screen';
            registerScreen.innerHTML = `
                <div class="auth-container">
                    <div class="auth-header">
                        <h1>🚗 RoadSide+</h1>
                        <p>Create Your Account</p>
                    </div>
                    <div class="auth-form">
                        <div class="form-group">
                            <label class="form-label">First Name</label>
                            <input type="text" name="firstName" class="form-control" placeholder="Enter your first name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Last Name</label>
                            <input type="text" name="lastName" class="form-control" placeholder="Enter your last name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" placeholder="Enter your password">
                        </div>
                        <button class="btn btn--primary btn--full-width" onclick="App.register()">Create Account</button>
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        <button class="btn btn--outline btn--full-width" onclick="App.showLogin()">Back to Login</button>
                    </div>
                </div>
            `;
            document.body.appendChild(registerScreen);
        }

        // Hide all screens and show register
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById('main-app').style.display = 'none';
        registerScreen.style.display = 'block';
    }

    // Emergency and Support Functions
    emergencyCall() {
        this.showToast('🚨 Emergency services contacted!', 'error');
    }
}

// Edit Profile Modal Functions
function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        // Pre-populate with current profile data
        document.getElementById('edit-profile-name').value = 'John Doe';
        document.getElementById('edit-profile-email').value = 'john.doe@email.com';
        document.getElementById('edit-profile-phone').value = '+1 (555) 123-4567';
        document.getElementById('edit-profile-address').value = '123 Main Street, City, State 12345';
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function saveEditProfile() {
    const name = document.getElementById('edit-profile-name').value;
    const email = document.getElementById('edit-profile-email').value;
    const phone = document.getElementById('edit-profile-phone').value;
    const address = document.getElementById('edit-profile-address').value;
    
    if (!name || !email) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    // Update profile data
    console.log('Saving profile:', { name, email, phone, address });
    
    // Update UI with new data
    const profileNameElements = document.querySelectorAll('.user-name, .profile-name');
    profileNameElements.forEach(el => {
        if (el) el.textContent = name;
    });
    
    showToast('Profile updated successfully!', 'success');
    closeEditProfileModal();
}

// Settings Modal Functions
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        // Load current settings
        loadCurrentSettings();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function loadCurrentSettings() {
    // Load settings from localStorage or default values
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    document.getElementById('setting-push-notifications').checked = settings.pushNotifications !== false;
    document.getElementById('setting-email-notifications').checked = settings.emailNotifications !== false;
    document.getElementById('setting-sms-notifications').checked = settings.smsNotifications || false;
    document.getElementById('setting-location-sharing').checked = settings.locationSharing !== false;
    document.getElementById('setting-data-analytics').checked = settings.dataAnalytics || false;
    document.getElementById('setting-theme').value = settings.theme || 'dark';
    document.getElementById('setting-emergency-contact').value = settings.emergencyContact || '';
}

function saveSettings() {
    const settings = {
        pushNotifications: document.getElementById('setting-push-notifications').checked,
        emailNotifications: document.getElementById('setting-email-notifications').checked,
        smsNotifications: document.getElementById('setting-sms-notifications').checked,
        locationSharing: document.getElementById('setting-location-sharing').checked,
        dataAnalytics: document.getElementById('setting-data-analytics').checked,
        theme: document.getElementById('setting-theme').value,
        emergencyContact: document.getElementById('setting-emergency-contact').value
    };
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply theme setting
    document.body.setAttribute('data-color-scheme', settings.theme);
    
    console.log('Settings saved:', settings);
    showToast('Settings saved successfully!', 'success');
    closeSettingsModal();
}

// Logout Function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('User logging out...');
        
        // Clear user data
        localStorage.removeItem('userSession');
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        // Show logout message
        showToast('Logged out successfully', 'success');
        
        // Redirect to login screen after a short delay
        setTimeout(() => {
            // Hide main app
            const mainApp = document.getElementById('main-app');
            const loginScreen = document.getElementById('login-screen');
            
            if (mainApp) mainApp.style.display = 'none';
            if (loginScreen) loginScreen.style.display = 'flex';
            
            // Reset login form
            const loginForm = loginScreen.querySelector('.auth-form');
            if (loginForm) {
                const inputs = loginForm.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
            }
        }, 1000);
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

// Emergency Call Function
function emergencyCall() {
    console.log('Emergency SOS activated!');
    
    // Show emergency alert
    const emergencyAlert = document.createElement('div');
    emergencyAlert.className = 'emergency-alert';
    emergencyAlert.innerHTML = `
        <div class="emergency-content">
            <h2>🚨 EMERGENCY ACTIVATED</h2>
            <p>Emergency services have been contacted</p>
            <p>Help is on the way!</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(emergencyAlert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (emergencyAlert.parentElement) {
            emergencyAlert.remove();
        }
    }, 5000);
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