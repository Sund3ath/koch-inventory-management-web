-- Create tables if they don't exist
DO $$ 
BEGIN
    -- Create departments table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'departments') THEN
        CREATE TABLE departments (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL UNIQUE,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create employees table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'employees') THEN
        CREATE TABLE employees (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            email text UNIQUE NOT NULL,
            first_name text NOT NULL,
            last_name text NOT NULL,
            department_id uuid REFERENCES departments(id),
            position text NOT NULL,
            hire_date date NOT NULL,
            status text NOT NULL CHECK (status IN ('active', 'inactive')),
            manager_id uuid REFERENCES employees(id),
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create devices table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'devices') THEN
        CREATE TABLE devices (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            type text NOT NULL CHECK (type IN ('laptop', 'phone', 'tablet', 'monitor', 'other')),
            brand text NOT NULL,
            model text NOT NULL,
            serial_number text UNIQUE NOT NULL,
            purchase_date date NOT NULL,
            warranty_expiry date,
            status text NOT NULL CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
            notes text,
            created_by uuid REFERENCES auth.users(id),
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create device assignments table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'device_assignments') THEN
        CREATE TABLE device_assignments (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            device_id uuid REFERENCES devices(id) NOT NULL,
            employee_id uuid REFERENCES employees(id) NOT NULL,
            assigned_by uuid REFERENCES auth.users(id) NOT NULL,
            assigned_at timestamptz DEFAULT now(),
            return_date timestamptz,
            status text NOT NULL CHECK (status IN ('active', 'returned', 'lost')),
            notes text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now(),
            UNIQUE(device_id, employee_id, assigned_at)
        );
    END IF;

    -- Create licenses table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'licenses') THEN
        CREATE TABLE licenses (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL,
            vendor text NOT NULL,
            type text NOT NULL CHECK (type IN ('software', 'hardware')),
            key text UNIQUE NOT NULL,
            total_seats integer NOT NULL CHECK (total_seats > 0),
            purchase_date date NOT NULL,
            expiration_date date,
            cost decimal(10,2) NOT NULL,
            status text NOT NULL CHECK (status IN ('active', 'expired', 'pending')),
            notes text,
            created_by uuid REFERENCES auth.users(id),
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create license assignments table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'license_assignments') THEN
        CREATE TABLE license_assignments (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            license_id uuid REFERENCES licenses(id) NOT NULL,
            employee_id uuid REFERENCES employees(id) NOT NULL,
            assigned_by uuid REFERENCES auth.users(id) NOT NULL,
            assigned_at timestamptz DEFAULT now(),
            expires_at timestamptz,
            status text NOT NULL CHECK (status IN ('active', 'revoked', 'expired')),
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create audit logs table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
        CREATE TABLE audit_logs (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            table_name text NOT NULL,
            record_id uuid NOT NULL,
            action text NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
            old_data jsonb,
            new_data jsonb,
            performed_by uuid REFERENCES auth.users(id),
            performed_at timestamptz DEFAULT now()
        );
    END IF;
END $$;

-- Enable RLS on all tables
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE IF EXISTS departments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS employees ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS devices ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS device_assignments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS licenses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS license_assignments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
END $$;

-- Create or replace functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace audit logging function
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        performed_by
    ) VALUES (
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        LOWER(TG_OP),
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE'
            THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
            THEN to_jsonb(NEW)
            ELSE NULL
        END,
        auth.uid()
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist and recreate them
DO $$
BEGIN
    -- Departments
    DROP TRIGGER IF EXISTS update_departments_timestamp ON departments;
    CREATE TRIGGER update_departments_timestamp
        BEFORE UPDATE ON departments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

    -- Employees
    DROP TRIGGER IF EXISTS update_employees_timestamp ON employees;
    CREATE TRIGGER update_employees_timestamp
        BEFORE UPDATE ON employees
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

    -- Devices
    DROP TRIGGER IF EXISTS update_devices_timestamp ON devices;
    CREATE TRIGGER update_devices_timestamp
        BEFORE UPDATE ON devices
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

    DROP TRIGGER IF EXISTS audit_devices ON devices;
    CREATE TRIGGER audit_devices
        AFTER INSERT OR UPDATE OR DELETE ON devices
        FOR EACH ROW EXECUTE FUNCTION log_audit();

    -- Device assignments
    DROP TRIGGER IF EXISTS update_device_assignments_timestamp ON device_assignments;
    CREATE TRIGGER update_device_assignments_timestamp
        BEFORE UPDATE ON device_assignments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

    DROP TRIGGER IF EXISTS audit_device_assignments ON device_assignments;
    CREATE TRIGGER audit_device_assignments
        AFTER INSERT OR UPDATE OR DELETE ON device_assignments
        FOR EACH ROW EXECUTE FUNCTION log_audit();

    -- Licenses
    DROP TRIGGER IF EXISTS update_licenses_timestamp ON licenses;
    CREATE TRIGGER update_licenses_timestamp
        BEFORE UPDATE ON licenses
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

    DROP TRIGGER IF EXISTS audit_licenses ON licenses;
    CREATE TRIGGER audit_licenses
        AFTER INSERT OR UPDATE OR DELETE ON licenses
        FOR EACH ROW EXECUTE FUNCTION log_audit();

    -- License assignments
    DROP TRIGGER IF EXISTS update_license_assignments_timestamp ON license_assignments;
    CREATE TRIGGER update_license_assignments_timestamp
        BEFORE UPDATE ON license_assignments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();

    DROP TRIGGER IF EXISTS audit_license_assignments ON license_assignments;
    CREATE TRIGGER audit_license_assignments
        AFTER INSERT OR UPDATE OR DELETE ON license_assignments
        FOR EACH ROW EXECUTE FUNCTION log_audit();
END $$;

-- Create or replace policies
DO $$
BEGIN
    -- Departments policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON departments;
    CREATE POLICY "Enable read access for authenticated users"
        ON departments FOR SELECT
        TO authenticated
        USING (true);

    -- Employees policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON employees;
    CREATE POLICY "Enable read access for authenticated users"
        ON employees FOR SELECT
        TO authenticated
        USING (true);

    -- Devices policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON devices;
    CREATE POLICY "Enable read access for authenticated users"
        ON devices FOR SELECT
        TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON devices;
    CREATE POLICY "Enable insert access for authenticated users"
        ON devices FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = created_by);

    DROP POLICY IF EXISTS "Enable update access for device owners" ON devices;
    CREATE POLICY "Enable update access for device owners"
        ON devices FOR UPDATE
        TO authenticated
        USING (auth.uid() = created_by)
        WITH CHECK (auth.uid() = created_by);

    DROP POLICY IF EXISTS "Enable delete access for device owners" ON devices;
    CREATE POLICY "Enable delete access for device owners"
        ON devices FOR DELETE
        TO authenticated
        USING (auth.uid() = created_by);

    -- Device assignments policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON device_assignments;
    CREATE POLICY "Enable read access for authenticated users"
        ON device_assignments FOR SELECT
        TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON device_assignments;
    CREATE POLICY "Enable insert access for authenticated users"
        ON device_assignments FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = assigned_by);

    -- Licenses policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON licenses;
    CREATE POLICY "Enable read access for authenticated users"
        ON licenses FOR SELECT
        TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON licenses;
    CREATE POLICY "Enable insert access for authenticated users"
        ON licenses FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = created_by);

    DROP POLICY IF EXISTS "Enable update access for license owners" ON licenses;
    CREATE POLICY "Enable update access for license owners"
        ON licenses FOR UPDATE
        TO authenticated
        USING (auth.uid() = created_by)
        WITH CHECK (auth.uid() = created_by);

    -- License assignments policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON license_assignments;
    CREATE POLICY "Enable read access for authenticated users"
        ON license_assignments FOR SELECT
        TO authenticated
        USING (true);

    DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON license_assignments;
    CREATE POLICY "Enable insert access for authenticated users"
        ON license_assignments FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = assigned_by);

    -- Audit logs policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON audit_logs;
    CREATE POLICY "Enable read access for authenticated users"
        ON audit_logs FOR SELECT
        TO authenticated
        USING (true);
END $$;