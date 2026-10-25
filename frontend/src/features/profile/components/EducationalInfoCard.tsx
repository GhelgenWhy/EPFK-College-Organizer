import { useState } from "react";

export interface GroupOption {
  id: number;
  groupName: string;
}

interface EducationalInfoCardProps {
  /** Current server-side group id (null when the admin has not assigned one). */
  groupId: number | null;
  /** Existing groups the user may pick from. The user cannot create groups. */
  groupOptions: GroupOption[];
  role: string;
  moodleLogin: string;
  moodlePassword: string;
  onChooseGroup: (groupId: number) => void;
  onSave: (data: { moodleLogin: string; moodlePassword: string }) => void;
  saving: boolean;
}

const inputClassName =
  "w-full h-10 px-3 bg-[var(--input-background)] border border-[var(--border)] rounded-[10px] text-sm text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]";

export const EducationalInfoCard = ({
  groupId,
  groupOptions,
  role,
  moodleLogin: initialMoodleLogin,
  moodlePassword: initialMoodlePassword,
  onChooseGroup,
  onSave,
  saving,
}: EducationalInfoCardProps) => {
  // Parent re-mounts this card (via key) when the stored Moodle data changes, so no effect is needed.
  const [moodleLogin, setMoodleLogin] = useState(initialMoodleLogin);
  const [moodlePassword, setMoodlePassword] = useState(initialMoodlePassword);

  // The parent performs the Moodle sync (token is exchanged on the backend);
  // this card only collects the values and never calls Moodle or stores the password.
  const handleSaveClick = () => {
    onSave({ moodleLogin, moodlePassword });
  };

  const isBusy = saving;

  return (
    <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full flex-1">
      <div>
        <div>
          <h2 className="text-lg font-bold text-primary">
            Навчальна інформація
          </h2>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Група визначає дані розкладу та завдань
          </p>
        </div>

        <div className="border-t border-(--border) pt-4 mt-4" />

        <div className="flex flex-col gap-4">
          <div className="min-h-15 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-xs text-secondary">
                Навчальна група
                <select
                  value={groupId ?? ""}
                  onChange={(e) => {
                    if (e.target.value) onChooseGroup(Number(e.target.value));
                  }}
                  disabled={isBusy || groupOptions.length === 0}
                  className={inputClassName}
                >
                  {groupId === null && <option value="">Групу не обрано</option>}
                  {groupOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.groupName}
                    </option>
                  ))}
                </select>
                {groupOptions.length === 0 && (
                  <span className="text-[11px] text-(--text-muted)">Групи ще не створено адміністратором</span>
                )}
              </label>
              <label className="flex flex-col gap-1 text-xs text-secondary">
                Роль
                <input
                  type="text"
                  value={role}
                  readOnly
                  className={`${inputClassName} text-(--text-muted) cursor-not-allowed`}
                />
              </label>
            </div>
          </div>

          <div className="min-h-15 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-xs text-secondary">
                Логін Moodle
                <input
                  type="text"
                  value={moodleLogin}
                  onChange={(e) => setMoodleLogin(e.target.value)}
                  className={inputClassName}
                  placeholder="Введіть логін"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-secondary">
                Пароль Moodle
                <input
                  type="password"
                  value={moodlePassword}
                  onChange={(e) => setMoodlePassword(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••••"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto flex gap-3 justify-end">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isBusy}
          className="self-start px-4 py-2.5 bg-(--accent) text-on-accent rounded-xl text-sm font-medium hover:bg-(--accent-hover) disabled:opacity-50 cursor-pointer transition-colors focus-visible:outline-3 focus-visible:outline-(--focus) focus-visible:outline-offset-[3px]"
        >
          {isBusy ? "Збереження…" : "Зберегти навчальні дані"}
        </button>
      </div>
    </section>
  );
};

export default EducationalInfoCard;
