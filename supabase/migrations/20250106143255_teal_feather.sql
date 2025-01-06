-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can mark their notifications as read" ON notifications;

-- Create new policies with proper permissions
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can mark their notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Only allow updating read_at field
    id = id AND
    user_id = user_id AND
    type = type AND
    title = title AND
    message = message AND
    severity = severity AND
    read_at IS NOT NULL
  );

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;

-- Ensure notification functions have proper permissions
ALTER FUNCTION handle_device_notifications() SECURITY DEFINER;
ALTER FUNCTION create_notification(UUID, TEXT, TEXT, TEXT, TEXT) SECURITY DEFINER;