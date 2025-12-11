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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      console.log("🔐 Starting login process...");
      const result = await signIn(values.email, values.password);
      
      console.log("📡 SignIn result:", result ? { user: result.user?.email, hasSession: !!result.session } : null);
      
      if (!result?.session) {
        console.error("❌ No session in result");
        throw new Error("Ingen session skapades. Försök igen.");
      }

      console.log("✅ Session created, verifying...");

      toast.success("Välkommen tillbaka!", {
        description: "Du loggas in...",
      });

      // Vänta och verifiera att sessionen är korrekt synkad
      let sessionVerified = false;
      let attempts = 0;
      for (let i = 0; i < 15; i++) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 400));
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log(`🔄 Attempt ${attempts}:`, { hasSession: !!session, hasUser: !!session?.user, error });
        if (session?.user) {
          sessionVerified = true;
          console.log("✅ Session verified!");
          break;
        }
      }

      if (!sessionVerified) {
        console.error("❌ Session verification failed after", attempts, "attempts");
        // Försök ändå att redirecta - sessionen kanske synkas senare
        console.log("⚠️ Redirecting anyway - session may sync later");
      }

      // Vänta lite extra för cookie-synkning i production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("🚀 Redirecting to dashboard...");
      // Använd window.location för full reload för att säkerställa session-synkning
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Login error:", err);
      const message = err instanceof Error ? err.message : "Ett oväntat fel uppstod.";
      toast.error("Inloggning misslyckades", {
        description: message,
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loggar in..." : "Logga in"}
      </Button>
    </form>
  );
}
