"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { signIn } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    console.log("🚀 FORM SUBMITTED - Email:", values.email);
    setLoading(true);
    setStatusMessage("Loggar in...");
    
    // Visa omedelbar feedback
    toast.info("Loggar in...", {
      description: "Vänta medan vi loggar in dig",
    });

    try {
      setStatusMessage("Kontaktar servern...");
      console.log("🔐 Calling signIn function...");
      const result = await signIn(values.email, values.password);
      
      console.log("📡 SignIn result received:", {
        hasResult: !!result,
        hasUser: !!result?.user,
        userEmail: result?.user?.email,
        hasSession: !!result?.session,
        sessionToken: result?.session?.access_token ? "EXISTS" : "MISSING"
      });
      
      if (!result) {
        console.error("❌ No result from signIn");
        setStatusMessage("❌ Inget svar från servern");
        throw new Error("Inget svar från servern. Försök igen.");
      }

      if (!result.session) {
        console.error("❌ No session in result");
        setStatusMessage("❌ Ingen session skapades");
        throw new Error("Ingen session skapades. Kontrollera dina uppgifter.");
      }

      console.log("✅ Session created successfully!");
      setStatusMessage("✅ Inloggning lyckades! Omdirigerar...");

      toast.success("Inloggning lyckades!", {
        description: "Omdirigerar till dashboard...",
      });

      // Vänta och verifiera att sessionen är synkad i localStorage/cookies
      console.log("🔄 Verifying session sync...");
      let sessionSynced = false;
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          console.log(`✅ Session synced after ${i + 1} attempts`);
          sessionSynced = true;
          break;
        }
      }

      if (!sessionSynced) {
        console.warn("⚠️ Session not fully synced, but redirecting anyway");
      }

      // Synka session till cookies via API så att middleware kan läsa den
      console.log("🔄 Syncing session to cookies via API...");
      try {
        const syncResponse = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          }),
        });

        if (syncResponse.ok) {
          console.log("✅ Session synced to cookies successfully");
        } else {
          console.warn("⚠️ Failed to sync session to cookies, but continuing anyway");
        }
      } catch (err) {
        console.warn("⚠️ Error syncing session to cookies:", err);
      }
      
      // Extra väntan för cookie-synkning
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("🚀 Redirecting to /dashboard...");
      console.log("🚀 Current URL:", window.location.href);
      
      // Använd window.location.replace för full reload så middleware kan läsa cookies
      window.location.replace("/dashboard");
      
    } catch (err) {
      console.error("❌ LOGIN ERROR CAUGHT:", err);
      console.error("❌ Error type:", typeof err);
      console.error("❌ Error instanceof Error:", err instanceof Error);
      
      const message = err instanceof Error 
        ? err.message 
        : typeof err === 'string' 
          ? err 
          : "Ett oväntat fel uppstod. Försök igen.";
      
      console.error("❌ Error message to show:", message);
      setStatusMessage(`❌ ${message}`);
      
      toast.error("Inloggning misslyckades", {
        description: message,
        duration: 5000,
      });
      
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">E-post</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="du@bolag.se"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {statusMessage && (
        <div className={`rounded-lg p-3 text-sm ${
          statusMessage.startsWith("❌") 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : statusMessage.startsWith("✅")
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        }`}>
          {statusMessage}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loggar in..." : "Logga in"}
      </Button>
    </form>
  );
}
