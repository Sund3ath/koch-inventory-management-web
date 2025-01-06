-- Update devices table type check constraint
ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_type_check;
ALTER TABLE devices ADD CONSTRAINT devices_type_check 
  CHECK (type IN ('laptop', 'phone', 'tablet', 'monitor', 'workstation', 'other'));

-- Update create_bulk_devices function to handle workstation type
CREATE OR REPLACE FUNCTION create_bulk_devices(p_devices jsonb[])
RETURNS SETOF devices AS $$
DECLARE
  v_device jsonb;
  v_result devices;
BEGIN
  -- Start transaction
  BEGIN
    FOREACH v_device IN ARRAY p_devices
    LOOP
      -- Try to insert each device
      BEGIN
        INSERT INTO devices (
          type,
          brand,
          model,
          serial_number,
          status,
          notes,
          created_by,
          purchase_date
        )
        VALUES (
          LOWER((v_device->>'type')::text), -- Convert type to lowercase
          (v_device->>'brand')::text,
          (v_device->>'model')::text,
          (v_device->>'serial_number')::text,
          (v_device->>'status')::text,
          (v_device->>'notes')::text,
          (v_device->>'created_by')::uuid,
          (v_device->>'purchase_date')::timestamptz
        )
        RETURNING * INTO v_result;

        RETURN NEXT v_result;
      EXCEPTION
        WHEN unique_violation THEN
          -- Skip duplicates and continue with next device
          CONTINUE;
      END;
    END LOOP;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback entire transaction on other errors
      RAISE EXCEPTION 'Failed to create devices: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;