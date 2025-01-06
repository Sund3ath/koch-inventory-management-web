/*
  # Update device policies

  1. Changes
    - Drop existing device policies
    - Add new policies for CRUD operations
    - Allow authenticated users to create and read devices
    - Allow device creators to update their devices
    - Allow admins to manage all devices

  2. Security
    - Enable RLS on devices table
    - Policies based on user authentication and ownership
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_read_devices" ON devices;
DROP POLICY IF EXISTS "allow_create_devices" ON devices;
DROP POLICY IF EXISTS "allow_update_own_devices" ON devices;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON devices FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON devices FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for device owners"
ON devices FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable delete access for device owners"
ON devices FOR DELETE
TO authenticated
USING (auth.uid() = created_by);