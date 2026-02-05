import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Droplet,
  Sun,
  Thermometer,
  RotateCw,
  Scissors,
  FileEdit,
} from "lucide-react";
import MetricItem from "./metrics-item-card";

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
}

const PlantCard = ({
  name,
  status,
  statusMessage,
  illustration,
  metrics,
}: PlantCardProps) => {
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

  return (
    <Card className="bg-card border-border p-8 shadow-sm">
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

      {/* Ações rápidas */}
      <div className="flex gap-3">
        <Button variant="secondary" size="sm" className="gap-2">
          <Droplet className="h-4 w-4" />
          Watered
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <RotateCw className="h-4 w-4" />
          Rotated pot
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <Scissors className="h-4 w-4" />
          Prune
        </Button>
        <Button variant="secondary" size="sm" className="gap-2">
          <FileEdit className="h-4 w-4" />
          Add note
        </Button>
      </div>
    </Card>
  );
};

export default PlantCard;
