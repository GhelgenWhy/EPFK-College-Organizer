import logoSvg from '../../assets/logo.svg';
import homeSvg from '../../assets/home.svg';
import calendarSvg from '../../assets/calendar.svg';
import scheduleSvg from '../../assets/schedule.svg';
import tasksSvg from '../../assets/tasks.svg';
import eventSvg from '../../assets/event.svg';
import { NavLink } from 'react-router';

export const Sidebar = () => {
  return (
    <aside className="sidebar">

      {/* Логотип */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logoSvg} alt="Logo" />
        </div>

        {/* Навігаційне меню */}
        <nav className="sidebar-nav">

          {/* Головна */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
            aria-label="Головна"
            title="Головна"
          >
            <img src={homeSvg} alt="" />
          </NavLink>

          {/* Календар */}
          <NavLink
            to="/calendar"
            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
            aria-label="Календар"
            title="Календар"
          >
            <img src={calendarSvg} alt="" />
          </NavLink>

          {/* Розклад */}
          <NavLink
            to="/schedule"
            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
            aria-label="Розклад"
            title="Розклад"
          >
            <img src={scheduleSvg} alt="" />
          </NavLink>

          {/* Навчальні матеріали */}
          <button className="sidebar-btn sidebar-btn--disabled" type="button" disabled title="Курси" aria-label="Курси">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2.5 8.2 9.5-5 9.5 5-9.5 5-9.5-5Z" />
              <path d="M6 10.2v5.1c0 1.2 2.7 3.2 6 3.2s6-2 6-3.2v-5.1M21.5 8.2v6" />
            </svg>
          </button>

          {/* Завдання */}
          <NavLink
            to="/assignments"
            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
            aria-label="Завдання"
            title="Завдання"
          >
            <img src={tasksSvg} alt="" />
          </NavLink>

          {/* Події */}
          <button
            type="button"
            className="sidebar-btn"
            disabled
            title="Події"
          >
            <img src={eventSvg} alt="Events" />
          </button>
        </nav>
      </div>

      {/* Кнопка виходу */}
      <button type="button" className="sidebar-logout" title="Вийти">
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
          <line
            x1="21"
            y1="12"
            x2="9"
            y2="12"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </aside>
  );
};
