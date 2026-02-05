import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LogInIcon } from "lucide-react";

const LoginPage = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return (
    <div>
      <SignInButton>
        <Button variant="outline">
          <LogInIcon className="mr-2" />
          Get Start
        </Button>
      </SignInButton>
    </div>
  );
};

export default LoginPage;
