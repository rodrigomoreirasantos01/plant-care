import { Client } from "@botpress/client";

const TABLE_NAME = "PlantTable";

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    const token = process.env.BOTPRESS_TOKEN;
    const botId = process.env.BOTPRESS_BOT_ID;

    if (!token || !botId) {
      throw new Error(
        "Missing BOTPRESS_TOKEN or BOTPRESS_BOT_ID environment variables. " +
          "Add them to your .env.local file.",
      );
    }

    _client = new Client({ token, botId });
  }

  return _client;
}

/**
 * Fetch all plants for a given user from the PlantTable.
 */
export async function getPlantsByUser(userId: string) {
  const client = getClient();

  const { rows } = await client.findTableRows({
    table: TABLE_NAME,
    filter: { userId },
    limit: 50,
  });

  return rows;
}

/**
 * Seed the PlantTable with demo basil data for a given user.
 * Skips if basil-001 already exists.
 */
export async function seedPlantData(userId: string) {
  const client = getClient();

  // Check if it already exists
  const { rows } = await client.findTableRows({
    table: TABLE_NAME,
    filter: { plantId: "basil-001" },
    limit: 1,
  });

  if (rows.length > 0) {
    return { success: true, plantId: "basil-001", alreadyExisted: true };
  }

  await client.createTableRows({
    table: TABLE_NAME,
    rows: [
      {
        plantId: "basil-001",
        userId,
        name: "Basil",
        illustration: "🌿",
        status: "ok",
        statusMessage: "Growing well! Keep it up.",

        metrics: {
          soilMoisture: { value: 45, ideal: "35–55%" },
          lightToday: { value: 6, ideal: "6h" },
          temperature: { value: 24, ideal: "20–28°C" },
        },

        cycle: {
          phase: "vegetative",
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
          logged: {
            watering: false,
            light: false,
            humidity: false,
            temperature: false,
            trimming: false,
            pruning: false,
          },
          needsTrimming: false,
          needsPruning: true,
        },

        alerts: [
          {
            id: "1",
            severity: "critical",
            message: "Consider pruning lower leaves for better air circulation",
          },
        ],

        now: {
          soilMoisture: 30,
          soilMoistureIdeal: { min: 35, max: 55 },
          lightToday: 4,
          lightGoal: 6,
          temperature: 24,
          temperatureIdeal: { min: 20, max: 28 },
          airHumidity: 45,
          humidityIdeal: { min: 50, max: 70 },
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
    ],
  });

  return { success: true, plantId: "basil-001", alreadyExisted: false };
}

export type TodoType =
  | "watering"
  | "light"
  | "humidity"
  | "temperature"
  | "trimming"
  | "pruning";

/**
 * Complete multiple todo items for a plant in a single update.
 * Sets the corresponding logged flags to true in `today.logged`
 * and clears manual flags (trimming/pruning) when completed.
 */
export async function completePlantTodos(
  plantId: string,
  completedTodos: TodoType[],
) {
  const client = getClient();

  const { rows } = await client.findTableRows({
    table: TABLE_NAME,
    filter: { plantId },
    limit: 1,
  });

  if (rows.length === 0) {
    throw new Error(`Plant ${plantId} not found`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = rows[0] as any;
  const rowId = row.id;

  const today: Record<string, unknown> =
    typeof row.today === "string" ? JSON.parse(row.today) : (row.today ?? {});

  const logged: Record<string, boolean> =
    typeof today.logged === "string"
      ? JSON.parse(today.logged as string)
      : ((today.logged as Record<string, boolean>) ?? {});

  for (const todoType of completedTodos) {
    logged[todoType] = true;

    // Also clear legacy boolean flags (old format) for backward compat
    switch (todoType) {
      case "watering":
        today.needsWatering = false;
        break;
      case "light":
        today.lightRemaining = 0;
        break;
      case "humidity":
        today.needsHumidity = false;
        break;
      case "trimming":
        today.needsTrimming = false;
        break;
      case "pruning":
        today.needsPruning = false;
        break;
    }
  }

  today.logged = logged;

  await client.updateTableRows({
    table: TABLE_NAME,
    rows: [{ id: rowId, today }],
  });

  return { success: true, plantId, completedTodos };
}
