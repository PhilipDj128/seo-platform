"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Target, Clock } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const stats = [
    {
      title: "Aktiva projekt",
      value: "0",
      icon: Target,
      change: "+0 denna månad",
    },
    {
      title: "Genomsnittlig ranking",
      value: "—",
      icon: TrendingUp,
      change: "Ingen data än",
    },
    {
      title: "Nästa deadline",
      value: "—",
      icon: Clock,
      change: "Inga projekt",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Översikt över dina SEO-projekt och framsteg
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/new-project")}
          className="gap-2"
        >
          <Plus className="size-4" />
          Starta nytt projekt
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-white/10 bg-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <Icon className="size-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-white/10 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Snabbstart</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push("/dashboard/new-project")}
            className="w-full sm:w-auto gap-2 text-base py-3"
          >
            <Plus className="size-5" />
            Starta nytt projekt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
