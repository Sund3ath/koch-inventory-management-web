/*
  # Add notifications system
  
  1. New Tables
    - notifications
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - type (text)
      - title (text)
      - message (text)
      - severity (text)
      - read_at (timestamptz)
      - created_at (timestamptz)
      
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN (
    'device_added', 'device_removed', 'device_status_changed', 'device_maintenance',
    'employee_added', 'employee_updated', 'employee_removed',
    'license_expiring', 'license_added', 'license_renewed', 'license_threshold'
  )),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for marking notifications as read
CREATE POLICY "Users can mark their notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Only allow updating read_at field
    (((xmin::text::integer = xmin::text::integer) AND (id = id)) AND
    (user_id = user_id) AND
    (type = type) AND
    (title = title) AND
    (message = message) AND
    (severity = severity) AND
    (read_at IS NULL))
  );

-- Create function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    severity
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_severity
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;