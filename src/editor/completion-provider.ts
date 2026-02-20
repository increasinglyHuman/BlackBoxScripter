/**
 * LSL Completion Provider — Autocomplete for the LSL editor.
 *
 * Provides completions for:
 * - ll and os built-in functions (179 from ll-map.ts)
 * - LSL constants (300+ from constants.ts)
 * - Event handler skeletons (from event-map.ts)
 * - Type keywords
 */

import * as monaco from "monaco-editor";
import { LSL_FUNCTION_MAP } from "../api/ll-map.js";
import { LSL_CONSTANTS } from "../transpiler/constants.js";
import { LSL_EVENTS, EVENT_PARAMS } from "../transpiler/event-map.js";

/** Build all completion items once at registration time */
function buildCompletionItems(): monaco.languages.CompletionItem[] {
  const items: monaco.languages.CompletionItem[] = [];

  // Built-in functions from the mapping table
  for (const mapping of LSL_FUNCTION_MAP) {
    items.push({
      label: mapping.lsl,
      kind: monaco.languages.CompletionItemKind.Function,
      detail: `[${mapping.category}] ${mapping.status}`,
      documentation: {
        value: [
          `**${mapping.lsl}**`,
          "",
          `poqpoq: \`${mapping.api}\``,
          ...(mapping.notes ? ["", `*${mapping.notes}*`] : []),
        ].join("\n"),
      },
      insertText: mapping.lsl,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.None,
      range: undefined!,
    });
  }

  // LSL constants
  for (const [name, tsValue] of Object.entries(LSL_CONSTANTS)) {
    const category = name.split("_")[0];
    items.push({
      label: name,
      kind: monaco.languages.CompletionItemKind.Constant,
      detail: `= ${tsValue}`,
      documentation: {
        value: `**${name}**\n\nTypeScript equivalent: \`${tsValue}\``,
      },
      insertText: name,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.None,
      range: undefined!,
    });
  }

  // Event names (as completion inside state blocks)
  for (const event of LSL_EVENTS) {
    const params = EVENT_PARAMS[event] ?? "()";
    items.push({
      label: event,
      kind: monaco.languages.CompletionItemKind.Event,
      detail: "LSL event handler",
      documentation: {
        value: `**${event}${params}**\n\nLSL event handler`,
      },
      insertText: `${event}${params}\n{\n\t$0\n}`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: undefined!,
    });
  }

  // Type keywords
  for (const type of ["integer", "float", "string", "key", "vector", "rotation", "list"]) {
    items.push({
      label: type,
      kind: monaco.languages.CompletionItemKind.Keyword,
      detail: "LSL type",
      insertText: type,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.None,
      range: undefined!,
    });
  }

  return items;
}

/** Register the completion provider for the LSL language */
export function registerLSLCompletionProvider(): monaco.IDisposable {
  const allItems = buildCompletionItems();

  return monaco.languages.registerCompletionItemProvider("lsl", {
    provideCompletionItems(
      model: monaco.editor.ITextModel,
      position: monaco.Position
    ): monaco.languages.CompletionList {
      const word = model.getWordUntilPosition(position);
      const range: monaco.IRange = {
        startLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: word.endColumn,
      };

      // Set the range on each item
      const suggestions = allItems.map((item) => ({
        ...item,
        range,
      }));

      return { suggestions };
    },
  });
}
