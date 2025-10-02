"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const CongratulationsPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email ?? null);
    };
    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Congratulations 🎉</h1>
        <p className="mt-2 text-white/80">
          {email ? `You are signed in as ${email}.` : "Loading..."}
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 h-10 px-4 rounded-md bg-foreground text-background hover:opacity-90"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    </main>
  );
};

export default CongratulationsPage;


