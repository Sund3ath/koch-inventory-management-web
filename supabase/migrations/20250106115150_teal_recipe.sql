/*
  # Update profiles table for direct authentication
  
  1. Add auth-related columns to profiles
  2. Add required functions for password management
  3. Enable pgcrypto extension for password hashing
*/

-- Enable pgcrypto extension if not enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First add nullable columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password text,
ADD COLUMN IF NOT EXISTS last_login timestamptz,
ADD COLUMN IF NOT EXISTS status text;

-- Update existing rows with default values
UPDATE profiles 
SET password = crypt('changeme', gen_salt('bf', 10)),
    status = 'active'
WHERE password IS NULL;

-- Now make columns NOT NULL
ALTER TABLE profiles 
ALTER COLUMN password SET NOT NULL,
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'active',
ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'inactive', 'locked'));

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create function to hash passwords
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION verify_password(password text, hashed_password text)
RETURNS boolean AS $$
BEGIN
  RETURN hashed_password = crypt(password, hashed_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION hash_password TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password TO authenticated;