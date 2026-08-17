export default function TemporalState({
  previous,
  current,
  currentLabel,
  connector = "SUPERSEDED BY",
  asOf,
}: {
  previous?: { value: string; label: string };
  current: { value: string; label: string };
  currentLabel?: string;
  connector?: string;
  asOf?: string;
}) {
  return (
    <div className="pd-temporal" aria-label="Temporal status">
      {previous ? (
        <>
          <div className="pd-ts pd-ts--previous">
            <span className="pd-ts-value">{previous.value}</span>
            <span className="pd-ts-label">{previous.label}</span>
          </div>

          <div className="pd-ts-connector" aria-hidden="true">
            <span className="pd-ts-line" />
            <span className="pd-ts-label">{connector}</span>
            <span className="pd-ts-orb" />
            <span className="pd-ts-arrow">&rarr;</span>
          </div>

          <div className="pd-ts pd-ts--current">
            <span className="pd-ts-value">{current.value}</span>
            <span className="pd-ts-label">{current.label}</span>
            {currentLabel && <span className="pd-ts-badge">{currentLabel}</span>}
          </div>
        </>
      ) : (
        <div className="pd-ts pd-ts--current pd-ts--single">
          <span className="pd-ts-value">{current.value}</span>
          <span className="pd-ts-label">{current.label}</span>
          {asOf && <span className="pd-ts-asof">As of {asOf}</span>}
        </div>
      )}
    </div>
  );
}
