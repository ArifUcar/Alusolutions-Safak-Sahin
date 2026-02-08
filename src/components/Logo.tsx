interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 24, className = '' }: LogoIconProps) {
  return (
    <svg
      viewBox="-1 4 26 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      {/* 3D Veranda with glass roof */}
      <path d="M1 10H17"/>
      <path d="M17 10L23 6"/>
      <path d="M1 10L7 6"/>
      <path d="M7 6H23"/>
      {/* Glass panel lines - roof */}
      <path d="M4 9.5L10 6" strokeWidth="1" opacity="0.4"/>
      <path d="M9 9L15 5.5" strokeWidth="1" opacity="0.4"/>
      <path d="M14 8.5L20 5" strokeWidth="1" opacity="0.4"/>
      {/* Legs - front only */}
      <path d="M1 10V20"/>
      <path d="M17 10V20"/>
      {/* Glass panel lines - front side */}
      <path d="M5 10V19" strokeWidth="1" opacity="0.4"/>
      <path d="M9 10V19" strokeWidth="1" opacity="0.4"/>
      <path d="M13 10V19" strokeWidth="1" opacity="0.4"/>
      {/* Glass panel lines - right side */}
      <path d="M18.5 9.5V19" strokeWidth="1" opacity="0.4"/>
      <path d="M20 8.25V18" strokeWidth="1" opacity="0.4"/>
      <path d="M21.5 7V17" strokeWidth="1" opacity="0.4"/>
    </svg>
  )
}

export default LogoIcon
