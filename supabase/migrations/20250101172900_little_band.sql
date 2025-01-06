/*
  # Fix license assignment function

  1. Changes
    - Update assign_license function to handle existing assignments
    - Add proper error handling for duplicate assignments
    - Ensure atomic transactions

  2. Security
    - Maintains existing RLS policies
    - Preserves audit logging
*/

-- Update the assign_license function
CREATE OR REPLACE FUNCTION assign_license(
  p_license_id UUID,
  p_employee_id UUID,
  p_assigned_by UUID,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_assignment_id UUID;
  v_existing_assignment_id UUID;
BEGIN
  -- Check if license exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM licenses 
    WHERE id = p_license_id 
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'License is not active';
  END IF;

  -- Check if employee exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE id = p_employee_id 
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Employee is not active';
  END IF;

  -- Check if license is available
  IF NOT check_license_availability(p_license_id) THEN
    RAISE EXCEPTION 'No available licenses';
  END IF;

  -- Check for existing assignment and handle it
  SELECT id INTO v_existing_assignment_id
  FROM license_assignments
  WHERE license_id = p_license_id
    AND employee_id = p_employee_id
    AND status = 'active';

  IF FOUND THEN
    -- If there's an active assignment, return its ID
    RETURN v_existing_assignment_id;
  END IF;

  -- Create new assignment
  INSERT INTO license_assignments (
    license_id,
    employee_id,
    assigned_by,
    expires_at,
    status
  ) VALUES (
    p_license_id,
    p_employee_id,
    p_assigned_by,
    p_expires_at,
    'active'
  )
  RETURNING id INTO v_assignment_id;

  -- Log assignment
  INSERT INTO license_assignment_logs (
    license_id,
    employee_id,
    action,
    performed_by
  ) VALUES (
    p_license_id,
    p_employee_id,
    'assigned',
    p_assigned_by
  );

  RETURN v_assignment_id;
END;
$$ LANGUAGE plpgsql;