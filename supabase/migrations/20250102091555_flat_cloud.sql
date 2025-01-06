/*
  # Add Department Hierarchy Support

  1. New Tables
    - `department_hierarchy`
      - `id` (uuid, primary key)
      - `parent_id` (uuid, references departments)
      - `child_id` (uuid, references departments)
      - `level` (integer)
      - `path` (text[])
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `department_hierarchy` table
    - Add policies for authenticated users
*/

-- Create department_hierarchy table
CREATE TABLE IF NOT EXISTS department_hierarchy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES departments(id),
  child_id uuid REFERENCES departments(id),
  level integer NOT NULL,
  path text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Enable RLS
ALTER TABLE department_hierarchy ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON department_hierarchy FOR SELECT
  TO authenticated
  USING (true);

-- Function to update department hierarchy
CREATE OR REPLACE FUNCTION update_department_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear existing hierarchy for this department
  DELETE FROM department_hierarchy WHERE child_id = NEW.id;
  
  -- Insert self-reference at level 0
  INSERT INTO department_hierarchy (parent_id, child_id, level, path)
  VALUES (NEW.id, NEW.id, 0, ARRAY[NEW.id::text]);
  
  -- Insert hierarchy entries for the new department
  WITH RECURSIVE hierarchy AS (
    -- Base case: direct parent
    SELECT 
      d.id as parent_id,
      NEW.id as child_id,
      1 as level,
      ARRAY[d.id::text, NEW.id::text] as path
    FROM departments d
    WHERE d.id = NEW.parent_id
    
    UNION ALL
    
    -- Recursive case: ancestors
    SELECT
      d.id as parent_id,
      h.child_id,
      h.level + 1,
      d.id::text || h.path
    FROM departments d
    JOIN hierarchy h ON d.id = h.parent_id
    WHERE h.level < 10  -- Prevent infinite recursion
  )
  INSERT INTO department_hierarchy (parent_id, child_id, level, path)
  SELECT parent_id, child_id, level, path
  FROM hierarchy;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for department hierarchy updates
CREATE TRIGGER update_department_hierarchy_trigger
  AFTER INSERT OR UPDATE OF parent_id ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_department_hierarchy();

-- Grant necessary permissions
GRANT ALL ON department_hierarchy TO authenticated;