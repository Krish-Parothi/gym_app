"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, User, Mail, Phone, Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  gender: string | null;
  plan: string | null;
  diet_type: string | null;
  fitness_goal: string | null;
  created_at: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, planFilter, members]);

  async function loadMembers() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user")
      .order("created_at", { ascending: false });

    setMembers(data || []);
    setIsLoading(false);
  }

  function filterMembers() {
    let filtered = [...members];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.phone?.includes(query)
      );
    }

    if (planFilter !== "all") {
      filtered = filtered.filter((m) => (m.plan || "Starter") === planFilter);
    }

    setFilteredMembers(filtered);
  }

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    setIsSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        name: selectedMember.name,
        phone: selectedMember.phone,
        age: selectedMember.age,
        gender: selectedMember.gender,
        plan: selectedMember.plan,
        diet_type: selectedMember.diet_type,
        fitness_goal: selectedMember.fitness_goal,
      })
      .eq("id", selectedMember.id);

    setIsSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Member updated successfully!" });
      setIsEditing(false);
      loadMembers();
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMembers(members.filter((m) => m.id !== id));
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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Members</h1>
        <p className="text-muted-foreground mt-1">Manage gym members</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Members ({filteredMembers.length})</CardTitle>
          <CardDescription>Click on a member to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No members found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium text-foreground">{member.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{member.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{member.phone || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {member.plan || "Starter"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {format(new Date(member.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setIsEditing(false);
                                  setMessage(null);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Member Details</DialogTitle>
                                <DialogDescription>
                                  View and edit member information
                                </DialogDescription>
                              </DialogHeader>
                              {selectedMember && (
                                <div className="space-y-4">
                                  {message && (
                                    <Alert variant={message.type === "error" ? "destructive" : "default"}>
                                      <AlertDescription>{message.text}</AlertDescription>
                                    </Alert>
                                  )}

                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Name</Label>
                                      <Input
                                        value={selectedMember.name}
                                        onChange={(e) =>
                                          setSelectedMember({ ...selectedMember, name: e.target.value })
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Phone</Label>
                                      <Input
                                        value={selectedMember.phone || ""}
                                        onChange={(e) =>
                                          setSelectedMember({ ...selectedMember, phone: e.target.value })
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Age</Label>
                                        <Input
                                          type="number"
                                          value={selectedMember.age || ""}
                                          onChange={(e) =>
                                            setSelectedMember({
                                              ...selectedMember,
                                              age: parseInt(e.target.value) || null,
                                            })
                                          }
                                          disabled={!isEditing}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <Select
                                          value={selectedMember.gender || ""}
                                          onValueChange={(value) =>
                                            setSelectedMember({ ...selectedMember, gender: value })
                                          }
                                          disabled={!isEditing}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Plan</Label>
                                      <Select
                                        value={selectedMember.plan || "Starter"}
                                        onValueChange={(value) =>
                                          setSelectedMember({ ...selectedMember, plan: value })
                                        }
                                        disabled={!isEditing}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Starter">Starter</SelectItem>
                                          <SelectItem value="Pro">Pro</SelectItem>
                                          <SelectItem value="Elite">Elite</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Diet Type</Label>
                                      <Select
                                        value={selectedMember.diet_type || "Vegetarian"}
                                        onValueChange={(value) =>
                                          setSelectedMember({ ...selectedMember, diet_type: value })
                                        }
                                        disabled={!isEditing}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                          <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Fitness Goal</Label>
                                      <Input
                                        value={selectedMember.fitness_goal || ""}
                                        onChange={(e) =>
                                          setSelectedMember({ ...selectedMember, fitness_goal: e.target.value })
                                        }
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    {isEditing ? (
                                      <>
                                        <Button
                                          onClick={handleUpdateMember}
                                          disabled={isSaving}
                                          className="flex-1"
                                        >
                                          {isSaving ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Saving...
                                            </>
                                          ) : (
                                            "Save Changes"
                                          )}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => setIsEditing(false)}
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    ) : (
                                      <Button onClick={() => setIsEditing(true)} className="w-full">
                                        Edit Member
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
