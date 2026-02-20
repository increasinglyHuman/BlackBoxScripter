/**
 * Diagnostics Bridge — Wire transpiler diagnostics to Monaco markers.
 *
 * Converts the transpiler's Diagnostic[] format into Monaco's marker
 * system for red/yellow squiggly underlines in the editor.
 */

import * as monaco from "monaco-editor";
import type { Diagnostic } from "../transpiler/errors.js";

/** Severity string to Monaco MarkerSeverity */
function toMarkerSeverity(severity: string): monaco.MarkerSeverity {
  switch (severity) {
    case "error":
      return monaco.MarkerSeverity.Error;
    case "warning":
      return monaco.MarkerSeverity.Warning;
    case "info":
      return monaco.MarkerSeverity.Info;
    default:
      return monaco.MarkerSeverity.Info;
  }
}

/** Convert transpiler diagnostics to Monaco marker format */
export function diagnosticsToMarkers(
  diagnostics: Diagnostic[]
): monaco.editor.IMarkerData[] {
  return diagnostics.map((d) => ({
    severity: toMarkerSeverity(d.severity),
    startLineNumber: d.loc?.line ?? 1,
    startColumn: d.loc?.column ?? 1,
    endLineNumber: d.loc?.line ?? 1,
    endColumn: (d.loc?.column ?? 1) + 10,
    message: d.message,
    source: "poqpoq-transpiler",
  }));
}

/** Apply transpiler diagnostics as markers on a Monaco model */
export function setDiagnostics(
  model: monaco.editor.ITextModel,
  diagnostics: Diagnostic[]
): void {
  const markers = diagnosticsToMarkers(diagnostics);
  monaco.editor.setModelMarkers(model, "poqpoq-transpiler", markers);
}

/** Clear all transpiler markers from a model */
export function clearDiagnostics(model: monaco.editor.ITextModel): void {
  monaco.editor.setModelMarkers(model, "poqpoq-transpiler", []);
}
