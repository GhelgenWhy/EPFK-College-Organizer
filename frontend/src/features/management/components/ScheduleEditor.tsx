import { useState } from 'react';
import type { GroupSchedule, LessonSlot, WeekType } from '../../../services/api/management';
import { Banner } from './ManageUi';
import { fieldClass, primaryButtonClass, secondaryButtonClass } from './styles';
import { useBanner } from '../hooks/useBanner';

interface ScheduleEditorProps {
  groupId: number;
  schedule: GroupSchedule;
  canEdit: boolean;
  onSave: (lesson: {
    weekType: WeekType;
    weekday: number;
    slot: number;
    disciplineName: string;
    teacherName: string;
    room?: string | null;
    format?: 'OFFLINE' | 'ONLINE' | 'HYBRID';
    meetingUrl?: string | null;
  }) => Promise<void>;
  onDelete: (weekType: WeekType, weekday: number, slot: number) => Promise<void>;
}

const FORMAT_LABELS = { OFFLINE: 'Офлайн', ONLINE: 'Онлайн', HYBRID: 'Гібрид' } as const;

interface DraftLesson {
  weekType: WeekType;
  weekday: number;
  slot: number;
  disciplineName: string;
  teacherName: string;
  room: string;
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  meetingUrl: string;
}

export function ScheduleEditor({ groupId, schedule, canEdit, onSave, onDelete }: ScheduleEditorProps) {
  const [weekType, setWeekType] = useState<WeekType>('numerator');
  const [draft, setDraft] = useState<DraftLesson | null>(null);
  const [saving, setSaving] = useState(false);
  const { banner, show } = useBanner();

  const data = schedule.schedule;
  const days = data[weekType];

  function openEditor(weekday: number, slot: number, current: LessonSlot | null) {
    if (!canEdit) return;
    setDraft({
      weekType,
      weekday,
      slot,
      disciplineName: current?.disciplineName ?? '',
      teacherName: current?.teacherName ?? '',
      room: current?.room ?? '',
      format: current?.format ?? 'OFFLINE',
      meetingUrl: current?.meetingUrl ?? '',
    });
  }

  async function submit() {
    if (!draft || !draft.disciplineName.trim() || !draft.teacherName.trim()) {
      show('Заповніть назву дисципліни та викладача', 'error');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        weekType: draft.weekType,
        weekday: draft.weekday,
        slot: draft.slot,
        disciplineName: draft.disciplineName.trim(),
        teacherName: draft.teacherName.trim(),
        room: draft.room.trim() || null,
        format: draft.format,
        meetingUrl: draft.meetingUrl.trim() || null,
      });
      show('Пару збережено');
      setDraft(null);
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося зберегти пару', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!draft) return;
    setSaving(true);
    try {
      await onDelete(draft.weekType, draft.weekday, draft.slot);
      show('Пару видалено');
      setDraft(null);
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося видалити пару', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3" key={groupId}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-[10px] bg-surface p-1 shadow-[0_1px_3px_var(--shadow-soft-color)]" role="tablist">
          {(['numerator', 'denominator'] as WeekType[]).map((week) => (
            <button
              key={week}
              type="button"
              role="tab"
              aria-selected={weekType === week}
              onClick={() => setWeekType(week)}
              className={`cursor-pointer rounded-lg border-0 px-4 py-1.5 text-sm font-semibold transition-colors ${
                weekType === week ? 'bg-accent text-on-accent' : 'bg-transparent text-secondary hover:text-primary'
              }`}
            >
              {week === 'numerator' ? 'Чисельник' : 'Знаменник'}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">
          {canEdit ? 'Натисніть на клітинку, щоб додати або змінити пару' : 'Лише перегляд'}
        </p>
      </div>

      <Banner message={banner?.message ?? null} tone={banner?.tone} />

      <div className="overflow-auto rounded-[18px] border border-border bg-surface">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-[110px] border-b border-border p-2 text-left font-semibold text-secondary">Час</th>
              {days.map((day) => (
                <th key={day.weekday} className="border-b border-border p-2 text-left font-semibold text-secondary">
                  {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.timeSlots.map((time, slot) => (
              <tr key={time}>
                <td className="border-b border-border p-2 align-top text-xs text-muted">{time}</td>
                {days.map((day) => {
                  const lesson = day.lessons[slot];
                  return (
                    <td key={day.weekday} className="border-b border-border p-1 align-top">
                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => openEditor(day.weekday, slot, lesson ?? null)}
                        className={`min-h-[54px] w-full cursor-pointer rounded-lg border-0 p-2 text-left transition-colors ${
                          lesson
                            ? 'bg-[var(--lesson-background)] hover:brightness-95'
                            : 'border border-dashed border-border bg-transparent text-muted hover:bg-[var(--surface-hover)]'
                        } disabled:cursor-default`}
                      >
                        {lesson ? (
                          <span className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-semibold leading-tight text-primary">{lesson.disciplineName}</span>
                            <span className="text-[11px] text-secondary">{lesson.teacherName}</span>
                            <span className="text-[11px] text-muted">
                              {lesson.format === 'ONLINE' ? 'Онлайн' : lesson.room || 'Аудиторію не вказано'}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs">+ додати</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <div className="rounded-[18px] border border-border bg-surface p-4">
          <h3 className="mb-3 text-base font-semibold text-primary">
            {days.find((day) => day.weekday === draft.weekday)?.name} · {data.timeSlots[draft.slot]}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Дисципліна
              <input className={fieldClass} value={draft.disciplineName} onChange={(event) => setDraft({ ...draft, disciplineName: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Викладач
              <input className={fieldClass} value={draft.teacherName} onChange={(event) => setDraft({ ...draft, teacherName: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Аудиторія
              <input className={fieldClass} value={draft.room} onChange={(event) => setDraft({ ...draft, room: event.target.value })} placeholder="напр. 214" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Формат
              <select className={fieldClass} value={draft.format} onChange={(event) => setDraft({ ...draft, format: event.target.value as DraftLesson['format'] })}>
                {Object.entries(FORMAT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary sm:col-span-2">
              Посилання на зустріч
              <input className={fieldClass} value={draft.meetingUrl} onChange={(event) => setDraft({ ...draft, meetingUrl: event.target.value })} placeholder="https://meet.google.com/…" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" className={secondaryButtonClass} onClick={() => setDraft(null)}>Скасувати</button>
            <button type="button" className={primaryButtonClass} onClick={submit} disabled={saving}>
              {saving ? 'Збереження…' : 'Зберегти'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={remove}
              className="inline-flex min-h-[38px] cursor-pointer items-center rounded-[10px] border-0 bg-[var(--danger-soft)] px-4 text-sm font-semibold text-[var(--danger)] transition-colors hover:bg-[var(--danger)] hover:text-on-accent disabled:opacity-50"
            >
              Видалити пару
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
