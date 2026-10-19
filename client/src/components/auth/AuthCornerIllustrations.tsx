/**
 * Corner illustrations for authentication pages (Login, Register, Forgot Password, Reset Password),
 * anchored directly flush against the bottom-left and bottom-right edges with zero spacing.
 */
export function AuthCornerIllustrations() {
  return (
    <>
      {/* Bottom-Left Corner: Team Collaboration & Architecture Podium */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 hidden md:block w-64 md:w-80 lg:w-96 xl:w-[420px] select-none z-0 leading-none"
      >
        <svg
          viewBox="0 0 380 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="xMinYMax meet"
        >
          {/* Isometric Podium Base flush with left x=0 and bottom y=260 */}
          <path d="M0 200 L120 140 L240 200 L120 260 Z" fill="#0284C7" fillOpacity="0.85" />
          <path d="M0 200 L120 260 V260 H0 Z" fill="#0369A1" />
          <path d="M120 260 L240 200 V260 L120 260 Z" fill="#075985" />

          {/* Stepped platform */}
          <path d="M50 175 L130 135 L190 165 L110 205 Z" fill="#38BDF8" fillOpacity="0.9" />
          <path d="M130 135 L190 165 V190 L130 160 Z" fill="#0284C7" />

          {/* Hologram / Grid Blueprint lines */}
          <path d="M60 170 L120 140 M75 177 L135 147 M90 185 L150 155" stroke="#BAE6FD" strokeWidth="1.5" />
          <path d="M80 160 L100 190 M100 150 L120 180 M120 140 L140 170" stroke="#BAE6FD" strokeWidth="1.5" />

          {/* Floating UI dashboard card */}
          <rect x="160" y="55" width="75" height="95" rx="4" fill="#FFFFFF" stroke="#E0F2FE" strokeWidth="2" />
          <rect x="170" y="68" width="55" height="9" rx="2" fill="#0284C7" />
          <rect x="170" y="83" width="32" height="5" rx="1.5" fill="#94A3B8" />
          <rect x="170" y="93" width="48" height="5" rx="1.5" fill="#CBD5E1" />
          <rect x="170" y="103" width="40" height="5" rx="1.5" fill="#E2E8F0" />
          <circle cx="180" cy="126" r="6.5" fill="#10B981" />
          <circle cx="198" cy="126" r="6.5" fill="#F59E0B" />

          {/* Stylized Figure 1 (Architect) */}
          <circle cx="75" cy="115" r="7.5" fill="#F59E0B" />
          <rect x="70" y="125" width="10" height="25" rx="3" fill="#D97706" />
          <rect x="66" y="150" width="6" height="22" rx="2" fill="#1E293B" />
          <rect x="78" y="150" width="6" height="22" rx="2" fill="#1E293B" />

          {/* Stylized Figure 2 (Engineer holding tablet) */}
          <circle cx="135" cy="98" r="7.5" fill="#0284C7" />
          <rect x="130" y="108" width="10" height="26" rx="3" fill="#0369A1" />
          <rect x="126" y="134" width="6" height="24" rx="2" fill="#0F172A" />
          <rect x="138" y="134" width="6" height="24" rx="2" fill="#0F172A" />
          <rect x="142" y="116" width="14" height="9" rx="1.5" fill="#BAE6FD" />
        </svg>
      </div>

      {/* Bottom-Right Corner: Analytics & Document Podium */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden md:block w-64 md:w-80 lg:w-96 xl:w-[420px] select-none z-0 leading-none"
      >
        <svg
          viewBox="0 0 380 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="xMaxYMax meet"
        >
          {/* Isometric Podium Base flush with right x=380 and bottom y=260 */}
          <path d="M140 200 L260 140 L380 200 L260 260 Z" fill="#0EA5E9" fillOpacity="0.85" />
          <path d="M140 200 L260 260 V260 H140 Z" fill="#0284C7" />
          <path d="M260 260 L380 200 V260 H260 Z" fill="#0369A1" />

          {/* Stepped platform */}
          <path d="M190 175 L270 135 L330 165 L250 205 Z" fill="#38BDF8" fillOpacity="0.9" />

          {/* Analytics document sheet */}
          <g transform="translate(230, 30) rotate(-6)">
            <rect width="80" height="110" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="12" y="16" width="40" height="8" rx="2" fill="#0284C7" />
            <circle cx="22" cy="40" r="12" fill="#E0F2FE" />
            <path d="M22 28A12 12 0 0 1 34 40H22Z" fill="#0284C7" />
            <rect x="42" y="32" width="26" height="5" rx="1.5" fill="#94A3B8" />
            <rect x="42" y="42" width="20" height="5" rx="1.5" fill="#CBD5E1" />
            <rect x="12" y="62" width="56" height="4" rx="1" fill="#E2E8F0" />
            <rect x="12" y="72" width="44" height="4" rx="1" fill="#E2E8F0" />
          </g>

          {/* Giant Magnifying Glass Motif */}
          <g transform="translate(275, 20) rotate(22)">
            <circle cx="36" cy="36" r="26" stroke="#0284C7" strokeWidth="8" fill="#BAE6FD" fillOpacity="0.35" />
            <path d="M55 55L75 80" stroke="#0369A1" strokeWidth="10" strokeLinecap="round" />
            <path d="M24 30L34 22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Stylized Figure 3 (Analyst) */}
          <circle cx="215" cy="115" r="7.5" fill="#10B981" />
          <rect x="210" y="125" width="10" height="26" rx="3" fill="#059669" />
          <rect x="206" y="151" width="6" height="24" rx="2" fill="#1E293B" />
          <rect x="218" y="151" width="6" height="24" rx="2" fill="#1E293B" />

          {/* Stylized Figure 4 (Inspector) */}
          <circle cx="320" cy="130" r="7.5" fill="#F43F5E" />
          <rect x="315" y="140" width="10" height="24" rx="3" fill="#E11D48" />
          <rect x="311" y="164" width="6" height="20" rx="2" fill="#0F172A" />
          <rect x="323" y="164" width="6" height="20" rx="2" fill="#0F172A" />
        </svg>
      </div>
    </>
  )
}
