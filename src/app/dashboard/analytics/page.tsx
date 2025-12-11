"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analys</h1>
        <p className="mt-2 text-slate-400">
          Detaljerad analys av dina SEO-projekt
        </p>
      </div>

      <Card className="border-white/10 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Kommer snart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            Detaljerad analys och rapporter kommer att vara tillgängliga här när du har aktiva projekt.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

