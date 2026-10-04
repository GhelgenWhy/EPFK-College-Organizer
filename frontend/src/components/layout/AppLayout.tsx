import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'react-router';

interface AppLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
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
  const { pathname } = useLocation();
  const activeTab = pathname === '/' ? 'home' : pathname.slice(1);

  return (
    <div className="app-layout" data-page={activeTab}>
      <Sidebar />
      <div className="layout-content">
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
