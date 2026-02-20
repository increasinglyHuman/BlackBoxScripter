/**
 * poqpoq Script Editor — Entry Point
 *
 * Bootstraps Monaco editor with LSL language support,
 * type definitions for IntelliSense, and the full UI shell.
 */

import "./ui/styles.css";
import { registerLSLLanguage } from "./lsl-language.js";
import { loadPoqpoqTypes } from "./type-loader.js";
import { registerMonacoThemes } from "./ui/theme.js";
import { registerLSLCompletionProvider } from "./completion-provider.js";
import { registerLSLHoverProvider } from "./hover-provider.js";
import { EditorScriptManager } from "./script-manager.js";
import { Shell } from "./ui/shell.js";

// --- Register Monaco languages and themes ---
registerMonacoThemes();
registerLSLLanguage();
loadPoqpoqTypes();

// --- Register LSL IntelliSense providers ---
registerLSLCompletionProvider();
registerLSLHoverProvider();

// --- Initialize script manager and UI shell ---
const app = document.getElementById("app");
if (!app) throw new Error("Missing #app container");

const scripts = new EditorScriptManager();
const shell = new Shell(app, scripts);

// --- Keyboard shortcuts ---
document.addEventListener("keydown", (e) => {
  // Ctrl+S / Cmd+S — force transpile + save
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    shell.transpileAndSave();
  }

  // Ctrl+N / Cmd+N — new script
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    const name = prompt("Script name:", "NewScript.lsl");
    if (!name) return;
    const language = name.endsWith(".ts") ? "typescript" as const : "lsl" as const;
    const script = scripts.create(name, language);
    shell.activateScript(script.id);
  }
});

// --- Resize handling ---
window.addEventListener("resize", () => shell.layout());

// --- Persist on unload ---
window.addEventListener("beforeunload", () => {
  shell.saveCurrentScript();
});
