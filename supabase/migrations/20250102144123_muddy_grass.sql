/*
  # Device Categories and Types Schema

  1. New Tables
    - `device_categories`: Main categories like Hardware, Peripherals, etc.
    - `device_types`: Specific types within categories (e.g., Laptop, Monitor)
    - `device_manufacturers`: Common device manufacturers/brands

  2. Changes
    - Add foreign key constraints to devices table
    - Update device type handling

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create device_categories table
CREATE TABLE IF NOT EXISTS device_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_types table
CREATE TABLE IF NOT EXISTS device_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES device_categories(id) NOT NULL,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category_id, name)
);

-- Create device_manufacturers table
CREATE TABLE IF NOT EXISTS device_manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  website text,
  support_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_manufacturers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON device_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON device_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON device_manufacturers FOR SELECT
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO device_categories (name, description) VALUES
  ('Hardware', 'Physical computing devices'),
  ('Peripherals', 'External devices and accessories'),
  ('Network Equipment', 'Networking and connectivity devices'),
  ('Mobile Devices', 'Smartphones and tablets'),
  ('Audio/Visual', 'Audio and video equipment')
ON CONFLICT (name) DO NOTHING;

-- Insert default types
WITH categories AS (
  SELECT id, name FROM device_categories
)
INSERT INTO device_types (category_id, name, code, description)
SELECT 
  c.id,
  t.name,
  t.code,
  t.description
FROM categories c
CROSS JOIN (
  VALUES 
    ('Hardware', 'Laptop', 'laptop', 'Portable computers'),
    ('Hardware', 'Desktop', 'desktop', 'Stationary workstations'),
    ('Hardware', 'Workstation', 'workstation', 'High-performance computers'),
    ('Peripherals', 'Monitor', 'monitor', 'Display devices'),
    ('Peripherals', 'Keyboard', 'keyboard', 'Input devices'),
    ('Peripherals', 'Mouse', 'mouse', 'Pointing devices'),
    ('Mobile Devices', 'Smartphone', 'phone', 'Mobile phones'),
    ('Mobile Devices', 'Tablet', 'tablet', 'Tablet computers')
) AS t(category_name, name, code, description)
WHERE c.name = t.category_name
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert common manufacturers
INSERT INTO device_manufacturers (name, website) VALUES
  ('Dell', 'https://www.dell.com'),
  ('HP', 'https://www.hp.com'),
  ('Lenovo', 'https://www.lenovo.com'),
  ('Apple', 'https://www.apple.com'),
  ('Microsoft', 'https://www.microsoft.com'),
  ('Samsung', 'https://www.samsung.com'),
  ('LG', 'https://www.lg.com'),
  ('Asus', 'https://www.asus.com'),
  ('Acer', 'https://www.acer.com')
ON CONFLICT (name) DO NOTHING;

-- Add manufacturer_id to devices table
ALTER TABLE devices 
ADD COLUMN IF NOT EXISTS manufacturer_id uuid REFERENCES device_manufacturers(id),
ADD COLUMN IF NOT EXISTS type_id uuid REFERENCES device_types(id);

-- Create function to get device type ID
CREATE OR REPLACE FUNCTION get_device_type_id(p_type text)
RETURNS uuid AS $$
DECLARE
  v_type_id uuid;
BEGIN
  SELECT id INTO v_type_id
  FROM device_types
  WHERE code = p_type;
  
  RETURN v_type_id;
END;
$$ LANGUAGE plpgsql;