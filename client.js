// RoadSide+ Emergency Assistance - Client-side JavaScript

class RoadSideApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.currentDashboard = 'customer';
        this.selectedService = null;
        this.bookingStep = 1;
        this.init();
    }

    init() {
        // Initialize app after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚗 RoadSide+ App initializing...');
        
        // Set up bottom navigation
        this.setupBottomNavigation();
        
        // Load user data
        this.loadUserData();
        
        // Setup dashboard tabs
        this.setupDashboardTabs();
        
        // Initialize default view
        this.showView('dashboard');
        this.showDashboard('customer');
        
        // Setup chat functionality
        this.initializeChat();
        
        console.log('✅ RoadSide+ App initialized successfully');
    }

    setupBottomNavigation() {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewName = item.getAttribute('data-view');
                if (viewName) {
                    this.showView(viewName);
                    
                    // Update active state
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
    }

    setupDashboardTabs() {
        const tabs = document.querySelectorAll('.dashboard-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const dashboardType = tab.textContent.trim().split(' ')[1].toLowerCase();
                this.showDashboard(dashboardType);
                
                // Update active state
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    loadUserData() {
        // Simulate user data loading
        this.currentUser = {
            id: 'user-123',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            totalServices: 12,
            totalSpent: 850,
            avgRating: 4.8,
            memberSince: '2023'
        };

        // Update user info in nav
        const userName = document.querySelector('.user-name');
        if (userName) userName.textContent = this.currentUser.name;

        // Update profile stats
        this.updateStats();
    }

    updateStats() {
        const elements = {
            'total-services': this.currentUser.totalServices,
            'total-spent': `$${this.currentUser.totalSpent}`,
            'avg-rating': this.currentUser.avgRating,
            'profile-total-services': this.currentUser.totalServices,
            'profile-total-spent': `$${this.currentUser.totalSpent}`,
            'profile-avg-rating': this.currentUser.avgRating,
            'profile-member-since': this.currentUser.memberSince
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    showView(viewName) {
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => view.classList.remove('active'));

        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        // Load view-specific data
        switch (viewName) {
            case 'history':
                this.loadServiceHistory();
                break;
            case 'support':
                this.loadSupportTickets();
                break;
            case 'profile':
                this.loadProfileData();
                break;
        }
    }

    showDashboard(type) {
        this.currentDashboard = type;
        // For now, all dashboard types show the customer view
        // In a real app, this would switch between different dashboard interfaces
        console.log(`Showing ${type} dashboard`);
    }

    loadServiceHistory() {
        const historyList = document.getElementById('service-history-list');
        const recentServices = document.getElementById('recent-services');
        
        const services = [
            { id: 1, type: 'Towing', date: '2024-01-15', cost: 150, status: 'Completed' },
            { id: 2, type: 'Battery Jump', date: '2024-01-10', cost: 75, status: 'Completed' },
            { id: 3, type: 'Tire Change', date: '2024-01-05', cost: 100, status: 'Completed' }
        ];

        const serviceHTML = services.map(service => `
            <div class="history-item">
                <div class="service-info">
                    <h4>${service.type}</h4>
                    <p>${service.date}</p>
                </div>
                <div class="service-status">
                    <span class="status-badge ${service.status.toLowerCase()}">${service.status}</span>
                    <span class="service-cost">$${service.cost}</span>
                </div>
            </div>
        `).join('');

        if (historyList) historyList.innerHTML = serviceHTML;
        if (recentServices) recentServices.innerHTML = serviceHTML;
    }

    loadSupportTickets() {
        const ticketsContainer = document.getElementById('support-tickets');
        if (!ticketsContainer) return;

        const tickets = [
            { id: 1, subject: 'Billing Question', status: 'Open', date: '2024-01-15' },
            { id: 2, subject: 'Service Feedback', status: 'Resolved', date: '2024-01-10' }
        ];

        const ticketsHTML = tickets.map(ticket => `
            <div class="support-ticket">
                <div class="ticket-info">
                    <h4>${ticket.subject}</h4>
                    <p>Ticket #${ticket.id} • ${ticket.date}</p>
                </div>
                <span class="ticket-status ${ticket.status.toLowerCase()}">${ticket.status}</span>
            </div>
        `).join('');

        ticketsContainer.innerHTML = ticketsHTML;
    }

    loadProfileData() {
        // Load profile form with user data
        const profileInputs = {
            'profile-name': `${this.currentUser.name}`,
            'profile-email': this.currentUser.email,
            'profile-phone': this.currentUser.phone
        };

        Object.entries(profileInputs).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Support Center Functions
    openNewSupportRequest() {
        this.openModal('support-request-modal');
    }

    closeSupportRequestModal() {
        this.closeModal('support-request-modal');
    }

    submitSupportRequest() {
        const category = document.getElementById('support-category')?.value;
        const priority = document.getElementById('support-priority')?.value;
        const subject = document.getElementById('support-subject')?.value;
        const description = document.getElementById('support-description')?.value;

        if (!subject || !description) {
            alert('Please fill in all required fields');
            return;
        }

        // Simulate request submission
        console.log('Support request submitted:', { category, priority, subject, description });
        alert('Support request submitted successfully!');
        this.closeSupportRequestModal();
    }

    openEmergencyContact() {
        this.openModal('emergency-contact-modal');
    }

    closeEmergencyContactModal() {
        this.closeModal('emergency-contact-modal');
    }

    callEmergencyNumber(service, number) {
        console.log(`Calling ${service}: ${number}`);
        alert(`Calling ${service}: ${number}`);
    }

    openFAQ() {
        this.openModal('faq-modal');
        this.loadFAQContent();
    }

    closeFAQModal() {
        this.closeModal('faq-modal');
    }

    loadFAQContent() {
        const faqContainer = document.getElementById('faq-content');
        if (!faqContainer) return;

        const faqs = [
            {
                question: 'How quickly can I get roadside assistance?',
                answer: 'Our average response time is 30 minutes or less. Emergency services are prioritized and may arrive even faster.'
            },
            {
                question: 'What services are included in my plan?',
                answer: 'Your plan includes towing, battery jump, tire changes, lockout assistance, fuel delivery, and winch recovery services.'
            },
            {
                question: 'How do I track my service technician?',
                answer: 'Once your service is dispatched, you\'ll receive real-time GPS tracking and can communicate directly with your technician.'
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, and cash payments. Payment is processed after service completion.'
            }
        ];

        const faqHTML = faqs.map(faq => `
            <div class="faq-item">
                <div class="faq-question">
                    <h4>${faq.question}</h4>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');

        faqContainer.innerHTML = faqHTML;

        // Add click handlers for FAQ items
        faqContainer.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const answer = item.querySelector('.faq-answer');
                const toggle = question.querySelector('.faq-toggle');
                
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    toggle.textContent = '+';
                } else {
                    answer.style.display = 'block';
                    toggle.textContent = '−';
                }
            });
        });
    }

    openLiveChat() {
        this.openModal('live-chat-modal');
        this.initializeChat();
    }

    closeLiveChatModal() {
        this.closeModal('live-chat-modal');
    }

    initializeChat() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        // Add initial message
        if (chatMessages.children.length === 0) {
            this.addChatMessage('Hi! I\'m Sarah from RoadSide+ support. How can I help you today?', 'agent');
        }
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput?.value.trim();
        
        if (!message) return;

        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Simulate agent response
        setTimeout(() => {
            this.addChatMessage('Thank you for your message. Let me help you with that right away!', 'agent');
        }, 1000);
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    closeSystemControlModal() {
        this.closeModal('system-control-modal');
    }

    emergencyCall() {
        alert('🚨 Emergency SOS Activated!\n\nConnecting you to emergency dispatch...\n\nYour location has been shared automatically.');
    }
}

// Global functions for onclick handlers
function showDashboard(type) {
    if (window.App) {
        window.App.showDashboard(type);
    }
}

function login() {
    // Hide login screen and show main app
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    if (!window.App) {
        window.App = new RoadSideApp();
    }
}

function showRegister() {
    alert('Registration feature coming soon!');
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
    if (window.App) {
        window.App.emergencyCall();
    }
}

function selectService(id, name, price) {
    // Store selected service
    if (window.App) {
        window.App.selectedService = { id, name, price };
    }
    
    // Update booking modal
    document.getElementById('selected-service-name').textContent = name;
    document.getElementById('selected-service-price').textContent = `$${price}`;
    
    // Open booking modal
    document.getElementById('booking-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showView(viewName) {
    if (window.App) {
        window.App.showView(viewName);
    }
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function nextBookingStep() {
    const currentStep = document.querySelector('.booking-step.active');
    const nextStep = currentStep?.nextElementSibling;
    
    if (nextStep && nextStep.classList.contains('booking-step')) {
        currentStep.classList.remove('active');
        nextStep.classList.add('active');
        
        // Update step indicators
        const steps = document.querySelectorAll('.step');
        const currentStepNum = Array.from(steps).findIndex(step => step.classList.contains('active'));
        if (steps[currentStepNum + 1]) {
            steps[currentStepNum + 1].classList.add('active');
        }
    }
}

function selectPaymentMethod(element) {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    element.classList.add('active');
}

function confirmBooking() {
    alert('Booking confirmed! You will receive updates via SMS and email.');
    closeBookingModal();
    
    // Open tracking modal
    setTimeout(() => {
        document.getElementById('tracking-modal').classList.add('active');
    }, 1000);
}

function closeTrackingModal() {
    document.getElementById('tracking-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function callTechnician() {
    alert('Calling technician: Mike Rodriguez\n📞 (555) 123-4567');
}

function saveProfile() {
    alert('Profile saved successfully!');
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-login for demo
    setTimeout(() => {
        login();
    }, 2000);
});

// Create global App object if it doesn't exist
if (!window.App) {
    window.App = null;
}