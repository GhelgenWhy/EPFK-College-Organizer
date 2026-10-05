import { useState } from "react";
import { useUser } from "@clerk/react";
import { ProfileHeader } from "../features/profile/components/ProfileHeader.tsx";
import { PersonalDataCard } from "../features/profile/components/PersonalDataCard";
import { EducationalInfoCard } from "../features/profile/components/EducationalInfoCard";
import { SecurityCard } from "../features/profile/components/SecurityCard";
import { SettingsCard } from "../features/profile/components/SettingsCard";
import { resolveAppRole } from "../features/auth/roles";

type ProfileForm = {
  firstName: string;
  lastName: string;
  group: string;
  syncLink: string;
  language: "Українська" | "English";
  theme: "Світла" | "Темна";
};

const readMetadataString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Не вдалося зберегти зміни. Спробуйте ще раз.";

export const ProfilePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <div className="auth-loading" role="status">Завантаження профілю…</div>;
  }
  if (!isSignedIn || !user) return null;
  return <LoadedProfilePage key={user.id} user={user} />;
};

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

const LoadedProfilePage = ({ user }: { user: ClerkUser }) => {
  const [form, setForm] = useState<ProfileForm>(() => ({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    group: readMetadataString(user.unsafeMetadata.group),
    syncLink: readMetadataString(user.unsafeMetadata.syncLink),
    language: user.unsafeMetadata.language === "English" ? "English" : "Українська",
    theme: user.unsafeMetadata.theme === "Темна" ? "Темна" : "Світла",
  }));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const role = resolveAppRole(user.publicMetadata.role);
  const roleLabel = { user: "Користувач", admin: "Адміністратор", supervisor: "Куратор" }[role];

  const save = async (action: () => Promise<unknown>, successMessage: string) => {
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
      () => user.update({ firstName: form.firstName.trim(), lastName: form.lastName.trim() }),
      "Особисті дані збережено в Clerk.",
    );

  const saveEducation = () =>
    save(
      () => user.updateMetadata({
        unsafeMetadata: { group: form.group.trim(), syncLink: form.syncLink.trim() },
      }),
      "Навчальну інформацію збережено.",
    );

  const changeAvatar = (file: File) =>
    save(() => user.setProfileImage({ file }), "Фото профілю оновлено.");

  const removeAvatar = () =>
    save(() => user.setProfileImage({ file: null }), "Фото профілю видалено.");

  const updatePreference = (next: Partial<Pick<ProfileForm, "language" | "theme">>) => {
    const updated = { ...form, ...next };
    setForm(updated);
    void save(
      () => user.updateMetadata({ unsafeMetadata: next }),
      "Налаштування збережено в обліковому записі.",
    );
  };

  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto px-[30px] py-[30px] [scrollbar-color:#c4d8d4_transparent] [scrollbar-width:thin] max-[760px]:px-4 max-[760px]:py-4 bg-gray-50/50"
      aria-labelledby="profile-heading"
      tabIndex={0}
    >
      <div>
        <h1 id="profile-heading" className="text-2xl font-bold text-gray-900">Мій профіль</h1>
        <p className="mt-1 text-sm text-gray-500">Дані облікового запису з Clerk</p>
      </div>

      {(notice || error) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}
          role={error ? "alert" : "status"}
        >
          {error || notice}
        </div>
      )}

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
          email={user.primaryEmailAddress?.emailAddress ?? ""}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onSave={savePersonalData}
          saving={busy}
        />
        <EducationalInfoCard
          group={form.group}
          role={roleLabel}
          syncLink={form.syncLink}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onSave={saveEducation}
          saving={busy}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityCard hasPassword={user.passwordEnabled} />
        <SettingsCard
          language={form.language}
          theme={form.theme}
          onToggleLanguage={() => updatePreference({ language: form.language === "Українська" ? "English" : "Українська" })}
          onToggleTheme={() => updatePreference({ theme: form.theme === "Світла" ? "Темна" : "Світла" })}
          saving={busy}
        />
      </div>
    </main>
  );
};

export default ProfilePage;
