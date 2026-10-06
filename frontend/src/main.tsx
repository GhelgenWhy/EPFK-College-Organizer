import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Application from "./AppRoot.tsx";
import { applyTheme, getInitialTheme } from "./features/theme/theme";

applyTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(<StrictMode><Application /></StrictMode>);
