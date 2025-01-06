-- Update handle_device_events function to include employee details
CREATE OR REPLACE FUNCTION handle_device_events()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee_info jsonb;
BEGIN
  -- Get employee info for assignments
  IF NEW.status = 'assigned' THEN
    SELECT jsonb_build_object(
      'employee_id', e.id,
      'employee_name', e.first_name || ' ' || e.last_name,
      'department', d.name
    )
    INTO v_employee_info
    FROM device_assignments da
    JOIN employees e ON da.employee_id = e.id
    JOIN departments d ON e.department_id = d.id
    WHERE da.device_id = NEW.id
    AND da.status = 'active'
    ORDER BY da.assigned_at DESC
    LIMIT 1;
  END IF;

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
          WHEN NEW.status = 'assigned' THEN 'assignment'
          WHEN OLD.status = 'assigned' AND NEW.status = 'available' THEN 'unassignment'
          WHEN NEW.status = 'maintenance' THEN 'maintenance'
          WHEN NEW.status = 'retired' THEN 'condition_assessment'
          ELSE 'status_change'
        END,
        CASE
          WHEN NEW.status = 'assigned' THEN 
            jsonb_build_object(
              'old_status', OLD.status,
              'new_status', NEW.status
            ) || v_employee_info
          ELSE
            jsonb_build_object(
              'old_status', OLD.status,
              'new_status', NEW.status
            )
        END,
        CASE
          WHEN NEW.status = 'assigned' THEN 
            'Device assigned to ' || (v_employee_info->>'employee_name')
          WHEN OLD.status = 'assigned' AND NEW.status = 'available' THEN
            'Device unassigned'
          ELSE NULL
        END
      );
  END CASE;

  RETURN NEW;
END;
$$;