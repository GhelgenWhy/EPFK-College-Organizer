import { useState, type FormEvent } from "react";
import { useUser } from "@clerk/react";

interface SecurityCardProps {
  hasPassword: boolean;
}

export const SecurityCard = ({ hasPassword }: SecurityCardProps) => {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setError("Паролі не збігаються.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await user.updatePassword({
        ...(hasPassword ? { currentPassword } : {}),
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setExpanded(false);
      setNotice("Пароль оновлено.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не вдалося оновити пароль.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Безпека й обліковий запис</h2>
        <p className="text-xs text-gray-400">Пароль та активні дані облікового запису захищені Clerk</p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">Пароль</span>
          <span className="text-xs text-gray-400">
            {hasPassword ? "Для зміни потрібен поточний пароль" : "Пароль для цього способу входу ще не налаштовано"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => { setExpanded((value) => !value); setError(""); setNotice(""); }}
          className="shrink-0 px-4 py-2 border border-teal-600 text-teal-700 rounded-xl text-sm font-medium hover:bg-teal-50"
        >
          {expanded ? "Скасувати" : hasPassword ? "Змінити пароль" : "Налаштувати пароль"}
        </button>
      </div>

      {expanded && (
        <form onSubmit={updatePassword} className="flex flex-col gap-3 border-t border-gray-100 pt-4">
          {hasPassword && (
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Поточний пароль
              <input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600" />
            </label>
          )}
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Новий пароль
            <input required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Повторіть новий пароль
            <input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600" />
          </label>
          <button type="submit" disabled={busy} className="self-start px-4 py-2 bg-teal-700 text-on-accent rounded-xl text-sm font-medium hover:bg-teal-800 disabled:opacity-50">
            {busy ? "Оновлення…" : "Оновити пароль"}
          </button>
        </form>
      )}

      {(error || notice) && (
        <p className={`text-sm ${error ? "text-red-700" : "text-teal-800"}`} role={error ? "alert" : "status"}>
          {error || notice}
        </p>
      )}
    </section>
  );
};
