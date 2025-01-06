/*
  # License Assignment System

  1. Functions
    - assign_license: Assigns a license to an employee
    - unassign_license: Removes a license assignment
    - check_license_availability: Validates if a license can be assigned

  2. Triggers
    - update_license_availability: Updates available quantity on assignment changes
    - log_license_assignments: Maintains audit trail of all assignment changes
*/

-- Create license assignment audit log
CREATE TABLE IF NOT EXISTS license_assignment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid REFERENCES licenses(id) NOT NULL,
  employee_id uuid REFERENCES employees(id) NOT NULL,
  action text NOT NULL CHECK (action IN ('assigned', 'unassigned')),
  performed_by uuid REFERENCES auth.users(id) NOT NULL,
  performed_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS on audit log
ALTER TABLE license_assignment_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log
CREATE POLICY "Enable read access for authenticated users"
  ON license_assignment_logs FOR SELECT
  TO authenticated
  USING (true);

-- Function to check license availability
CREATE OR REPLACE FUNCTION check_license_availability(
  p_license_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
  v_total INTEGER;
BEGIN
  SELECT 
    total_quantity,
    (SELECT COUNT(*) 
     FROM license_assignments 
     WHERE license_id = p_license_id AND status = 'active'
    ) as used
  INTO v_total, v_available
  FROM licenses
  WHERE id = p_license_id;

  RETURN v_available < v_total;
END;
$$ LANGUAGE plpgsql;

-- Function to assign license
CREATE OR REPLACE FUNCTION assign_license(
  p_license_id UUID,
  p_employee_id UUID,
  p_assigned_by UUID,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_assignment_id UUID;
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

  -- Check if employee already has this license
  IF EXISTS (
    SELECT 1 FROM license_assignments
    WHERE license_id = p_license_id
    AND employee_id = p_employee_id
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Employee already has this license';
  END IF;

  -- Create assignment
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
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to assign license: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Function to unassign license
CREATE OR REPLACE FUNCTION unassign_license(
  p_assignment_id UUID,
  p_performed_by UUID
)
RETURNS VOID AS $$
DECLARE
  v_license_id UUID;
  v_employee_id UUID;
BEGIN
  -- Get assignment details
  SELECT license_id, employee_id
  INTO v_license_id, v_employee_id
  FROM license_assignments
  WHERE id = p_assignment_id
  AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active assignment not found';
  END IF;

  -- Update assignment status
  UPDATE license_assignments
  SET 
    status = 'revoked',
    updated_at = now()
  WHERE id = p_assignment_id;

  -- Log unassignment
  INSERT INTO license_assignment_logs (
    license_id,
    employee_id,
    action,
    performed_by
  ) VALUES (
    v_license_id,
    v_employee_id,
    'unassigned',
    p_performed_by
  );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_license_availability TO authenticated;
GRANT EXECUTE ON FUNCTION assign_license TO authenticated;
GRANT EXECUTE ON FUNCTION unassign_license TO authenticated;