import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Droplet, Sun, Eye } from "lucide-react";

interface GuideCardProps {
  plantType: string;
  wateringInfo: string;
  lightInfo: string;
  notes: string;
}

export function GuideCard({
  plantType,
  wateringInfo,
  lightInfo,
  notes,
}: GuideCardProps) {
  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Quick Guide: {plantType}</h3>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Droplet className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
          <div>
            <div className="mb-1 text-sm font-medium">Watering</div>
            <p className="text-muted-foreground text-xs">{wateringInfo}</p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Sun className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          <div>
            <div className="mb-1 text-sm font-medium">Light</div>
            <p className="text-muted-foreground text-xs">{lightInfo}</p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
          <div>
            <div className="mb-1 text-sm font-medium">Notes</div>
            <p className="text-muted-foreground text-xs">{notes}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
