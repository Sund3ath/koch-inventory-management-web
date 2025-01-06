-- Update device_history event_type check constraint
ALTER TABLE device_history 
DROP CONSTRAINT IF EXISTS device_history_event_type_check;

ALTER TABLE device_history
ADD CONSTRAINT device_history_event_type_check 
CHECK (event_type IN (
  'purchase',
  'assignment',
  'unassignment',
  'maintenance',
  'incident',
  'software_update',
  'warranty_update',
  'performance_check',
  'modification',
  'service',
  'condition_assessment',
  'status_change'
));

-- Update handle_device_events function to handle assignments
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
          WHEN NEW.status = 'assigned' THEN 'assignment'
          WHEN OLD.status = 'assigned' AND NEW.status = 'available' THEN 'unassignment'
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