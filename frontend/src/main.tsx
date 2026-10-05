import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Application from "./AppRoot.tsx";

createRoot(document.getElementById("root")!).render(<StrictMode><Application /></StrictMode>);
