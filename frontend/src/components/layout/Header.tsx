interface HeaderProps {
  lastSync?: string;
  userName?: string;
  userAvatar?: string;
  onSyncClick?: () => void;
  onProfileClick?: () => void;
}

export const Header = ({
  lastSync = 'Сьогодні 23:01',
  userName = 'Don Psone',
  userAvatar = '/Asd1.png',
  onSyncClick,
  onProfileClick,
}: HeaderProps) => {
  return (
    <header className="header">

      {/* Кнопка синхронізації */}
      <button type="button" onClick={onSyncClick} className="sync-badge">
        Остання синхронізація: {lastSync}
      </button>

      {/* Профіль користувача */}
      <button type="button" onClick={onProfileClick} className="user-profile">

        {/* Аватар користувача */}
        <div className="user-avatar">
          <img
            src={userAvatar}
            alt={userName}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Ім'я користувача */}
        <span className="user-name">{userName}</span>

        {/* Стрілка меню профілю */}
        <svg width="18" height="10" viewBox="0 0 19 10" fill="none">
          <path
            d="M0.29289 0.292874C-0.09763 0.683475 -0.09763 1.31658 0.29289 1.70718L6.93736 8.3516C8.10864 9.52286 10.0074 9.52322 11.1791 8.35242L17.7545 1.78208C18.1451 1.39158 18.1451 0.758375 17.7545 0.367875C17.364 -0.022625 16.7308 -0.022625 16.3403 0.367875L9.76834 6.93992C9.37774 7.33044 8.74464 7.33044 8.35414 6.93992L1.70711 0.292874C1.31658 -0.0976257 0.68342 -0.0976257 0.29289 0.292874Z"
            fill="#9A9A9A"
          />
        </svg>
      </button>
    </header>
  );
};