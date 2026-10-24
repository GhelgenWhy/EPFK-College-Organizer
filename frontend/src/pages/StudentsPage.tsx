import { useState } from 'react';
import { useApiQuery } from '../services/api/useApiQuery';
import { manageApi } from '../services/api/management';
import { useManageAction } from '../features/management/hooks/useManageAction';
import {
  dangerButtonClass,
  fieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../features/management/components/styles';
import { Banner } from '../features/management/components/ManageUi';
import { useBanner } from '../features/management/hooks/useBanner';

export function StudentsPage() {
  const groupsQuery = useApiQuery(manageApi.getGroups);
  const studentsQuery = useApiQuery(manageApi.getOwnStudents);
  const [newGroup, setNewGroup] = useState('');
  const [filter, setFilter] = useState<'ALL' | number>('ALL');
  const [busy, setBusy] = useState(false);
  const { banner, show } = useBanner();
  const action = useManageAction(() => {
    groupsQuery.retry();
    studentsQuery.retry();
  });

  const groups = groupsQuery.data ?? [];
  const students = (studentsQuery.data ?? []).filter(
    (student) => filter === 'ALL' || student.groupId === filter,
  );

  async function createGroup() {
    if (!newGroup.trim()) return;
    setBusy(true);
    try {
      await action.run((options) => manageApi.createGroup(newGroup.trim(), options));
      setNewGroup('');
      show('Групу створено');
    } catch {
      // The error banner comes from useManageAction.
    } finally {
      setBusy(false);
    }
  }

  async function deleteGroup(groupId: number, studentCount: number) {
    if (studentCount > 0) {
      show('Спочатку переведіть студентів з цієї групи', 'error');
      return;
    }
    setBusy(true);
    try {
      await action.run((options) => manageApi.deleteGroup(groupId, options));
      show('Групу видалено');
    } catch {
      // Error banner from useManageAction.
    } finally {
      setBusy(false);
    }
  }

  async function assign(studentId: string, groupId: number | null) {
    setBusy(true);
    try {
      await action.run((options) => manageApi.assignGroup(studentId, groupId, options));
      show('Групу студента оновлено');
    } catch {
      // Error banner from useManageAction.
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-auto px-[30px] pt-2 pr-[40px] pb-5 max-[760px]:px-4">
      <div>
        <h1 className="text-[26px] font-bold text-primary">Студенти</h1>
        <p className="text-sm text-secondary">Групи, студенти та прив’язка до Moodle</p>
      </div>

      <Banner message={banner?.message ?? null} tone={banner?.tone} />
      <Banner message={action.error} tone="error" />

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
          <button type="button" className={primaryButtonClass} disabled={busy} onClick={() => void createGroup()}>
            + Створити групу
          </button>
        </div>
        {groupsQuery.isLoading && <p className="text-sm text-muted">Завантаження груп…</p>}
        {groupsQuery.error && <p className="text-sm text-[var(--danger)]">{groupsQuery.error.message}</p>}
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-[var(--surface-muted)] px-3 py-2"
            >
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
              <span className="text-xs text-muted">{group.studentCount} студ.</span>
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent text-xs text-[var(--danger)]"
                disabled={busy}
                onClick={() => void deleteGroup(group.id, group.studentCount)}
                aria-label={`Видалити групу ${group.groupName}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {filter !== 'ALL' && (
          <button type="button" className={`${secondaryButtonClass} mt-3`} onClick={() => setFilter('ALL')}>
            Показати всіх студентів
          </button>
        )}
      </section>

      <section className="overflow-auto rounded-[18px] border border-border bg-surface">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-secondary">
              <th className="border-b border-border p-3 font-semibold">Студент (ID Clerk)</th>
              <th className="border-b border-border p-3 font-semibold">Група</th>
              <th className="border-b border-border p-3 font-semibold">Остання синхронізація</th>
              <th className="border-b border-border p-3 font-semibold">Змінити групу</th>
            </tr>
          </thead>
          <tbody>
            {studentsQuery.isLoading && (
              <tr><td className="p-4 text-muted" colSpan={4}>Завантаження студентів…</td></tr>
            )}
            {!studentsQuery.isLoading && students.length === 0 && (
              <tr><td className="p-4 text-muted" colSpan={4}>Студентів не знайдено</td></tr>
            )}
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border-b border-border p-3 font-mono text-xs text-primary">{student.id}</td>
                <td className="border-b border-border p-3 text-secondary">{student.groupName ?? 'Без групи'}</td>
                <td className="border-b border-border p-3 text-secondary">
                  {student.lastSync
                    ? new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(student.lastSync))
                    : 'Ще не синхронізовано'}
                </td>
                <td className="border-b border-border p-3">
                  <select
                    className={`${fieldClass} max-w-[220px]`}
                    value={student.groupId ?? ''}
                    disabled={busy}
                    onChange={(event) => void assign(student.id, event.target.value ? Number(event.target.value) : null)}
                  >
                    <option value="">Без групи</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>{group.groupName}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-muted">
        Ролі задаються в Clerk: публічні метадані <code>role</code> зі значеннями
        <code> user</code>, <code>supervisor</code> або <code>admin</code>.
      </p>
      <button type="button" className={dangerButtonClass} onClick={() => { groupsQuery.retry(); studentsQuery.retry(); }}>
        Оновити список
      </button>
    </main>
  );
}

export default StudentsPage;
