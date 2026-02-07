import { Table, z } from "@botpress/runtime";

export const PlantTable = new Table({
  name: "PlantTable",
  description: "",
  columns: {
    plantId: {
      schema: z.string(),
      searchable: true,
    },
    userId: {
      schema: z.string(),
      searchable: true,
    },
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

    trendMoisture: z.array(z.object({ day: z.string(), value: z.number() })),
    trendLight: z.array(z.object({ day: z.string(), value: z.number() })),

    today: z.object({
      needsWatering: z.boolean(),
      nextWatering: z.string(),
      lightRemaining: z.number(),
      needsTrimming: z.boolean().optional(),
      needsPruning: z.boolean().optional(),
      logged: z
        .object({
          watering: z.boolean().optional(),
          light: z.boolean().optional(),
          humidity: z.boolean().optional(),
          temperature: z.boolean().optional(),
          trimming: z.boolean().optional(),
          pruning: z.boolean().optional(),
        })
        .optional(),
    }),

    alerts: z.array(
      z.object({
        id: z.string(),
        severity: z.enum(["info", "warning", "critical"]),
        message: z.string(),
      }),
    ),

    now: z.object({
      soilMoisture: z.number(),
      soilMoistureIdeal: z.object({ min: z.number(), max: z.number() }),
      lightToday: z.number(),
      lightGoal: z.number(),
      temperature: z.number(),
      temperatureIdeal: z
        .object({ min: z.number(), max: z.number() })
        .optional(),
      airHumidity: z.number(),
      humidityIdeal: z
        .object({ min: z.number(), max: z.number() })
        .optional(),
    }),

    guide: z.object({
      plantType: z.string(),
      wateringInfo: z.string(),
      lightInfo: z.string(),
      notes: z.string(),
    }),
  },
});

export default {
  PlantTable,
};
