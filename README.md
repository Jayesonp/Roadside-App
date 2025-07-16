# RoadSide+ Emergency Assistance App - Bolt.new Compatible Version

A roadside emergency assistance application converted for bolt.new web development environment.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the App:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:**
   Navigate to `http://localhost:3000`

## 📁 File Structure

```
📦 RoadSide+ App
├── 📄 index.html          # Main HTML file
├── 🎨 style.css           # Styling
├── ⚙️ app.js              # Frontend JavaScript
├── 🖥️ server.js           # Express server (bolt.new compatible)
├── 🔧 mock-api.js         # Mock API for development
├── 📋 package.json        # Dependencies
└── 📖 README.md           # This file
```

## 🔧 Bolt.new Compatibility Features

### ✅ **What Works:**
- **Frontend Interface:** Full responsive UI with all dashboards
- **Authentication:** Mock login/registration system
- **Booking System:** Simulated booking workflow
- **Real-time Tracking:** Mock GPS tracking with animations
- **Multiple Dashboards:** Customer, Technician, Admin, Partner, Security
- **Interactive Elements:** Forms, buttons, modals, and navigation

### ⚠️ **Mock Implementations:**
- **Database:** In-memory storage (no persistence)
- **API Calls:** Simulated with realistic delays
- **Authentication:** Mock JWT tokens
- **Real-time Updates:** Simulated WebSocket behavior
- **GPS Tracking:** Mock location data

### ❌ **Limitations:**
- **No Real Database:** Data doesn't persist between sessions
- **No Real Authentication:** Security is for demo purposes only
- **No External APIs:** Google Maps, payment processing are simulated
- **No Background Processing:** Real-time features work only while app is open

## 🎯 **Demo Credentials**

### **Test Login:**
- **Email:** `demo@example.com`
- **Password:** `any password`

### **Available Features:**
- **Customer Dashboard:** Book services, view history
- **Technician Dashboard:** Manage jobs, update availability
- **Admin Dashboard:** System overview and management
- **Real-time Tracking:** Simulated GPS tracking
- **Multi-role Interface:** Switch between different user types

## 🛠️ **Development Notes**

### **API Integration:**
The app uses a mock API system (`mock-api.js`) that simulates:
- User authentication
- Booking management
- Technician assignment
- Real-time updates

### **State Management:**
- User sessions stored in localStorage
- In-memory data for demo purposes
- Mock WebSocket for real-time features

### **Responsive Design:**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

## 🔄 **Converting to Production**

To convert this demo back to a production app:

1. **Replace Mock API:**
   - Remove `mock-api.js`
   - Restore original backend API calls
   - Set up real database (Supabase)

2. **Add Real Authentication:**
   - Implement JWT authentication
   - Add password hashing
   - Set up secure session management

3. **Integrate External Services:**
   - Google Maps API for real navigation
   - Payment processing (Stripe)
   - Push notifications
   - Real-time WebSocket server

4. **Add Security:**
   - HTTPS configuration
   - Input validation
   - Rate limiting
   - CORS policies

## 🧪 **Testing**

### **Available Test Scenarios:**
- Login/Registration flow
- Service booking process
- Dashboard navigation
- Real-time tracking simulation
- Form validation
- Responsive design

### **Test Data:**
- Demo user account
- Sample service bookings
- Mock technician profiles
- Simulated GPS tracking

## 📱 **Cross-Platform Notes**

This version is optimized for:
- **Modern Browsers:** Chrome, Firefox, Safari, Edge
- **Mobile Devices:** iOS Safari, Android Chrome
- **Desktop:** All major operating systems
- **Bolt.new Environment:** Specifically configured for web editing

## 🎨 **Brand Colors**

The app uses a consistent brand color scheme:
- **Primary:** #dc2625 (Brand red)
- **Secondary:** #b91c1c (Darker red)
- **Success:** #10b981 (Green)
- **Warning:** #f59e0b (Yellow)
- **Error:** #ef4444 (Red)

---

**Note:** This is a demonstration version optimized for bolt.new. For production deployment, additional security measures, real database integration, and external service connections would be required.