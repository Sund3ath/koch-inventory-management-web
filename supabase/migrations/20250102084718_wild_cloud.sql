/*
  # Make device_domain_id Optional

  1. Changes
    - Make device_domain_id column explicitly nullable
    - Update create_bulk_devices function to handle null device_domain_id values
*/

-- No need to modify the column since it's already nullable by default
-- Just update the function to handle null values better

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
          purchase_date,
          device_domain_id
        )
        VALUES (
          LOWER((v_device->>'type')::text),
          (v_device->>'brand')::text,
          (v_device->>'model')::text,
          (v_device->>'serial_number')::text,
          (v_device->>'status')::text,
          (v_device->>'notes')::text,
          (v_device->>'created_by')::uuid,
          (v_device->>'purchase_date')::timestamptz,
          NULLIF((v_device->>'device_domain_id')::text, '')  -- Convert empty string to NULL
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