"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "urgent";
  active: boolean;
  created_at: string;
  expires_at: string | null;
}

const typeConfig = {
  info: { icon: Info, label: "Info", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  success: { icon: CheckCircle, label: "Success", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  warning: { icon: AlertTriangle, label: "Warning", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  urgent: { icon: AlertCircle, label: "Urgent", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const emptyAnnouncement = {
  id: "",
  title: "",
  content: "",
  type: "info" as const,
  active: true,
  created_at: "",
  expires_at: null,
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement>(emptyAnnouncement);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const supabase = createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    setAnnouncements(data || []);
    setIsLoading(false);
  }

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (isEditing) {
      const { error } = await supabase
        .from("announcements")
        .update({
          title: currentAnnouncement.title,
          content: currentAnnouncement.content,
          type: currentAnnouncement.type,
          active: currentAnnouncement.active,
          expires_at: currentAnnouncement.expires_at,
        })
        .eq("id", currentAnnouncement.id);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Announcement updated successfully!" });
        setIsDialogOpen(false);
        loadAnnouncements();
      }
    } else {
      const { error } = await supabase.from("announcements").insert({
        title: currentAnnouncement.title,
        content: currentAnnouncement.content,
        type: currentAnnouncement.type,
        active: currentAnnouncement.active,
        expires_at: currentAnnouncement.expires_at,
        created_by: user?.id,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Announcement created successfully!" });
        setIsDialogOpen(false);
        loadAnnouncements();
      }
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("announcements")
      .update({ active })
      .eq("id", id);

    if (!error) {
      setAnnouncements(
        announcements.map((a) => (a.id === id ? { ...a, active } : a))
      );
    }
  };

  const openCreateDialog = () => {
    setCurrentAnnouncement(emptyAnnouncement);
    setIsEditing(false);
    setMessage(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
    setMessage(null);
    setIsDialogOpen(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Manage gym announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Announcement" : "Create Announcement"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the announcement details"
                  : "Create a new announcement for gym members"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {message && (
                <Alert variant={message.type === "error" ? "destructive" : "default"}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={currentAnnouncement.title}
                  onChange={(e) =>
                    setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })
                  }
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={currentAnnouncement.content}
                  onChange={(e) =>
                    setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })
                  }
                  placeholder="Announcement content..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={currentAnnouncement.type}
                    onValueChange={(value: "info" | "warning" | "success" | "urgent") =>
                      setCurrentAnnouncement({ ...currentAnnouncement, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires">Expires At (Optional)</Label>
                  <Input
                    id="expires"
                    type="date"
                    value={currentAnnouncement.expires_at?.split("T")[0] || ""}
                    onChange={(e) =>
                      setCurrentAnnouncement({
                        ...currentAnnouncement,
                        expires_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="active"
                  checked={currentAnnouncement.active}
                  onCheckedChange={(checked) =>
                    setCurrentAnnouncement({ ...currentAnnouncement, active: checked })
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Update Announcement"
                ) : (
                  "Create Announcement"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Announcements</h3>
            <p className="text-muted-foreground mb-4">
              Create your first announcement to communicate with gym members.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const config = typeConfig[announcement.type];
            const Icon = config.icon;

            return (
              <Card key={announcement.id} className={cn(!announcement.active && "opacity-60")}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(announcement.created_at), "MMM d, yyyy • h:mm a")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={config.color} variant="secondary">
                        {config.label}
                      </Badge>
                      <Badge variant={announcement.active ? "default" : "secondary"}>
                        {announcement.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap mb-4">{announcement.content}</p>
                  {announcement.expires_at && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Expires: {format(new Date(announcement.expires_at), "MMM d, yyyy")}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={announcement.active}
                        onCheckedChange={(checked) => toggleActive(announcement.id, checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {announcement.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
