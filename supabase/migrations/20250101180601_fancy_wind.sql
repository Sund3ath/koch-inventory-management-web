-- Create function to get device metrics
CREATE OR REPLACE FUNCTION get_device_metrics(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_devices', COUNT(*),
    'active_devices', COUNT(*) FILTER (WHERE status = 'available' OR status = 'assigned'),
    'by_type', (
      SELECT jsonb_object_agg(type, count)
      FROM (
        SELECT type, COUNT(*) as count
        FROM devices
        GROUP BY type
      ) t
    ),
    'by_status', (
      SELECT jsonb_object_agg(status, count)
      FROM (
        SELECT status, COUNT(*) as count
        FROM devices
        GROUP BY status
      ) s
    ),
    'recent_assignments', (
      SELECT COUNT(*)
      FROM device_assignments
      WHERE assigned_at BETWEEN p_start_date AND p_end_date
    )
  )
  INTO v_result
  FROM devices;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get license metrics
CREATE OR REPLACE FUNCTION get_license_metrics(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_licenses', COUNT(*),
    'active_licenses', COUNT(*) FILTER (WHERE status = 'active'),
    'expiring_soon', (
      SELECT COUNT(*)
      FROM licenses
      WHERE expiration_date <= CURRENT_DATE + INTERVAL '30 days'
      AND expiration_date > CURRENT_DATE
    ),
    'total_cost', COALESCE(SUM(cost), 0),
    'utilization', (
      SELECT COALESCE(
        (COUNT(DISTINCT la.id)::FLOAT / NULLIF(SUM(l.total_quantity), 0) * 100)::INTEGER,
        0
      )
      FROM licenses l
      LEFT JOIN license_assignments la ON l.id = la.license_id
      WHERE la.status = 'active'
    )
  )
  INTO v_result
  FROM licenses;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get employee metrics
CREATE OR REPLACE FUNCTION get_employee_metrics(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_employees', COUNT(*),
    'active_employees', COUNT(*) FILTER (WHERE status = 'active'),
    'by_department', (
      SELECT jsonb_object_agg(d.name, count)
      FROM (
        SELECT department_id, COUNT(*) as count
        FROM employees
        WHERE status = 'active'
        GROUP BY department_id
      ) e
      JOIN departments d ON e.department_id = d.id
    ),
    'new_hires', (
      SELECT COUNT(*)
      FROM employees
      WHERE hire_date BETWEEN p_start_date AND p_end_date
    ),
    'device_allocation', (
      SELECT (COUNT(DISTINCT da.device_id)::FLOAT / NULLIF(COUNT(DISTINCT e.id), 0))::INTEGER
      FROM employees e
      LEFT JOIN device_assignments da ON e.id = da.employee_id
      WHERE da.status = 'active'
    )
  )
  INTO v_result
  FROM employees;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get department metrics
CREATE OR REPLACE FUNCTION get_department_metrics(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_departments', COUNT(*),
    'active_departments', COUNT(*) FILTER (WHERE status = 'active'),
    'avg_team_size', (
      SELECT (AVG(emp_count))::INTEGER
      FROM (
        SELECT d.id, COUNT(e.id) as emp_count
        FROM departments d
        LEFT JOIN employees e ON d.id = e.department_id
        WHERE e.status = 'active'
        GROUP BY d.id
      ) t
    ),
    'device_distribution', (
      SELECT jsonb_object_agg(d.name, device_count)
      FROM (
        SELECT e.department_id, COUNT(da.device_id) as device_count
        FROM employees e
        LEFT JOIN device_assignments da ON e.id = da.employee_id
        WHERE da.status = 'active'
        GROUP BY e.department_id
      ) t
      JOIN departments d ON t.department_id = d.id
    )
  )
  INTO v_result
  FROM departments;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create main dashboard metrics function
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'devices', get_device_metrics(p_start_date, p_end_date),
    'licenses', get_license_metrics(p_start_date, p_end_date),
    'employees', get_employee_metrics(p_start_date, p_end_date),
    'departments', get_department_metrics(p_start_date, p_end_date),
    'generated_at', CURRENT_TIMESTAMP
  )
  INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_dashboard_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_device_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_license_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_employee_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_department_metrics TO authenticated;