/**
 * Error Panel — Collapsible bottom panel showing transpiler diagnostics.
 *
 * Shows summary counts (errors, warnings) in a header bar.
 * Expands to show individual diagnostics with click-to-navigate.
 */

import { UIComponent } from "./component.js";
import type { Diagnostic } from "../../transpiler/errors.js";

export class ErrorPanel extends UIComponent {
  private headerEl!: HTMLElement;
  private listEl!: HTMLElement;
  private expanded = false;
  private diagnostics: Diagnostic[] = [];
  private onNavigate: ((line: number, column: number) => void) | null = null;

  constructor(
    parent: HTMLElement,
    onNavigate?: (line: number, column: number) => void
  ) {
    super(parent);
    this.onNavigate = onNavigate ?? null;
    this.mount();
  }

  render(): HTMLElement {
    const panel = this.h("div", {
      className: "error-panel",
      style:
        "background: var(--poqpoq-background-secondary, #252526); " +
        "border-top: 1px solid var(--poqpoq-border, #3e3e3e);",
    });

    // Summary header
    this.headerEl = this.h("div", {
      style:
        "display: flex; align-items: center; gap: 12px; padding: 4px 12px; " +
        "cursor: pointer; font-size: 12px; " +
        "color: var(--poqpoq-text-muted, #808080); user-select: none;",
    });
    this.headerEl.addEventListener("click", () => this.toggle());

    // Expandable list
    this.listEl = this.h("div", {
      style: "display: none; max-height: 150px; overflow-y: auto;",
    });

    panel.appendChild(this.headerEl);
    panel.appendChild(this.listEl);

    this.updateHeader();

    return panel;
  }

  /** Update diagnostics from a transpile result */
  setDiagnostics(diagnostics: Diagnostic[]): void {
    this.diagnostics = diagnostics;
    this.updateHeader();
    this.updateList();
  }

  private toggle(): void {
    this.expanded = !this.expanded;
    this.listEl.style.display = this.expanded ? "block" : "none";
  }

  private updateHeader(): void {
    const errors = this.diagnostics.filter((d) => d.severity === "error").length;
    const warnings = this.diagnostics.filter((d) => d.severity === "warning").length;

    this.headerEl.innerHTML = "";

    const arrow = this.h("span", {
      style: "font-size: 10px; transition: transform 0.15s;",
    }, this.expanded ? "\u25BC" : "\u25B6");

    const label = this.h("span", {}, "Problems");

    const counts: HTMLElement[] = [];

    if (errors > 0) {
      counts.push(
        this.h("span", {
          style: "color: var(--poqpoq-error, #f44747);",
        }, `${errors} error${errors > 1 ? "s" : ""}`)
      );
    }

    if (warnings > 0) {
      counts.push(
        this.h("span", {
          style: "color: var(--poqpoq-warning, #cca700);",
        }, `${warnings} warning${warnings > 1 ? "s" : ""}`)
      );
    }

    if (errors === 0 && warnings === 0) {
      counts.push(
        this.h("span", {
          style: "color: var(--poqpoq-success, #4ec9b0);",
        }, "No problems")
      );
    }

    this.headerEl.appendChild(arrow);
    this.headerEl.appendChild(label);
    for (const c of counts) {
      this.headerEl.appendChild(c);
    }

    // Copy all errors button (only when there are diagnostics)
    if (this.diagnostics.length > 0) {
      const spacer = this.h("span", { style: "flex: 1;" });
      const copyAllBtn = this.h("button", {
        style:
          "background: none; border: none; color: var(--poqpoq-text-muted, #808080); " +
          "cursor: pointer; font-size: 11px; padding: 2px 6px; " +
          "border-radius: 3px; font-family: 'Space Mono', monospace;",
      }, "Copy All");
      copyAllBtn.title = "Copy all diagnostics to clipboard";
      copyAllBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.copyAllDiagnostics();
      });
      copyAllBtn.addEventListener("mouseenter", () => {
        copyAllBtn.style.color = "var(--poqpoq-text, #ccc)";
        copyAllBtn.style.background = "var(--poqpoq-surface, #2d2d2d)";
      });
      copyAllBtn.addEventListener("mouseleave", () => {
        copyAllBtn.style.color = "var(--poqpoq-text-muted, #808080)";
        copyAllBtn.style.background = "none";
      });
      this.headerEl.appendChild(spacer);
      this.headerEl.appendChild(copyAllBtn);
    }
  }

  private copyAllDiagnostics(): void {
    const text = this.diagnostics
      .map((d) => {
        const loc = d.loc ? `[${d.loc.line}:${d.loc.column}]` : "";
        return `${d.severity.toUpperCase()} ${loc} ${d.message}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
  }

  private updateList(): void {
    this.listEl.innerHTML = "";

    for (const diag of this.diagnostics) {
      const item = this.h("div", {
        style:
          "display: flex; align-items: center; gap: 8px; padding: 3px 12px 3px 28px; " +
          "font-size: 12px; cursor: pointer; " +
          "color: var(--poqpoq-text, #ccc);",
      });

      item.addEventListener("mouseenter", () => {
        item.style.background = "var(--poqpoq-surface, #2d2d2d)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "transparent";
      });

      // Severity icon
      const iconColor =
        diag.severity === "error"
          ? "var(--poqpoq-error, #f44747)"
          : diag.severity === "warning"
          ? "var(--poqpoq-warning, #cca700)"
          : "var(--poqpoq-accent, #007acc)";

      const icon = this.h("span", {
        style: `color: ${iconColor}; font-size: 14px;`,
      }, diag.severity === "error" ? "\u2716" : diag.severity === "warning" ? "\u26A0" : "\u2139");

      // Location
      const line = diag.loc?.line ?? 1;
      const col = diag.loc?.column ?? 1;
      const loc = this.h("span", {
        style: "color: var(--poqpoq-text-muted, #808080); min-width: 40px;",
      }, `${line}:${col}`);

      // Message
      const msg = this.h("span", {
        style: "flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
      }, diag.message);

      // Copy single diagnostic button
      const copyBtn = this.h("button", {
        style:
          "background: none; border: none; color: var(--poqpoq-text-muted, #808080); " +
          "cursor: pointer; font-size: 11px; padding: 1px 4px; opacity: 0; " +
          "transition: opacity 0.15s; font-family: 'Space Mono', monospace;",
      }, "Copy");
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const text = `[${line}:${col}] ${diag.message}`;
        navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 1200);
      });

      item.appendChild(icon);
      item.appendChild(loc);
      item.appendChild(msg);
      item.appendChild(copyBtn);

      item.addEventListener("mouseenter", () => {
        copyBtn.style.opacity = "1";
      });
      item.addEventListener("mouseleave", () => {
        copyBtn.style.opacity = "0";
      });

      item.addEventListener("click", () => {
        this.onNavigate?.(line, col);
      });

      this.listEl.appendChild(item);
    }
  }
}
