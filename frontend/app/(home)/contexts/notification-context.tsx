"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export interface NotificationItem {
  id: string;
  type: "todo" | "alert";
  title: string;
  description: string;
  severity?: "critical" | "warning" | "info";
  todoType?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  setTodoNotifications: (items: NotificationItem[]) => void;
  setAlertNotifications: (items: NotificationItem[]) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [todoItems, setTodoItems] = useState<NotificationItem[]>([]);
  const [alertItems, setAlertItems] = useState<NotificationItem[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(
    () => [...todoItems, ...alertItems],
    [todoItems, alertItems],
  );

  const unreadCount = notifications.filter((n) => !seenIds.has(n.id)).length;

  const setTodoNotifications = useCallback((items: NotificationItem[]) => {
    setTodoItems((prev) => {
      const newIds = new Set(items.map((i) => i.id));
      const removedIds = prev.filter((p) => !newIds.has(p.id)).map((p) => p.id);

      if (removedIds.length > 0) {
        setSeenIds((prevSeen) => {
          const next = new Set(prevSeen);
          for (const id of removedIds) next.delete(id);
          return next;
        });
      }

      return items;
    });
  }, []);

  const setAlertNotifications = useCallback((items: NotificationItem[]) => {
    setAlertItems((prev) => {
      const newIds = new Set(items.map((i) => i.id));
      const removedIds = prev.filter((p) => !newIds.has(p.id)).map((p) => p.id);

      if (removedIds.length > 0) {
        setSeenIds((prevSeen) => {
          const next = new Set(prevSeen);
          for (const id of removedIds) next.delete(id);
          return next;
        });
      }

      return items;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setSeenIds(new Set(notifications.map((n) => n.id)));
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      setTodoNotifications,
      setAlertNotifications,
      markAllAsRead,
    }),
    [
      notifications,
      unreadCount,
      setTodoNotifications,
      setAlertNotifications,
      markAllAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
