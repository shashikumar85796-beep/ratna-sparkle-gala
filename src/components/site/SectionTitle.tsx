export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-14 ${center ? "text-center" : ""}`}>
      {eyebrow && <p className="font-cinzel text-xs text-[#C9A84C] mb-3">{eyebrow}</p>}
      <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
        {title.split("|").map((part, i) =>
          i === 1 ? <span key={i} className="text-gold-gradient">{part}</span> : <span key={i}>{part}</span>
        )}
      </h2>
      {center && <div className="gold-divider" />}
      {subtitle && <p className="text-white/60 max-w-2xl mx-auto mt-4 text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}
