// RoadSide+ Fully Functional App

// App State Management
class AppState {
  constructor() {
    this.currentUser = this.loadFromStorage('currentUser') || {
      id: 'user-123',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      memberSince: '2023-01-15',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      },
      preferences: {
        notifications: true,
        location: true,
        darkMode: true
      },
      stats: {
        totalServices: 12,
        totalSpent: 850,
        avgRating: 4.8
      }
    };
    
    this.serviceHistory = this.loadFromStorage('serviceHistory') || [
      {
        id: 'service-001',
        type: 'Battery Jump',
        date: '2024-07-10T14:30:00Z',
        location: 'Main St & 5th Ave',
        status: 'completed',
        technician: 'Mike Rodriguez',
        cost: 75,
        rating: 5,
        duration: '20 min',
        description: 'Car battery was completely drained after leaving lights on overnight.'
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
        duration: '35 min',
        description: 'Front right tire had a nail puncture. Replaced with spare tire.'
      },
      {
        id: 'service-003',
        type: 'Towing',
        date: '2024-06-25T16:45:00Z',
        location: 'Downtown Plaza',
        status: 'completed',
        technician: 'Carlos Martinez',
        cost: 150,
        rating: 4,
        duration: '45 min',
        description: 'Engine overheating issue. Towed to nearby mechanic shop.'
      }
    ];

    this.supportTickets = this.loadFromStorage('supportTickets') || [
      {
        id: 'ticket-001',
        subject: 'Billing Question',
        status: 'resolved',
        date: '2024-07-09T10:30:00Z',
        messages: [
          { sender: 'user', message: 'I have a question about my last service charge.', timestamp: '2024-07-09T10:30:00Z' },
          { sender: 'support', message: 'Hi John! I\'d be happy to help with your billing question. Can you provide more details?', timestamp: '2024-07-09T10:35:00Z' },
          { sender: 'user', message: 'The tire change service was charged $100, but I thought the quote was $85.', timestamp: '2024-07-09T10:37:00Z' },
          { sender: 'support', message: 'I see the issue. The base price was $85, but there was a $15 fee for highway service. This was mentioned during booking. I\'ve added a note to your account for future reference.', timestamp: '2024-07-09T10:40:00Z' }
        ]
      }
    ];

    this.currentBooking = null;
    this.currentView = 'dashboard';
    this.sosActive = false;
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(`roadside_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(`roadside_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
      return null;
    }
  }

  addServiceToHistory(service) {
    this.serviceHistory.unshift(service);
    this.saveToStorage('serviceHistory', this.serviceHistory);
    this.updateUserStats();
  }

  updateUserStats() {
    const completed = this.serviceHistory.filter(s => s.status === 'completed');
    this.currentUser.stats.totalServices = completed.length;
    this.currentUser.stats.totalSpent = completed.reduce((sum, s) => sum + s.cost, 0);
    this.currentUser.stats.avgRating = completed.length > 0 
      ? completed.reduce((sum, s) => sum + s.rating, 0) / completed.length 
      : 0;
    this.saveToStorage('currentUser', this.currentUser);
  }

  updateProfile(updates) {
    Object.assign(this.currentUser, updates);
    this.saveToStorage('currentUser', this.currentUser);
  }

  addSupportTicket(ticket) {
    this.supportTickets.unshift(ticket);
    this.saveToStorage('supportTickets', this.supportTickets);
  }

  updateSupportTicket(ticketId, updates) {
    const ticket = this.supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      Object.assign(ticket, updates);
      this.saveToStorage('supportTickets', this.supportTickets);
    }
  }
}

// Initialize app state
const appState = new AppState();

// Services Data
const services = {
  1: { id: 1, name: 'Towing', price: 150, icon: '🚛', estimatedTime: 45, description: 'Vehicle towing to your preferred location' },
  2: { id: 2, name: 'Battery Jump', price: 75, icon: '🔋', estimatedTime: 20, description: 'Jump start for dead battery' },
  3: { id: 3, name: 'Tire Change', price: 100, icon: '🛞', estimatedTime: 30, description: 'Flat tire replacement with spare' },
  4: { id: 4, name: 'Lockout', price: 85, icon: '🔓', estimatedTime: 20, description: 'Professional lockout assistance' },
  5: { id: 5, name: 'Fuel Delivery', price: 60, icon: '⛽', estimatedTime: 25, description: 'Emergency fuel delivery service' },
  6: { id: 6, name: 'Winch Recovery', price: 200, icon: '🪝', estimatedTime: 60, description: 'Vehicle recovery from ditches or obstacles' }
};

