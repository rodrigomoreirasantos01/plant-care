"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Droplet,
  Sun,
  Wind,
  Thermometer,
  Scissors,
  Leaf,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useNotifications,
  type NotificationItem,
} from "../contexts/notification-context";

const todoIcons: Record<string, React.ReactNode> = {
  watering: <Droplet className="h-4 w-4 text-blue-500" />,
  light: <Sun className="h-4 w-4 text-amber-500" />,
  humidity: <Wind className="h-4 w-4 text-cyan-500" />,
  temperature: <Thermometer className="h-4 w-4 text-orange-500" />,
  trimming: <Scissors className="h-4 w-4 text-orange-500" />,
  pruning: <Leaf className="h-4 w-4 text-emerald-500" />,
};

const alertIcons: Record<string, React.ReactNode> = {
  critical: <AlertTriangle className="h-4 w-4 text-red-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
};

function getIcon(notification: NotificationItem) {
  if (notification.type === "todo" && notification.todoType) {
    return todoIcons[notification.todoType] ?? <Bell className="h-4 w-4" />;
  }
  if (notification.type === "alert" && notification.severity) {
    return alertIcons[notification.severity] ?? <Bell className="h-4 w-4" />;
  }
  return <Bell className="h-4 w-4" />;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (willOpen) {
      markAllAsRead();
    }
  };

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const todoNotifications = notifications.filter((n) => n.type === "todo");
  const alertNotifications = notifications.filter((n) => n.type === "alert");

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={handleToggle}
      >
        <Bell className="h-4 w-4" />
        Alerts
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-1 animate-pulse">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          className="bg-card border-border absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border shadow-lg"
        >
          {/* Header */}
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <h4 className="text-sm font-semibold">Notifications</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <Bell className="text-muted-foreground/40 mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  No notifications
                </p>
              </div>
            ) : (
              <div className="divide-border divide-y">
                {/* Todo notifications */}
                {todoNotifications.length > 0 && (
                  <div className="px-4 py-3">
                    <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                      Tasks
                    </p>
                    <div className="space-y-1">
                      {todoNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="hover:bg-muted/50 flex items-start gap-3 rounded-md p-2 transition-colors"
                        >
                          <div className="mt-0.5 shrink-0">{getIcon(n)}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-muted-foreground truncate text-xs">
                              {n.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alert notifications */}
                {alertNotifications.length > 0 && (
                  <div className="px-4 py-3">
                    <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                      Alerts
                    </p>
                    <div className="space-y-1">
                      {alertNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 rounded-md p-2 transition-colors ${
                            n.severity === "critical"
                              ? "bg-red-500/10"
                              : n.severity === "warning"
                                ? "bg-amber-500/10"
                                : "bg-blue-500/10"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">{getIcon(n)}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{n.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
