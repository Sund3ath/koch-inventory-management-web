export type NotificationType = 
  | 'device_added' 
  | 'device_removed' 
  | 'device_status_changed' 
  | 'device_maintenance'
  | 'employee_added' 
  | 'employee_updated' 
  | 'employee_removed'
  | 'license_expiring' 
  | 'license_added' 
  | 'license_renewed' 
  | 'license_threshold';

export type NotificationSeverity = 'info' | 'warning' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read_at: string | null;
  created_at: string;
}