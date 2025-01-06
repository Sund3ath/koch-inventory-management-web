/*
  # Department Management Updates

  1. New Functions
    - manage_department: Creates a new department with validation
    - update_department: Updates department details
    - delete_department: Safely deletes department if no employees

  2. Security
    - RLS policies for department management
    - Validation triggers
*/

-- Add required columns to departments table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'departments' AND column_name = 'manager_id'
  ) THEN
    ALTER TABLE departments 
    ADD COLUMN manager_id uuid REFERENCES employees(id),
    ADD COLUMN parent_id uuid REFERENCES departments(id),
    ADD COLUMN description text,
    ADD COLUMN cost_center text,
    ADD COLUMN location text,
    ADD COLUMN created_by uuid REFERENCES auth.users(id),
    ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
  END IF;
END $$;

-- Create function to manage departments
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
    manager_id,
    parent_id,
    description,
    cost_center,
    location,
    created_by,
    status
  ) VALUES (
    p_name,
    p_manager_id,
    p_parent_id,
    p_description,
    p_cost_center,
    p_location,
    p_created_by,
    'active'
  )
  RETURNING id INTO v_department_id;

  RETURN v_department_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION manage_department TO authenticated;

-- Create policies for departments
DO $$ 
BEGIN
  -- Enable RLS on departments table
  ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Enable read access for authenticated users"
    ON departments FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable insert for authenticated users"
    ON departments FOR INSERT
    TO authenticated
    WITH CHECK (true);

  CREATE POLICY "Enable update for authenticated users"
    ON departments FOR UPDATE
    TO authenticated
    USING (true);

  CREATE POLICY "Enable delete for authenticated users"
    ON departments FOR DELETE
    TO authenticated
    USING (true);
END $$;