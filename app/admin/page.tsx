import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, Bell } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get total members
  const { count: totalMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "user");

  // Get this month's attendance stats
  const monthStart = startOfMonth(new Date()).toISOString();
  const monthEnd = endOfMonth(new Date()).toISOString();

  const { data: monthlyAttendance } = await supabase
    .from("attendance")
    .select("*")
    .gte("check_in", monthStart)
    .lte("check_in", monthEnd);

  // Get today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const { data: todayAttendance } = await supabase
    .from("attendance")
    .select("*, profiles(name, email)")
    .gte("check_in", todayStr);

  // Get recent members
  const { data: recentMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get active announcements count
  const { count: activeAnnouncements } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  // Calculate plan distribution
  const { data: planData } = await supabase
    .from("profiles")
    .select("plan")
    .eq("role", "user");

  const planCounts = {
    Starter: planData?.filter((p) => p.plan === "Starter" || !p.plan).length || 0,
    Pro: planData?.filter((p) => p.plan === "Pro").length || 0,
    Elite: planData?.filter((p) => p.plan === "Elite").length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of Revolution Gym operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">{totalMembers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{"Today's"} Visits</p>
                <p className="text-2xl font-bold text-foreground">{todayAttendance?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Visits</p>
                <p className="text-2xl font-bold text-foreground">{monthlyAttendance?.length || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Announcements</p>
                <p className="text-2xl font-bold text-foreground">{activeAnnouncements || 0}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution & Today's Attendance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Plans</CardTitle>
            <CardDescription>Distribution of member plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(planCounts).map(([plan, count]) => {
                const total = totalMembers || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={plan} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{plan}</span>
                      <span className="text-muted-foreground">
                        {count} members ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>{"Today's"} Attendance</CardTitle>
            <CardDescription>{format(new Date(), "MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            {todayAttendance && todayAttendance.length > 0 ? (
              <div className="space-y-3">
                {todayAttendance.slice(0, 5).map((record: { id: string; check_in: string; check_out: string | null; profiles: { name: string; email: string } }) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{record.profiles?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Check in: {format(new Date(record.check_in), "h:mm a")}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        record.check_out
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {record.check_out ? "Left" : "Active"}
                    </span>
                  </div>
                ))}
                {todayAttendance.length > 5 && (
                  <p className="text-sm text-center text-muted-foreground">
                    +{todayAttendance.length - 5} more members
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No gym visits today yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Members */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
          <CardDescription>Newly registered gym members</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMembers && recentMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 font-medium text-foreground">{member.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {member.plan || "Starter"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {format(new Date(member.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No members registered yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
