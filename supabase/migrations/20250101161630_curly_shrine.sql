-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON devices;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON devices;
DROP POLICY IF EXISTS "Enable update access for device owners" ON devices;
DROP POLICY IF EXISTS "Enable delete access for device owners" ON devices;

-- Create new policies with simpler rules
CREATE POLICY "Enable read access for authenticated users"
ON devices FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON devices FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON devices FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users"
ON devices FOR DELETE
TO authenticated
USING (true);