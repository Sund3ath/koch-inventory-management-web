/*
  # Add device usage logging

  1. New Tables
    - `device_usage_logs`
      - `id` (uuid, primary key)
      - `device_id` (uuid, references devices)
      - `user_id` (uuid, references auth.users)
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `device_usage_logs` table
    - Add policies for authenticated users
*/

-- Create device_usage_logs table
CREATE TABLE IF NOT EXISTS device_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE device_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON device_usage_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON device_usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users"
  ON device_usage_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON device_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to log device usage
CREATE OR REPLACE FUNCTION log_device_usage(
  p_device_id UUID,
  p_user_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO device_usage_logs (
    device_id,
    user_id,
    notes
  ) VALUES (
    p_device_id,
    p_user_id,
    p_notes
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to end device usage
CREATE OR REPLACE FUNCTION end_device_usage(
  p_log_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE device_usage_logs
  SET 
    ended_at = now(),
    notes = CASE 
      WHEN p_notes IS NOT NULL THEN 
        COALESCE(notes || E'\n', '') || p_notes
      ELSE notes
    END
  WHERE id = p_log_id
    AND ended_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No active usage log found with ID %', p_log_id;
  END IF;
END;
$$ LANGUAGE plpgsql;