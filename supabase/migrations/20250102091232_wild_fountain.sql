/*
  # Add Azure AD Sync Logging

  1. New Tables
    - `azure_sync_logs`
      - `id` (uuid, primary key)
      - `status` (text, success/failed)
      - `type` (text, users/groups)
      - `items_processed` (integer)
      - `items_created` (integer)
      - `items_updated` (integer)
      - `items_failed` (integer)
      - `error_message` (text, nullable)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `performed_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `azure_sync_logs` table
    - Add policies for authenticated users
*/

-- Create azure_sync_logs table
CREATE TABLE IF NOT EXISTS azure_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('success', 'failed')),
  type text NOT NULL CHECK (type IN ('users', 'groups')),
  items_processed integer NOT NULL DEFAULT 0,
  items_created integer NOT NULL DEFAULT 0,
  items_updated integer NOT NULL DEFAULT 0,
  items_failed integer NOT NULL DEFAULT 0,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  performed_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE azure_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON azure_sync_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON azure_sync_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Grant necessary permissions
GRANT ALL ON azure_sync_logs TO authenticated;