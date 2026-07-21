"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function CustomerLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setErrorMessage("");

    const { error } = await supabaseBrowser.auth.signOut();

    if (error) {
      setErrorMessage("You could not be signed out. Please try again.");
      setIsLoggingOut(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-xl border border-red-500/30 px-5 py-3 text-sm font-bold text-red-300 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingOut ? "Signing Out..." : "Sign Out"}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-sm text-red-300">{errorMessage}</p>
      ) : null}
    </div>
  );
}