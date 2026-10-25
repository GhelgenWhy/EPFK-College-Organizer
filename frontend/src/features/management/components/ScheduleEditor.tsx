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
    location?: string | null;
    format?: 'OFFLINE' | 'ONLINE' | 'HYBRID';
    meetingLink?: string | null;
  }) => Promise<void>;
  onDelete: (weekType: WeekType, weekday: number, slot: number) => Promise<void>;
}

const FORMAT_LABELS = { OFFLINE: 'Офлайн', ONLINE: 'Онлайн', HYBRID: 'Гібрид' } as const;

/** Short place caption for a grid cell: classroom for OFFLINE, both for HYBRID, link state for ONLINE. */
function lessonPlace(lesson: LessonSlot): string {
  if (lesson.format === 'ONLINE') return 'Онлайн';
  if (lesson.format === 'HYBRID') return `${lesson.location || 'Аудиторію не вказано'} · онлайн`;
  return lesson.location || 'Аудиторію не вказано';
}

interface DraftLesson {
  weekType: WeekType;
  weekday: number;
  slot: number;
  disciplineName: string;
  teacherName: string;
  location: string;
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  meetingLink: string;
}

export function ScheduleEditor({ groupId, schedule, canEdit, onSave, onDelete }: ScheduleEditorProps) {
  const [weekType, setWeekType] = useState<WeekType>('numerator');
  const [draft, setDraft] = useState<DraftLesson | null>(null);
  const [saving, setSaving] = useState(false);
  const { banner, show } = useBanner();

  const data = schedule.schedule;
  // Managers always see Monday to Saturday as columns, like any other day, so a Saturday
  // lesson can be added without extra clicks. Students see Saturday only when it has lessons.
  const storedDays = data[weekType];
  const hasSaturday = storedDays.some((day) => day.weekday === 6);
  const days = hasSaturday
    ? storedDays
    : [...storedDays, { weekday: 6, name: 'Субота', lessons: [null, null, null, null, null, null] }];
  const visibleDays = days.filter((day) => day.weekday <= 6);

  function openEditor(weekday: number, slot: number, current: LessonSlot | null) {
    if (!canEdit) return;
    setDraft({
      weekType,
      weekday,
      slot,
      disciplineName: current?.disciplineName ?? '',
      teacherName: current?.teacherName ?? '',
      location: current?.location ?? '',
      format: current?.format ?? 'OFFLINE',
      meetingLink: current?.meetingLink ?? '',
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
        location: draft.location.trim() || null,
        format: draft.format,
        meetingLink: draft.meetingLink.trim() || null,
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
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted">
            {canEdit ? 'Натисніть на клітинку, щоб додати або змінити пару' : 'Лише перегляд'}
          </p>
        </div>
      </div>

      <Banner message={banner?.message ?? null} tone={banner?.tone} />

      <div className="overflow-auto rounded-[18px] border border-border bg-surface">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-[110px] border-b border-border p-2 text-left font-semibold text-secondary">Час</th>
              {visibleDays.map((day) => (
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
                {visibleDays.map((day) => {
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
                              {lessonPlace(lesson)}
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
              <input className={fieldClass} value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="напр. 214" />
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
              <input className={fieldClass} value={draft.meetingLink} onChange={(event) => setDraft({ ...draft, meetingLink: event.target.value })} placeholder="https://meet.google.com/…" />
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
