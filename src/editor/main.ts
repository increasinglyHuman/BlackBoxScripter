/**
 * poqpoq Script Editor — Entry Point
 *
 * Bootstraps the BlackBox splash screen, then initializes Monaco editor
 * with LSL language support, type definitions, and the full UI shell.
 */

import "./ui/styles.css";
import { scripterMatrix } from "./scripter-matrix.js";

// ── Splash screen logic ──────────────────────────────────

const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeStartBtn = document.getElementById("welcomeStartBtn");
const appContainer = document.getElementById("app");

if (!appContainer) throw new Error("Missing #app container");

const isEmbedded = window.self !== window.top;

if (isEmbedded) {
  // Skip splash when embedded in an iframe
  welcomeScreen?.remove();
  initEditor();
} else {
  // Start matrix rain
  scripterMatrix.init();
  scripterMatrix.start();

  welcomeStartBtn?.addEventListener("click", () => {
    // Show app container (invisible) and start loading editor immediately
    appContainer.style.display = "";
    appContainer.style.opacity = "0";
    initEditor();

    // +300ms: Fade out splash
    setTimeout(() => {
      if (welcomeScreen) {
        welcomeScreen.style.transition = "opacity 1s ease-out";
        welcomeScreen.style.opacity = "0";
      }
    }, 300);

    // +800ms: Fade in main app
    setTimeout(() => {
      appContainer.style.transition = "opacity 0.8s ease-in";
      appContainer.style.opacity = "1";
    }, 800);

    // +2000ms: Remove splash, stop matrix
    setTimeout(() => {
      if (welcomeScreen) {
        welcomeScreen.style.display = "none";
      }
      scripterMatrix.stop();
    }, 2000);
  });
}

// ── Editor initialization ────────────────────────────────

let editorInitialized = false;

function initEditor(): void {
  if (editorInitialized) return;
  editorInitialized = true;

  // Show app if hidden (iframe case)
  appContainer!.style.display = "";
  appContainer!.style.opacity = "1";

  // Dynamic imports — don't load Monaco during splash
  Promise.all([
    import("./lsl-language.js"),
    import("./type-loader.js"),
    import("./ui/theme.js"),
    import("./completion-provider.js"),
    import("./hover-provider.js"),
    import("./script-manager.js"),
    import("./ui/shell.js"),
  ]).then(([
    { registerLSLLanguage },
    { loadPoqpoqTypes },
    { registerMonacoThemes },
    { registerLSLCompletionProvider },
    { registerLSLHoverProvider },
    { EditorScriptManager },
    { Shell },
  ]) => {
    // Register Monaco languages and themes
    registerMonacoThemes();
    registerLSLLanguage();
    loadPoqpoqTypes();

    // Register LSL IntelliSense providers
    registerLSLCompletionProvider();
    registerLSLHoverProvider();

    // Initialize script manager and UI shell
    const scripts = new EditorScriptManager();
    const shell = new Shell(appContainer!, scripts);

    // Keyboard shortcuts
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

    // Resize handling
    window.addEventListener("resize", () => shell.layout());

    // Persist on unload
    window.addEventListener("beforeunload", () => {
      shell.saveCurrentScript();
    });
  });
}
