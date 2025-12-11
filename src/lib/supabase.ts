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

// Helper function för att synka session till cookies
export async function syncSessionToCookies() {
  if (typeof window === 'undefined') return;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      // Sätt cookie manuellt för att middleware ska kunna läsa den
      document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=3600; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
      document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=604800; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
      console.log("✅ Session synced to cookies");
    }
  } catch (error) {
    console.error("❌ Failed to sync session to cookies:", error);
  }
}
