"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔧 Initializing Supabase client...");
console.log("🔧 Supabase URL exists:", !!supabaseUrl);
console.log("🔧 Supabase URL length:", supabaseUrl?.length || 0);
console.log("🔧 Supabase URL starts with https:", supabaseUrl?.startsWith("https://") || false);
console.log("🔧 Supabase Anon Key exists:", !!supabaseAnonKey);
console.log("🔧 Supabase Anon Key length:", supabaseAnonKey?.length || 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error("❌ URL:", supabaseUrl || "MISSING");
  console.error("❌ Key:", supabaseAnonKey ? "EXISTS" : "MISSING");
  throw new Error("Missing Supabase environment variables");
}

export const supabase = (() => {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    console.log("✅ Supabase client created successfully");
    console.log("✅ Supabase client has auth:", !!client.auth);
    return client;
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error);
    throw error;
  }
})();
