// RoadSide+ Emergency Assistance App - Frontend JavaScript

// Global App object for managing application state and functionality
const App = {
    currentUser: null,
    currentView: 'dashboard',
    currentDashboard: 'customer',
    services: [
        { id: 1, name: 'Towing', price: 150, icon: '🚛', time: '45 min', response: '30 min response' },
        { id: 2, name: 'Battery Jump', price: 75, icon: '🔋', time: '20 min', response: '30 min response' },
        { id: 3, name: 'Tire Change', price: 100, icon: '🛞', time: '30 min', response: '30 min response' },
        { id: 4, name: 'Lockout', price: 85, icon: '🔓', time: '20 min', response: '30 min response' },
        { id: 5, name: 'Fuel Delivery', price: 60, icon: '⛽', time: '15 min', response: '30 min response' },
        { id: 6, name: 'Winch Recovery', price: 200, icon: '🪝', time: '60 min', response: '45 min response' }
    ],
    
    // Initialize the application
    init() {
        console.log('RoadSide+ App initializing...');
        this.setupEventListeners();
        this.loadUserData();
        this.showLoadingScreen();
    },

    // Show loading screen and transition to main app
    showLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            this.updateUI();
        }, 1500);
    },

    // Load demo user data
    loadUserData() {
        this.currentUser = {
            id: 'user-123',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            totalServices: 12,
            totalSpent: 875,
            avgRating: 4.8,
            memberSince: 2023
        };
    },

    // Setup event listeners
    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = item.dataset.view;
                if (view) {
                    this.showView(view);
                }
            });
        });

        // Dashboard tabs
        document.querySelectorAll('.dashboard-tabs .tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const dashboard = tab.textContent.toLowerCase().includes('customer') ? 'customer' :
                                tab.textContent.toLowerCase().includes('technician') ? 'technician' :
                                tab.textContent.toLowerCase().includes('admin') ? 'admin' :
                                tab.textContent.toLowerCase().includes('partner') ? 'partner' : 'security';
                this.showDashboard(dashboard);
            });
        });
    },

    // Update UI with current data
    updateUI() {
        if (this.currentUser) {
            // Update user stats
            document.getElementById('total-services').textContent = this.currentUser.totalServices;
            document.getElementById('total-spent').textContent = `$${this.currentUser.totalSpent}`;
            document.getElementById('avg-rating').textContent = this.currentUser.avgRating;
            
            // Update profile
            document.getElementById('profile-total-services').textContent = this.currentUser.totalServices;
            document.getElementById('profile-total-spent').textContent = `$${this.currentUser.totalSpent}`;
            document.getElementById('profile-avg-rating').textContent = this.currentUser.avgRating;
            document.getElementById('profile-member-since').textContent = this.currentUser.memberSince;
        }
        
        this.loadRecentServices();
        this.loadServiceHistory();
    },

    // Load recent services
    loadRecentServices() {
        const recentContainer = document.getElementById('recent-services');
        if (!recentContainer) return;

        const recentServices = [
            { id: 'RS001', service: 'Battery Jump', date: '2024-01-15', status: 'Completed', price: 75, technician: 'Mike Rodriguez', rating: 5 },
            { id: 'RS002', service: 'Tire Change', date: '2024-01-10', status: 'Completed', price: 100, technician: 'Sarah Wilson', rating: 4 },
            { id: 'RS003', service: 'Fuel Delivery', date: '2024-01-05', status: 'Completed', price: 60, technician: 'Alex Thompson', rating: 5 }
        ];

        recentContainer.innerHTML = recentServices.map(service => `
            <div class="service-record">
                <div class="service-info">
                    <h4>${service.service}</h4>
                    <p>ID: ${service.id} • ${service.date}</p>
                    <p>Technician: ${service.technician}</p>
                </div>
                <div class="service-status">
                    <span class="status ${service.status.toLowerCase()}">${service.status}</span>
                    <div class="service-price">$${service.price}</div>
                    <div class="rating">${'⭐'.repeat(service.rating)}</div>
                </div>
            </div>
        `).join('');
    },

    // Load service history
    loadServiceHistory() {
        const historyContainer = document.getElementById('service-history-list');
        if (!historyContainer) return;

        const history = [
            { id: 'SH001', service: 'Towing', date: '2024-01-20', location: '123 Main St', status: 'Completed', price: 150, technician: 'John Smith' },
            { id: 'SH002', service: 'Battery Jump', date: '2024-01-15', location: '456 Oak Ave', status: 'Completed', price: 75, technician: 'Mike Rodriguez' },
            { id: 'SH003', service: 'Tire Change', date: '2024-01-10', location: '789 Pine Rd', status: 'Completed', price: 100, technician: 'Sarah Wilson' },
            { id: 'SH004', service: 'Lockout', date: '2024-01-05', location: '321 Elm St', status: 'Completed', price: 85, technician: 'David Lee' },
            { id: 'SH005', service: 'Fuel Delivery', date: '2024-01-01', location: '654 Maple Dr', status: 'Completed', price: 60, technician: 'Alex Thompson' }
        ];

        historyContainer.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-header">
                    <h4>${item.service}</h4>
                    <span class="history-price">$${item.price}</span>
                </div>
                <div class="history-details">
                    <p><strong>ID:</strong> ${item.id}</p>
                    <p><strong>Date:</strong> ${item.date}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Technician:</strong> ${item.technician}</p>
                    <p><strong>Status:</strong> <span class="status ${item.status.toLowerCase()}">${item.status}</span></p>
                </div>
            </div>
        `).join('');
    },

    // Show specific view
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
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });
        
        this.currentView = viewName;
    },

    // Show specific dashboard
    showDashboard(dashboardType) {
        this.currentDashboard = dashboardType;
        
        // Update tab states
        document.querySelectorAll('.dashboard-tabs .tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Set active tab based on dashboard type
        const activeTabIndex = {
            'customer': 0,
            'technician': 1,
            'admin': 2,
            'partner': 3,
            'security': 4
        }[dashboardType] || 0;
        
        const tabs = document.querySelectorAll('.dashboard-tabs .tab');
        if (tabs[activeTabIndex]) {
            tabs[activeTabIndex].classList.add('active');
        }
        
        // Load dashboard content
        this.loadDashboardContent(dashboardType);
        
        // Show success message
        this.showToast(`Switched to ${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Dashboard`);
    },

    // Load dashboard content based on type
    loadDashboardContent(type) {
        const dashboardView = document.getElementById('dashboard-view');
        if (!dashboardView) return;

        // Dashboard content templates
        const dashboardTemplates = {
            customer: this.getCustomerDashboard(),
            technician: this.getTechnicianDashboard(),
            admin: this.getAdminDashboard(),
            partner: this.getPartnerDashboard(),
            security: this.getSecurityDashboard()
        };

        dashboardView.innerHTML = dashboardTemplates[type] || dashboardTemplates.customer;
    },

    // Get customer dashboard content
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
                    <button class="emergency-btn" onclick="emergencyCall()">SOS</button>
                </div>
            </div>

            <!-- Services Grid -->
            <div class="services-section">
                <h2>Select Service</h2>
                <div class="services-grid">
                    ${this.services.map(service => `
                        <div class="service-card" onclick="selectService(${service.id}, '${service.name}', ${service.price})">
                            <div class="service-icon">${service.icon}</div>
                            <h3>${service.name}</h3>
                            <p class="service-price">$${service.price}</p>
                            <p class="service-time">${service.time} • ${service.response}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recent Services -->
            <div class="recent-section">
                <h2>Recent Services</h2>
                <div id="recent-services" class="service-history"></div>
            </div>

            <!-- Dashboard Stats -->
            <div class="stats-section">
                <h2>Your Stats</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value" id="total-services">0</div>
                        <div class="stat-label">Total Services</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value" id="total-spent">$0</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value" id="avg-rating">0.0</div>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get technician dashboard content
    getTechnicianDashboard() {
        return `
            <div class="technician-dashboard">
                <div class="dashboard-header">
                    <h2>🔧 Technician Dashboard</h2>
                    <p>Manage your assignments and track performance</p>
                </div>
                
                <div class="quick-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📋</div>
                        <div class="stat-value">8</div>
                        <div class="stat-label">Active Jobs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.9</div>
                        <div class="stat-label">Rating</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-value">12min</div>
                        <div class="stat-label">Avg Response</div>
                    </div>
                </div>

                <div class="assignments-section">
                    <h3>Current Assignments</h3>
                    <div class="assignment-list">
                        <div class="assignment-card priority-high">
                            <div class="assignment-header">
                                <h4>Battery Jump - ID: #TJ001</h4>
                                <span class="priority-badge high">High Priority</span>
                            </div>
                            <p><strong>Customer:</strong> Sarah Johnson</p>
                            <p><strong>Location:</strong> 123 Main St, Downtown</p>
                            <p><strong>ETA:</strong> 8 minutes</p>
                            <div class="assignment-actions">
                                <button class="btn btn--primary btn--sm">Navigate</button>
                                <button class="btn btn--outline btn--sm">Contact</button>
                            </div>
                        </div>
                        <div class="assignment-card priority-medium">
                            <div class="assignment-header">
                                <h4>Tire Change - ID: #TJ002</h4>
                                <span class="priority-badge medium">Medium Priority</span>
                            </div>
                            <p><strong>Customer:</strong> Mike Davis</p>
                            <p><strong>Location:</strong> 456 Oak Ave, Midtown</p>
                            <p><strong>Scheduled:</strong> 2:30 PM</p>
                            <div class="assignment-actions">
                                <button class="btn btn--primary btn--sm">View Details</button>
                                <button class="btn btn--outline btn--sm">Call</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get admin dashboard content
    getAdminDashboard() {
        return `
            <div class="admin-dashboard">
                <div class="dashboard-header">
                    <h2>⚙️ Admin Dashboard</h2>
                    <p>System management and analytics</p>
                </div>
                
                <div class="admin-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Active Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔧</div>
                        <div class="stat-value">89</div>
                        <div class="stat-label">Technicians</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">$24.8k</div>
                        <div class="stat-label">Daily Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-value">98.2%</div>
                        <div class="stat-label">Uptime</div>
                    </div>
                </div>

                <div class="system-controls-section">
                    <h3>System Controls</h3>
                    <div class="controls-grid">
                        <div class="control-card" onclick="App.openSystemControl('user-management')">
                            <div class="control-icon">👤</div>
                            <h4>User Management</h4>
                            <p>Manage customer accounts and permissions</p>
                        </div>
                        <div class="control-card" onclick="App.openSystemControl('technician-management')">
                            <div class="control-icon">🔧</div>
                            <h4>Technician Management</h4>
                            <p>Monitor and assign technician resources</p>
                        </div>
                        <div class="control-card" onclick="App.openSystemControl('analytics')">
                            <div class="control-icon">📈</div>
                            <h4>Analytics</h4>
                            <p>View detailed system performance metrics</p>
                        </div>
                        <div class="control-card" onclick="App.openSystemControl('system-settings')">
                            <div class="control-icon">⚙️</div>
                            <h4>System Settings</h4>
                            <p>Configure system parameters and features</p>
                        </div>
                    </div>
                </div>

                <div class="recent-activity-section">
                    <h3>Recent Activity</h3>
                    <div class="activity-feed">
                        <div class="activity-item">
                            <div class="activity-icon">👤</div>
                            <div class="activity-content">
                                <p><strong>New user registered:</strong> jane.doe@example.com</p>
                                <span class="activity-time">5 minutes ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">🔧</div>
                            <div class="activity-content">
                                <p><strong>Technician completed service:</strong> Battery Jump #BJ001</p>
                                <span class="activity-time">12 minutes ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">💰</div>
                            <div class="activity-content">
                                <p><strong>Payment processed:</strong> $150.00 for Towing Service</p>
                                <span class="activity-time">18 minutes ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get partner dashboard content
    getPartnerDashboard() {
        return `
            <div class="partner-dashboard">
                <div class="dashboard-header">
                    <h2>🤝 Partner Dashboard</h2>
                    <p>Manage partnerships and track performance</p>
                </div>
                
                <div class="partner-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🤝</div>
                        <div class="stat-value">24</div>
                        <div class="stat-label">Active Partners</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-value">$12.4k</div>
                        <div class="stat-label">Monthly Commission</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">187</div>
                        <div class="stat-label">Referrals</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.7</div>
                        <div class="stat-label">Partner Rating</div>
                    </div>
                </div>

                <div class="partner-network-section">
                    <h3>Partner Network</h3>
                    <div class="partner-list">
                        <div class="partner-card">
                            <div class="partner-info">
                                <h4>AutoCare Plus</h4>
                                <p>Automotive Services • Downtown</p>
                                <div class="partner-stats">
                                    <span>42 referrals</span>
                                    <span>⭐ 4.8</span>
                                </div>
                            </div>
                            <div class="partner-actions">
                                <button class="btn btn--outline btn--sm">Contact</button>
                                <button class="btn btn--primary btn--sm">View Details</button>
                            </div>
                        </div>
                        <div class="partner-card">
                            <div class="partner-info">
                                <h4>QuickTow Services</h4>
                                <p>Towing & Recovery • Citywide</p>
                                <div class="partner-stats">
                                    <span>38 referrals</span>
                                    <span>⭐ 4.6</span>
                                </div>
                            </div>
                            <div class="partner-actions">
                                <button class="btn btn--outline btn--sm">Contact</button>
                                <button class="btn btn--primary btn--sm">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Get security dashboard content
    getSecurityDashboard() {
        return `
            <div class="security-dashboard">
                <div class="dashboard-header">
                    <h2>🛡️ Security Dashboard</h2>
                    <p>Monitor system security and threats</p>
                </div>
                
                <div class="security-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🛡️</div>
                        <div class="stat-value">99.9%</div>
                        <div class="stat-label">Security Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🚨</div>
                        <div class="stat-value">0</div>
                        <div class="stat-label">Active Threats</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔐</div>
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Secure Logins</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">24/7</div>
                        <div class="stat-label">Monitoring</div>
                    </div>
                </div>

                <div class="security-alerts-section">
                    <h3>Security Alerts</h3>
                    <div class="alerts-container">
                        <div class="alert-item alert-success">
                            <div class="alert-icon">✅</div>
                            <div class="alert-content">
                                <h4>System Security Check Passed</h4>
                                <p>All security protocols functioning normally</p>
                                <span class="alert-time">2 minutes ago</span>
                            </div>
                        </div>
                        <div class="alert-item alert-info">
                            <div class="alert-icon">ℹ️</div>
                            <div class="alert-content">
                                <h4>Security Update Available</h4>
                                <p>New security patch ready for deployment</p>
                                <span class="alert-time">1 hour ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="security-log-section">
                    <h3>Security Log</h3>
                    <div class="log-container">
                        <div class="log-entry">
                            <span class="log-time">14:25:30</span>
                            <span class="log-level info">INFO</span>
                            <span class="log-message">User authentication successful - user@example.com</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">14:23:15</span>
                            <span class="log-level success">SUCCESS</span>
                            <span class="log-message">Security scan completed - No threats detected</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">14:20:45</span>
                            <span class="log-level info">INFO</span>
                            <span class="log-message">SSL certificate verification successful</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // System control functions
    openSystemControl(controlType) {
        const modal = document.getElementById('system-control-modal');
        const title = document.getElementById('system-control-title');
        const content = document.getElementById('system-control-content');
        
        if (!modal || !title || !content) return;

        const controlTemplates = {
            'user-management': this.getUserManagementControl(),
            'technician-management': this.getTechnicianManagementControl(),
            'analytics': this.getAnalyticsControl(),
            'system-settings': this.getSystemSettingsControl()
        };

        const controlTitles = {
            'user-management': '👤 User Management',
            'technician-management': '🔧 Technician Management',
            'analytics': '📈 Analytics Dashboard',
            'system-settings': '⚙️ System Settings'
        };

        title.textContent = controlTitles[controlType] || 'System Control';
        content.innerHTML = controlTemplates[controlType] || '<p>Control panel not available.</p>';
        
        modal.classList.add('active');
    },

    closeSystemControlModal() {
        // Clean up user management interval if it exists
        if (this.userManagementInterval) {
            clearInterval(this.userManagementInterval);
            this.userManagementInterval = null;
        }
        
        // Reset filtered users
        this.currentFilteredUsers = null;
        this.currentUserTab = null;
        
        const modal = document.getElementById('system-control-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        console.log('✅ Post-implementation test: System control modal closed successfully');
    },

    // Support Center functions
    openNewSupportRequest() {
        const modal = document.getElementById('support-request-modal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    closeSupportRequestModal() {
        const modal = document.getElementById('support-request-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    submitSupportRequest() {
        const category = document.getElementById('support-category').value;
        const priority = document.getElementById('support-priority').value;
        const subject = document.getElementById('support-subject').value;
        const description = document.getElementById('support-description').value;

        if (!subject || !description) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Create new ticket
        const ticketId = 'TK' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Store in localStorage for demo
        const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
        tickets.push({
            id: ticketId,
            category,
            priority,
            subject,
            description,
            status: 'Open',
            created: new Date().toISOString()
        });
        localStorage.setItem('supportTickets', JSON.stringify(tickets));

        this.showToast(`Support ticket ${ticketId} created successfully!`);
        this.closeSupportRequestModal();
        
        // Clear form
        document.getElementById('support-subject').value = '';
        document.getElementById('support-description').value = '';
    },

    openEmergencyContact() {
        const modal = document.getElementById('emergency-contact-modal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    closeEmergencyContactModal() {
        const modal = document.getElementById('emergency-contact-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    callEmergencyNumber(type, number) {
        this.showToast(`Calling ${type}: ${number}`);
        // In a real app, this would initiate the call
        console.log(`Calling ${type}: ${number}`);
    },

    openFAQ() {
        const modal = document.getElementById('faq-modal');
        const content = document.getElementById('faq-content');
        
        if (!modal || !content) return;

        content.innerHTML = this.getFAQContent();
        modal.classList.add('active');
    },

    closeFAQModal() {
        const modal = document.getElementById('faq-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    openLiveChat() {
        const modal = document.getElementById('live-chat-modal');
        const messagesContainer = document.getElementById('chat-messages');
        
        if (!modal || !messagesContainer) return;

        // Initialize chat with welcome message
        messagesContainer.innerHTML = `
            <div class="chat-message agent">
                <div class="message-avatar">👩‍💼</div>
                <div class="message-content">
                    <div class="message-text">Hello! I'm Sarah from RoadSide+ support. How can I help you today?</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    },

    closeLiveChatModal() {
        const modal = document.getElementById('live-chat-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');
        
        if (!input || !messagesContainer || !input.value.trim()) return;

        const message = input.value.trim();
        const time = new Date().toLocaleTimeString();

        // Add user message
        messagesContainer.innerHTML += `
            <div class="chat-message user">
                <div class="message-content">
                    <div class="message-text">${message}</div>
                    <div class="message-time">${time}</div>
                </div>
                <div class="message-avatar">👤</div>
            </div>
        `;

        // Auto-response
        setTimeout(() => {
            const responses = [
                "Thank you for contacting us! Let me help you with that.",
                "I understand your concern. Let me check our system for you.",
                "That's a great question! Here's what I can tell you...",
                "I'll be happy to assist you with this issue.",
                "Let me connect you with the right department for this request."
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            messagesContainer.innerHTML += `
                <div class="chat-message agent">
                    <div class="message-avatar">👩‍💼</div>
                    <div class="message-content">
                        <div class="message-text">${response}</div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);

        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    // Utility functions
    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    },

    // Enhanced User Management Control with full functionality
    getUserManagementControl() {
        return `
            <div class="admin-control-interface">
                <div class="control-header">
                    <h3>👤 User Management System</h3>
                    <div class="control-actions">
                        <button class="btn btn--primary" onclick="App.showUserForm('add')">
                            <span>➕</span> Add New User
                        </button>
                        <button class="btn btn--outline" onclick="App.exportUserData()">
                            <span>📊</span> Export Data
                        </button>
                    </div>
                </div>
                
                <div class="admin-tabs">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="App.switchAdminTab(this, 'users-overview')">
                            📊 Overview
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'users-list')">
                            👥 User Accounts
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'users-analytics')">
                            📈 Analytics
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'users-permissions')">
                            🔐 Permissions
                        </button>
                    </div>
                    
                    <div class="tab-content-container">
                        <div id="users-overview" class="admin-tab-content active">
                            <div class="overview-stats-grid">
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Total Users</h4>
                                        <span class="stat-trend positive">+12%</span>
                                    </div>
                                    <div class="stat-number">1,247</div>
                                    <div class="stat-detail">238 new this month</div>
                                </div>
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Active Today</h4>
                                        <span class="stat-trend positive">+8%</span>
                                    </div>
                                    <div class="stat-number">342</div>
                                    <div class="stat-detail">Peak: 2:30 PM</div>
                                </div>
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Premium Users</h4>
                                        <span class="stat-trend positive">+15%</span>
                                    </div>
                                    <div class="stat-number">156</div>
                                    <div class="stat-detail">12.5% conversion</div>
                                </div>
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Support Tickets</h4>
                                        <span class="stat-trend negative">-5%</span>
                                    </div>
                                    <div class="stat-number">23</div>
                                    <div class="stat-detail">Avg resolution: 2.4h</div>
                                </div>
                            </div>
                            
                            <div class="recent-activity-section">
                                <h4>Recent User Activity</h4>
                                <div class="activity-feed">
                                    <div class="activity-item">
                                        <div class="activity-icon">👤</div>
                                        <div class="activity-content">
                                            <div class="activity-text">
                                                <strong>Sarah Johnson</strong> upgraded to Premium
                                            </div>
                                            <div class="activity-time">2 minutes ago</div>
                                        </div>
                                        <div class="activity-value">+$29.99</div>
                                    </div>
                                    <div class="activity-item">
                                        <div class="activity-icon">🆕</div>
                                        <div class="activity-content">
                                            <div class="activity-text">
                                                <strong>Mike Davis</strong> created new account
                                            </div>
                                            <div class="activity-time">5 minutes ago</div>
                                        </div>
                                        <div class="activity-badge">New</div>
                                    </div>
                                    <div class="activity-item">
                                        <div class="activity-icon">🔧</div>
                                        <div class="activity-content">
                                            <div class="activity-text">
                                                <strong>Lisa Chen</strong> completed service booking
                                            </div>
                                            <div class="activity-time">8 minutes ago</div>
                                        </div>
                                        <div class="activity-value">$150</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="users-list" class="admin-tab-content">
                            <div class="users-controls">
                                <div class="search-filter-bar">
                                    <input type="search" placeholder="Search users by name, email..." class="search-input" id="user-search">
                                    <select class="filter-select" id="user-status-filter">
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                    <select class="filter-select" id="user-role-filter">
                                        <option value="">All Roles</option>
                                        <option value="customer">Customer</option>
                                        <option value="technician">Technician</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="users-table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Last Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-table-body">
                                        <tr>
                                            <td>
                                                <div class="user-info">
                                                    <div class="user-avatar">JD</div>
                                                    <div class="user-details">
                                                        <div class="user-name">John Doe</div>
                                                        <div class="user-id">#USR001</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>john.doe@example.com</td>
                                            <td><span class="role-badge customer">Customer</span></td>
                                            <td><span class="status-badge active">Active</span></td>
                                            <td>Jan 15, 2024</td>
                                            <td>2 hours ago</td>
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn-icon" onclick="App.showUserForm('edit', 'USR001')" title="Edit User">
                                                        ✏️
                                                    </button>
                                                    <button class="btn-icon" onclick="App.viewUserDetails('USR001')" title="View Details">
                                                        👁️
                                                    </button>
                                                    <button class="btn-icon danger" onclick="App.confirmDeleteUser('USR001')" title="Delete User">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="user-info">
                                                    <div class="user-avatar">SJ</div>
                                                    <div class="user-details">
                                                        <div class="user-name">Sarah Johnson</div>
                                                        <div class="user-id">#USR002</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>sarah.j@example.com</td>
                                            <td><span class="role-badge premium">Premium</span></td>
                                            <td><span class="status-badge active">Active</span></td>
                                            <td>Dec 20, 2023</td>
                                            <td>Online now</td>
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn-icon" onclick="App.showUserForm('edit', 'USR002')" title="Edit User">
                                                        ✏️
                                                    </button>
                                                    <button class="btn-icon" onclick="App.viewUserDetails('USR002')" title="View Details">
                                                        👁️
                                                    </button>
                                                    <button class="btn-icon danger" onclick="App.confirmDeleteUser('USR002')" title="Delete User">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="pagination-controls">
                                <div class="pagination-info">Showing 1-2 of 1,247 users</div>
                                <div class="pagination-buttons">
                                    <button class="btn btn--outline btn--sm" disabled>Previous</button>
                                    <button class="btn btn--primary btn--sm">1</button>
                                    <button class="btn btn--outline btn--sm">2</button>
                                    <button class="btn btn--outline btn--sm">3</button>
                                    <button class="btn btn--outline btn--sm">Next</button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="users-analytics" class="admin-tab-content">
                            <div class="analytics-dashboard">
                                <h4>User Growth Analytics</h4>
                                <div class="chart-container">
                                    <div class="chart-placeholder">
                                        <div class="chart-bars">
                                            <div class="chart-bar" style="height: 60%"></div>
                                            <div class="chart-bar" style="height: 80%"></div>
                                            <div class="chart-bar" style="height: 45%"></div>
                                            <div class="chart-bar" style="height: 90%"></div>
                                            <div class="chart-bar" style="height: 75%"></div>
                                            <div class="chart-bar" style="height: 100%"></div>
                                        </div>
                                        <div class="chart-labels">
                                            <span>Jan</span>
                                            <span>Feb</span>
                                            <span>Mar</span>
                                            <span>Apr</span>
                                            <span>May</span>
                                            <span>Jun</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="analytics-metrics">
                                    <div class="metric-card">
                                        <h5>Registration Rate</h5>
                                        <div class="metric-value">8.2 users/day</div>
                                        <div class="metric-change positive">+15% from last month</div>
                                    </div>
                                    <div class="metric-card">
                                        <h5>Retention Rate</h5>
                                        <div class="metric-value">78.5%</div>
                                        <div class="metric-change positive">+3% from last month</div>
                                    </div>
                                    <div class="metric-card">
                                        <h5>Churn Rate</h5>
                                        <div class="metric-value">2.1%</div>
                                        <div class="metric-change negative">+0.5% from last month</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="users-permissions" class="admin-tab-content">
                            <div class="permissions-management">
                                <h4>User Permissions & Roles</h4>
                                <div class="permission-matrix">
                                    <div class="permission-role">
                                        <h5>Customer Permissions</h5>
                                        <div class="permission-items">
                                            <label class="permission-item">
                                                <input type="checkbox" checked disabled>
                                                <span>Book Services</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked>
                                                <span>View Service History</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked>
                                                <span>Contact Support</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox">
                                                <span>Leave Reviews</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="permission-role">
                                        <h5>Technician Permissions</h5>
                                        <div class="permission-items">
                                            <label class="permission-item">
                                                <input type="checkbox" checked>
                                                <span>Accept Jobs</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked>
                                                <span>Update Job Status</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked>
                                                <span>Access Customer Info</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox">
                                                <span>Set Custom Pricing</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="permission-role">
                                        <h5>Admin Permissions</h5>
                                        <div class="permission-items">
                                            <label class="permission-item">
                                                <input type="checkbox" checked disabled>
                                                <span>Full System Access</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked disabled>
                                                <span>User Management</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked disabled>
                                                <span>System Configuration</span>
                                            </label>
                                            <label class="permission-item">
                                                <input type="checkbox" checked disabled>
                                                <span>Analytics Access</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="permissions-actions">
                                    <button class="btn btn--primary" onclick="App.savePermissions()">
                                        Save Permission Changes
                                    </button>
                                    <button class="btn btn--outline" onclick="App.resetPermissions()">
                                        Reset to Default
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    switchControlTab(tabBtn, contentId) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tabBtn.classList.add('active');
        document.getElementById(contentId).classList.add('active');
    },

    // Enhanced admin tab switching
    switchAdminTab(tabBtn, contentId) {
        // Remove active class from all admin tabs and content
        document.querySelectorAll('.admin-control-interface .tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tabBtn.classList.add('active');
        const targetContent = document.getElementById(contentId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    },

    // User management functions
    showUserForm(action, userId = null) {
        const modalHtml = `
            <div class="admin-modal active" id="user-form-modal">
                <div class="admin-modal-content">
                    <div class="modal-header">
                        <h3>${action === 'add' ? '➕ Add New User' : '✏️ Edit User'}</h3>
                        <button class="close-btn" onclick="App.closeUserForm()">×</button>
                    </div>
                    <div class="modal-body">
                        <form class="admin-form" id="user-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">First Name</label>
                                    <input type="text" class="form-control" id="user-first-name" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Last Name</label>
                                    <input type="text" class="form-control" id="user-last-name" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="user-email" required>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Phone Number</label>
                                    <input type="tel" class="form-control" id="user-phone" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Role</label>
                                    <select class="form-control" id="user-role" required>
                                        <option value="">Select Role</option>
                                        <option value="customer">Customer</option>
                                        <option value="technician">Technician</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-control" id="user-status">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Account Type</label>
                                    <select class="form-control" id="user-account-type">
                                        <option value="basic">Basic</option>
                                        <option value="premium">Premium</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                            </div>
                            
                            ${action === 'add' ? `
                            <div class="form-group">
                                <label class="form-label">Initial Password</label>
                                <input type="password" class="form-control" id="user-password" required>
                            </div>
                            ` : ''}
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn--outline" onclick="App.closeUserForm()">
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn--primary">
                                    ${action === 'add' ? 'Create User' : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if present
        const existingModal = document.getElementById('user-form-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Setup form submission
        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitUserForm(action, userId);
        });
        
        // If editing, populate form with existing data
        if (action === 'edit' && userId) {
            this.populateUserForm(userId);
        }
    },

    populateUserForm(userId) {
        // Demo data - in real app, this would fetch from API
        const userData = {
            'USR001': {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '(555) 123-4567',
                role: 'customer',
                status: 'active',
                accountType: 'basic'
            },
            'USR002': {
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah.j@example.com',
                phone: '(555) 987-6543',
                role: 'customer',
                status: 'active',
                accountType: 'premium'
            }
        };
        
        const data = userData[userId];
        if (data) {
            document.getElementById('user-first-name').value = data.firstName;
            document.getElementById('user-last-name').value = data.lastName;
            document.getElementById('user-email').value = data.email;
            document.getElementById('user-phone').value = data.phone;
            document.getElementById('user-role').value = data.role;
            document.getElementById('user-status').value = data.status;
            document.getElementById('user-account-type').value = data.accountType;
        }
    },

    submitUserForm(action, userId) {
        // Get form data
        const formData = {
            firstName: document.getElementById('user-first-name').value,
            lastName: document.getElementById('user-last-name').value,
            email: document.getElementById('user-email').value,
            phone: document.getElementById('user-phone').value,
            role: document.getElementById('user-role').value,
            status: document.getElementById('user-status').value,
            accountType: document.getElementById('user-account-type').value
        };
        
        if (action === 'add') {
            formData.password = document.getElementById('user-password').value;
        }
        
        // Validate form
        if (!this.validateUserForm(formData, action)) {
            return;
        }
        
        // Simulate API call
        this.showToast(`User ${action === 'add' ? 'created' : 'updated'} successfully!`);
        this.closeUserForm();
        
        // In real app, this would refresh the user list
        console.log('User form submitted:', { action, userId, formData });
    },

    validateUserForm(data, action) {
        const errors = [];
        
        if (!data.firstName.trim()) errors.push('First name is required');
        if (!data.lastName.trim()) errors.push('Last name is required');
        if (!data.email.trim()) errors.push('Email is required');
        if (!data.phone.trim()) errors.push('Phone is required');
        if (!data.role) errors.push('Role is required');
        
        if (action === 'add' && !data.password) {
            errors.push('Password is required');
        }
        
        if (errors.length > 0) {
            this.showToast(errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    },

    closeUserForm() {
        const modal = document.getElementById('user-form-modal');
        if (modal) {
            modal.remove();
        }
    },

    viewUserDetails(userId) {
        this.showToast(`Viewing details for user ${userId}`);
        // In real app, this would open a detailed view modal
    },

    confirmDeleteUser(userId) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            this.deleteUser(userId);
        }
    },

    deleteUser(userId) {
        // Simulate API call
        this.showToast(`User ${userId} deleted successfully`);
        // In real app, this would remove the user from the list
    },

    exportUserData() {
        this.showToast('Exporting user data...');
        // Simulate export
        setTimeout(() => {
            this.showToast('User data exported successfully!');
        }, 1500);
    },

    savePermissions() {
        this.showToast('Permissions updated successfully!');
        // In real app, this would save permission changes
    },

    resetPermissions() {
        if (confirm('Reset all permissions to default settings?')) {
            this.showToast('Permissions reset to default');
            // In real app, this would reset permissions
        }
    },

    getTechnicianManagementControl() {
        return `
            <div class="admin-control-interface">
                <div class="control-header">
                    <h3>🔧 Technician Management System</h3>
                    <div class="control-actions">
                        <button class="btn btn--primary" onclick="App.showTechnicianForm('add')">
                            <span>➕</span> Add Technician
                        </button>
                        <button class="btn btn--outline" onclick="App.assignJobs()">
                            <span>📋</span> Assign Jobs
                        </button>
                    </div>
                </div>
                
                <div class="admin-tabs">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="App.switchAdminTab(this, 'techs-overview')">
                            📊 Overview
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'techs-active')">
                            👷 Active Technicians
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'techs-assignments')">
                            📋 Job Assignments
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'techs-performance')">
                            📈 Performance
                        </button>
                    </div>
                    
                    <div class="tab-content-container">
                        <div id="techs-overview" class="admin-tab-content active">
                            <div class="overview-stats-grid">
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Active Technicians</h4>
                                        <span class="stat-trend positive">+3</span>
                                    </div>
                                    <div class="stat-number">89</div>
                                    <div class="stat-detail">67 currently available</div>
                                </div>
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Jobs in Progress</h4>
                                        <span class="stat-trend neutral">22</span>
                                    </div>
                                    <div class="stat-number">22</div>
                                    <div class="stat-detail">8 high priority</div>
                                </div>
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Avg Response Time</h4>
                                        <span class="stat-trend positive">-2min</span>
                                    </div>
                                    <div class="stat-number">12min</div>
                                    <div class="stat-detail">Target: 15min</div>
                                </div>
                                <div class="overview-stat">
                                    <div class="stat-header">
                                        <h4>Customer Rating</h4>
                                        <span class="stat-trend positive">+0.2</span>
                                    </div>
                                    <div class="stat-number">4.8★</div>
                                    <div class="stat-detail">98% satisfaction</div>
                                </div>
                            </div>
                            
                            <div class="technician-map-section">
                                <h4>Live Technician Locations</h4>
                                <div class="map-container">
                                    <div class="map-placeholder">
                                        <div class="map-markers">
                                            <div class="map-marker active" style="top: 20%; left: 30%">🚗</div>
                                            <div class="map-marker busy" style="top: 60%; left: 70%">🔧</div>
                                            <div class="map-marker available" style="top: 40%; left: 50%">📍</div>
                                            <div class="map-marker busy" style="top: 80%; left: 20%">🚛</div>
                                        </div>
                                        <div class="map-legend">
                                            <div class="legend-item">🚗 En Route</div>
                                            <div class="legend-item">🔧 Working</div>
                                            <div class="legend-item">📍 Available</div>
                                            <div class="legend-item">🚛 Returning</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="techs-active" class="admin-tab-content">
                            <div class="technicians-grid">
                                <div class="technician-card">
                                    <div class="tech-header">
                                        <div class="tech-avatar">MR</div>
                                        <div class="tech-info">
                                            <h5>Mike Rodriguez</h5>
                                            <div class="tech-id">#TECH001</div>
                                            <div class="tech-status available">Available</div>
                                        </div>
                                        <div class="tech-rating">⭐ 4.9</div>
                                    </div>
                                    <div class="tech-details">
                                        <div class="detail-row">
                                            <span>Specialization:</span>
                                            <span>Towing, Battery</span>
                                        </div>
                                        <div class="detail-row">
                                            <span>Current Location:</span>
                                            <span>Downtown Area</span>
                                        </div>
                                        <div class="detail-row">
                                            <span>Jobs Today:</span>
                                            <span>8 completed</span>
                                        </div>
                                    </div>
                                    <div class="tech-actions">
                                        <button class="btn btn--sm btn--primary" onclick="App.assignJobToTechnician('TECH001')">
                                            Assign Job
                                        </button>
                                        <button class="btn btn--sm btn--outline" onclick="App.contactTechnician('TECH001')">
                                            Contact
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="technician-card">
                                    <div class="tech-header">
                                        <div class="tech-avatar">SW</div>
                                        <div class="tech-info">
                                            <h5>Sarah Wilson</h5>
                                            <div class="tech-id">#TECH002</div>
                                            <div class="tech-status busy">On Job</div>
                                        </div>
                                        <div class="tech-rating">⭐ 4.7</div>
                                    </div>
                                    <div class="tech-details">
                                        <div class="detail-row">
                                            <span>Specialization:</span>
                                            <span>Tire Change, Lockout</span>
                                        </div>
                                        <div class="detail-row">
                                            <span>Current Job:</span>
                                            <span>Tire Change #TC104</span>
                                        </div>
                                        <div class="detail-row">
                                            <span>ETA:</span>
                                            <span>15 minutes</span>
                                        </div>
                                    </div>
                                    <div class="tech-actions">
                                        <button class="btn btn--sm btn--outline" disabled>
                                            Currently Busy
                                        </button>
                                        <button class="btn btn--sm btn--outline" onclick="App.contactTechnician('TECH002')">
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="techs-assignments" class="admin-tab-content">
                            <div class="assignments-container">
                                <div class="assignment-filters">
                                    <select class="filter-select">
                                        <option value="">All Priorities</option>
                                        <option value="high">High Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="low">Low Priority</option>
                                    </select>
                                    <select class="filter-select">
                                        <option value="">All Services</option>
                                        <option value="towing">Towing</option>
                                        <option value="battery">Battery Jump</option>
                                        <option value="tire">Tire Change</option>
                                    </select>
                                </div>
                                
                                <div class="assignments-list">
                                    <div class="assignment-item priority-high">
                                        <div class="assignment-header">
                                            <div class="assignment-info">
                                                <h5>Battery Jump - #BJ105</h5>
                                                <div class="assignment-customer">Customer: Lisa Chen</div>
                                            </div>
                                            <div class="assignment-priority">
                                                <span class="priority-badge high">High Priority</span>
                                            </div>
                                        </div>
                                        <div class="assignment-details">
                                            <div class="detail-item">
                                                <span>📍 Location:</span>
                                                <span>123 Oak Street, Downtown</span>
                                            </div>
                                            <div class="detail-item">
                                                <span>⏰ Requested:</span>
                                                <span>5 minutes ago</span>
                                            </div>
                                            <div class="detail-item">
                                                <span>👤 Assigned to:</span>
                                                <span>Mike Rodriguez</span>
                                            </div>
                                        </div>
                                        <div class="assignment-actions">
                                            <button class="btn btn--sm btn--outline" onclick="App.viewAssignmentDetails('BJ105')">
                                                View Details
                                            </button>
                                            <button class="btn btn--sm btn--primary" onclick="App.reassignJob('BJ105')">
                                                Reassign
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="assignment-item priority-medium">
                                        <div class="assignment-header">
                                            <div class="assignment-info">
                                                <h5>Tire Change - #TC106</h5>
                                                <div class="assignment-customer">Customer: David Kim</div>
                                            </div>
                                            <div class="assignment-priority">
                                                <span class="priority-badge medium">Medium Priority</span>
                                            </div>
                                        </div>
                                        <div class="assignment-details">
                                            <div class="detail-item">
                                                <span>📍 Location:</span>
                                                <span>456 Pine Avenue, Midtown</span>
                                            </div>
                                            <div class="detail-item">
                                                <span>⏰ Scheduled:</span>
                                                <span>2:30 PM</span>
                                            </div>
                                            <div class="detail-item">
                                                <span>👤 Status:</span>
                                                <span>Unassigned</span>
                                            </div>
                                        </div>
                                        <div class="assignment-actions">
                                            <button class="btn btn--sm btn--outline" onclick="App.viewAssignmentDetails('TC106')">
                                                View Details
                                            </button>
                                            <button class="btn btn--sm btn--primary" onclick="App.assignJobFromPool('TC106')">
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="techs-performance" class="admin-tab-content">
                            <div class="performance-dashboard">
                                <div class="performance-metrics">
                                    <div class="metric-card">
                                        <h5>Average Response Time</h5>
                                        <div class="metric-value">12.5 min</div>
                                        <div class="metric-change positive">-2.1 min from last week</div>
                                        <div class="metric-chart">
                                            <div class="mini-chart">
                                                <div class="chart-bar" style="height: 60%"></div>
                                                <div class="chart-bar" style="height: 80%"></div>
                                                <div class="chart-bar" style="height: 45%"></div>
                                                <div class="chart-bar" style="height: 70%"></div>
                                                <div class="chart-bar" style="height: 90%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="metric-card">
                                        <h5>Job Completion Rate</h5>
                                        <div class="metric-value">96.8%</div>
                                        <div class="metric-change positive">+1.2% from last week</div>
                                        <div class="metric-chart">
                                            <div class="mini-chart">
                                                <div class="chart-bar" style="height: 90%"></div>
                                                <div class="chart-bar" style="height: 85%"></div>
                                                <div class="chart-bar" style="height: 95%"></div>
                                                <div class="chart-bar" style="height: 92%"></div>
                                                <div class="chart-bar" style="height: 97%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="metric-card">
                                        <h5>Customer Satisfaction</h5>
                                        <div class="metric-value">4.8★</div>
                                        <div class="metric-change positive">+0.1★ from last week</div>
                                        <div class="metric-chart">
                                            <div class="mini-chart">
                                                <div class="chart-bar" style="height: 85%"></div>
                                                <div class="chart-bar" style="height: 90%"></div>
                                                <div class="chart-bar" style="height: 88%"></div>
                                                <div class="chart-bar" style="height: 93%"></div>
                                                <div class="chart-bar" style="height: 96%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="top-performers">
                                    <h4>Top Performing Technicians</h4>
                                    <div class="performers-list">
                                        <div class="performer-item">
                                            <div class="performer-rank">1</div>
                                            <div class="performer-info">
                                                <div class="performer-name">Mike Rodriguez</div>
                                                <div class="performer-stats">8 jobs • 4.9★ • 10min avg</div>
                                            </div>
                                            <div class="performer-score">98%</div>
                                        </div>
                                        <div class="performer-item">
                                            <div class="performer-rank">2</div>
                                            <div class="performer-info">
                                                <div class="performer-name">Sarah Wilson</div>
                                                <div class="performer-stats">7 jobs • 4.7★ • 12min avg</div>
                                            </div>
                                            <div class="performer-score">95%</div>
                                        </div>
                                        <div class="performer-item">
                                            <div class="performer-rank">3</div>
                                            <div class="performer-info">
                                                <div class="performer-name">Alex Thompson</div>
                                                <div class="performer-stats">6 jobs • 4.6★ • 14min avg</div>
                                            </div>
                                            <div class="performer-score">92%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Technician management functions
    showTechnicianForm(action, techId = null) {
        this.showToast(`${action === 'add' ? 'Adding new' : 'Editing'} technician form`);
        // Implementation similar to user form
    },

    assignJobs() {
        this.showToast('Opening job assignment interface');
    },

    assignJobToTechnician(techId) {
        this.showToast(`Assigning job to technician ${techId}`);
    },

    contactTechnician(techId) {
        this.showToast(`Contacting technician ${techId}`);
    },

    viewAssignmentDetails(jobId) {
        this.showToast(`Viewing details for job ${jobId}`);
    },

    reassignJob(jobId) {
        this.showToast(`Reassigning job ${jobId}`);
    },

    assignJobFromPool(jobId) {
        this.showToast(`Assigning job ${jobId} from pool`);
    },

    getAnalyticsControl() {
        return `
            <div class="admin-control-interface">
                <div class="control-header">
                    <h3>📈 Analytics Dashboard</h3>
                    <div class="control-actions">
                        <button class="btn btn--primary" onclick="App.exportAnalytics()">
                            <span>📊</span> Export Report
                        </button>
                        <button class="btn btn--outline" onclick="App.refreshAnalytics()">
                            <span>🔄</span> Refresh Data
                        </button>
                    </div>
                </div>
                
                <div class="admin-tabs">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="App.switchAdminTab(this, 'analytics-overview')">
                            📊 Overview
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'analytics-revenue')">
                            💰 Revenue
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'analytics-services')">
                            🔧 Services
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'analytics-geographic')">
                            🗺️ Geographic
                        </button>
                    </div>
                    
                    <div class="tab-content-container">
                        <div id="analytics-overview" class="admin-tab-content active">
                            <div class="kpi-dashboard">
                                <div class="kpi-grid">
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <div class="kpi-title">Total Revenue</div>
                                            <div class="kpi-period">This Month</div>
                                        </div>
                                        <div class="kpi-value">$247,892</div>
                                        <div class="kpi-change positive">
                                            <span class="change-icon">↗</span>
                                            <span>+18.5% from last month</span>
                                        </div>
                                        <div class="kpi-chart">
                                            <div class="trend-line">
                                                <div class="trend-point" style="height: 40%"></div>
                                                <div class="trend-point" style="height: 60%"></div>
                                                <div class="trend-point" style="height: 45%"></div>
                                                <div class="trend-point" style="height: 80%"></div>
                                                <div class="trend-point" style="height: 75%"></div>
                                                <div class="trend-point" style="height: 95%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <div class="kpi-title">Services Completed</div>
                                            <div class="kpi-period">Today</div>
                                        </div>
                                        <div class="kpi-value">1,847</div>
                                        <div class="kpi-change positive">
                                            <span class="change-icon">↗</span>
                                            <span>+12% from yesterday</span>
                                        </div>
                                        <div class="kpi-chart">
                                            <div class="trend-line">
                                                <div class="trend-point" style="height: 70%"></div>
                                                <div class="trend-point" style="height: 85%"></div>
                                                <div class="trend-point" style="height: 65%"></div>
                                                <div class="trend-point" style="height: 90%"></div>
                                                <div class="trend-point" style="height: 80%"></div>
                                                <div class="trend-point" style="height: 100%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <div class="kpi-title">Customer Satisfaction</div>
                                            <div class="kpi-period">Overall</div>
                                        </div>
                                        <div class="kpi-value">4.8★</div>
                                        <div class="kpi-change positive">
                                            <span class="change-icon">↗</span>
                                            <span>+0.2 from last month</span>
                                        </div>
                                        <div class="satisfaction-breakdown">
                                            <div class="rating-bar">
                                                <span>5★</span>
                                                <div class="bar"><div style="width: 85%"></div></div>
                                                <span>85%</span>
                                            </div>
                                            <div class="rating-bar">
                                                <span>4★</span>
                                                <div class="bar"><div style="width: 12%"></div></div>
                                                <span>12%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <div class="kpi-title">Response Time</div>
                                            <div class="kpi-period">Average</div>
                                        </div>
                                        <div class="kpi-value">12.5min</div>
                                        <div class="kpi-change positive">
                                            <span class="change-icon">↘</span>
                                            <span>-2.1min improvement</span>
                                        </div>
                                        <div class="response-breakdown">
                                            <div class="response-item">
                                                <span>Emergency:</span>
                                                <span>8.2min</span>
                                            </div>
                                            <div class="response-item">
                                                <span>Standard:</span>
                                                <span>14.7min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="analytics-summary">
                                <div class="summary-section">
                                    <h4>Performance Summary</h4>
                                    <div class="summary-grid">
                                        <div class="summary-item">
                                            <div class="summary-label">Peak Hour</div>
                                            <div class="summary-value">2:00 PM - 3:00 PM</div>
                                        </div>
                                        <div class="summary-item">
                                            <div class="summary-label">Most Requested Service</div>
                                            <div class="summary-value">Battery Jump (38%)</div>
                                        </div>
                                        <div class="summary-item">
                                            <div class="summary-label">Busiest Day</div>
                                            <div class="summary-value">Friday</div>
                                        </div>
                                        <div class="summary-item">
                                            <div class="summary-label">Revenue Growth</div>
                                            <div class="summary-value">+18.5% MoM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="analytics-revenue" class="admin-tab-content">
                            <div class="revenue-analytics">
                                <div class="revenue-chart-container">
                                    <h4>Revenue Trend Analysis</h4>
                                    <div class="chart-controls">
                                        <select class="chart-filter">
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly" selected>Monthly</option>
                                        </select>
                                    </div>
                                    <div class="revenue-chart">
                                        <div class="chart-bars">
                                            <div class="chart-bar" style="height: 45%" data-value="$18.2k">
                                                <div class="bar-value">$18.2k</div>
                                            </div>
                                            <div class="chart-bar" style="height: 60%" data-value="$24.1k">
                                                <div class="bar-value">$24.1k</div>
                                            </div>
                                            <div class="chart-bar" style="height: 55%" data-value="$22.3k">
                                                <div class="bar-value">$22.3k</div>
                                            </div>
                                            <div class="chart-bar" style="height: 80%" data-value="$32.1k">
                                                <div class="bar-value">$32.1k</div>
                                            </div>
                                            <div class="chart-bar" style="height: 90%" data-value="$36.2k">
                                                <div class="bar-value">$36.2k</div>
                                            </div>
                                            <div class="chart-bar" style="height: 100%" data-value="$40.1k">
                                                <div class="bar-value">$40.1k</div>
                                            </div>
                                        </div>
                                        <div class="chart-labels">
                                            <span>Jan</span>
                                            <span>Feb</span>
                                            <span>Mar</span>
                                            <span>Apr</span>
                                            <span>May</span>
                                            <span>Jun</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="revenue-breakdown">
                                    <h4>Revenue by Service Type</h4>
                                    <div class="service-revenue-list">
                                        <div class="service-revenue-item">
                                            <div class="service-info">
                                                <div class="service-icon">🚛</div>
                                                <div class="service-details">
                                                    <div class="service-name">Towing</div>
                                                    <div class="service-count">847 services</div>
                                                </div>
                                            </div>
                                            <div class="service-revenue">
                                                <div class="revenue-amount">$127,050</div>
                                                <div class="revenue-percentage">38.2%</div>
                                            </div>
                                        </div>
                                        
                                        <div class="service-revenue-item">
                                            <div class="service-info">
                                                <div class="service-icon">🔋</div>
                                                <div class="service-details">
                                                    <div class="service-name">Battery Jump</div>
                                                    <div class="service-count">1,247 services</div>
                                                </div>
                                            </div>
                                            <div class="service-revenue">
                                                <div class="revenue-amount">$93,525</div>
                                                <div class="revenue-percentage">28.1%</div>
                                            </div>
                                        </div>
                                        
                                        <div class="service-revenue-item">
                                            <div class="service-info">
                                                <div class="service-icon">🛞</div>
                                                <div class="service-details">
                                                    <div class="service-name">Tire Change</div>
                                                    <div class="service-count">623 services</div>
                                                </div>
                                            </div>
                                            <div class="service-revenue">
                                                <div class="revenue-amount">$62,300</div>
                                                <div class="revenue-percentage">18.7%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="analytics-services" class="admin-tab-content">
                            <div class="services-analytics">
                                <div class="service-performance-grid">
                                    <div class="service-performance-card">
                                        <div class="service-header">
                                            <div class="service-icon">🚛</div>
                                            <div class="service-title">
                                                <h5>Towing Services</h5>
                                                <div class="service-subtitle">Heavy duty operations</div>
                                            </div>
                                        </div>
                                        <div class="service-metrics">
                                            <div class="metric-item">
                                                <span class="metric-label">Total Requests</span>
                                                <span class="metric-value">847</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Avg Response Time</span>
                                                <span class="metric-value">22min</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Success Rate</span>
                                                <span class="metric-value">94.2%</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Avg Rating</span>
                                                <span class="metric-value">4.6★</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="service-performance-card">
                                        <div class="service-header">
                                            <div class="service-icon">🔋</div>
                                            <div class="service-title">
                                                <h5>Battery Jump</h5>
                                                <div class="service-subtitle">Quick electrical service</div>
                                            </div>
                                        </div>
                                        <div class="service-metrics">
                                            <div class="metric-item">
                                                <span class="metric-label">Total Requests</span>
                                                <span class="metric-value">1,247</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Avg Response Time</span>
                                                <span class="metric-value">8min</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Success Rate</span>
                                                <span class="metric-value">98.7%</span>
                                            </div>
                                            <div class="metric-item">
                                                <span class="metric-label">Avg Rating</span>
                                                <span class="metric-value">4.9★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="demand-analysis">
                                    <h4>Service Demand Patterns</h4>
                                    <div class="demand-chart">
                                        <div class="hourly-demand">
                                            <div class="hour-bar" style="height: 20%" data-hour="6"></div>
                                            <div class="hour-bar" style="height: 30%" data-hour="7"></div>
                                            <div class="hour-bar" style="height: 45%" data-hour="8"></div>
                                            <div class="hour-bar" style="height: 60%" data-hour="9"></div>
                                            <div class="hour-bar" style="height: 75%" data-hour="10"></div>
                                            <div class="hour-bar" style="height: 90%" data-hour="11"></div>
                                            <div class="hour-bar" style="height: 85%" data-hour="12"></div>
                                            <div class="hour-bar" style="height: 95%" data-hour="13"></div>
                                            <div class="hour-bar" style="height: 100%" data-hour="14"></div>
                                            <div class="hour-bar" style="height: 88%" data-hour="15"></div>
                                            <div class="hour-bar" style="height: 70%" data-hour="16"></div>
                                            <div class="hour-bar" style="height: 55%" data-hour="17"></div>
                                        </div>
                                        <div class="hour-labels">
                                            <span>6AM</span>
                                            <span>8AM</span>
                                            <span>10AM</span>
                                            <span>12PM</span>
                                            <span>2PM</span>
                                            <span>4PM</span>
                                            <span>6PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="analytics-geographic" class="admin-tab-content">
                            <div class="geographic-analytics">
                                <div class="coverage-map">
                                    <h4>Service Coverage & Performance by Region</h4>
                                    <div class="map-container">
                                        <div class="coverage-map-placeholder">
                                            <div class="region-overlay high-demand" style="top: 20%; left: 30%; width: 25%; height: 20%">
                                                <div class="region-label">Downtown</div>
                                                <div class="region-stats">847 services</div>
                                            </div>
                                            <div class="region-overlay medium-demand" style="top: 50%; left: 60%; width: 30%; height: 25%">
                                                <div class="region-label">Suburbs</div>
                                                <div class="region-stats">623 services</div>
                                            </div>
                                            <div class="region-overlay low-demand" style="top: 70%; left: 10%; width: 20%; height: 15%">
                                                <div class="region-label">Industrial</div>
                                                <div class="region-stats">234 services</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="map-legend">
                                        <div class="legend-item">
                                            <div class="legend-color high-demand"></div>
                                            <span>High Demand (800+ services)</span>
                                        </div>
                                        <div class="legend-item">
                                            <div class="legend-color medium-demand"></div>
                                            <span>Medium Demand (400-800 services)</span>
                                        </div>
                                        <div class="legend-item">
                                            <div class="legend-color low-demand"></div>
                                            <span>Low Demand (<400 services)</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="regional-breakdown">
                                    <h4>Regional Performance Breakdown</h4>
                                    <div class="region-stats-list">
                                        <div class="region-stat-item">
                                            <div class="region-info">
                                                <h5>Downtown District</h5>
                                                <div class="region-details">High-density urban area</div>
                                            </div>
                                            <div class="region-metrics">
                                                <div class="region-metric">
                                                    <span>Services:</span>
                                                    <span>847</span>
                                                </div>
                                                <div class="region-metric">
                                                    <span>Avg Response:</span>
                                                    <span>8.5min</span>
                                                </div>
                                                <div class="region-metric">
                                                    <span>Rating:</span>
                                                    <span>4.8★</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="region-stat-item">
                                            <div class="region-info">
                                                <h5>Suburban Areas</h5>
                                                <div class="region-details">Residential neighborhoods</div>
                                            </div>
                                            <div class="region-metrics">
                                                <div class="region-metric">
                                                    <span>Services:</span>
                                                    <span>623</span>
                                                </div>
                                                <div class="region-metric">
                                                    <span>Avg Response:</span>
                                                    <span>15.2min</span>
                                                </div>
                                                <div class="region-metric">
                                                    <span>Rating:</span>
                                                    <span>4.7★</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Analytics functions
    exportAnalytics() {
        this.showToast('Exporting analytics report...');
        setTimeout(() => {
            this.showToast('Analytics report exported successfully!');
        }, 1500);
    },

    refreshAnalytics() {
        this.showToast('Refreshing analytics data...');
        setTimeout(() => {
            this.showToast('Analytics data updated!');
        }, 1000);
    },

    getSystemSettingsControl() {
        return `
            <div class="admin-control-interface">
                <div class="control-header">
                    <h3>⚙️ System Settings</h3>
                    <div class="control-actions">
                        <button class="btn btn--primary" onclick="App.saveAllSettings()">
                            <span>💾</span> Save All Changes
                        </button>
                        <button class="btn btn--outline" onclick="App.resetToDefaults()">
                            <span>🔄</span> Reset to Defaults
                        </button>
                    </div>
                </div>
                
                <div class="admin-tabs">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="App.switchAdminTab(this, 'settings-general')">
                            ⚙️ General
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'settings-services')">
                            🔧 Services
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'settings-notifications')">
                            🔔 Notifications
                        </button>
                        <button class="tab-btn" onclick="App.switchAdminTab(this, 'settings-security')">
                            🛡️ Security
                        </button>
                    </div>
                    
                    <div class="tab-content-container">
                        <div id="settings-general" class="admin-tab-content active">
                            <div class="settings-section">
                                <h4>System Configuration</h4>
                                <div class="settings-form">
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">System Name</label>
                                            <div class="setting-description">Display name for the application</div>
                                        </div>
                                        <div class="setting-control">
                                            <input type="text" class="form-control" value="RoadSide+ Emergency" id="system-name">
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Maintenance Mode</label>
                                            <div class="setting-description">Temporarily disable user access</div>
                                        </div>
                                        <div class="setting-control">
                                            <label class="toggle-switch">
                                                <input type="checkbox" id="maintenance-mode">
                                                <span class="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Operating Hours</label>
                                            <div class="setting-description">Service availability window</div>
                                        </div>
                                        <div class="setting-control">
                                            <div class="time-range">
                                                <input type="time" class="form-control" value="06:00" id="start-time">
                                                <span>to</span>
                                                <input type="time" class="form-control" value="22:00" id="end-time">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Maximum Response Time</label>
                                            <div class="setting-description">Target response time for all services</div>
                                        </div>
                                        <div class="setting-control">
                                            <div class="input-with-unit">
                                                <input type="number" class="form-control" value="15" id="max-response-time">
                                                <span class="input-unit">minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Auto-Assignment</label>
                                            <div class="setting-description">Automatically assign jobs to available technicians</div>
                                        </div>
                                        <div class="setting-control">
                                            <label class="toggle-switch">
                                                <input type="checkbox" checked id="auto-assignment">
                                                <span class="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Service Area Radius</label>
                                            <div class="setting-description">Maximum distance for service coverage</div>
                                        </div>
                                        <div class="setting-control">
                                            <div class="input-with-unit">
                                                <input type="number" class="form-control" value="50" id="service-radius">
                                                <span class="input-unit">miles</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="settings-section">
                                <h4>Data & Backup</h4>
                                <div class="backup-controls">
                                    <div class="backup-item">
                                        <div class="backup-info">
                                            <h5>Automatic Backup</h5>
                                            <p>Last backup: Today at 3:00 AM</p>
                                        </div>
                                        <button class="btn btn--outline" onclick="App.runBackup()">
                                            Run Backup Now
                                        </button>
                                    </div>
                                    <div class="backup-item">
                                        <div class="backup-info">
                                            <h5>Data Retention</h5>
                                            <p>Keep records for 2 years</p>
                                        </div>
                                        <button class="btn btn--outline" onclick="App.configureRetention()">
                                            Configure
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="settings-services" class="admin-tab-content">
                            <div class="services-settings">
                                <h4>Service Configuration & Pricing</h4>
                                <div class="service-pricing-list">
                                    <div class="service-pricing-item">
                                        <div class="service-info">
                                            <div class="service-icon">🚛</div>
                                            <div class="service-details">
                                                <h5>Towing Service</h5>
                                                <div class="service-description">Vehicle towing and recovery</div>
                                            </div>
                                        </div>
                                        <div class="service-controls">
                                            <div class="price-control">
                                                <label>Base Price:</label>
                                                <div class="input-with-unit">
                                                    <span class="input-unit">$</span>
                                                    <input type="number" class="form-control" value="150" id="towing-price">
                                                </div>
                                            </div>
                                            <div class="service-toggle">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked>
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="service-pricing-item">
                                        <div class="service-info">
                                            <div class="service-icon">🔋</div>
                                            <div class="service-details">
                                                <h5>Battery Jump</h5>
                                                <div class="service-description">Emergency battery assistance</div>
                                            </div>
                                        </div>
                                        <div class="service-controls">
                                            <div class="price-control">
                                                <label>Base Price:</label>
                                                <div class="input-with-unit">
                                                    <span class="input-unit">$</span>
                                                    <input type="number" class="form-control" value="75" id="battery-price">
                                                </div>
                                            </div>
                                            <div class="service-toggle">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked>
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="service-pricing-item">
                                        <div class="service-info">
                                            <div class="service-icon">🛞</div>
                                            <div class="service-details">
                                                <h5>Tire Change</h5>
                                                <div class="service-description">Flat tire replacement service</div>
                                            </div>
                                        </div>
                                        <div class="service-controls">
                                            <div class="price-control">
                                                <label>Base Price:</label>
                                                <div class="input-with-unit">
                                                    <span class="input-unit">$</span>
                                                    <input type="number" class="form-control" value="100" id="tire-price">
                                                </div>
                                            </div>
                                            <div class="service-toggle">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked>
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="pricing-settings">
                                    <h5>Pricing Rules</h5>
                                    <div class="pricing-rule-item">
                                        <div class="rule-info">
                                            <label class="setting-label">Emergency Surcharge</label>
                                            <div class="setting-description">Additional fee for emergency services</div>
                                        </div>
                                        <div class="rule-control">
                                            <div class="input-with-unit">
                                                <input type="number" class="form-control" value="25" id="emergency-surcharge">
                                                <span class="input-unit">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="pricing-rule-item">
                                        <div class="rule-info">
                                            <label class="setting-label">Distance Multiplier</label>
                                            <div class="setting-description">Additional cost per mile beyond base radius</div>
                                        </div>
                                        <div class="rule-control">
                                            <div class="input-with-unit">
                                                <span class="input-unit">$</span>
                                                <input type="number" class="form-control" value="2.50" step="0.25" id="distance-multiplier">
                                                <span class="input-unit">/mile</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="settings-notifications" class="admin-tab-content">
                            <div class="notification-settings">
                                <div class="notification-section">
                                    <h4>Email Notifications</h4>
                                    <div class="notification-list">
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">New User Registration</label>
                                                <div class="notification-description">Send email when new users register</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked id="email-new-user">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">Service Completion</label>
                                                <div class="notification-description">Email confirmation after service completion</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked id="email-service-complete">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">Daily Reports</label>
                                                <div class="notification-description">Daily analytics and performance reports</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" id="email-daily-reports">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="notification-section">
                                    <h4>SMS Notifications</h4>
                                    <div class="notification-list">
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">Technician Arrival</label>
                                                <div class="notification-description">SMS when technician is 5 minutes away</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked id="sms-arrival">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">Emergency Alerts</label>
                                                <div class="notification-description">Critical system alerts via SMS</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked id="sms-emergency">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="notification-section">
                                    <h4>Push Notifications</h4>
                                    <div class="notification-list">
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">Job Assignments</label>
                                                <div class="notification-description">Notify technicians of new job assignments</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked id="push-assignments">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="notification-item">
                                            <div class="notification-info">
                                                <label class="notification-label">Status Updates</label>
                                                <div class="notification-description">Real-time service status updates</div>
                                            </div>
                                            <div class="notification-control">
                                                <label class="toggle-switch">
                                                    <input type="checkbox" checked id="push-status">
                                                    <span class="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="settings-security" class="admin-tab-content">
                            <div class="security-settings">
                                <div class="security-section">
                                    <h4>Authentication & Access Control</h4>
                                    <div class="security-setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Two-Factor Authentication</label>
                                            <div class="setting-description">Require 2FA for all admin accounts</div>
                                        </div>
                                        <div class="setting-control">
                                            <label class="toggle-switch">
                                                <input type="checkbox" checked id="require-2fa">
                                                <span class="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="security-setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Session Timeout</label>
                                            <div class="setting-description">Automatic logout after inactivity</div>
                                        </div>
                                        <div class="setting-control">
                                            <select class="form-control" id="session-timeout">
                                                <option value="15">15 minutes</option>
                                                <option value="30" selected>30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="security-setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Password Requirements</label>
                                            <div class="setting-description">Minimum security requirements for passwords</div>
                                        </div>
                                        <div class="setting-control">
                                            <div class="password-requirements">
                                                <label class="checkbox-label">
                                                    <input type="checkbox" checked> Minimum 8 characters
                                                </label>
                                                <label class="checkbox-label">
                                                    <input type="checkbox" checked> Require uppercase letter
                                                </label>
                                                <label class="checkbox-label">
                                                    <input type="checkbox" checked> Require number
                                                </label>
                                                <label class="checkbox-label">
                                                    <input type="checkbox"> Require special character
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="security-section">
                                    <h4>Data Protection</h4>
                                    <div class="security-setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Data Encryption</label>
                                            <div class="setting-description">Encrypt sensitive customer data</div>
                                        </div>
                                        <div class="setting-control">
                                            <label class="toggle-switch">
                                                <input type="checkbox" checked disabled>
                                                <span class="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="security-setting-item">
                                        <div class="setting-info">
                                            <label class="setting-label">Access Logging</label>
                                            <div class="setting-description">Log all admin system access</div>
                                        </div>
                                        <div class="setting-control">
                                            <label class="toggle-switch">
                                                <input type="checkbox" checked id="access-logging">
                                                <span class="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="security-section">
                                    <h4>Recent Security Events</h4>
                                    <div class="security-log">
                                        <div class="log-entry">
                                            <div class="log-time">2024-01-15 14:23:15</div>
                                            <div class="log-event">Admin login: john.admin@roadside.com</div>
                                            <div class="log-status success">✓ Success</div>
                                        </div>
                                        <div class="log-entry">
                                            <div class="log-time">2024-01-15 14:20:45</div>
                                            <div class="log-event">Password change: sarah.admin@roadside.com</div>
                                            <div class="log-status success">✓ Success</div>
                                        </div>
                                        <div class="log-entry">
                                            <div class="log-time">2024-01-15 14:18:30</div>
                                            <div class="log-event">Failed login attempt: unknown@hacker.com</div>
                                            <div class="log-status error">✗ Blocked</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // System settings functions
    saveAllSettings() {
        this.showToast('Saving all system settings...');
        setTimeout(() => {
            this.showToast('All settings saved successfully!');
        }, 1500);
    },

    resetToDefaults() {
        if (confirm('Reset all settings to default values? This action cannot be undone.')) {
            this.showToast('Settings reset to defaults');
        }
    },

    runBackup() {
        this.showToast('Starting system backup...');
        setTimeout(() => {
            this.showToast('Backup completed successfully!');
        }, 2000);
    },

    configureRetention() {
        this.showToast('Opening data retention configuration');
    },

    getFAQContent() {
        return `
            <div class="faq-categories">
                <div class="faq-category">
                    <h3>🛠️ Service & Booking</h3>
                    <div class="faq-item">
                        <div class="faq-question" onclick="App.toggleFAQ(this)">
                            How do I book a service?
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            To book a service, select the service you need from the dashboard, enter your location and problem description, choose your payment method, and confirm your booking.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="App.toggleFAQ(this)">
                            How long does it take for a technician to arrive?
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            Average response time is 30 minutes for most services. Emergency services have priority and typically arrive within 15 minutes.
                        </div>
                    </div>
                </div>
                
                <div class="faq-category">
                    <h3>💰 Pricing & Payment</h3>
                    <div class="faq-item">
                        <div class="faq-question" onclick="App.toggleFAQ(this)">
                            What payment methods do you accept?
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            We accept all major credit cards, cash payments, and digital payment methods like Apple Pay and Google Pay.
                        </div>
                    </div>
                </div>
                
                <div class="faq-category">
                    <h3>🔧 Technical Support</h3>
                    <div class="faq-item">
                        <div class="faq-question" onclick="App.toggleFAQ(this)">
                            How do I track my technician?
                            <span class="faq-toggle">+</span>
                        </div>
                        <div class="faq-answer">
                            Once a technician is assigned, you'll receive real-time GPS tracking and can see their estimated arrival time in the app.
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    toggleFAQ(element) {
        const answer = element.nextElementSibling;
        const toggle = element.querySelector('.faq-toggle');
        
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            toggle.textContent = '+';
        } else {
            answer.style.display = 'block';
            toggle.textContent = '-';
        }
    },

    showModal(title, content) {
        const modal = document.getElementById('system-control-modal');
        const titleElement = document.getElementById('system-control-title');
        const contentElement = document.getElementById('system-control-content');
        
        titleElement.textContent = title;
        contentElement.innerHTML = content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.closeSystemControlModal();
    }
};

// Global functions for HTML onclick handlers
function login() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    App.updateUI();
}

function showRegister() {
    App.showToast('Register functionality not implemented in demo');
}

function toggleNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    if (drawer) {
        drawer.classList.toggle('active');
    }
}

function closeNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    if (drawer) {
        drawer.classList.remove('active');
    }
}

function emergencyCall() {
    App.showToast('🚨 Emergency SOS activated! Help is on the way!', 'success');
    // In a real app, this would contact emergency services
}

function selectService(id, name, price) {
    const service = App.services.find(s => s.id === id);
    if (!service) return;

    // Update booking modal with selected service
    document.getElementById('selected-service-icon').textContent = service.icon;
    document.getElementById('selected-service-name').textContent = name;
    document.getElementById('selected-service-price').textContent = `$${price}`;
    document.getElementById('summary-service').textContent = name;
    document.getElementById('summary-total').textContent = `$${price}`;

    // Show booking modal
    document.getElementById('booking-modal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.remove('active');
}

function nextBookingStep() {
    const steps = document.querySelectorAll('.booking-step');
    const stepIndicators = document.querySelectorAll('.step');
    let currentStep = 1;

    // Find current active step
    steps.forEach((step, index) => {
        if (step.classList.contains('active')) {
            currentStep = index + 1;
        }
    });

    if (currentStep < 4) {
        // Hide current step
        document.getElementById(`booking-step-${currentStep}`).classList.remove('active');
        stepIndicators[currentStep - 1].classList.remove('active');

        // Show next step
        currentStep++;
        document.getElementById(`booking-step-${currentStep}`).classList.add('active');
        stepIndicators[currentStep - 1].classList.add('active');
    }
}

function selectPaymentMethod(element) {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    element.classList.add('active');
}

function confirmBooking() {
    closeBookingModal();
    App.showToast('🎉 Booking confirmed! Technician assigned and en route.');
    
    // Show tracking modal after a short delay
    setTimeout(() => {
        document.getElementById('tracking-modal').classList.add('active');
    }, 1000);
}

function closeTrackingModal() {
    document.getElementById('tracking-modal').classList.remove('active');
}

function callTechnician() {
    App.showToast('📞 Calling technician Mike Rodriguez...');
}

function saveProfile() {
    App.showToast('✅ Profile saved successfully!');
}

function showDashboard(type) {
    App.showDashboard(type);
}

function openSystemControl(controlType) {
    App.openSystemControl(controlType);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export App object for global access
window.App = App;