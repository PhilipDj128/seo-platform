"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL eller anon key saknas. Kontrollera miljövariabler.");
}

const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const createBrowserClient = () => supabase;

type AuthResult = {
  user: User | null;
  loading: boolean;
};

const friendlyError = (message?: string) =>
  message ?? "Ett oväntat fel uppstod. Försök igen.";

export async function signUp(
  email: string,
  password: string,
  confirmPassword: string
) {
  console.log("🚀 signUp called with:", { email });

  if (password !== confirmPassword) {
    throw new Error("Lösenorden matchar inte");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("❌ Supabase signUp error:", error);
    throw new Error(error.message || "Kunde inte skapa konto");
  }

  console.log("✅ Supabase signUp success:", data.user?.email);
  return data; // data.user, data.session
}

export async function signIn(email: string, password: string) {
  console.log("🚀 signIn called with:", { email });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("❌ Supabase signIn error:", error);
    throw new Error(error.message || "Fel e-post eller lösenord");
  }

  console.log("✅ Supabase signIn success:", data.user?.email);
  return data; // data.user, data.session
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(friendlyError(error.message));
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(friendlyError(error.message));
  return data.user;
}

export function useAuth(): AuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return useMemo(
    () => ({
      user,
      loading,
    }),
    [user, loading]
  );
}

