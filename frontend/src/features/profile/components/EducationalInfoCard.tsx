import type { ChangeEvent } from "react";

interface EducationalInfoCardProps {
  group: string;
  role: string;
  syncLink: string;
  onChange: (field: "group" | "syncLink", value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const inputClassName = "w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600";

export const EducationalInfoCard = ({
  group,
  role,
  syncLink,
  onChange,
  onSave,
  saving,
}: EducationalInfoCardProps) => {
  const update = (field: "group" | "syncLink") => (event: ChangeEvent<HTMLInputElement>) =>
    onChange(field, event.target.value);

  return (
    <section className="bg-white rounded-[20px] p-6 shadow-sm flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Навчальна інформація</h2>
        <p className="text-xs text-gray-400 mt-0.5">Зберігається в метаданих профілю Clerk</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Навчальна група
          <input type="text" value={group} onChange={update("group")} className={inputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Роль
          <input type="text" value={role} readOnly className={`${inputClassName} text-gray-500 cursor-not-allowed`} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-gray-500">
        Посилання для синхронізації
        <input type="url" value={syncLink} onChange={update("syncLink")} className={`${inputClassName} text-teal-700`} />
      </label>

      <p className="text-xs text-gray-400">Роль керується адміністратором і не змінюється зі сторінки профілю.</p>
      <button type="button" onClick={onSave} disabled={saving} className="self-start px-4 py-2 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 disabled:opacity-50">
        {saving ? "Збереження…" : "Зберегти навчальні дані"}
      </button>
    </section>
  );
};
