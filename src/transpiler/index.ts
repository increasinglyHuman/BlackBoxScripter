/**
 * LSL-to-TypeScript Transpiler — Public API
 *
 * Converts legacy LSL scripts from Second Life and OpenSimulator
 * into TypeScript classes extending WorldScript for poqpoq World.
 */

// Main entry point
export { transpile } from "./transpile.js";

// Pipeline stages
export { tokenize, Lexer } from "./lexer.js";
export { parse, Parser } from "./parser.js";
export { generate, CodeGenerator } from "./codegen.js";

// Support modules
export { TypeTracker } from "./type-tracker.js";
export { FunctionResolver } from "./function-resolver.js";
export { LSL_CONSTANTS, CONSTANTS_REQUIRING_IMPORTS } from "./constants.js";

// Types
export type {
  Token,
  TokenType,
  LSLType,
  LSLScript,
  StateDeclaration,
  EventHandler,
  FunctionDeclaration,
  VariableDeclaration,
  Parameter,
  Statement,
  Expression,
  TranspileOptions,
  TranspileResult,
} from "./types.js";

export type {
  SourceLocation,
  Diagnostic,
  DiagnosticSeverity,
} from "./errors.js";

export { TranspilerError, LexerError, ParserError } from "./errors.js";
export type { OperatorOverload } from "./type-tracker.js";
export type { ResolvedFunction } from "./function-resolver.js";
