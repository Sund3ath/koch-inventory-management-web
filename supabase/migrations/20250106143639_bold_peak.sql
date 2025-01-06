/*
  # Add device history tracking
  
  This migration adds tables and functions for tracking device history, warranties,
  software, and performance metrics. It handles the case where some tables may already exist.
*/

-- Add purchase_price and warranty_expiry to devices table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'devices' AND column_name = 'purchase_price'
  ) THEN
    ALTER TABLE devices ADD COLUMN purchase_price decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'devices' AND column_name = 'warranty_expiry'
  ) THEN
    ALTER TABLE devices ADD COLUMN warranty_expiry date;
  END IF;
END $$;

-- Create function to record device history
CREATE OR REPLACE FUNCTION record_device_history(
  p_device_id UUID,
  p_event_type TEXT,
  p_details JSONB,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_history_id UUID;
BEGIN
  INSERT INTO device_history (
    device_id,
    event_type,
    performed_by,
    details,
    notes
  ) VALUES (
    p_device_id,
    p_event_type,
    auth.uid(),
    p_details,
    p_notes
  )
  RETURNING id INTO v_history_id;

  RETURN v_history_id;
END;
$$;

-- Create function to get device timeline
CREATE OR REPLACE FUNCTION get_device_timeline(p_device_id UUID)
RETURNS TABLE (
  event_date timestamptz,
  event_type text,
  details jsonb,
  notes text,
  performed_by_name text
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.event_date,
    h.event_type,
    h.details,
    h.notes,
    p.first_name || ' ' || p.last_name as performed_by_name
  FROM device_history h
  LEFT JOIN profiles p ON h.performed_by = p.id
  WHERE h.device_id = p_device_id
  ORDER BY h.event_date DESC;
END;
$$;

-- Create trigger to automatically record device events
CREATE OR REPLACE FUNCTION handle_device_events()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Record relevant device events
  CASE
    -- New device added
    WHEN TG_OP = 'INSERT' THEN
      PERFORM record_device_history(
        NEW.id,
        'purchase',
        jsonb_build_object(
          'purchase_price', NEW.purchase_price,
          'purchase_date', NEW.purchase_date,
          'brand', NEW.brand,
          'model', NEW.model,
          'serial_number', NEW.serial_number
        ),
        'Initial device purchase'
      );

    -- Device status changed
    WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      PERFORM record_device_history(
        NEW.id,
        CASE 
          WHEN NEW.status = 'maintenance' THEN 'maintenance'
          WHEN NEW.status = 'retired' THEN 'condition_assessment'
          ELSE 'status_change'
        END,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
  END CASE;

  RETURN NEW;
END;
$$;

-- Create or replace trigger for device events
DROP TRIGGER IF EXISTS on_device_event ON devices;
CREATE TRIGGER on_device_event
  AFTER INSERT OR UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION handle_device_events();

-- Grant permissions
GRANT EXECUTE ON FUNCTION record_device_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_device_timeline TO authenticated;
GRANT EXECUTE ON FUNCTION handle_device_events TO authenticated;