/*
  # Add initial departments

  1. Changes
    - Adds initial department records to the departments table
    
  2. Data
    - Inserts standard company departments
*/

INSERT INTO departments (name) 
VALUES 
  ('Engineering'),
  ('Design'),
  ('Product'),
  ('Marketing'),
  ('Sales'),
  ('HR'),
  ('Finance'),
  ('Operations'),
  ('Legal')
ON CONFLICT (name) DO NOTHING;