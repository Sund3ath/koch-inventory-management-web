import React, { useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../../stores/notificationStore';
import { NotificationItem } from './NotificationItem';
import type { NotificationType } from '../../types/notification';

interface NotificationDropdownProps {
  onClose: () => void;
}

const FILTERS: { label: string; value: NotificationType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Devices', value: 'device_added' },
  { label: 'Employees', value: 'employee_added' },
  { label: 'Licenses', value: 'license_added' }
];

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<NotificationType | undefined>(undefined);
  const { notifications, markAllAsRead, getFilteredNotifications } = useNotificationStore();
  const filteredNotifications = getFilteredNotifications(filter);

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          <button
            onClick={() => markAllAsRead()}
            className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all as read
          </button>
        </div>

        <div className="flex space-x-2">
          {FILTERS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === value
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}