import profileAvatar from '../../assets/profile-avatar.png';

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
  userAvatar = profileAvatar,
  onSyncClick,
  onProfileClick,
}: HeaderProps) => {
  return (
    <header className="flex h-[60px] w-full shrink-0 items-center justify-between px-[75px] pl-[85px] max-[760px]:h-[69px] max-[760px]:px-2">

      {/* Кнопка синхронізації */}
      <button type="button" onClick={onSyncClick} className="flex h-[34px] cursor-pointer items-center gap-1 whitespace-nowrap rounded-[50px] border-0 bg-white px-5 py-[10px] text-base font-semibold text-muted max-[760px]:max-w-[52%] max-[760px]:overflow-hidden max-[760px]:px-3 max-[760px]:py-2 max-[760px]:text-[9px] max-[760px]:text-ellipsis">
        <span className="font-bold text-[#646464]">Остання синхронізація:</span>
        <span className="font-semibold text-[#a0a0a0]">{lastSync}</span>
      </button>

      {/* Профіль користувача */}
      <button type="button" onClick={onProfileClick} className="flex h-[60px] cursor-pointer items-center gap-[10px] rounded-[50px] border-0 bg-white py-2 pr-[27px] pl-[10px] max-[760px]:h-11 max-[760px]:gap-[7px] max-[760px]:py-1 max-[760px]:pr-[11px] max-[760px]:pl-[5px]">

        {/* Аватар користувача */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#d1e0de] max-[760px]:h-[34px] max-[760px]:w-[34px]">
          <img
            src={userAvatar}
            alt={userName}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Ім'я користувача */}
        <span className="max-w-[90px] overflow-hidden text-xs font-bold text-black text-ellipsis whitespace-nowrap min-[761px]:max-w-none min-[761px]:text-base">{userName}</span>

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
