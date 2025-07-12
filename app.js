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

    // Enhanced dashboard switching with role-specific content
    showDashboard(role) {
        console.log(`Switching to ${role} dashboard`);
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        // Find and activate the correct tab and nav item
        const targetTab = Array.from(document.querySelectorAll('.tab')).find(tab => 
            tab.textContent.toLowerCase().includes(role.toLowerCase())
        );
        if (targetTab) targetTab.classList.add('active');
        
        const targetNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
            item.textContent.toLowerCase().includes(role.toLowerCase())
        );
        if (targetNavItem) targetNavItem.classList.add('active');
        
        // Update dashboard content based on role
        this.updateDashboardContent(role);
        
        // Show dashboard view
        this.showView('dashboard');
        
        // Close navigation drawer
        this.closeNavDrawer();
        
        // Update user context
        this.currentUserRole = role;
        this.updateUserRoleDisplay(role);
    }
    
    updateDashboardContent(role) {
        const dashboardView = document.getElementById('dashboard-view');
        if (!dashboardView) return;
        
        // Clear existing content
        dashboardView.innerHTML = '';
        
        // Add role-specific content
        switch(role.toLowerCase()) {
            case 'customer':
                this.renderCustomerDashboard(dashboardView);
                break;
            case 'technician':
                this.renderTechnicianDashboard(dashboardView);
                break;
            case 'admin':
                this.renderAdminDashboard(dashboardView);
                break;
            case 'partner':
                this.renderPartnerDashboard(dashboardView);
                break;
            case 'security':
                this.renderSecurityDashboard(dashboardView);
                break;
            default:
                this.renderCustomerDashboard(dashboardView);
        }
    }
    
    renderCustomerDashboard(container) {
        container.innerHTML = `
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

            <!-- Services Grid -->
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
                    ${this.generateRecentServices()}
                </div>
            </div>

            <!-- Dashboard Stats -->
            <div class="stats-section">
                <h2>Your Stats</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">12</div>
                        <div class="stat-label">Total Services</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$1,250</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.8</div>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTechnicianDashboard(container) {
        container.innerHTML = `
            <!-- Technician Header -->
            <div class="dashboard-header">
                <div class="role-badge">🔧 Technician Dashboard</div>
                <div class="status-indicator online">● Online</div>
            </div>

            <!-- Active Jobs -->
            <div class="jobs-section">
                <h2>Active Service Requests</h2>
                <div class="jobs-grid">
                    <div class="job-card urgent">
                        <div class="job-header">
                            <div class="job-type">🚛 Towing Required</div>
                            <div class="job-status urgent">URGENT</div>
                        </div>
                        <div class="job-details">
                            <p><strong>Customer:</strong> Sarah Johnson</p>
                            <p><strong>Location:</strong> 1234 Main St, Downtown</p>
                            <p><strong>Issue:</strong> Engine failure, needs towing to nearest garage</p>
                            <p><strong>ETA:</strong> 15 minutes away</p>
                        </div>
                        <div class="job-actions">
                            <button class="btn btn--primary btn--sm" onclick="App.acceptJob(1)">Accept Job</button>
                            <button class="btn btn--outline btn--sm" onclick="App.callCustomer('555-0123')">📞 Call</button>
                        </div>
                    </div>
                    
                    <div class="job-card">
                        <div class="job-header">
                            <div class="job-type">🔋 Battery Jump</div>
                            <div class="job-status normal">NORMAL</div>
                        </div>
                        <div class="job-details">
                            <p><strong>Customer:</strong> Mike Chen</p>
                            <p><strong>Location:</strong> 567 Oak Ave, Uptown</p>
                            <p><strong>Issue:</strong> Car won't start, battery appears dead</p>
                            <p><strong>ETA:</strong> 8 minutes away</p>
                        </div>
                        <div class="job-actions">
                            <button class="btn btn--primary btn--sm" onclick="App.acceptJob(2)">Accept Job</button>
                            <button class="btn btn--outline btn--sm" onclick="App.callCustomer('555-0456')">📞 Call</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Technician Stats -->
            <div class="stats-section">
                <h2>Your Performance</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-value">47</div>
                        <div class="stat-label">Jobs Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">4.9</div>
                        <div class="stat-label">Customer Rating</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-value">12min</div>
                        <div class="stat-label">Avg Response</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">$2,340</div>
                        <div class="stat-label">This Month</div>
                    </div>
                </div>
            </div>

            <!-- Quick Tools -->
            <div class="tools-section">
                <h2>Quick Tools</h2>
                <div class="tools-grid">
                    <div class="tool-card" onclick="App.openGPSNavigation()">
                        <div class="tool-icon">🗺️</div>
                        <h3>GPS Navigation</h3>
                    </div>
                    <div class="tool-card" onclick="App.openInventory()">
                        <div class="tool-icon">📦</div>
                        <h3>Inventory Check</h3>
                    </div>
                    <div class="tool-card" onclick="App.reportIssue()">
                        <div class="tool-icon">⚠️</div>
                        <h3>Report Issue</h3>
                    </div>
                    <div class="tool-card" onclick="App.emergencyDispatch()">
                        <div class="tool-icon">🚨</div>
                        <h3>Emergency Dispatch</h3>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAdminDashboard(container) {
        container.innerHTML = `
            <!-- Admin Header -->
            <div class="dashboard-header">
                <div class="role-badge">⚙️ Admin Dashboard</div>
                <div class="admin-controls">
                    <button class="btn btn--outline btn--sm" onclick="App.exportReports()">📊 Export Reports</button>
                    <button class="btn btn--primary btn--sm" onclick="App.systemSettings()">⚙️ System Settings</button>
                </div>
            </div>

            <!-- System Overview -->
            <div class="overview-section">
                <h2>System Overview</h2>
                <div class="overview-grid">
                    <div class="overview-card">
                        <div class="overview-icon">👥</div>
                        <div class="overview-content">
                            <div class="overview-value">1,247</div>
                            <div class="overview-label">Total Users</div>
                            <div class="overview-change positive">+12% this month</div>
                        </div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">🔧</div>
                        <div class="overview-content">
                            <div class="overview-value">89</div>
                            <div class="overview-label">Active Technicians</div>
                            <div class="overview-change positive">+5 online</div>
                        </div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">📋</div>
                        <div class="overview-content">
                            <div class="overview-value">324</div>
                            <div class="overview-label">Services Today</div>
                            <div class="overview-change positive">+18% vs yesterday</div>
                        </div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">💰</div>
                        <div class="overview-content">
                            <div class="overview-value">$48,532</div>
                            <div class="overview-label">Revenue Today</div>
                            <div class="overview-change positive">+23% vs yesterday</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Live Activity -->
            <div class="activity-section">
                <h2>Live Activity Feed</h2>
                <div class="activity-feed">
                    <div class="activity-item">
                        <div class="activity-time">2 min ago</div>
                        <div class="activity-content">
                            <span class="activity-type success">Service Completed</span>
                            Technician Mike R. completed towing service for Customer #1247
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-time">5 min ago</div>
                        <div class="activity-content">
                            <span class="activity-type info">New Registration</span>
                            New customer Sarah K. registered from mobile app
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-time">8 min ago</div>
                        <div class="activity-content">
                            <span class="activity-type warning">Service Delayed</span>
                            Battery jump service delayed due to traffic - ETA updated
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-time">12 min ago</div>
                        <div class="activity-content">
                            <span class="activity-type success">Payment Processed</span>
                            Payment of $150 processed successfully for Service #4521
                        </div>
                    </div>
                </div>
            </div>

            <!-- Admin Tools -->
            <div class="admin-tools-section">
                <h2>Management Tools</h2>
                <div class="admin-tools-grid">
                    <div class="admin-tool" onclick="App.manageUsers()">
                        <div class="tool-icon">👥</div>
                        <h3>User Management</h3>
                        <p>Manage customer accounts and permissions</p>
                    </div>
                    <div class="admin-tool" onclick="App.manageTechnicians()">
                        <div class="tool-icon">🔧</div>
                        <h3>Technician Management</h3>
                        <p>Oversee technician performance and assignments</p>
                    </div>
                    <div class="admin-tool" onclick="App.viewReports()">
                        <div class="tool-icon">📊</div>
                        <h3>Analytics & Reports</h3>
                        <p>Detailed insights and performance reports</p>
                    </div>
                    <div class="admin-tool" onclick="App.systemConfig()">
                        <div class="tool-icon">⚙️</div>
                        <h3>System Configuration</h3>
                        <p>Configure system settings and preferences</p>
                    </div>
                    <div class="admin-tool" onclick="App.billingManagement()">
                        <div class="tool-icon">💳</div>
                        <h3>Billing Management</h3>
                        <p>Manage payments and financial operations</p>
                    </div>
                    <div class="admin-tool" onclick="App.auditLogs()">
                        <div class="tool-icon">📋</div>
                        <h3>Audit Logs</h3>
                        <p>Review system activity and security logs</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPartnerDashboard(container) {
        container.innerHTML = `
            <!-- Partner Header -->
            <div class="dashboard-header">
                <div class="role-badge">🤝 Partner Dashboard</div>
                <div class="partner-status">
                    <span class="status-badge verified">✓ Verified Partner</span>
                </div>
            </div>

            <!-- Partner Metrics -->
            <div class="metrics-section">
                <h2>Performance Metrics</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">📈</div>
                        <div class="metric-content">
                            <div class="metric-value">$12,450</div>
                            <div class="metric-label">Monthly Revenue</div>
                            <div class="metric-change positive">+15% vs last month</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">🚗</div>
                        <div class="metric-content">
                            <div class="metric-value">168</div>
                            <div class="metric-label">Services Provided</div>
                            <div class="metric-change positive">+8% this month</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">⭐</div>
                        <div class="metric-content">
                            <div class="metric-value">4.7</div>
                            <div class="metric-label">Partner Rating</div>
                            <div class="metric-change neutral">Same as last month</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">⏱️</div>
                        <div class="metric-content">
                            <div class="metric-value">18min</div>
                            <div class="metric-label">Avg Response Time</div>
                            <div class="metric-change positive">-3min improvement</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Service Areas -->
            <div class="areas-section">
                <h2>Service Areas</h2>
                <div class="areas-grid">
                    <div class="area-card active">
                        <div class="area-name">Downtown District</div>
                        <div class="area-stats">
                            <span class="area-count">45 services</span>
                            <span class="area-revenue">$3,240</span>
                        </div>
                        <div class="area-status active">Active</div>
                    </div>
                    <div class="area-card active">
                        <div class="area-name">Highway Corridor</div>
                        <div class="area-stats">
                            <span class="area-count">67 services</span>
                            <span class="area-revenue">$5,120</span>
                        </div>
                        <div class="area-status active">Active</div>
                    </div>
                    <div class="area-card">
                        <div class="area-name">Suburban North</div>
                        <div class="area-stats">
                            <span class="area-count">23 services</span>
                            <span class="area-revenue">$1,890</span>
                        </div>
                        <div class="area-status pending">Pending Approval</div>
                    </div>
                </div>
            </div>

            <!-- Recent Contracts -->
            <div class="contracts-section">
                <h2>Recent Service Contracts</h2>
                <div class="contracts-list">
                    <div class="contract-item">
                        <div class="contract-info">
                            <div class="contract-type">🚛 Emergency Towing Contract</div>
                            <div class="contract-details">Downtown District • 24/7 Coverage</div>
                        </div>
                        <div class="contract-value">$2,500/month</div>
                        <div class="contract-status active">Active</div>
                    </div>
                    <div class="contract-item">
                        <div class="contract-info">
                            <div class="contract-type">🔋 Battery Service Agreement</div>
                            <div class="contract-details">Highway Corridor • Peak Hours</div>
                        </div>
                        <div class="contract-value">$1,800/month</div>
                        <div class="contract-status active">Active</div>
                    </div>
                    <div class="contract-item">
                        <div class="contract-info">
                            <div class="contract-type">🛞 Tire Change Service</div>
                            <div class="contract-details">Multiple Areas • Standard Hours</div>
                        </div>
                        <div class="contract-value">$1,200/month</div>
                        <div class="contract-status pending">Under Review</div>
                    </div>
                </div>
            </div>

            <!-- Partner Tools -->
            <div class="partner-tools-section">
                <h2>Partner Tools</h2>
                <div class="partner-tools-grid">
                    <div class="partner-tool" onclick="App.viewServiceRequests()">
                        <div class="tool-icon">📋</div>
                        <h3>Service Requests</h3>
                        <p>View and manage incoming service requests</p>
                    </div>
                    <div class="partner-tool" onclick="App.invoiceManagement()">
                        <div class="tool-icon">💰</div>
                        <h3>Invoice Management</h3>
                        <p>Create and track invoices</p>
                    </div>
                    <div class="partner-tool" onclick="App.partnerReports()">
                        <div class="tool-icon">📊</div>
                        <h3>Performance Reports</h3>
                        <p>Detailed performance analytics</p>
                    </div>
                    <div class="partner-tool" onclick="App.resourceManagement()">
                        <div class="tool-icon">🚛</div>
                        <h3>Resource Management</h3>
                        <p>Manage vehicles and equipment</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSecurityDashboard(container) {
        container.innerHTML = `
            <!-- Security Header -->
            <div class="dashboard-header">
                <div class="role-badge">🛡️ Security Dashboard</div>
                <div class="security-status">
                    <div class="threat-level low">🟢 Threat Level: LOW</div>
                </div>
            </div>

            <!-- Security Alerts -->
            <div class="alerts-section">
                <h2>Security Alerts</h2>
                <div class="alerts-list">
                    <div class="alert-item low">
                        <div class="alert-icon">🔵</div>
                        <div class="alert-content">
                            <div class="alert-title">Failed Login Attempt</div>
                            <div class="alert-details">Multiple failed login attempts from IP 192.168.1.100</div>
                            <div class="alert-time">5 minutes ago</div>
                        </div>
                        <div class="alert-actions">
                            <button class="btn btn--outline btn--sm" onclick="App.investigateAlert(1)">Investigate</button>
                        </div>
                    </div>
                    <div class="alert-item medium">
                        <div class="alert-icon">🟡</div>
                        <div class="alert-content">
                            <div class="alert-title">Unusual API Activity</div>
                            <div class="alert-details">High frequency API calls detected from user account #4521</div>
                            <div class="alert-time">12 minutes ago</div>
                        </div>
                        <div class="alert-actions">
                            <button class="btn btn--outline btn--sm" onclick="App.investigateAlert(2)">Investigate</button>
                        </div>
                    </div>
                    <div class="alert-item resolved">
                        <div class="alert-icon">✅</div>
                        <div class="alert-content">
                            <div class="alert-title">Resolved: Database Connection Issue</div>
                            <div class="alert-details">Database connectivity restored after brief outage</div>
                            <div class="alert-time">45 minutes ago</div>
                        </div>
                        <div class="alert-status">Resolved</div>
                    </div>
                </div>
            </div>

            <!-- System Monitoring -->
            <div class="monitoring-section">
                <h2>System Monitoring</h2>
                <div class="monitoring-grid">
                    <div class="monitor-card">
                        <div class="monitor-header">
                            <span class="monitor-title">Server Health</span>
                            <span class="monitor-status healthy">🟢 Healthy</span>
                        </div>
                        <div class="monitor-metrics">
                            <div class="metric">CPU: 23%</div>
                            <div class="metric">Memory: 45%</div>
                            <div class="metric">Disk: 67%</div>
                        </div>
                    </div>
                    <div class="monitor-card">
                        <div class="monitor-header">
                            <span class="monitor-title">Database</span>
                            <span class="monitor-status healthy">🟢 Online</span>
                        </div>
                        <div class="monitor-metrics">
                            <div class="metric">Connections: 142/200</div>
                            <div class="metric">Query Time: 45ms avg</div>
                            <div class="metric">Uptime: 99.9%</div>
                        </div>
                    </div>
                    <div class="monitor-card">
                        <div class="monitor-header">
                            <span class="monitor-title">API Gateway</span>
                            <span class="monitor-status healthy">🟢 Operating</span>
                        </div>
                        <div class="monitor-metrics">
                            <div class="metric">Requests/min: 1,247</div>
                            <div class="metric">Error Rate: 0.02%</div>
                            <div class="metric">Avg Response: 120ms</div>
                        </div>
                    </div>
                    <div class="monitor-card">
                        <div class="monitor-header">
                            <span class="monitor-title">User Sessions</span>
                            <span class="monitor-status healthy">🟢 Normal</span>
                        </div>
                        <div class="monitor-metrics">
                            <div class="metric">Active Users: 1,089</div>
                            <div class="metric">Session Duration: 24min avg</div>
                            <div class="metric">Bounce Rate: 3.2%</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Access Control -->
            <div class="access-control-section">
                <h2>Access Control</h2>
                <div class="access-grid">
                    <div class="access-item">
                        <div class="access-icon">👥</div>
                        <div class="access-info">
                            <h4>User Permissions</h4>
                            <p>1,247 users • 89 roles</p>
                        </div>
                        <button class="btn btn--outline btn--sm" onclick="App.managePermissions()">Manage</button>
                    </div>
                    <div class="access-item">
                        <div class="access-icon">🔐</div>
                        <div class="access-info">
                            <h4>API Security</h4>
                            <p>45 active tokens • 12 API keys</p>
                        </div>
                        <button class="btn btn--outline btn--sm" onclick="App.manageAPIKeys()">Manage</button>
                    </div>
                    <div class="access-item">
                        <div class="access-icon">🔒</div>
                        <div class="access-info">
                            <h4>Data Encryption</h4>
                            <p>AES-256 • SSL/TLS enabled</p>
                        </div>
                        <button class="btn btn--outline btn--sm" onclick="App.viewEncryption()">View Details</button>
                    </div>
                </div>
            </div>

            <!-- Security Tools -->
            <div class="security-tools-section">
                <h2>Security Tools</h2>
                <div class="security-tools-grid">
                    <div class="security-tool" onclick="App.auditTrail()">
                        <div class="tool-icon">📋</div>
                        <h3>Audit Trail</h3>
                        <p>Complete system activity logs</p>
                    </div>
                    <div class="security-tool" onclick="App.threatDetection()">
                        <div class="tool-icon">🔍</div>
                        <h3>Threat Detection</h3>
                        <p>AI-powered security monitoring</p>
                    </div>
                    <div class="security-tool" onclick="App.vulnerabilityScanning()">
                        <div class="tool-icon">🛡️</div>
                        <h3>Vulnerability Scanning</h3>
                        <p>Automated security assessments</p>
                    </div>
                    <div class="security-tool" onclick="App.incidentResponse()">
                        <div class="tool-icon">🚨</div>
                        <h3>Incident Response</h3>
                        <p>Emergency response protocols</p>
                    </div>
                    <div class="security-tool" onclick="App.complianceReports()">
                        <div class="tool-icon">📊</div>
                        <h3>Compliance Reports</h3>
                        <p>Regulatory compliance tracking</p>
                    </div>
                    <div class="security-tool" onclick="App.backupManagement()">
                        <div class="tool-icon">💾</div>
                        <h3>Backup Management</h3>
                        <p>Data backup and recovery</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateUserRoleDisplay(role) {
        // Update navbar to reflect current role
        const navTitle = document.querySelector('.logo-nav');
        if (navTitle) {
            const roleEmoji = {
                'customer': '👤',
                'technician': '🔧',
                'admin': '⚙️',
                'partner': '🤝',
                'security': '🛡️'
            };
            navTitle.textContent = `${roleEmoji[role] || '🚗'} RoadSide+`;
        }
        
        // Show role-appropriate notifications
        this.showToast(`Switched to ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`);
    }
    
    generateRecentServices() {
        const services = [
            { type: 'Towing', date: '2024-01-15', price: '$150', status: 'Completed' },
            { type: 'Battery Jump', date: '2024-01-10', price: '$75', status: 'Completed' },
            { type: 'Tire Change', date: '2024-01-05', price: '$100', status: 'Completed' }
        ];
        
        return services.map(service => `
            <div class="service-history-item">
                <div class="service-icon">${service.type === 'Towing' ? '🚛' : service.type === 'Battery Jump' ? '🔋' : '🛞'}</div>
                <div class="service-details">
                    <h4>${service.type}</h4>
                    <p>${service.date}</p>
                </div>
                <div class="service-status">${service.status}</div>
                <div class="service-price">${service.price}</div>
            </div>
        `).join('');
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

    // Emergency call functionality
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

    closeNavDrawer() {
        const drawer = document.getElementById('nav-drawer');
        if (drawer) {
            drawer.classList.remove('open');
        }
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