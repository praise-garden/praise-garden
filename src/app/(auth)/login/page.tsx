"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.replace("/congratulations");
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.replace("/congratulations");
  };

  const handleGoogle = async () => {
    setErrorMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/congratulations` },
    });
    if (error) setErrorMessage(error.message);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        <h1 className="text-2xl font-semibold mb-1 tracking-tight">Welcome back</h1>
        <p className="text-sm text-white/70 mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
              aria-invalid={!!errorMessage && !email}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
              aria-invalid={!!errorMessage && !password}
            />
          </div>

          {errorMessage ? (
            <div role="alert" className="text-sm text-red-400">{errorMessage}</div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogle}
            className="w-full h-10 rounded-md bg-white text-black hover:opacity-90"
            aria-label="Sign in with Google"
          >
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-sm text-white/80">
          Don&apos;t have an account?{" "}
          <Link className="underline" href="/signup" aria-label="Go to signup">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;


