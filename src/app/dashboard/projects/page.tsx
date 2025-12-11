"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projekt</h1>
          <p className="mt-2 text-slate-400">
            Hantera dina SEO-projekt och följ framstegen
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

      {/* Empty State */}
      <Card className="border-white/10 bg-slate-900/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand-500/10">
            <FolderKanban className="size-8 text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Inga projekt än</h3>
          <p className="mt-2 text-center text-slate-400 max-w-md">
            Kom igång genom att starta ditt första SEO-projekt. Vi hjälper dig
            att analysera din hemsida och skapa en anpassad SEO-strategi.
          </p>
          <Button
            onClick={() => router.push("/dashboard/new-project")}
            className="mt-6 gap-2"
          >
            <Plus className="size-4" />
            Starta nytt projekt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
