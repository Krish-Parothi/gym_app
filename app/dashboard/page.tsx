import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Calendar, TrendingUp, Droplets } from "lucide-react";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { AttendanceCalendar } from "@/components/dashboard/attendance-calendar";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: weightLogs } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", user?.id)
    .order("logged_at", { ascending: true })
    .limit(30);

  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user?.id)
    .order("check_in", { ascending: false })
    .limit(30);

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const latestWeight = weightLogs?.[weightLogs.length - 1]?.weight || 0;
  const previousWeight = weightLogs?.[weightLogs.length - 2]?.weight || latestWeight;
  const weightChange = latestWeight - previousWeight;
  const attendanceThisMonth = attendance?.filter((a) => {
    const checkIn = new Date(a.check_in);
    const now = new Date();
    return checkIn.getMonth() === now.getMonth() && checkIn.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {profile?.name?.split(" ")[0] || "Member"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {"Here's"} an overview of your fitness journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-2xl font-bold text-foreground">{latestWeight} kg</p>
              </div>
              <Scale className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weight Change</p>
                <p className={`text-2xl font-bold ${weightChange < 0 ? "text-green-600" : weightChange > 0 ? "text-red-500" : "text-foreground"}`}>
                  {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gym Visits</p>
                <p className="text-2xl font-bold text-foreground">{attendanceThisMonth} days</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Water Goal</p>
                <p className="text-2xl font-bold text-foreground">{profile?.water_goal || 8} glasses</p>
              </div>
              <Droplets className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>Your weight over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightLogs || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>Your gym visits this month</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceCalendar attendance={attendance || []} />
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Announcements</CardTitle>
            <CardDescription>Stay updated with gym news</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-foreground">{announcement.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(announcement.created_at), "MMM d")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
