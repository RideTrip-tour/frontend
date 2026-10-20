import { create } from 'zustand';

export type NotificationItem = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type NotificationsState = {
  items: NotificationItem[];
  setItems: (items: NotificationItem[]) => void;
  addItem: (item: NotificationItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'info',
    title: 'Новый тур',
    message: 'Доступен новый тур в Алматы',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    title: 'Изменение расписания',
    message: 'Рейс перенесен на 2 часа позже',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const useNotificationsStore = create<NotificationsState>((set) => ({
  items: MOCK_NOTIFICATIONS,

  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  markAsRead: (id) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, read: true })),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => set({ items: [] }),
}));

export const selectUnreadCount = (state: NotificationsState) =>
  state.items.filter((item) => !item.read).length;
