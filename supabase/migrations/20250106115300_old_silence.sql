/*
  # Create admin user with proper profile
  
  Creates an admin user with proper password hashing and complete profile
*/

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