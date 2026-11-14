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
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-primary">Налаштування</h2>
        <p className="text-xs text-(--text-muted)">Параметри застосунку</p>
      </div>

      <div className="border-t border-(--border) pt-4 mt-4" />

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onToggleLanguage}
          disabled={saving}
          className="flex items-center justify-between gap-3 text-left disabled:opacity-50 cursor-pointer"
        >
          <span className="text-sm font-medium text-primary">
            Мова інтерфейсу
          </span>
          <span className="text-sm text-(--accent)">{language} · Змінити</span>
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          disabled={saving}
          className="flex items-center justify-between gap-3 text-left disabled:opacity-50 cursor-pointer pt-3"
        >
          <span className="text-sm font-medium text-primary">Тема</span>
          <span className="text-sm text-(--accent)">{theme} · Змінити</span>
        </button>
        {saving && (
          <p className="text-xs text-(--text-muted) pt-2" role="status">
            Збереження…
          </p>
        )}
      </div>
    </div>
  </section>
);
