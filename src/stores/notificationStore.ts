import { create } from 'zustand';
import { notificationApi } from '../services/api/notifications';
import type { Notification, NotificationType } from '../types/notification';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getFilteredNotifications: (type?: NotificationType) => Notification[];
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await notificationApi.getAll();
      const unreadCount = notifications.filter(n => !n.read_at).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
      set({ error: message, isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      const notifications = get().notifications.map(n =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      );
      const unreadCount = notifications.filter(n => !n.read_at).length;
      set({ notifications, unreadCount });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark notification as read';
      set({ error: message });
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      const notifications = get().notifications.map(n => ({
        ...n,
        read_at: n.read_at || new Date().toISOString()
      }));
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      set({ error: message });
      throw error;
    }
  },

  getFilteredNotifications: (type?: NotificationType) => {
    const { notifications } = get();
    return type ? notifications.filter(n => n.type === type) : notifications;
  }
}));