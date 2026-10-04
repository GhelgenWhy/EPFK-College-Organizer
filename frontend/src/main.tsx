import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomeRoute, NotFoundRoute, RootLayout } from "./App.tsx";
import { AssignmentsPage } from "./features/tasks/components/AssignmentsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { CalendarPage } from "./pages/CalendarPage";
import { EventPage } from "./pages/EventPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="events" element={<EventPage />} />
        </Route>
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
