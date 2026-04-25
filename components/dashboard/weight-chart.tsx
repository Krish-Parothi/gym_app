"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface WeightLog {
  id: string;
  weight: number;
  logged_at: string;
}

export function WeightChart({ data }: { data: WeightLog[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No weight data yet. Start logging your weight!
      </div>
    );
  }

  const chartData = data.map((log) => ({
    date: format(new Date(log.logged_at), "MMM d"),
    weight: Number(log.weight),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333333",
              borderRadius: "8px",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#ffffff" }}
            formatter={(value) => [`${value} kg`, "Weight"]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#FF0000"
            strokeWidth={2}
            dot={{ fill: "#FF0000", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#FF0000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}