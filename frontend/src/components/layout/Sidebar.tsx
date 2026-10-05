import { NavLink } from "react-router";
import logoSvg from "../../assets/logo.svg";
import homeSvg from "../../assets/home.svg";
import calendarSvg from "../../assets/calendar.svg";
import scheduleSvg from "../../assets/schedule.svg";
import tasksSvg from "../../assets/tasks.svg";
import eventSvg from "../../assets/event.svg";
import { useClerk } from "@clerk/react";

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: string;
}

function SidebarLink({ to, label, icon }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5] max-[760px]:h-[46px] max-[760px]:w-[46px] ${isActive ? "bg-bg-active" : ""}`
      }
      aria-label={label}
      title={label}
    >
      {({ isActive }) => (
        <img
          className={`h-6 w-6 object-contain ${isActive ? "brightness-0" : ""}`}
          src={icon}
          alt=""
        />
      )}
    </NavLink>
  );
}

export const Sidebar = () => {
  const { signOut } = useClerk();

  return (
    <aside className="flex min-h-[calc(100vh-20px)] w-[80px] shrink-0 flex-col items-center justify-between px-[10px] py-0 max-[760px]:fixed max-[760px]:right-3 max-[760px]:bottom-3 max-[760px]:left-3 max-[760px]:z-50 max-[760px]:min-h-0 max-[760px]:w-auto max-[760px]:rounded-[50px] max-[760px]:border max-[760px]:border-[#e4ece9] max-[760px]:bg-white/95 max-[760px]:p-[6px] max-[760px]:shadow-[0_8px_30px_rgba(1,37,59,0.11)] max-[760px]:backdrop-blur-[12px]">
      <div className="flex w-full flex-col items-center gap-[50px] max-[760px]:gap-0">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center max-[760px]:hidden">
          <img
            className="h-full w-full object-contain"
            src={logoSvg}
            alt="Logo"
          />
        </div>

        <nav className="flex w-[60px] flex-col items-center gap-[10px] rounded-[50px] bg-white py-[5px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] max-[760px]:w-full max-[760px]:flex-row max-[760px]:justify-evenly max-[760px]:gap-[3px] max-[760px]:bg-transparent max-[760px]:py-0 max-[760px]:shadow-none">
          <SidebarLink to="/" label="Головна" icon={homeSvg} />
          <SidebarLink to="/calendar" label="Календар" icon={calendarSvg} />
          <SidebarLink to="/schedule" label="Розклад" icon={scheduleSvg} />

          <button
            className="flex h-[50px] w-[50px] shrink-0 cursor-default items-center justify-center rounded-full text-[#a3aaa9] max-[760px]:h-[46px] max-[760px]:w-[46px]"
            type="button"
            disabled
            title="Курси"
            aria-label="Курси"
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m2.5 8.2 9.5-5 9.5 5-9.5 5-9.5-5Z" />
              <path d="M6 10.2v5.1c0 1.2 2.7 3.2 6 3.2s6-2 6-3.2v-5.1M21.5 8.2v6" />
            </svg>
          </button>

          <SidebarLink to="/assignments" label="Завдання" icon={tasksSvg} />
          <SidebarLink to="/events" label="Події" icon={eventSvg} />
        </nav>
      </div>

      <button
        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors hover:bg-red-100 max-[760px]:hidden"
        type="button"
        onClick={() => void signOut({ redirectUrl: "/sign-in" })}
        title="Вийти"
        aria-label="Вийти з облікового запису"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="#FF6060"
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
