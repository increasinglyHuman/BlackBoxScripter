/**
 * Dual-Mode Editor — Side-by-side LSL and TypeScript panels.
 *
 * Left panel: LSL source editor (editable)
 * Right panel: Transpiled TypeScript output (read-only)
 *
 * Live transpilation with 300ms debounce. Diagnostics appear as
 * markers in the LSL panel and are emitted via callback.
 */

import { EditorWrapper } from "./editor.js";
import { transpile } from "../transpiler/transpile.js";
import { setDiagnostics, clearDiagnostics } from "./diagnostics.js";
import type { Diagnostic } from "../transpiler/errors.js";
import type { TranspileResult } from "../transpiler/types.js";

export interface DualModeOptions {
  theme?: string;
  debounceMs?: number;
  onDiagnostics?: (diagnostics: Diagnostic[]) => void;
  onTranspile?: (result: TranspileResult) => void;
}

export class DualModeEditor {
  private lslEditor: EditorWrapper;
  private tsEditor: EditorWrapper;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private debounceMs: number;
  private onDiagnostics: ((diagnostics: Diagnostic[]) => void) | null;
  private onTranspile: ((result: TranspileResult) => void) | null;
  private container: HTMLElement;
  private className = "LSLScript";

  constructor(container: HTMLElement, options: DualModeOptions = {}) {
    this.container = container;
    this.debounceMs = options.debounceMs ?? 300;
    this.onDiagnostics = options.onDiagnostics ?? null;
    this.onTranspile = options.onTranspile ?? null;

    const theme = options.theme ?? "poqpoq-dark";

    // Build DOM layout
    container.innerHTML = "";
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr 1fr";
    container.style.gap = "0";
    container.style.height = "100%";

    // Left panel: LSL
    const leftPanel = document.createElement("div");
    leftPanel.className = "dual-panel dual-panel-left";
    leftPanel.style.display = "flex";
    leftPanel.style.flexDirection = "column";
    leftPanel.style.overflow = "hidden";
    leftPanel.style.borderRight = "1px solid var(--poqpoq-border, #3e3e3e)";

    const leftHeader = document.createElement("div");
    leftHeader.className = "panel-header";
    leftHeader.textContent = "LSL Source";
    leftHeader.style.cssText =
      "padding: 4px 12px; font-size: 12px; font-weight: 600; " +
      "color: var(--poqpoq-text-muted, #808080); " +
      "background: var(--poqpoq-background-secondary, #252526); " +
      "border-bottom: 1px solid var(--poqpoq-border, #3e3e3e); " +
      "user-select: none;";

    const leftEditorEl = document.createElement("div");
    leftEditorEl.style.flex = "1";
    leftEditorEl.style.overflow = "hidden";

    leftPanel.appendChild(leftHeader);
    leftPanel.appendChild(leftEditorEl);

    // Right panel: TypeScript
    const rightPanel = document.createElement("div");
    rightPanel.className = "dual-panel dual-panel-right";
    rightPanel.style.display = "flex";
    rightPanel.style.flexDirection = "column";
    rightPanel.style.overflow = "hidden";

    const rightHeader = document.createElement("div");
    rightHeader.className = "panel-header";
    rightHeader.textContent = "TypeScript Output";
    rightHeader.style.cssText =
      "padding: 4px 12px; font-size: 12px; font-weight: 600; " +
      "color: var(--poqpoq-text-muted, #808080); " +
      "background: var(--poqpoq-background-secondary, #252526); " +
      "border-bottom: 1px solid var(--poqpoq-border, #3e3e3e); " +
      "user-select: none;";

    const rightEditorEl = document.createElement("div");
    rightEditorEl.style.flex = "1";
    rightEditorEl.style.overflow = "hidden";

    rightPanel.appendChild(rightHeader);
    rightPanel.appendChild(rightEditorEl);

    container.appendChild(leftPanel);
    container.appendChild(rightPanel);

    // Create editors
    this.lslEditor = new EditorWrapper(leftEditorEl, {
      language: "lsl",
      theme,
    });

    this.tsEditor = new EditorWrapper(rightEditorEl, {
      language: "typescript",
      theme,
      readOnly: true,
    });

    // Wire live transpilation
    this.lslEditor.onDidChangeContent(() => {
      this.scheduleTranspile();
    });
  }

  /** Set LSL source (e.g., when loading a script) */
  setSource(lsl: string): void {
    this.lslEditor.setValue(lsl);
    this.transpileNow();
  }

  /** Get current LSL source */
  getSource(): string {
    return this.lslEditor.getValue();
  }

  /** Set the class name for transpiled output */
  setClassName(name: string): void {
    this.className = name;
    this.transpileNow();
  }

  /** Force an immediate transpile */
  transpileNow(): TranspileResult {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    return this.doTranspile();
  }

  /** Get the LSL editor wrapper (for external keyboard bindings, etc.) */
  getLSLEditor(): EditorWrapper {
    return this.lslEditor;
  }

  /** Get the TypeScript editor wrapper */
  getTSEditor(): EditorWrapper {
    return this.tsEditor;
  }

  /** Re-layout both editors (call on resize) */
  layout(): void {
    this.lslEditor.layout();
    this.tsEditor.layout();
  }

  /** Clean up */
  dispose(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.lslEditor.dispose();
    this.tsEditor.dispose();
  }

  private scheduleTranspile(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.doTranspile();
    }, this.debounceMs);
  }

  private doTranspile(): TranspileResult {
    const source = this.lslEditor.getValue();
    const model = this.lslEditor.getModel();

    // Empty source — clear everything
    if (!source.trim()) {
      this.tsEditor.setValue("");
      if (model) clearDiagnostics(model);
      const emptyResult: TranspileResult = {
        code: "",
        success: true,
        diagnostics: [],
        className: this.className,
      };
      this.onDiagnostics?.([]);
      this.onTranspile?.(emptyResult);
      return emptyResult;
    }

    const result = transpile(source, { className: this.className });

    // Update TypeScript output
    this.tsEditor.setValue(result.code);

    // Update diagnostics markers on the LSL editor
    if (model) {
      setDiagnostics(model, result.diagnostics);
    }

    // Notify listeners
    this.onDiagnostics?.(result.diagnostics);
    this.onTranspile?.(result);

    return result;
  }
}
