import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";

interface CycleCardProps {
  phase: "vegetative" | "flowering" | "fruiting";
  progress: number;
  nextMilestone: string;
}

const GrowCycleCard = ({ phase, progress, nextMilestone }: CycleCardProps) => {
  const phaseConfig = {
    vegetative: { label: "Vegetative", color: "text-green-600" },
    flowering: { label: "Flowering", color: "text-purple-600" },
    fruiting: { label: "Fruiting", color: "text-orange-600" },
  };

  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Growth Cycle</h3>
        <Badge
          variant="outline"
          className={`${phaseConfig[phase].color} border-current`}
        >
          {phaseConfig[phase].label}
        </Badge>
      </div>

      <div className="space-y-3">
        <Progress value={progress} className="h-2" />
        <p className="text-muted-foreground text-sm">{nextMilestone}</p>
      </div>
    </Card>
  );
};

export default GrowCycleCard;
