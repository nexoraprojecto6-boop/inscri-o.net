export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden>
        <path
          d="M4 8a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4a4 4 0 0 0 0 8v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a4 4 0 0 0 0-8z"
          fill="#E32636"
        />
        <path d="M20 8.5v3M20 14.5v3M20 20.5v3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}
      >
        Inscri<span className="text-brand">-Ticket</span>
      </span>
    </span>
  );
}
