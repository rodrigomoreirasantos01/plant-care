import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendCardProps {
  moistureData: Array<{ day: string; value: number }>;
  lightData: Array<{ day: string; value: number }>;
}

const TrendCard = ({ moistureData, lightData }: TrendCardProps) => {
  return (
    <Card className="bg-card border-border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">7-Day Trend</h3>

      <div className="space-y-6">
        {/* Gráfico de umidade */}
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            Soil moisture (%)
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 12 }} />
              <YAxis tick={{ fill: "#666", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de luz */}
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            Daily light (h)
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={lightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 12 }} />
              <YAxis tick={{ fill: "#666", fontSize: 12 }} domain={[0, 12]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default TrendCard;
