-- Create stored procedure for assigning devices
CREATE OR REPLACE FUNCTION assign_device(
  p_device_id UUID,
  p_employee_id UUID,
  p_assigned_by UUID
)
RETURNS VOID AS $$
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
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure for unassigning devices
CREATE OR REPLACE FUNCTION unassign_device(
  p_device_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update device status
  UPDATE devices
  SET status = 'available'
  WHERE id = p_device_id;

  -- Update assignment record
  UPDATE device_assignments
  SET 
    status = 'returned',
    return_date = NOW()
  WHERE device_id = p_device_id
    AND status = 'active';
END;
$$ LANGUAGE plpgsql;