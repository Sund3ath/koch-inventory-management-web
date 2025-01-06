/*
  # Update department policies

  1. Changes
    - Enable read access to all departments for authenticated users
    - Simplify department policies to ensure visibility
  
  2. Security
    - Maintains RLS but allows broader read access
    - Keeps write restrictions in place
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON departments;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON departments;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON departments;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON departments;

-- Create new policies
CREATE POLICY "Enable read access for all authenticated users"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users"
  ON departments FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users"
  ON departments FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Grant necessary permissions
GRANT SELECT ON departments TO authenticated;