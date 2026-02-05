import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PlantCard from "./components/plant-card";
import TodayToDoListCard from "./components/today-todo-list-card";
import GrowCycleCard from "./components/grow-cycle-card";
import { AlertsCard } from "./components/alert-card";
import NowCard from "./components/now-card";
import { GuideCard } from "./components/guide-card";

import TrendCard from "./components/trend-card";
import Topbar from "./components/top-bar";

const Home = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const plantData = {
    basil: {
      name: "Basil",
      illustration: "🌿",
      status: "ok" as const,
      statusMessage: "Growing well! Keep it up.",
      metrics: {
        soilMoisture: { value: 45, ideal: "35–55%" },
        lightToday: { value: 6, ideal: "6h" },
        temperature: { value: 24, ideal: "20–28°C" },
      },
      cycle: {
        phase: "vegetative" as const,
        progress: 60,
        nextMilestone: "Flowering starts in ~2 weeks",
      },
      trendMoisture: [
        { day: "Mon", value: 42 },
        { day: "Tue", value: 38 },
        { day: "Wed", value: 50 },
        { day: "Thu", value: 45 },
        { day: "Fri", value: 43 },
        { day: "Sat", value: 47 },
        { day: "Sun", value: 45 },
      ],
      trendLight: [
        { day: "Mon", value: 5 },
        { day: "Tue", value: 7 },
        { day: "Wed", value: 6 },
        { day: "Thu", value: 5.5 },
        { day: "Fri", value: 6.5 },
        { day: "Sat", value: 7 },
        { day: "Sun", value: 6 },
      ],
      today: {
        needsWatering: true,
        nextWatering: "Tomorrow at 8 AM",
        lightRemaining: 0,
      },
      alerts: [
        {
          id: "1",
          severity: "critical" as const,
          message: "Consider pruning lower leaves for better air circulation",
        },
      ],
      now: {
        soilMoisture: 45,
        soilMoistureIdeal: { min: 35, max: 55 },
        lightToday: 6,
        lightGoal: 6,
        temperature: 24,
        airHumidity: 65,
      },
      guide: {
        plantType: "Basil",
        wateringInfo:
          "Keep soil moist, water when top layer is dry. Avoid waterlogging.",
        lightInfo:
          "6-8h of direct sunlight per day. Tolerates partial shade in hot climates.",
        notes:
          "Prune regularly to encourage growth. Remove flowers to prolong harvest.",
      },
    },
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Topbar />

      <main className="mx-auto max-w-[1440px] px-6 pt-20 pb-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 space-y-6">
            <PlantCard
              name={plantData.basil.name}
              status={plantData.basil.status}
              statusMessage={plantData.basil.statusMessage}
              illustration={plantData.basil.illustration}
              metrics={plantData.basil.metrics}
            />

            <GrowCycleCard
              phase={plantData.basil.cycle.phase}
              progress={plantData.basil.cycle.progress}
              nextMilestone={plantData.basil.cycle.nextMilestone}
            />

            <TrendCard
              moistureData={plantData.basil.trendMoisture}
              lightData={plantData.basil.trendLight}
            />
          </div>

          <div className="col-span-5 space-y-6">
            <TodayToDoListCard
              needsWatering={plantData.basil.today.needsWatering}
              nextWatering={plantData.basil.today.nextWatering}
              lightRemaining={plantData.basil.today.lightRemaining}
            />

            <AlertsCard alerts={plantData.basil.alerts} />

            <NowCard
              soilMoisture={plantData.basil.now.soilMoisture}
              soilMoistureIdeal={plantData.basil.now.soilMoistureIdeal}
              lightToday={plantData.basil.now.lightToday}
              lightGoal={plantData.basil.now.lightGoal}
              temperature={plantData.basil.now.temperature}
              airHumidity={plantData.basil.now.airHumidity}
            />

            <GuideCard
              plantType={plantData.basil.guide.plantType}
              wateringInfo={plantData.basil.guide.wateringInfo}
              lightInfo={plantData.basil.guide.lightInfo}
              notes={plantData.basil.guide.notes}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
