import { useState } from "react";
import type { PeriodFilter, StatusFilter, SortOption } from "../types";

interface EventHeaderProps {
  period: PeriodFilter;
  setPeriod: (val: PeriodFilter) => void;
  status: StatusFilter;
  setStatus: (val: StatusFilter) => void;
  sort: SortOption;
  setSort: (val: SortOption) => void;
  onReset: () => void;
}

export const EventHeader = ({
  period,
  setPeriod,
  status,
  setStatus,
  sort,
  setSort,
  onReset,
}: EventHeaderProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const periodOptions: PeriodFilter[] = [
    "Усі дати",
    "Цей тиждень",
    "Цей місяць",
    "Минулі",
  ];
  const statusOptions: StatusFilter[] = [
    "Усі статуси",
    "Заплановано",
    "Перенесено",
    "Завершено",
  ];
  const sortOptions: SortOption[] = [
    "Спочатку найближчі",
    "Спочатку найдальші",
    "За назвою",
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="w-full px-[30px] pt-[29px] pb-5 max-[760px]:px-4 max-[760px]:pt-4">
      <div className="flex flex-wrap items-center bg-white py-[17px] px-[22px] gap-[16px] rounded-[18px] shadow-sm relative z-30">
        {/* 1. Період */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-[12px] text-gray-400 font-medium">
            Період
          </label>
          <div
            onClick={() => toggleDropdown("period")}
            className="flex items-center justify-between px-3 w-[205px] h-[38px] bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-[10px] cursor-pointer text-sm transition-colors select-none"
          >
            <span className="truncate">{period}</span>
            <svg
              className={`w-4 h-4 text-gray-500 shrink-0 ml-2 transition-transform duration-200 ${openDropdown === "period" ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {openDropdown === "period" && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-[205px] bg-white border border-gray-100 rounded-[14px] shadow-xl py-2 z-40 flex flex-col gap-1">
              {periodOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setPeriod(option);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 mx-2 rounded-[10px] text-sm cursor-pointer transition-colors ${period === option
                    ? "bg-[#E6F4F1] text-[#00796B] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Статус */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-[12px] text-gray-400 font-medium">
            Статус
          </label>
          <div
            onClick={() => toggleDropdown("status")}
            className="flex items-center justify-between px-3 w-[205px] h-[38px] bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-[10px] cursor-pointer text-sm transition-colors select-none"
          >
            <span className="truncate">{status}</span>
            <svg
              className={`w-4 h-4 text-gray-500 shrink-0 ml-2 transition-transform duration-200 ${openDropdown === "status" ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {openDropdown === "status" && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-[205px] bg-white border border-gray-100 rounded-[14px] shadow-xl py-2 z-40 flex flex-col gap-1">
              {statusOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setStatus(option);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 mx-2 rounded-[10px] text-sm cursor-pointer transition-colors ${status === option
                    ? "bg-[#E6F4F1] text-[#00796B] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Сортування */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-[12px] text-gray-400 font-medium">
            Сортування
          </label>
          <div
            onClick={() => toggleDropdown("sort")}
            className="flex items-center justify-between px-3 w-[205px] h-[38px] bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-[10px] cursor-pointer text-sm transition-colors select-none"
          >
            <span className="truncate">{sort}</span>
            <svg
              className={`w-4 h-4 text-gray-500 shrink-0 ml-2 transition-transform duration-200 ${openDropdown === "sort" ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {openDropdown === "sort" && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-[205px] bg-white border border-gray-100 rounded-[14px] shadow-xl py-2 z-40 flex flex-col gap-1">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSort(option);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 mx-2 rounded-[10px] text-sm cursor-pointer transition-colors ${sort === option
                    ? "bg-[#E6F4F1] text-[#00796B] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка сброса */}
        <button
          onClick={onReset}
          className="text-teal-600 text-sm font-medium hover:underline self-center mt-5 cursor-pointer"
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
};

export default EventHeader;
