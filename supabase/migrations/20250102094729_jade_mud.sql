-- Drop existing function
DROP FUNCTION IF EXISTS unassign_device;

-- Create updated unassign_device function with more graceful handling
CREATE OR REPLACE FUNCTION unassign_device(p_device_id UUID)
RETURNS VOID AS $$
DECLARE
  v_has_active_assignment BOOLEAN;
BEGIN
  -- Start transaction
  BEGIN
    -- Check if there's an active assignment
    SELECT EXISTS (
      SELECT 1 FROM device_assignments
      WHERE device_id = p_device_id AND status = 'active'
    ) INTO v_has_active_assignment;

    -- Update device status to available regardless of assignment
    UPDATE devices
    SET status = 'available'
    WHERE id = p_device_id;

    -- If there was an active assignment, mark it as returned
    IF v_has_active_assignment THEN
      UPDATE device_assignments
      SET 
        status = 'returned',
        return_date = NOW()
      WHERE device_id = p_device_id
        AND status = 'active';
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    RAISE EXCEPTION 'Failed to unassign device: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;