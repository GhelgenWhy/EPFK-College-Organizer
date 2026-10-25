import { useState } from 'react';
import { manageApi } from '../../../services/api/management';
import type { GroupInfo, StudentInfo } from '../../../services/api/management';
import { Banner } from './ManageUi';
import { fieldClass, primaryButtonClass } from './styles';
import { useBanner } from '../hooks/useBanner';
import { studentDisplayName } from '../utils/studentName';
import { useManageAction } from '../hooks/useManageAction';

interface StudentsManagerProps {
  /** Admins manage groups and assign students; starostas only see their own group. */
  isAdmin: boolean;
  groups: GroupInfo[];
  students: StudentInfo[];
  isLoading: boolean;
  onChanged: () => void;
}

function formatSync(value: string | null) {
  if (!value) return 'Ще не синхронізовано';
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function StudentsManager({ isAdmin, groups, students, isLoading, onChanged }: StudentsManagerProps) {
  const [newGroup, setNewGroup] = useState('');
  const [filter, setFilter] = useState<'ALL' | number>('ALL');
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [busy, setBusy] = useState(false);
  const { banner, show } = useBanner();
  const action = useManageAction(onChanged);

  const visible = students.filter((student) => filter === 'ALL' || student.groupId === filter);

  /** Saves a new group name; students follow automatically (they reference the group id). */
  async function saveRename(groupId: number, currentName: string) {
    const next = renameValue.trim();
    if (!next || next === currentName) {
      setRenamingId(null);
      return;
    }
    await run('Назву групи змінено', async () => {
      await action.run((options) => manageApi.renameGroup(groupId, next, options));
      setRenamingId(null);
    });
  }

  async function run(successMessage: string, task: () => Promise<unknown>) {
    setBusy(true);
    try {
      await task();
      show(successMessage);
    } catch {
      // The error banner comes from useManageAction.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Banner message={banner?.message ?? null} tone={banner?.tone} />
      <Banner message={action.error} tone="error" />

      {isAdmin && (
        <section className="rounded-[18px] border border-border bg-surface p-4">
          <h2 className="mb-3 text-base font-semibold text-primary">Групи</h2>
          <div className="mb-3 flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Нова група
              <input
                className={fieldClass}
                placeholder="напр. ІПЗ-21"
                value={newGroup}
                onChange={(event) => setNewGroup(event.target.value)}
              />
            </label>
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy || !newGroup.trim()}
              onClick={() => void run('Групу створено', async () => {
                await action.run((options) => manageApi.createGroup(newGroup.trim(), options));
                setNewGroup('');
              })}
            >
              + Створити групу
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <li
                key={group.id}
                className="flex items-center gap-2 rounded-xl border border-border bg-[var(--surface-muted)] px-3 py-2"
              >
                {renamingId === group.id ? (
                  <>
                    <input
                      className={`${fieldClass} h-8 w-40`}
                      value={renameValue}
                      autoFocus
                      onChange={(event) => setRenameValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') void saveRename(group.id, group.groupName);
                        if (event.key === 'Escape') setRenamingId(null);
                      }}
                      aria-label="Нова назва групи"
                    />
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent text-xs font-semibold text-accent"
                      disabled={busy || !renameValue.trim()}
                      onClick={() => void saveRename(group.id, group.groupName)}
                    >
                      Зберегти
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent text-xs text-secondary"
                      onClick={() => setRenamingId(null)}
                    >
                      Скасувати
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`cursor-pointer border-0 bg-transparent text-sm font-semibold ${
                        filter === group.id ? 'text-accent' : 'text-primary'
                      }`}
                      onClick={() => setFilter(filter === group.id ? 'ALL' : group.id)}
                      aria-pressed={filter === group.id}
                    >
                      {group.groupName}
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent text-xs text-secondary hover:text-primary"
                        onClick={() => {
                          setRenamingId(group.id);
                          setRenameValue(group.groupName);
                        }}
                        aria-label={`Перейменувати групу ${group.groupName}`}
                        title="Перейменувати"
                      >
                        ✎
                      </button>
                    )}
                  </>
                )}
                <span className="text-xs text-muted">{group.studentCount} студ.</span>
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent text-xs text-[var(--danger)]"
                  disabled={busy}
                  onClick={() => {
                    if (group.studentCount > 0) {
                      show('Спочатку переведіть студентів з цієї групи', 'error');
                      return;
                    }
                    void run('Групу видалено', () => action.run((options) => manageApi.deleteGroup(group.id, options)));
                  }}
                  aria-label={`Видалити групу ${group.groupName}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="overflow-auto rounded-[18px] border border-border bg-surface">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <span className="text-sm font-semibold text-primary">Студенти</span>
          <button
            type="button"
            onClick={onChanged}
            aria-label="Оновити список"
            title="Оновити список"
            className="ml-auto cursor-pointer rounded-full border-0 bg-transparent p-1.5 text-secondary transition-colors hover:bg-[var(--surface-hover)] hover:text-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
          {filter !== 'ALL' && (
            <button type="button" className="text-xs text-accent underline" onClick={() => setFilter('ALL')}>
              Показати всіх
            </button>
          )}
        </div>
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-secondary">
              <th className="border-b border-border p-3 font-semibold">Студент</th>
              <th className="border-b border-border p-3 font-semibold">Група</th>
              <th className="border-b border-border p-3 font-semibold">Moodle</th>
              <th className="border-b border-border p-3 font-semibold">Остання синхронізація</th>
              {isAdmin && <th className="border-b border-border p-3 font-semibold">Змінити групу</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="p-4 text-muted" colSpan={isAdmin ? 5 : 4}>Завантаження студентів…</td></tr>
            )}
            {!isLoading && visible.length === 0 && (
              <tr><td className="p-4 text-muted" colSpan={isAdmin ? 5 : 4}>Студентів не знайдено</td></tr>
            )}
            {visible.map((student) => (
              <tr key={student.id}>
                <td className="border-b border-border p-3">
                  <p className="font-semibold text-primary">{studentDisplayName(student)}</p>
                  {student.email && <p className="text-xs text-muted">{student.email}</p>}
                </td>
                <td className="border-b border-border p-3 text-secondary">{student.groupName ?? 'Без групи'}</td>
                <td className="border-b border-border p-3 text-secondary">
                  {student.moodleLinked ? 'Прив’язано' : 'Не прив’язано'}
                </td>
                <td className="border-b border-border p-3 text-secondary">{formatSync(student.lastSync)}</td>
                {isAdmin && (
                  <td className="border-b border-border p-3">
                    <select
                      className={`${fieldClass} max-w-[220px]`}
                      value={student.groupId ?? ''}
                      disabled={busy}
                      onChange={(event) => {
                        const groupId = event.target.value ? Number(event.target.value) : null;
                        void run('Групу студента оновлено', () =>
                          action.run((options) => manageApi.assignGroup(student.id, groupId, options)));
                      }}
                    >
                      <option value="">Без групи</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.groupName}</option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
