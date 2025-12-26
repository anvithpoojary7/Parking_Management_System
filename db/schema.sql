CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE vehicles (
  vehicle_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(50), -- e.g., car, bike, etc.
  color VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

CREATE TABLE sublocations (
  sublocation_id SERIAL PRIMARY KEY,
  location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);




CREATE TABLE parking_slots (
    slot_id SERIAL PRIMARY KEY,
    sublocation_id INT REFERENCES sublocations(sublocation_id) ON DELETE CASCADE,
    slot_number VARCHAR(20) NOT NULL,
    -- 'is_available' here can represent its general, physical availability (e.g., not broken)
    -- The time-based availability will be inferred from the bookings table.
    is_active BOOLEAN DEFAULT TRUE, -- Renamed from is_available to avoid confusion with time-based availability
    slot_type VARCHAR(50), -- e.g., compact, large, EV
    rate_per_hour NUMERIC(8, 2),
    vehicle_type VARCHAR(30) NOT NULL,
    
    -- Optional: Add other details like floor, section, features
    description TEXT,

    UNIQUE (sublocation_id, slot_number) -- A slot number should be unique within a sublocation
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    slot_id INT NOT NULL REFERENCES parking_slots(slot_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    booking_duration_hours NUMERIC(5,2) NOT NULL,
    total_cost NUMERIC(10,2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'confirmed',
    booked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reminder_sent BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_end_time_after_start_time CHECK (end_time > start_time)
);




-- 2. Then, create the indexes as separate statements
CREATE INDEX idx_bookings_slot_id ON bookings (slot_id);
CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_time_range ON bookings (start_time, end_time);


CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50), -- e.g., card, UPI, wallet
  payment_status VARCHAR(20) DEFAULT 'pending', -- e.g., success, failed
  payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'location_admin', -- or 'super_admin'
  assigned_location INT REFERENCES locations(location_id)
);

CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


