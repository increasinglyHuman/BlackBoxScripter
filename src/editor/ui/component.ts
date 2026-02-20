/**
 * UIComponent — Minimal base class for DOM components.
 * No framework dependency. Each component owns its DOM subtree.
 *
 * Subclasses MUST call this.mount() at the end of their constructor,
 * after all fields are initialized. This avoids the classic problem
 * of calling virtual render() from super() before subclass fields exist.
 */

export abstract class UIComponent {
  protected el!: HTMLElement;

  constructor(protected parent: HTMLElement) {
    // Do NOT call render() here — subclass field initializers
    // haven't run yet. Subclasses call this.mount() instead.
  }

  /** Build DOM and attach to parent. Call at end of subclass constructor. */
  protected mount(): void {
    this.el = this.render();
    this.parent.appendChild(this.el);
  }

  /** Create and return the root DOM element */
  abstract render(): HTMLElement;

  /** Get the root element */
  getElement(): HTMLElement {
    return this.el;
  }

  /** Remove from DOM and clean up */
  dispose(): void {
    this.el.remove();
  }

  /** Helper to create an element with attributes and children */
  protected h(
    tag: string,
    attrs?: Record<string, string>,
    ...children: (string | HTMLElement)[]
  ): HTMLElement {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (key === "style") {
          el.style.cssText = value;
        } else if (key === "className") {
          el.className = value;
        } else {
          el.setAttribute(key, value);
        }
      }
    }
    for (const child of children) {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }
    return el;
  }
}
