import { useState } from 'react';
import type { EventPayload, EventRow } from '../../../services/api/management';
import { Banner } from './ManageUi';
import { dangerButtonClass, fieldClass, primaryButtonClass, secondaryButtonClass } from './styles';
import { useBanner } from '../hooks/useBanner';
import { formatKyivDateTime } from '../../../lib/nullSafe';

interface EventManagerProps {
  canEdit: boolean;
  onCreate: (payload: EventPayload & { eventName: string; startTime: string }) => Promise<void>;
  onUpdate: (eventId: number, payload: EventPayload) => Promise<void>;
  onDelete: (eventId: number) => Promise<void>;
  /** Rows rendered by the caller after each mutation (the page refetches). */
  events: EventRow[];
}

const EMPTY_FORM = { eventName: '', localTime: '', place: '', description: '', organizer: '', detailsUrl: '' };
type FormField = keyof typeof EMPTY_FORM;
/** Fields that must be filled in; the rest may stay empty (and are cleared on edit when emptied). */
const REQUIRED_FIELDS: FormField[] = ['eventName', 'localTime', 'place', 'description'];

/** Value for `<input type="datetime-local">` from an ISO timestamp; empty when the value is missing. */
function toLocalInput(iso: string | null) {
  if (!iso || Number.isNaN(Date.parse(iso))) return '';
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatEventTime(iso: string | null) {
  return formatKyivDateTime(
    iso,
    { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    'Час не вказано',
  );
}

/** Input class; a red border and ring mark a required field that is still empty. */
function inputClass(invalid: boolean, extra = '') {
  const base = invalid
    ? `${fieldClass.replace('border-border', 'border-[var(--danger)]')} ring-1 ring-[var(--danger)]`
    : fieldClass;
  return `${base} ${extra}`.trim();
}

export function EventManager({ canEdit, events, onCreate, onUpdate, onDelete }: EventManagerProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [invalid, setInvalid] = useState<Partial<Record<FormField, boolean>>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const { banner, show } = useBanner();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');

  const [nowMs] = useState(() => Date.now());
  const query = search.trim().toLowerCase();
  const filtersActive = query !== '' || period !== 'ALL';
  const visibleEvents = events.filter((event) => {
    const startsMs = Date.parse(event.startTime);
    if (period === 'UPCOMING' && !(startsMs >= nowMs)) return false;
    if (period === 'PAST' && !(startsMs < nowMs)) return false;
    if (!query) return true;
    return [event.eventName, event.place, event.organizer, event.description]
      .some((value) => (value ?? '').toLowerCase().includes(query));
  });

  function resetForm() {
    setForm(EMPTY_FORM);
    setInvalid({});
    setEditingId(null);
  }

  function startEdit(event: EventRow) {
    setEditingId(event.id);
    setInvalid({});
    setForm({
      eventName: event.eventName,
      localTime: toLocalInput(event.startTime),
      place: event.place ?? '',
      description: event.description ?? '',
      organizer: event.organizer ?? '',
      detailsUrl: event.detailsUrl ?? '',
    });
  }

  function update(field: FormField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (invalid[field] && value.trim()) setInvalid((current) => ({ ...current, [field]: false }));
  }

  async function submit() {
    const missing: Partial<Record<FormField, boolean>> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!form[field].trim()) missing[field] = true;
    }
    setInvalid(missing);
    if (Object.keys(missing).length > 0) {
      show('Заповніть обов’язкові поля (підсвічені червоним)', 'error');
      return;
    }
    // Optional fields are sent as null when empty, so an edit actually clears them on the server.
    const payload = {
      eventName: form.eventName.trim(),
      startTime: new Date(form.localTime).toISOString(),
      place: form.place.trim(),
      description: form.description.trim(),
      organizer: form.organizer.trim() || null,
      detailsUrl: form.detailsUrl.trim() || null,
    };
    setBusy(true);
    try {
      if (editingId === null) {
        await onCreate(payload as EventPayload & { eventName: string; startTime: string });
        show('Подію створено');
      } else {
        await onUpdate(editingId, payload);
        show('Подію оновлено');
      }
      resetForm();
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося зберегти подію', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function remove(eventId: number) {
    setBusy(true);
    try {
      await onDelete(eventId);
      show('Подію видалено');
      if (editingId === eventId) resetForm();
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося видалити подію', 'error');
    } finally {
      setBusy(false);
    }
  }

  const requiredMark = <span className="text-[var(--danger)]">*</span>;

  return (
    <div className="flex flex-col gap-3">
      <Banner message={banner?.message ?? null} tone={banner?.tone} />

      {canEdit && (
        <div className="rounded-[18px] border border-border bg-surface p-4">
          <h3 className="mb-3 text-base font-semibold text-primary">
            {editingId === null ? 'Нова подія' : 'Редагування події'}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              <span>Назва {requiredMark}</span>
              <input className={inputClass(!!invalid.eventName)} value={form.eventName} onChange={(event) => update('eventName', event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              <span>Дата й час {requiredMark}</span>
              <input type="datetime-local" className={inputClass(!!invalid.localTime)} value={form.localTime} onChange={(event) => update('localTime', event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              <span>Місце {requiredMark}</span>
              <input className={inputClass(!!invalid.place)} value={form.place} onChange={(event) => update('place', event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              <span>Організатор <span className="font-normal text-muted">(необов’язково)</span></span>
              <input className={inputClass(false)} value={form.organizer} onChange={(event) => update('organizer', event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary sm:col-span-2">
              <span>Посилання на деталі або реєстрацію <span className="font-normal text-muted">(необов’язково)</span></span>
              <input className={inputClass(false)} placeholder="https://" value={form.detailsUrl} onChange={(event) => update('detailsUrl', event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary sm:col-span-2">
              <span>Опис {requiredMark}</span>
              <textarea className={inputClass(!!invalid.description, 'min-h-[70px]')} value={form.description} onChange={(event) => update('description', event.target.value)} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {editingId !== null && (
              <button type="button" className={secondaryButtonClass} onClick={resetForm}>Скасувати</button>
            )}
            <button type="button" className={primaryButtonClass} disabled={busy} onClick={submit}>
              {editingId === null ? 'Створити подію' : 'Зберегти зміни'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-[16px] border border-border bg-surface p-3">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-semibold text-secondary">
          Пошук
          <input
            className={fieldClass}
            placeholder="Назва, місце, організатор, опис"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className="flex w-[180px] flex-col gap-1 text-xs font-semibold text-secondary">
          Період
          <select
            className={fieldClass}
            value={period}
            onChange={(event) => setPeriod(event.target.value as 'ALL' | 'UPCOMING' | 'PAST')}
          >
            <option value="ALL">Усі</option>
            <option value="UPCOMING">Майбутні</option>
            <option value="PAST">Минулі</option>
          </select>
        </label>
        {filtersActive && (
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => {
              setSearch('');
              setPeriod('ALL');
            }}
          >
            Скинути
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {events.length === 0 && <p className="text-sm text-muted">Подій ще немає</p>}
        {events.length > 0 && visibleEvents.length === 0 && (
          <p className="text-sm text-muted">За цими фільтрами подій немає</p>
        )}
        {visibleEvents.map((event) => (
          <article key={event.id} className="rounded-[16px] border border-border bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 className="text-base font-semibold text-primary">{event.eventName}</h4>
                <p className="text-xs text-secondary">
                  {formatEventTime(event.startTime)}
                  {event.place ? ` · ${event.place}` : ''}
                </p>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button type="button" className={secondaryButtonClass} onClick={() => startEdit(event)}>Редагувати</button>
                  <button type="button" className={dangerButtonClass} disabled={busy} onClick={() => void remove(event.id)}>Видалити</button>
                </div>
              )}
            </div>
            {event.description && <p className="mt-2 text-sm text-secondary">{event.description}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
