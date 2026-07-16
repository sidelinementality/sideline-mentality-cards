import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <a href="/" className="flex items-center">
          <Image
            src="/sideline-mentality-logo.png"
            alt="Sideline Mentality"
            width={180}
            height={80}
            priority
          />
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-wide text-white md:flex">
          <a href="#" className="transition hover:text-green-400">
            Shop
          </a>
          <a href="#" className="transition hover:text-green-400">
            Football
          </a>
          <a href="#" className="transition hover:text-green-400">
            Basketball
          </a>
          <a href="#" className="transition hover:text-green-400">
            Baseball
          </a>
          <a href="#" className="transition hover:text-green-400">
            Market
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-500 hover:text-white">
            Sign In
          </button>
        </div>

      </div>
    </header>
  );
}