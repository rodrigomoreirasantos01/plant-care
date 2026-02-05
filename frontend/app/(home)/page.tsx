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
import EmptyState from "./components/empty-state";
import { getPlantsByUser } from "@/lib/botpress";

const Home = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  let plants: Record<string, unknown>[] = [];
  try {
    plants = await getPlantsByUser(userId);
  } catch (error) {
    console.error("Error fetching plants from Botpress:", error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plant = plants[0] as any;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Topbar />

      <main className="mx-auto max-w-[1440px] px-6 pt-20 pb-24">
        {!plant ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 space-y-6">
              <PlantCard
                name={plant.name}
                status={plant.status}
                statusMessage={plant.statusMessage}
                illustration={plant.illustration}
                metrics={plant.metrics}
              />

              <GrowCycleCard
                phase={plant.cycle.phase}
                progress={plant.cycle.progress}
                nextMilestone={plant.cycle.nextMilestone}
              />

              <TrendCard
                moistureData={plant.trendMoisture}
                lightData={plant.trendLight}
              />
            </div>

            <div className="col-span-5 space-y-6">
              <TodayToDoListCard
                needsWatering={plant.today.needsWatering}
                nextWatering={plant.today.nextWatering}
                lightRemaining={plant.today.lightRemaining}
              />

              <AlertsCard alerts={plant.alerts} />

              <NowCard
                soilMoisture={plant.now.soilMoisture}
                soilMoistureIdeal={plant.now.soilMoistureIdeal}
                lightToday={plant.now.lightToday}
                lightGoal={plant.now.lightGoal}
                temperature={plant.now.temperature}
                airHumidity={plant.now.airHumidity}
              />

              <GuideCard
                plantType={plant.guide.plantType}
                wateringInfo={plant.guide.wateringInfo}
                lightInfo={plant.guide.lightInfo}
                notes={plant.guide.notes}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
