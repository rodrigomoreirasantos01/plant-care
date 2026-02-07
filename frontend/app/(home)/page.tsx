import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Topbar from "./components/top-bar";
import PlantDashboard from "./components/plant-dashboard";
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
  const initialPlant = (plants[0] as any) ?? null;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Topbar />

      <main className="mx-auto max-w-[1440px] px-6 pt-20 pb-24">
        <PlantDashboard initialPlant={initialPlant} />
      </main>
    </div>
  );
};

export default Home;
