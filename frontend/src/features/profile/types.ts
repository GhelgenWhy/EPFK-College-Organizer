export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  group: string;
  role: string;
  syncLink: string;
  avatarUrl?: string;
  passwordLastUpdated: string;
  language: "Українська" | "English";
  theme: "Світла" | "Темна";
}
