import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Droplet, Sun, Eye, StickyNote, X } from "lucide-react";

interface GuideCardProps {
  plantType: string;
  wateringInfo: string;
  lightInfo: string;
  notes: string;
  userNotes?: string[];
  onRemoveNote?: (note: string) => void;
}

export function GuideCard({
  plantType,
  wateringInfo,
  lightInfo,
  notes,
  userNotes = [],
  onRemoveNote,
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
            <div className="mb-1 text-sm font-medium">Bot Notes</div>
            <p className="text-muted-foreground text-xs">{notes}</p>
          </div>
        </div>

        {userNotes.length > 0 && (
          <>
            <Separator />

            <div className="flex gap-3">
              <StickyNote className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 text-sm font-medium">Your Notes</div>
                <div className="flex flex-wrap gap-1.5">
                  {userNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:text-violet-400"
                    >
                      {note}
                      {onRemoveNote && (
                        <button
                          onClick={() => onRemoveNote(note)}
                          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-violet-500/20"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
