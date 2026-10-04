import { useState } from "react";
import { ProfileHeader } from "../features/profile/components/ProfileHeader.tsx";
import { PersonalDataCard } from "../features/profile/components/PersonalDataCard";
import { EducationalInfoCard } from "../features/profile/components/EducationalInfoCard";
import { SecurityCard } from "../features/profile/components/SecurityCard";
import { SettingsCard } from "../features/profile/components/SettingsCard";
import { MOCK_USER_PROFILE } from "../features/profile/mockData";
import type { UserProfile } from "../features/profile/types";

export const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER_PROFILE);

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = () => {
    const newUrl = prompt("Введіть URL нового зображення аватара:");
    if (newUrl) {
      setProfile((prev) => ({ ...prev, avatarUrl: newUrl }));
    }
  };

  const handleAvatarDelete = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: undefined }));
  };

  const handleChangePassword = () => {
    alert(
      "Запит на зміну пароля через сервіс Clerk надіслано на пошту: " +
      profile.email,
    );
    setProfile((prev) => ({ ...prev, passwordLastUpdated: "щойно" }));
  };

  const handleToggleLanguage = () => {
    setProfile((prev) => ({
      ...prev,
      language: prev.language === "Українська" ? "English" : "Українська",
    }));
  };

  const handleToggleTheme = () => {
    setProfile((prev) => ({
      ...prev,
      theme: prev.theme === "Світла" ? "Темна" : "Світла",
    }));
  };

  return (
    <div className="flex flex-col w-full min-h-full p-[30px] gap-6 max-[760px]:p-4 bg-gray-50/50">
      <h1 className="text-2xl font-bold text-gray-900">Мій профіль</h1>

      <ProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName}
        email={profile.email}
        group={profile.group}
        role={profile.role}
        avatarUrl={profile.avatarUrl}
        onAvatarChange={handleAvatarChange}
        onAvatarDelete={handleAvatarDelete}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalDataCard
          firstName={profile.firstName}
          lastName={profile.lastName}
          email={profile.email}
          onChange={handleFieldChange}
        />
        <EducationalInfoCard
          group={profile.group}
          role={profile.role}
          syncLink={profile.syncLink}
          onChange={handleFieldChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityCard
          passwordLastUpdated={profile.passwordLastUpdated}
          onChangePassword={handleChangePassword}
        />
        <SettingsCard
          language={profile.language}
          theme={profile.theme}
          onToggleLanguage={handleToggleLanguage}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
