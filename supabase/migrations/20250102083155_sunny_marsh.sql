/*
  # Add Vendors Table

  1. New Tables
    - `vendors`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `category` (text, required)
      - `contact_name` (text, required)
      - `email` (text, required)
      - `phone` (text)
      - `website` (text)
      - `status` (text)
      - `notes` (text)
      - Timestamps and audit fields

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON vendors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users"
  ON vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users"
  ON vendors FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();