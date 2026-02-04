import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplet, Sun } from "lucide-react";

interface TodayCardProps {
  needsWatering: boolean;
  nextWatering: string;
  lightRemaining: number;
}

const TodayToDoListCard = ({
  needsWatering,
  nextWatering,
  lightRemaining,
}: TodayCardProps) => {
  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Today</h3>

      <div className="mb-6 space-y-4">
        {/* Checklist item - Regar */}
        <div className="bg-muted/30 flex items-start gap-3 rounded-lg p-3">
          <Checkbox id="water" checked={!needsWatering} className="mt-1" />
          <div className="flex-1">
            <label
              htmlFor="water"
              className="flex cursor-pointer items-center gap-2"
            >
              <Droplet className="h-4 w-4 text-blue-500" />
              <span
                className={
                  needsWatering
                    ? "text-foreground"
                    : "text-muted-foreground line-through"
                }
              >
                Water plant
              </span>
            </label>
            <p className="text-muted-foreground mt-1 text-xs">
              {needsWatering
                ? "Needed today"
                : `Next watering: ${nextWatering}`}
            </p>
          </div>
        </div>

        {/* Info - Luz */}
        <div className="bg-muted/30 flex items-start gap-3 rounded-lg p-3">
          <Sun className="mt-1 h-4 w-4 text-amber-500" />
          <div className="flex-1">
            <div className="font-medium">Light goal</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {lightRemaining}h remaining to reach daily goal
            </p>
          </div>
        </div>
      </div>

      <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
        Log action
      </Button>
    </Card>
  );
};

export default TodayToDoListCard;
