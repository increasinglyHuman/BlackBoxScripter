/**
 * Tests for the LSL Code Generator.
 */

import { describe, it, expect } from "vitest";
import { generate } from "./codegen.js";
import { parse } from "./parser.js";
import type { LSLScript } from "./types.js";

/** Helper: parse LSL source and generate TypeScript */
function transpile(source: string, className?: string): { code: string; diagnostics: any[] } {
  const ast = parse(source);
  const result = generate(ast, { className });
  return { code: result.code, diagnostics: result.diagnostics };
}

describe("CodeGenerator", () => {
  describe("minimal scripts", () => {
    it("should generate a class for DefaultScript", () => {
      const { code } = transpile(
        `default { state_entry() { llSay(0, "Script running"); } }`,
        "DefaultScript"
      );
      expect(code).toContain("class DefaultScript extends WorldScript");
      expect(code).toContain('this.say(0, "Script running")');
      expect(code).toContain("onStateEntry");
      expect(code).toContain("states = {");
    });

    it("should generate import statement", () => {
      const { code } = transpile(
        `default { state_entry() { llSay(0, "hi"); } }`,
        "Test"
      );
      expect(code).toContain('import { WorldScript');
      expect(code).toContain('from "poqpoq/types"');
    });

    it("should default export the class", () => {
      const { code } = transpile(
        `default { state_entry() { } }`,
        "MyScript"
      );
      expect(code).toContain("export default class MyScript");
    });
  });

  describe("global variables", () => {
    it("should emit private fields with defaults", () => {
      const { code } = transpile(
        `integer count = 0; default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("private count: number = 0;");
    });

    it("should emit vector fields with Vector3.ZERO default", () => {
      const { code } = transpile(
        `vector pos; default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("private pos: Vector3 = Vector3.ZERO;");
    });

    it("should emit string fields with empty string default", () => {
      const { code } = transpile(
        `string name = "hello"; default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain('private name: string = "hello";');
    });

    it("should emit list fields", () => {
      const { code } = transpile(
        `list items; default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("private items: any[] = [];");
    });

    it("should prefix global variable access with this.", () => {
      const { code } = transpile(
        `integer count = 0;
         default { state_entry() { count = count + 1; } }`,
        "Test"
      );
      expect(code).toContain("this.count = this.count + 1");
    });
  });

  describe("global functions", () => {
    it("should emit as private methods", () => {
      const { code } = transpile(
        `refresh() { llSay(0, "refresh"); }
         default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("private refresh(): void");
      expect(code).toContain('this.say(0, "refresh")');
    });

    it("should emit return type for typed functions", () => {
      const { code } = transpile(
        `integer getCount() { return 42; }
         default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("private getCount(): number");
    });

    it("should emit parameters with types", () => {
      const { code } = transpile(
        `doSomething(string msg, integer n) { llSay(0, msg); }
         default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("private doSomething(msg: string, n: number): void");
    });

    it("should call user functions with this. prefix", () => {
      const { code } = transpile(
        `refresh() { llSay(0, "hi"); }
         default { state_entry() { refresh(); } }`,
        "Test"
      );
      expect(code).toContain("this.refresh()");
    });
  });

  describe("event handlers", () => {
    it("should map state_entry to onStateEntry", () => {
      const { code } = transpile(
        `default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("onStateEntry");
    });

    it("should map touch_start with Agent parameter", () => {
      const { code } = transpile(
        `default { touch_start(integer n) { llSay(0, "touched"); } }`,
        "Test"
      );
      expect(code).toContain("onTouchStart(this: Test, agent: Agent, face: number)");
      expect(code).toContain("type Agent");
    });

    it("should map listen with correct parameters", () => {
      const { code } = transpile(
        `default { listen(integer ch, string name, key id, string msg) { llSay(0, msg); } }`,
        "Test"
      );
      expect(code).toContain("onListen(this: Test, channel: number, name: string, id: string, message: string)");
    });

    it("should map timer event", () => {
      const { code } = transpile(
        `default { timer() { llSay(0, "tick"); } }`,
        "Test"
      );
      expect(code).toContain("onTimer(this: Test, timerId?: string)");
    });

    it("should map on_rez", () => {
      const { code } = transpile(
        `default { on_rez(integer p) { } }`,
        "Test"
      );
      expect(code).toContain("onRez(this: Test, startParam: number)");
    });

    it("should map changed event", () => {
      const { code } = transpile(
        `default { changed(integer c) { } }`,
        "Test"
      );
      expect(code).toContain("onChanged(this: Test, change: number)");
    });

    it("should map link_message", () => {
      const { code } = transpile(
        `default { link_message(integer s, integer n, string m, key k) { } }`,
        "Test"
      );
      expect(code).toContain("onLinkMessage(this: Test, senderLink: number, num: number, str: string, id: string)");
    });

    it("should map collision_start with detected parameter", () => {
      const { code } = transpile(
        `default { collision_start(integer n) { } }`,
        "Test"
      );
      expect(code).toContain("onCollisionStart(this: Test, detected: DetectedInfo[])");
    });

    it("should map sensor with detected parameter", () => {
      const { code } = transpile(
        `default { sensor(integer n) { } }`,
        "Test"
      );
      expect(code).toContain("onSensor(this: Test, detected: DetectedInfo[])");
    });
  });

  describe("multiple states", () => {
    it("should emit both default and named states", () => {
      const { code } = transpile(
        `default { state_entry() { } }
         state active { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("default: {");
      expect(code).toContain("active: {");
    });
  });

  describe("LSL function resolution", () => {
    it("should resolve llSay to this.say", () => {
      const { code } = transpile(
        `default { state_entry() { llSay(0, "hello"); } }`,
        "Test"
      );
      expect(code).toContain('this.say(0, "hello")');
    });

    it("should resolve llGetPos to this.object.getPosition()", () => {
      const { code } = transpile(
        `default { state_entry() { vector p = llGetPos(); } }`,
        "Test"
      );
      expect(code).toContain("this.object.getPosition()");
    });

    it("should resolve llSetTimerEvent", () => {
      const { code } = transpile(
        `default { state_entry() { llSetTimerEvent(1.0); } }`,
        "Test"
      );
      expect(code).toContain("this.setTimer(1)");
    });

    it("should resolve llSleep to await this.delay", () => {
      const { code } = transpile(
        `default { state_entry() { llSleep(2.0); } }`,
        "Test"
      );
      expect(code).toContain("await this.delay(2)");
    });

    it("should resolve llGetOwner to this.owner.id", () => {
      const { code } = transpile(
        `default { state_entry() { key k = llGetOwner(); } }`,
        "Test"
      );
      expect(code).toContain("this.owner.id");
    });

    it("should resolve llDetectedKey to detected array access", () => {
      const { code } = transpile(
        `default { touch_start(integer n) { key k = llDetectedKey(0); } }`,
        "Test"
      );
      expect(code).toContain("detected[0].id");
    });

    it("should resolve Math functions", () => {
      const { code } = transpile(
        `default { state_entry() { float x = llSin(3.14); } }`,
        "Test"
      );
      expect(code).toContain("Math.sin(3.14)");
    });

    it("should resolve llVecDist as method call", () => {
      const { code } = transpile(
        `default { state_entry() {
          vector v1 = <0.0, 0.0, 0.0>;
          vector v2 = <1.0, 0.0, 0.0>;
          float d = llVecDist(v1, v2);
        } }`,
        "Test"
      );
      expect(code).toContain("v1.distanceTo(v2)");
    });

    it("should resolve llStringLength as .length property", () => {
      const { code } = transpile(
        `default { state_entry() {
          string s = "hello";
          integer n = llStringLength(s);
        } }`,
        "Test"
      );
      expect(code).toContain("s.length");
    });
  });

  describe("constants", () => {
    it("should replace TRUE/FALSE with true/false", () => {
      const { code } = transpile(
        `integer x = TRUE; integer y = FALSE;
         default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("= true;");
      expect(code).toContain("= false;");
    });

    it("should replace PI with Math.PI", () => {
      const { code } = transpile(
        `default { state_entry() { float x = PI; } }`,
        "Test"
      );
      expect(code).toContain("Math.PI");
    });

    it("should replace ZERO_VECTOR", () => {
      const { code } = transpile(
        `vector v = ZERO_VECTOR;
         default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("Vector3.ZERO");
    });
  });

  describe("type casts", () => {
    it("should emit (string) as String()", () => {
      const { code } = transpile(
        `default { state_entry() { string s = (string)42; } }`,
        "Test"
      );
      expect(code).toContain("String(42)");
    });

    it("should emit (integer) as Math.trunc(Number())", () => {
      const { code } = transpile(
        `default { state_entry() { integer n = (integer)3.14; } }`,
        "Test"
      );
      expect(code).toContain("Math.trunc(Number(3.14))");
    });

    it("should emit (float) as Number()", () => {
      const { code } = transpile(
        `default { state_entry() { float f = (float)42; } }`,
        "Test"
      );
      expect(code).toContain("Number(42)");
    });
  });

  describe("operator overloading", () => {
    it("should emit vector + vector as .add()", () => {
      const { code } = transpile(
        `default { state_entry() {
          vector a = <1.0, 0.0, 0.0>;
          vector b = <0.0, 1.0, 0.0>;
          vector c = a + b;
        } }`,
        "Test"
      );
      expect(code).toContain("a.add(b)");
    });

    it("should emit vector - vector as .subtract()", () => {
      const { code } = transpile(
        `default { state_entry() {
          vector a = <1.0, 0.0, 0.0>;
          vector b = <0.0, 1.0, 0.0>;
          vector c = a - b;
        } }`,
        "Test"
      );
      expect(code).toContain("a.subtract(b)");
    });

    it("should emit vector * vector as .dot()", () => {
      const { code } = transpile(
        `default { state_entry() {
          vector a = <1.0, 0.0, 0.0>;
          vector b = <0.0, 1.0, 0.0>;
          float d = a * b;
        } }`,
        "Test"
      );
      expect(code).toContain("a.dot(b)");
    });

    it("should emit vector % vector as .cross()", () => {
      const { code } = transpile(
        `default { state_entry() {
          vector a = <1.0, 0.0, 0.0>;
          vector b = <0.0, 1.0, 0.0>;
          vector c = a % b;
        } }`,
        "Test"
      );
      expect(code).toContain("a.cross(b)");
    });

    it("should emit vector * scalar as .scale()", () => {
      const { code } = transpile(
        `default { state_entry() {
          vector v = <1.0, 2.0, 3.0>;
          vector scaled = v * 2.0;
        } }`,
        "Test"
      );
      expect(code).toContain("v.scale(2)");
    });

    it("should emit rotation * rotation as .multiply()", () => {
      const { code } = transpile(
        `default { state_entry() {
          rotation a = <0.0, 0.0, 0.0, 1.0>;
          rotation b = <0.0, 0.0, 0.0, 1.0>;
          rotation c = a * b;
        } }`,
        "Test"
      );
      expect(code).toContain("a.multiply(b)");
    });
  });

  describe("control flow", () => {
    it("should emit if/else", () => {
      const { code } = transpile(
        `default { state_entry() {
          integer x = 1;
          if (x > 0) { llSay(0, "positive"); }
          else { llSay(0, "non-positive"); }
        } }`,
        "Test"
      );
      expect(code).toContain("if (x > 0)");
      expect(code).toContain("else {");
    });

    it("should emit while loop", () => {
      const { code } = transpile(
        `default { state_entry() {
          integer i = 0;
          while (i < 10) { i = i + 1; }
        } }`,
        "Test"
      );
      expect(code).toContain("while (i < 10)");
    });

    it("should emit for loop", () => {
      const { code } = transpile(
        `default { state_entry() {
          integer i;
          for (i = 0; i < 10; i = i + 1) { llSay(0, (string)i); }
        } }`,
        "Test"
      );
      expect(code).toContain("for (");
    });

    it("should emit do-while loop", () => {
      const { code } = transpile(
        `default { state_entry() {
          integer i = 0;
          do { i = i + 1; } while (i < 10);
        } }`,
        "Test"
      );
      expect(code).toContain("do {");
      expect(code).toContain("} while (i < 10)");
    });

    it("should emit return statements", () => {
      const { code } = transpile(
        `integer getVal() { return 42; }
         default { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain("return 42;");
    });
  });

  describe("state changes", () => {
    it("should emit transitionTo for state change", () => {
      const { code } = transpile(
        `default { touch_start(integer n) { state active; } }
         state active { state_entry() { } }`,
        "Test"
      );
      expect(code).toContain('await this.transitionTo("active")');
      expect(code).toContain("return;");
    });
  });

  describe("vector/rotation literals", () => {
    it("should emit new Vector3(...)", () => {
      const { code } = transpile(
        `default { state_entry() { vector v = <1.0, 2.0, 3.0>; } }`,
        "Test"
      );
      expect(code).toContain("new Vector3(1, 2, 3)");
    });

    it("should emit new Quaternion(...)", () => {
      const { code } = transpile(
        `default { state_entry() { rotation r = <0.0, 0.0, 0.0, 1.0>; } }`,
        "Test"
      );
      expect(code).toContain("new Quaternion(0, 0, 0, 1)");
    });
  });

  describe("string operations", () => {
    it("should emit string concatenation as +", () => {
      const { code } = transpile(
        `default { state_entry() {
          string a = "hello";
          string b = " world";
          string c = a + b;
        } }`,
        "Test"
      );
      expect(code).toContain("a + b");
    });
  });

  describe("async propagation", () => {
    it("should mark functions calling llSleep as async", () => {
      const { code } = transpile(
        `doWait() { llSleep(1.0); }
         default { state_entry() { doWait(); } }`,
        "Test"
      );
      expect(code).toContain("private async doWait");
      expect(code).toContain("await this.doWait()");
    });

    it("should propagate async through call chains", () => {
      const { code } = transpile(
        `innerWait() { llSleep(1.0); }
         outerCall() { innerWait(); }
         default { state_entry() { outerCall(); } }`,
        "Test"
      );
      expect(code).toContain("private async innerWait");
      expect(code).toContain("private async outerCall");
      expect(code).toContain("await this.outerCall()");
    });
  });

  describe("class name derivation", () => {
    it("should derive from filename option", () => {
      const ast = parse(`default { state_entry() { } }`);
      const result = generate(ast, { filename: "MyScript.lsl" });
      expect(result.className).toBe("MyScript");
      expect(result.code).toContain("class MyScript extends WorldScript");
    });

    it("should use provided className over filename", () => {
      const ast = parse(`default { state_entry() { } }`);
      const result = generate(ast, { className: "Custom", filename: "other.lsl" });
      expect(result.className).toBe("Custom");
    });

    it("should default to LSLScript when no name given", () => {
      const ast = parse(`default { state_entry() { } }`);
      const result = generate(ast);
      expect(result.className).toBe("LSLScript");
    });
  });

  describe("diagnostics", () => {
    it("should emit warning for jump/label", () => {
      const { diagnostics } = transpile(
        `default { state_entry() { @myLabel; jump myLabel; } }`,
        "Test"
      );
      expect(diagnostics.length).toBeGreaterThanOrEqual(2);
      expect(diagnostics.some((d) => d.severity === "warning")).toBe(true);
    });

    it("should succeed for valid scripts", () => {
      const ast = parse(`default { state_entry() { llSay(0, "hi"); } }`);
      const result = generate(ast, { className: "Test" });
      expect(result.success).toBe(true);
    });
  });

  describe("real script patterns", () => {
    it("should transpile DefaultSayAndTouch pattern", () => {
      const { code } = transpile(`
        default
        {
          state_entry()
          {
            llSay(0, "I am Alive!");
          }
          touch_start(integer number_of_touchs)
          {
            llSay(0, "Touched.");
          }
        }
      `, "DefaultSayAndTouch");

      expect(code).toContain("class DefaultSayAndTouch extends WorldScript");
      expect(code).toContain('this.say(0, "I am Alive!")');
      expect(code).toContain('this.say(0, "Touched.")');
      expect(code).toContain("onStateEntry");
      expect(code).toContain("onTouchStart");
    });

    it("should transpile timer pattern", () => {
      const { code } = transpile(`
        integer count = 0;
        default
        {
          state_entry()
          {
            llSetTimerEvent(1.0);
          }
          timer()
          {
            count = count + 1;
            llSay(0, "Count: " + (string)count);
          }
        }
      `, "Counter");

      expect(code).toContain("private count: number = 0;");
      expect(code).toContain("this.setTimer(1)");
      expect(code).toContain("this.count = this.count + 1");
      expect(code).toContain("String(this.count)");
    });
  });
});
