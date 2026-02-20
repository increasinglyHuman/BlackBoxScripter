/**
 * Toolbar — Top action bar with transpile, mode toggle, theme, and import/export.
 */

import { UIComponent } from "./component.js";

export interface ToolbarCallbacks {
  onTranspile: () => void;
  onThemeToggle: () => void;
  onImport: () => void;
  onExport: () => void;
}

export class Toolbar extends UIComponent {
  constructor(parent: HTMLElement, private callbacks: ToolbarCallbacks) {
    super(parent);
    this.mount();
  }

  render(): HTMLElement {
    const toolbar = this.h("div", {
      className: "toolbar",
      style:
        "display: flex; align-items: center; height: 38px; padding: 0 12px; gap: 8px; " +
        "background: var(--poqpoq-background-secondary, #252526); " +
        "border-bottom: 1px solid var(--poqpoq-border, #3e3e3e); " +
        "user-select: none;",
    });

    // Logo / title — Montserrat Black to match sister apps (Skinner, Animator)
    const logo = this.h("div", {
      style:
        "display: flex; align-items: center; gap: 8px; margin-right: auto; " +
        "color: var(--poqpoq-text, #ccc);",
    });

    const brandName = this.h("span", {
      style:
        "font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 15px; " +
        "letter-spacing: -0.3px;",
    }, "pOqpOq");

    const subtitle = this.h("span", {
      style:
        "font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 400; " +
        "color: var(--poqpoq-text-muted, #808080);",
    }, "Script Editor");

    logo.appendChild(brandName);
    logo.appendChild(subtitle);

    // Transpile button
    const transpileBtn = this.makeButton("\u25B6 Transpile", "Transpile LSL to TypeScript (Ctrl+S)", () =>
      this.callbacks.onTranspile()
    );
    transpileBtn.style.background = "var(--poqpoq-accent, #007acc)";
    transpileBtn.style.color = "#fff";

    // Import button
    const importBtn = this.makeButton("\u21E7 Import", "Import an LSL or TypeScript file", () =>
      this.callbacks.onImport()
    );

    // Export button
    const exportBtn = this.makeButton("\u21E9 Export", "Export transpiled TypeScript", () =>
      this.callbacks.onExport()
    );

    // Theme toggle
    const themeBtn = this.makeButton("\u263E", "Toggle dark/light theme", () =>
      this.callbacks.onThemeToggle()
    );

    toolbar.appendChild(logo);
    toolbar.appendChild(transpileBtn);
    toolbar.appendChild(importBtn);
    toolbar.appendChild(exportBtn);
    toolbar.appendChild(themeBtn);

    return toolbar;
  }

  private makeButton(label: string, title: string, onClick: () => void): HTMLElement {
    const btn = this.h("button", {
      style:
        "background: var(--poqpoq-surface, #2d2d2d); " +
        "border: 1px solid var(--poqpoq-border, #3e3e3e); " +
        "color: var(--poqpoq-text, #ccc); " +
        "padding: 4px 10px; border-radius: 3px; cursor: pointer; " +
        "font-size: 12px; white-space: nowrap;",
    }, label);
    btn.title = title;
    btn.addEventListener("click", onClick);
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "var(--poqpoq-surface-hover, #3e3e3e)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "var(--poqpoq-surface, #2d2d2d)";
    });
    return btn;
  }
}
