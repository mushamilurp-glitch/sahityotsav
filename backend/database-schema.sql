-- Database schema for Sahithyotsav results system
-- Run this script to initialize the database

-- Create database (if not exists)
-- Note: In Neon, you might need to create the database separately

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    competition VARCHAR(100) NOT NULL,
    position VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    team VARCHAR(100),
    points INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meta table for summary data
CREATE TABLE IF NOT EXISTS meta (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(50),
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_results_category ON results(category);
CREATE INDEX IF NOT EXISTS idx_results_competition ON results(competition);
CREATE INDEX IF NOT EXISTS idx_results_category_competition ON results(category, competition);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_meta_key ON meta(key);

-- Insert default admin user (password: admin123 - change this!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@sahityotsav.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default teams into leaderboard
INSERT INTO leaderboard (team_name, points) VALUES
('Perinthattiri', 0),
('Kolapparamba', 0),
('Padinhattumutri Town', 0),
('Padinhattumutri West', 0),
('Padinhattumutri East', 0),
('Kadoopuram', 0),
('Unnamthala', 0),
('Pallipuram', 0),
('Koottilangadi', 0),
('Cheloor', 0)
ON CONFLICT (team_name) DO NOTHING;

-- Insert default meta data
INSERT INTO meta (key, value) VALUES
('summary', '{"resultsDeclared": 0}'::jsonb)
ON CONFLICT (key) DO NOTHING;