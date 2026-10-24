import type { ReactNode } from 'react';

export type ManageTab = 'schedule' | 'tasks' | 'students' | 'events';

const TAB_LABELS: Record<ManageTab, string> = {
  schedule: 'Розклад',
  tasks: 'Завдання',
  students: 'Студенти',
  events: 'Події',
};

interface ManageHeaderProps {
  title: string;
  subtitle?: string;
  tabs: ManageTab[];
  activeTab: ManageTab;
  onTabChange: (tab: ManageTab) => void;
  children?: ReactNode;
}

/** Page header with the underline-style tab bar used by the admin panel. */
export function ManageHeader({ title, subtitle, tabs, activeTab, onTabChange, children }: ManageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-secondary">{subtitle}</p>}
        </div>
        {children}
      </div>
      <nav className="flex flex-wrap gap-4 border-b border-border" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === activeTab}
            onClick={() => onTabChange(tab)}
            className={`-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-1 pb-2 text-sm font-semibold transition-colors ${
              tab === activeTab
                ? 'border-accent text-accent'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>
    </div>
  );
}

interface GroupPickerProps {
  groups: Array<{ id: number; groupName: string }>;
  value: number | null;
  onChange: (groupId: number | null) => void;
  disabled?: boolean;
}

export function GroupPicker({ groups, value, onChange, disabled }: GroupPickerProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-secondary">
      Група
      <select
        className="rounded-lg border border-border bg-input-background px-3 py-2 text-primary disabled:opacity-60"
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}
      >
        {!disabled && <option value="">Усі групи</option>}
        {groups.map((group) => (
          <option key={group.id} value={group.id}>{group.groupName}</option>
        ))}
      </select>
    </label>
  );
}

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ title, onClose, children, footer }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.45)] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[560px] rounded-[22px] border border-border bg-surface p-6 shadow-[0_12px_24px_var(--shadow-color)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="cursor-pointer rounded-full border-0 bg-transparent p-1 text-secondary hover:text-primary"
          >
            ✕
          </button>
        </div>
        {children}
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

interface ToastProps {
  message: string | null;
  tone?: 'success' | 'error';
}

export function Banner({ message, tone = 'success' }: ToastProps) {
  if (!message) return null;
  return (
    <p
      role="status"
      className={`rounded-xl px-4 py-2 text-sm ${
        tone === 'error'
          ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
          : 'bg-[var(--success-soft)] text-[var(--success)]'
      }`}
    >
      {message}
    </p>
  );
}
