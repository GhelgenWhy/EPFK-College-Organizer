import type { CSSProperties, ReactNode } from 'react';
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
        {/* Positioning context for absolutely placed page decorations (e.g. the dashboard cat):
            it spans only the content column under the header, so it does not clip anything. */}
        <div
          className="relative flex min-h-0 min-w-0 flex-1 flex-row gap-2"
          // --app-main-left: left padding of the content column.
          // Content-column origin in the viewport for decorations fixed to the window:
          // --app-view-left / --app-view-top: the content column's origin in the viewport
          // (app padding + sidebar + gap + app header), for decorations fixed to the window.
          style={{
            '--app-main-left': '22px',
            '--app-view-left': '106px',
            '--app-view-top': '100px',
          } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
};