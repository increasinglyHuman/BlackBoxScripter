/**
 * Tests for the LSL Type Tracker.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { TypeTracker, BUILTIN_RETURN_TYPES } from "./type-tracker.js";
import type { Expression } from "./types.js";
import type { SourceLocation } from "./errors.js";

/** Helper: create a dummy source location */
const loc: SourceLocation = { line: 1, column: 1, offset: 0 };

/** Helper: create expression nodes for testing */
function intLit(value: number): Expression {
  return { type: "IntegerLiteral", value, loc };
}

function floatLit(value: number): Expression {
  return { type: "FloatLiteral", value, loc };
}

function stringLit(value: string): Expression {
  return { type: "StringLiteral", value, loc };
}

function ident(name: string): Expression {
  return { type: "IdentifierExpression", name, loc };
}

function vecLit(): Expression {
  return { type: "VectorLiteral", x: floatLit(1), y: floatLit(2), z: floatLit(3), loc };
}

function rotLit(): Expression {
  return { type: "RotationLiteral", x: floatLit(0), y: floatLit(0), z: floatLit(0), s: floatLit(1), loc };
}

function listLit(): Expression {
  return { type: "ListLiteral", elements: [], loc };
}

function call(name: string, args: Expression[] = []): Expression {
  return { type: "FunctionCallExpression", name, arguments: args, loc };
}

function binary(op: string, left: Expression, right: Expression): Expression {
  return { type: "BinaryExpression", operator: op, left, right, loc };
}

function unary(op: string, operand: Expression): Expression {
  return { type: "UnaryExpression", operator: op, operand, loc };
}

function postfix(op: string, operand: Expression): Expression {
  return { type: "PostfixExpression", operator: op, operand, loc };
}

function member(object: Expression, property: string): Expression {
  return { type: "MemberExpression", object, property, loc };
}

function cast(targetType: "integer" | "float" | "string" | "key" | "vector" | "rotation" | "list", expression: Expression): Expression {
  return { type: "TypeCastExpression", targetType, expression, loc };
}

function paren(expression: Expression): Expression {
  return { type: "ParenthesizedExpression", expression, loc };
}

function assign(target: Expression, value: Expression): Expression {
  return { type: "AssignmentExpression", operator: "=", target, value, loc };
}

