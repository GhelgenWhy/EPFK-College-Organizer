export type ProfileForm = {
  firstName: string;
  lastName: string;
  group: string;
  moodleLogin: string;
  moodlePassword: string;
  language: "Українська" | "English";
  theme: "Світла" | "Темна";
};

export interface EducationalInfoCardProps {
  group: string;
  role: string;
  moodleLogin: string;
  moodlePassword: string;
  onChange: (
    field: "group" | "moodleLogin" | "moodlePassword",
    value: string,
  ) => void;
  onSave: () => void;
  saving: boolean;
}
