import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Home = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return <div>Home</div>;
};

export default Home;
