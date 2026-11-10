export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}
    >
      Projeto Serio<span className="text-brand">$</span>
    </span>
  );
}
