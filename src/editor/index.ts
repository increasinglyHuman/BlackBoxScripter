/**
 * Editor module — barrel exports.
 *
 * Re-exports the key classes and functions for programmatic use.
 * The main entry point for the standalone demo is main.ts (loaded by index.html).
 */

export { EditorWrapper } from "./editor.js";
export type { EditorOptions } from "./editor.js";

export { DualModeEditor } from "./dual-mode.js";
export type { DualModeOptions } from "./dual-mode.js";

export { EditorScriptManager } from "./script-manager.js";
export type { ScriptDocument, ScriptEventType, ScriptEventCallback } from "./script-manager.js";

export { Shell } from "./ui/shell.js";

export { registerLSLLanguage } from "./lsl-language.js";
export { loadPoqpoqTypes } from "./type-loader.js";
export { registerLSLCompletionProvider } from "./completion-provider.js";
export { registerLSLHoverProvider } from "./hover-provider.js";
export { setDiagnostics, clearDiagnostics, diagnosticsToMarkers } from "./diagnostics.js";
export { registerMonacoThemes, applyTheme, DARK_THEME, LIGHT_THEME } from "./ui/theme.js";
export type { EditorTheme } from "./ui/theme.js";
