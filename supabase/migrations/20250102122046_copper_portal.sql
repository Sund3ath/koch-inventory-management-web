-- Create function to handle device notifications
CREATE OR REPLACE FUNCTION handle_device_notifications()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_title TEXT;
  v_message TEXT;
  v_severity TEXT;
BEGIN
  -- Get the user who made the change
  v_user_id := COALESCE(NEW.created_by, OLD.created_by);

  -- Handle different cases
  CASE
    -- New device added
    WHEN TG_OP = 'INSERT' THEN
      v_title := 'New Device Added';
      v_message := format('New %s added: %s %s', NEW.type, NEW.brand, NEW.model);
      v_severity := 'info';

    -- Device status changed
    WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      v_title := 'Device Status Changed';
      v_message := format('%s %s status changed from %s to %s', 
        NEW.brand, NEW.model, OLD.status, NEW.status);
      v_severity := CASE
        WHEN NEW.status = 'maintenance' THEN 'warning'
        WHEN NEW.status = 'retired' THEN 'critical'
        ELSE 'info'
      END;

    -- Device removed (status changed to retired)
    WHEN TG_OP = 'UPDATE' AND NEW.status = 'retired' THEN
      v_title := 'Device Retired';
      v_message := format('%s %s has been retired', NEW.brand, NEW.model);
      v_severity := 'warning';

    ELSE
      RETURN NEW;
  END CASE;

  -- Create notification
  PERFORM create_notification(
    v_user_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'device_added'
      WHEN NEW.status = 'maintenance' THEN 'device_maintenance'
      WHEN NEW.status = 'retired' THEN 'device_removed'
      ELSE 'device_status_changed'
    END,
    v_title,
    v_message,
    v_severity
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for device notifications
DROP TRIGGER IF EXISTS on_device_change ON devices;
CREATE TRIGGER on_device_change
  AFTER INSERT OR UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION handle_device_notifications();