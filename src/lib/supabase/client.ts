"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Client for Client Components (UX)
 * 
 * Use this in Client Components for:
 * - Login/signup forms
 * - Logout buttons
 * - User profile displays
 * - Any client-side auth interactions
 * 
 * This handles the UX layer of authentication.
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

