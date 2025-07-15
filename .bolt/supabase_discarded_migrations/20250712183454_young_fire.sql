/*
  # Comprehensive Booking Workflow System

  1. New Tables
    - `service_types` - Available services with pricing and duration
    - `bookings` - Customer service bookings
    - `technicians` - Technician profiles and availability
    - `booking_status_history` - Status change tracking
    - `technician_assignments` - Assignment tracking
    - `customer_reviews` - Ratings and feedback
    - `service_areas` - Geographic service coverage
    - `technician_locations` - Real-time location tracking

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for customers, technicians, and admins
    - Add indexes for performance

  3. Features
    - Real-time booking status updates
    - Geographic service area management
    - Technician availability and assignment
    - Customer review system
    - Location tracking capabilities
*/

-- Service Types Table
CREATE TABLE IF NOT EXISTS service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price decimal(10,2) NOT NULL DEFAULT 0,
  estimated_duration_minutes integer NOT NULL DEFAULT 30,
  icon text,
  is_active boolean DEFAULT true,
  requires_parts boolean DEFAULT false,
  emergency_service boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Technicians Table
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  employee_id text UNIQUE,
  specializations text[] DEFAULT '{}',
  certification_level text DEFAULT 'basic',
  hourly_rate decimal(10,2),
  service_radius_km integer DEFAULT 25,
  is_available boolean DEFAULT false,
  is_on_duty boolean DEFAULT false,
  current_latitude decimal(10,8),
  current_longitude decimal(11,8),
  last_location_update timestamptz,
  rating decimal(3,2) DEFAULT 0.0,
  total_jobs integer DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  phone text,
  vehicle_info jsonb,
  emergency_certified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Areas Table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  polygon_coordinates jsonb NOT NULL,
  technician_id uuid REFERENCES technicians(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  priority_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_type_id uuid REFERENCES service_types(id),
  technician_id uuid REFERENCES technicians(id),
  
  -- Customer Details
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  
  -- Service Details
  service_address text NOT NULL,
  service_latitude decimal(10,8),
  service_longitude decimal(11,8),
  preferred_date timestamptz,
  description text,
  special_requirements text,
  
  -- Pricing
  quoted_price decimal(10,2),
  final_price decimal(10,2),
  parts_cost decimal(10,2) DEFAULT 0,
  
  -- Status and Timing
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'technician_assigned', 'technician_en_route', 
    'in_progress', 'completed', 'cancelled', 'payment_pending', 'paid'
  )),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'emergency')),
  
  -- Timestamps
  scheduled_start timestamptz,
  actual_start timestamptz,
  estimated_completion timestamptz,
  actual_completion timestamptz,
  
  -- Additional Info
  photos text[] DEFAULT '{}',
  internal_notes text,
  customer_rating integer CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_feedback text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Booking Status History Table
CREATE TABLE IF NOT EXISTS booking_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES users(id),
  reason text,
  additional_info jsonb,
  created_at timestamptz DEFAULT now()
);

-- Technician Assignments Table
CREATE TABLE IF NOT EXISTS technician_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  technician_id uuid REFERENCES technicians(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  response text CHECK (response IN ('accepted', 'declined', 'timeout')),
  decline_reason text,
  estimated_arrival timestamptz,
  actual_arrival timestamptz,
  is_primary boolean DEFAULT true,
  assignment_order integer DEFAULT 1
);

-- Customer Reviews Table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  technician_id uuid REFERENCES technicians(id) ON DELETE CASCADE,
  service_rating integer CHECK (service_rating >= 1 AND service_rating <= 5),
  technician_rating integer CHECK (technician_rating >= 1 AND technician_rating <= 5),
  punctuality_rating integer CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  overall_rating integer CHECK (overall_rating >= 1 AND overall_rating <= 5),
  feedback text,
  would_recommend boolean,
  created_at timestamptz DEFAULT now()
);

