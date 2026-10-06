import { NavLink } from "react-router";
import logoSvg from "../../assets/logo.svg";
import { useClerk } from "@clerk/react";
import { SidebarIcon, type SidebarIconName } from './SidebarIcon';

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: SidebarIconName;
}

function SidebarLink({ to, label, icon }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full transition-colors max-[760px]:h-[46px] max-[760px]:w-[46px] ${isActive ? "bg-bg-active" : "hover:bg-[var(--surface-hover)]"}`
      }
      aria-label={label}
      title={label}
    >
      {({ isActive }) => (
        <span className={isActive ? 'text-on-nav-active' : 'text-muted'}><SidebarIcon name={icon} /></span>
      )}
    </NavLink>
  );
}

export const Sidebar = () => {
  const { signOut } = useClerk();

  return (
    <aside className="flex min-h-[calc(100vh-20px)] w-[80px] shrink-0 flex-col items-center justify-between px-[10px] py-0 max-[760px]:fixed max-[760px]:right-3 max-[760px]:bottom-3 max-[760px]:left-3 max-[760px]:z-50 max-[760px]:min-h-0 max-[760px]:w-auto max-[760px]:rounded-[50px] max-[760px]:border max-[760px]:border-border max-[760px]:bg-surface/95 max-[760px]:p-[6px] max-[760px]:shadow-[0_8px_30px_var(--shadow-color)] max-[760px]:backdrop-blur-[12px]">
      <div className="flex w-full flex-col items-center gap-[50px] max-[760px]:gap-0">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center max-[760px]:hidden">
          <img
            className="h-full w-full object-contain"
            src={logoSvg}
            alt="Logo"
          />
        </div>

        <nav className="flex w-[60px] flex-col items-center gap-[10px] rounded-[50px] bg-surface py-[5px] shadow-[0_1px_3px_var(--shadow-soft-color)] max-[760px]:w-full max-[760px]:flex-row max-[760px]:justify-evenly max-[760px]:gap-[3px] max-[760px]:bg-transparent max-[760px]:py-0 max-[760px]:shadow-none">
          <SidebarLink to="/" label="Головна" icon="home" />
          <SidebarLink to="/calendar" label="Календар" icon="calendar" />
          <SidebarLink to="/schedule" label="Розклад" icon="schedule" />
          <SidebarLink to="/disciplines" label="Дисципліни" icon="disciplines" />
          <SidebarLink to="/assignments" label="Завдання" icon="tasks" />
          <SidebarLink to="/events" label="Події" icon="events" />
        </nav>
      </div>

      <button
        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-surface shadow-[0_1px_3px_var(--shadow-soft-color)] transition-colors hover:bg-red-100 max-[760px]:hidden"
        type="button"
        onClick={() => void signOut({ redirectUrl: "/sign-in" })}
        title="Вийти"
        aria-label="Вийти з облікового запису"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="var(--danger)"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
          />
          <polyline
            points="16 17 21 12 16 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
};
