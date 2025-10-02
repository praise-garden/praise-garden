"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setErrorMessage("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    const { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) {
      setIsSubmitting(false);
      setErrorMessage(signupError.message);
      return;
    }
    // If email confirmations are disabled, Supabase returns a session directly
    if (signupData?.session) {
      setIsSubmitting(false);
      router.replace("/congratulations");
      return;
    }

    // Fallback: attempt immediate sign-in (covers other configurations)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (signInError) {
      const needsVerify = /confirm|verified|validate/i.test(signInError.message);
      setErrorMessage(
        needsVerify
          ? "Please confirm your email from the inbox to complete sign-in."
          : signInError.message
      );
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
        <h1 className="text-2xl font-semibold mb-1 tracking-tight">Create account</h1>
        <p className="text-sm text-white/70 mb-6">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Signup form">
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
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogle}
            className="w-full h-10 rounded-md bg-white text-black hover:opacity-90"
            aria-label="Continue with Google"
          >
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-sm text-white/80">
          Already have an account?{" "}
          <Link className="underline" href="/login" aria-label="Go to login">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;


