import React from "react";

interface PersonalDataCardProps {
  firstName: string;
  lastName: string;
  email: string;
  onChange: (field: string, value: string) => void;
}

export const PersonalDataCard: React.FC<PersonalDataCardProps> = ({
  firstName,
  lastName,
  email,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Особисті дані</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Дані профілю доступні лише для перегляду
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Ім'я</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Прізвище</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Електронна пошта</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
        />
      </div>
    </div>
  );
};
