import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: any) => {
            cookieStore.set({ name, value, ...options });
          },
          remove: (name: string, options: any) => {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      }
    );

    // Hämta access token från request body
    const { access_token, refresh_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ error: "No access token" }, { status: 400 });
    }

    // Sätt sessionen i Supabase client så att cookies sätts korrekt
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token: refresh_token || "",
    });

    if (error) {
      console.error("❌ Error setting session:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error("❌ Error in sync route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

