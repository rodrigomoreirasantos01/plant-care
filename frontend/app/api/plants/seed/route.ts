import { NextResponse } from "next/server";
import { seedPlantData } from "@/lib/botpress";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/plants/seed
 * Seeds the PlantTable with demo basil data for the authenticated user.
 */
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await seedPlantData(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error seeding plant data:", error);
    return NextResponse.json(
      { error: "Failed to seed plant data", details: String(error) },
      { status: 500 }
    );
  }
}
