export type SidebarIconName = 'home' | 'calendar' | 'schedule' | 'disciplines' | 'tasks' | 'events';

export function SidebarIcon({ name }: { name: SidebarIconName }) {
  const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" {...shared}>
      {name === 'home' && <path d="M3.5 10 12 3l8.5 7v9a2 2 0 0 1-2 2h-4v-7h-5v7h-4a2 2 0 0 1-2-2z" />}
      {name === 'calendar' && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01" /></>}
      {name === 'schedule' && <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M8 2v4M16 2v4M8 10h8M8 14h6M8 18h4" /></>}
      {name === 'disciplines' && <><path d="m2.5 8.2 9.5-5 9.5 5-9.5 5-9.5-5Z" /><path d="M6 10.2v5.1c0 1.2 2.7 3.2 6 3.2s6-2 6-3.2v-5.1M21.5 8.2v6" /></>}
      {name === 'tasks' && <><path d="M10 5h10M10 12h10M10 19h10M3 5l1.5 1.5L7 3.5M3 12l1.5 1.5L7 10.5M3 19l1.5 1.5L7 17.5" /></>}
      {name === 'events' && <><path d="m4 20 3.5-10.6L14.6 17 4 20ZM10 7c1.8-2.2 4.8-2.5 7-1M13 3c2.8-.4 5.4 1.1 6.5 3.7M18 12c1.6 1 2.4 2.6 2.5 4.5" /><path d="M7 4v.01M20 9v.01" /></>}
    </svg>
  );
}
