"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type StorefrontShellProps = {
  children: React.ReactNode;
};

export default function StorefrontShell({
  children,
}: StorefrontShellProps) {
  const pathname = usePathname();

  const isDealerArea =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/dealer");

  if (isDealerArea) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}