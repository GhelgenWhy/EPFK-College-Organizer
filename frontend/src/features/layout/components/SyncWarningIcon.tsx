/**
 * "Sync not configured" mark: a circular arrow (Moodle sync) with an exclamation, drawn in the
 * same line style as the sidebar icons (1.8 stroke, currentColor) instead of an emoji.
 */
export function SyncWarningIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {/* Circular arrows: the sync that has not run yet. */}
      <path d="M20 12a8 8 0 0 1-13.6 5.7" />
      <path d="M4 12a8 8 0 0 1 13.6-5.7" />
      <path d="M17.6 2.9v3.6H14" />
      <path d="M6.4 21.1v-3.6H10" />
      {/* Exclamation mark in the middle. */}
      <path d="M12 8.6v4.1" />
      <path d="M12 16.1v.01" />
    </svg>
  );
}
