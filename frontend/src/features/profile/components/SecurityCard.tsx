import { useState } from "react";
import { useUser } from "@clerk/react";

interface SecurityCardProps {
  hasPassword: boolean;
  email: string;
}

const inputClassName =
  "w-full h-10 px-3 bg-[var(--input-background)] border border-[var(--border)] rounded-[10px] text-sm text-primary focus-visible:outline-3 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-[3px]";

export const SecurityCard = ({ hasPassword, email }: SecurityCardProps) => {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmailId, setPendingEmailId] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailNotice, setEmailNotice] = useState("");

  const updatePassword = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
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
      setError(
        caught instanceof Error ? caught.message : "Не вдалося оновити пароль.",
      );
    } finally {
      setBusy(false);
    }
  };

  const startEmailChange = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!user) return;
    setEmailBusy(true);
    setEmailError("");
    setEmailNotice("");
    try {
      const address = await user.createEmailAddress({ email: newEmail.trim() });
      await address.prepareVerification({ strategy: "email_code" });
      setPendingEmailId(address.id);
      setEmailNotice(`Код підтвердження надіслано на ${newEmail.trim()}.`);
    } catch (caught) {
      setEmailError(
        caught instanceof Error
          ? caught.message
          : "Не вдалося надіслати код підтвердження.",
      );
    } finally {
      setEmailBusy(false);
    }
  };

  const verifyEmailChange = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!user) return;
    const address = user.emailAddresses.find(
      (item) => item.id === pendingEmailId,
    );
    if (!address) {
      setEmailError(
        "Адресу для підтвердження не знайдено. Почніть зміну пошти ще раз.",
      );
      setPendingEmailId("");
      return;
    }

    setEmailBusy(true);
    setEmailError("");
    try {
      await address.attemptVerification({ code: verificationCode.trim() });
      await user.update({ primaryEmailAddressId: address.id });
      setEditingEmail(false);
      setPendingEmailId("");
      setVerificationCode("");
      setNewEmail("");
      setEmailNotice("Основну електронну пошту оновлено.");
    } catch (caught) {
      setEmailError(
        caught instanceof Error
          ? caught.message
          : "Не вдалося підтвердити електронну пошту.",
      );
    } finally {
      setEmailBusy(false);
    }
  };

  const cancelEmailChange = () => {
    setEditingEmail(false);
    setPendingEmailId("");
    setVerificationCode("");
    setNewEmail("");
    setEmailError("");
    setEmailNotice("");
  };

  return (
    <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full flex-1">
      <div>
        <div>
          <h2 className="text-lg font-bold text-primary">
            Безпека й обліковий запис
          </h2>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Пароль та активні дані облікового запису захищені Clerk
          </p>
        </div>

        <div className="border-t border-(--border) pt-4 mt-4" />

        <div className="flex flex-col gap-4">
          {/* Блок пошти */}
          <div className="min-h-15 flex flex-col justify-start">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col gap-1 text-xs text-secondary w-full sm:w-auto flex-1">
                <span>Основна електронна пошта</span>
                <span className="text-sm text-primary break-all font-normal leading-10">
                  {email || "Не вказано"}
                </span>
              </div>

              {!editingEmail ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEmail(true);
                    setEmailError("");
                    setEmailNotice("");
                  }}
                  className="px-2.75 py-2.25 min-w-35 border border-(--accent) text-(--accent) rounded-xl text-sm font-medium hover:bg-(--accent-soft) cursor-pointer transition-colors focus-visible:outline-3 focus-visible:outline-(--focus) focus-visible:outline-offset-[3px]"
                >
                  Змінити пошту
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelEmailChange}
                  className="px-2.75 py-2.25 min-w-35 border border-(--border) rounded-xl text-sm text-primary cursor-pointer hover:bg-(--surface-hover) transition-colors"
                >
                  Скасувати
                </button>
              )}
            </div>

            {editingEmail && !pendingEmailId && (
              <form
                onSubmit={startEmailChange}
                className="mt-4 flex flex-col gap-3"
              >
                <label className="flex flex-col gap-1 text-xs text-secondary">
                  Нова електронна пошта
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <div className="flex">
                  <button
                    type="submit"
                    disabled={emailBusy}
                    className="px-4 py-2.5 bg-(--accent) text-on-accent rounded-xl text-sm font-medium disabled:opacity-50 cursor-pointer"
                  >
                    {emailBusy ? "Надсилаємо…" : "Надіслати код"}
                  </button>
                </div>
              </form>
            )}

            {editingEmail && pendingEmailId && (
              <form
                onSubmit={verifyEmailChange}
                className="mt-4 flex flex-col gap-3"
              >
                <label className="flex flex-col gap-1 text-xs text-secondary">
                  Код із листа
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value)
                    }
                    className={inputClassName}
                  />
                </label>
                <div className="flex">
                  <button
                    type="submit"
                    disabled={emailBusy}
                    className="px-4 py-2.5 bg-(--accent) text-on-accent rounded-xl text-sm font-medium disabled:opacity-50 cursor-pointer"
                  >
                    {emailBusy ? "Перевіряємо…" : "Підтвердити пошту"}
                  </button>
                </div>
              </form>
            )}
            {(emailError || emailNotice) && (
              <p
                className={`mt-3 text-sm ${emailError ? "text-red-500" : "text-(--accent)"}`}
                role={emailError ? "alert" : "status"}
              >
                {emailError || emailNotice}
              </p>
            )}
          </div>

          {/* Блок пароля */}
          <div className="min-h-15 flex flex-col justify-start">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1 text-xs text-secondary flex-1">
                <span>Пароль</span>
                <span className="text-sm text-primary font-normal leading-10">
                  {hasPassword
                    ? "Для зміни потрібен поточний пароль"
                    : "Пароль для цього способу входу ще не налаштовано"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setExpanded((value) => !value);
                  setError("");
                  setNotice("");
                }}
                className="px-2.75 py-2.75 min-w-35 border border-(--accent) text-(--accent) rounded-xl text-sm font-medium hover:bg-(--accent-soft) cursor-pointer transition-colors focus-visible:outline-3 focus-visible:outline-(--focus) focus-visible:outline-offset-[3px]"
              >
                {expanded
                  ? "Скасувати"
                  : hasPassword
                    ? "Змінити пароль"
                    : "Налаштувати пароль"}
              </button>
            </div>

            {expanded && (
              <form
                onSubmit={updatePassword}
                className="flex flex-col gap-3 border-t border-(--border) pt-4 mt-4"
              >
                {hasPassword && (
                  <label className="flex flex-col gap-1 text-xs text-secondary">
                    Поточний пароль
                    <input
                      required
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      className={inputClassName}
                    />
                  </label>
                )}
                <label className="flex flex-col gap-1 text-xs text-secondary">
                  Новий пароль
                  <input
                    required
                    minLength={8}
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-secondary">
                  Повторіть новий пароль
                  <input
                    required
                    minLength={8}
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="self-start px-4 py-2.5 bg-(--accent) text-on-accent rounded-xl text-sm font-medium hover:bg-(--accent-hover) disabled:opacity-50 cursor-pointer"
                >
                  {busy ? "Оновлення…" : "Оновити пароль"}
                </button>
              </form>
            )}

            {(error || notice) && (
              <p
                className={`text-sm mt-2 ${error ? "text-red-500" : "text-(--accent)"}`}
                role={error ? "alert" : "status"}
              >
                {error || notice}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCard;
