/*
  # Department and Employee Relationship Fix
  
  1. Changes
    - Remove manager_id from departments table
    - Create department_managers table for the many-to-one relationship
    - Update manage_department function
  
  2. Security
    - RLS policies for all tables
    - Proper validation in functions
*/

-- Create department_managers table to break circular dependency
CREATE TABLE IF NOT EXISTS department_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id) NOT NULL,
  employee_id uuid REFERENCES employees(id) NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(department_id)
);

-- Enable RLS on department_managers
ALTER TABLE department_managers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for department_managers
CREATE POLICY "Enable read access for authenticated users"
  ON department_managers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON department_managers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update manage_department function
CREATE OR REPLACE FUNCTION manage_department(
  p_name TEXT,
  p_manager_id UUID,
  p_created_by UUID,
  p_parent_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_cost_center TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_department_id UUID;
BEGIN
  -- Validate manager exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE id = p_manager_id 
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Manager not found or inactive';
  END IF;

  -- Validate parent department if provided
  IF p_parent_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM departments WHERE id = p_parent_id
  ) THEN
    RAISE EXCEPTION 'Parent department not found';
  END IF;

  -- Insert new department
  INSERT INTO departments (
    name,
    parent_id,
    description,
    cost_center,
    location,
    created_by,
    status
  ) VALUES (
    p_name,
    p_parent_id,
    p_description,
    p_cost_center,
    p_location,
    p_created_by,
    'active'
  )
  RETURNING id INTO v_department_id;

  -- Assign manager
  INSERT INTO department_managers (
    department_id,
    employee_id,
    created_by
  ) VALUES (
    v_department_id,
    p_manager_id,
    p_created_by
  );

  RETURN v_department_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION manage_department TO authenticated;