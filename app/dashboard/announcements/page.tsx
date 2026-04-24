"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "urgent";
  created_at: string;
  expires_at: string | null;
}

const typeConfig = {
  info: {
    icon: Info,
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    borderClass: "border-l-blue-500",
    label: "Info",
  },
  success: {
    icon: CheckCircle,
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    borderClass: "border-l-green-500",
    label: "Success",
  },
  warning: {
    icon: AlertTriangle,
    badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    borderClass: "border-l-yellow-500",
    label: "Warning",
  },
  urgent: {
    icon: AlertCircle,
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    borderClass: "border-l-red-500",
    label: "Urgent",
  },
};

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      setAnnouncements(data || []);
      setIsLoading(false);
    }

    loadAnnouncements();
  }, [router]);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-1">Stay updated with the latest gym news</p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Announcements</h3>
            <p className="text-muted-foreground">
              {"There are no active announcements at the moment. Check back later!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const config = typeConfig[announcement.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <Card
                key={announcement.id}
                className={cn("border-l-4", config.borderClass)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(announcement.created_at), "MMMM d, yyyy • h:mm a")}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={config.badgeClass} variant="secondary">
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{announcement.content}</p>
                  {announcement.expires_at && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Expires: {format(new Date(announcement.expires_at), "MMM d, yyyy")}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
