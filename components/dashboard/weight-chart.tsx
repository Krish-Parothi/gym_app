"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

  let chartData = data.map((log) => ({
    date: format(new Date(log.logged_at), "MMM d"),
    weight: Number(log.weight),
  }));

  // If there's only one data point, add a dummy point so the chart renders a line instead of just a dot
  if (chartData.length === 1) {
    const prevDate = new Date(data[0].logged_at);
    prevDate.setDate(prevDate.getDate() - 1);
    chartData = [
      {
        date: format(prevDate, "MMM d"),
        weight: Number(data[0].weight),
      },
      ...chartData,
    ];
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
            tickFormatter={(value) => `${value}kg`}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333333",
              borderRadius: "8px",
              color: "#ffffff",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#888888", marginBottom: "4px" }}
            itemStyle={{ color: "#FF0000", fontWeight: 500 }}
            formatter={(value: number) => [`${value} kg`, "Weight"]}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#FF0000"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            dot={{ fill: "#1a1a1a", stroke: "#FF0000", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#FF0000", stroke: "#1a1a1a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}