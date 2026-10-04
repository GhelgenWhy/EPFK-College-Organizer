import React from "react";

interface SecurityCardProps {
  passwordLastUpdated: string;
  onChangePassword: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  passwordLastUpdated,
  onChangePassword,
}) => {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm flex flex-col justify-between flex-1">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-gray-900">
          Безпека й обліковий запис
        </h2>
        <p className="text-xs text-gray-400">Пароль захищено сервісом Clerk</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 my-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">Пароль</span>
          <span className="text-xs text-gray-400">
            Останнє оновлення - {passwordLastUpdated}
          </span>
        </div>
        <button
          onClick={onChangePassword}
          className="px-4 py-2 border border-teal-600 text-teal-700 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors cursor-pointer"
        >
          Змінити пароль
        </button>
      </div>
    </div>
  );
};
