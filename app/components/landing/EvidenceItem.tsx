export default function EvidenceItem({
  meta,
  value,
  caption,
  state,
  tone = "muted",
}: {
  meta: string;
  value: string;
  caption: string;
  state: string;
  tone?: "muted" | "current";
}) {
  return (
    <article className="pd-evidence">
      <span className="pd-evidence-meta">{meta}</span>
      <span className="pd-evidence-value">{value}</span>
      <span className="pd-evidence-caption">{caption}</span>
      <span className={`pd-evidence-state pd-evidence-state--${tone}`}>{state}</span>
    </article>
  );
}
