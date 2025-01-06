-- Create stored procedure for assigning devices with proper error handling
CREATE OR REPLACE FUNCTION assign_device(
  p_device_id UUID,
  p_employee_id UUID,
  p_assigned_by UUID
)
RETURNS VOID AS $$
BEGIN
  -- Check if device exists and is available
  IF NOT EXISTS (
    SELECT 1 FROM devices 
    WHERE id = p_device_id 
    AND status = 'available'
  ) THEN
    RAISE EXCEPTION 'Device is not available for assignment';
  END IF;

  -- Check if employee exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE id = p_employee_id 
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Employee is not active';
  END IF;

  -- Begin transaction
  BEGIN
    -- Update device status
    UPDATE devices
    SET status = 'assigned'
    WHERE id = p_device_id;

    -- Create assignment record
    INSERT INTO device_assignments (
      device_id,
      employee_id,
      assigned_by,
      status
    ) VALUES (
      p_device_id,
      p_employee_id,
      p_assigned_by,
      'active'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Rollback changes if any error occurs
    RAISE EXCEPTION 'Failed to assign device: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION assign_device TO authenticated;