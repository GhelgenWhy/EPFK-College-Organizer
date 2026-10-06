import React from "react";

interface SettingsCardProps {
  language: string;
  theme: string;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  saving: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
  saving,
}) => (
  <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col justify-between flex-1">
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-bold text-gray-900">Налаштування</h2>
      <p className="text-xs text-gray-400">Параметри застосунку</p>
    </div>

    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 my-4">
      <button
        type="button"
        onClick={onToggleLanguage}
        disabled={saving}
        className="flex items-center justify-between gap-3 text-left disabled:opacity-50"
      >
        <span className="text-sm font-medium text-gray-900">
          Мова інтерфейсу
        </span>
        <span className="text-sm text-teal-700">{language} · Змінити</span>
      </button>
      <button
        type="button"
        onClick={onToggleTheme}
        disabled={saving}
        className="flex items-center justify-between gap-3 text-left disabled:opacity-50"
      >
        <span className="text-sm font-medium text-gray-900">Тема</span>
        <span className="text-sm text-teal-700">{theme} · Змінити</span>
      </button>
      {saving && (
        <p className="text-xs text-gray-400" role="status">
          Збереження…
        </p>
      )}
    </div>
  </section>
);
