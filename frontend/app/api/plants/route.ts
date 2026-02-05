import { NextResponse } from "next/server";
import { getPlantsByUser } from "@/lib/botpress";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/plants
 * Fetches all plants for the authenticated user from the Botpress PlantTable.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plants = await getPlantsByUser(userId);
    return NextResponse.json({ plants });
  } catch (error) {
    console.error("Error fetching plants:", error);
    return NextResponse.json(
      { error: "Failed to fetch plants", details: String(error) },
      { status: 500 }
    );
  }
}
