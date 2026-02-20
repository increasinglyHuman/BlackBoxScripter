/**
 * Tab Bar — Shows open scripts as tabs with close buttons.
 */

import { UIComponent } from "./component.js";
import type { EditorScriptManager, ScriptDocument } from "../script-manager.js";

export class TabBar extends UIComponent {
  private tabsEl!: HTMLElement;
  private openTabs: string[] = [];

  constructor(
    parent: HTMLElement,
    private scripts: EditorScriptManager,
    private onSelect: (id: string) => void
  ) {
    super(parent);

    // Initialize open tabs with active script
    const active = this.scripts.getActive();
    if (active) {
      this.openTabs = [active.id];
    }

    this.mount();

    // Listen for script events (after mount so tabsEl exists)
    this.scripts.onChange((type, script) => {
      if (type === "activate" && !this.openTabs.includes(script.id)) {
        this.openTabs.push(script.id);
      }
      if (type === "delete") {
        this.openTabs = this.openTabs.filter((id) => id !== script.id);
      }
      this.updateTabs();
    });
  }

  render(): HTMLElement {
    this.tabsEl = this.h("div", {
      className: "tab-bar",
      style:
        "display: flex; align-items: stretch; height: 35px; " +
        "background: var(--poqpoq-background-secondary, #252526); " +
        "border-bottom: 1px solid var(--poqpoq-border, #3e3e3e); " +
        "overflow-x: auto; overflow-y: hidden; " +
        "scrollbar-width: none; user-select: none;",
    });

    this.updateTabs();

    return this.tabsEl;
  }

  /** Open a script tab (add if not already open) */
  openTab(id: string): void {
    if (!this.openTabs.includes(id)) {
      this.openTabs.push(id);
    }
    this.updateTabs();
  }

  private updateTabs(): void {
    this.tabsEl.innerHTML = "";
    const activeId = this.scripts.getActiveId();

    for (const id of this.openTabs) {
      const script = this.scripts.get(id);
      if (!script) continue;

      const isActive = id === activeId;
      const tab = this.createTab(script, isActive);
      this.tabsEl.appendChild(tab);
    }
  }

  private createTab(script: ScriptDocument, isActive: boolean): HTMLElement {
    const tab = this.h("div", {
      style:
        `display: flex; align-items: center; gap: 6px; padding: 0 12px; ` +
        `cursor: pointer; font-size: 13px; white-space: nowrap; ` +
        `border-right: 1px solid var(--poqpoq-border, #3e3e3e); ` +
        `background: ${isActive ? "var(--poqpoq-tab-active, #1e1e1e)" : "var(--poqpoq-tab-inactive, #2d2d2d)"}; ` +
        `color: ${isActive ? "var(--poqpoq-text, #ccc)" : "var(--poqpoq-text-muted, #808080)"}; ` +
        `${isActive ? "border-top: 2px solid var(--poqpoq-accent, #007acc);" : "border-top: 2px solid transparent;"}`,
    });

    // Language indicator
    const langColor = script.language === "lsl" ? "#8b5cf6" : "#3178c6";
    const langIcon = this.h("span", {
      style: `font-size: 10px; font-weight: 700; color: ${langColor};`,
    }, script.language === "lsl" ? "LSL" : "TS");

    // Tab name
    const name = this.h("span", {}, script.name);

    // Dirty indicator
    const dirty = this.h("span", {
      style: `width: 6px; height: 6px; border-radius: 50%; ` +
        `background: ${script.isDirty ? "var(--poqpoq-text-muted, #808080)" : "transparent"};`,
    });

    // Close button
    const closeBtn = this.h("button", {
      style:
        "background: none; border: none; color: var(--poqpoq-text-muted, #808080); " +
        "cursor: pointer; font-size: 14px; padding: 0; line-height: 1; " +
        "opacity: 0; transition: opacity 0.15s;",
    }, "\u00d7");

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeTab(script.id);
    });

    tab.addEventListener("mouseenter", () => {
      closeBtn.style.opacity = "1";
    });
    tab.addEventListener("mouseleave", () => {
      closeBtn.style.opacity = "0";
    });

    tab.addEventListener("click", () => {
      this.scripts.setActive(script.id);
      this.onSelect(script.id);
    });

    tab.appendChild(langIcon);
    tab.appendChild(name);
    tab.appendChild(dirty);
    tab.appendChild(closeBtn);

    return tab;
  }

  private closeTab(id: string): void {
    this.openTabs = this.openTabs.filter((t) => t !== id);

    // If closing active tab, switch to another
    if (this.scripts.getActiveId() === id && this.openTabs.length > 0) {
      const newActive = this.openTabs[this.openTabs.length - 1];
      this.scripts.setActive(newActive);
      this.onSelect(newActive);
    }

    this.updateTabs();
  }
}
