/**
 * Tests for the LSL Lexer.
 */

import { describe, it, expect } from "vitest";
import { tokenize } from "./lexer.js";
import { TokenType } from "./types.js";

describe("LSL Lexer", () => {
  describe("keywords", () => {
    it("should recognize type keywords", () => {
      const tokens = tokenize("integer float string key vector rotation list");
      expect(tokens.map((t) => t.type)).toEqual([
        TokenType.KW_Integer,
        TokenType.KW_Float,
        TokenType.KW_String,
        TokenType.KW_Key,
        TokenType.KW_Vector,
        TokenType.KW_Rotation,
        TokenType.KW_List,
        TokenType.EOF,
      ]);
    });

    it("should recognize control keywords", () => {
      const tokens = tokenize("if else for while do jump return state default");
      expect(tokens.map((t) => t.type)).toEqual([
        TokenType.KW_If,
        TokenType.KW_Else,
        TokenType.KW_For,
        TokenType.KW_While,
        TokenType.KW_Do,
        TokenType.KW_Jump,
        TokenType.KW_Return,
        TokenType.KW_State,
        TokenType.KW_Default,
        TokenType.EOF,
      ]);
    });

    it("should treat quaternion as rotation alias", () => {
      const tokens = tokenize("quaternion");
      expect(tokens[0].type).toBe(TokenType.KW_Rotation);
    });
  });

  describe("identifiers", () => {
    it("should tokenize simple identifiers", () => {
      const tokens = tokenize("foo bar_baz _private myVar123");
      expect(tokens.filter((t) => t.type === TokenType.Identifier).map((t) => t.value)).toEqual([
        "foo",
        "bar_baz",
        "_private",
        "myVar123",
      ]);
    });

    it("should distinguish identifiers from keywords", () => {
      const tokens = tokenize("integer myInteger");
      expect(tokens[0].type).toBe(TokenType.KW_Integer);
      expect(tokens[1].type).toBe(TokenType.Identifier);
    });

    it("should recognize common LSL constants as identifiers", () => {
      const tokens = tokenize("TRUE FALSE NULL_KEY ZERO_VECTOR PI LINK_SET");
      for (const t of tokens.filter((t) => t.type !== TokenType.EOF)) {
        expect(t.type).toBe(TokenType.Identifier);
      }
    });
  });

  describe("numbers", () => {
    it("should tokenize integers", () => {
      const tokens = tokenize("0 42 100 999");
      const ints = tokens.filter((t) => t.type === TokenType.IntegerLiteral);
      expect(ints.map((t) => t.value)).toEqual(["0", "42", "100", "999"]);
    });

    it("should tokenize hex literals", () => {
      const tokens = tokenize("0xFF 0x1A 0X00");
      const ints = tokens.filter((t) => t.type === TokenType.IntegerLiteral);
      expect(ints.map((t) => t.value)).toEqual(["255", "26", "0"]);
    });

    it("should tokenize float literals", () => {
      const tokens = tokenize("1.0 3.14 0.5");
      const floats = tokens.filter((t) => t.type === TokenType.FloatLiteral);
      expect(floats.map((t) => t.value)).toEqual(["1.0", "3.14", "0.5"]);
    });

    it("should tokenize .5 (no leading zero)", () => {
      const tokens = tokenize(".5");
      expect(tokens[0].type).toBe(TokenType.FloatLiteral);
      expect(tokens[0].value).toBe(".5");
    });

    it("should tokenize 1. (no trailing digit)", () => {
      const tokens = tokenize("1.");
      expect(tokens[0].type).toBe(TokenType.FloatLiteral);
      expect(tokens[0].value).toBe("1.");
    });

    it("should tokenize scientific notation", () => {
      const tokens = tokenize("1.5e10 2E-3");
      expect(tokens[0].type).toBe(TokenType.FloatLiteral);
      expect(tokens[1].type).toBe(TokenType.FloatLiteral);
    });
  });

  describe("strings", () => {
    it("should tokenize simple strings", () => {
      const tokens = tokenize('"Hello World"');
      expect(tokens[0].type).toBe(TokenType.StringLiteral);
      expect(tokens[0].value).toBe("Hello World");
    });

    it("should handle escape sequences", () => {
      const tokens = tokenize('"line1\\nline2\\ttab\\\\"');
      expect(tokens[0].value).toBe("line1\nline2\ttab\\");
    });

    it("should handle escaped quotes", () => {
      const tokens = tokenize('"say \\"hello\\""');
      expect(tokens[0].value).toBe('say "hello"');
    });

    it("should handle empty string", () => {
      const tokens = tokenize('""');
      expect(tokens[0].type).toBe(TokenType.StringLiteral);
      expect(tokens[0].value).toBe("");
    });

    it("should throw on unterminated string", () => {
      expect(() => tokenize('"unterminated')).toThrow("Unterminated string");
    });
  });

  describe("operators", () => {
    it("should tokenize arithmetic operators", () => {
      const tokens = tokenize("+ - * / %");
      expect(tokens.map((t) => t.type).slice(0, 5)).toEqual([
        TokenType.Plus,
        TokenType.Minus,
        TokenType.Star,
        TokenType.Slash,
        TokenType.Percent,
      ]);
    });

    it("should tokenize compound assignment", () => {
      const tokens = tokenize("+= -= *= /= %=");
      expect(tokens.map((t) => t.type).slice(0, 5)).toEqual([
        TokenType.PlusAssign,
        TokenType.MinusAssign,
        TokenType.StarAssign,
        TokenType.SlashAssign,
        TokenType.PercentAssign,
      ]);
    });

    it("should tokenize comparison operators", () => {
      const tokens = tokenize("< > <= >= == !=");
      expect(tokens.map((t) => t.type).slice(0, 6)).toEqual([
        TokenType.LeftAngle,
        TokenType.RightAngle,
        TokenType.LessEqual,
        TokenType.GreaterEqual,
        TokenType.Equal,
        TokenType.NotEqual,
      ]);
    });

    it("should tokenize logical operators", () => {
      const tokens = tokenize("&& || !");
      expect(tokens.map((t) => t.type).slice(0, 3)).toEqual([
        TokenType.And,
        TokenType.Or,
        TokenType.Not,
      ]);
    });

    it("should tokenize bitwise operators", () => {
      const tokens = tokenize("& | ^ ~ << >>");
      expect(tokens.map((t) => t.type).slice(0, 6)).toEqual([
        TokenType.BitwiseAnd,
        TokenType.BitwiseOr,
        TokenType.BitwiseXor,
        TokenType.BitwiseNot,
        TokenType.ShiftLeft,
        TokenType.ShiftRight,
      ]);
    });

    it("should tokenize increment/decrement", () => {
      const tokens = tokenize("++ --");
      expect(tokens[0].type).toBe(TokenType.Increment);
      expect(tokens[1].type).toBe(TokenType.Decrement);
    });

    it("should tokenize bitwise assign operators", () => {
      const tokens = tokenize("&= |= ^= <<= >>=");
      expect(tokens.map((t) => t.type).slice(0, 5)).toEqual([
        TokenType.BitwiseAndAssign,
        TokenType.BitwiseOrAssign,
        TokenType.BitwiseXorAssign,
        TokenType.ShiftLeftAssign,
        TokenType.ShiftRightAssign,
      ]);
    });
  });

  describe("punctuation", () => {
    it("should tokenize all punctuation", () => {
      const tokens = tokenize("( ) { } [ ] ; , @ .");
      expect(tokens.map((t) => t.type).slice(0, 10)).toEqual([
        TokenType.LeftParen,
        TokenType.RightParen,
        TokenType.LeftBrace,
        TokenType.RightBrace,
        TokenType.LeftBracket,
        TokenType.RightBracket,
        TokenType.Semicolon,
        TokenType.Comma,
        TokenType.At,
        TokenType.Dot,
      ]);
    });
  });

  describe("comments", () => {
    it("should strip single-line comments", () => {
      const tokens = tokenize("integer x; // this is a comment\ninteger y;");
      const idents = tokens.filter(
        (t) => t.type === TokenType.Identifier
      );
      expect(idents.map((t) => t.value)).toEqual(["x", "y"]);
    });

    it("should strip multi-line comments", () => {
      const tokens = tokenize("integer x; /* multi\nline\ncomment */ integer y;");
      const idents = tokens.filter(
        (t) => t.type === TokenType.Identifier
      );
      expect(idents.map((t) => t.value)).toEqual(["x", "y"]);
    });

    it("should handle //** comment style (common in LSL)", () => {
      const tokens = tokenize('//** This is a comment **//\ninteger x;');
      expect(tokens[0].type).toBe(TokenType.KW_Integer);
    });

    it("should tolerate unterminated multi-line comment at EOF", () => {
      // LSL compilers accept unterminated block comments — treat as comment to EOF
      const tokens = tokenize("integer x;\n/* unterminated");
      expect(tokens[0].type).toBe(TokenType.KW_Integer);
      expect(tokens.length).toBe(4); // integer, x, ;, EOF
    });
  });

  describe("line tracking", () => {
    it("should track line and column", () => {
      const tokens = tokenize("integer x;\ninteger y;");
      const yToken = tokens.find((t) => t.value === "y");
      expect(yToken?.loc.line).toBe(2);
    });
  });

  describe("real LSL patterns", () => {
    it("should tokenize llSay call", () => {
      const tokens = tokenize('llSay( 0, "Hello World");');
      expect(tokens[0]).toMatchObject({ type: TokenType.Identifier, value: "llSay" });
      expect(tokens[1]).toMatchObject({ type: TokenType.LeftParen });
      expect(tokens[2]).toMatchObject({ type: TokenType.IntegerLiteral, value: "0" });
      expect(tokens[3]).toMatchObject({ type: TokenType.Comma });
      expect(tokens[4]).toMatchObject({ type: TokenType.StringLiteral, value: "Hello World" });
      expect(tokens[5]).toMatchObject({ type: TokenType.RightParen });
      expect(tokens[6]).toMatchObject({ type: TokenType.Semicolon });
    });

    it("should tokenize vector literal", () => {
      const tokens = tokenize("<1.0, 2.0, 3.0>");
      expect(tokens.map((t) => t.type)).toEqual([
        TokenType.LeftAngle,
        TokenType.FloatLiteral,
        TokenType.Comma,
        TokenType.FloatLiteral,
        TokenType.Comma,
        TokenType.FloatLiteral,
        TokenType.RightAngle,
        TokenType.EOF,
      ]);
    });

    it("should tokenize type cast", () => {
      const tokens = tokenize("(integer)x");
      expect(tokens[0].type).toBe(TokenType.LeftParen);
      expect(tokens[1].type).toBe(TokenType.KW_Integer);
      expect(tokens[2].type).toBe(TokenType.RightParen);
      expect(tokens[3].type).toBe(TokenType.Identifier);
    });

    it("should tokenize state block", () => {
      const tokens = tokenize("default { state_entry() { } }");
      expect(tokens[0]).toMatchObject({ type: TokenType.KW_Default });
      expect(tokens[1]).toMatchObject({ type: TokenType.LeftBrace });
      expect(tokens[2]).toMatchObject({ type: TokenType.Identifier, value: "state_entry" });
    });

    it("should tokenize bitwise OR in particle flags", () => {
      const tokens = tokenize("PSYS_PART_INTERP_COLOR_MASK | PSYS_PART_EMISSIVE_MASK");
      expect(tokens[0]).toMatchObject({ type: TokenType.Identifier, value: "PSYS_PART_INTERP_COLOR_MASK" });
      expect(tokens[1]).toMatchObject({ type: TokenType.BitwiseOr });
      expect(tokens[2]).toMatchObject({ type: TokenType.Identifier, value: "PSYS_PART_EMISSIVE_MASK" });
    });

    it("should tokenize DefaultScript.lsl pattern", () => {
      const source = `default
{
    state_entry()
    {
        llSay( 0, "Script running");
    }
}`;
      const tokens = tokenize(source);
      expect(tokens[0]).toMatchObject({ type: TokenType.KW_Default });
      expect(tokens[1]).toMatchObject({ type: TokenType.LeftBrace });
      expect(tokens[2]).toMatchObject({ type: TokenType.Identifier, value: "state_entry" });
      const lastReal = tokens[tokens.length - 2];
      expect(lastReal.type).toBe(TokenType.RightBrace);
    });
  });
});
