export default function Navbar() {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="text-xl font-extrabold tracking-tight text-green-700">
            Sideline Mentality Cards
          </div>
  
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#" className="transition hover:text-green-700">
              Shop
            </a>
            <a href="#" className="transition hover:text-green-700">
              Football
            </a>
            <a href="#" className="transition hover:text-green-700">
              Basketball
            </a>
            <a href="#" className="transition hover:text-green-700">
              Baseball
            </a>
            <a href="#" className="transition hover:text-green-700">
              Sell
            </a>
          </nav>
  
          <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800">
            Sign In
          </button>
        </div>
      </header>
    );
  }
