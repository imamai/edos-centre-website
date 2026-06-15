import { cn } from "@/lib/utils";

export default function EdosLogoMark({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ecm" x1="4" y1="38" x2="31" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C81920" />
            <stop offset="100%" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="ecp" x1="25" y1="22" x2="42" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF7070" />
            <stop offset="100%" stopColor="#FFB3B3" />
          </linearGradient>
        </defs>

        {/* Main rounded diamond */}
        <rect x="7" y="14" width="20" height="20" rx="4" transform="rotate(45 17 24)" fill="url(#ecm)" />

        {/* White C-bracket — 3 sides of a rounded rectangle, opening to the right */}
        <path
          d="M21 14 H14 Q9 14 9 19 V29 Q9 34 14 34 H21"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Plus element — two capsules forming a cross, upper-right of diamond */}
        <rect x="25" y="16" width="13" height="4" rx="2" fill="url(#ecp)" />
        <rect x="28" y="12" width="4" height="10" rx="2" fill="url(#ecp)" />

        {/* Floating dot above the plus */}
        <rect x="35.5" y="3.5" width="5" height="5" rx="1.2" transform="rotate(45 38 6)" fill="#FFB3B3" />
      </svg>

      <span
        className={cn(
          "font-display font-bold text-xl leading-none tracking-tight select-none",
          dark ? "text-brand-navy" : "text-white"
        )}
      >
        <span className={dark ? "text-brand-purple" : "text-white"}>edos</span>
        <span className="text-brand-red"> centre</span>
      </span>
    </div>
  );
}
