-- Drop existing function if it exists
DROP FUNCTION IF EXISTS unassign_device;

-- Create updated unassign_device function with proper transaction handling
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

    -- If no rows were affected, raise an error
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No active assignment found for device';
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    RAISE EXCEPTION 'Failed to unassign device: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;