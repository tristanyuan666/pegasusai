import { createServerClient, createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are not available");
    return null;
  }

  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Client-side
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  // Server-side - use dynamic import for cookies
  const { cookies } = require("next/headers");

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        try {
          return cookies().getAll();
        } catch (error) {
          console.warn("Failed to get cookies:", error);
          return [];
        }
      },
      setAll(cookiesToSet: any[]) {
        try {
          const cookieStore = cookies();
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.warn("Failed to set cookies:", error);
        }
      },
    },
  });
};
