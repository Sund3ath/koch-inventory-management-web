/*
  # Add device history tracking
  
  Creates tables and functions to track comprehensive device history including:
  - Purchase details
  - Ownership history
  - Maintenance records
  - Incidents/damage reports
  - Software updates
  - Warranty information
  - Performance metrics
  - Modifications/upgrades
  - Service records
  - Condition assessments
*/

-- Create device_history table to track all device events
CREATE TABLE device_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) NOT NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'purchase',
    'assignment',
    'maintenance',
    'incident',
    'software_update',
    'warranty_update',
    'performance_check',
    'modification',
    'service',
    'condition_assessment'
  )),
  event_date timestamptz NOT NULL DEFAULT now(),
  performed_by uuid REFERENCES auth.users(id),
  details jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_warranties table
CREATE TABLE device_warranties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) NOT NULL,
  warranty_type text NOT NULL,
  provider text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  policy_number text,
  coverage_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(device_id, warranty_type)
);

-- Create device_software table
CREATE TABLE device_software (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) NOT NULL,
  software_name text NOT NULL,
  version text NOT NULL,
  installed_date timestamptz NOT NULL DEFAULT now(),
  installed_by uuid REFERENCES auth.users(id),
  status text NOT NULL CHECK (status IN ('active', 'removed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_performance_metrics table
CREATE TABLE device_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) NOT NULL,
  metric_type text NOT NULL,
  metric_value jsonb NOT NULL,
  measured_at timestamptz NOT NULL DEFAULT now(),
  measured_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE device_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_software ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON device_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON device_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
  ON device_warranties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON device_warranties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
  ON device_software FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON device_software FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
  ON device_performance_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON device_performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add purchase_price and purchase_date to devices table
ALTER TABLE devices
ADD COLUMN IF NOT EXISTS purchase_price decimal(10,2),
ADD COLUMN IF NOT EXISTS warranty_expiry date;

-- Create function to record device history
CREATE OR REPLACE FUNCTION record_device_history(
  p_device_id UUID,
  p_event_type TEXT,
  p_details JSONB,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_history_id UUID;
BEGIN
  INSERT INTO device_history (
    device_id,
    event_type,
    performed_by,
    details,
    notes
  ) VALUES (
    p_device_id,
    p_event_type,
    auth.uid(),
    p_details,
    p_notes
  )
  RETURNING id INTO v_history_id;

  RETURN v_history_id;
END;
$$;

-- Create function to get device timeline
CREATE OR REPLACE FUNCTION get_device_timeline(p_device_id UUID)
RETURNS TABLE (
  event_date timestamptz,
  event_type text,
  details jsonb,
  notes text,
  performed_by_name text
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.event_date,
    h.event_type,
    h.details,
    h.notes,
    p.first_name || ' ' || p.last_name as performed_by_name
  FROM device_history h
  LEFT JOIN profiles p ON h.performed_by = p.id
  WHERE h.device_id = p_device_id
  ORDER BY h.event_date DESC;
END;
$$;

-- Grant permissions
GRANT ALL ON device_history TO authenticated;
GRANT ALL ON device_warranties TO authenticated;
GRANT ALL ON device_software TO authenticated;
GRANT ALL ON device_performance_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION record_device_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_device_timeline TO authenticated;

-- Create trigger to automatically record device events
CREATE OR REPLACE FUNCTION handle_device_events()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Record relevant device events
  CASE
    -- New device added
    WHEN TG_OP = 'INSERT' THEN
      PERFORM record_device_history(
        NEW.id,
        'purchase',
        jsonb_build_object(
          'purchase_price', NEW.purchase_price,
          'purchase_date', NEW.purchase_date,
          'brand', NEW.brand,
          'model', NEW.model,
          'serial_number', NEW.serial_number
        ),
        'Initial device purchase'
      );

    -- Device status changed
    WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      PERFORM record_device_history(
        NEW.id,
        CASE 
          WHEN NEW.status = 'maintenance' THEN 'maintenance'
          WHEN NEW.status = 'retired' THEN 'condition_assessment'
          ELSE 'status_change'
        END,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
  END CASE;

  RETURN NEW;
END;
$$;

-- Create trigger for device events
DROP TRIGGER IF EXISTS on_device_event ON devices;
CREATE TRIGGER on_device_event
  AFTER INSERT OR UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION handle_device_events();