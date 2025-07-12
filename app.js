// RoadSide+ Demo Script

// Data
const services = {
  1: { id: 1, name: 'Towing', price: 150, icon: '🚛' },
  2: { id: 2, name: 'Battery Jump', price: 75, icon: '🔋' },
  3: { id: 3, name: 'Tire Change', price: 100, icon: '🛞' },
  4: { id: 4, name: 'Lockout', price: 85, icon: '🔓' },
  5: { id: 5, name: 'Fuel Delivery', price: 60, icon: '⛽' },
  6: { id: 6, name: 'Winch Recovery', price: 200, icon: '🪝' }
};

let selectedService = services[1];
let currentBookingStep = 1;

// Utility Functions
function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
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
}

function showRegister() {
  alert('Registration flow is not included in this demo. Please sign in.');
}

// Navigation Drawer
function toggleNavDrawer() {
  $('#nav-drawer').classList.toggle('open');
}

function closeNavDrawer() {
  $('#nav-drawer').classList.remove('open');
}

// Dashboard Switching
function showDashboard(role) {
  // Hide all dashboards
  $all('.dashboard').forEach(d => d.classList.remove('active'));
  // Show selected dashboard
  $(`#${role}-dashboard`).classList.add('active');

  // Update tabs
  $all('.dashboard-tabs .tab').forEach(tab => {
    if (tab.textContent.trim().toLowerCase().includes(role)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update drawer items
  $all('.nav-drawer .nav-item').forEach(item => {
    if (item.textContent.trim().toLowerCase().includes(role)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Close drawer on selection (mobile UX)
  closeNavDrawer();
}

// Technician Online/Offline Toggle
function toggleTechStatus() {
  const btn = $('#tech-status-btn');
  if (btn.classList.contains('online')) {
    btn.classList.remove('online');
    btn.classList.add('offline');
    btn.textContent = '⚪ Offline';
  } else {
    btn.classList.remove('offline');
    btn.classList.add('online');
    btn.textContent = '🟢 Online';
  }
}

// Job Management (demo only)
function acceptJob(id) {
  alert(`Job #${id} accepted. Navigating to customer...`);
}

function declineJob(id) {
  alert(`Job #${id} declined.`);
}

// Emergency SOS
function emergencyCall() {
  alert('Emergency SOS triggered! A high-priority dispatcher has been notified.');
}

// Booking Flow
function selectService(id, name, price) {
  selectedService = services[id];
  // Update modal UI
  $('#selected-service-icon').textContent = selectedService.icon;
  $('#selected-service-name').textContent = selectedService.name;
  $('#selected-service-price').textContent = `$${selectedService.price}`;
  $('#summary-service').textContent = selectedService.name;
  $('#summary-total').textContent = `$${selectedService.price}`;

  openBookingModal();
}

function openBookingModal() {
  currentBookingStep = 1;
  updateBookingSteps();
  $('#booking-modal').classList.add('active');
}

function closeBookingModal() {
  $('#booking-modal').classList.remove('active');
}

function nextBookingStep() {
  if (currentBookingStep < 4) {
    currentBookingStep += 1;
    updateBookingSteps();
  }
}

function updateBookingSteps() {
  // Update step indicators
  $all('.booking-steps .step').forEach(step => {
    const stepNum = parseInt(step.dataset.step);
    step.classList.toggle('active', stepNum === currentBookingStep);
  });
  // Update content sections
  $all('.booking-step').forEach(step => step.classList.remove('active'));
  $(`#booking-step-${currentBookingStep}`).classList.add('active');
}

function selectPaymentMethod(el) {
  $all('.payment-method').forEach(method => method.classList.remove('active'));
  el.classList.add('active');
}

function confirmBooking() {
  closeBookingModal();
  openTrackingModal();
}

// Tracking Modal
function openTrackingModal() {
  $('#tracking-modal').classList.add('active');
}

function closeTrackingModal() {
  $('#tracking-modal').classList.remove('active');
}

function callTechnician() {
  alert('Calling technician...');
}

// Bottom Nav (demo actions)
// History and Support tabs are placeholders for this demo
$all('.bottom-nav .nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const text = item.querySelector('span').textContent.trim();
    if (text === 'Dashboard') {
      showDashboard('customer');
    } else {
      alert(`${text} section is not included in this demo.`);
    }
  });
});

// Close modals with ESC key
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeBookingModal();
    closeTrackingModal();
    closeNavDrawer();
  }
});