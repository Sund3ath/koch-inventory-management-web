-- Create admin user with proper password hashing
DO $$ 
DECLARE
  v_user_id UUID;
  v_encrypted_password TEXT;
BEGIN
  -- Check if admin user exists
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'admin@example.com';

  IF v_user_id IS NULL THEN
    -- Generate new user ID and encrypted password
    v_user_id := gen_random_uuid();
    v_encrypted_password := crypt('admin123', gen_salt('bf', 10));

    -- Insert admin user
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
      aud,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      is_super_admin
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@example.com',
      v_encrypted_password,
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Admin","last_name":"User"}'::jsonb,
      NOW(),
      NOW(),
      'authenticated',
      'authenticated',
      '',
      '',
      '',
      '',
      FALSE
    );

    -- Create profile
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'Admin',
      'User',
      NOW(),
      NOW()
    );
  END IF;
END $$;