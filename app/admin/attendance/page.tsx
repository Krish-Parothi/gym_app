"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Calendar, Users, Clock } from "lucide-react";
import { format, differenceInMinutes, startOfDay, endOfDay, parseISO } from "date-fns";

interface AttendanceRecord {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  profiles: {
    name: string;
    email: string;
    plan: string | null;
  };
}

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(format(new Date(), "yyyy-MM-dd"));
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [dateFilter]);

  useEffect(() => {
    filterAttendance();
  }, [searchQuery, statusFilter, attendance]);

  async function loadAttendance() {
    setIsLoading(true);
    const supabase = createClient();

    const selectedDate = parseISO(dateFilter);
    const dayStart = startOfDay(selectedDate).toISOString();
    const dayEnd = endOfDay(selectedDate).toISOString();

    const { data } = await supabase
      .from("attendance")
      .select("*, profiles(name, email, plan)")
      .gte("check_in", dayStart)
      .lte("check_in", dayEnd)
      .order("check_in", { ascending: false });

    setAttendance((data as AttendanceRecord[]) || []);
    setIsLoading(false);
  }

  function filterAttendance() {
    let filtered = [...attendance];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.profiles?.name?.toLowerCase().includes(query) ||
          a.profiles?.email?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((a) => !a.check_out);
      } else {
        filtered = filtered.filter((a) => a.check_out);
      }
    }

    setFilteredAttendance(filtered);
  }

  const activeCount = attendance.filter((a) => !a.check_out).length;
  const completedCount = attendance.filter((a) => a.check_out).length;
  const avgDuration =
    attendance
      .filter((a) => a.check_out)
      .reduce((sum, a) => sum + differenceInMinutes(new Date(a.check_out!), new Date(a.check_in)), 0) /
    (completedCount || 1);

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
        <p className="text-muted-foreground mt-1">Track daily gym attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-xl font-bold text-foreground">{attendance.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currently Active</p>
                <p className="text-xl font-bold text-foreground">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold text-foreground">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-xl font-bold text-foreground">
                  {Math.floor(avgDuration / 60)}h {Math.round(avgDuration % 60)}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-auto"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {format(parseISO(dateFilter), "MMMM d, yyyy")} - {filteredAttendance.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttendance.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance records for this day
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => {
                    const duration = record.check_out
                      ? differenceInMinutes(new Date(record.check_out), new Date(record.check_in))
                      : null;
                    return (
                      <tr key={record.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-foreground">{record.profiles?.name}</p>
                            <p className="text-xs text-muted-foreground">{record.profiles?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {record.profiles?.plan || "Starter"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {format(new Date(record.check_in), "h:mm a")}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {record.check_out
                            ? format(new Date(record.check_out), "h:mm a")
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {duration !== null
                            ? `${Math.floor(duration / 60)}h ${duration % 60}m`
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              record.check_out
                                ? "bg-muted text-muted-foreground"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {record.check_out ? "Completed" : "Active"}
                          </span>
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
