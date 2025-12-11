"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  domain: z.string().min(3, "Ange en domän"),
  industry: z.string().min(2, "Ange en bransch"),
  cities: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onCreated?: () => void;
};


export default function ProjectForm({ onCreated }: Props) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Du måste vara inloggad");
      }

      // TODO: Implement project creation with Supabase
      // For now, just show success
      reset();
      onCreated?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Något gick fel.";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="domain">Domän</Label>
        <Input id="domain" placeholder="exempel.se" {...register("domain")} />
        {errors.domain && (
          <p className="text-sm text-amber-300">{errors.domain.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Bransch</Label>
        <Input id="industry" placeholder="E-handel, SaaS..." {...register("industry")} />
        {errors.industry && (
          <p className="text-sm text-amber-300">{errors.industry.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cities">Städer (kommaseparerat)</Label>
        <Input id="cities" placeholder="Stockholm, Göteborg" {...register("cities")} />
        {errors.cities && (
          <p className="text-sm text-amber-300">{errors.cities.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Lägg till projekt
      </Button>
    </form>
  );
}

