/**
 * Transpiler error types and diagnostic messages.
 */

/** Source location for error reporting */
export interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}

/** Diagnostic severity levels */
export type DiagnosticSeverity = "error" | "warning" | "info";

/** A diagnostic message from the transpiler */
export interface Diagnostic {
  severity: DiagnosticSeverity;
  message: string;
  loc?: SourceLocation;
  /** Which LSL function triggered this, if applicable */
  lslFunction?: string;
}

/** Transpiler error with source location */
export class TranspilerError extends Error {
  constructor(
    message: string,
    public readonly loc: SourceLocation,
    public readonly source?: string,
  ) {
    super(`[${loc.line}:${loc.column}] ${message}`);
    this.name = "TranspilerError";
  }
}

/** Lexer error — invalid token or unterminated string */
export class LexerError extends TranspilerError {
  constructor(message: string, loc: SourceLocation, source?: string) {
    super(message, loc, source);
    this.name = "LexerError";
  }
}

/** Parser error — unexpected token or missing syntax */
export class ParserError extends TranspilerError {
  constructor(message: string, loc: SourceLocation, source?: string) {
    super(message, loc, source);
    this.name = "ParserError";
  }
}
