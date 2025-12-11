import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// For app router (Next.js server components / middleware)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        cookieStore.set({ name, value, ...options });
      },
      remove: (name: string, options: CookieOptions) => {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
};

// For pages/api routes (uses req/res cookies, not next/headers)
export const createSupabaseServerClient = (
  req: NextApiRequest,
  res: NextApiResponse
) =>
  createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies[name];
      },
      set(name: string, value: string, options: CookieOptions) {
        res.setHeader("Set-Cookie", serializeCookie(name, value, options));
      },
      remove(name: string, options: CookieOptions) {
        res.setHeader("Set-Cookie", serializeCookie(name, "", { ...options, maxAge: 0 }));
      },
    },
  });

const serializeCookie = (name: string, value: string, options: CookieOptions): string => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    ...options,
  };
  
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (cookieOptions.path) parts.push(`Path=${cookieOptions.path}`);
  if (cookieOptions.maxAge !== undefined) parts.push(`Max-Age=${cookieOptions.maxAge}`);
  if (cookieOptions.httpOnly) parts.push("HttpOnly");
  if (cookieOptions.sameSite) {
    const sameSiteValue = typeof cookieOptions.sameSite === "string" 
      ? cookieOptions.sameSite 
      : "Lax";
    parts.push(`SameSite=${sameSiteValue}`);
  }
  if (cookieOptions.secure) parts.push("Secure");
  
  return parts.join("; ");
};