// Utility Functions
function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Loading Screen
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loading-screen').style.display = 'none';
    $('#login-screen').classList.remove('hidden');
  }, 1000);
});

// Authentication
function login() {
  $('#login-screen').classList.add('hidden');
  $('#main-app').classList.remove('hidden');
  updateUserInfo();
  showView('dashboard');
}

function logout() {
  $('#main-app').classList.add('hidden');
  $('#login-screen').classList.remove('hidden');
}

function updateUserInfo() {
  const user = appState.currentUser;
  $('.user-name').textContent = user.name;
  $('.user-avatar').textContent = user.name.split(' ').map(n => n[0]).join('');
}

// Navigation
function toggleNavDrawer() {
  $('#nav-drawer').classList.toggle('open');
}

function closeNavDrawer() {
  $('#nav-drawer').classList.remove('open');
}

function showView(viewName) {
  // Hide all views
  $all('.view').forEach(view => view.classList.remove('active'));
  $all('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
  
  // Show selected view
  $(`#${viewName}-view`).classList.add('active');
  
  // Update bottom nav
  const navItem = $(`.bottom-nav .nav-item[data-view="${viewName}"]`);
  if (navItem) navItem.classList.add('active');
  
  appState.currentView = viewName;
  
  // Update view content
  switch(viewName) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'history':
      updateHistoryView();
      break;
    case 'profile':
      updateProfileView();
      break;
    case 'support':
      updateSupportView();
      break;
  }
  
  closeNavDrawer();
}

// Dashboard Functions
function updateDashboard() {
  // Update recent services
  const recentContainer = $('#recent-services');
  const recentServices = appState.serviceHistory.slice(0, 3);
  
  recentContainer.innerHTML = recentServices.map(service => `
    <div class="service-item">
      <div class="service-icon">${services[Object.keys(services).find(k => services[k].name === service.type)]?.icon || '🔧'}</div>
      <div class="service-details">
        <h4>${service.type}</h4>
        <p>${formatDate(service.date)}</p>
        <p class="location">${service.location}</p>
      </div>
      <div class="service-status">
        <span class="status status--success">Completed</span>
        <div class="rating">${'⭐'.repeat(service.rating)}</div>
      </div>
    </div>
  `).join('');

  // Update stats
  const stats = appState.currentUser.stats;
  $('#total-services').textContent = stats.totalServices;
  $('#total-spent').textContent = `$${stats.totalSpent}`;
  $('#avg-rating').textContent = stats.avgRating.toFixed(1);
}

// Service Booking
function selectService(serviceId) {
  const service = services[serviceId];
  appState.currentBooking = {
    service: service,
    step: 1,
    details: {},
    estimatedCost: service.price
  };
  
  updateBookingModal();
  openBookingModal();
}

function updateBookingModal() {
  const booking = appState.currentBooking;
  if (!booking) return;

  // Update service display
  $('#selected-service-icon').textContent = booking.service.icon;
  $('#selected-service-name').textContent = booking.service.name;
  $('#selected-service-price').textContent = `$${booking.service.price}`;
  $('#service-description').textContent = booking.service.description;
  $('#estimated-time').textContent = `${booking.service.estimatedTime} min`;

  // Update steps
  $all('.booking-step').forEach(step => step.classList.remove('active'));
  $(`#booking-step-${booking.step}`).classList.add('active');
  
  $all('.booking-steps .step').forEach((step, index) => {
    step.classList.toggle('active', index + 1 === booking.step);
    step.classList.toggle('completed', index + 1 < booking.step);
  });
}

function nextBookingStep() {
  const booking = appState.currentBooking;
  if (!booking) return;

  // Validate current step
  if (booking.step === 2) {
    const location = $('#location-input').value;
    const description = $('#problem-description').value;
    
    if (!location.trim()) {
      alert('Please enter your location');
      return;
    }
    
    booking.details.location = location;
    booking.details.description = description;
  }

  if (booking.step < 4) {
    booking.step++;
    updateBookingModal();
    
    if (booking.step === 4) {
      updateBookingSummary();
    }
  }
}

function updateBookingSummary() {
  const booking = appState.currentBooking;
  $('#summary-service').textContent = booking.service.name;
  $('#summary-location').textContent = booking.details.location || 'Current Location';
  $('#summary-payment').textContent = 'Credit Card ••••4242';
  $('#summary-total').textContent = `$${booking.estimatedCost}`;
}

