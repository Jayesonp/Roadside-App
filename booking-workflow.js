// Enhanced Booking Workflow System
class BookingWorkflow {
  constructor() {
    this.currentBooking = null;
    this.availableTechnicians = [];
    this.currentLocation = null;
    this.mapInstance = null;
    this.socket = null;
    this.initializeSystem();
  }

  initializeSystem() {
    this.initializeGeolocation();
    this.initializeWebSocket();
    this.initializePushNotifications();
  }

  // Initialize geolocation for customer and technician tracking
  initializeGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          console.log('Location acquired:', this.currentLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.showLocationError();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }

  // Initialize WebSocket for real-time updates
  initializeWebSocket() {
    // Simulate WebSocket connection for real-time updates
    this.socket = {
      send: (data) => console.log('WebSocket send:', data),
      onMessage: (callback) => this.socketCallback = callback,
      emit: (event, data) => {
        if (this.socketCallback) {
          this.socketCallback({ event, data });
        }
      }
    };
  }

  // Initialize push notifications
  initializePushNotifications() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  // 1. CUSTOMER BOOKING INTERFACE
  async createBookingInterface(serviceId, serviceName, servicePrice) {
    const modal = document.getElementById('booking-modal');
    const modalContent = modal.querySelector('.modal-body');
    
    modalContent.innerHTML = `
      <div class="booking-workflow">
        <!-- Step 1: Service Selection & Scheduling -->
        <div id="booking-step-1" class="booking-step active">
          <div class="service-selection">
            <div class="selected-service-card">
              <div class="service-icon">${this.getServiceIcon(serviceName)}</div>
              <div class="service-details">
                <h3>${serviceName}</h3>
                <p class="service-price">$${servicePrice}</p>
                <div class="availability-indicator">
                  <span class="status-dot available"></span>
                  <span>Available Now</span>
                </div>
              </div>
            </div>
            
            <div class="datetime-selection">
              <h4>📅 Select Date & Time</h4>
              <div class="calendar-container">
                <input type="date" id="service-date" min="${new Date().toISOString().split('T')[0]}" 
                       value="${new Date().toISOString().split('T')[0]}" onchange="bookingWorkflow.checkAvailability()">
                <select id="service-time" onchange="bookingWorkflow.updatePricing()">
                  ${this.generateTimeSlots()}
                </select>
              </div>
              <div class="availability-status">
                <div class="availability-info">
                  <span class="available-slots">✅ 12 slots available today</span>
                  <span class="estimated-response">⏱️ 15-30 min response time</span>
                </div>
              </div>
            </div>

            <div class="service-description">
              <h4>📝 Service Description</h4>
              <textarea id="service-description" placeholder="Describe your issue in detail..." rows="3"></textarea>
              
              <h4>⚙️ Special Requirements</h4>
              <textarea id="special-requirements" placeholder="Any special tools, parts, or considerations needed..." rows="2"></textarea>
            </div>
          </div>
          <button class="btn btn--primary btn--full-width" onclick="bookingWorkflow.nextStep()">Continue to Location</button>
        </div>

        <!-- Step 2: Location & Customer Details -->
        <div id="booking-step-2" class="booking-step">
          <div class="location-selection">
            <h4>📍 Service Location</h4>
            <div class="location-options">
              <button class="btn btn--outline location-btn active" onclick="bookingWorkflow.useCurrentLocation()">
                📱 Use Current Location
              </button>
              <button class="btn btn--outline location-btn" onclick="bookingWorkflow.useManualAddress()">
                📝 Enter Address
              </button>
            </div>
            
            <div id="current-location-display" class="location-display">
              <div class="location-info">
                <span class="location-icon">🎯</span>
                <div class="location-text">
                  <strong>Current Location Detected</strong>
                  <p id="detected-address">Detecting your location...</p>
                </div>
                <span class="accuracy-indicator">±${this.currentLocation?.accuracy || 10}m</span>
              </div>
            </div>

            <div id="manual-address-input" class="address-input hidden">
              <input type="text" id="service-address" placeholder="Enter complete service address">
              <button class="btn btn--sm" onclick="bookingWorkflow.validateAddress()">📍 Locate</button>
            </div>

            <div class="map-container">
              <div class="map-placeholder" id="location-map">
                <div class="map-marker">📍</div>
                <p>Interactive Map View</p>
                <div class="map-controls">
                  <button class="map-btn" onclick="bookingWorkflow.centerMap()">📍 Center</button>
                  <button class="map-btn" onclick="bookingWorkflow.adjustLocation()">✏️ Adjust</button>
                </div>
              </div>
            </div>
          </div>

          <div class="customer-details">
            <h4>👤 Customer Information</h4>
            <div class="form-row">
              <input type="text" id="customer-name" placeholder="Full Name" required>
              <input type="tel" id="customer-phone" placeholder="Phone Number" required>
            </div>
            <input type="email" id="customer-email" placeholder="Email Address">
            
            <div class="contact-preferences">
              <h5>📞 Preferred Contact Method</h5>
              <div class="contact-options">
                <label><input type="radio" name="contact-method" value="call" checked> 📞 Phone Call</label>
                <label><input type="radio" name="contact-method" value="sms"> 💬 SMS</label>
                <label><input type="radio" name="contact-method" value="app"> 📱 App Notification</label>
              </div>
            </div>
          </div>
          
          <button class="btn btn--primary btn--full-width" onclick="bookingWorkflow.nextStep()">Continue to Payment</button>
        </div>

        <!-- Step 3: Payment & Pricing -->
        <div id="booking-step-3" class="booking-step">
          <div class="pricing-breakdown">
            <h4>💰 Service Pricing</h4>
            <div class="price-details">
              <div class="price-row">
                <span>Base Service Fee</span>
                <span>$${servicePrice}</span>
              </div>
              <div class="price-row">
                <span>Emergency Surcharge</span>
                <span id="emergency-fee">$0</span>
              </div>
              <div class="price-row">
                <span>Distance Fee</span>
                <span id="distance-fee">$0</span>
              </div>
              <div class="price-row total">
                <span><strong>Estimated Total</strong></span>
                <span><strong id="total-price">$${servicePrice}</strong></span>
              </div>
            </div>
            
            <div class="pricing-notes">
              <p>💡 Final price may vary based on actual service requirements</p>
              <p>⏰ Additional charges apply for after-hours service</p>
            </div>
          </div>

          <div class="payment-methods">
            <h4>💳 Payment Method</h4>
            <div class="payment-options">
              <div class="payment-method active" onclick="bookingWorkflow.selectPayment('card')">
                <span class="payment-icon">💳</span>
                <div class="payment-info">
                  <strong>Credit/Debit Card</strong>
                  <p>Pay securely with card</p>
                </div>
                <span class="selected-indicator">✓</span>
              </div>
              <div class="payment-method" onclick="bookingWorkflow.selectPayment('cash')">
                <span class="payment-icon">💵</span>
                <div class="payment-info">
                  <strong>Cash Payment</strong>
                  <p>Pay technician directly</p>
                </div>
              </div>
              <div class="payment-method" onclick="bookingWorkflow.selectPayment('digital')">
                <span class="payment-icon">📱</span>
                <div class="payment-info">
                  <strong>Digital Wallet</strong>
                  <p>Apple Pay, Google Pay</p>
                </div>
              </div>
            </div>
          </div>
          
          <button class="btn btn--primary btn--full-width" onclick="bookingWorkflow.nextStep()">Review & Confirm</button>
        </div>

        <!-- Step 4: Confirmation -->
        <div id="booking-step-4" class="booking-step">
          <div class="booking-summary">
            <h4>📋 Booking Summary</h4>
            <div class="summary-card">
              <div class="summary-header">
                <span class="service-icon">${this.getServiceIcon(serviceName)}</span>
                <div>
                  <h5>${serviceName}</h5>
                  <p>Emergency Roadside Service</p>
                </div>
              </div>
              
              <div class="summary-details">
                <div class="detail-row">
                  <span>📅 Date & Time:</span>
                  <span id="summary-datetime">Today, ASAP</span>
                </div>
                <div class="detail-row">
                  <span>📍 Location:</span>
                  <span id="summary-location">Current Location</span>
                </div>
                <div class="detail-row">
                  <span>👤 Customer:</span>
                  <span id="summary-customer">John Doe</span>
                </div>
                <div class="detail-row">
                  <span>💳 Payment:</span>
                  <span id="summary-payment">Credit Card</span>
                </div>
                <div class="detail-row total">
                  <span><strong>💰 Total:</strong></span>
                  <span><strong id="summary-total">$${servicePrice}</strong></span>
                </div>
              </div>
            </div>
            
            <div class="confirmation-actions">
              <div class="emergency-toggle">
                <label class="toggle-label">
                  <input type="checkbox" id="emergency-service" onchange="bookingWorkflow.toggleEmergency()">
                  <span class="toggle-slider"></span>
                  🚨 Emergency Service (Priority Response)
                </label>
              </div>
              
              <div class="terms-agreement">
                <label>
                  <input type="checkbox" id="terms-agreement" required>
                  I agree to the <a href="#" onclick="bookingWorkflow.showTerms()">Terms of Service</a> and <a href="#" onclick="bookingWorkflow.showPrivacy()">Privacy Policy</a>
                </label>
              </div>
            </div>
          </div>
          
          <button class="btn btn--primary btn--full-width btn--emergency" onclick="bookingWorkflow.confirmBooking()">
            🚀 Confirm Booking & Find Technician
          </button>
        </div>

        <!-- Booking Confirmation -->
        <div id="booking-confirmed" class="booking-step">
          <div class="confirmation-success">
            <div class="success-icon">✅</div>
            <h3>Booking Confirmed!</h3>
            <p>We're finding the best technician for you</p>
            
            <div class="booking-reference">
              <h4>Booking Reference</h4>
              <div class="reference-code" id="booking-ref">#RS-2024-001</div>
              <button class="btn btn--sm" onclick="bookingWorkflow.copyReference()">📋 Copy</button>
            </div>
            
            <div class="next-steps">
              <h4>What happens next?</h4>
              <div class="step-indicator">
                <div class="step completed">
                  <span class="step-number">1</span>
                  <span>Booking Confirmed</span>
                </div>
                <div class="step active">
                  <span class="step-number">2</span>
                  <span>Finding Technician</span>
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  <span>Technician En Route</span>
                </div>
                <div class="step">
                  <span class="step-number">4</span>
                  <span>Service Complete</span>
                </div>
              </div>
            </div>
            
            <div class="estimated-timeline">
              <h4>⏱️ Estimated Timeline</h4>
              <div class="timeline-item">
                <span class="time">2-5 min</span>
                <span class="description">Technician assignment</span>
              </div>
              <div class="timeline-item">
                <span class="time">15-30 min</span>
                <span class="description">Technician arrival</span>
              </div>
              <div class="timeline-item">
                <span class="time">20-45 min</span>
                <span class="description">Service completion</span>
              </div>
            </div>
          </div>
          
          <button class="btn btn--primary btn--full-width" onclick="bookingWorkflow.trackService()">
            📍 Track Your Service
          </button>
        </div>
      </div>
    `;

    // Show modal and initialize
    modal.style.display = 'block';
    this.currentBookingData = { serviceId, serviceName, servicePrice };
    this.updateLocationDisplay();
    this.checkAvailability();
  }

