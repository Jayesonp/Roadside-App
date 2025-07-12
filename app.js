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
  showDashboard('customer'); // Initialize with customer dashboard
});

// Dashboard Management Functions
function showDashboard(dashboardType) {
  // Update active tab
  $all('.dashboard-tabs .tab').forEach(tab => tab.classList.remove('active'));
  
  // Find and activate the correct tab based on the dashboard type
  $all('.dashboard-tabs .tab').forEach(tab => {
    const onclick = tab.getAttribute('onclick');
    if (onclick && onclick.includes(`'${dashboardType}'`)) {
      tab.classList.add('active');
    }
  });
  
  // Update nav drawer active item
  $all('.nav-drawer .nav-item').forEach(item => item.classList.remove('active'));
  
  // Find and activate the correct nav item
  $all('.nav-drawer .nav-item').forEach(item => {
    const onclick = item.getAttribute('onclick');
    if (onclick && onclick.includes(`'${dashboardType}'`)) {
      item.classList.add('active');
    }
  });
  
  // Update dashboard content
  updateDashboardContent(dashboardType);
  
  // Store current dashboard type
  appState.currentDashboard = dashboardType;
  
  // Close navigation drawer after selection
  closeNavDrawer();
  
  // Show visual feedback
  showToast(`Switched to ${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Dashboard`, 'success');
}

function updateDashboardContent(dashboardType) {
  const dashboardView = $('#dashboard-view');
  
  if (!dashboardView) {
    console.error('Dashboard view not found');
    return;
  }
  
  let content = '';
  
  switch(dashboardType) {
    case 'customer':
      content = getCustomerDashboard();
      break;
    case 'technician':
      content = getTechnicianDashboard();
      break;
    case 'admin':
      content = getAdminDashboard();
      break;
    case 'partner':
      content = getPartnerDashboard();
      break;
    case 'security':
      content = getSecurityDashboard();
      break;
    default:
      content = getCustomerDashboard();
  }
  
  dashboardView.innerHTML = content;
  
  // Update dashboard-specific data if needed
  if (dashboardType === 'customer') {
    updateDashboard();
  }
}

function getCustomerDashboard() {
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
            <div class="service-card" onclick="selectService(1)">
                <div class="service-icon">🚛</div>
                <h3>Towing</h3>
                <p class="service-price">$150</p>
                <p class="service-time">45 min • 30 min response</p>
            </div>
            <div class="service-card" onclick="selectService(2)">
                <div class="service-icon">🔋</div>
                <h3>Battery Jump</h3>
                <p class="service-price">$75</p>
                <p class="service-time">20 min • 30 min response</p>
            </div>
            <div class="service-card" onclick="selectService(3)">
                <div class="service-icon">🛞</div>
                <h3>Tire Change</h3>
                <p class="service-price">$100</p>
                <p class="service-time">30 min • 30 min response</p>
            </div>
            <div class="service-card" onclick="selectService(4)">
                <div class="service-icon">🔓</div>
                <h3>Lockout</h3>
                <p class="service-price">$85</p>
                <p class="service-time">20 min • 30 min response</p>
            </div>
            <div class="service-card" onclick="selectService(5)">
                <div class="service-icon">⛽</div>
                <h3>Fuel Delivery</h3>
                <p class="service-price">$60</p>
                <p class="service-time">15 min • 30 min response</p>
            </div>
            <div class="service-card" onclick="selectService(6)">
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
            <!-- Recent services will be populated by JavaScript -->
        </div>
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
}

