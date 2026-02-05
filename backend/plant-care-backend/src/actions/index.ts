import { Action, z } from "@botpress/runtime";
import { PlantTable } from "../tables";

/**
 * Seeds the PlantTable with initial basil data for a given user.
 * Call this once to populate the table with demo data.
 */
export const seedPlantData = new Action({
  name: "seedPlantData",
  description:
    "Inserts a demo Basil plant row into the PlantTable for the given user",
  input: z.object({
    userId: z.string().describe("The user ID to associate the plant with"),
  }),
  output: z.object({
    success: z.boolean(),
    plantId: z.string(),
  }),
  handler: async ({ ctx, input }) => {
    const plantId = "basil-001";

    // Check if it already exists to avoid duplicates
    const existing = await PlantTable.findMany(ctx, {
      filter: { plantId },
      limit: 1,
    });

    if (existing.rows.length > 0) {
      return { success: true, plantId };
    }

    await PlantTable.insert(ctx, {
      plantId,
      userId: input.userId,
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
        needsWatering: true,
        nextWatering: "Tomorrow at 8 AM",
        lightRemaining: 0,
      },

      alerts: [
        {
          id: "1",
          severity: "critical",
          message:
            "Consider pruning lower leaves for better air circulation",
        },
      ],

      now: {
        soilMoisture: 45,
        soilMoistureIdeal: { min: 35, max: 55 },
        lightToday: 6,
        lightGoal: 6,
        temperature: 24,
        airHumidity: 65,
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
    });

    return { success: true, plantId };
  },
});

/**
 * Retrieves all plants for a given user from the PlantTable.
 */
export const getPlantsByUser = new Action({
  name: "getPlantsByUser",
  description: "Fetches all plants belonging to a specific user",
  input: z.object({
    userId: z.string().describe("The user ID to look up plants for"),
  }),
  output: z.object({
    plants: z.array(
      z.object({
        plantId: z.string(),
        userId: z.string(),
        name: z.string(),
        illustration: z.string(),
        status: z.enum(["ok", "warning", "critical"]),
        statusMessage: z.string(),
        metrics: z.object({
          soilMoisture: z.object({ value: z.number(), ideal: z.string() }),
          lightToday: z.object({ value: z.number(), ideal: z.string() }),
          temperature: z.object({ value: z.number(), ideal: z.string() }),
        }),
        cycle: z.object({
          phase: z.enum([
            "seedling",
            "vegetative",
            "flowering",
            "fruiting",
            "harvest",
          ]),
          progress: z.number(),
          nextMilestone: z.string(),
        }),
        trendMoisture: z.array(
          z.object({ day: z.string(), value: z.number() })
        ),
        trendLight: z.array(
          z.object({ day: z.string(), value: z.number() })
        ),
        today: z.object({
          needsWatering: z.boolean(),
          nextWatering: z.string(),
          lightRemaining: z.number(),
        }),
        alerts: z.array(
          z.object({
            id: z.string(),
            severity: z.enum(["info", "warning", "critical"]),
            message: z.string(),
          })
        ),
        now: z.object({
          soilMoisture: z.number(),
          soilMoistureIdeal: z.object({ min: z.number(), max: z.number() }),
          lightToday: z.number(),
          lightGoal: z.number(),
          temperature: z.number(),
          airHumidity: z.number(),
        }),
        guide: z.object({
          plantType: z.string(),
          wateringInfo: z.string(),
          lightInfo: z.string(),
          notes: z.string(),
        }),
      })
    ),
  }),
  handler: async ({ ctx, input }) => {
    const result = await PlantTable.findMany(ctx, {
      filter: { userId: input.userId },
      limit: 50,
    });

    return {
      plants: result.rows.map((row) => ({
        plantId: row.plantId,
        userId: row.userId,
        name: row.name,
        illustration: row.illustration,
        status: row.status,
        statusMessage: row.statusMessage,
        metrics: row.metrics,
        cycle: row.cycle,
        trendMoisture: row.trendMoisture,
        trendLight: row.trendLight,
        today: row.today,
        alerts: row.alerts,
        now: row.now,
        guide: row.guide,
      })),
    };
  },
});

/**
 * Retrieves a single plant by its plantId.
 */
export const getPlantById = new Action({
  name: "getPlantById",
  description: "Fetches a single plant by its plantId",
  input: z.object({
    plantId: z.string().describe("The plant ID to look up"),
  }),
  output: z.object({
    found: z.boolean(),
    plant: z
      .object({
        plantId: z.string(),
        userId: z.string(),
        name: z.string(),
        illustration: z.string(),
        status: z.enum(["ok", "warning", "critical"]),
        statusMessage: z.string(),
        metrics: z.object({
          soilMoisture: z.object({ value: z.number(), ideal: z.string() }),
          lightToday: z.object({ value: z.number(), ideal: z.string() }),
          temperature: z.object({ value: z.number(), ideal: z.string() }),
        }),
        cycle: z.object({
          phase: z.enum([
            "seedling",
            "vegetative",
            "flowering",
            "fruiting",
            "harvest",
          ]),
          progress: z.number(),
          nextMilestone: z.string(),
        }),
        trendMoisture: z.array(
          z.object({ day: z.string(), value: z.number() })
        ),
        trendLight: z.array(
          z.object({ day: z.string(), value: z.number() })
        ),
        today: z.object({
          needsWatering: z.boolean(),
          nextWatering: z.string(),
          lightRemaining: z.number(),
        }),
        alerts: z.array(
          z.object({
            id: z.string(),
            severity: z.enum(["info", "warning", "critical"]),
            message: z.string(),
          })
        ),
        now: z.object({
          soilMoisture: z.number(),
          soilMoistureIdeal: z.object({ min: z.number(), max: z.number() }),
          lightToday: z.number(),
          lightGoal: z.number(),
          temperature: z.number(),
          airHumidity: z.number(),
        }),
        guide: z.object({
          plantType: z.string(),
          wateringInfo: z.string(),
          lightInfo: z.string(),
          notes: z.string(),
        }),
      })
      .nullable(),
  }),
  handler: async ({ ctx, input }) => {
    const result = await PlantTable.findMany(ctx, {
      filter: { plantId: input.plantId },
      limit: 1,
    });

    if (result.rows.length === 0) {
      return { found: false, plant: null };
    }

    const row = result.rows[0];
    return {
      found: true,
      plant: {
        plantId: row.plantId,
        userId: row.userId,
        name: row.name,
        illustration: row.illustration,
        status: row.status,
        statusMessage: row.statusMessage,
        metrics: row.metrics,
        cycle: row.cycle,
        trendMoisture: row.trendMoisture,
        trendLight: row.trendLight,
        today: row.today,
        alerts: row.alerts,
        now: row.now,
        guide: row.guide,
      },
    };
  },
});

export default {
  seedPlantData,
  getPlantsByUser,
  getPlantById,
};
