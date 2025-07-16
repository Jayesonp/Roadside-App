// Mock API functions for bolt.new development
// This file provides client-side mock implementations for backend functionality

export class MockAPI {
  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.technicians = new Map();
    this.currentUser = null;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  initializeDemoData() {
    // Demo user
    this.users.set('demo-user-id', {
      id: 'demo-user-id',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      createdAt: new Date().toISOString()
    });

    // Demo technician
    this.technicians.set('tech-001', {
      id: 'tech-001',
      name: 'Mike Rodriguez',
      rating: 4.9,
      speciality: 'Automotive Expert',
      distance: '2.3 miles away',
      eta: '18 minutes',
      phone: '+1-555-0123',
      vehicle: 'Red Ford Transit',
      photo: '👨‍🔧',
      available: true
    });

    // Demo booking
    this.bookings.set('booking-001', {
      id: 'booking-001',
      serviceType: 'Towing',
      customer: 'Demo User',
      status: 'pending',
      location: '1234 Main St, City, State',
      createdAt: new Date().toISOString()
    });
  }

  // Authentication mock
  async login(email, password) {
    // Simulate API delay
    await this.delay(500);
    
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (user && password) {
      this.currentUser = user;
      return {
        success: true,
        data: {
          user: user,
          token: 'mock-jwt-token-' + Date.now()
        }
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }

  async register(userData) {
    await this.delay(500);
    
    const userId = 'user-' + Date.now();
    const user = {
      id: userId,
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    this.users.set(userId, user);
    this.currentUser = user;
    
    return {
      success: true,
      data: {
        user: user,
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  }

  // Booking mock
  async createBooking(bookingData) {
    await this.delay(800);
    
    const bookingId = 'booking-' + Date.now();
    const booking = {
      id: bookingId,
      ...bookingData,
      customerId: this.currentUser?.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    this.bookings.set(bookingId, booking);
    
    return {
      success: true,
      data: { booking }
    };
  }

  async getBookings() {
    await this.delay(300);
    
    return {
      success: true,
      data: {
        bookings: Array.from(this.bookings.values()),
        pagination: {
          page: 1,
          total: this.bookings.size,
          totalPages: 1
        }
      }
    };
  }

  // Technician mock
  async getTechnicians() {
    await this.delay(300);
    
    return {
      success: true,
      data: {
        technicians: Array.from(this.technicians.values())
      }
    };
  }

  async assignTechnician(bookingId, technicianId) {
    await this.delay(1000);
    
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.technicianId = technicianId;
      booking.status = 'assigned';
      booking.updatedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      data: { booking }
    };
  }

  // Utility function to simulate network delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Health check
  async healthCheck() {
    return {
      success: true,
      message: 'Mock API is healthy',
      data: {
        timestamp: new Date().toISOString(),
        environment: 'bolt.new-demo',
        features: ['auth', 'bookings', 'technicians']
      }
    };
  }
}

// Create global instance for use in the app
export const mockAPI = new MockAPI();

// Make it available globally for the existing app code
window.mockAPI = mockAPI;