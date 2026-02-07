"use client";

import { useEffect, useState, useCallback } from "react";
import PlantCard from "./plant-card";
import TodayToDoListCard from "./today-todo-list-card";
import GrowCycleCard from "./grow-cycle-card";
import { AlertsCard } from "./alert-card";
import NowCard from "./now-card";
import { GuideCard } from "./guide-card";
import TrendCard from "./trend-card";
import EmptyState from "./empty-state";

interface PlantDashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPlant: any | null;
  pollingInterval?: number;
}

const PlantDashboard = ({
  initialPlant,
  pollingInterval = 5000,
}: PlantDashboardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plant, setPlant] = useState<any | null>(initialPlant);

  const fetchPlants = useCallback(async () => {
    try {
      const res = await fetch("/api/plants");
      if (!res.ok) return;

      const data = await res.json();
      const updatedPlant = data.plants?.[0] ?? null;
      setPlant(updatedPlant);
    } catch (error) {
      console.error("Error polling plants:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchPlants, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchPlants, pollingInterval]);

  if (!plant) {
    return <EmptyState onPlantAdded={fetchPlants} />;
  }

  return (
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
          plantId={plant.plantId}
          metrics={plant.metrics}
          now={plant.now}
          today={plant.today}
          onTodoCompleted={fetchPlants}
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
  );
};

export default PlantDashboard;
