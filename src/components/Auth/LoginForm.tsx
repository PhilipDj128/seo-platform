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
      const result = await signIn(values.email, values.password);
      
      if (!result?.session) {
        throw new Error("Ingen session skapades. Försök igen.");
      }

      toast.success("Välkommen tillbaka!", {
        description: "Du loggas in...",
      });

      // Vänta lite för att sessionen ska synkas korrekt
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Använd window.location för full reload för att säkerställa session-synkning
      window.location.href = "/dashboard";
    } catch (err) {
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
