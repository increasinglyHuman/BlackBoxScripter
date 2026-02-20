/**
 * End-to-end transpiler tests — Real LSL scripts through the full pipeline.
 */

import { describe, it, expect } from "vitest";
import { transpile } from "./transpile.js";
import * as fs from "node:fs";
import * as path from "node:path";

/** Read a fixture file */
function readFixture(tier: string, name: string): string {
  const fixturePath = path.resolve(
    import.meta.dirname ?? ".",
    "../../tests/fixtures/lsl",
    tier,
    name
  );
  return fs.readFileSync(fixturePath, "utf-8");
}

describe("Transpile end-to-end", () => {
  describe("Tier 1 — Minimal scripts", () => {
    it("should transpile DefaultScript.lsl", () => {
      const source = readFixture("tier1", "DefaultScript.lsl");
      const result = transpile(source, { filename: "DefaultScript.lsl" });

      expect(result.success).toBe(true);
      expect(result.className).toBe("DefaultScript");
      expect(result.code).toContain("class DefaultScript extends WorldScript");
      expect(result.code).toContain("onStateEntry");
      expect(result.code).toContain('this.say(0, "Script running")');
    });

    it("should transpile DefaultSayAndTouch.lsl", () => {
      const source = readFixture("tier1", "DefaultSayAndTouch.lsl");
      const result = transpile(source, { filename: "DefaultSayAndTouch.lsl" });

      expect(result.success).toBe(true);
      expect(result.className).toBe("DefaultSayAndTouch");
      expect(result.code).toContain("onStateEntry");
      expect(result.code).toContain("onTouchStart");
      expect(result.code).toContain('this.say(0, "I am Alive!")');
      expect(result.code).toContain('this.say(0, "Touched.")');
      expect(result.code).toContain("agent: Agent");
    });
  });

  describe("Tier 2 — Functions, timer, listen", () => {
    it("should transpile osWeatherMap.lsl", () => {
      const source = readFixture("tier2", "osWeatherMap.lsl");
      const result = transpile(source, { filename: "osWeatherMap.lsl" });

      expect(result.success).toBe(true);

      // Global variables → private fields
      expect(result.code).toContain("private count: number = 0;");
      expect(result.code).toContain("private refreshRate: number = 300;");
      expect(result.code).toContain("private URL1: string =");
      expect(result.code).toContain("private dynamicID: string =");

      // User-defined function
      expect(result.code).toContain("private refresh_texture");

      // Global variable access uses this.
      expect(result.code).toContain("this.count");
      expect(result.code).toContain("this.URL1");

      // Timer setup
      expect(result.code).toContain("this.setTimer(this.refreshRate)");

      // Event handlers
      expect(result.code).toContain("onStateEntry");
      expect(result.code).toContain("onTimer");
      expect(result.code).toContain("onTouchStart");

      // Function calls
      expect(result.code).toContain("this.refresh_texture()");

      // Control flow
      expect(result.code).toContain("if (");
      expect(result.code).toContain("else if");
      expect(result.code).toContain("else {");

      // Postfix increment
      expect(result.code).toContain("this.count++");
    });

    it("should transpile GrafittiBoard.lsl", () => {
      const source = readFixture("tier2", "GrafittiBoard.lsl");
      const result = transpile(source, { filename: "GrafittiBoard.lsl" });

      expect(result.success).toBe(true);

      // Global variables
      expect(result.code).toContain('private text: string = ""');
      expect(result.code).toContain("private LISTENING_CHANNEL: number = 43");

      // User-defined functions
      expect(result.code).toContain("private addGraffiti(message: string): void");
      expect(result.code).toContain("private clearGraffiti(): void");
      expect(result.code).toContain("private draw(): void");

      // String operations
      expect(result.code).toContain("message.length"); // llStringLength → .length

      // llGetSubString → helper function
      expect(result.code).toContain("lslSubString(");
      expect(result.code).toContain("lslDeleteSubString(");

      // Helper functions emitted
      expect(result.code).toContain("function lslSubString");
      expect(result.code).toContain("function lslDeleteSubString");

      // listen event with correct params
      expect(result.code).toContain("onListen");
      expect(result.code).toContain("channel: number");
      expect(result.code).toContain("message: string");

      // NULL_KEY constant
      expect(result.code).toContain('"00000000-0000-0000-0000-000000000000"');

      // Vector literal
      expect(result.code).toContain("new Vector3(");

      // while loop
      expect(result.code).toContain("while (");

      // String concatenation
      expect(result.code).toContain("+");
    });
  });

  describe("Tier 3 — Complex scripts", () => {
    it("should transpile particle-template.lsl", () => {
      const source = readFixture("tier3", "particle-template.lsl");
      const result = transpile(source, { filename: "particle-template.lsl" });

      expect(result.success).toBe(true);

      // Global variables
      expect(result.code).toContain('private CONTROLLER_ID: string = "A"');
      expect(result.code).toContain("private AUTO_START: number = true"); // TRUE → true

      // List assignments with constants
      expect(result.code).toContain("particle_parameters");
      expect(result.code).toContain("target_parameters");

      // Particle system calls
      expect(result.code).toContain("this.object.particles(");

      // link_message event
      expect(result.code).toContain("onLinkMessage");
      expect(result.code).toContain("senderLink: number");

      // Control flow
      expect(result.code).toContain("if (");
      expect(result.code).toContain("else if");
      expect(result.code).toContain("return;");

      // Type casts
      expect(result.code).toContain("Number("); // (float)
      expect(result.code).toContain("Math.trunc(Number("); // (integer)

      // Bitwise OR with constants
      expect(result.code).toContain("|");

      // PSYS constants resolved
      expect(result.code).toMatch(/0x[0-9a-fA-F]+/); // Hex constant values
    });
  });

  describe("error handling", () => {
    it("should return error result for invalid syntax", () => {
      const result = transpile("this is not valid LSL at all {{{");
      expect(result.success).toBe(false);
      expect(result.diagnostics.length).toBeGreaterThan(0);
      expect(result.diagnostics[0].severity).toBe("error");
    });

    it("should return error result for unterminated string", () => {
      const result = transpile('default { state_entry() { llSay(0, "broken); } }');
      expect(result.success).toBe(false);
    });
  });

  describe("output structure", () => {
    it("should have import, class, and states", () => {
      const result = transpile(
        `default { state_entry() { llSay(0, "hi"); } }`,
        { className: "Test" }
      );

      const lines = result.code.split("\n");
      // First non-empty line is import
      expect(lines[0]).toMatch(/^import \{/);
      // Has class declaration
      expect(result.code).toContain("export default class Test extends WorldScript");
      // Has states object
      expect(result.code).toContain("states = {");
      // Has closing brace
      expect(result.code.trimEnd()).toMatch(/}$/);
    });

    it("should include AST when requested", () => {
      const result = transpile(
        `default { state_entry() { } }`,
        { includeAst: true }
      );
      expect(result.ast).toBeDefined();
      expect(result.ast?.type).toBe("Script");
    });
  });

  describe("re-exports", () => {
    it("should re-export tokenize", async () => {
      const { tokenize } = await import("./transpile.js");
      expect(typeof tokenize).toBe("function");
    });

    it("should re-export parse", async () => {
      const { parse } = await import("./transpile.js");
      expect(typeof parse).toBe("function");
    });

    it("should re-export generate", async () => {
      const { generate } = await import("./transpile.js");
      expect(typeof generate).toBe("function");
    });
  });
});
