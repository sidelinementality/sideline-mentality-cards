"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function DealerLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    const { error } = await supabaseBrowser.auth.signOut();

    if (error) {
      console.error("Dealer logout error:", error.message);
      setIsLoggingOut(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="mt-3 w-full rounded-lg border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoggingOut ? "Signing Out..." : "Sign Out"}
    </button>
  );
}