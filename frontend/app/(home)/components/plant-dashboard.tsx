"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useNotifications } from "../contexts/notification-context";
import PlantCard from "./plant-card";
import TodayToDoListCard from "./today-todo-list-card";
import GrowCycleCard from "./grow-cycle-card";
import { AlertsCard, type Alert } from "./alert-card";
import NowCard from "./now-card";
import { GuideCard } from "./guide-card";
import TrendCard from "./trend-card";
import EmptyState from "./empty-state";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NOTES_STORAGE_KEY = "plantcare-user-notes";

function loadUserNotes(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUserNotes(notes: Record<string, string[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

interface PlantDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plants: any[];
  userName?: string;
  pollingInterval?: number;
}

interface MetricCheck {
  key: string;
  label: string;
  currentValue: number;
  minIdeal: number;
  maxIdeal: number | null;
}

interface AlertResult {
  severity: "critical" | "warning" | "info";
  direction: "low" | "high";
}
function getAlertResult(
  currentValue: number,
  minIdeal: number,
  maxIdeal: number | null,
): AlertResult | null {
  const value = Number(currentValue);
  const min = Number(minIdeal);
  const max = maxIdeal !== null ? Number(maxIdeal) : null;

  if (isNaN(value) || isNaN(min)) return null;

  if (min > 0 && value < min) {
    const deficit = (min - value) / min;
    if (deficit < 0.1) return null;
    if (deficit >= 0.7) return { severity: "critical", direction: "low" };
    if (deficit >= 0.5) return { severity: "warning", direction: "low" };
    return { severity: "info", direction: "low" };
  }

  if (max !== null && !isNaN(max) && max > 0 && value > max) {
    const excess = (value - max) / max;
    if (excess < 0.1) return null; // within 10% margin — OK
    if (excess >= 0.7) return { severity: "critical", direction: "high" };
    if (excess >= 0.5) return { severity: "warning", direction: "high" };
    return { severity: "info", direction: "high" };
  }

  // Value is within the ideal range — no alert
  return null;
}

function buildAlertMessage(
  label: string,
  severity: "critical" | "warning" | "info",
  direction: "low" | "high",
): string {
  const labels = {
    low: {
      info: "is slightly below ideal",
      warning: "is significantly below ideal",
      critical: "is critically low",
    },
    high: {
      info: "is slightly above ideal",
      warning: "is significantly above ideal",
      critical: "is critically high",
    },
  };

  return `${label} ${labels[direction][severity]}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseNow(plant: any): Record<string, any> | null {
  if (!plant?.now) return null;
  const now = typeof plant.now === "string" ? JSON.parse(plant.now) : plant.now;

  if (typeof now.soilMoistureIdeal === "string") {
    now.soilMoistureIdeal = JSON.parse(now.soilMoistureIdeal);
  }
  if (typeof now.temperatureIdeal === "string") {
    now.temperatureIdeal = JSON.parse(now.temperatureIdeal);
  }
  if (typeof now.humidityIdeal === "string") {
    now.humidityIdeal = JSON.parse(now.humidityIdeal);
  }

  return now;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateAlertsFromMetrics(plant: any): Alert[] {
  const now = parseNow(plant);
  const metrics =
    typeof plant?.metrics === "string"
      ? JSON.parse(plant.metrics)
      : plant?.metrics;

  if (!now && !metrics) return [];

  const alerts: Alert[] = [];
  const timestamp = new Date();

  const metricsToCheck: MetricCheck[] = [];

  if (metrics?.soilMoisture) {
    metricsToCheck.push({
      key: "soil-moisture",
      label: "Soil moisture",
      currentValue: Number(metrics.soilMoisture.value ?? 0),
      minIdeal: Number(now?.soilMoistureIdeal?.min ?? 0),
      maxIdeal: Number(now?.soilMoistureIdeal?.max ?? 0) || null,
    });
  }

  if (metrics?.lightToday) {
    metricsToCheck.push({
      key: "light-today",
      label: "Light today",
      currentValue: Number(metrics.lightToday.value ?? 0),
      minIdeal: Number(now?.lightGoal ?? 0),
      maxIdeal: null, // light has no upper limit
    });
  }
  if (metrics?.temperature) {
    metricsToCheck.push({
      key: "temperature",
      label: "Temperature",
      currentValue: Number(metrics.temperature.value ?? 0),
      minIdeal: Number(now?.temperatureIdeal?.min ?? 0),
      maxIdeal: Number(now?.temperatureIdeal?.max ?? 0) || null,
    });
  }
  if (now?.airHumidity != null && now?.humidityIdeal) {
    metricsToCheck.push({
      key: "air-humidity",
      label: "Air humidity",
      currentValue: Number(now.airHumidity ?? 0),
      minIdeal: Number(now.humidityIdeal?.min ?? 0),
      maxIdeal: Number(now.humidityIdeal?.max ?? 0) || null,
    });
  }

  for (const metric of metricsToCheck) {
    const result = getAlertResult(
      metric.currentValue,
      metric.minIdeal,
      metric.maxIdeal,
    );
    if (result) {
      alerts.push({
        id: `${metric.key}-${result.direction}-${result.severity}-${timestamp.getTime()}`,
        severity: result.severity,
        message: buildAlertMessage(
          metric.label,
          result.severity,
          result.direction,
        ),
        date: timestamp,
      });
    }
  }

  // Sort: critical first, then warning, then info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}

const PlantDashboard = ({
  plants: initialPlants,
  userName,
  pollingInterval = 5000,
}: PlantDashboardProps) => {
  const { setAlertNotifications } = useNotifications();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plants, setPlants] = useState<any[]>(initialPlants);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userNotesMap, setUserNotesMap] = useState<Record<string, string[]>>(
    {},
  );

  useEffect(() => {
    setUserNotesMap(loadUserNotes());
  }, []);

  const plant = plants[selectedIndex] ?? null;
  const plantId: string = plant?.plantId ?? "";
  const currentUserNotes = userNotesMap[plantId] ?? [];

  const handleToggleNote = useCallback(
    (note: string) => {
      setUserNotesMap((prev) => {
        const existing = prev[plantId] ?? [];
        const updated = existing.includes(note)
          ? existing.filter((n) => n !== note)
          : [...existing, note];
        const next = { ...prev, [plantId]: updated };
        saveUserNotes(next);
        return next;
      });
    },
    [plantId],
  );

  const handleRemoveNote = useCallback(
    (note: string) => {
      setUserNotesMap((prev) => {
        const existing = prev[plantId] ?? [];
        const updated = existing.filter((n) => n !== note);
        const next = { ...prev, [plantId]: updated };
        saveUserNotes(next);
        return next;
      });
    },
    [plantId],
  );

  const initialAlerts = plant ? generateAlertsFromMetrics(plant) : [];
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>(initialAlerts);
  const [alertHistory, setAlertHistory] = useState<Alert[]>(initialAlerts);
  const prevSnapshotRef = useRef<string>(
    initialAlerts
      .map((a) => `${a.message}|${a.severity}`)
      .sort()
      .join(";"),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAlerts = useCallback((plantData: any) => {
    if (!plantData) return;

    const alerts = generateAlertsFromMetrics(plantData);
    setCurrentAlerts(alerts);

    if (alerts.length === 0) return;

    const snapshot = alerts
      .map((a) => `${a.message}|${a.severity}`)
      .sort()
      .join(";");

    if (snapshot === prevSnapshotRef.current) return;
    prevSnapshotRef.current = snapshot;

    setAlertHistory((prev) => {
      const currentMetricKeys = new Set(
        alerts.map((a) => a.id.split("-").slice(0, -2).join("-")),
      );

      const filtered = prev.filter((existing) => {
        const existingKey = existing.id.split("-").slice(0, -2).join("-");
        return !currentMetricKeys.has(existingKey);
      });

      const merged = [...alerts, ...filtered].sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );

      return merged.slice(0, 20);
    });
  }, []);

  const fetchPlants = useCallback(async () => {
    try {
      const res = await fetch("/api/plants");
      if (!res.ok) return;

      const data = await res.json();
      const updatedPlants = data.plants ?? [];
      setPlants(updatedPlants);

      const currentPlant = updatedPlants[selectedIndex] ?? null;
      updateAlerts(currentPlant);
    } catch (error) {
      console.error("Error polling plants:", error);
    }
  }, [updateAlerts, selectedIndex]);

  useEffect(() => {
    const interval = setInterval(fetchPlants, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchPlants, pollingInterval]);

  useEffect(() => {
    if (plant) {
      const alerts = generateAlertsFromMetrics(plant);
      setCurrentAlerts(alerts);
      setAlertHistory(alerts);
      prevSnapshotRef.current = alerts
        .map((a) => `${a.message}|${a.severity}`)
        .sort()
        .join(";");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  // Push alert notifications to the notification context
  const alertNotifFingerprint = currentAlerts
    .map((a) => a.id.replace(/-\d+$/, ""))
    .sort()
    .join(",");

  useEffect(() => {
    setAlertNotifications(
      currentAlerts.map((a) => ({
        id: `alert-${a.id.replace(/-\d+$/, "")}`,
        type: "alert" as const,
        title: a.message,
        description: a.severity.charAt(0).toUpperCase() + a.severity.slice(1),
        severity: a.severity,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertNotifFingerprint, setAlertNotifications]);

  if (plants.length === 0) {
    return <EmptyState onPlantAdded={fetchPlants} userName={userName} />;
  }

  return (
    <div className="space-y-6">
      {plants.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setSelectedIndex((i) => (i === 0 ? plants.length - 1 : i - 1))
            }
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {plants.map((p, i) => (
              <Button
                key={p.plantId ?? i}
                variant={i === selectedIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedIndex(i)}
                className="gap-2"
              >
                <span>{p.illustration ?? "🌱"}</span>
                <span>{p.name}</span>
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setSelectedIndex((i) => (i === plants.length - 1 ? 0 : i + 1))
            }
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-6">
          <PlantCard
            name={plant.name}
            status={plant.status}
            statusMessage={plant.statusMessage}
            illustration={plant.illustration}
            metrics={plant.metrics}
            userNotes={currentUserNotes}
            onToggleNote={handleToggleNote}
          />

          <GrowCycleCard
            phase={plant.cycle.phase}
            progress={plant.cycle.progress}
            nextMilestone={plant.cycle.nextMilestone}
          />

          <TrendCard
            moistureData={plant.trendMoisture}
            lightData={plant.trendLight}
          />
        </div>

        <div className="col-span-5 space-y-6">
          <TodayToDoListCard
            plantId={plant.plantId}
            metrics={plant.metrics}
            now={plant.now}
            today={plant.today}
            onTodoCompleted={fetchPlants}
          />

          <AlertsCard alerts={currentAlerts} alertHistory={alertHistory} />

          <NowCard
            metrics={plant.metrics}
            now={plant.now}
          />

          <GuideCard
            plantType={plant.guide.plantType}
            wateringInfo={plant.guide.wateringInfo}
            lightInfo={plant.guide.lightInfo}
            notes={plant.guide.notes}
            userNotes={currentUserNotes}
            onRemoveNote={handleRemoveNote}
          />
        </div>
      </div>
    </div>
  );
};

export default PlantDashboard;
