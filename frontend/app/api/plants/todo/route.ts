import { NextResponse } from "next/server";
import { completePlantTodos, type TodoType } from "@/lib/botpress";
import { auth } from "@clerk/nextjs/server";

const VALID_TODO_TYPES: TodoType[] = [
  "watering",
  "light",
  "humidity",
  "temperature",
  "trimming",
  "pruning",
];

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plantId, completedTodos } = body;

    if (
      !plantId ||
      !Array.isArray(completedTodos) ||
      completedTodos.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing plantId or completedTodos array" },
        { status: 400 },
      );
    }

    const invalidTypes = completedTodos.filter(
      (t: string) => !VALID_TODO_TYPES.includes(t as TodoType),
    );

    if (invalidTypes.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid todo types: ${invalidTypes.join(", ")}. Valid: ${VALID_TODO_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const result = await completePlantTodos(plantId, completedTodos);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error completing todos:", error);
    return NextResponse.json(
      { error: "Failed to complete todos", details: String(error) },
      { status: 500 },
    );
  }
}
