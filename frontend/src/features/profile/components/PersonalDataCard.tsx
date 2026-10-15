import type { FC } from "react";

type PersonalField = "firstName" | "lastName";

interface PersonalDataCardProps {
  firstName: string;
  lastName: string;
  onChange: (field: PersonalField, value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const inputClassName =
  "w-full h-10 px-3 bg-[var(--input-background)] border border-[var(--border)] rounded-[10px] text-sm text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]";

export const PersonalDataCard: FC<PersonalDataCardProps> = ({
  firstName,
  lastName,
  onChange,
  onSave,
  saving,
}) => {
  return (
    <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full flex-1">
      <div>
        <div>
          <h2 className="text-lg font-bold text-primary">Особисті дані</h2>
          <p className="text-xs text-(--text-muted) mt-0.5">Дані профілю</p>
        </div>

        <div className="border-t border-(--border) pt-4 mt-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-xs text-secondary">
            Ім’я
            <input
              type="text"
              value={firstName}
              onChange={(event) => onChange("firstName", event.target.value)}
              autoComplete="given-name"
              className={inputClassName}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-secondary">
            Прізвище
            <input
              type="text"
              value={lastName}
              onChange={(event) => onChange("lastName", event.target.value)}
              autoComplete="family-name"
              className={inputClassName}
            />
          </label>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div aria-hidden="true" className="hidden sm:block" />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2.5 min-w-35 bg-(--accent) text-on-accent rounded-xl text-sm font-medium hover:bg-(--accent-hover) disabled:opacity-50 cursor-pointer transition-colors focus-visible:outline-3 focus-visible:outline-(--focus) focus-visible:outline-offset-[3px]"
            >
              {saving ? "Збереження…" : "Зберегти ім’я"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalDataCard;
