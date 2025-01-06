/*
  # Fix authentication setup
  
  Updates profiles table and auth functions for custom authentication
*/

-- First ensure pgcrypto is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add required columns to profiles if they don't exist
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'password') THEN
    ALTER TABLE profiles ADD COLUMN password text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
    ALTER TABLE profiles ADD COLUMN status text;
  END IF;
END $$;

-- Add constraints separately to handle existing data
ALTER TABLE profiles 
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN password SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'active';

-- Add unique constraint for email
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_email_unique;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Add status check constraint
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_status_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'inactive', 'locked'));

-- Create index for email lookups
DROP INDEX IF EXISTS idx_profiles_email;
CREATE INDEX idx_profiles_email ON profiles(email);

-- Update or create password functions
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_password(password text, hashed_password text)
RETURNS boolean AS $$
BEGIN
  RETURN hashed_password = crypt(password, hashed_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user with proper ID generation
DO $$ 
DECLARE
  v_user_id UUID;
  v_hashed_password TEXT;
BEGIN
  -- Generate new user ID and hash password
  v_user_id := gen_random_uuid();
  v_hashed_password := crypt('admin123', gen_salt('bf', 10));

  -- Create admin profile if it doesn't exist
  INSERT INTO profiles (
    id,
    email,
    password,
    first_name,
    last_name,
    status,
    created_at,
    updated_at
  ) 
  VALUES (
    v_user_id,
    'admin@example.com',
    v_hashed_password,
    'Admin',
    'User',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING;

END $$;