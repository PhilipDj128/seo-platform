"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Globe, Package, Edit, Send } from "lucide-react";
import { toast } from "sonner";

// Mock data - replace with Supabase queries
const mockProjects = [
  {
    id: "1",
    email: "kund@example.com",
    telefon: "+46 70 123 45 67",
    url: "https://yaxin.se",
    industry: "Städtjänster",
    cities: ["Luleå", "Västra Skellefteå"],
    keywords: ["städtjänster luleå", "bästa städtjänster"],
    package: "Pro",
    monthsNeeded: 6,
    monthlyPrice: 3995,
    status: "pending",
  },
];

export default function AdminPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedMonths, setEditedMonths] = useState<number>(0);

  const handleEdit = (project: typeof mockProjects[0]) => {
    setEditingId(project.id);
    setEditedMonths(project.monthsNeeded);
  };

  const handleSave = (id: string) => {
    toast.success("Tidsuppskattning uppdaterad");
    setEditingId(null);
  };

  const handleSend = (project: typeof mockProjects[0]) => {
    toast.success(`Offert skickad till ${project.email}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="mt-2 text-slate-400">
          Hantera inkomna projekt och offerter
        </p>
      </div>

      <div className="space-y-4">
        {mockProjects.map((project) => (
          <Card key={project.id} className="border-white/10 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Projekt #{project.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="size-4" />
                  <span>{project.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="size-4" />
                  <span>{project.telefon}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="size-4" />
                  <span>{project.url}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Package className="size-4" />
                  <span>{project.package}</span>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-400 mb-2">Nyckelord:</div>
                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-slate-400">Tidsuppskattning</Label>
                  {editingId === project.id ? (
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="number"
                        value={editedMonths}
                        onChange={(e) => setEditedMonths(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="self-center text-slate-400">månader</span>
                      <Button
                        onClick={() => handleSave(project.id)}
                        className="text-sm"
                      >
                        Spara
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 text-white">{project.monthsNeeded} månader</div>
                  )}
                </div>
                <div>
                  <Label className="text-slate-400">Månadspris</Label>
                  <div className="mt-2 text-white">
                    {project.monthlyPrice.toLocaleString()} kr
                  </div>
                </div>
                <div>
                  <Label className="text-slate-400">Status</Label>
                  <div className="mt-2">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
                      Väntar
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(project)}
                  className="gap-2"
                >
                  <Edit className="size-4" />
                  Redigera tid
                </Button>
                <Button
                  onClick={() => handleSend(project)}
                  className="gap-2"
                >
                  <Send className="size-4" />
                  Skicka offert
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