function getTechnicianDashboard() {
  return `
    <div class="dashboard-header">
        <h1>🔧 Technician Dashboard</h1>
        <p>Manage your service assignments</p>
    </div>

    <div class="stats-section">
        <h2>Today's Overview</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-value">8</div>
                <div class="stat-label">Active Jobs</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-value">15</div>
                <div class="stat-label">Completed Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">4.9</div>
                <div class="stat-label">Rating</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">$1,250</div>
                <div class="stat-label">Earnings Today</div>
            </div>
        </div>
    </div>

    <div class="services-section">
        <h2>Current Assignments</h2>
        <div class="assignment-list">
            <div class="assignment-card urgent">
                <div class="assignment-header">
                    <span class="service-type">🚛 Towing</span>
                    <span class="priority high">HIGH PRIORITY</span>
                </div>
                <div class="assignment-details">
                    <p><strong>Location:</strong> Highway 101, Mile 42</p>
                    <p><strong>Customer:</strong> Sarah Johnson</p>
                    <p><strong>Issue:</strong> Engine failure, needs towing</p>
                    <p><strong>ETA:</strong> 12 minutes</p>
                </div>
                <div class="assignment-actions">
                    <button class="btn btn--primary btn--sm" onclick="acceptJob('job-001')">Accept</button>
                    <button class="btn btn--outline btn--sm" onclick="callCustomer('555-0123')">📞 Call</button>
                </div>
            </div>
            
            <div class="assignment-card">
                <div class="assignment-header">
                    <span class="service-type">🔋 Battery Jump</span>
                    <span class="priority medium">MEDIUM</span>
                </div>
                <div class="assignment-details">
                    <p><strong>Location:</strong> Downtown Plaza Parking</p>
                    <p><strong>Customer:</strong> Mike Chen</p>
                    <p><strong>Issue:</strong> Dead battery after leaving lights on</p>
                    <p><strong>ETA:</strong> 25 minutes</p>
                </div>
                <div class="assignment-actions">
                    <button class="btn btn--primary btn--sm" onclick="acceptJob('job-002')">Accept</button>
                    <button class="btn btn--outline btn--sm" onclick="callCustomer('555-0456')">📞 Call</button>
                </div>
            </div>
        </div>
    </div>
  `;
}

function getAdminDashboard() {
  return `
    <div class="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>System management and analytics</p>
    </div>

    <div class="stats-section">
        <h2>System Overview</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-value">1,247</div>
                <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔧</div>
                <div class="stat-value">89</div>
                <div class="stat-label">Active Technicians</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">342</div>
                <div class="stat-label">Services Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">$45,680</div>
                <div class="stat-label">Revenue Today</div>
            </div>
        </div>
    </div>

    <div class="admin-controls">
        <h2>System Controls</h2>
        <div class="control-grid">
            <div class="control-card" onclick="manageUsers()">
                <div class="control-icon">👤</div>
                <h3>User Management</h3>
                <p>Manage customer accounts and permissions</p>
            </div>
            <div class="control-card" onclick="manageTechnicians()">
                <div class="control-icon">🔧</div>
                <h3>Technician Management</h3>
                <p>Monitor and assign technician resources</p>
            </div>
            <div class="control-card" onclick="viewAnalytics()">
                <div class="control-icon">📈</div>
                <h3>Analytics</h3>
                <p>View detailed system performance metrics</p>
            </div>
            <div class="control-card" onclick="systemSettings()">
                <div class="control-icon">⚙️</div>
                <h3>System Settings</h3>
                <p>Configure system parameters and features</p>
            </div>
        </div>
    </div>

    <div class="recent-section">
        <h2>Recent Activity</h2>
        <div class="activity-list">
            <div class="activity-item">
                <span class="activity-icon">✅</span>
                <div class="activity-details">
                    <p><strong>Service Completed:</strong> Towing service for customer #1247</p>
                    <span class="activity-time">2 minutes ago</span>
                </div>
            </div>
            <div class="activity-item">
                <span class="activity-icon">👤</span>
                <div class="activity-details">
                    <p><strong>New User:</strong> Jane Smith registered</p>
                    <span class="activity-time">5 minutes ago</span>
                </div>
            </div>
            <div class="activity-item">
                <span class="activity-icon">🚨</span>
                <div class="activity-details">
                    <p><strong>Emergency Alert:</strong> SOS activated by user #892</p>
                    <span class="activity-time">8 minutes ago</span>
                </div>
            </div>
        </div>
    </div>
  `;
}

