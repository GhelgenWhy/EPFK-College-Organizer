export function SectionHeading({
  id,
  title,
  subtitle,
  action,
}: {
  id: string;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-2 border-b border-[var(--border)] pb-[11px]">
      <div>
        <h2
          id={id}
          className="text-[21px] leading-[1.25] font-bold tracking-[-0.025em] text-primary max-[760px]:text-base"
        >
          {title}
        </h2>
        <p className="mt-[6px] text-xs text-[var(--text-muted)] max-[760px]:text-[10px]">
          {subtitle}
        </p>
      </div>
      {action && (
        <button
          className="inline-flex shrink-0 items-center gap-[6px] cursor-pointer border-0 bg-transparent py-1 text-xs font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px] max-[760px]:text-[10px]"
          onClick={action.onClick}
          type="button"
        >
          {action.label} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