  // Generate time slots for booking
  generateTimeSlots() {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    // Add ASAP option
    slots.push('<option value="asap" selected>🚀 ASAP (Next Available)</option>');
    
    // Add hourly slots for next 24 hours
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i + 1) % 24;
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const label = i === 0 ? `${time} (Next Hour)` : time;
      slots.push(`<option value="${time}">${label}</option>`);
    }
    
    return slots.join('');
  }

  // Get service icon
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

  // Check real-time availability
  async checkAvailability() {
    const dateInput = document.getElementById('service-date');
    const timeInput = document.getElementById('service-time');
    const statusElement = document.querySelector('.available-slots');
    
    if (!dateInput || !timeInput) return;
    
    const selectedDate = dateInput.value;
    const selectedTime = timeInput.value;
    
    // Simulate availability check
    setTimeout(() => {
      const availableSlots = Math.floor(Math.random() * 15) + 5;
      const responseTime = selectedTime === 'asap' ? '15-30 min' : '30-60 min';
      
      statusElement.textContent = `✅ ${availableSlots} slots available`;
      document.querySelector('.estimated-response').textContent = `⏱️ ${responseTime} response time`;
    }, 500);
  }

  // Update pricing based on selections
  updatePricing() {
    const timeInput = document.getElementById('service-time');
    const emergencyFee = document.getElementById('emergency-fee');
    const distanceFee = document.getElementById('distance-fee');
    const totalPrice = document.getElementById('total-price');
    
    if (!timeInput) return;
    
    let basePrice = parseFloat(this.currentBookingData.servicePrice);
    let emergency = 0;
    let distance = 0;
    
    // Add emergency fee for ASAP
    if (timeInput.value === 'asap') {
      emergency = 25;
    }
    
    // Add distance fee (simulated)
    if (this.currentLocation) {
      distance = Math.floor(Math.random() * 20) + 5;
    }
    
    const total = basePrice + emergency + distance;
    
    if (emergencyFee) emergencyFee.textContent = `$${emergency}`;
    if (distanceFee) distanceFee.textContent = `$${distance}`;
    if (totalPrice) totalPrice.textContent = `$${total}`;
  }

  // Location handling
  useCurrentLocation() {
    document.getElementById('current-location-display').classList.remove('hidden');
    document.getElementById('manual-address-input').classList.add('hidden');
    document.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  }

  useManualAddress() {
    document.getElementById('current-location-display').classList.add('hidden');
    document.getElementById('manual-address-input').classList.remove('hidden');
    document.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  }

  // Update location display
  updateLocationDisplay() {
    if (this.currentLocation) {
      // Simulate reverse geocoding
      document.getElementById('detected-address').textContent = 
        '1234 Main Street, City, State 12345';
    }
  }

  // Validate address
  async validateAddress() {
    const addressInput = document.getElementById('service-address');
    const address = addressInput.value.trim();
    
    if (!address) {
      this.showError('Please enter a valid address');
      return;
    }
    
    // Simulate address validation
    this.showSuccess('Address validated and located on map');
  }

  // Payment method selection
  selectPayment(method) {
    document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const methodNames = {
      'card': 'Credit Card',
      'cash': 'Cash Payment',
      'digital': 'Digital Wallet'
    };
    
    document.getElementById('summary-payment').textContent = methodNames[method];
  }

  // Toggle emergency service
  toggleEmergency() {
    const checkbox = document.getElementById('emergency-service');
    const confirmBtn = document.querySelector('.btn--emergency');
    
    if (checkbox.checked) {
      confirmBtn.innerHTML = '🚨 Confirm Emergency Booking';
      confirmBtn.classList.add('emergency-active');
    } else {
      confirmBtn.innerHTML = '🚀 Confirm Booking & Find Technician';
      confirmBtn.classList.remove('emergency-active');
    }
    
    this.updatePricing();
  }

  // Navigation between steps
  nextStep() {
    const currentStep = document.querySelector('.booking-step.active');
    const nextStep = currentStep.nextElementSibling;
    
    if (nextStep && nextStep.classList.contains('booking-step')) {
      currentStep.classList.remove('active');
      nextStep.classList.add('active');
      
      // Update progress
      this.updateStepProgress();
      
      // Validate current step
      if (!this.validateCurrentStep(currentStep)) {
        currentStep.classList.add('active');
        nextStep.classList.remove('active');
        return;
      }
    }
  }

  // Validate step data
  validateCurrentStep(step) {
    const stepId = step.id;
    
    switch(stepId) {
      case 'booking-step-1':
        return this.validateServiceSelection();
      case 'booking-step-2':
        return this.validateLocationAndCustomer();
      case 'booking-step-3':
        return this.validatePayment();
      default:
        return true;
    }
  }

  validateServiceSelection() {
    const date = document.getElementById('service-date').value;
    const time = document.getElementById('service-time').value;
    
    if (!date || !time) {
      this.showError('Please select date and time');
      return false;
    }
    return true;
  }

  validateLocationAndCustomer() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    
    if (!name.trim()) {
      this.showError('Please enter your name');
      return false;
    }
    
    if (!phone.trim()) {
      this.showError('Please enter your phone number');
      return false;
    }
    
    return true;
  }

  validatePayment() {
    const terms = document.getElementById('terms-agreement');
    
    if (terms && !terms.checked) {
      this.showError('Please agree to the terms and conditions');
      return false;
    }
    
    return true;
  }

  // Update step progress
  updateStepProgress() {
    const steps = document.querySelectorAll('.step');
    const currentStepNumber = document.querySelectorAll('.booking-step.active')[0]?.id.split('-').pop();
    
    steps.forEach((step, index) => {
      if (index < parseInt(currentStepNumber)) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index === parseInt(currentStepNumber) - 1) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }

  // 2. TECHNICIAN ASSIGNMENT SYSTEM
  async confirmBooking() {
    if (!this.validateCurrentStep(document.querySelector('.booking-step.active'))) {
      return;
    }

    // Show confirmation step
    document.querySelector('.booking-step.active').classList.remove('active');
    document.getElementById('booking-confirmed').classList.add('active');

    // Generate booking reference
    const reference = this.generateBookingReference();
    document.getElementById('booking-ref').textContent = reference;

    // Start technician assignment process
    setTimeout(() => {
      this.findAndAssignTechnician();
    }, 2000);
  }

  async findAndAssignTechnician() {
    // Simulate finding nearby technicians
    this.showNotification('🔍 Finding nearby technicians...');
    
    // Simulate technician assignment
    setTimeout(() => {
      this.assignTechnicianToBooking();
    }, 3000);
  }

  async assignTechnicianToBooking() {
    const technician = {
      id: 'tech-001',
      name: 'Mike Rodriguez',
      rating: 4.9,
      speciality: 'Automotive Expert',
      distance: '2.3 miles away',
      eta: '18 minutes',
      phone: '+1-555-0123',
      vehicle: 'Red Ford Transit',
      photo: '👨‍🔧'
    };

    this.showTechnicianAssignment(technician);
    this.startTechnicianTracking(technician);
  }

  showTechnicianAssignment(technician) {
    // Create technician assignment interface
    const assignmentHtml = `
      <div class="technician-assignment">
        <div class="assignment-header">
          <h3>🎯 Technician Assigned!</h3>
          <p>Your service provider is on the way</p>
        </div>
        
        <div class="technician-card">
          <div class="technician-photo">${technician.photo}</div>
          <div class="technician-info">
            <h4>${technician.name}</h4>
            <div class="technician-rating">
              ${'⭐'.repeat(Math.floor(technician.rating))} ${technician.rating}
            </div>
            <p class="technician-speciality">${technician.speciality}</p>
            <p class="technician-distance">📍 ${technician.distance}</p>
          </div>
          <div class="technician-actions">
            <button class="btn btn--sm btn--outline" onclick="bookingWorkflow.callTechnician('${technician.phone}')">
              📞 Call
            </button>
            <button class="btn btn--sm btn--outline" onclick="bookingWorkflow.messageTechnician('${technician.id}')">
              💬 Message
            </button>
          </div>
        </div>

        <div class="arrival-info">
          <div class="eta-display">
            <span class="eta-time">${technician.eta}</span>
            <span class="eta-label">Estimated Arrival</span>
          </div>
          <div class="vehicle-info">
            <span class="vehicle-icon">🚐</span>
            <span>${technician.vehicle}</span>
          </div>
        </div>

        <div class="tracking-map">
          <div class="map-header">
            <h4>📍 Live Tracking</h4>
            <button class="btn btn--sm" onclick="bookingWorkflow.refreshTracking()">🔄 Refresh</button>
          </div>
          <div class="tracking-display">
            <div class="route-map">
              <div class="map-marker technician">🚐</div>
              <div class="route-line"></div>
              <div class="map-marker customer">📍</div>
            </div>
            <div class="tracking-info">
              <p>🛣️ Taking fastest route via Main Street</p>
              <p>🚦 Light traffic, no delays expected</p>
            </div>
          </div>
        </div>

        <div class="contact-options">
          <h4>📞 Need to reach us?</h4>
          <div class="contact-buttons">
            <button class="btn btn--outline" onclick="bookingWorkflow.contactSupport()">
              💬 Support Chat
            </button>
            <button class="btn btn--outline" onclick="bookingWorkflow.emergencyContact()">
              🚨 Emergency
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('booking-confirmed').innerHTML = assignmentHtml;
    this.showNotification('✅ Technician assigned! Mike is on the way.');
  }

  // 3. NAVIGATION INTEGRATION
  startTechnicianTracking(technician) {
    // Simulate real-time GPS tracking
    this.trackingInterval = setInterval(() => {
      this.updateTechnicianLocation(technician);
    }, 5000);
  }

  updateTechnicianLocation(technician) {
    // Simulate technician movement
    const currentETA = document.querySelector('.eta-time');
    if (currentETA) {
      let minutes = parseInt(currentETA.textContent.split(' ')[0]);
      minutes = Math.max(1, minutes - 1);
      currentETA.textContent = `${minutes} minutes`;
      
      if (minutes <= 5) {
        this.showNotification('🚗 Technician arriving in 5 minutes!');
        currentETA.parentElement.classList.add('arriving-soon');
      }
    }
  }

  refreshTracking() {
    this.showNotification('🔄 Updating technician location...');
    // Simulate route refresh
    setTimeout(() => {
      this.showNotification('📍 Location updated - still on fastest route');
    }, 1000);
  }

  // Communication functions
  callTechnician(phone) {
    if (confirm(`Call technician at ${phone}?`)) {
      window.open(`tel:${phone}`);
    }
  }

  messageTechnician(technicianId) {
    this.openChatInterface(technicianId);
  }

  openChatInterface(technicianId) {
    // Create chat interface
    const chatHtml = `
      <div class="chat-interface">
        <div class="chat-header">
          <h4>💬 Chat with Mike</h4>
          <button class="close-chat" onclick="bookingWorkflow.closeChat()">×</button>
        </div>
        <div class="chat-messages">
          <div class="message technician">
            <span class="message-time">2 min ago</span>
            <p>Hi! I'm on my way to your location. Should arrive in about 15 minutes.</p>
          </div>
          <div class="message customer">
            <span class="message-time">1 min ago</span>
            <p>Great! I'll be waiting outside.</p>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Type a message..." id="chat-message">
          <button onclick="bookingWorkflow.sendMessage()">Send</button>
        </div>
      </div>
    `;
    
    const chatModal = document.createElement('div');
    chatModal.className = 'chat-modal';
    chatModal.innerHTML = chatHtml;
    document.body.appendChild(chatModal);
  }

  sendMessage() {
    const messageInput = document.getElementById('chat-message');
    const message = messageInput.value.trim();
    
    if (message) {
      // Add message to chat
      const messagesContainer = document.querySelector('.chat-messages');
      const messageElement = document.createElement('div');
      messageElement.className = 'message customer';
      messageElement.innerHTML = `
        <span class="message-time">now</span>
        <p>${message}</p>
      `;
      messagesContainer.appendChild(messageElement);
      messageInput.value = '';
      
      // Simulate technician response
      setTimeout(() => {
        const responseElement = document.createElement('div');
        responseElement.className = 'message technician';
        responseElement.innerHTML = `
          <span class="message-time">now</span>
          <p>Got it! See you soon.</p>
        `;
        messagesContainer.appendChild(responseElement);
      }, 2000);
    }
  }

  closeChat() {
    document.querySelector('.chat-modal')?.remove();
  }

  // 4. ADMIN DASHBOARD FEATURES
  initializeAdminDashboard() {
    if (document.querySelector('[data-view="admin"]')) {
      this.setupRealTimeMonitoring();
      this.setupAnalyticsDashboard();
    }
  }

  setupRealTimeMonitoring() {
    // Create real-time monitoring interface
    const monitoringHtml = `
      <div class="admin-monitoring">
        <div class="monitoring-header">
          <h3>📊 Real-Time Monitoring</h3>
          <div class="monitoring-controls">
            <button class="btn btn--sm" onclick="bookingWorkflow.refreshDashboard()">🔄 Refresh</button>
            <button class="btn btn--sm" onclick="bookingWorkflow.exportData()">📊 Export</button>
          </div>
        </div>

        <div class="live-stats">
          <div class="stat-card live">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <h4>Active Bookings</h4>
              <div class="stat-value">12</div>
              <div class="stat-trend">↑ 3 new in last hour</div>
            </div>
          </div>
          
          <div class="stat-card live">
            <div class="stat-icon">🚗</div>
            <div class="stat-info">
              <h4>Technicians On Duty</h4>
              <div class="stat-value">8/12</div>
              <div class="stat-trend">6 available</div>
            </div>
          </div>
          
          <div class="stat-card live">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <h4>Avg Response Time</h4>
              <div class="stat-value">18 min</div>
              <div class="stat-trend">↓ 2 min from yesterday</div>
            </div>
          </div>
          
          <div class="stat-card live">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h4>Today's Revenue</h4>
              <div class="stat-value">$2,847</div>
              <div class="stat-trend">↑ 15% from yesterday</div>
            </div>
          </div>
        </div>

        <div class="monitoring-sections">
          <div class="live-bookings">
            <h4>📋 Live Bookings</h4>
            <div class="booking-list">
              ${this.generateLiveBookingsList()}
            </div>
          </div>
          
          <div class="technician-map">
            <h4>🗺️ Technician Locations</h4>
            <div class="map-container">
              <div class="live-map">
                <div class="map-legend">
                  <span class="legend-item"><span class="marker available"></span> Available</span>
                  <span class="legend-item"><span class="marker busy"></span> On Job</span>
                  <span class="legend-item"><span class="marker offline"></span> Off Duty</span>
                </div>
                ${this.generateTechnicianMap()}
              </div>
            </div>
          </div>
        </div>

        <div class="performance-metrics">
          <h4>📈 Performance Metrics</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <h5>Service Completion Rate</h5>
              <div class="metric-value">94.2%</div>
              <div class="metric-chart">📊 Chart placeholder</div>
            </div>
            
            <div class="metric-card">
              <h5>Customer Satisfaction</h5>
              <div class="metric-value">4.8/5</div>
              <div class="rating-breakdown">
                ⭐⭐⭐⭐⭐ 78%<br>
                ⭐⭐⭐⭐ 16%<br>
                ⭐⭐⭐ 4%<br>
                ⭐⭐ 1%<br>
                ⭐ 1%
              </div>
            </div>
            
            <div class="metric-card">
              <h5>Revenue Trend</h5>
              <div class="metric-value">+18%</div>
              <div class="trend-info">vs last month</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return monitoringHtml;
  }

  generateLiveBookingsList() {
    const bookings = [
      { id: 'RS-001', service: '🚛 Towing', customer: 'John Doe', status: 'In Progress', technician: 'Mike R.', eta: '5 min' },
      { id: 'RS-002', service: '🔋 Battery Jump', customer: 'Jane Smith', status: 'Assigned', technician: 'Sarah L.', eta: '12 min' },
      { id: 'RS-003', service: '🛞 Tire Change', customer: 'Bob Wilson', status: 'Pending', technician: 'Unassigned', eta: '-' },
      { id: 'RS-004', service: '🔓 Lockout', customer: 'Alice Brown', status: 'En Route', technician: 'Carlos M.', eta: '8 min' }
    ];
    
    return bookings.map(booking => `
      <div class="live-booking-item ${booking.status.toLowerCase().replace(' ', '-')}">
        <div class="booking-info">
          <div class="booking-id">${booking.id}</div>
          <div class="booking-service">${booking.service}</div>
          <div class="booking-customer">👤 ${booking.customer}</div>
        </div>
        <div class="booking-status">
          <span class="status-badge">${booking.status}</span>
          <div class="technician-info">👨‍🔧 ${booking.technician}</div>
          <div class="eta-info">⏱️ ETA: ${booking.eta}</div>
        </div>
        <div class="booking-actions">
          <button class="btn btn--xs" onclick="bookingWorkflow.viewBookingDetails('${booking.id}')">View</button>
          <button class="btn btn--xs" onclick="bookingWorkflow.trackBooking('${booking.id}')">Track</button>
        </div>
      </div>
    `).join('');
  }

  generateTechnicianMap() {
    return `
      <div class="technician-markers">
        <div class="technician-marker available" style="top: 20%; left: 30%;" title="Mike Rodriguez - Available">🚗</div>
        <div class="technician-marker busy" style="top: 40%; left: 60%;" title="Sarah Lee - On Job">🚐</div>
        <div class="technician-marker available" style="top: 70%; left: 25%;" title="Carlos Martinez - Available">🚛</div>
        <div class="technician-marker busy" style="top: 30%; left: 80%;" title="David Kim - On Job">🚗</div>
        <div class="technician-marker offline" style="top: 60%; left: 45%;" title="Emma Wilson - Off Duty">⚫</div>
      </div>
      <div class="map-overlay">
        <p>Interactive technician location map</p>
        <button class="btn btn--sm" onclick="bookingWorkflow.centerMapOnTechnicians()">🎯 Center All</button>
      </div>
    `;
  }

  // Utility functions
  generateBookingReference() {
    const prefix = 'RS';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `#${prefix}-${year}-${random}`;
  }

  showNotification(message, type = 'info') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('RoadSide+ Update', {
        body: message,
        icon: '/favicon.ico'
      });
    }
    
    // Also show in-app notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  // Additional utility functions
  copyReference() {
    const reference = document.getElementById('booking-ref').textContent;
    navigator.clipboard.writeText(reference).then(() => {
      this.showSuccess('Booking reference copied to clipboard');
    });
  }

  trackService() {
    closeBookingModal();
    showModal('tracking-modal');
  }

  contactSupport() {
    this.showNotification('📞 Support chat opened');
  }

  emergencyContact() {
    if (confirm('This will call emergency services. Continue?')) {
      window.open('tel:911');
    }
  }

  refreshDashboard() {
    this.showNotification('🔄 Dashboard refreshed with latest data');
  }

  exportData() {
    this.showNotification('📊 Data export started - download will begin shortly');
  }

  viewBookingDetails(bookingId) {
    this.showNotification(`📋 Opening details for booking ${bookingId}`);
  }

  trackBooking(bookingId) {
    this.showNotification(`📍 Tracking booking ${bookingId}`);
  }

  centerMapOnTechnicians() {
    this.showNotification('🎯 Map centered on all active technicians');
  }

  showTerms() {
    alert('Terms of Service would be displayed here');
  }

  showPrivacy() {
    alert('Privacy Policy would be displayed here');
  }
}

// Initialize the booking workflow system
const bookingWorkflow = new BookingWorkflow();