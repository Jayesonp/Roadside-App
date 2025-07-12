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
                        <div class="control-card" onclick="openSystemControl('user-management')">
                            <div class="control-icon">👤</div>
                            <h4>User Management</h4>
                            <p>Manage customer accounts and permissions</p>
                        </div>
                        <div class="control-card" onclick="openSystemControl('technician-management')">
                            <div class="control-icon">🔧</div>
                            <h4>Technician Management</h4>
                            <p>Monitor and assign technician resources</p>
                        </div>
                        <div class="control-card" onclick="openSystemControl('analytics')">
                            <div class="control-icon">📈</div>
                            <h4>Analytics</h4>
                            <p>View detailed system performance metrics</p>
                        </div>
                        <div class="control-card" onclick="openSystemControl('system-settings')">
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
        const modal = document.getElementById('system-control-modal');
        if (modal) {
            modal.classList.remove('active');
        }
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

    // Control panel templates
    getUserManagementControl() {
        return `
            <div class="control-tabs">
                <div class="tab-nav">
                    <button class="tab-btn active" onclick="App.switchControlTab(this, 'users-overview')">Overview</button>
                    <button class="tab-btn" onclick="App.switchControlTab(this, 'user-accounts')">User Accounts</button>
                    <button class="tab-btn" onclick="App.switchControlTab(this, 'user-permissions')">Permissions</button>
                </div>
                
                <div id="users-overview" class="tab-content active">
                    <div class="overview-stats">
                        <div class="stat-item">
                            <h4>Total Users</h4>
                            <span class="stat-number">1,247</span>
                        </div>
                        <div class="stat-item">
                            <h4>Active Today</h4>
                            <span class="stat-number">342</span>
                        </div>
                        <div class="stat-item">
                            <h4>New This Week</h4>
                            <span class="stat-number">28</span>
                        </div>
                    </div>
                </div>
                
                <div id="user-accounts" class="tab-content">
                    <div class="user-management-tools">
                        <input type="search" placeholder="Search users..." class="search-input">
                        <button class="btn btn--primary">Add User</button>
                    </div>
                    <div class="user-list">
                        <div class="user-item">
                            <div class="user-info">
                                <h5>John Doe</h5>
                                <p>john.doe@example.com</p>
                            </div>
                            <div class="user-actions">
                                <button class="btn btn--sm btn--outline">Edit</button>
                                <button class="btn btn--sm btn--danger">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="user-permissions" class="tab-content">
                    <div class="permissions-grid">
                        <div class="permission-item">
                            <label>
                                <input type="checkbox" checked> User Registration
                            </label>
                        </div>
                        <div class="permission-item">
                            <label>
                                <input type="checkbox" checked> Service Booking
                            </label>
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

    getTechnicianManagementControl() {
        return `<div class="technician-control">
            <h3>Technician Management</h3>
            <p>Monitor and manage technician resources and assignments.</p>
        </div>`;
    },

    getAnalyticsControl() {
        return `<div class="analytics-control">
            <h3>Analytics Dashboard</h3>
            <p>View comprehensive system analytics and performance metrics.</p>
        </div>`;
    },

    getSystemSettingsControl() {
        return `<div class="settings-control">
            <h3>System Settings</h3>
            <p>Configure system parameters and application settings.</p>
        </div>`;
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