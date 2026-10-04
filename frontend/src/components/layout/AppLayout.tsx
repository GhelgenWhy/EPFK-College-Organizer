import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  lastSync?: string;
  userName?: string;
  userAvatar?: string;
  onSyncClick?: () => void;
  onProfileClick?: () => void;
}

export const AppLayout = ({
  children,
  lastSync,
  userName,
  userAvatar,
  onSyncClick,
  onProfileClick,
}: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen items-start gap-[10px] bg-bg-main p-[10px] max-[760px]:min-h-dvh max-[760px]:p-2">
      <Sidebar />
      <div className="flex h-[calc(100vh-20px)] min-h-0 min-w-0 flex-1 flex-col max-[760px]:h-[calc(100dvh-16px)] max-[760px]:pb-[68px]">
        <Header
          lastSync={lastSync}
          userName={userName}
          userAvatar={userAvatar}
          onSyncClick={onSyncClick}
          onProfileClick={onProfileClick}
        />
        {children}
      </div>
    </div>
  );
};
