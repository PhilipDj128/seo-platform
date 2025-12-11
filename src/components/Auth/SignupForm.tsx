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
import { signUp } from "@/lib/auth";

const schema = z
  .object({
    email: z.string().email("Ogiltig e-postadress"),
    password: z.string().min(6, "Minst 6 tecken"),
    confirmPassword: z.string().min(6, "Minst 6 tecken"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupForm() {
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
    console.log("📝 Form submitted");
    console.log("📝 Email:", values.email);
    console.log("📝 Password length:", values.password.length);
    console.log("📝 Confirm password length:", values.confirmPassword.length);
    
    setLoading(true);
    try {
      console.log("🔐 Calling signUp function...");
      const result = await signUp(values.email, values.password, values.confirmPassword);
      console.log("✅ signUp succeeded!");
      console.log("✅ Result:", result ? { user: result.user?.email, session: !!result.session } : null);
      
      toast.success("Konto skapat!", {
        description: "Du loggas in automatiskt...",
      });
      
      console.log("🔄 Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Form submission error caught");
      console.error("❌ Error type:", err instanceof Error ? "Error" : typeof err);
      console.error("❌ Error:", err);
      
      const message = err instanceof Error ? err.message : "Ett oväntat fel uppstod.";
      console.error("❌ Error message to show:", message);
      
      toast.error("Kunde inte skapa konto", {
        description: message,
      });
    } finally {
      console.log("🏁 Form submission finished");
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
          autoComplete="new-password"
          placeholder="Minst 6 tecken"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Upprepa lösenord"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Skapar konto..." : "Skapa konto"}
      </Button>
    </form>
  );
}
