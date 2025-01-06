import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotificationStore } from '../../stores/notificationStore';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead } = useNotificationStore();

  const getSeverityIcon = () => {
    switch (notification.severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityStyles = () => {
    const baseStyles = 'p-4 flex items-start space-x-3 transition-colors duration-200';
    if (notification.read_at) {
      return `${baseStyles} bg-white`;
    }
    switch (notification.severity) {
      case 'critical':
        return `${baseStyles} bg-red-50 hover:bg-red-100`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 hover:bg-yellow-100`;
      default:
        return `${baseStyles} bg-blue-50 hover:bg-blue-100`;
    }
  };

  return (
    <div
      className={getSeverityStyles()}
      onClick={() => !notification.read_at && markAsRead(notification.id)}
      role="button"
      tabIndex={0}
    >
      <div className="flex-shrink-0">{getSeverityIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
        <p className="mt-1 text-xs text-gray-400">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}