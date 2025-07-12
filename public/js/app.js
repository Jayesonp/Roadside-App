class RoadSideApp {
    constructor() {
        this.currentDashboard = 'customer';
        this.selectedService = null;
        this.isNavDrawerOpen = false;
        this.init();
    }

    init() {
        // Initialize the app
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Any additional event listeners can be added here
    }

    toggleNavDrawer() {
        this.isNavDrawerOpen = !this.isNavDrawerOpen;
        const navDrawer = document.getElementById('navDrawer');
        if (navDrawer) {
            if (this.isNavDrawerOpen) {
                navDrawer.classList.add('active');
            } else {
                navDrawer.classList.remove('active');
            }
        }
    }

    closeNavDrawer() {
        this.isNavDrawerOpen = false;
        const navDrawer = document.getElementById('navDrawer');
        if (navDrawer) {
            navDrawer.classList.remove('active');
        }
    }

    showDashboard(dashboard) {
        this.currentDashboard = dashboard;
        
        // Hide all dashboard contents
        const dashboards = document.querySelectorAll('.dashboard-content');
        dashboards.forEach(dash => dash.classList.remove('active'));
        
        // Show selected dashboard
        const selectedDash = document.getElementById(`${dashboard}Dashboard`);
        if (selectedDash) {
            selectedDash.classList.add('active');
        }
        
        // Update tab states
        const tabs = document.querySelectorAll('.dashboard-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        const activeTab = document.querySelector(`[onclick="App.showDashboard('${dashboard}')"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    selectService(service) {
        this.selectedService = service;
        
        // Update service selection UI
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => card.classList.remove('selected'));
        
        const selectedCard = document.querySelector(`[onclick="App.selectService('${service}')"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Show booking modal or next step
        this.showBookingModal();
    }

    showBookingModal() {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    nextBookingStep() {
        // Handle booking step progression
        console.log('Next booking step');
    }

    confirmBooking() {
        // Handle booking confirmation
        this.closeBookingModal();
        alert('Booking confirmed! You will receive a confirmation shortly.');
    }

    login() {
        // Handle login
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        
        if (username && password) {
            // Simulate login success
            this.hideScreen('loginScreen');
            this.showScreen('mainApp');
        }
    }

    showRegister() {
        // Show registration form
        this.hideScreen('loginScreen');
        this.showScreen('registerScreen');
    }

    emergencyCall() {
        // Handle emergency call
        alert('Calling emergency services...');
    }

    saveProfile() {
        // Handle profile save
        alert('Profile saved successfully!');
    }

    closeTrackingModal() {
        const modal = document.getElementById('trackingModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    callTechnician() {
        // Handle technician call
        alert('Calling technician...');
    }

    selectPaymentMethod(method) {
        // Handle payment method selection
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(pm => pm.classList.remove('selected'));
        
        const selectedMethod = document.querySelector(`[onclick="App.selectPaymentMethod('${method}')"]`);
        if (selectedMethod) {
            selectedMethod.classList.add('selected');
        }
    }

    hideScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'none';
        }
    }

    showScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'block';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.App = new RoadSideApp();
});