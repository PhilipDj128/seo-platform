"use client";

import React from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export async function signUp(email: string, password: string, confirmPassword: string) {
  console.log("🚀 signUp START - email:", email);
  console.log("🔑 Password length:", password.length);
  console.log("🔑 Confirm password length:", confirmPassword.length);
  
  if (password !== confirmPassword) {
    const error = "Lösenorden matchar inte";
    console.error("❌ signUp validation error:", error);
    throw new Error(error);
  }

  try {
    console.log("📡 Checking supabase client...");
    console.log("📡 Supabase client exists:", !!supabase);
    console.log("📡 Supabase auth exists:", !!supabase?.auth);
    
    console.log("📡 Calling supabase.auth.signUp...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log("📡 signUp response received");
    console.log("📡 Data:", data ? { user: data.user?.email, session: !!data.session } : null);
    
    if (error) {
      console.error("❌ Supabase signUp error:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error status:", error.status);
      console.error("❌ Error name:", error.name);
      throw new Error(error.message || "Kunde inte skapa konto");
    }

    console.log("✅ signUp SUCCESS:", data.user?.email);
    console.log("✅ User ID:", data.user?.id);
    console.log("✅ Session exists:", !!data.session);
    return data;
  } catch (err) {
    console.error("❌ signUp CATCH error:", err);
    if (err instanceof Error) {
      console.error("❌ Error name:", err.name);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error stack:", err.stack);
    }
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  console.log("🚀 signIn START - email:", email);
  console.log("🔑 Password length:", password.length);

  try {
    console.log("📡 Checking supabase client...");
    console.log("📡 Supabase client exists:", !!supabase);
    console.log("📡 Supabase auth exists:", !!supabase?.auth);
    
    console.log("📡 Calling supabase.auth.signInWithPassword...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("📡 signIn response received");
    console.log("📡 Data:", data ? { user: data.user?.email, session: !!data.session } : null);
    console.log("📡 Error:", error);

    if (error) {
      console.error("❌ Supabase signIn error:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error status:", (error as any).status);
      console.error("❌ Error name:", error.name);
      throw new Error(error.message || "Fel e-post eller lösenord");
    }

    console.log("✅ signIn SUCCESS:", data.user?.email);
    console.log("✅ User ID:", data.user?.id);
    console.log("✅ Session exists:", !!data.session);
    return data;
  } catch (err) {
    console.error("❌ signIn CATCH error:", err);
    if (err instanceof Error) {
      console.error("❌ Error name:", err.name);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error stack:", err.stack);
    }
    throw err;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  return { user, loading };
}

