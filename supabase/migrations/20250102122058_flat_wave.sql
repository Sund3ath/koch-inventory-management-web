-- Create function to handle license notifications
CREATE OR REPLACE FUNCTION handle_license_notifications()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_title TEXT;
  v_message TEXT;
  v_severity TEXT;
  v_total_seats INT;
  v_used_seats INT;
BEGIN
  -- Get the user who made the change
  v_user_id := auth.uid();

  -- Calculate license utilization
  SELECT 
    l.total_quantity,
    COUNT(la.id)
  INTO v_total_seats, v_used_seats
  FROM licenses l
  LEFT JOIN license_assignments la ON l.id = la.license_id
  WHERE l.id = NEW.id
  GROUP BY l.id, l.total_quantity;

  -- Handle different cases
  CASE
    -- New license added
    WHEN TG_OP = 'INSERT' THEN
      v_title := 'New License Added';
      v_message := format('New license added: %s (%s)', NEW.name, NEW.vendor);
      v_severity := 'info';

    -- License expiring soon
    WHEN TG_OP = 'UPDATE' AND 
         NEW.expiration_date IS NOT NULL AND 
         NEW.expiration_date <= CURRENT_DATE + INTERVAL '30 days' AND
         NEW.expiration_date > CURRENT_DATE THEN
      v_title := 'License Expiring Soon';
      v_message := format('License %s will expire on %s', NEW.name, NEW.expiration_date);
      v_severity := 'warning';

    -- License threshold reached
    WHEN v_used_seats >= v_total_seats * 0.8 THEN
      v_title := 'License Threshold Reached';
      v_message := format('License %s has reached %s%% utilization', 
        NEW.name, (v_used_seats::float / v_total_seats * 100)::int);
      v_severity := 'warning';

    ELSE
      RETURN NEW;
  END CASE;

  -- Create notification
  PERFORM create_notification(
    v_user_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'license_added'
      WHEN NEW.expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'license_expiring'
      ELSE 'license_threshold'
    END,
    v_title,
    v_message,
    v_severity
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for license notifications
DROP TRIGGER IF EXISTS on_license_change ON licenses;
CREATE TRIGGER on_license_change
  AFTER INSERT OR UPDATE ON licenses
  FOR EACH ROW
  EXECUTE FUNCTION handle_license_notifications();