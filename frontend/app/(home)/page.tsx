import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Topbar from "./components/top-bar";
import PlantDashboard from "./components/plant-dashboard";
import { getPlantsByUser } from "@/lib/botpress";
import { NotificationProvider } from "./contexts/notification-context";

const Home = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await currentUser();

  let plants: Record<string, unknown>[] = [];
  try {
    plants = await getPlantsByUser(userId);
  } catch (error) {
    console.error("Error fetching plants from Botpress:", error);
  }

  return (
    <NotificationProvider>
      <div className="bg-background text-foreground min-h-screen">
        <Topbar />

        <main className="mx-auto max-w-[1440px] px-6 pt-20 pb-24">
          <PlantDashboard
            plants={plants}
            userName={user?.firstName ?? undefined}
          />
        </main>
      </div>
    </NotificationProvider>
  );
};

export default Home;
