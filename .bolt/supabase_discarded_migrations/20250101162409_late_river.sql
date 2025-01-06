-- Create profiles table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL UNIQUE,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Enable read access for users"
      ON profiles FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Enable insert access for users"
      ON profiles FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Enable update for users"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);

    -- Create trigger for updated_at
    CREATE TRIGGER update_profiles_timestamp
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;