function getPartnerDashboard() {
  return `
    <div class="dashboard-header">
        <h1>🤝 Partner Dashboard</h1>
        <p>Business partnerships and integrations</p>
    </div>

    <div class="stats-section">
        <h2>Partnership Overview</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🤝</div>
                <div class="stat-value">24</div>
                <div class="stat-label">Active Partners</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-value">156</div>
                <div class="stat-label">Referrals This Month</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-value">$12,450</div>
                <div class="stat-label">Commission Earned</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">4.8</div>
                <div class="stat-label">Partner Rating</div>
            </div>
        </div>
    </div>

    <div class="partner-management">
        <h2>Partner Network</h2>
        <div class="partner-list">
            <div class="partner-card">
                <div class="partner-header">
                    <div class="partner-logo">🏢</div>
                    <div class="partner-info">
                        <h3>AutoCare Plus</h3>
                        <p>Tier 1 Partner • 156 referrals</p>
                    </div>
                    <span class="partner-status active">Active</span>
                </div>
                <div class="partner-stats">
                    <span>Revenue: $45,600</span>
                    <span>Rating: 4.9★</span>
                </div>
            </div>
            
            <div class="partner-card">
                <div class="partner-header">
                    <div class="partner-logo">🚗</div>
                    <div class="partner-info">
                        <h3>QuickFix Motors</h3>
                        <p>Tier 2 Partner • 89 referrals</p>
                    </div>
                    <span class="partner-status active">Active</span>
                </div>
                <div class="partner-stats">
                    <span>Revenue: $28,400</span>
                    <span>Rating: 4.7★</span>
                </div>
            </div>
        </div>
    </div>

    <div class="commission-section">
        <h2>Commission Tracking</h2>
        <div class="commission-chart">
            <div class="chart-placeholder">
                <p>📊 Commission trends and analytics would be displayed here</p>
                <div class="mini-stats">
                    <span>This Month: $12,450</span>
                    <span>Last Month: $11,200</span>
                    <span>Growth: +11.2%</span>
                </div>
            </div>
        </div>
    </div>
  `;
}

function getSecurityDashboard() {
  return `
    <div class="dashboard-header">
        <h1>🛡️ Security Dashboard</h1>
        <p>System security and threat monitoring</p>
    </div>

    <div class="security-alerts">
        <div class="alert-banner warning">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
                <h3>Security Alert</h3>
                <p>2 failed login attempts detected from unusual locations</p>
            </div>
            <button class="btn btn--outline btn--sm">Investigate</button>
        </div>
    </div>

    <div class="stats-section">
        <h2>Security Overview</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🛡️</div>
                <div class="stat-value">99.8%</div>
                <div class="stat-label">System Uptime</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔒</div>
                <div class="stat-value">847</div>
                <div class="stat-label">Secure Sessions</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">⚠️</div>
                <div class="stat-value">3</div>
                <div class="stat-label">Security Alerts</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔐</div>
                <div class="stat-value">0</div>
                <div class="stat-label">Breaches Detected</div>
            </div>
        </div>
    </div>

    <div class="security-monitoring">
        <h2>Real-Time Monitoring</h2>
        <div class="monitoring-grid">
            <div class="monitor-card">
                <h3>🌐 Network Traffic</h3>
                <div class="traffic-indicator normal">Normal</div>
                <p>2.3k requests/min</p>
            </div>
            <div class="monitor-card">
                <h3>🔑 Authentication</h3>
                <div class="traffic-indicator normal">Secure</div>
                <p>All logins verified</p>
            </div>
            <div class="monitor-card">
                <h3>💾 Data Integrity</h3>
                <div class="traffic-indicator normal">Protected</div>
                <p>Encryption active</p>
            </div>
        </div>
    </div>

    <div class="recent-section">
        <h2>Security Log</h2>
        <div class="security-log">
            <div class="log-entry">
                <span class="log-time">14:32:15</span>
                <span class="log-level info">INFO</span>
                <span class="log-message">User authentication successful - ID: 1247</span>
            </div>
            <div class="log-entry">
                <span class="log-time">14:30:42</span>
                <span class="log-level warning">WARN</span>
                <span class="log-message">Failed login attempt from IP: 192.168.1.100</span>
            </div>
            <div class="log-entry">
                <span class="log-time">14:28:33</span>
                <span class="log-level info">INFO</span>
                <span class="log-message">System backup completed successfully</span>
            </div>
            <div class="log-entry">
                <span class="log-time">14:25:18</span>
                <span class="log-level info">INFO</span>
                <span class="log-message">Emergency SOS activated - User ID: 892</span>
            </div>
        </div>
    </div>
  `;
}

// Additional Functions for Dashboard Actions
function acceptJob(jobId) {
  showToast(`Job ${jobId} accepted. Customer notified.`, 'success');
}

function callCustomer(phoneNumber) {
  alert(`Calling customer: ${phoneNumber}`);
}

