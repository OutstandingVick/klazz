export type DemoQuestion = { id: string; chip: string };

export default function DemoQuestionSelector({
  options,
  activeId,
  onSelect,
}: {
  options: DemoQuestion[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="pd-chips" role="tablist" aria-label="Try another question">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === activeId}
          className={`pd-chip${o.id === activeId ? " pd-chip--active" : ""}`}
          onClick={() => onSelect(o.id)}
        >
          {o.chip}
        </button>
      ))}
    </div>
  );
}
