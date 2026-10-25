import { useState } from 'react';
import type { EventRow } from '../../../services/api/management';
import { Banner } from './ManageUi';
import { dangerButtonClass, fieldClass, primaryButtonClass, secondaryButtonClass } from './styles';
import { useBanner } from '../hooks/useBanner';
import { formatKyivDateTime } from '../../../lib/nullSafe';

interface EventManagerProps {
  canEdit: boolean;
  onCreate: (payload: { eventName: string; startTime: string; place?: string; description?: string }) => Promise<void>;
  onUpdate: (eventId: number, payload: { eventName: string; startTime: string; place?: string; description?: string }) => Promise<void>;
  onDelete: (eventId: number) => Promise<void>;
  /** Rows rendered by the caller after each mutation (the page refetches). */
  events: EventRow[];
}

const EMPTY_FORM = { eventName: '', localTime: '', place: '', description: '' };

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

export function EventManager({ canEdit, events, onCreate, onUpdate, onDelete }: EventManagerProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const { banner, show } = useBanner();

  function startEdit(event: EventRow) {
    setEditingId(event.id);
    setForm({
      eventName: event.eventName,
      localTime: toLocalInput(event.startTime),
      place: event.place ?? '',
      description: event.description ?? '',
    });
  }

  async function submit() {
    if (!form.eventName.trim() || !form.localTime) {
      show('Вкажіть назву та час події', 'error');
      return;
    }
    const payload = {
      eventName: form.eventName.trim(),
      startTime: new Date(form.localTime).toISOString(),
      place: form.place.trim() || undefined,
      description: form.description.trim() || undefined,
    };
    setBusy(true);
    try {
      if (editingId === null) {
        await onCreate(payload);
        show('Подію створено');
      } else {
        await onUpdate(editingId, payload);
        show('Подію оновлено');
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
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
      if (editingId === eventId) setEditingId(null);
    } catch (error) {
      show(error instanceof Error ? error.message : 'Не вдалося видалити подію', 'error');
    } finally {
      setBusy(false);
    }
  }

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
              Назва
              <input className={fieldClass} value={form.eventName} onChange={(event) => setForm({ ...form, eventName: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Дата й час
              <input type="datetime-local" className={fieldClass} value={form.localTime} onChange={(event) => setForm({ ...form, localTime: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary">
              Місце
              <input className={fieldClass} value={form.place} onChange={(event) => setForm({ ...form, place: event.target.value })} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-secondary sm:col-span-2">
              Опис
              <textarea className={`${fieldClass} min-h-[70px]`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {editingId !== null && (
              <button type="button" className={secondaryButtonClass} onClick={() => setEditingId(null)}>Скасувати</button>
            )}
            <button type="button" className={primaryButtonClass} disabled={busy} onClick={submit}>
              {editingId === null ? 'Створити подію' : 'Зберегти зміни'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {events.length === 0 && <p className="text-sm text-muted">Подій ще немає</p>}
        {events.map((event) => (
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
