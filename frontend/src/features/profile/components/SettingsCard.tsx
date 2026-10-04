import React from "react";

interface SettingsCardProps {
  language: string;
  theme: string;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
}) => {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm flex flex-col justify-between flex-1">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-gray-900">Налаштування</h2>
        <p className="text-xs text-gray-400">Параметри застосунку</p>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 my-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggleLanguage}
        >
          <span className="text-sm font-medium text-gray-900">
            Мова інтерфейсу
          </span>
          <span className="text-sm text-gray-500">{language}</span>
        </div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggleTheme}
        >
          <span className="text-sm font-medium text-gray-900">Тема</span>
          <span className="text-sm text-gray-500">{theme}</span>
        </div>
      </div>
    </div>
  );
};
