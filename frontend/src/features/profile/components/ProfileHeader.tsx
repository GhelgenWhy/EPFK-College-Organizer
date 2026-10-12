import React, { useRef } from "react";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  group: string;
  role: string;
  avatarUrl?: string;
  onAvatarChange: (file: File) => void;
  onAvatarDelete: () => void;
  disabled?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  email,
  group,
  role,
  avatarUrl,
  onAvatarChange,
  onAvatarDelete,
  disabled = false,
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  return (
    <div className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-on-accent flex items-center justify-center text-xl font-bold overflow-hidden shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-900">
            {firstName} {lastName}
          </h1>
          <span className="text-sm text-gray-500">{email}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 bg-[var(--accent-soft)] text-[var(--accent)] rounded-md text-xs font-medium">
              {group}
            </span>
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
              {role}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Вибрати фото профілю"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onAvatarChange(file);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={disabled}
          className="px-4 py-2 border border-teal-600 text-teal-700 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Змінити фото
        </button>
        <button
          type="button"
          onClick={onAvatarDelete}
          disabled={disabled || !avatarUrl}
          className="text-sm text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
        >
          Видалити фото
        </button>
      </div>
    </div>
  );
};
