import React from "react";

interface EducationalInfoCardProps {
  group: string;
  role: string;
  syncLink: string;
  onChange: (field: string, value: string) => void;
}

export const EducationalInfoCard: React.FC<EducationalInfoCardProps> = ({
  group,
  role,
  syncLink,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Навчальна інформація
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Група визначає дані розкладу та завдань
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Навчальна група</label>
          <input
            type="text"
            value={group}
            onChange={(e) => onChange("group", e.target.value)}
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Роль</label>
          <input
            type="text"
            value={role}
            onChange={(e) => onChange("role", e.target.value)}
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 flex items-center gap-1">
          Посилання для синхронізації ⓘ
        </label>
        <input
          type="text"
          value={syncLink}
          onChange={(e) => onChange("syncLink", e.target.value)}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-teal-700 truncate focus:outline-teal-600"
        />
      </div>
    </div>
  );
};
