"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  date: Date;
}

interface AlertsCardProps {
  alerts: Alert[];
  alertHistory?: Alert[];
}

function formatAlertDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AlertsCard({ alerts, alertHistory = [] }: AlertsCardProps) {
  const [showAll, setShowAll] = useState(false);

  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      dateColor: "text-red-400",
    },
    warning: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      dateColor: "text-amber-400",
    },
    info: {
      icon: Info,
      color: "text-blue-600",
      bg: "bg-blue-50",
      dateColor: "text-blue-400",
    },
  };

  const historyAlerts = [...alertHistory].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
  const visibleAlerts = showAll ? historyAlerts.slice(0, 5) : alerts;
  const hasHistory = alertHistory.length > alerts.length;

  if (alerts.length === 0) {
    return (
      <Card className="bg-card border-border p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Alerts</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="mb-2 rounded-full bg-emerald-50 p-3">
            <Info className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-muted-foreground text-sm">
            All good! No alerts for your plant.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Alerts</h3>
        {hasHistory && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-sm text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                View all
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {visibleAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg p-3 ${config.bg}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{alert.message}</p>
                <p className={`mt-1 text-xs ${config.dateColor}`}>
                  {formatAlertDate(alert.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {showAll && historyAlerts.length > 5 && (
        <p className="text-muted-foreground mt-3 text-center text-xs">
          Showing last 5 of {historyAlerts.length} alerts
        </p>
      )}
    </Card>
  );
}
