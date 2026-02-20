/**
 * LSL Hover Provider — Hover information for LSL identifiers.
 *
 * Shows documentation when hovering over:
 * - ll and os functions: signature + poqpoq equivalent + notes
 * - Constants: name + TypeScript equivalent value
 * - Events: LSL name → poqpoq handler name + parameters
 */

import * as monaco from "monaco-editor";
import { LSL_FUNCTION_MAP } from "../api/ll-map.js";
import { LSL_CONSTANTS } from "../transpiler/constants.js";
import { LSL_EVENTS, EVENT_NAME_MAP, EVENT_PARAMS } from "../transpiler/event-map.js";

/** Build a lookup map for O(1) function resolution */
const functionLookup = new Map(
  LSL_FUNCTION_MAP.map((m) => [m.lsl, m])
);

/** Register the hover provider for the LSL language */
export function registerLSLHoverProvider(): monaco.IDisposable {
  return monaco.languages.registerHoverProvider("lsl", {
    provideHover(
      model: monaco.editor.ITextModel,
      position: monaco.Position
    ): monaco.languages.Hover | null {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const name = word.word;
      const range: monaco.IRange = {
        startLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: word.endColumn,
      };

      // Check ll*/os* functions
      const func = functionLookup.get(name);
      if (func) {
        const parts = [
          `**${func.lsl}** → \`${func.api}\``,
          "",
          `*Category:* ${func.category} · *Status:* ${func.status}`,
        ];
        if (func.notes) {
          parts.push("", `*Note:* ${func.notes}`);
        }
        return {
          range,
          contents: [{ value: parts.join("\n") }],
        };
      }

      // Check constants
      const constantValue = LSL_CONSTANTS[name];
      if (constantValue !== undefined) {
        return {
          range,
          contents: [{
            value: `**${name}** = \`${constantValue}\``,
          }],
        };
      }

      // Check events
      if (LSL_EVENTS.has(name)) {
        const tsName = EVENT_NAME_MAP[name] ?? name;
        const params = EVENT_PARAMS[name] ?? "()";
        return {
          range,
          contents: [{
            value: [
              `**${name}** → \`${tsName}\``,
              "",
              `\`${name}${params}\``,
            ].join("\n"),
          }],
        };
      }

      return null;
    },
  });
}
