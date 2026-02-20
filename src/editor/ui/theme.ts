/**
 * Editor Theme — Dark/Light theme definitions with CSS custom properties.
 *
 * Monaco uses its own `vs-dark` / `vs` themes. The shell UI (sidebar, tabs,
 * toolbar, error panel) is styled via CSS custom properties set here.
 */

import * as monaco from "monaco-editor";

export interface EditorTheme {
  name: string;
  monacoTheme: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    tabActive: string;
    tabInactive: string;
    sidebarBackground: string;
  };
}

export const DARK_THEME: EditorTheme = {
  name: "dark",
  monacoTheme: "poqpoq-dark",
  colors: {
    background: "#1e1e1e",
    backgroundSecondary: "#252526",
    surface: "#2d2d2d",
    surfaceHover: "#3e3e3e",
    text: "#cccccc",
    textMuted: "#808080",
    accent: "#007acc",
    accentHover: "#1a8fd4",
    border: "#3e3e3e",
    error: "#f44747",
    warning: "#cca700",
    success: "#4ec9b0",
    tabActive: "#1e1e1e",
    tabInactive: "#2d2d2d",
    sidebarBackground: "#252526",
  },
};

export const LIGHT_THEME: EditorTheme = {
  name: "light",
  monacoTheme: "poqpoq-light",
  colors: {
    background: "#ffffff",
    backgroundSecondary: "#f3f3f3",
    surface: "#e8e8e8",
    surfaceHover: "#d4d4d4",
    text: "#333333",
    textMuted: "#888888",
    accent: "#007acc",
    accentHover: "#005a9e",
    border: "#d4d4d4",
    error: "#e51400",
    warning: "#bf8803",
    success: "#16825d",
    tabActive: "#ffffff",
    tabInactive: "#ececec",
    sidebarBackground: "#f3f3f3",
  },
};

/** Apply a theme's CSS custom properties to the root element */
export function applyTheme(theme: EditorTheme): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--poqpoq-${camelToKebab(key)}`, value);
  }
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/** Register custom Monaco themes for LSL syntax highlighting */
export function registerMonacoThemes(): void {
  monaco.editor.defineTheme("poqpoq-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword.event", foreground: "c586c0" },      // purple — events
      { token: "function.builtin", foreground: "dcdcaa" },    // yellow — ll*/os* functions
      { token: "constant", foreground: "4fc1ff" },            // light blue — constants
      { token: "type", foreground: "4ec9b0" },                // teal — type keywords
      { token: "comment", foreground: "6a9955", fontStyle: "italic" },
      { token: "string", foreground: "ce9178" },
      { token: "number", foreground: "b5cea8" },
      { token: "operator", foreground: "d4d4d4" },
      { token: "identifier", foreground: "9cdcfe" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editor.lineHighlightBackground": "#2a2d2e",
      "editorCursor.foreground": "#aeafad",
      "editor.selectionBackground": "#264f78",
    },
  });

  monaco.editor.defineTheme("poqpoq-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "keyword.event", foreground: "af00db" },
      { token: "function.builtin", foreground: "795e26" },
      { token: "constant", foreground: "0070c1" },
      { token: "type", foreground: "267f99" },
      { token: "comment", foreground: "008000", fontStyle: "italic" },
      { token: "string", foreground: "a31515" },
      { token: "number", foreground: "098658" },
      { token: "operator", foreground: "000000" },
      { token: "identifier", foreground: "001080" },
    ],
    colors: {},
  });
}
