"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AttendanceCalendar } from "@/components/dashboard/attendance-calendar";
import { Loader2, LogIn, LogOut, Calendar, Clock } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";

interface Attendance {
  id: string;
  check_in: string;
  check_out: string | null;
}

export default function AttendancePage() {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [activeSession, setActiveSession] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("check_in", { ascending: false });

    setAttendance(data || []);

    // Check for active session (no check_out)
    const active = data?.find((a) => !a.check_out);
    setActiveSession(active || null);

    setIsLoading(false);
  }

  const handleCheckIn = async () => {
    setIsProcessing(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("attendance").insert({
      user_id: user.id,
      check_in: new Date().toISOString(),
    });

    setIsProcessing(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Checked in successfully!" });
      loadAttendance();
    }
  };

  const handleCheckOut = async () => {
    if (!activeSession) return;

    setIsProcessing(true);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("id", activeSession.id);

    setIsProcessing(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Checked out successfully!" });
      loadAttendance();
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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">Track your gym visits</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Check In/Out Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {activeSession ? "Active Session" : "Check In"}
            </CardTitle>
            <CardDescription>
              {activeSession
                ? `Checked in at ${format(new Date(activeSession.check_in), "h:mm a")}`
                : "Start your gym session"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {activeSession ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Session Duration</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.floor(differenceInMinutes(new Date(), new Date(activeSession.check_in)) / 60)}h{" "}
                    {differenceInMinutes(new Date(), new Date(activeSession.check_in)) % 60}m
                  </p>
                </div>
                <Button
                  onClick={handleCheckOut}
                  className="w-full"
                  variant="destructive"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Check Out
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={handleCheckIn} className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Check In
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Month
            </CardTitle>
            <CardDescription>Your attendance calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceCalendar attendance={attendance} />
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Your recent gym visits</CardDescription>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance records yet. Check in to start tracking!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 10).map((record) => {
                    const duration = record.check_out
                      ? differenceInMinutes(new Date(record.check_out), new Date(record.check_in))
                      : null;
                    return (
                      <tr key={record.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-foreground">
                          {format(new Date(record.check_in), "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {format(new Date(record.check_in), "h:mm a")}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {record.check_out
                            ? format(new Date(record.check_out), "h:mm a")
                            : <span className="text-primary font-medium">Active</span>}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {duration !== null
                            ? `${Math.floor(duration / 60)}h ${duration % 60}m`
                            : "-"}
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
