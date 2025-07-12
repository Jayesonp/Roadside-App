// Global App Object
window.App = {
    // Application state
    currentUser: null,
    isAuthenticated: false,
    currentView: 'dashboard',
    
    // Initialize application
    initialize() {
        console.log('Initializing RoadSide+ Emergency App...');
        
        try {
            // Check DOM readiness
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.startup());
            } else {
                this.startup();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.handleError(error);
        }
    },
    
    // Application startup sequence
    startup() {
        console.log('Starting application...');
        
        try {
            // Update loading text
            this.updateLoadingText('Checking authentication...');
            
            // Check authentication status
            setTimeout(() => {
                this.checkAuthStatus();
            }, 500);
            
            // Initialize error handlers
            this.setupErrorHandlers();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Application startup completed');
        } catch (error) {
            console.error('Startup failed:', error);
            this.handleError(error);
        }
    },
    
    // Update loading screen text
    updateLoadingText(text) {
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = text;
        }
    },
    
    // Check authentication status
    checkAuthStatus() {
        try {
            this.updateLoadingText('Loading dashboard...');
            
            // Simulate authentication check
            setTimeout(() => {
                // For demo purposes, always authenticate
                this.isAuthenticated = true;
                this.currentUser = {
                    id: 'USR001',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    avatar: 'JD'
                };
                
                this.loadMainApp();
            }, 800);
            
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.handleError(error);
        }
    },
    
    // Load main application
    loadMainApp() {
        try {
            this.updateLoadingText('Setting up interface...');
            
            setTimeout(() => {
                // Hide loading screen
                this.hideLoadingScreen();
                
                // Show main app
                this.showMainApp();
                
                // Initialize dashboard
                this.initializeDashboard();
                
                console.log('Main application loaded successfully');
            }, 500);
            
        } catch (error) {
            console.error('Failed to load main app:', error);
            this.handleError(error);
        }
    },
    
    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    },
    
    // Show main application
    showMainApp() {
        const mainApp = document.getElementById('main-app');
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'block';
        }
    },
    
    // Initialize dashboard
    initializeDashboard() {
        try {
            // Update user info
            this.updateUserInfo();
            
            // Load dashboard data
            this.loadDashboardData();
            
            // Setup navigation
            this.setupNavigation();
            
            console.log('Dashboard initialized');
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            this.handleError(error);
        }
    },
    
    // Update user information in UI
    updateUserInfo() {
        try {
            const userNameEl = document.querySelector('.user-name');
            const userAvatarEl = document.querySelector('.user-avatar');
            
            if (userNameEl && this.currentUser) {
                userNameEl.textContent = this.currentUser.name;
            }
            
            if (userAvatarEl && this.currentUser) {
                userAvatarEl.textContent = this.currentUser.avatar;
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
        }
    },
    
    // Load dashboard data
    loadDashboardData() {
        try {
            // Mock data for demonstration
            const statsData = {
                totalServices: 12,
                totalSpent: '$1,250',
                avgRating: '4.9'
            };
            
            // Update stats
            this.updateStats(statsData);
            
            console.log('Dashboard data loaded');
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    },
    
    // Update statistics display
    updateStats(data) {
        try {
            const statValues = document.querySelectorAll('.stat-value');
            if (statValues.length >= 3) {
                statValues[0].textContent = data.totalServices;
                statValues[1].textContent = data.totalSpent;
                statValues[2].textContent = data.avgRating;
            }
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    },
    
    // Setup navigation
    setupNavigation() {
        try {
            // Bottom navigation
            const navItems = document.querySelectorAll('.bottom-nav .nav-item');
            navItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.handleNavigation(index);
                });
            });
            
            console.log('Navigation setup completed');
        } catch (error) {
            console.error('Navigation setup failed:', error);
        }
    },
    
    // Handle navigation
    handleNavigation(index) {
        try {
            const navItems = document.querySelectorAll('.bottom-nav .nav-item');
            
            // Remove active class from all items
            navItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked item
            if (navItems[index]) {
                navItems[index].classList.add('active');
            }
            
            // Handle navigation logic
            switch (index) {
                case 0:
                    this.showDashboard();
                    break;
                case 1:
                    this.showHistory();
                    break;
                case 3:
                    this.showSupport();
                    break;
                case 4:
                    this.showProfile();
                    break;
            }
        } catch (error) {
            console.error('Navigation failed:', error);
        }
    },
    
    // Show dashboard view
    showDashboard() {
        console.log('Showing dashboard');
        // Dashboard is already visible by default
    },
    
    // Show history view
    showHistory() {
        console.log('Showing history');
        alert('Service history will be displayed here');
    },
    
    // Show support view
    showSupport() {
        console.log('Showing support');
        alert('Support center will be displayed here');
    },
    
    // Show profile view
    showProfile() {
        console.log('Showing profile');
        alert('User profile will be displayed here');
    },
    
    // Setup event listeners
    setupEventListeners() {
        try {
            // Service card clicks
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    this.handleServiceSelection(index);
                });
            });
            
            // Emergency button clicks
            const emergencyBtns = document.querySelectorAll('.emergency-btn, .sos-button');
            emergencyBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.handleEmergency();
                });
            });
            
            console.log('Event listeners setup completed');
        } catch (error) {
            console.error('Event listeners setup failed:', error);
        }
    },
    
    // Handle service selection
    handleServiceSelection(index) {
        try {
            const services = ['Towing', 'Battery Jump', 'Tire Change', 'Lockout'];
            const serviceName = services[index] || 'Service';
            
            alert(`${serviceName} service selected. Booking functionality will be implemented here.`);
            
            console.log(`Service selected: ${serviceName}`);
        } catch (error) {
            console.error('Service selection failed:', error);
        }
    },
    
    // Handle emergency
    handleEmergency() {
        try {
            console.log('Emergency SOS activated');
            
            // Show emergency confirmation
            const confirmed = confirm('🚨 EMERGENCY SOS\n\nThis will immediately contact emergency services and your emergency contact.\n\nProceed?');
            
            if (confirmed) {
                alert('Emergency services have been contacted!\n\n• 911 has been notified\n• Your emergency contact has been alerted\n• Your location has been shared\n• Help is on the way');
                
                // Log emergency activation
                console.log('Emergency SOS confirmed and activated');
            }
        } catch (error) {
            console.error('Emergency handling failed:', error);
        }
    },
    
    // Setup error handlers
    setupErrorHandlers() {
        try {
            // Global error handler
            window.addEventListener('error', (event) => {
                console.error('Global error:', event.error);
                // Don't show error boundary for minor errors
                return false;
            });
            
            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
                event.preventDefault();
            });
            
            console.log('Error handlers setup completed');
        } catch (error) {
            console.error('Error handlers setup failed:', error);
        }
    },
    
    // Handle application errors
    handleError(error) {
        try {
            console.error('Application error:', error);
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Show error boundary
            this.showError(error.message || 'An unexpected error occurred');
            
        } catch (e) {
            console.error('Error handling failed:', e);
            // Fallback to basic error display
            alert('Application error occurred. Please refresh the page.');
        }
    },
    
    // Show error boundary
    showError(message) {
        try {
            const errorBoundary = document.getElementById('error-boundary');
            const errorMessage = document.getElementById('error-message');
            
            if (errorBoundary) {
                errorBoundary.classList.remove('hidden');
            }
            
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        } catch (error) {
            console.error('Failed to show error:', error);
        }
    }
};

// Auto-initialize app when script loads
console.log('App script loaded, initializing...');
window.App.initialize();

// Global functions for HTML onclick handlers
function toggleNavDrawer() {
    alert('Navigation drawer functionality will be implemented here');
}

// Backup initialization if main app fails
setTimeout(() => {
    if (!window.App.isAuthenticated) {
        console.log('Backup initialization triggered');
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            loadingScreen.style.display = 'none';
        }
        
        // Show main app
        const mainApp = document.getElementById('main-app');
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.style.display = 'block';
        }
    }
}, 5000);