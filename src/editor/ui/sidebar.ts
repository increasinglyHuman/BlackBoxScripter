/**
 * Sidebar — Script list panel with create/rename/delete actions.
 */

import { UIComponent } from "./component.js";
import type { EditorScriptManager, ScriptDocument } from "../script-manager.js";

export class Sidebar extends UIComponent {
  private listEl!: HTMLElement;

  constructor(
    parent: HTMLElement,
    private scripts: EditorScriptManager,
    private onSelect: (id: string) => void
  ) {
    super(parent);
    this.mount();

    // Re-render list when scripts change (after mount so listEl exists)
    this.scripts.onChange(() => this.updateList());
  }

  render(): HTMLElement {
    const sidebar = this.h(
      "div",
      {
        className: "sidebar",
        style:
          "width: 220px; height: 100%; display: flex; flex-direction: column; " +
          "background: var(--poqpoq-sidebar-background, #252526); " +
          "border-right: 1px solid var(--poqpoq-border, #3e3e3e); " +
          "user-select: none;",
      }
    );

    // Header
    const header = this.h(
      "div",
      {
        style:
          "padding: 8px 12px; font-size: 11px; font-weight: 700; " +
          "text-transform: uppercase; letter-spacing: 0.5px; " +
          "color: var(--poqpoq-text-muted, #808080); " +
          "display: flex; align-items: center; justify-content: space-between;",
      },
      "Scripts"
    );

    // New script button
    const newBtn = this.h("button", {
      style:
        "background: none; border: none; color: var(--poqpoq-text, #ccc); " +
        "cursor: pointer; font-size: 16px; padding: 0 4px; line-height: 1;",
    }, "+");
    newBtn.title = "New Script";
    newBtn.addEventListener("click", () => this.showNewScriptMenu());
    header.appendChild(newBtn);

    // Script list
    this.listEl = this.h("div", {
      style: "flex: 1; overflow-y: auto; padding: 4px 0;",
    });

    sidebar.appendChild(header);
    sidebar.appendChild(this.listEl);

    // Initial list render
    this.updateList();

    return sidebar;
  }

  private updateList(): void {
    this.listEl.innerHTML = "";
    const scripts = this.scripts.list();
    const activeId = this.scripts.getActiveId();

    for (const script of scripts) {
      const item = this.createScriptItem(script, script.id === activeId);
      this.listEl.appendChild(item);
    }
  }

  private createScriptItem(script: ScriptDocument, isActive: boolean): HTMLElement {
    const item = this.h("div", {
      style:
        `padding: 4px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; ` +
        `font-size: 13px; ` +
        `background: ${isActive ? "var(--poqpoq-surface, #2d2d2d)" : "transparent"}; ` +
        `color: ${isActive ? "var(--poqpoq-text, #ccc)" : "var(--poqpoq-text-muted, #808080)"};`,
    });

    // Language icon
    const icon = this.h("span", {
      style: `font-size: 11px; font-weight: 700; min-width: 20px; ` +
        `color: ${script.language === "lsl" ? "#8b5cf6" : "#3178c6"};`,
    }, script.language === "lsl" ? "LSL" : "TS");

    // Name
    const name = this.h("span", {
      style: "flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
    }, script.name);

    // Dirty indicator
    if (script.isDirty) {
      const dot = this.h("span", {
        style: "width: 6px; height: 6px; border-radius: 50%; background: var(--poqpoq-text-muted, #808080);",
      });
      item.appendChild(dot);
    }

    // Delete button (on hover)
    const deleteBtn = this.h("button", {
      style:
        "background: none; border: none; color: var(--poqpoq-text-muted, #808080); " +
        "cursor: pointer; font-size: 12px; padding: 0 2px; opacity: 0; transition: opacity 0.15s;",
    }, "\u00d7");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.scripts.count > 1) {
        this.scripts.delete(script.id);
      }
    });

    item.addEventListener("mouseenter", () => {
      deleteBtn.style.opacity = "1";
      if (!isActive) item.style.background = "var(--poqpoq-surface-hover, #3e3e3e)";
    });
    item.addEventListener("mouseleave", () => {
      deleteBtn.style.opacity = "0";
      if (!isActive) item.style.background = "transparent";
    });

    item.addEventListener("click", () => {
      this.scripts.setActive(script.id);
      this.onSelect(script.id);
      this.updateList();
    });

    // Double-click to rename
    item.addEventListener("dblclick", () => {
      this.startRename(item, script);
    });

    item.appendChild(icon);
    item.appendChild(name);
    item.appendChild(deleteBtn);

    return item;
  }

  private startRename(item: HTMLElement, script: ScriptDocument): void {
    const input = document.createElement("input");
    input.type = "text";
    input.value = script.name;
    input.style.cssText =
      "background: var(--poqpoq-surface, #2d2d2d); border: 1px solid var(--poqpoq-accent, #007acc); " +
      "color: var(--poqpoq-text, #ccc); font-size: 13px; padding: 1px 4px; width: 100%; outline: none;";

    item.innerHTML = "";
    item.appendChild(input);
    input.focus();
    input.select();

    const commit = () => {
      const newName = input.value.trim();
      if (newName && newName !== script.name) {
        this.scripts.rename(script.id, newName);
      }
      this.updateList();
    };

    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") this.updateList();
    });
  }

  private showNewScriptMenu(): void {
    const name = prompt("Script name:", "NewScript.lsl");
    if (!name) return;

    const language = name.endsWith(".ts") ? "typescript" as const : "lsl" as const;
    const script = this.scripts.create(name, language);
    this.scripts.setActive(script.id);
    this.onSelect(script.id);
    this.updateList();
  }
}
