import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { NotificationSeverity } from '../../types/notification';

interface NotificationIconProps {
  severity: NotificationSeverity;
  className?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ severity, className = 'h-5 w-5' }) => {
  switch (severity) {
    case 'critical':
      return <AlertCircle className={`${className} text-red-500`} />;
    case 'warning':
      return <AlertTriangle className={`${className} text-yellow-500`} />;
    default:
      return <Info className={`${className} text-blue-500`} />;
  }
};