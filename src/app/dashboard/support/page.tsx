"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Support</h1>
        <p className="mt-2 text-slate-400">
          Behöver du hjälp? Kontakta oss här
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-white/10 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="size-5" />
              E-post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">
              Skicka ett e-postmeddelande till vårt supportteam
            </p>
            <Button variant="secondary" className="w-full">
              support@seoplatform.se
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="size-5" />
              Kontaktformulär
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Ämne</Label>
              <Input id="subject" placeholder="Hur kan vi hjälpa?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Meddelande</Label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                placeholder="Beskriv ditt problem..."
              />
            </div>
            <Button
              onClick={() => toast.success("Meddelande skickat! Vi återkommer snart.")}
              className="w-full"
            >
              Skicka
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

