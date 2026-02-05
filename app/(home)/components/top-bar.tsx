import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Topbar = () => {
  return (
    <div className="bg-card border-border fixed top-0 right-0 left-0 z-50 h-16 border-b">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
            <span className="text-lg font-bold text-white">🌿</span>
          </div>
          <h1 className="text-lg font-semibold">PlantCare</h1>
        </div>

        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search plants, guides, alerts..."
            className="bg-muted/50 border-border pl-10"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts
            <Badge variant="destructive" className="ml-1">
              2
            </Badge>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
