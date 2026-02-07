"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Droplet,
  Sun,
  Wind,
  Thermometer,
  Scissors,
  Leaf,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type TodoType =
  | "watering"
  | "light"
  | "humidity"
  | "temperature"
  | "trimming"
  | "pruning";

interface TodoItem {
  id: TodoType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface Metric {
  value: number;
  ideal: string;
}

interface Metrics {
  soilMoisture: Metric;
  lightToday: Metric;
  temperature: Metric;
}

interface NowData {
  airHumidity?: number;
  humidityIdeal?: { min: number; max: number };
  lightToday?: number;
  lightGoal?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TodayData extends Record<string, any> {
  logged?: Record<string, boolean>;
  needsTrimming?: boolean;
  needsPruning?: boolean;
}

interface TodayCardProps {
  plantId: string;
  metrics: Metrics;
  now: NowData;
  today: TodayData;
  onTodoCompleted?: () => void;
}

function parseIdeal(
  ideal: string,
): { min: number; max: number } | { goal: number } | null {
  if (!ideal) return null;

  // Extract all numbers from the string (handles decimals too)
  const numbers = ideal.match(/[\d.]+/g);
  if (!numbers) return null;

  if (numbers.length >= 2) {
    return { min: parseFloat(numbers[0]), max: parseFloat(numbers[1]) };
  }
  if (numbers.length === 1) {
    return { goal: parseFloat(numbers[0]) };
  }

  return null;
}

function isRange(
  parsed: { min: number; max: number } | { goal: number },
): parsed is { min: number; max: number } {
  return "min" in parsed;
}

function buildTodos(
  metrics: Metrics,
  now: NowData,
  today: TodayData,
): TodoItem[] {
  const todos: TodoItem[] = [];

  // --- Soil Moisture ---
  const soilIdeal = parseIdeal(metrics.soilMoisture.ideal);
  const soilVal = Number(metrics.soilMoisture.value);

  if (soilIdeal && !isNaN(soilVal)) {
    if (isRange(soilIdeal)) {
      if (soilVal < soilIdeal.min) {
        todos.push({
          id: "watering",
          label: "Water plant",
          description: `Soil at ${soilVal}% — below ideal (${metrics.soilMoisture.ideal})`,
          icon: <Droplet className="h-4 w-4 text-blue-500" />,
        });
      } else if (soilVal > soilIdeal.max) {
        todos.push({
          id: "watering",
          label: "Reduce watering",
          description: `Soil at ${soilVal}% — above ideal (${metrics.soilMoisture.ideal})`,
          icon: <Droplet className="h-4 w-4 text-blue-500" />,
        });
      }
    } else if (soilVal < soilIdeal.goal) {
      todos.push({
        id: "watering",
        label: "Water plant",
        description: `Soil at ${soilVal}% — below ideal (${metrics.soilMoisture.ideal})`,
        icon: <Droplet className="h-4 w-4 text-blue-500" />,
      });
    }
  }

  // --- Light ---
  const lightIdeal = parseIdeal(metrics.lightToday.ideal);
  const lightVal = Number(metrics.lightToday.value);

  if (lightIdeal && !isNaN(lightVal)) {
    if (isRange(lightIdeal)) {
      if (lightVal < lightIdeal.min) {
        const remaining = lightIdeal.min - lightVal;
        todos.push({
          id: "light",
          label: "Light goal",
          description: `${remaining}h remaining — currently ${lightVal}h (ideal: ${metrics.lightToday.ideal})`,
          icon: <Sun className="h-4 w-4 text-amber-500" />,
        });
      } else if (lightVal > lightIdeal.max) {
        todos.push({
          id: "light",
          label: "Reduce light exposure",
          description: `${lightVal}h today — above ideal (${metrics.lightToday.ideal})`,
          icon: <Sun className="h-4 w-4 text-amber-500" />,
        });
      }
    } else if (lightVal < lightIdeal.goal) {
      const remaining = lightIdeal.goal - lightVal;
      todos.push({
        id: "light",
        label: "Light goal",
        description: `${remaining}h remaining — currently ${lightVal}h (ideal: ${metrics.lightToday.ideal})`,
        icon: <Sun className="h-4 w-4 text-amber-500" />,
      });
    }
  }

  // --- Temperature ---
  const tempIdeal = parseIdeal(metrics.temperature.ideal);
  const tempVal = Number(metrics.temperature.value);

  if (tempIdeal && !isNaN(tempVal)) {
    if (isRange(tempIdeal)) {
      if (tempVal < tempIdeal.min) {
        todos.push({
          id: "temperature",
          label: "Increase temperature",
          description: `Currently ${tempVal}°C — below ideal (${metrics.temperature.ideal})`,
          icon: <Thermometer className="h-4 w-4 text-orange-500" />,
        });
      } else if (tempVal > tempIdeal.max) {
        todos.push({
          id: "temperature",
          label: "Reduce temperature",
          description: `Currently ${tempVal}°C — above ideal (${metrics.temperature.ideal})`,
          icon: <Thermometer className="h-4 w-4 text-orange-500" />,
        });
      }
    } else {
      if (tempVal < tempIdeal.goal) {
        todos.push({
          id: "temperature",
          label: "Increase temperature",
          description: `Currently ${tempVal}°C — below ideal (${metrics.temperature.ideal})`,
          icon: <Thermometer className="h-4 w-4 text-orange-500" />,
        });
      } else if (tempVal > tempIdeal.goal) {
        todos.push({
          id: "temperature",
          label: "Reduce temperature",
          description: `Currently ${tempVal}°C — above ideal (${metrics.temperature.ideal})`,
          icon: <Thermometer className="h-4 w-4 text-orange-500" />,
        });
      }
    }
  }

  // --- Humidity (from `now` data, not in metrics) ---
  const humidityVal = Number(now.airHumidity);
  const humidIdeal = now.humidityIdeal;

  if (humidIdeal && !isNaN(humidityVal)) {
    if (humidityVal < humidIdeal.min) {
      todos.push({
        id: "humidity",
        label: "Increase humidity",
        description: `Currently ${humidityVal}% — below ideal (${humidIdeal.min}–${humidIdeal.max}%)`,
        icon: <Wind className="h-4 w-4 text-cyan-500" />,
      });
    } else if (humidityVal > humidIdeal.max) {
      todos.push({
        id: "humidity",
        label: "Reduce humidity",
        description: `Currently ${humidityVal}% — above ideal (${humidIdeal.min}–${humidIdeal.max}%)`,
        icon: <Wind className="h-4 w-4 text-cyan-500" />,
      });
    }
  }

  // --- Trimming (manual flag) ---
  if (today.needsTrimming) {
    todos.push({
      id: "trimming",
      label: "Trim plant",
      description: "Remove dead or overgrown branches",
      icon: <Scissors className="h-4 w-4 text-orange-500" />,
    });
  }

  // --- Pruning (manual flag) ---
  if (today.needsPruning) {
    todos.push({
      id: "pruning",
      label: "Prune plant",
      description: "Prune lower leaves for better air circulation",
      icon: <Leaf className="h-4 w-4 text-emerald-500" />,
    });
  }

  return todos;
}

const MANUAL_TODO_TYPES: TodoType[] = ["trimming", "pruning"];

const TodayToDoListCard = ({
  plantId,
  metrics,
  now,
  today,
  onTodoCompleted,
}: TodayCardProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<TodoType>>(new Set());
  const [submittedItems, setSubmittedItems] = useState<Set<TodoType>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metricsFingerprint = `${metrics.soilMoisture.value}|${metrics.lightToday.value}|${metrics.temperature.value}|${now.airHumidity}`;
  const prevFingerprint = useRef(metricsFingerprint);

  useEffect(() => {
    if (prevFingerprint.current !== metricsFingerprint) {
      prevFingerprint.current = metricsFingerprint;
      setSubmittedItems(new Set());
    }
  }, [metricsFingerprint]);

  const logged = today.logged ?? {};

  const allTodos = buildTodos(metrics, now, today);

  const activeTodos = allTodos.filter((t) => {
    if (submittedItems.has(t.id)) return false;
    if (MANUAL_TODO_TYPES.includes(t.id)) return !logged[t.id];
    return true;
  });
  const doneTodos = allTodos.filter((t) => {
    if (submittedItems.has(t.id)) return true;
    if (MANUAL_TODO_TYPES.includes(t.id)) return !!logged[t.id];
    return false;
  });

  const handleCheck = (id: TodoType, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (checkedItems.size === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/plants/todo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId,
          completedTodos: Array.from(checkedItems),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to log todos:", res.status, errorData);
        return;
      }
      setSubmittedItems((prev) => new Set([...prev, ...checkedItems]));
      setCheckedItems(new Set());
      onTodoCompleted?.();
    } catch (error) {
      console.error("Error logging todos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nothingToDo = allTodos.length === 0;
  const allLogged = allTodos.length > 0 && activeTodos.length === 0;
  const hasChecked = checkedItems.size > 0;

  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Today</h3>
        {!nothingToDo && (
          <Badge variant={allLogged ? "default" : "secondary"}>
            {doneTodos.length}/{allTodos.length}
          </Badge>
        )}
      </div>

      {nothingToDo ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
          <p className="text-foreground font-medium">All caught up!</p>
          <p className="text-muted-foreground mt-1 text-sm">
            All values are within ideal range. Your plant is happy!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active todos — not yet logged */}
          {activeTodos.map((todo) => (
            <div
              key={todo.id}
              className="bg-muted/30 hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors"
            >
              <div className="mt-0.5">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={checkedItems.has(todo.id)}
                  onCheckedChange={(checked) =>
                    handleCheck(todo.id, checked === true)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <Label
                htmlFor={`todo-${todo.id}`}
                className="flex flex-1 cursor-pointer flex-col gap-1 font-normal"
              >
                <span className="flex items-center gap-2">
                  {todo.icon}
                  <span className="text-foreground">{todo.label}</span>
                </span>
                <span className="text-muted-foreground text-xs">
                  {todo.description}
                </span>
              </Label>
            </div>
          ))}

          {/* Already logged todos */}
          {doneTodos.map((todo) => (
            <div
              key={todo.id}
              className="bg-muted/30 flex items-start gap-3 rounded-lg p-3 opacity-60"
            >
              <div className="mt-0.5">
                <Checkbox id={`todo-done-${todo.id}`} checked disabled />
              </div>

              <Label
                htmlFor={`todo-done-${todo.id}`}
                className="flex flex-1 flex-col gap-1 font-normal"
              >
                <span className="flex items-center gap-2">
                  {todo.icon}
                  <span className="text-muted-foreground line-through">
                    {todo.label}
                  </span>
                </span>
                <span className="text-muted-foreground text-xs">Done!</span>
              </Label>
            </div>
          ))}

          {/* All logged banner */}
          {allLogged && (
            <Badge
              variant="outline"
              className="mt-2 flex w-full items-center justify-center gap-2 border-emerald-500/30 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-600"
            >
              <CheckCircle2 className="h-4 w-4" />
              All tasks completed for today!
            </Badge>
          )}

          {/* Log action button */}
          {!allLogged && (
            <Button
              onClick={handleSubmit}
              disabled={!hasChecked || isSubmitting}
              className="mt-3 w-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging...
                </>
              ) : (
                `Log action${checkedItems.size > 1 ? "s" : ""}${checkedItems.size > 0 ? ` (${checkedItems.size})` : ""}`
              )}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default TodayToDoListCard;
