import { useState } from "react";
import { useUser } from "@clerk/react";

type PersonalField = "firstName" | "lastName";

interface PersonalDataCardProps {
  firstName: string;
  lastName: string;
  email: string;
  onChange: (field: PersonalField, value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export const PersonalDataCard = ({
  firstName,
  lastName,
  email,
  onChange,
  onSave,
  saving,
}: PersonalDataCardProps) => {
  const { user } = useUser();
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmailId, setPendingEmailId] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailNotice, setEmailNotice] = useState("");

  const startEmailChange = async (event: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      setEmailError(
        error instanceof Error
          ? error.message
          : "Не вдалося надіслати код підтвердження.",
      );
    } finally {
      setEmailBusy(false);
    }
  };

  const verifyEmailChange = async (event: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      setEmailError(
        error instanceof Error
          ? error.message
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
    <section className="bg-surface rounded-[20px] p-6 shadow-sm flex flex-col gap-4 flex-1">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Особисті дані</h2>
        <p className="text-xs text-gray-400 mt-0.5">Дані профілю</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Ім’я
          <input
            type="text"
            value={firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
            autoComplete="given-name"
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-500">
          Прізвище
          <input
            type="text"
            value={lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
            autoComplete="family-name"
            className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="self-start px-4 py-2 bg-teal-700 text-on-accent rounded-xl text-sm font-medium hover:bg-teal-800 disabled:opacity-50"
      >
        {saving ? "Збереження…" : "Зберегти ім’я"}
      </button>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Основна електронна пошта</p>
            <p className="text-sm text-gray-800 break-all">
              {email || "Не вказано"}
            </p>
          </div>
          {!editingEmail && (
            <button
              type="button"
              onClick={() => {
                setEditingEmail(true);
                setEmailError("");
                setEmailNotice("");
              }}
              className="px-3 py-2 border border-teal-600 text-teal-700 rounded-xl text-sm font-medium hover:bg-teal-50"
            >
              Змінити пошту
            </button>
          )}
        </div>

        {editingEmail && !pendingEmailId && (
          <form
            onSubmit={startEmailChange}
            className="mt-4 flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Нова електронна пошта
              <input
                type="email"
                required
                autoComplete="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={emailBusy}
                className="px-4 py-2 bg-teal-700 text-on-accent rounded-xl text-sm disabled:opacity-50"
              >
                {emailBusy ? "Надсилаємо…" : "Надіслати код"}
              </button>
              <button
                type="button"
                onClick={cancelEmailChange}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
              >
                Скасувати
              </button>
            </div>
          </form>
        )}

        {editingEmail && pendingEmailId && (
          <form
            onSubmit={verifyEmailChange}
            className="mt-4 flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1 text-xs text-gray-500">
              Код із листа
              <input
                type="text"
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-[10px] text-sm text-gray-800 focus:outline-teal-600"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={emailBusy}
                className="px-4 py-2 bg-teal-700 text-on-accent rounded-xl text-sm disabled:opacity-50"
              >
                {emailBusy ? "Перевіряємо…" : "Підтвердити пошту"}
              </button>
              <button
                type="button"
                onClick={cancelEmailChange}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
              >
                Скасувати
              </button>
            </div>
          </form>
        )}
        {(emailError || emailNotice) && (
          <p
            className={`mt-3 text-sm ${emailError ? "text-red-700" : "text-teal-800"}`}
            role={emailError ? "alert" : "status"}
          >
            {emailError || emailNotice}
          </p>
        )}
      </div>
    </section>
  );
};
