"use client";

import { useEffect } from "react";
import LoginForm from "@/components/Auth/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  useEffect(() => {
    console.log("📄 LoginPage component mounted");
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md items-center px-4 py-16">
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Välkommen tillbaka</h1>
          <p className="mt-2 text-slate-400">
            Logga in för att fortsätta din SEO-resa
          </p>
        </div>
        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Logga in</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-slate-400">
              Saknar du konto?{" "}
              <Link
                href="/signup"
                className="font-medium text-brand-400 hover:text-brand-300"
              >
                Skapa konto
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