function selectPaymentMethod(element) {
  $all('.payment-method').forEach(method => method.classList.remove('active'));
  element.classList.add('active');
}

function confirmBooking() {
  const booking = appState.currentBooking;
  if (!booking) return;

  // Create service record
  const serviceRecord = {
    id: generateId('service'),
    type: booking.service.name,
    date: new Date().toISOString(),
    location: booking.details.location || 'Current Location',
    status: 'in_progress',
    technician: 'Mike Rodriguez',
    cost: booking.estimatedCost,
    rating: 0,
    duration: `${booking.service.estimatedTime} min`,
    description: booking.details.description || ''
  };

  appState.addServiceToHistory(serviceRecord);
  closeBookingModal();
  
  // Start tracking
  setTimeout(() => {
    openTrackingModal(serviceRecord);
  }, 500);
}

function openBookingModal() {
  $('#booking-modal').classList.add('active');
}

function closeBookingModal() {
  $('#booking-modal').classList.remove('active');
  appState.currentBooking = null;
}

// Service Tracking
function openTrackingModal(service) {
  $('#tracking-modal').classList.add('active');
  startServiceTracking(service);
}

function closeTrackingModal() {
  $('#tracking-modal').classList.remove('active');
}

function startServiceTracking(service) {
  let timeRemaining = service ? parseInt(service.duration) : 15;
  $('#eta-time').textContent = `${timeRemaining} minutes`;
  
  const interval = setInterval(() => {
    timeRemaining--;
    $('#eta-time').textContent = `${timeRemaining} minutes`;
    
    if (timeRemaining <= 0) {
      clearInterval(interval);
      $('#tracking-status').innerHTML = `
        <div class="status-icon">✅</div>
        <h3>Service Completed</h3>
        <p>Your technician has finished the service</p>
      `;
      
      // Update service status
      const serviceIndex = appState.serviceHistory.findIndex(s => s.id === service.id);
      if (serviceIndex !== -1) {
        appState.serviceHistory[serviceIndex].status = 'completed';
        appState.serviceHistory[serviceIndex].rating = 5;
        appState.saveToStorage('serviceHistory', appState.serviceHistory);
        appState.updateUserStats();
      }
      
      setTimeout(() => {
        closeTrackingModal();
        showView('dashboard');
      }, 3000);
    }
  }, 2000); // Faster for demo
}

function callTechnician() {
  alert('Calling technician: +1 (555) 123-4567');
}

