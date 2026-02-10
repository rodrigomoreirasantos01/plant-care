import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Droplet, Sun, Thermometer, Wind } from "lucide-react";

interface NowCardProps {
  metrics: {
    soilMoisture: { value: number; ideal: string };
    lightToday: { value: number; ideal: string };
    temperature: { value: number; ideal: string };
  };
  now: {
    soilMoistureIdeal: { min: number; max: number };
    lightGoal: number;
    airHumidity: number;
  };
}

const NowCard = ({ metrics, now }: NowCardProps) => {
  const soilMoisture = metrics.soilMoisture.value;
  const soilMoistureIdeal = now.soilMoistureIdeal;
  const lightToday = metrics.lightToday.value;
  const lightGoal = now.lightGoal;
  const temperature = metrics.temperature.value;
  const airHumidity = now.airHumidity;

  const lightProgress = lightGoal > 0 ? (lightToday / lightGoal) * 100 : 0;

  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Right Now</h3>

      <div className="space-y-5">
        {/* Umidade do solo */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span>Soil moisture</span>
            </div>
            <span className="text-sm font-semibold">{soilMoisture}%</span>
          </div>
          <div className="relative">
            <Progress value={soilMoisture} className="h-2" />
            <div
              style={{
                left: `${soilMoistureIdeal.min}%`,
                width: `${soilMoistureIdeal.max - soilMoistureIdeal.min}%`,
              }}
            />
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Ideal: {soilMoistureIdeal.min}–{soilMoistureIdeal.max}%
          </p>
        </div>

        {/* Luz hoje */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light today</span>
            </div>
            <span className="text-sm font-semibold">
              {lightToday}h / {lightGoal}h
            </span>
          </div>
          <Progress value={lightProgress} className="h-2" />
        </div>

        {/* Temperatura e Umidade do ar */}
        <div className="flex gap-3">
          <Badge variant="outline" className="flex-1 justify-center gap-2 py-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            {temperature}°C
          </Badge>
          <Badge variant="outline" className="flex-1 justify-center gap-2 py-2">
            <Wind className="h-4 w-4 text-cyan-500" />
            {airHumidity}%
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default NowCard;
