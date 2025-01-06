/*
  # Initial Schema Setup
  
  1. New Tables
    - departments (name, timestamps)
    - employees (personal info, department reference, status)
    - devices (type, details, status)
    - device_assignments (device-employee relationships)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create departments table if not exists
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employees table if not exists
CREATE TABLE IF NOT EXISTS employees (
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

-- Create devices table if not exists
CREATE TABLE IF NOT EXISTS devices (
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

-- Create device assignments table if not exists
CREATE TABLE IF NOT EXISTS device_assignments (
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

-- Enable Row Level Security
DO $$ 
BEGIN
  -- Enable RLS on tables if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'departments' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'employees' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'devices' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'device_assignments' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE device_assignments ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS Policies
DO $$ 
BEGIN
  -- Departments policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'departments' 
    AND policyname = 'allow_read_departments'
  ) THEN
    CREATE POLICY allow_read_departments ON departments
      FOR SELECT TO authenticated USING (true);
  END IF;

  -- Employees policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'employees' 
    AND policyname = 'allow_read_employees'
  ) THEN
    CREATE POLICY allow_read_employees ON employees
      FOR SELECT TO authenticated USING (true);
  END IF;

  -- Devices policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'devices' 
    AND policyname = 'allow_read_devices'
  ) THEN
    CREATE POLICY allow_read_devices ON devices
      FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'devices' 
    AND policyname = 'allow_create_devices'
  ) THEN
    CREATE POLICY allow_create_devices ON devices
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'devices' 
    AND policyname = 'allow_update_own_devices'
  ) THEN
    CREATE POLICY allow_update_own_devices ON devices
      FOR UPDATE TO authenticated
      USING (auth.uid() = created_by)
      WITH CHECK (auth.uid() = created_by);
  END IF;

  -- Device assignments policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'device_assignments' 
    AND policyname = 'allow_read_device_assignments'
  ) THEN
    CREATE POLICY allow_read_device_assignments ON device_assignments
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;