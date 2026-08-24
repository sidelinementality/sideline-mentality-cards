type CardsWordmarkProps = {
    className?: string;
    compact?: boolean;
  };
  
  export default function CardsWordmark({
    className = "",
    compact = false,
  }: CardsWordmarkProps) {
    return (
      <div
        className={`group inline-flex items-center gap-3 ${className}`.trim()}
        aria-label="Sideline Mentality Cards"
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-xl transition duration-300 group-hover:bg-green-500/30" />
  
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-green-500/35 bg-neutral-950 shadow-[0_10px_30px_rgba(34,197,94,0.14)] ring-1 ring-white/10 ${
              compact
                ? "h-12 w-12"
                : "h-14 w-14 sm:h-16 sm:w-16"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_52%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_42%)]" />
  
            <svg
              viewBox="0 0 64 64"
              className={`relative text-green-400 ${
                compact ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10"
              }`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="12"
                y="18"
                width="20"
                height="28"
                rx="3"
                stroke="currentColor"
                strokeWidth="2.6"
                opacity="0.7"
                transform="rotate(-10 12 18)"
              />
              <rect
                x="22"
                y="12"
                width="20"
                height="28"
                rx="3"
                stroke="currentColor"
                strokeWidth="2.6"
                opacity="0.9"
              />
              <rect
                x="32"
                y="18"
                width="20"
                height="28"
                rx="3"
                stroke="currentColor"
                strokeWidth="2.6"
                opacity="0.7"
                transform="rotate(10 32 18)"
              />
              <path
                d="M32 21.5L33.8 25.2L37.9 25.8L34.95 28.7L35.65 32.8L32 30.85L28.35 32.8L29.05 28.7L26.1 25.8L30.2 25.2L32 21.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
  
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="block h-px w-5 bg-green-500/70" />
  
            <p className="truncate text-[11px] font-black uppercase tracking-[0.26em] text-white sm:text-xs">
              Sideline Mentality
            </p>
          </div>
  
          <p className="mt-1 text-base font-black uppercase tracking-[0.28em] text-green-400 sm:text-lg">
            Cards
          </p>
        </div>
      </div>
    );
  }