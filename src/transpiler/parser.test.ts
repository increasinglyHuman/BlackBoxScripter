/**
 * Tests for the LSL Parser.
 */

import { describe, it, expect } from "vitest";
import { parse } from "./parser.js";

describe("LSL Parser", () => {
  describe("minimal scripts", () => {
    it("should parse DefaultScript.lsl pattern", () => {
      const ast = parse(`
        default
        {
            state_entry()
            {
                llSay( 0, "Script running");
            }
        }
      `);
      expect(ast.type).toBe("Script");
      expect(ast.globals).toHaveLength(0);
      expect(ast.states).toHaveLength(1);
      expect(ast.states[0].name).toBe("default");
      expect(ast.states[0].events).toHaveLength(1);
      expect(ast.states[0].events[0].name).toBe("state_entry");
    });

    it("should parse DefaultSayAndTouch.lsl pattern", () => {
      const ast = parse(`
        default
        {
            state_entry()
            {
                llSay( 0, "I am Alive!");
            }
            touch_start(integer number_of_touchs)
            {
                llSay( 0, "Touched.");
            }
        }
      `);
      expect(ast.states[0].events).toHaveLength(2);
      expect(ast.states[0].events[0].name).toBe("state_entry");
      expect(ast.states[0].events[1].name).toBe("touch_start");
      expect(ast.states[0].events[1].parameters).toHaveLength(1);
      expect(ast.states[0].events[1].parameters[0].dataType).toBe("integer");
    });
  });

  describe("global variables", () => {
    it("should parse global variable declarations", () => {
      const ast = parse(`
        integer count = 0;
        string name = "hello";
        float rate = 1.5;
        default { state_entry() {} }
      `);
      expect(ast.globals).toHaveLength(3);
      expect(ast.globals[0].type).toBe("VariableDeclaration");
      const v0 = ast.globals[0] as { dataType: string; name: string };
      expect(v0.dataType).toBe("integer");
      expect(v0.name).toBe("count");
    });

    it("should parse uninitialized globals", () => {
      const ast = parse(`
        vector pos;
        rotation rot;
        list items;
        default { state_entry() {} }
      `);
      expect(ast.globals).toHaveLength(3);
    });

    it("should parse vector global with literal initializer", () => {
      const ast = parse(`
        vector pos = <1.0, 2.0, 3.0>;
        default { state_entry() {} }
      `);
      const varDecl = ast.globals[0] as any;
      expect(varDecl.initializer.type).toBe("VectorLiteral");
    });
  });

  describe("global functions", () => {
    it("should parse void function with no params", () => {
      const ast = parse(`
        doStuff()
        {
            llSay(0, "stuff");
        }
        default { state_entry() {} }
      `);
      expect(ast.globals).toHaveLength(1);
      expect(ast.globals[0].type).toBe("FunctionDeclaration");
      const fn = ast.globals[0] as any;
      expect(fn.name).toBe("doStuff");
      expect(fn.returnType).toBeNull();
      expect(fn.parameters).toHaveLength(0);
    });

    it("should parse typed function with params", () => {
      const ast = parse(`
        integer add(integer a, integer b)
        {
            return a + b;
        }
        default { state_entry() {} }
      `);
      const fn = ast.globals[0] as any;
      expect(fn.returnType).toBe("integer");
      expect(fn.name).toBe("add");
      expect(fn.parameters).toHaveLength(2);
    });

    it("should parse GrafittiBoard-style functions", () => {
      const ast = parse(`
        string text = "";
        addGraffiti(string message)
        {
            text = message;
        }
        clearGraffiti()
        {
            text = "";
        }
        default { state_entry() {} }
      `);
      expect(ast.globals).toHaveLength(3); // 1 var + 2 functions
    });
  });

  describe("multiple states", () => {
    it("should parse default and named states", () => {
      const ast = parse(`
        default
        {
            state_entry()
            {
                state running;
            }
        }
        state running
        {
            state_entry()
            {
                llSay(0, "Running!");
            }
        }
      `);
      expect(ast.states).toHaveLength(2);
      expect(ast.states[0].name).toBe("default");
      expect(ast.states[1].name).toBe("running");
    });
  });

  describe("expressions", () => {
    it("should parse function calls", () => {
      const ast = parse(`default { state_entry() { llSay(0, "hello"); } }`);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("ExpressionStatement");
      expect(stmt.expression.type).toBe("FunctionCallExpression");
      expect(stmt.expression.name).toBe("llSay");
      expect(stmt.expression.arguments).toHaveLength(2);
    });

    it("should parse binary expressions with correct structure", () => {
      const ast = parse(`default { state_entry() { integer x = a + b * c; } }`);
      const varDecl = ast.states[0].events[0].body[0] as any;
      const init = varDecl.initializer;
      // a + (b * c) due to precedence
      expect(init.type).toBe("BinaryExpression");
      expect(init.operator).toBe("+");
      expect(init.right.type).toBe("BinaryExpression");
      expect(init.right.operator).toBe("*");
    });

    it("should parse unary expressions", () => {
      const ast = parse(`default { state_entry() { integer x = -1; integer y = !flag; } }`);
      const v1 = (ast.states[0].events[0].body[0] as any).initializer;
      expect(v1.type).toBe("UnaryExpression");
      expect(v1.operator).toBe("-");
    });

    it("should parse type casts", () => {
      const ast = parse(`default { state_entry() { string s = (string)42; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("TypeCastExpression");
      expect(init.targetType).toBe("string");
    });

    it("should parse member access (v.x)", () => {
      const ast = parse(`default { state_entry() { float x = pos.x; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("MemberExpression");
      expect(init.property).toBe("x");
    });

    it("should parse postfix increment", () => {
      const ast = parse(`default { state_entry() { count++; } }`);
      const expr = (ast.states[0].events[0].body[0] as any).expression;
      expect(expr.type).toBe("PostfixExpression");
      expect(expr.operator).toBe("++");
    });

    it("should parse assignment expressions", () => {
      const ast = parse(`default { state_entry() { x = 5; x += 1; } }`);
      const a1 = (ast.states[0].events[0].body[0] as any).expression;
      expect(a1.type).toBe("AssignmentExpression");
      expect(a1.operator).toBe("=");
      const a2 = (ast.states[0].events[0].body[1] as any).expression;
      expect(a2.operator).toBe("+=");
    });

    it("should parse string concatenation", () => {
      const ast = parse(`default { state_entry() { string s = "a" + "b"; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("BinaryExpression");
      expect(init.operator).toBe("+");
    });

    it("should parse bitwise OR (particle flags pattern)", () => {
      const ast = parse(`default { state_entry() { integer flags = A | B | C; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("BinaryExpression");
      expect(init.operator).toBe("|");
    });

    it("should parse nested function calls", () => {
      const ast = parse(`default { state_entry() { llSay(0, llGetObjectName()); } }`);
      const call = (ast.states[0].events[0].body[0] as any).expression;
      expect(call.arguments[1].type).toBe("FunctionCallExpression");
      expect(call.arguments[1].name).toBe("llGetObjectName");
    });
  });

  describe("vector and rotation literals", () => {
    it("should parse vector literal", () => {
      const ast = parse(`default { state_entry() { vector v = <1.0, 2.0, 3.0>; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("VectorLiteral");
      expect(init.x.value).toBe(1.0);
      expect(init.y.value).toBe(2.0);
      expect(init.z.value).toBe(3.0);
    });

    it("should parse rotation literal", () => {
      const ast = parse(`default { state_entry() { rotation r = <0, 0, 0, 1>; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("RotationLiteral");
      expect(init.s.value).toBe(1);
    });

    it("should parse vector with expressions", () => {
      const ast = parse(`default { state_entry() { vector v = <x + 1, y * 2, 0>; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("VectorLiteral");
      expect(init.x.type).toBe("BinaryExpression");
    });

    it("should parse vector in function call", () => {
      const ast = parse(`default { state_entry() { llSetText("hi", <0.0, 1.0, 0.0>, 1.0); } }`);
      const call = (ast.states[0].events[0].body[0] as any).expression;
      expect(call.arguments[1].type).toBe("VectorLiteral");
    });

    it("should parse vector with FALSE (common LSL pattern)", () => {
      // This is a real pattern: <0.0, .1, FALSE> where FALSE=0 used as z component
      const ast = parse(`default { state_entry() { vector v = <0.0, .1, FALSE>; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("VectorLiteral");
    });
  });

  describe("list literals", () => {
    it("should parse empty list", () => {
      const ast = parse(`default { state_entry() { list l = []; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("ListLiteral");
      expect(init.elements).toHaveLength(0);
    });

    it("should parse heterogeneous list", () => {
      const ast = parse(`default { state_entry() { list l = [1, "two", <1,2,3>]; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.elements).toHaveLength(3);
      expect(init.elements[0].type).toBe("IntegerLiteral");
      expect(init.elements[1].type).toBe("StringLiteral");
      expect(init.elements[2].type).toBe("VectorLiteral");
    });

    it("should parse list concatenation with +", () => {
      const ast = parse(`default { state_entry() { list l = params + targets; } }`);
      const init = (ast.states[0].events[0].body[0] as any).initializer;
      expect(init.type).toBe("BinaryExpression");
      expect(init.operator).toBe("+");
    });
  });

  describe("control flow", () => {
    it("should parse if/else", () => {
      const ast = parse(`
        default { state_entry() {
          if (x == 1) { llSay(0, "one"); }
          else { llSay(0, "other"); }
        }}
      `);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("IfStatement");
      expect(stmt.alternate).not.toBeNull();
    });

    it("should parse if/else if/else", () => {
      const ast = parse(`
        default { state_entry() {
          if (c == 0) { url = URL1; }
          else if (c == 1) { url = URL2; }
          else { url = URL3; }
        }}
      `);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("IfStatement");
      expect(stmt.alternate.type).toBe("IfStatement");
    });

    it("should parse while loop", () => {
      const ast = parse(`
        default { state_entry() {
          while (llStringLength(message) > 42) { message = ""; }
        }}
      `);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("WhileStatement");
    });

    it("should parse for loop", () => {
      const ast = parse(`
        default { state_entry() {
          for (i = 0; i < 10; i++) { llSay(0, (string)i); }
        }}
      `);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("ForStatement");
      expect(stmt.init).not.toBeNull();
      expect(stmt.condition).not.toBeNull();
      expect(stmt.update).not.toBeNull();
    });

    it("should parse do-while loop", () => {
      const ast = parse(`
        default { state_entry() {
          do { x++; } while (x < 10);
        }}
      `);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("DoWhileStatement");
    });

    it("should parse return with value", () => {
      const ast = parse(`
        integer add(integer a, integer b) { return a + b; }
        default { state_entry() {} }
      `);
      const fn = ast.globals[0] as any;
      const ret = fn.body[0];
      expect(ret.type).toBe("ReturnStatement");
      expect(ret.value).not.toBeNull();
    });

    it("should parse return without value", () => {
      const ast = parse(`
        doStuff() { return; }
        default { state_entry() {} }
      `);
      const fn = ast.globals[0] as any;
      const ret = fn.body[0];
      expect(ret.type).toBe("ReturnStatement");
      expect(ret.value).toBeNull();
    });
  });

  describe("jump and label", () => {
    it("should parse jump statement", () => {
      const ast = parse(`default { state_entry() { jump done; } }`);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("JumpStatement");
      expect(stmt.label).toBe("done");
    });

    it("should parse label", () => {
      const ast = parse(`default { state_entry() { @done; } }`);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("LabelStatement");
      expect(stmt.label).toBe("done");
    });
  });

  describe("state changes", () => {
    it("should parse state change to named state", () => {
      const ast = parse(`default { state_entry() { state running; } }`);
      const stmt = ast.states[0].events[0].body[0] as any;
      expect(stmt.type).toBe("StateChangeStatement");
      expect(stmt.targetState).toBe("running");
    });

    it("should parse state change to default", () => {
      const ast = parse(`
        default { state_entry() {} }
        state running { state_entry() { state default; } }
      `);
      const stmt = ast.states[1].events[0].body[0] as any;
      expect(stmt.type).toBe("StateChangeStatement");
      expect(stmt.targetState).toBe("default");
    });
  });

  describe("event parameters", () => {
    it("should parse listen event parameters", () => {
      const ast = parse(`
        default {
          listen(integer channel, string name, key id, string message)
          {
            llSay(0, message);
          }
        }
      `);
      const event = ast.states[0].events[0];
      expect(event.name).toBe("listen");
      expect(event.parameters).toHaveLength(4);
      expect(event.parameters[0].dataType).toBe("integer");
      expect(event.parameters[1].dataType).toBe("string");
      expect(event.parameters[2].dataType).toBe("key");
      expect(event.parameters[3].dataType).toBe("string");
    });

    it("should parse link_message event", () => {
      const ast = parse(`
        default {
          link_message(integer sender_num, integer num, string str, key id)
          {
            if (num == 500) { llSay(0, str); }
          }
        }
      `);
      const event = ast.states[0].events[0];
      expect(event.name).toBe("link_message");
      expect(event.parameters).toHaveLength(4);
    });
  });

  describe("osWeatherMap pattern", () => {
    it("should parse functions + state with timer and touch", () => {
      const ast = parse(`
        integer count = 0;
        integer refreshRate = 300;
        string URL1 = "http://example.com";
        string dynamicID = "";
        string contentType = "image";

        refresh_texture()
        {
            count++;
            string url = "";
            integer c = count % 3;
            if (c == 0) { url = URL1; }
            else { url = URL1; }
            osSetDynamicTextureURL(dynamicID, contentType, url, "", refreshRate);
        }

        default
        {
            state_entry()
            {
                refresh_texture();
                llSetTimerEvent(refreshRate);
            }
            timer()
            {
                refresh_texture();
            }
            touch_start(integer times)
            {
                refresh_texture();
            }
        }
      `);
      expect(ast.globals).toHaveLength(6); // 5 vars + 1 function
      expect(ast.states).toHaveLength(1);
      expect(ast.states[0].events).toHaveLength(3);
    });
  });

  describe("error handling", () => {
    it("should throw on missing semicolon", () => {
      expect(() => parse(`default { state_entry() { llSay(0, "hi") } }`)).toThrow();
    });

    it("should throw on missing closing brace", () => {
      expect(() => parse(`default { state_entry() { llSay(0, "hi"); }`)).toThrow();
    });

    it("should throw on unexpected token", () => {
      expect(() => parse(`default { + }`)).toThrow();
    });
  });
});
