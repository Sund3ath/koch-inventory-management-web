-- Create function to handle employee notifications
CREATE OR REPLACE FUNCTION handle_employee_notifications()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_title TEXT;
  v_message TEXT;
  v_severity TEXT;
BEGIN
  -- Get the user who made the change
  v_user_id := auth.uid();

  -- Handle different cases
  CASE
    -- New employee added
    WHEN TG_OP = 'INSERT' THEN
      v_title := 'New Employee Added';
      v_message := format('New employee added: %s %s', NEW.first_name, NEW.last_name);
      v_severity := 'info';

    -- Employee status changed
    WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      v_title := 'Employee Status Changed';
      v_message := format('%s %s status changed to %s', 
        NEW.first_name, NEW.last_name, NEW.status);
      v_severity := CASE
        WHEN NEW.status = 'inactive' THEN 'warning'
        ELSE 'info'
      END;

    ELSE
      RETURN NEW;
  END CASE;

  -- Create notification
  PERFORM create_notification(
    v_user_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'employee_added'
      WHEN NEW.status = 'inactive' THEN 'employee_removed'
      ELSE 'employee_updated'
    END,
    v_title,
    v_message,
    v_severity
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for employee notifications
DROP TRIGGER IF EXISTS on_employee_change ON employees;
CREATE TRIGGER on_employee_change
  AFTER INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION handle_employee_notifications();