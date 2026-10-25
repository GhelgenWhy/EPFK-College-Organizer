import { useMemo, useState } from 'react';
import type { AssignmentRow, DisciplineOption } from '../../../services/api/management';
import { Banner } from './ManageUi';
import { dangerButtonClass, fieldClass, primaryButtonClass, secondaryButtonClass } from './styles';
import { useBanner } from '../hooks/useBanner';
import { formatKyivDateTime } from '../../../lib/nullSafe';

interface TaskManagerProps {
  groupId: number;
  tasks: AssignmentRow[];
  disciplines: DisciplineOption[];
  canEdit: boolean;
  onCreate: (payload: { disciplineId: number; taskName: string; description?: string; deadline?: string | null }) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

function formatDeadline(value: string | null) {
  return formatKyivDateTime(value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TaskManager({ tasks, disciplines, canEdit, onCreate, onDelete }: TaskManagerProps) {
  const [disciplineFilter, setDisciplineFilter] = useState<'ALL' | number>('ALL');
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [form, setForm] = useState({ disciplineId: '', taskName: '', description: '', deadline: '' });
  const { banner, show } = useBanner();

  const visible = useMemo(
    () => (disciplineFilter === 'ALL' ? tasks : tasks.filter((task) => task.discipline.id === disciplineFilter)),
    [tasks, disciplineFilter],
  );

  async function submit() {
    const disciplineId = Number(form.disciplineId);
    if (!disciplineId || !form.taskName.trim()) {
      show('Оберіть дисципліну та вкажіть назву', 'error');
      return;
    }
    try {
      await onCreate({
        disciplineId,
        taskName: form.taskName.trim(),
        description: form.description.trim() || undefined,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      });
      setForm({ disciplineId: '', taskName: '', description: '', deadline: '' });
      setCreating(false);
      show('Завдання створено');
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося створити завдання', 'error');
    }
  }

  async function remove(taskId: number) {
    setBusyId(taskId);
    try {
      await onDelete(taskId);
      show('Завдання видалено');
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося видалити завдання', 'error');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm text-secondary">
          Дисципліна
          <select
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-primary"
            value={disciplineFilter}
            onChange={(event) =>
              setDisciplineFilter(event.target.value === 'ALL' ? 'ALL' : Number(event.target.value))
            }
          >
            <option value="ALL">Усі</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>{discipline.disciplineName}</option>
            ))}
          </select>
        </label>
        {canEdit && (
          <button type="button" className={primaryButtonClass} onClick={() => setCreating(true)}>
            + Створити завдання
          </button>
        )}
      </div>

      <Banner message={banner?.message ?? null} tone={banner?.tone} />

      {creating && canEdit && (
        <div className="rounded-[18px] border border-border bg-surface p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Дисципліна
              <select className={fieldClass} value={form.disciplineId} onChange={(event) => setForm({ ...form, disciplineId: event.target.value })}>
                <option value="">Оберіть дисципліну</option>
                {disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>{discipline.disciplineName}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Назва
              <input className={fieldClass} value={form.taskName} onChange={(event) => setForm({ ...form, taskName: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary sm:col-span-2">
              Опис
              <textarea className={`${fieldClass} min-h-[70px]`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Дедлайн
              <input type="datetime-local" className={fieldClass} value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className={secondaryButtonClass} onClick={() => setCreating(false)}>Скасувати</button>
            <button type="button" className={primaryButtonClass} onClick={submit}>Зберегти</button>
          </div>
        </div>
      )}

      <div className="overflow-auto rounded-[18px] border border-border bg-surface [scrollbar-color:var(--scrollbar)_transparent] scrollbar-thin">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-secondary">
              <th className="border-b border-border p-3 font-semibold">Завдання</th>
              <th className="border-b border-border p-3 font-semibold">Дисципліна</th>
              <th className="border-b border-border p-3 font-semibold">Дедлайн</th>
              {canEdit && <th className="border-b border-border p-3" />}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td className="p-4 text-muted" colSpan={canEdit ? 4 : 3}>Завдань ще немає</td>
              </tr>
            )}
            {visible.map((task) => (
              <tr key={task.id} className="align-top">
                <td className="border-b border-border p-3">
                  <p className="font-semibold text-primary">{task.taskName}</p>
                  {task.description && <p className="mt-1 line-clamp-2 text-xs text-muted">{task.description}</p>}
                </td>
                <td className="border-b border-border p-3 text-secondary">{task.discipline.disciplineName}</td>
                <td className="border-b border-border p-3 text-secondary">{formatDeadline(task.deadline)}</td>
                {canEdit && (
                  <td className="border-b border-border p-3 text-right">
                    <button
                      type="button"
                      className={dangerButtonClass}
                      disabled={busyId === task.id}
                      onClick={() => void remove(task.id)}
                    >
                      Видалити
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
