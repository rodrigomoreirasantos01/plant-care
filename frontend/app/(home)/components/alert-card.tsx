import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
}

interface AlertsCardProps {
  alerts: Alert[];
}

export function AlertsCard({ alerts }: AlertsCardProps) {
  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    warning: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    info: {
      icon: Info,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  };

  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Alerts</h3>
        <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
          View all
        </a>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => {
          const Icon = severityConfig[alert.severity].icon;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg p-3 ${severityConfig[alert.severity].bg}`}
            >
              <Icon
                className={`mt-0.5 h-5 w-5 ${severityConfig[alert.severity].color}`}
              />
              <p className="flex-1 text-sm">{alert.message}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
