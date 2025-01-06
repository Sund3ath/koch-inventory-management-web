/*
  # Add License Management Tables
  
  1. New Tables
    - `licenses` - Stores software/hardware license information
    - `license_assignments` - Tracks license assignments to employees
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    
  3. Relationships
    - `license_assignments` links to both `licenses` and `employees`
*/

-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    vendor text NOT NULL,
    type text NOT NULL,
    key text NOT NULL UNIQUE,
    total_quantity integer NOT NULL CHECK (total_quantity > 0),
    available_quantity integer NOT NULL,
    purchase_date date NOT NULL,
    expiration_date date,
    cost decimal(10,2) NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'expired', 'pending')),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create license assignments table
CREATE TABLE IF NOT EXISTS license_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id uuid REFERENCES licenses(id) NOT NULL,
    employee_id uuid REFERENCES employees(id) NOT NULL,
    assigned_by uuid REFERENCES auth.users(id) NOT NULL,
    assigned_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    status text NOT NULL CHECK (status IN ('active', 'revoked', 'expired')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(license_id, employee_id)
);

-- Enable RLS
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_assignments ENABLE ROW LEVEL SECURITY;

-- Create updated_at triggers
CREATE TRIGGER on_licenses_updated
    BEFORE UPDATE ON licenses
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_license_assignments_updated
    BEFORE UPDATE ON license_assignments
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Create policies for licenses
CREATE POLICY "Enable read access for authenticated users"
    ON licenses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON licenses FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON licenses FOR UPDATE
    TO authenticated
    USING (true);

-- Create policies for license assignments
CREATE POLICY "Enable read access for authenticated users"
    ON license_assignments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON license_assignments FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON license_assignments FOR UPDATE
    TO authenticated
    USING (true);