function manageUsers() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content admin-control-modal">
      <div class="modal-header">
        <h2>👤 User Management</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="admin-tabs">
          <div class="admin-tab active" onclick="switchAdminTab(this, 'active-users')">Active Users</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'user-analytics')">Analytics</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'user-actions')">Actions</div>
        </div>
        
        <div id="active-users" class="admin-tab-content active">
          <div class="search-bar">
            <input type="text" placeholder="Search users..." class="form-control" onkeyup="searchUsers(this.value)">
          </div>
          <div class="user-list" id="user-management-list">
            <div class="user-item">
              <div class="user-avatar">JD</div>
              <div class="user-details">
                <h4>John Doe</h4>
                <p>john.doe@email.com • Member since 2023</p>
                <span class="status active">Active</span>
              </div>
              <div class="user-actions">
                <button class="btn btn--sm btn--outline" onclick="editUser('user-123')">Edit</button>
                <button class="btn btn--sm btn--primary" onclick="viewUserDetails('user-123')">Details</button>
              </div>
            </div>
            <div class="user-item">
              <div class="user-avatar">SM</div>
              <div class="user-details">
                <h4>Sarah Miller</h4>
                <p>sarah.m@email.com • Member since 2023</p>
                <span class="status active">Active</span>
              </div>
              <div class="user-actions">
                <button class="btn btn--sm btn--outline" onclick="editUser('user-124')">Edit</button>
                <button class="btn btn--sm btn--primary" onclick="viewUserDetails('user-124')">Details</button>
              </div>
            </div>
            <div class="user-item">
              <div class="user-avatar">MC</div>
              <div class="user-details">
                <h4>Mike Chen</h4>
                <p>mike.chen@email.com • Member since 2024</p>
                <span class="status pending">Pending</span>
              </div>
              <div class="user-actions">
                <button class="btn btn--sm btn--outline" onclick="editUser('user-125')">Edit</button>
                <button class="btn btn--sm btn--primary" onclick="viewUserDetails('user-125')">Details</button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="user-analytics" class="admin-tab-content">
          <div class="analytics-grid">
            <div class="metric-card">
              <h3>1,247</h3>
              <p>Total Users</p>
              <span class="trend up">+12% this month</span>
            </div>
            <div class="metric-card">
              <h3>1,156</h3>
              <p>Active Users</p>
              <span class="trend up">+8% this month</span>
            </div>
            <div class="metric-card">
              <h3>91</h3>
              <p>New This Month</p>
              <span class="trend up">+15% vs last month</span>
            </div>
            <div class="metric-card">
              <h3>4.8</h3>
              <p>Avg User Rating</p>
              <span class="trend stable">Stable</span>
            </div>
          </div>
          <div class="chart-placeholder">
            <h4>User Growth Trends</h4>
            <p>📈 User registration and activity trends would be displayed here</p>
          </div>
        </div>
        
        <div id="user-actions" class="admin-tab-content">
          <div class="bulk-actions">
            <h3>Bulk Actions</h3>
            <div class="action-buttons">
              <button class="btn btn--primary" onclick="exportUserData()">📄 Export User Data</button>
              <button class="btn btn--outline" onclick="sendBulkNotification()">📢 Send Notification</button>
              <button class="btn btn--outline" onclick="generateUserReport()">📊 Generate Report</button>
            </div>
          </div>
          <div class="system-actions">
            <h3>System Actions</h3>
            <div class="action-buttons">
              <button class="btn btn--outline" onclick="purgeInactiveUsers()">🗑️ Purge Inactive Users</button>
              <button class="btn btn--outline" onclick="resetUserPasswords()">🔑 Bulk Password Reset</button>
              <button class="btn btn--outline" onclick="auditUserActivity()">🔍 Audit User Activity</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function manageTechnicians() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content admin-control-modal">
      <div class="modal-header">
        <h2>🔧 Technician Management</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="admin-tabs">
          <div class="admin-tab active" onclick="switchAdminTab(this, 'active-techs')">Active Technicians</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'tech-performance')">Performance</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'tech-scheduling')">Scheduling</div>
        </div>
        
        <div id="active-techs" class="admin-tab-content active">
          <div class="tech-controls">
            <button class="btn btn--primary" onclick="addNewTechnician()">➕ Add Technician</button>
            <div class="filter-controls">
              <select class="form-control" onchange="filterTechnicians(this.value)">
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
          <div class="technician-list">
            <div class="tech-item">
              <div class="tech-status available"></div>
              <div class="tech-avatar">MR</div>
              <div class="tech-details">
                <h4>Mike Rodriguez</h4>
                <p>Certified Technician • ID: TECH-001</p>
                <div class="tech-stats">
                  <span>Rating: 4.9★</span>
                  <span>Jobs Today: 8</span>
                  <span>Status: Available</span>
                </div>
              </div>
              <div class="tech-actions">
                <button class="btn btn--sm btn--outline" onclick="assignJob('TECH-001')">Assign Job</button>
                <button class="btn btn--sm btn--primary" onclick="viewTechDetails('TECH-001')">Details</button>
              </div>
            </div>
            <div class="tech-item">
              <div class="tech-status busy"></div>
              <div class="tech-avatar">SJ</div>
              <div class="tech-details">
                <h4>Sarah Johnson</h4>
                <p>Senior Technician • ID: TECH-002</p>
                <div class="tech-stats">
                  <span>Rating: 4.8★</span>
                  <span>Jobs Today: 6</span>
                  <span>Status: On Job</span>
                </div>
              </div>
              <div class="tech-actions">
                <button class="btn btn--sm btn--outline" disabled>Busy</button>
                <button class="btn btn--sm btn--primary" onclick="viewTechDetails('TECH-002')">Details</button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="tech-performance" class="admin-tab-content">
          <div class="performance-metrics">
            <div class="metric-card">
              <h3>89</h3>
              <p>Active Technicians</p>
              <span class="trend up">+3 this week</span>
            </div>
            <div class="metric-card">
              <h3>4.7</h3>
              <p>Avg Rating</p>
              <span class="trend up">+0.2 this month</span>
            </div>
            <div class="metric-card">
              <h3>12.5</h3>
              <p>Avg Response Time (min)</p>
              <span class="trend down">-1.2 this week</span>
            </div>
            <div class="metric-card">
              <h3>98.2%</h3>
              <p>Success Rate</p>
              <span class="trend stable">Stable</span>
            </div>
          </div>
        </div>
        
        <div id="tech-scheduling" class="admin-tab-content">
          <div class="schedule-controls">
            <h3>Shift Management</h3>
            <div class="schedule-grid">
              <div class="time-slot">
                <span class="time">6:00 AM - 2:00 PM</span>
                <span class="tech-count">24 Technicians</span>
                <button class="btn btn--sm btn--outline">Manage</button>
              </div>
              <div class="time-slot">
                <span class="time">2:00 PM - 10:00 PM</span>
                <span class="tech-count">32 Technicians</span>
                <button class="btn btn--sm btn--outline">Manage</button>
              </div>
              <div class="time-slot">
                <span class="time">10:00 PM - 6:00 AM</span>
                <span class="tech-count">18 Technicians</span>
                <button class="btn btn--sm btn--outline">Manage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function viewAnalytics() {
  const modal = document.createElement('div');
  modal.className = 'modal active analytics-modal';
  modal.innerHTML = `
    <div class="modal-content admin-control-modal">
      <div class="modal-header">
        <h2>📈 System Analytics</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="admin-tabs">
          <div class="admin-tab active" onclick="switchAdminTab(this, 'revenue-analytics')">Revenue</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'service-analytics')">Services</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'performance-analytics')">Performance</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'geographic-analytics')">Geographic</div>
        </div>
        
        <div id="revenue-analytics" class="admin-tab-content active">
          <div class="revenue-summary">
            <div class="revenue-card">
              <h3>$45,680</h3>
              <p>Today's Revenue</p>
              <span class="trend up">+15.2% vs yesterday</span>
            </div>
            <div class="revenue-card">
              <h3>$1.2M</h3>
              <p>Monthly Revenue</p>
              <span class="trend up">+8.7% vs last month</span>
            </div>
            <div class="revenue-card">
              <h3>$13.8M</h3>
              <p>Annual Revenue</p>
              <span class="trend up">+22.1% vs last year</span>
            </div>
          </div>
          <div class="chart-section">
            <h4>Revenue Trends (Last 30 Days)</h4>
            <div class="chart-placeholder">
              <p>📊 Interactive revenue charts would be displayed here</p>
              <div class="mini-chart-data">
                <span>Peak Day: $52,400 (July 8th)</span>
                <span>Avg Daily: $41,200</span>
                <span>Growth Rate: +12.5%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div id="service-analytics" class="admin-tab-content">
          <div class="service-breakdown">
            <div class="service-stat">
              <span class="service-icon">🚛</span>
              <div class="stat-details">
                <h4>Towing Services</h4>
                <p>142 services • $21,300 revenue</p>
                <span class="percentage">32% of total</span>
              </div>
            </div>
            <div class="service-stat">
              <span class="service-icon">🔋</span>
              <div class="stat-details">
                <h4>Battery Jump</h4>
                <p>98 services • $7,350 revenue</p>
                <span class="percentage">22% of total</span>
              </div>
            </div>
            <div class="service-stat">
              <span class="service-icon">🛞</span>
              <div class="stat-details">
                <h4>Tire Change</h4>
                <p>76 services • $7,600 revenue</p>
                <span class="percentage">18% of total</span>
              </div>
            </div>
          </div>
        </div>
        
        <div id="performance-analytics" class="admin-tab-content">
          <div class="performance-grid">
            <div class="performance-metric">
              <h4>Response Time</h4>
              <div class="metric-value">12.3 min</div>
              <span class="trend down">-8% improvement</span>
            </div>
            <div class="performance-metric">
              <h4>Success Rate</h4>
              <div class="metric-value">98.2%</div>
              <span class="trend up">+0.5% this month</span>
            </div>
            <div class="performance-metric">
              <h4>Customer Satisfaction</h4>
              <div class="metric-value">4.8/5</div>
              <span class="trend up">+0.2 this month</span>
            </div>
          </div>
        </div>
        
        <div id="geographic-analytics" class="admin-tab-content">
          <div class="geographic-data">
            <h4>Service Distribution by Region</h4>
            <div class="region-list">
              <div class="region-item">
                <span class="region-name">Downtown</span>
                <span class="region-services">89 services</span>
                <span class="region-revenue">$13,400</span>
              </div>
              <div class="region-item">
                <span class="region-name">Suburbs North</span>
                <span class="region-services">67 services</span>
                <span class="region-revenue">$10,050</span>
              </div>
              <div class="region-item">
                <span class="region-name">Highway Corridor</span>
                <span class="region-services">124 services</span>
                <span class="region-revenue">$18,600</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function systemSettings() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content admin-control-modal">
      <div class="modal-header">
        <h2>⚙️ System Settings</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div class="admin-tabs">
          <div class="admin-tab active" onclick="switchAdminTab(this, 'general-settings')">General</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'service-settings')">Services</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'notification-settings')">Notifications</div>
          <div class="admin-tab" onclick="switchAdminTab(this, 'security-settings')">Security</div>
        </div>
        
        <div id="general-settings" class="admin-tab-content active">
          <div class="settings-section">
            <h3>System Configuration</h3>
            <div class="setting-item">
              <label>System Name</label>
              <input type="text" class="form-control" value="RoadSide+ Emergency">
            </div>
            <div class="setting-item">
              <label>Maintenance Mode</label>
              <div class="toggle-switch">
                <input type="checkbox" id="maintenance-mode">
                <label for="maintenance-mode" class="toggle-label"></label>
              </div>
            </div>
            <div class="setting-item">
              <label>Max Response Time (minutes)</label>
              <input type="number" class="form-control" value="30">
            </div>
            <div class="setting-item">
              <label>Emergency Contact Number</label>
              <input type="tel" class="form-control" value="1-800-ROADSIDE">
            </div>
          </div>
        </div>
        
        <div id="service-settings" class="admin-tab-content">
          <div class="settings-section">
            <h3>Service Configuration</h3>
            <div class="service-pricing">
              <div class="price-item">
                <span>🚛 Towing</span>
                <input type="number" class="form-control price-input" value="150">
                <span>USD</span>
              </div>
              <div class="price-item">
                <span>🔋 Battery Jump</span>
                <input type="number" class="form-control price-input" value="75">
                <span>USD</span>
              </div>
              <div class="price-item">
                <span>🛞 Tire Change</span>
                <input type="number" class="form-control price-input" value="100">
                <span>USD</span>
              </div>
            </div>
            <button class="btn btn--primary" onclick="updateServicePricing()">Update Pricing</button>
          </div>
        </div>
        
        <div id="notification-settings" class="admin-tab-content">
          <div class="settings-section">
            <h3>Notification Preferences</h3>
            <div class="notification-item">
              <label>Email Notifications</label>
              <div class="toggle-switch">
                <input type="checkbox" id="email-notifications" checked>
                <label for="email-notifications" class="toggle-label"></label>
              </div>
            </div>
            <div class="notification-item">
              <label>SMS Alerts</label>
              <div class="toggle-switch">
                <input type="checkbox" id="sms-alerts" checked>
                <label for="sms-alerts" class="toggle-label"></label>
              </div>
            </div>
            <div class="notification-item">
              <label>Push Notifications</label>
              <div class="toggle-switch">
                <input type="checkbox" id="push-notifications" checked>
                <label for="push-notifications" class="toggle-label"></label>
              </div>
            </div>
          </div>
        </div>
        
        <div id="security-settings" class="admin-tab-content">
          <div class="settings-section">
            <h3>Security Configuration</h3>
            <div class="setting-item">
              <label>Session Timeout (minutes)</label>
              <input type="number" class="form-control" value="30">
            </div>
            <div class="setting-item">
              <label>Two-Factor Authentication</label>
              <div class="toggle-switch">
                <input type="checkbox" id="two-factor" checked>
                <label for="two-factor" class="toggle-label"></label>
              </div>
            </div>
            <div class="setting-item">
              <label>Password Expiry (days)</label>
              <input type="number" class="form-control" value="90">
            </div>
            <button class="btn btn--primary" onclick="updateSecuritySettings()">Update Security</button>
          </div>
        </div>
        
        <div class="settings-actions">
          <button class="btn btn--primary" onclick="saveSystemSettings()">Save All Settings</button>
          <button class="btn btn--outline" onclick="resetToDefaults()">Reset to Defaults</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Helper functions for admin controls
function switchAdminTab(tabElement, contentId) {
  // Remove active class from all tabs and content
  tabElement.parentNode.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  tabElement.closest('.modal-body').querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to clicked tab and corresponding content
  tabElement.classList.add('active');
  document.getElementById(contentId).classList.add('active');
}

function searchUsers(query) {
  const userItems = document.querySelectorAll('.user-item');
  userItems.forEach(item => {
    const userName = item.querySelector('h4').textContent.toLowerCase();
    const userEmail = item.querySelector('p').textContent.toLowerCase();
    if (userName.includes(query.toLowerCase()) || userEmail.includes(query.toLowerCase())) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function editUser(userId) {
  showToast(`Opening edit dialog for user ${userId}`, 'info');
}

function viewUserDetails(userId) {
  showToast(`Loading detailed view for user ${userId}`, 'info');
}

function exportUserData() {
  showToast('Exporting user data to CSV...', 'success');
}

function sendBulkNotification() {
  showToast('Opening bulk notification composer...', 'info');
}

function generateUserReport() {
  showToast('Generating comprehensive user report...', 'success');
}

function purgeInactiveUsers() {
  if (confirm('Are you sure you want to purge inactive users? This cannot be undone.')) {
    showToast('Purging inactive users...', 'success');
  }
}

function resetUserPasswords() {
  if (confirm('Reset passwords for selected users?')) {
    showToast('Password reset emails sent to selected users', 'success');
  }
}

function auditUserActivity() {
  showToast('Generating user activity audit report...', 'info');
}

function addNewTechnician() {
  showToast('Opening new technician registration form...', 'info');
}

function filterTechnicians(status) {
  showToast(`Filtering technicians by status: ${status}`, 'info');
}

function assignJob(techId) {
  showToast(`Opening job assignment for technician ${techId}`, 'info');
}

function viewTechDetails(techId) {
  showToast(`Loading detailed view for technician ${techId}`, 'info');
}

function updateServicePricing() {
  showToast('Service pricing updated successfully', 'success');
}

function updateSecuritySettings() {
  showToast('Security settings updated successfully', 'success');
}

function saveSystemSettings() {
  showToast('All system settings saved successfully', 'success');
}

function resetToDefaults() {
  if (confirm('Reset all settings to defaults? This cannot be undone.')) {
    showToast('Settings reset to default values', 'success');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializeBookingWorkflow();
    initializeBottomNavigation();
    populateRecentServices();
    loadRecentServices();
    updateDashboardStats();
});

function initializeLoadingScreen() {
    // Loading screen initialization logic
    console.log('Loading screen initialized');
}

function initializeBookingWorkflow() {
    // Booking workflow initialization logic
    console.log('Booking workflow initialized');
}

function initializeBottomNavigation() {
    // Bottom navigation initialization logic
    console.log('Bottom navigation initialized');
}

function populateRecentServices() {
    // Populate recent services logic
    console.log('Recent services populated');
}

function loadRecentServices() {
    // Load recent services logic
    console.log('Recent services loaded');
}

function updateDashboardStats() {
    // Update dashboard stats logic
    console.log('Dashboard stats updated');
}