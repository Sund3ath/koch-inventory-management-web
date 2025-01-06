/*
  # Device Assignments Security Policies

  1. Security Changes
    - Enable RLS on device_assignments table
    - Add policies for CRUD operations on device_assignments
    - Ensure authenticated users can manage assignments

  2. Policies
    - Read: All authenticated users can read assignments
    - Insert: Authenticated users can create assignments
    - Update: Authenticated users can update assignments
    - Delete: Authenticated users can delete assignments
*/

-- Enable RLS on device_assignments table
ALTER TABLE device_assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON device_assignments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON device_assignments;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON device_assignments;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON device_assignments;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
    ON device_assignments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON device_assignments FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON device_assignments FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Enable delete for authenticated users"
    ON device_assignments FOR DELETE
    TO authenticated
    USING (true);

-- Grant necessary permissions to authenticated users
GRANT ALL ON device_assignments TO authenticated;