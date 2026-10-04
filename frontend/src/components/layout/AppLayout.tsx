import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

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
  activeTab = 'schedule',
  onSelectTab,
  lastSync,
  userName,
  userAvatar,
  onSyncClick,
  onProfileClick,
}: AppLayoutProps) => {
  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
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