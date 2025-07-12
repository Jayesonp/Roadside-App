// RoadSide+ Emergency App JavaScript

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing RoadSide+ app...');
    
    // Check if elements exist before initializing
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');
    
    if (!loadingScreen || !mainApp) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Show main app after loading delay
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
        }
        if (mainApp) {
            mainApp.style.display = 'block';
            mainApp.style.opacity = '1';
        }
        console.log('RoadSide+ app loaded successfully!');
    }, 2000);
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('Initializing RoadSide+ app...');
    
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');
    
    if (!loadingScreen || !mainApp) {
        console.log('Elements not ready, using fallback');
        return;
    }
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainApp.classList.add('active');
        console.log('App loaded successfully!');
    }, 1500);
}

// Core app functions
function showDashboard(type) {
    console.log('Showing dashboard:', type);
    
    // Update active tab
    const tabs = document.querySelectorAll('.tab');
    const navItems = document.querySelectorAll('.nav-drawer .nav-item');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate the clicked element
    if (event && event.target) {
        event.target.closest('.tab')?.classList.add('active');
        event.target.closest('.nav-item')?.classList.add('active');
    }
    
    // Close nav drawer if open
    closeNavDrawer();
}

function showView(viewName) {
    console.log('Showing view:', viewName);
    
    // Update bottom nav
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (event && event.target) {
        event.target.closest('.nav-item')?.classList.add('active');
    }
}

function selectService(id, name, price) {
    console.log('Service selected:', name, price);
    
    // Show service selection feedback
    showToast(`Selected: ${name} - $${price}`, 'success');
    
    // Store selected service data
    const serviceData = {
        id: id,
        name: name,
        price: price,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('selectedService', JSON.stringify(serviceData));
    
    // Could open booking modal here
    setTimeout(() => {
        alert(`Service Selected!\n\n${name} - $${price}\n\nBooking system coming soon!`);
    }, 500);
}

function emergencyCall() {
    console.log('Emergency SOS activated');
    
    // Show emergency alert
    const confirmCall = confirm('🚨 EMERGENCY SOS ACTIVATED\n\nThis will:\n• Contact emergency services\n• Share your GPS location\n• Alert your emergency contacts\n\nContinue?');
    
    if (confirmCall) {
        showToast('Emergency services contacted! Help is on the way.', 'emergency');
        
        // Simulate emergency response
        setTimeout(() => {
            alert('🚨 EMERGENCY RESPONSE ACTIVE\n\n📍 Location shared\n📞 Emergency services notified\n⏱️ ETA: 8-12 minutes\n\nStay on the line if safe to do so.');
        }, 1000);
    }
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

// Support Center Functions
function openNewSupportRequest() {
    console.log('Opening new support request');
    showToast('Opening support request form...', 'info');
    
    setTimeout(() => {
        alert('📝 NEW SUPPORT REQUEST\n\nSupport ticket system:\n• Priority levels\n• Category selection\n• File attachments\n• Real-time updates\n\nFull system coming soon!');
    }, 500);
}

function openEmergencyContact() {
    console.log('Opening emergency contact');
    
    const emergencyInfo = `🚨 EMERGENCY CONTACTS\n\n🆘 Life-threatening emergency:\n   Call 911 immediately\n\n🚗 RoadSide+ 24/7 Hotline:\n   📞 1-800-ROADSIDE\n   (1-800-762-3743)\n\n💬 Live Chat Support:\n   Available 24/7\n\n📧 Emergency Email:\n   emergency@roadsideplus.com\n\n📍 GPS location will be shared automatically`;
    
    alert(emergencyInfo);
}

function openFAQ() {
    console.log('Opening FAQ');
    showToast('Loading FAQ section...', 'info');
    
    setTimeout(() => {
        const faqContent = `❓ FREQUENTLY ASKED QUESTIONS\n\n🚗 Service & Booking:\n• How do I book a service?\n• What areas do you cover?\n• How long does help take to arrive?\n\n💰 Pricing & Payment:\n• How much do services cost?\n• What payment methods do you accept?\n• Are there additional fees?\n\n🔧 Technical Support:\n• App not working properly?\n• Can't track my technician?\n• Payment issues?\n\nFull interactive FAQ coming soon!`;
        
        alert(faqContent);
    }, 500);
}

function openLiveChat() {
    console.log('Opening live chat');
    showToast('Connecting to support agent...', 'info');
    
    setTimeout(() => {
        const chatInfo = `💬 LIVE CHAT SUPPORT\n\n🟢 Available 24/7\n⏱️ Average wait time: < 2 minutes\n\n👥 Support agents can help with:\n• Service booking\n• Technical issues\n• Billing questions\n• Emergency coordination\n\nFull chat interface coming soon!`;
        
        alert(chatInfo);
    }, 800);
}

// Utility Functions
function showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
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

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

console.log('RoadSide+ JavaScript loaded successfully');