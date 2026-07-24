"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage("The email or password is incorrect.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            Dealer Access
          </p>

          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Sign in
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Sign in to manage inventory, orders, and sales for Sideline
            Mentality Cards.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-neutral-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-green-500"
                placeholder="eric@sidelinementality.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-neutral-200"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-green-500"
                placeholder="Enter your password"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-green-500 px-5 py-3 font-black uppercase tracking-wide text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Authorized Sideline Mentality personnel only.
          </p>
        </div>
      </div>
    </main>
  );
}