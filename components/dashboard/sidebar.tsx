// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Dumbbell,
//   LayoutDashboard,
//   User,
//   Scale,
//   Calendar,
//   Apple,
//   Bell,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useState } from "react";

// interface Profile {
//   id: string;
//   name: string;
//   email: string;
//   plan?: string;
// }

// const navItems = [
//   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { href: "/dashboard/profile", label: "Profile", icon: User },
//   { href: "/dashboard/weight", label: "Weight Log", icon: Scale },
//   { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
//   { href: "/dashboard/diet", label: "Diet Plan", icon: Apple },
//   { href: "/dashboard/announcements", label: "Announcements", icon: Bell },
// ];

// export function DashboardSidebar({ profile }: { profile: Profile | null }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   const handleSignOut = async () => {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     router.push("/");
//   };

//   const SidebarContent = () => (
//     <>
//       {/* Logo */}
//       <div className="p-6 border-b border-sidebar-border">
//         <Link href="/dashboard" className="flex items-center gap-3">
//           <Dumbbell className="h-8 w-8 text-sidebar-primary" />
//           <span className="text-xl font-bold text-sidebar-foreground">Revolution</span>
//         </Link>
//       </div>

//       {/* User Info */}
//       <div className="p-4 border-b border-sidebar-border">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
//             <User className="h-5 w-5 text-sidebar-accent-foreground" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-sidebar-foreground truncate">
//               {profile?.name || "Member"}
//             </p>
//             <p className="text-xs text-sidebar-foreground/60 truncate">
//               {profile?.plan || "Starter"} Plan
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-1">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               onClick={() => setIsMobileOpen(false)}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-sidebar-primary text-sidebar-primary-foreground"
//                   : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//               )}
//             >
//               <item.icon className="h-5 w-5" />
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Sign Out */}
//       <div className="p-4 border-t border-sidebar-border">
//         <Button
//           variant="ghost"
//           className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//           onClick={handleSignOut}
//         >
//           <LogOut className="h-5 w-5 mr-3" />
//           Sign Out
//         </Button>
//       </div>
//     </>
//   );

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg text-sidebar-foreground"
//       >
//         {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//       </button>

//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Mobile Sidebar */}
//       <aside
//         className={cn(
//           "lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col transform transition-transform duration-200",
//           isMobileOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <SidebarContent />
//       </aside>

//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:flex w-64 bg-sidebar flex-col border-r border-sidebar-border">
//         <SidebarContent />
//       </aside>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  LayoutDashboard,
  User,
  Scale,
  Calendar,
  Apple,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  plan?: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/weight", label: "Weight Log", icon: Scale },
  { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
  { href: "/dashboard/diet", label: "Diet Plan", icon: Apple },
  { href: "/dashboard/announcements", label: "Announcements", icon: Bell },
];

// Customize colors/labels per plan name as needed
const planStyles: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Starter: {
    bg: "bg-zinc-800/60",
    text: "text-zinc-300",
    border: "border-zinc-600",
    badge: "bg-zinc-700 text-zinc-200",
  },
  Pro: {
    bg: "bg-blue-900/40",
    text: "text-blue-200",
    border: "border-blue-500",
    badge: "bg-blue-600 text-white",
  },
  Elite: {
    bg: "bg-yellow-900/30",
    text: "text-yellow-200",
    border: "border-yellow-500",
    badge: "bg-yellow-500 text-black",
  },
};

function CurrentPlanCard({ plan }: { plan: string }) {
  const style = planStyles[plan] ?? planStyles["Starter"];

  return (
    <div className={cn("mx-4 mb-4 rounded-xl border p-3", style.bg, style.border)}>
      <div className="flex items-center justify-between mb-1">
        <span className={cn("text-xs font-semibold uppercase tracking-wider", style.text)}>
          Current Plan
        </span>
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", style.badge)}>
          {plan}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <Sparkles className={cn("h-3.5 w-3.5", style.text)} />
        <span className={cn("text-xs", style.text)}>Active membership</span>
      </div>
    </div>
  );
}

export function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Dumbbell className="h-8 w-8 text-sidebar-primary" />
          <span className="text-xl font-bold text-sidebar-foreground">Revolution</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile?.name || "Member"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {profile?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Current Plan Card */}
      <CurrentPlanCard plan={profile?.plan || "Starter"} />

      {/* Sign Out */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg text-sidebar-foreground"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col transform transition-transform duration-200",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar flex-col border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  );
}