describe("TypeTracker", () => {
  let tracker: TypeTracker;

  beforeEach(() => {
    tracker = new TypeTracker();
  });

  describe("scope management", () => {
    it("should declare and lookup variables in current scope", () => {
      tracker.declare("x", "integer");
      expect(tracker.lookup("x")).toBe("integer");
    });

    it("should return undefined for undeclared variables", () => {
      expect(tracker.lookup("nonexistent")).toBeUndefined();
    });

    it("should shadow outer scope with inner scope", () => {
      tracker.declare("x", "integer");
      tracker.pushScope();
      tracker.declare("x", "float");
      expect(tracker.lookup("x")).toBe("float");
    });

    it("should restore outer scope after pop", () => {
      tracker.declare("x", "integer");
      tracker.pushScope();
      tracker.declare("x", "float");
      tracker.popScope();
      expect(tracker.lookup("x")).toBe("integer");
    });

    it("should find outer scope variable from inner scope", () => {
      tracker.declare("x", "integer");
      tracker.pushScope();
      expect(tracker.lookup("x")).toBe("integer");
    });

    it("should not pop the global scope", () => {
      tracker.declare("x", "integer");
      tracker.popScope(); // should be a no-op
      expect(tracker.lookup("x")).toBe("integer");
    });
  });

  describe("function declaration and lookup", () => {
    it("should declare and lookup user-defined functions", () => {
      tracker.declareFunction("myFunc", "vector");
      expect(tracker.lookupFunction("myFunc")).toBe("vector");
    });

    it("should lookup built-in ll* functions", () => {
      expect(tracker.lookupFunction("llGetPos")).toBe("vector");
      expect(tracker.lookupFunction("llSay")).toBe("void");
      expect(tracker.lookupFunction("llGetOwner")).toBe("key");
      expect(tracker.lookupFunction("llStringLength")).toBe("integer");
      expect(tracker.lookupFunction("llFrand")).toBe("float");
    });

    it("should lookup built-in os* functions", () => {
      expect(tracker.lookupFunction("osNpcCreate")).toBe("key");
      expect(tracker.lookupFunction("osGetNotecard")).toBe("string");
    });

    it("should return unknown for unmapped functions", () => {
      expect(tracker.lookupFunction("unknownFunction")).toBe("unknown");
    });

    it("should prefer user-defined over built-in (unlikely but safe)", () => {
      tracker.declareFunction("llGetPos", "string"); // weird override
      expect(tracker.lookupFunction("llGetPos")).toBe("string");
    });
  });

  describe("registerGlobals", () => {
    it("should register global variables and functions from AST", () => {
      tracker.registerGlobals([
        { type: "VariableDeclaration", dataType: "integer", name: "count", initializer: null, loc },
        { type: "VariableDeclaration", dataType: "vector", name: "pos", initializer: null, loc },
        {
          type: "FunctionDeclaration",
          returnType: "string",
          name: "getLabel",
          parameters: [],
          body: [],
          loc,
        },
      ]);

      expect(tracker.lookup("count")).toBe("integer");
      expect(tracker.lookup("pos")).toBe("vector");
      expect(tracker.lookupFunction("getLabel")).toBe("string");
    });
  });

  describe("registerParameters", () => {
    it("should register parameters in the current scope", () => {
      tracker.pushScope();
      tracker.registerParameters([
        { type: "Parameter", dataType: "integer", name: "num", loc },
        { type: "Parameter", dataType: "string", name: "msg", loc },
      ]);
      expect(tracker.lookup("num")).toBe("integer");
      expect(tracker.lookup("msg")).toBe("string");
    });
  });

  describe("literal type inference", () => {
    it("should infer integer literal type", () => {
      expect(tracker.inferType(intLit(42))).toBe("integer");
    });

    it("should infer float literal type", () => {
      expect(tracker.inferType(floatLit(3.14))).toBe("float");
    });

    it("should infer string literal type", () => {
      expect(tracker.inferType(stringLit("hello"))).toBe("string");
    });

    it("should infer vector literal type", () => {
      expect(tracker.inferType(vecLit())).toBe("vector");
    });

    it("should infer rotation literal type", () => {
      expect(tracker.inferType(rotLit())).toBe("rotation");
    });

    it("should infer list literal type", () => {
      expect(tracker.inferType(listLit())).toBe("list");
    });
  });

  describe("variable type inference", () => {
    it("should infer type from declared variable", () => {
      tracker.declare("pos", "vector");
      expect(tracker.inferType(ident("pos"))).toBe("vector");
    });

    it("should return unknown for undeclared variable", () => {
      expect(tracker.inferType(ident("mystery"))).toBe("unknown");
    });
  });

  describe("function call type inference", () => {
    it("should infer return type from built-in functions", () => {
      expect(tracker.inferType(call("llGetPos"))).toBe("vector");
      expect(tracker.inferType(call("llGetRot"))).toBe("rotation");
      expect(tracker.inferType(call("llSay"))).toBe("void");
      expect(tracker.inferType(call("llGetOwner"))).toBe("key");
      expect(tracker.inferType(call("llFrand"))).toBe("float");
    });

    it("should infer return type from user-defined functions", () => {
      tracker.declareFunction("getLabel", "string");
      expect(tracker.inferType(call("getLabel"))).toBe("string");
    });
  });

  describe("member expression type inference", () => {
    it("should infer .x, .y, .z, .s as float", () => {
      tracker.declare("v", "vector");
      expect(tracker.inferType(member(ident("v"), "x"))).toBe("float");
      expect(tracker.inferType(member(ident("v"), "y"))).toBe("float");
      expect(tracker.inferType(member(ident("v"), "z"))).toBe("float");
    });

    it("should infer rotation component access as float", () => {
      tracker.declare("r", "rotation");
      expect(tracker.inferType(member(ident("r"), "s"))).toBe("float");
    });
  });

  describe("type cast inference", () => {
    it("should infer the target type of a cast", () => {
      expect(tracker.inferType(cast("integer", floatLit(3.14)))).toBe("integer");
      expect(tracker.inferType(cast("string", intLit(42)))).toBe("string");
      expect(tracker.inferType(cast("vector", stringLit("<1,2,3>")))).toBe("vector");
    });
  });

  describe("unary expression type inference", () => {
    it("should preserve type for negation", () => {
      tracker.declare("v", "vector");
      expect(tracker.inferType(unary("-", intLit(5)))).toBe("integer");
      expect(tracker.inferType(unary("-", floatLit(1.0)))).toBe("float");
      expect(tracker.inferType(unary("-", ident("v")))).toBe("vector");
    });

    it("should return integer for logical NOT", () => {
      expect(tracker.inferType(unary("!", intLit(1)))).toBe("integer");
    });

    it("should return integer for bitwise NOT", () => {
      expect(tracker.inferType(unary("~", intLit(0xFF)))).toBe("integer");
    });
  });

  describe("postfix expression type inference", () => {
    it("should preserve type for ++ and --", () => {
      tracker.declare("i", "integer");
      expect(tracker.inferType(postfix("++", ident("i")))).toBe("integer");
      expect(tracker.inferType(postfix("--", ident("i")))).toBe("integer");
    });
  });

  describe("binary expression type inference", () => {
    // --- Numeric arithmetic ---
    it("should infer integer + integer = integer", () => {
      expect(tracker.inferType(binary("+", intLit(1), intLit(2)))).toBe("integer");
    });

    it("should infer integer + float = float", () => {
      expect(tracker.inferType(binary("+", intLit(1), floatLit(2.0)))).toBe("float");
    });

    it("should infer float * float = float", () => {
      expect(tracker.inferType(binary("*", floatLit(2.0), floatLit(3.0)))).toBe("float");
    });

    it("should infer integer % integer = integer", () => {
      expect(tracker.inferType(binary("%", intLit(10), intLit(3)))).toBe("integer");
    });

    // --- Comparison operators ---
    it("should infer comparison operators as integer", () => {
      expect(tracker.inferType(binary("==", intLit(1), intLit(2)))).toBe("integer");
      expect(tracker.inferType(binary("!=", intLit(1), intLit(2)))).toBe("integer");
      expect(tracker.inferType(binary("<", intLit(1), intLit(2)))).toBe("integer");
      expect(tracker.inferType(binary(">", intLit(1), intLit(2)))).toBe("integer");
      expect(tracker.inferType(binary("<=", intLit(1), intLit(2)))).toBe("integer");
      expect(tracker.inferType(binary(">=", intLit(1), intLit(2)))).toBe("integer");
    });

    // --- Logical operators ---
    it("should infer logical operators as integer", () => {
      expect(tracker.inferType(binary("&&", intLit(1), intLit(0)))).toBe("integer");
      expect(tracker.inferType(binary("||", intLit(0), intLit(1)))).toBe("integer");
    });

    // --- Bitwise operators ---
    it("should infer bitwise operators as integer", () => {
      expect(tracker.inferType(binary("&", intLit(0xFF), intLit(0x0F)))).toBe("integer");
      expect(tracker.inferType(binary("|", intLit(1), intLit(2)))).toBe("integer");
      expect(tracker.inferType(binary("^", intLit(1), intLit(3)))).toBe("integer");
      expect(tracker.inferType(binary("<<", intLit(1), intLit(4)))).toBe("integer");
      expect(tracker.inferType(binary(">>", intLit(16), intLit(2)))).toBe("integer");
    });

    // --- String concatenation ---
    it("should infer string + anything = string", () => {
      expect(tracker.inferType(binary("+", stringLit("a"), stringLit("b")))).toBe("string");
      expect(tracker.inferType(binary("+", stringLit("count: "), intLit(5)))).toBe("string");
    });

    // --- List operations ---
    it("should infer list + anything = list", () => {
      expect(tracker.inferType(binary("+", listLit(), intLit(5)))).toBe("list");
      expect(tracker.inferType(binary("+", listLit(), listLit()))).toBe("list");
    });

    // --- Vector arithmetic ---
    it("should infer vector + vector = vector", () => {
      expect(tracker.inferType(binary("+", vecLit(), vecLit()))).toBe("vector");
    });

    it("should infer vector - vector = vector", () => {
      expect(tracker.inferType(binary("-", vecLit(), vecLit()))).toBe("vector");
    });

    it("should infer vector * vector = float (dot product)", () => {
      expect(tracker.inferType(binary("*", vecLit(), vecLit()))).toBe("float");
    });

    it("should infer vector % vector = vector (cross product)", () => {
      expect(tracker.inferType(binary("%", vecLit(), vecLit()))).toBe("vector");
    });

    it("should infer vector * scalar = vector", () => {
      expect(tracker.inferType(binary("*", vecLit(), floatLit(2.0)))).toBe("vector");
      expect(tracker.inferType(binary("*", vecLit(), intLit(3)))).toBe("vector");
    });

    it("should infer scalar * vector = vector", () => {
      expect(tracker.inferType(binary("*", floatLit(2.0), vecLit()))).toBe("vector");
    });

    it("should infer vector / scalar = vector", () => {
      expect(tracker.inferType(binary("/", vecLit(), floatLit(2.0)))).toBe("vector");
    });

    // --- Vector * rotation ---
    it("should infer vector * rotation = vector", () => {
      expect(tracker.inferType(binary("*", vecLit(), rotLit()))).toBe("vector");
    });

    // --- Rotation arithmetic ---
    it("should infer rotation * rotation = rotation", () => {
      expect(tracker.inferType(binary("*", rotLit(), rotLit()))).toBe("rotation");
    });

    it("should infer rotation / rotation = rotation", () => {
      expect(tracker.inferType(binary("/", rotLit(), rotLit()))).toBe("rotation");
    });

    // --- Mixed through variables ---
    it("should infer types through variable references", () => {
      tracker.declare("pos", "vector");
      tracker.declare("offset", "vector");
      expect(tracker.inferType(binary("+", ident("pos"), ident("offset")))).toBe("vector");
    });

    it("should infer types through function calls", () => {
      // llGetPos() returns vector, so llGetPos() + offset → vector
      tracker.declare("offset", "vector");
      expect(tracker.inferType(binary("+", call("llGetPos"), ident("offset")))).toBe("vector");
    });
  });

  describe("assignment type inference", () => {
    it("should infer assignment type from target", () => {
      tracker.declare("x", "integer");
      expect(tracker.inferType(assign(ident("x"), intLit(42)))).toBe("integer");
    });
  });

  describe("parenthesized expression type inference", () => {
    it("should pass through to inner expression", () => {
      expect(tracker.inferType(paren(intLit(42)))).toBe("integer");
      expect(tracker.inferType(paren(vecLit()))).toBe("vector");
    });
  });

  describe("getOperatorMethod", () => {
    it("should return add for vector + vector", () => {
      const result = tracker.getOperatorMethod("+", vecLit(), vecLit());
      expect(result).toEqual({ kind: "method", method: "add", on: "left" });
    });

    it("should return subtract for vector - vector", () => {
      const result = tracker.getOperatorMethod("-", vecLit(), vecLit());
      expect(result).toEqual({ kind: "method", method: "subtract", on: "left" });
    });

    it("should return dot for vector * vector", () => {
      const result = tracker.getOperatorMethod("*", vecLit(), vecLit());
      expect(result).toEqual({ kind: "method", method: "dot", on: "left" });
    });

    it("should return cross for vector % vector", () => {
      const result = tracker.getOperatorMethod("%", vecLit(), vecLit());
      expect(result).toEqual({ kind: "method", method: "cross", on: "left" });
    });

    it("should return scale for vector * scalar", () => {
      const result = tracker.getOperatorMethod("*", vecLit(), floatLit(2.0));
      expect(result).toEqual({ kind: "method", method: "scale", on: "left" });
    });

    it("should return scale on right for scalar * vector", () => {
      const result = tracker.getOperatorMethod("*", floatLit(2.0), vecLit());
      expect(result).toEqual({ kind: "method", method: "scale", on: "right" });
    });

    it("should return scale with invert for vector / scalar", () => {
      const result = tracker.getOperatorMethod("/", vecLit(), floatLit(2.0));
      expect(result).toEqual({ kind: "method", method: "scale", on: "left", invert: true });
    });

    it("should return applyRotation for vector * rotation", () => {
      const result = tracker.getOperatorMethod("*", vecLit(), rotLit());
      expect(result).toEqual({ kind: "method", method: "applyRotation", on: "left" });
    });

    it("should return multiply for rotation * rotation", () => {
      const result = tracker.getOperatorMethod("*", rotLit(), rotLit());
      expect(result).toEqual({ kind: "method", method: "multiply", on: "left" });
    });

    it("should return divide for rotation / rotation", () => {
      const result = tracker.getOperatorMethod("/", rotLit(), rotLit());
      expect(result).toEqual({ kind: "method", method: "divide", on: "left" });
    });

    it("should return null for integer + integer (native operator)", () => {
      const result = tracker.getOperatorMethod("+", intLit(1), intLit(2));
      expect(result).toBeNull();
    });

    it("should return null for string + string (native operator)", () => {
      const result = tracker.getOperatorMethod("+", stringLit("a"), stringLit("b"));
      expect(result).toBeNull();
    });

    it("should work through variable references", () => {
      tracker.declare("pos", "vector");
      tracker.declare("offset", "vector");
      const result = tracker.getOperatorMethod("+", ident("pos"), ident("offset"));
      expect(result).toEqual({ kind: "method", method: "add", on: "left" });
    });

    it("should work through function calls", () => {
      // llGetPos() returns vector
      const result = tracker.getOperatorMethod("*", call("llGetPos"), floatLit(2.0));
      expect(result).toEqual({ kind: "method", method: "scale", on: "left" });
    });
  });

  describe("getUnaryMethod", () => {
    it("should return negate for -vector", () => {
      const result = tracker.getUnaryMethod("-", vecLit());
      expect(result).toEqual({ kind: "method", method: "negate", on: "left" });
    });

    it("should return negate for -rotation", () => {
      const result = tracker.getUnaryMethod("-", rotLit());
      expect(result).toEqual({ kind: "method", method: "negate", on: "left" });
    });

    it("should return null for -integer (native operator)", () => {
      const result = tracker.getUnaryMethod("-", intLit(5));
      expect(result).toBeNull();
    });

    it("should return null for !integer (native operator)", () => {
      const result = tracker.getUnaryMethod("!", intLit(1));
      expect(result).toBeNull();
    });

    it("should work through variable references", () => {
      tracker.declare("v", "vector");
      const result = tracker.getUnaryMethod("-", ident("v"));
      expect(result).toEqual({ kind: "method", method: "negate", on: "left" });
    });
  });

  describe("built-in return type table", () => {
    it("should have a comprehensive set of built-in functions", () => {
      const count = Object.keys(BUILTIN_RETURN_TYPES).length;
      expect(count).toBeGreaterThan(200);
    });

    it("should cover all common LSL function categories", () => {
      // Communication
      expect(BUILTIN_RETURN_TYPES["llSay"]).toBe("void");
      expect(BUILTIN_RETURN_TYPES["llListen"]).toBe("integer");

      // Object
      expect(BUILTIN_RETURN_TYPES["llGetPos"]).toBe("vector");
      expect(BUILTIN_RETURN_TYPES["llGetRot"]).toBe("rotation");
      expect(BUILTIN_RETURN_TYPES["llGetKey"]).toBe("key");

      // Math
      expect(BUILTIN_RETURN_TYPES["llSin"]).toBe("float");
      expect(BUILTIN_RETURN_TYPES["llAbs"]).toBe("integer");
      expect(BUILTIN_RETURN_TYPES["llVecNorm"]).toBe("vector");
      expect(BUILTIN_RETURN_TYPES["llVecDist"]).toBe("float");

      // String
      expect(BUILTIN_RETURN_TYPES["llGetSubString"]).toBe("string");
      expect(BUILTIN_RETURN_TYPES["llStringLength"]).toBe("integer");

      // List
      expect(BUILTIN_RETURN_TYPES["llGetObjectDetails"]).toBe("list");
      expect(BUILTIN_RETURN_TYPES["llList2Vector"]).toBe("vector");

      // Agent
      expect(BUILTIN_RETURN_TYPES["llDetectedKey"]).toBe("key");
      expect(BUILTIN_RETURN_TYPES["llDetectedPos"]).toBe("vector");
    });
  });
});
