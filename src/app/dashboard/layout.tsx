"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  BarChart3, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  User,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Översikt", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projekt", icon: FolderKanban },
  { href: "/dashboard/customer", label: "Min Portal", icon: User },
  { href: "/dashboard/analytics", label: "Analys", icon: BarChart3 },
  { href: "/dashboard/admin", label: "Admin Dashboard", icon: Shield },
  { href: "/dashboard/settings", label: "Inställningar", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Ge extra tid för session-synkning i production
    if (!loading && !user) {
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkSession = async () => {
        attempts++;
        console.log(`🔄 Checking session (attempt ${attempts}/${maxAttempts})...`);
        
        // Kontrollera både localStorage (client) och försök läsa från cookies
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("✅ Session found, staying on dashboard");
          // Trigger auth state change för att uppdatera useAuth
          return;
        }
        
        if (attempts < maxAttempts) {
          // Vänta lite längre och försök igen
          setTimeout(checkSession, 500);
        } else {
          console.log("❌ No session found after all attempts, redirecting to login");
          router.push("/login");
        }
      };
      
      // Starta första kontrollen efter 1 sekund
      const timer = setTimeout(checkSession, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Utloggad");
      router.push("/login");
    } catch (error) {
      toast.error("Kunde inte logga ut");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/5 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400" />
              <span className="text-lg font-semibold text-white">SEO Platform</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-500/10 text-brand-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-white/5 p-4">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand-500/20">
                <User className="size-5 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user.email}
                </p>
                <p className="text-xs text-slate-400">Användare</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="mt-2 w-full justify-start gap-2"
            >
              <LogOut className="size-4" />
              Logga ut
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="size-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <div className="size-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                  <User className="size-4 text-brand-400" />
                </div>
                <span className="text-sm text-slate-300">{user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
