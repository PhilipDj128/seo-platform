"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Logga environment variables (utan att visa hela nyckeln)
if (typeof window !== 'undefined') {
  console.log("🔧 Initializing Supabase client (CLIENT-SIDE)...");
  console.log("🔧 Supabase URL exists:", !!supabaseUrl);
  console.log("🔧 Supabase URL:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "MISSING");
  console.log("🔧 Supabase Anon Key exists:", !!supabaseAnonKey);
  console.log("🔧 Supabase Anon Key length:", supabaseAnonKey?.length || 0);
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "❌ Missing Supabase environment variables! Check Vercel settings.";
  console.error(errorMsg);
  console.error("❌ URL:", supabaseUrl || "MISSING");
  console.error("❌ Key:", supabaseAnonKey ? "EXISTS" : "MISSING");
  
  // I production, visa ett tydligt felmeddelande istället för att krascha
  if (typeof window !== 'undefined') {
    alert("❌ Supabase environment variables saknas! Kontrollera Vercel-inställningar.");
  }
  
  throw new Error("Missing Supabase environment variables");
}

export const supabase = (() => {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });
    
    if (typeof window !== 'undefined') {
      console.log("✅ Supabase client created successfully");
      console.log("✅ Supabase client has auth:", !!client.auth);
    }
    
    return client;
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error);
    if (typeof window !== 'undefined') {
      alert("❌ Kunde inte skapa Supabase client. Kontrollera environment variables.");
    }
    throw error;
  }
})();
