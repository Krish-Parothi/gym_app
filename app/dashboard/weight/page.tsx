"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { Loader2, Plus, Trash2, Scale } from "lucide-react";
import { format } from "date-fns";

interface WeightLog {
  id: string;
  weight: number;
  logged_at: string;
}

export default function WeightLogPage() {
  const router = useRouter();
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadWeightLogs();
  }, []);

  async function loadWeightLogs() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: true });

    setWeightLogs(data || []);
    setIsLoading(false);
  }

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("weight_logs").insert({
      user_id: user.id,
      weight: parseFloat(newWeight),
      logged_at: logDate,
    });

    setIsAdding(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Weight logged successfully!" });
      setNewWeight("");
      loadWeightLogs();
    }
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("weight_logs").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setWeightLogs(weightLogs.filter((log) => log.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Weight Log</h1>
        <p className="text-muted-foreground mt-1">Track your weight progress over time</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add Weight Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Log Weight
            </CardTitle>
            <CardDescription>Add your current weight</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWeight} className="space-y-4">
              {message && (
                <Alert variant={message.type === "error" ? "destructive" : "default"}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g., 70.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  max={format(new Date(), "yyyy-MM-dd")}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Log Weight
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>Your weight trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightLogs} />
          </CardContent>
        </Card>
      </div>

      {/* Weight History */}
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
          <CardDescription>All your logged weights</CardDescription>
        </CardHeader>
        <CardContent>
          {weightLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No weight entries yet. Start logging your weight above!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Weight</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...weightLogs].reverse().map((log, index, arr) => {
                    const prevWeight = arr[index + 1]?.weight || log.weight;
                    const change = Number(log.weight) - Number(prevWeight);
                    return (
                      <tr key={log.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-foreground">
                          {format(new Date(log.logged_at), "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">
                          {log.weight} kg
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={
                              change < 0
                                ? "text-green-600"
                                : change > 0
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }
                          >
                            {change > 0 ? "+" : ""}
                            {change.toFixed(1)} kg
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
