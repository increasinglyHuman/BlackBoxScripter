/**
 * Monaco Editor Wrapper — Initializes and configures Monaco editor instances.
 *
 * Handles worker setup, theme, and provides a clean API for creating
 * editor instances in either TypeScript or LSL mode.
 */

import * as monaco from "monaco-editor";

// Monaco web worker setup for Vite
self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === "typescript" || label === "javascript") {
      return new Worker(
        new URL(
          "monaco-editor/esm/vs/language/typescript/ts.worker.js",
          import.meta.url
        ),
        { type: "module" }
      );
    }
    if (label === "json") {
      return new Worker(
        new URL(
          "monaco-editor/esm/vs/language/json/json.worker.js",
          import.meta.url
        ),
        { type: "module" }
      );
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new Worker(
        new URL(
          "monaco-editor/esm/vs/language/css/css.worker.js",
          import.meta.url
        ),
        { type: "module" }
      );
    }
    return new Worker(
      new URL(
        "monaco-editor/esm/vs/editor/editor.worker.js",
        import.meta.url
      ),
      { type: "module" }
    );
  },
};

export interface EditorOptions {
  language: "typescript" | "lsl";
  readOnly?: boolean;
  theme?: string;
  value?: string;
}

export class EditorWrapper {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private container: HTMLElement;

  constructor(container: HTMLElement, options: EditorOptions) {
    this.container = container;

    this.editor = monaco.editor.create(container, {
      value: options.value ?? "",
      language: options.language,
      theme: options.theme ?? "poqpoq-dark",
      readOnly: options.readOnly ?? false,
      automaticLayout: false,
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      lineNumbers: "on",
      renderLineHighlight: "line",
      scrollBeyondLastLine: false,
      wordWrap: "off",
      tabSize: 4,
      insertSpaces: true,
      bracketPairColorization: { enabled: true },
      padding: { top: 8 },
    });
  }

  getValue(): string {
    return this.editor.getValue();
  }

  setValue(text: string): void {
    this.editor.setValue(text);
  }

  getModel(): monaco.editor.ITextModel | null {
    return this.editor.getModel();
  }

  getEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.editor;
  }

  onDidChangeContent(callback: () => void): monaco.IDisposable {
    return this.editor.onDidChangeModelContent(callback);
  }

  setLanguage(language: string): void {
    const model = this.editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }

  setTheme(theme: string): void {
    monaco.editor.setTheme(theme);
  }

  layout(): void {
    this.editor.layout();
  }

  focus(): void {
    this.editor.focus();
  }

  dispose(): void {
    this.editor.dispose();
  }
}

export { monaco };
