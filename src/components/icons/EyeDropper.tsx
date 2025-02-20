interface EyeDropperProps {
  className?: string;
}

export function EyeDropper({ className }: EyeDropperProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z" />
      <path d="m15 6-6 6" />
      <path d="m16 7-1.4 1.4" />
    </svg>
  );
} 