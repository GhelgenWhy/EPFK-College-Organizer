import { useState } from "react";
import { useUser, useAuth } from "@clerk/react";
import { moodleApi } from "../services/api/moodle";
import { ProfileHeader } from "../features/profile/components/ProfileHeader.tsx";
import { PersonalDataCard } from "../features/profile/components/PersonalDataCard";
import { EducationalInfoCard } from "../features/profile/components/EducationalInfoCard";
import { SecurityCard } from "../features/profile/components/SecurityCard";
import { SettingsCard } from "../features/profile/components/SettingsCard";
import { Toast } from "../features/profile/components/Toast";
import { resolveAppRole } from "../features/auth/roles";
import type { ProfileForm } from "../features/profile/types";
import { useTheme } from "../features/theme/useTheme";

const readMetadataString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Не вдалося зберегти зміни. Спробуйте ще раз.";

export const ProfilePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return (
      <div className="auth-loading" role="status">
        Завантаження профілю…
      </div>
    );
  }
  if (!isSignedIn || !user) return null;
  return <LoadedProfilePage key={user.id} user={user} />;
};

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

const LoadedProfilePage = ({ user }: { user: ClerkUser }) => {
  const { setTheme } = useTheme();
  const { getToken } = useAuth();
  const [form, setForm] = useState<ProfileForm>(() => ({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    group: readMetadataString(user.unsafeMetadata.group),
    moodleLogin: readMetadataString(user.unsafeMetadata.moodleLogin),
    moodlePassword: readMetadataString(user.unsafeMetadata.moodlePassword),
    language:
      user.unsafeMetadata.language === "English" ? "English" : "Українська",
    theme: user.unsafeMetadata.theme === "Темна" ? "Темна" : "Світла",
  }));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const role = resolveAppRole(user.publicMetadata.role);
  const roleLabel = {
    user: "Користувач",
    admin: "Адміністратор",
    supervisor: "Куратор",
  }[role];

  const save = async (
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(successMessage);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  const savePersonalData = () =>
    save(
      () =>
        user.update({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        }),
      "Особисті дані успішно оновлено.",
    );

  const saveEducation = (data: {
    group: string;
    moodleLogin: string;
    moodlePassword: string;
  }) =>
    save(async () => {
      const controller = new AbortController();
      await moodleApi.postCredentials(
        {
          username: data.moodleLogin.trim(),
          password: data.moodlePassword,
        },
        {
          getToken,
          signal: controller.signal,
        },
      );
      await user.updateMetadata({
        unsafeMetadata: {
          group: data.group.trim(),
          moodleLogin: data.moodleLogin.trim(),
          moodlePassword: data.moodlePassword.trim(),
        },
      });
      setForm((current) => ({
        ...current,
        group: data.group.trim(),
        moodleLogin: data.moodleLogin.trim(),
        moodlePassword: data.moodlePassword.trim(),
      }));
    }, "Навчальну інформацію та дані Moodle збережено.");

  const changeAvatar = (file: File) =>
    save(() => user.setProfileImage({ file }), "Фото профілю успішно змінено.");

  const removeAvatar = () =>
    save(() => user.setProfileImage({ file: null }), "Фото профілю видалено.");

  const updatePreference = (
    next: Partial<Pick<ProfileForm, "language" | "theme">>,
  ) => {
    const updated = { ...form, ...next };
    setForm(updated);
    if (next.theme) setTheme(next.theme === "Темна" ? "dark" : "light");

    const message = next.language
      ? `Мову інтерфейсу змінено на ${next.language}.`
      : next.theme
        ? `Активовано ${next.theme.toLowerCase()} тему оформлення.`
        : "Налаштування збережено.";

    void save(() => user.updateMetadata({ unsafeMetadata: next }), message);
  };

  return (
    <main
      className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto px-7.5 py-7.5 [scrollbar-color:var(--scrollbar)_transparent] scrollbar-thin max-[760px]:px-4 max-[760px]:py-4"
      aria-labelledby="profile-heading"
      tabIndex={0}
    >
      {(notice || error) && (
        <Toast
          message={error || notice}
          type={error ? "error" : "success"}
          onClose={() => {
            setNotice("");
            setError("");
          }}
        />
      )}

      <div>
        <h1 id="profile-heading" className="text-2xl font-bold text-gray-900">
          Мій профіль
        </h1>
      </div>

      <ProfileHeader
        firstName={user.firstName ?? ""}
        lastName={user.lastName ?? ""}
        email={user.primaryEmailAddress?.emailAddress ?? "Немає основної пошти"}
        group={form.group || "Групу не вказано"}
        role={roleLabel}
        avatarUrl={user.imageUrl}
        onAvatarChange={changeAvatar}
        onAvatarDelete={removeAvatar}
        disabled={busy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalDataCard
          firstName={form.firstName}
          lastName={form.lastName}
          onChange={(field, value) =>
            setForm((current) => ({ ...current, [field]: value }))
          }
          onSave={savePersonalData}
          saving={busy}
        />
        <SettingsCard
          language={form.language}
          theme={form.theme}
          onToggleLanguage={() =>
            updatePreference({
              language:
                form.language === "Українська" ? "English" : "Українська",
            })
          }
          onToggleTheme={() =>
            updatePreference({
              theme: form.theme === "Світла" ? "Темна" : "Світла",
            })
          }
          saving={busy}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityCard
          hasPassword={user.passwordEnabled}
          email={user.primaryEmailAddress?.emailAddress ?? ""}
        />
        <EducationalInfoCard
          group={form.group}
          role={roleLabel}
          moodleLogin={form.moodleLogin}
          moodlePassword={form.moodlePassword}
          onSave={saveEducation}
          saving={busy}
        />
      </div>
    </main>
  );
};

export default ProfilePage;
