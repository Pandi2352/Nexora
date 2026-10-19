import type { FC, SVGProps } from 'react'

type SvgProps = SVGProps<SVGSVGElement>

export const NotFoundIllustration: FC<SvgProps> = (props) => (
  <svg viewBox="0 0 200 160" fill="none" className="size-44 sm:size-52" {...props}>
    <circle cx="100" cy="80" r="64" className="stroke-cyan-100 dark:stroke-cyan-950" strokeWidth="1.5" strokeDasharray="4 4" />
    <circle cx="100" cy="80" r="44" className="stroke-teal-200/80" strokeWidth="1.5" />
    <path d="M70 65 L90 40 L130 40 L110 65 Z" fill="#0d9488" fillOpacity="0.12" stroke="#0d9488" strokeWidth="1.5" />
    <path d="M90 115 L110 90 L150 90 L130 115 Z" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="1.5" />
    <circle cx="68" cy="80" r="4" fill="#0d9488" />
    <circle cx="132" cy="80" r="4" fill="#06b6d4" />
    <circle cx="100" cy="48" r="3" fill="#0891b2" />
    <circle cx="100" cy="112" r="3" fill="#0f766e" />
    <line x1="72" y1="80" x2="94" y2="80" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="106" y1="80" x2="128" y2="80" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
    <text x="100" y="85" textAnchor="middle" fill="#0f766e" fontSize="13" fontWeight="bold" fontFamily="monospace">404</text>
  </svg>
)

export const ForbiddenIllustration: FC<SvgProps> = (props) => (
  <svg viewBox="0 0 200 160" fill="none" className="size-44 sm:size-52" {...props}>
    <polygon points="100,24 144,48 144,104 100,136 56,104 56,48" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
    <polygon points="100,38 132,56 132,96 100,120 68,96 68,56" fill="#fff" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
    <rect x="86" y="74" width="28" height="24" rx="4" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="1.5" />
    <path d="M92 74 V64 A8 8 0 0 1 108 64 V74" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="100" cy="84" r="2.5" fill="#dc2626" />
    <line x1="100" y1="86.5" x2="100" y2="92" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="44" cy="48" r="2" fill="#f87171" />
    <circle cx="156" cy="112" r="2" fill="#f87171" />
  </svg>
)

export const UnauthorizedIllustration: FC<SvgProps> = (props) => (
  <svg viewBox="0 0 200 160" fill="none" className="size-44 sm:size-52" {...props}>
    <rect x="58" y="44" width="84" height="72" rx="8" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="1.5" />
    <line x1="58" y1="64" x2="142" y2="64" stroke="#0d9488" strokeWidth="1.5" />
    <rect x="68" y="74" width="22" height="18" rx="3" fill="#0d9488" fillOpacity="0.2" stroke="#0d9488" strokeWidth="1" />
    <circle cx="118" cy="84" r="8" fill="#fff" stroke="#0d9488" strokeWidth="1.5" />
    <path d="M115 84 A3 3 0 0 1 121 84" stroke="#0f766e" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="118" y1="87" x2="118" y2="90" stroke="#0f766e" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="68" y1="102" x2="100" y2="102" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const ServerErrorIllustration: FC<SvgProps> = (props) => (
  <svg viewBox="0 0 200 160" fill="none" className="size-44 sm:size-52" {...props}>
    <rect x="62" y="32" width="76" height="24" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
    <circle cx="74" cy="44" r="3" fill="#22c55e" />
    <circle cx="84" cy="44" r="3" fill="#cbd5e1" />
    <line x1="98" y1="44" x2="126" y2="44" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="62" y="64" width="76" height="24" rx="4" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
    <circle cx="74" cy="76" r="3" fill="#ef4444" />
    <circle cx="84" cy="76" r="3" fill="#fca5a5" />
    <path d="M98 76 L108 72 L116 80 L126 76" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="62" y="96" width="76" height="24" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
    <circle cx="74" cy="108" r="3" fill="#22c55e" />
    <circle cx="84" cy="108" r="3" fill="#cbd5e1" />
    <line x1="98" y1="108" x2="126" y2="108" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 44 H56 V76 H50" stroke="#0891b2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M150 76 H144 V108 H150" stroke="#0891b2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const NetworkErrorIllustration: FC<SvgProps> = (props) => (
  <svg viewBox="0 0 200 160" fill="none" className="size-44 sm:size-52" {...props}>
    <circle cx="100" cy="116" r="6" fill="#0d9488" />
    <path d="M84 96 A24 24 0 0 1 116 96" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
    <path d="M72 80 A42 42 0 0 1 128 80" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 64 A60 60 0 0 1 140 64" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    <line x1="68" y1="124" x2="132" y2="56" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const GenericErrorIllustration: FC<SvgProps> = (props) => (
  <svg viewBox="0 0 200 160" fill="none" className="size-44 sm:size-52" {...props}>
    <circle cx="100" cy="80" r="52" fill="#f0fdfa" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="4 4" />
    <polygon points="100,42 128,94 72,94" fill="#fff" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
    <line x1="100" y1="58" x2="100" y2="76" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
    <circle cx="100" cy="86" r="1.5" fill="#d97706" />
    <circle cx="54" cy="56" r="3" fill="#0891b2" />
    <circle cx="146" cy="104" r="3" fill="#0d9488" />
  </svg>
)

export function renderErrorIllustration(errorKey: string, status?: number) {
  if (status === 404 || errorKey === 'NOT_FOUND') return <NotFoundIllustration />
  if (status === 403 || errorKey === 'FORBIDDEN') return <ForbiddenIllustration />
  if (status === 401 || errorKey === 'UNAUTHORIZED') return <UnauthorizedIllustration />
  if ((status && status >= 500) || errorKey === 'SERVER_ERROR' || errorKey === 'SERVICE_UNAVAILABLE' || errorKey === 'BAD_GATEWAY' || errorKey === 'GATEWAY_TIMEOUT') {
    return <ServerErrorIllustration />
  }
  if (errorKey === 'NETWORK_ERROR') return <NetworkErrorIllustration />
  return <GenericErrorIllustration />
}
