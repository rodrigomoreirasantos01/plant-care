"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  Droplet,
  Droplets,
  Sun,
  Thermometer,
  RotateCw,
  Scissors,
  FileEdit,
  Check,
  X,
  Leaf,
  Sprout,
  ArrowUpFromLine,
  Sparkles,
  Bug,
  Flame,
  CloudRain,
  TrendingDown,
  Flower2,
  Clock,
  Cloud,
  HeartPulse,
  ArrowUp,
  AlertTriangle,
  Shield,
} from "lucide-react";
import MetricItem from "./metrics-item-card";

export const PREDEFINED_PLANT_NOTES = [
  "Watered",
  "Rotated pot",
  "Pruned",
  "Leaves turning yellow",
  "New growth spotted",
  "Moved to a sunnier spot",
  "Repotted into larger container",
  "Added fertilizer",
  "Pest detected — treating",
  "Misted the leaves",
  "Soil feels too dry",
  "Soil feels too wet",
  "Leaves drooping",
  "Flowers starting to bloom",
  "Adjusted watering schedule",
  "Moved to a shadier spot",
  "Root check — healthy",
  "Added support stake",
  "Noticed brown leaf tips",
  "Applied neem oil treatment",
] as const;

export type PredefinedPlantNote = (typeof PREDEFINED_PLANT_NOTES)[number];

export const NOTE_ICONS: Record<string, LucideIcon> = {
  Watered: Droplet,
  "Rotated pot": RotateCw,
  Pruned: Scissors,
  "Leaves turning yellow": Leaf,
  "New growth spotted": Sprout,
  "Moved to a sunnier spot": Sun,
  "Repotted into larger container": ArrowUpFromLine,
  "Added fertilizer": Sparkles,
  "Pest detected — treating": Bug,
  "Misted the leaves": Droplets,
  "Soil feels too dry": Flame,
  "Soil feels too wet": CloudRain,
  "Leaves drooping": TrendingDown,
  "Flowers starting to bloom": Flower2,
  "Adjusted watering schedule": Clock,
  "Moved to a shadier spot": Cloud,
  "Root check — healthy": HeartPulse,
  "Added support stake": ArrowUp,
  "Noticed brown leaf tips": AlertTriangle,
  "Applied neem oil treatment": Shield,
};

interface PlantCardProps {
  name: string;
  status: "ok" | "attention" | "critical";
  statusMessage?: string;
  illustration?: string;
  metrics: {
    soilMoisture: { value: number; ideal: string };
    lightToday: { value: number; ideal: string };
    temperature: { value: number; ideal: string };
  };
  userNotes: string[];
  onToggleNote: (note: string) => void;
}

const PlantCard = ({
  name,
  status,
  statusMessage,
  illustration,
  metrics,
  userNotes,
  onToggleNote,
}: PlantCardProps) => {
  const [notesOpen, setNotesOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    if (!notesOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notesOpen]);

  const statusConfig = {
    ok: {
      label: "Healthy",
      className: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
    },
    attention: {
      label: "Attention",
      className: "bg-amber-500/20 text-amber-700 border-amber-500/30",
    },
    critical: {
      label: "Critical",
      className: "bg-red-500/20 text-red-700 border-red-500/30",
    },
  };

  const selectedCount = userNotes.length;

  return (
    <Card className="bg-card border-border relative p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <Badge className={`${statusConfig[status].className} mb-3`}>
            {statusConfig[status].label}
          </Badge>
          <h1 className="mb-2 text-3xl font-semibold">{name}</h1>
          <p className="text-muted-foreground">{statusMessage}</p>
        </div>

        {/* Ilustração da planta */}
        <div className="flex h-32 w-32 items-center justify-center text-6xl">
          {illustration}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="mb-8 grid grid-cols-3 gap-6">
        <MetricItem
          icon={<Droplet className="h-5 w-5" />}
          label="Soil moisture"
          value={`${metrics.soilMoisture.value}%`}
          ideal={metrics.soilMoisture.ideal}
          status={metrics.soilMoisture.value < 30 ? "critical" : "ok"}
        />
        <MetricItem
          icon={<Sun className="h-5 w-5" />}
          label="Light today"
          value={`${metrics.lightToday.value}h`}
          ideal={metrics.lightToday.ideal}
          status={metrics.lightToday.value < 5 ? "attention" : "ok"}
        />
        <MetricItem
          icon={<Thermometer className="h-5 w-5" />}
          label="Temperature"
          value={`${metrics.temperature.value}°C`}
          ideal={metrics.temperature.ideal}
          status="ok"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {userNotes.map((note) => {
          const Icon = NOTE_ICONS[note];
          return (
            <Button
              key={note}
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => onToggleNote(note)}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {note}
              <X className="h-3.5 w-3.5 opacity-60 transition-opacity hover:opacity-100" />
            </Button>
          );
        })}

        {/* Add note – always last */}
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={() => setNotesOpen((prev) => !prev)}
        >
          <FileEdit className="h-4 w-4" />
          Add note
        </Button>
      </div>

      {/* Notes picker dropdown */}
      {notesOpen && (
        <div
          ref={panelRef}
          className="border-border bg-card absolute top-full right-4 z-50 mt-2 w-[420px] rounded-xl border p-4 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Select notes</h4>
            <button
              onClick={() => setNotesOpen(false)}
              className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex max-h-[320px] flex-wrap gap-2 overflow-y-auto pr-1">
            {PREDEFINED_PLANT_NOTES.map((note) => {
              const isSelected = userNotes.includes(note);
              const Icon = NOTE_ICONS[note];
              return (
                <button
                  key={note}
                  onClick={() => onToggleNote(note)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    Icon && <Icon className="h-3 w-3" />
                  )}
                  {note}
                </button>
              );
            })}
          </div>

          {selectedCount > 0 && (
            <p className="text-muted-foreground mt-3 text-xs">
              {selectedCount} note{selectedCount !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PlantCard;
