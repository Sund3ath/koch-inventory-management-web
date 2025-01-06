-- Drop existing function
DROP FUNCTION IF EXISTS unassign_device;

-- Create updated unassign_device function with more graceful handling
CREATE OR REPLACE FUNCTION unassign_device(p_device_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Update device status to available
    UPDATE devices
    SET status = 'available'
    WHERE id = p_device_id;

    -- Mark any active assignments as returned
    UPDATE device_assignments
    SET 
      status = 'returned',
      return_date = NOW()
    WHERE device_id = p_device_id
      AND status = 'active';

    -- No error if no assignments were found - just return successfully
    RETURN;

  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    RAISE EXCEPTION 'Failed to unassign device: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;