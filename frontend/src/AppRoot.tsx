import { ClerkProvider } from "@clerk/react";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomeRoute, NotFoundRoute, RootLayout } from "./App";
import { AuthPage, RequireRole } from "./features/auth/Auth";
import { AssignmentsPage } from "./features/tasks/components/AssignmentsPage";
import { CalendarPage } from "./pages/CalendarPage";
import { EventPage } from "./pages/EventPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SchedulePage } from "./pages/SchedulePage";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function Application() {
  if (!publishableKey) {
    return (
      <main className="auth-config-notice">
        <h1>Налаштуйте Clerk</h1>
        <p>
          Додайте VITE_CLERK_PUBLISHABLE_KEY до frontend/.env.local, щоб
          увімкнути вхід.
        </p>
      </main>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <BrowserRouter>
        <Routes>
          <Route path="sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="sign-up" element={<AuthPage mode="sign-up" />} />
          <Route
            element={
              <RequireRole roles={["admin"]}>
                <RootLayout />
              </RequireRole>
            }
          >
            <Route index element={<HomeRoute />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="events" element={<EventPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}
