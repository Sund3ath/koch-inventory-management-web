/*
  # Fix license assignment logs RLS

  1. Changes
    - Add RLS policy to allow authenticated users to insert records into license_assignment_logs
    - Add RLS policy to allow authenticated users to read license_assignment_logs

  2. Security
    - Ensures authenticated users can create log entries when assigning/unassigning licenses
    - Maintains audit trail accessibility
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON license_assignment_logs;

-- Create policies for license_assignment_logs
CREATE POLICY "Enable read access for authenticated users"
  ON license_assignment_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON license_assignment_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON license_assignment_logs TO authenticated;