import "./index.css";
// Loaded after index.css so Clerk overrides are not folded into the Tailwind layer.
import "./auth.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Application from "./AppRoot.tsx";
import { applyTheme, getInitialTheme } from "./features/theme/theme";

applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(<StrictMode><Application /></StrictMode>);
