/*
  # Fix notification permissions
  
  Updates notification policies and functions to properly handle device assignments
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can mark their notifications as read" ON notifications;

-- Create new policies with proper permissions
CREATE POLICY "Enable read access for own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable notification creation"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable marking notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Only allow updating read_at field
    user_id = auth.uid()
  );

-- Update device notification function to handle permissions properly
CREATE OR REPLACE FUNCTION handle_device_notifications()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_title TEXT;
  v_message TEXT;
  v_severity TEXT;
BEGIN
  -- Get the user who made the change
  v_user_id := COALESCE(NEW.created_by, OLD.created_by, auth.uid());

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

    ELSE
      RETURN NEW;
  END CASE;

  -- Create notification with proper permissions
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    severity
  ) VALUES (
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
$$;

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT EXECUTE ON FUNCTION handle_device_notifications TO authenticated;