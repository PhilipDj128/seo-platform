"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Inställningar</h1>
        <p className="mt-2 text-slate-400">
          Hantera dina kontoinställningar
        </p>
      </div>

      <Card className="border-white/10 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Kontoinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-white/5"
            />
          </div>
          <Button disabled>Uppdatera inställningar (kommer snart)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
