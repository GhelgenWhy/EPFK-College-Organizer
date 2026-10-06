import { useState } from "react";

interface EducationalInfoCardProps {
  group: string;
  role: string;
  moodleLogin: string;
  moodlePassword: string;
  onSave: (data: {
    group: string;
    moodleLogin: string;
    moodlePassword: string;
  }) => void;
  saving: boolean;
}

const inputClassName =
  "w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600";

export const EducationalInfoCard = ({
  group: initialGroup,
  role,
  moodleLogin: initialMoodleLogin,
  moodlePassword: initialMoodlePassword,
  onSave,
  saving,
}: EducationalInfoCardProps) => {
  const [group, setGroup] = useState(initialGroup);
  const [moodleLogin, setMoodleLogin] = useState(initialMoodleLogin);
  const [moodlePassword, setMoodlePassword] = useState(initialMoodlePassword);

  const handleSaveClick = () => {
    onSave({ group, moodleLogin, moodlePassword });
  };

  return (
    <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Навчальна інформація
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Група визначає дані розкладу та завдань
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Навчальна група
          <input
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Роль
          <input
            type="text"
            value={role}
            readOnly
            className={`${inputClassName} text-gray-500 cursor-not-allowed`}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Логін Moodle
          <input
            type="text"
            value={moodleLogin}
            onChange={(e) => setMoodleLogin(e.target.value)}
            className={inputClassName}
            placeholder="Введіть логін"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
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

      <p className="text-xs text-gray-400">
        Роль керується адміністратором і не змінюється зі сторінки профілю.
      </p>
      <button
        type="button"
        onClick={handleSaveClick}
        disabled={saving}
        className="self-start px-4 py-2 bg-teal-700 text-on-accent rounded-xl text-sm font-medium hover:bg-teal-800 disabled:opacity-50"
      >
        {saving ? "Збереження…" : "Зберегти навчальні дані"}
      </button>
    </section>
  );
};

export default EducationalInfoCard;
