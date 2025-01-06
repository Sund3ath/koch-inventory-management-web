/*
  # Create default admin user
  
  Creates an admin user with proper password hashing and profile
*/

DO $$ 
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_encrypted_password TEXT;
BEGIN
  -- Generate properly encrypted password
  SELECT crypt('admin123', gen_salt('bf', 10)) INTO v_encrypted_password;

  -- Create admin user if it doesn't exist
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    aud,
    is_super_admin
  ) 
  SELECT
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    v_encrypted_password,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User"}',
    now(),
    now(),
    'authenticated',
    '',
    '',
    '',
    '',
    'authenticated',
    false
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  );

  -- Create profile if user was created and profile doesn't exist
  IF FOUND THEN
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name
    ) 
    SELECT
      v_user_id,
      'Admin',
      'User'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = v_user_id
    );
  END IF;
END $$;