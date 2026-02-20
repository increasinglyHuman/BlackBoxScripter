/**
 * LSL Language Definition for Monaco — Monarch Tokenizer
 *
 * Registers "lsl" as a language with Monaco, providing syntax highlighting
 * for keywords, events, constants, built-in functions, strings, comments,
 * numbers, and operators.
 *
 * Data is pulled directly from the transpiler modules so the tokenizer
 * stays in sync with the transpiler's understanding of LSL.
 */

import * as monaco from "monaco-editor";
import { LSL_CONSTANTS } from "../transpiler/constants.js";
import { LSL_EVENTS } from "../transpiler/event-map.js";

/** All LSL constant names (from transpiler's constant map) */
const constantNames = Object.keys(LSL_CONSTANTS);

/** All LSL event names (from transpiler's event set) */
const eventNames = [...LSL_EVENTS];

/** Monarch tokenizer definition for LSL */
export const lslMonarchDef: monaco.languages.IMonarchLanguage = {
  defaultToken: "",
  ignoreCase: false,

  typeKeywords: [
    "integer", "float", "string", "key", "vector", "rotation", "list",
  ],

  controlKeywords: [
    "if", "else", "for", "while", "do", "jump", "return", "state", "default",
  ],

  events: eventNames,
  constants: constantNames,

  operators: [
    "+", "-", "*", "/", "%",
    "=", "==", "!=", "<", ">", "<=", ">=",
    "&&", "||", "!",
    "&", "|", "^", "~", "<<", ">>",
    "+=", "-=", "*=", "/=", "%=",
    "++", "--",
  ],

  tokenizer: {
    root: [
      // Comments
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@comment"],

      // Strings
      [/"([^"\\]|\\.)*"/, "string"],

      // Numbers — hex, float, integer
      [/0x[0-9a-fA-F]+/, "number.hex"],
      [/\d+\.\d*|\.\d+/, "number.float"],
      [/\d+/, "number"],

      // Identifiers and keywords
      [/[a-zA-Z_]\w*/, {
        cases: {
          "@typeKeywords": "type",
          "@controlKeywords": "keyword",
          "@events": "keyword.event",
          "@constants": "constant",
          "ll[A-Z]\\w*": "function.builtin",
          "os[A-Z]\\w*": "function.builtin",
          "@default": "identifier",
        },
      }],

      // Operators and delimiters
      [/[{}()\[\]]/, "delimiter.bracket"],
      [/[<>]/, "delimiter.angle"],
      [/[;,]/, "delimiter"],
      [/@?\./, "delimiter"],
      [/[+\-*/%=!&|^~<>]+/, "operator"],

      // Whitespace
      [/\s+/, "white"],
    ],

    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"],
    ],
  },
};

/** Language configuration (brackets, auto-closing, etc.) */
export const lslLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["(", ")"],
    ["[", "]"],
    ["<", ">"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: '"', close: '"', notIn: ["string"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: '"', close: '"' },
  ],
  folding: {
    markers: {
      start: /^\s*\{/,
      end: /^\s*\}/,
    },
  },
  indentationRules: {
    increaseIndentPattern: /\{[^}]*$/,
    decreaseIndentPattern: /^\s*\}/,
  },
};

/** Register the LSL language with Monaco */
export function registerLSLLanguage(): void {
  monaco.languages.register({
    id: "lsl",
    extensions: [".lsl"],
    aliases: ["LSL", "Linden Scripting Language"],
  });

  monaco.languages.setMonarchTokensProvider("lsl", lslMonarchDef);
  monaco.languages.setLanguageConfiguration("lsl", lslLanguageConfig);
}
