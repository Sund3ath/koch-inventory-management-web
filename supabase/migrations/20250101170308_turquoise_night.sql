-- Add created_by column to licenses table
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Update add_license function to include created_by
CREATE OR REPLACE FUNCTION add_license(
  p_name TEXT,
  p_vendor TEXT,
  p_type TEXT,
  p_key TEXT,
  p_total_quantity INTEGER,
  p_purchase_date DATE,
  p_expiration_date DATE,
  p_cost DECIMAL,
  p_notes TEXT,
  p_created_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_license_id UUID;
BEGIN
  -- Validate inputs
  IF p_total_quantity <= 0 THEN
    RAISE EXCEPTION 'Total quantity must be greater than 0';
  END IF;

  -- Check for duplicate license key
  IF EXISTS (SELECT 1 FROM licenses WHERE key = p_key) THEN
    RAISE EXCEPTION 'License key already exists';
  END IF;

  -- Insert new license
  INSERT INTO licenses (
    name,
    vendor,
    type,
    key,
    total_quantity,
    available_quantity,
    purchase_date,
    expiration_date,
    cost,
    status,
    notes,
    created_by
  ) VALUES (
    p_name,
    p_vendor,
    p_type,
    p_key,
    p_total_quantity,
    p_total_quantity,
    p_purchase_date,
    p_expiration_date,
    p_cost,
    CASE 
      WHEN p_expiration_date < CURRENT_DATE THEN 'expired'
      ELSE 'active'
    END,
    p_notes,
    p_created_by
  )
  RETURNING id INTO v_license_id;

  RETURN v_license_id;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to create license: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;