-- Technician Location History Table
CREATE TABLE IF NOT EXISTS technician_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id uuid REFERENCES technicians(id) ON DELETE CASCADE,
  latitude decimal(10,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  accuracy decimal(10,2),
  heading decimal(5,2),
  speed decimal(8,2),
  recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Service Types (Public read, admin write)
CREATE POLICY "Anyone can view active services"
  ON service_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON service_types FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Technicians (Self manage, admin view all)
CREATE POLICY "Technicians can manage own profile"
  ON technicians FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all technicians"
  ON technicians FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Bookings (Customer owns, technician assigned, admin all)
CREATE POLICY "Customers can manage own bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Technicians can view assigned bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
  );

CREATE POLICY "Technicians can update assigned bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Service Areas
CREATE POLICY "Technicians can manage own service areas"
  ON service_areas FOR ALL
  TO authenticated
  USING (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
  );

-- Booking Status History
CREATE POLICY "View booking status history"
  ON booking_status_history FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = auth.uid() 
      OR technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Technician Assignments
CREATE POLICY "View technician assignments"
  ON technician_assignments FOR SELECT
  TO authenticated
  USING (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
    OR booking_id IN (SELECT id FROM bookings WHERE customer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Technicians can respond to assignments"
  ON technician_assignments FOR UPDATE
  TO authenticated
  USING (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
  );

-- Customer Reviews
CREATE POLICY "Customers can create reviews for own bookings"
  ON customer_reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "View reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid()
    OR technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Technician Locations
CREATE POLICY "Technicians can update own location"
  ON technician_locations FOR INSERT
  TO authenticated
  WITH CHECK (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
  );

CREATE POLICY "View technician locations"
  ON technician_locations FOR SELECT
  TO authenticated
  USING (
    technician_id IN (SELECT id FROM technicians WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_technicians_user_id ON technicians(user_id);
CREATE INDEX IF NOT EXISTS idx_technicians_location ON technicians(current_latitude, current_longitude);
CREATE INDEX IF NOT EXISTS idx_technicians_availability ON technicians(is_available, is_on_duty);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_id ON bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings(service_latitude, service_longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);

CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking_id ON booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_technician_assignments_booking_id ON technician_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_technician_assignments_technician_id ON technician_assignments(technician_id);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_booking_id ON customer_reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_technician_id ON customer_reviews(technician_id);

CREATE INDEX IF NOT EXISTS idx_technician_locations_technician_id ON technician_locations(technician_id);
CREATE INDEX IF NOT EXISTS idx_technician_locations_recorded_at ON technician_locations(recorded_at);

-- Create Triggers for Updated At
CREATE TRIGGER update_service_types_updated_at
  BEFORE UPDATE ON service_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON technicians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert Default Service Types
INSERT INTO service_types (name, description, base_price, estimated_duration_minutes, icon, emergency_service) VALUES
('Towing', 'Professional vehicle towing service', 150.00, 45, '🚛', false),
('Battery Jump', 'Jump start your dead battery', 75.00, 20, '🔋', false),
('Tire Change', 'Flat tire replacement service', 100.00, 30, '🛞', false),
('Lockout Service', 'Vehicle lockout assistance', 85.00, 20, '🔓', false),
('Fuel Delivery', 'Emergency fuel delivery', 60.00, 15, '⛽', false),
('Winch Recovery', 'Vehicle recovery and winching', 200.00, 60, '🪝', false),
('Emergency Towing', '24/7 emergency towing service', 250.00, 30, '🚨', true),
('Brake Repair', 'On-site brake system repair', 180.00, 90, '🛠️', false);

-- Create function to automatically track status changes
CREATE OR REPLACE FUNCTION track_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status tracking
CREATE TRIGGER track_booking_status_changes
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION track_booking_status_change();

-- Create function to update technician ratings
CREATE OR REPLACE FUNCTION update_technician_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE technicians 
  SET rating = (
    SELECT COALESCE(AVG(overall_rating::decimal), 0)
    FROM customer_reviews 
    WHERE technician_id = NEW.technician_id
  )
  WHERE id = NEW.technician_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER update_technician_rating_trigger
  AFTER INSERT OR UPDATE ON customer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_technician_rating();