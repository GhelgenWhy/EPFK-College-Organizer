import logoSvg from '../../assets/logo.svg';
import homeSvg from '../../assets/home.svg';
import calendarSvg from '../../assets/calendar.svg';
import scheduleSvg from '../../assets/schedule.svg';
import tasksSvg from '../../assets/tasks.svg';
import eventSvg from '../../assets/event.svg';

interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const Sidebar = ({ activeTab = 'schedule', onSelectTab }: SidebarProps) => {
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
          <button
            type="button"
            className="sidebar-btn"
            disabled
            title="Головна"
          >
            <img src={homeSvg} alt="Home" />
          </button>

          {/* Календар */}
          <button
            type="button"
            onClick={() => onSelectTab?.('calendar')}
            className={`sidebar-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            title="Календар"
          >
            <img src={calendarSvg} alt="Calendar" />
          </button>

          {/* Розклад */}
          <button
            type="button"
            onClick={() => onSelectTab?.('schedule')}
            className={`sidebar-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            title="Розклад"
          >
            <img src={scheduleSvg} alt="Schedule" />
          </button>

          {/* Завдання */}
          <button
            type="button"
            className="sidebar-btn"
            disabled
            title="Завдання"
          >
            <img src={tasksSvg} alt="Tasks" />
          </button>

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