// History Functions
function updateHistoryView() {
  const historyContainer = $('#service-history-list');
  
  if (appState.serviceHistory.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Service History</h3>
        <p>Your service history will appear here</p>
      </div>
    `;
    return;
  }

  historyContainer.innerHTML = appState.serviceHistory.map(service => `
    <div class="history-card" onclick="viewServiceDetails('${service.id}')">
      <div class="history-header">
        <div class="service-type">
          <span class="service-icon">${services[Object.keys(services).find(k => services[k].name === service.type)]?.icon || '🔧'}</span>
          <span>${service.type}</span>
        </div>
        <span class="status status--${service.status === 'completed' ? 'success' : 'info'}">${service.status}</span>
      </div>
      <div class="history-details">
        <p><strong>Date:</strong> ${formatDate(service.date)}</p>
        <p><strong>Location:</strong> ${service.location}</p>
        <p><strong>Technician:</strong> ${service.technician}</p>
        <p><strong>Cost:</strong> $${service.cost}</p>
        ${service.rating > 0 ? `<div class="rating">${'⭐'.repeat(service.rating)} (${service.rating}/5)</div>` : ''}
      </div>
    </div>
  `).join('');
}

function viewServiceDetails(serviceId) {
  const service = appState.serviceHistory.find(s => s.id === serviceId);
  if (!service) return;

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Service Details</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="service-detail-card">
          <div class="service-header">
            <span class="service-icon">${services[Object.keys(services).find(k => services[k].name === service.type)]?.icon || '🔧'}</span>
            <h3>${service.type}</h3>
          </div>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Date & Time</label>
              <span>${formatDate(service.date)}</span>
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
            ${service.description ? `
              <div class="detail-item full-width">
                <label>Description</label>
                <span>${service.description}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Profile Functions
function updateProfileView() {
  const user = appState.currentUser;
  
  // Update profile form
  $('#profile-name').value = user.name;
  $('#profile-email').value = user.email;
  $('#profile-phone').value = user.phone;
  $('#emergency-contact-name').value = user.emergencyContact.name;
  $('#emergency-contact-phone').value = user.emergencyContact.phone;
  $('#emergency-contact-relationship').value = user.emergencyContact.relationship;
  
  // Update preferences
  $('#notifications-enabled').checked = user.preferences.notifications;
  $('#location-enabled').checked = user.preferences.location;
  $('#dark-mode-enabled').checked = user.preferences.darkMode;
  
  // Update stats display
  $('#profile-total-services').textContent = user.stats.totalServices;
  $('#profile-total-spent').textContent = `$${user.stats.totalSpent}`;
  $('#profile-avg-rating').textContent = user.stats.avgRating.toFixed(1);
  $('#profile-member-since').textContent = new Date(user.memberSince).toLocaleDateString();
}

function saveProfile() {
  const updates = {
    name: $('#profile-name').value,
    email: $('#profile-email').value,
    phone: $('#profile-phone').value,
    emergencyContact: {
      name: $('#emergency-contact-name').value,
      phone: $('#emergency-contact-phone').value,
      relationship: $('#emergency-contact-relationship').value
    },
    preferences: {
      notifications: $('#notifications-enabled').checked,
      location: $('#location-enabled').checked,
      darkMode: $('#dark-mode-enabled').checked
    }
  };
  
  appState.updateProfile(updates);
  updateUserInfo();
  
  // Show success message
  showToast('Profile updated successfully', 'success');
}

// Support Functions
function updateSupportView() {
  const ticketsContainer = $('#support-tickets');
  
  if (appState.supportTickets.length === 0) {
    ticketsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>No Support Tickets</h3>
        <p>Your support conversations will appear here</p>
      </div>
    `;
  } else {
    ticketsContainer.innerHTML = appState.supportTickets.map(ticket => `
      <div class="support-ticket" onclick="openSupportChat('${ticket.id}')">
        <div class="ticket-header">
          <h4>${ticket.subject}</h4>
          <span class="status status--${ticket.status === 'resolved' ? 'success' : 'info'}">${ticket.status}</span>
        </div>
        <div class="ticket-preview">
          <p>${ticket.messages[ticket.messages.length - 1].message}</p>
          <span class="ticket-date">${formatDate(ticket.date)}</span>
        </div>
      </div>
    `).join('');
  }
}

function createSupportTicket() {
  const subject = prompt('What can we help you with?');
  if (!subject) return;
  
  const message = prompt('Please describe your issue:');
  if (!message) return;
  
  const ticket = {
    id: generateId('ticket'),
    subject: subject,
    status: 'open',
    date: new Date().toISOString(),
    messages: [
      {
        sender: 'user',
        message: message,
        timestamp: new Date().toISOString()
      },
      {
        sender: 'support',
        message: 'Thank you for contacting RoadSide+ support. We\'ve received your message and will respond shortly.',
        timestamp: new Date(Date.now() + 30000).toISOString()
      }
    ]
  };
  
  appState.addSupportTicket(ticket);
  updateSupportView();
  showToast('Support ticket created successfully', 'success');
}

function openSupportChat(ticketId) {
  const ticket = appState.supportTickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const modal = document.createElement('div');
  modal.className = 'modal active';
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
              <div class="message-time">${formatDate(msg.timestamp)}</div>
            </div>
          `).join('')}
        </div>
        <div class="chat-input-container">
          <input type="text" id="chat-input-${ticketId}" placeholder="Type your message..." class="form-control">
          <button onclick="sendSupportMessage('${ticketId}')" class="btn btn--primary">Send</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function sendSupportMessage(ticketId) {
  const input = $(`#chat-input-${ticketId}`);
  const message = input.value.trim();
  
  if (!message) return;
  
  const ticket = appState.supportTickets.find(t => t.id === ticketId);
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
      message: 'Thank you for your message. Our team is reviewing your request and will provide an update soon.',
      timestamp: new Date().toISOString()
    });
    
    appState.updateSupportTicket(ticketId, ticket);
    
    // Update chat display
    const chatContainer = $(`#chat-messages-${ticketId}`);
    if (chatContainer) {
      chatContainer.innerHTML = ticket.messages.map(msg => `
        <div class="message ${msg.sender === 'user' ? 'user-message' : 'support-message'}">
          <div class="message-content">${msg.message}</div>
          <div class="message-time">${formatDate(msg.timestamp)}</div>
        </div>
      `).join('');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 1000);
  
  input.value = '';
  appState.updateSupportTicket(ticketId, ticket);
  
  // Update chat display immediately for user message
  const chatContainer = $(`#chat-messages-${ticketId}`);
  if (chatContainer) {
    chatContainer.innerHTML = ticket.messages.map(msg => `
      <div class="message ${msg.sender === 'user' ? 'user-message' : 'support-message'}">
        <div class="message-content">${msg.message}</div>
        <div class="message-time">${formatDate(msg.timestamp)}</div>
      </div>
    `).join('');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

// Emergency SOS
function emergencyCall() {
  if (appState.sosActive) {
    cancelSOS();
    return;
  }
  
  appState.sosActive = true;
  
  // Create SOS modal
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'sos-modal';
  modal.innerHTML = `
    <div class="modal-content sos-modal">
      <div class="sos-header">
        <div class="sos-icon">🚨</div>
        <h2>EMERGENCY SOS ACTIVATED</h2>
        <p>Emergency services have been notified</p>
      </div>
      <div class="sos-body">
        <div class="sos-countdown" id="sos-countdown">
          <div class="countdown-circle">
            <span id="countdown-number">30</span>
          </div>
          <p>Emergency dispatch in <span id="countdown-text">30</span> seconds</p>
        </div>
        <div class="sos-info">
          <p><strong>Location:</strong> Current GPS location shared</p>
          <p><strong>Emergency Contact:</strong> ${appState.currentUser.emergencyContact.name} will be notified</p>
          <p><strong>Services:</strong> Police, Fire, Medical on standby</p>
        </div>
        <div class="sos-actions">
          <button onclick="cancelSOS()" class="btn btn--outline btn--full-width">Cancel Emergency</button>
          <button onclick="immediateDispatch()" class="btn btn--primary btn--full-width">Dispatch Now</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  startSOSCountdown();
}

function startSOSCountdown() {
  let countdown = 30;
  const countdownNumber = $('#countdown-number');
  const countdownText = $('#countdown-text');
  
  const interval = setInterval(() => {
    countdown--;
    if (countdownNumber) countdownNumber.textContent = countdown;
    if (countdownText) countdownText.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(interval);
      dispatchEmergency();
    }
  }, 1000);
  
  // Store interval for cancellation
  window.sosInterval = interval;
}

function cancelSOS() {
  appState.sosActive = false;
  
  if (window.sosInterval) {
    clearInterval(window.sosInterval);
  }
  
  const modal = $('#sos-modal');
  if (modal) {
    modal.remove();
  }
  
  showToast('Emergency SOS cancelled', 'info');
}

function immediateDispatch() {
  if (window.sosInterval) {
    clearInterval(window.sosInterval);
  }
  dispatchEmergency();
}

function dispatchEmergency() {
  const modal = $('#sos-modal');
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
            <p><strong>Your Location:</strong> GPS coordinates shared</p>
          </div>
          <div class="emergency-contacts">
            <h4>Emergency Contacts Notified</h4>
            <p>${appState.currentUser.emergencyContact.name} - ${appState.currentUser.emergencyContact.phone}</p>
          </div>
          <button onclick="closeEmergencyModal()" class="btn btn--primary btn--full-width">Close</button>
        </div>
      </div>
    `;
  }
  
  // Add to service history
  const emergencyService = {
    id: generateId('emergency'),
    type: 'Emergency SOS',
    date: new Date().toISOString(),
    location: 'Current GPS Location',
    status: 'in_progress',
    technician: 'Emergency Services',
    cost: 0,
    rating: 0,
    duration: 'Active',
    description: 'Emergency SOS activated - Emergency services dispatched'
  };
  
  appState.addServiceToHistory(emergencyService);
}

function closeEmergencyModal() {
  appState.sosActive = false;
  const modal = $('#sos-modal');
  if (modal) {
    modal.remove();
  }
}

// Utility Functions
function showToast(message, type = 'info') {
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Bottom navigation
  $all('.bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view) {
        showView(view);
      }
    });
  });

  // Modal close on outside click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.remove();
    }
  });

  // ESC key handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = $all('.modal');
      modals.forEach(modal => modal.remove());
      closeNavDrawer();
    }
  });
});

// Initialize the app
window.addEventListener('load', () => {
  updateUserInfo();
});