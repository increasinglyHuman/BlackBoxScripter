/**
 * LSL Type Tracker — Scope-chain type inference for operator overloading.
 *
 * LSL is statically typed but TypeScript has no operator overloading.
 * This module tracks variable types through scopes and infers expression
 * types bottom-up, so the code generator knows when to emit:
 *   vector + vector  →  left.add(right)
 *   vector * float   →  left.scale(right)
 *   rotation * rotation → left.multiply(right)
 *   etc.
 */

import type {
  Expression,
  LSLType,
  FunctionDeclaration,
  VariableDeclaration,
  Parameter,
} from "./types.js";

// ============================================================
// Built-in function return types
// ============================================================

/**
 * Return types for ll-star and os-star built-in functions.
 * Derived from LSL wiki and ll-map.ts categories.
 */
const BUILTIN_RETURN_TYPES: Record<string, LSLType> = {
  // --- Position / Rotation (vector/rotation returns) ---
  llGetPos: "vector",
  llGetLocalPos: "vector",
  llGetRootPosition: "vector",
  llGetScale: "vector",
  llGetVel: "vector",
  llGetAccel: "vector",
  llGetOmega: "vector",
  llGetForce: "vector",
  llGetTorque: "vector",
  llGetCenterOfMass: "vector",
  llGetGeometricCenter: "vector",
  llGetSunDirection: "vector",
  llGetRegionCorner: "vector",
  llGetWind: "vector",
  llGroundNormal: "vector",
  llGroundContour: "vector",
  llGroundSlope: "vector",
  llDetectedPos: "vector",
  llDetectedVel: "vector",
  llDetectedGrab: "vector",
  llDetectedTouchNormal: "vector",
  llDetectedTouchBinormal: "vector",
  llDetectedTouchPos: "vector",
  llDetectedTouchST: "vector",
  llDetectedTouchUV: "vector",

  llGetRot: "rotation",
  llGetLocalRot: "rotation",
  llGetRootRotation: "rotation",
  llDetectedRot: "rotation",
  llAxes2Rot: "rotation",
  llEuler2Rot: "rotation",
  llAxisAngle2Rot: "rotation",
  llAngleBetween: "float", // returns float, not rotation
  llRotBetween: "rotation",

  // --- Rotation / Vector math ---
  llVecDist: "float",
  llVecMag: "float",
  llVecNorm: "vector",
  llRot2Euler: "vector",
  llRot2Fwd: "vector",
  llRot2Left: "vector",
  llRot2Up: "vector",
  llRot2Axis: "vector",
  llRot2Angle: "float",

  // --- Math (scalar returns) ---
  llFrand: "float",
  llAbs: "integer",
  llFabs: "float",
  llFloor: "integer",
  llCeil: "integer",
  llRound: "integer",
  llSqrt: "float",
  llPow: "float",
  llSin: "float",
  llCos: "float",
  llTan: "float",
  llAsin: "float",
  llAcos: "float",
  llAtan2: "float",
  llLog: "float",
  llLog10: "float",
  llModPow: "integer",

  // --- String returns ---
  llGetSubString: "string",
  llDeleteSubString: "string",
  llInsertString: "string",
  llToLower: "string",
  llToUpper: "string",
  llStringTrim: "string",
  llGetObjectName: "string",
  llGetObjectDesc: "string",
  llGetRegionName: "string",
  llGetDate: "string",
  llGetTimestamp: "string",
  llKey2Name: "string",
  llGetDisplayName: "string",
  llGetUsername: "string",
  llGetScriptName: "string",
  llGetInventoryName: "string",
  llGetNotecardLine: "key", // returns dataserver query key
  llEscapeURL: "string",
  llUnescapeURL: "string",
  llMD5String: "string",
  llSHA1String: "string",
  llBase64ToString: "string",
  llStringToBase64: "string",
  llIntegerToBase64: "string",
  llBase64ToInteger: "integer",
  llList2CSV: "string",
  llDumpList2String: "string",
  llGetHTTPHeader: "string",

  // --- Key returns ---
  llGetKey: "key",
  llGetOwner: "key",
  llGetCreator: "key",
  llGetLandOwnerAt: "key",
  llGetOwnerKey: "key",
  llDetectedKey: "key",
  llDetectedOwner: "key",
  llDetectedGroup: "key",
  llGenerateKey: "key",
  llRequestAgentData: "key",
  llRequestInventoryData: "key",
  llHTTPRequest: "key",
  llRequestURL: "key",
  llRequestSecureURL: "key",
  llTransferLindenDollars: "key",

  // --- Integer returns ---
  llStringLength: "integer",
  llSubStringIndex: "integer",
  llGetListLength: "integer",
  llListFindList: "integer",
  llGetNumberOfPrims: "integer",
  llGetLinkNumber: "integer",
  llGetAttached: "integer",
  llGetFreeMemory: "integer",
  llGetUsedMemory: "integer",
  llGetInventoryType: "integer",
  llGetInventoryNumber: "integer",
  llGetNumberOfNotecardLines: "key", // returns dataserver query key
  llGetPermissions: "integer",
  llGetPermissionsKey: "key",
  llGetStatus: "integer",
  llDetectedType: "integer",
  llDetectedLinkNumber: "integer",
  llDetectedTouchFace: "integer",
  llGetAgentInfo: "integer",
  llGetRegionAgentCount: "integer",
  llGetRegionFlags: "integer",
  llGetUnixTime: "integer",
  llGetTime: "float", // returns float!
  llGround: "float",
  llGetRegionTimeDilation: "float",
  llGetRegionFPS: "float",
  llGetObjectPrimCount: "integer",
  llGetParcelFlags: "integer",
  llGetParcelMaxPrims: "integer",
  llGetParcelPrimCount: "integer",
  llOverMyLand: "integer",
  llSameGroup: "integer",
  llGetLinkNumberOfSides: "integer",
  llGetNumberOfSides: "integer",
  llGetAnimationList: "list",
  llGetObjectAnimationNames: "list",

  // --- Float returns ---
  llGetTimeOfDay: "float",
  llGetWallclock: "float",
  llGetEnergy: "float",
  llGetMass: "float",
  llGetAlpha: "float",
  llGetTextureOffset: "vector", // actually vector
  llGetTextureScale: "vector", // actually vector
  llGetTextureRot: "float",
  llWater: "float",

  // --- List returns ---
  llGetObjectDetails: "list",
  llGetPrimitiveParams: "list",
  llGetLinkPrimitiveParams: "list",
  llParseString2List: "list",
  llParseStringKeepNulls: "list",
  llCSV2List: "list",
  llList2List: "list",
  llListSort: "list",
  llListInsertList: "list",
  llDeleteSubList: "list",
  llListRandomize: "list",
  llListReplaceList: "list",
  llGetAgentList: "list",
  llCastRay: "list",
  llGetBoundingBox: "list",
  llGetStaticPath: "list",

  // --- List element extraction (type depends on content, approx.) ---
  llList2String: "string",
  llList2Integer: "integer",
  llList2Float: "float",
  llList2Key: "key",
  llList2Vector: "vector",
  llList2Rot: "rotation",

  // --- Void returns (these return nothing) ---
  llSay: "void",
  llWhisper: "void",
  llShout: "void",
  llRegionSay: "void",
  llRegionSayTo: "void",
  llOwnerSay: "void",
  llInstantMessage: "void",
  llSetPos: "void",
  llSetRot: "void",
  llSetScale: "void",
  llSetColor: "void",
  llSetAlpha: "void",
  llSetTexture: "void",
  llSetText: "void",
  llSetPrimitiveParams: "void",
  llSetLinkPrimitiveParams: "void",
  llSetLinkPrimitiveParamsFast: "void",
  llApplyImpulse: "void",
  llApplyRotationalImpulse: "void",
  llSetForce: "void",
  llSetTorque: "void",
  llSetBuoyancy: "void",
  llMoveToTarget: "void",
  llStopMoveToTarget: "void",
  llSleep: "void",
  llSetTimerEvent: "void",
  llSensor: "void",
  llSensorRepeat: "void",
  llSensorRemove: "void",
  llListen: "integer", // returns handle!
  llListenRemove: "void",
  llParticleSystem: "void",
  llPlaySound: "void",
  llLoopSound: "void",
  llStopSound: "void",
  llTriggerSound: "void",
  llDie: "void",
  llRezObject: "void",
  llRezAtRoot: "void",
  llRequestPermissions: "void",
  llStartAnimation: "void",
  llStopAnimation: "void",
  llDialog: "void",
  llGiveInventory: "void",
  llGiveInventoryList: "void",
  llSetSitText: "void",
  llSitTarget: "void",
  llSetTouchText: "void",
  llTakeControls: "void",
  llReleaseControls: "void",
  llSetStatus: "void",
  llSetObjectName: "void",
  llSetObjectDesc: "void",
  llMessageLinked: "void",
  llLoadURL: "void",
  llMapDestination: "void",
  llTeleportAgentHome: "void",
  llSetPayPrice: "void",
  llRemoveInventory: "void",
  llBreakLink: "void",
  llBreakAllLinks: "void",
  llCreateLink: "void",
  llSetLinkTexture: "void",
  llSetLinkColor: "void",
  llSetLinkAlpha: "void",
  llLookAt: "void",
  llStopLookAt: "void",
  llRotLookAt: "void",
  llTarget: "integer", // returns handle
  llTargetRemove: "void",
  llSetDamage: "void",
  llCollisionFilter: "void",
  llSetClickAction: "void",
  llSetContentType: "void",
  llHTTPResponse: "void",
  llSetKeyframedMotion: "void",

  // --- OSSL ---
  osNpcCreate: "key",
  osNpcRemove: "void",
  osNpcMoveTo: "void",
  osNpcSay: "void",
  osNpcSit: "void",
  osNpcStand: "void",
  osNpcPlayAnimation: "void",
  osNpcStopAnimation: "void",
  osNpcSetRot: "void",
  osGetNotecard: "string",
  osTeleportAgent: "void",
  osSetDynamicTextureURL: "void",
  osParseJSON: "string",
  osSetTerrainHeight: "void",
  osTerrainFlush: "void",
  osGetGridName: "string",
  osGetGridNick: "string",
  osGetGridLoginURI: "string",
  osGetSimulatorVersion: "string",
  osIsNpc: "integer",
  osNpcGetPos: "vector",
  osNpcGetRot: "rotation",
  osNpcGetOwner: "key",
};

// ============================================================
// Scope and Type Tracker
// ============================================================

/** A single scope level — holds declared variable types */
interface Scope {
  /** Variable name → LSL type */
  vars: Map<string, LSLType>;
  /** Function name → return type (only in global scope) */
  functions: Map<string, LSLType>;
}

export class TypeTracker {
  /** Scope stack: index 0 = global, deeper = function/event local */
  private scopes: Scope[] = [];

  constructor() {
    this.pushScope(); // global scope
  }

  // === Scope management ===

  /** Push a new scope (entering a function or event handler) */
  pushScope(): void {
    this.scopes.push({ vars: new Map(), functions: new Map() });
  }

  /** Pop the current scope (exiting a function or event handler) */
  popScope(): void {
    if (this.scopes.length > 1) {
      this.scopes.pop();
    }
  }

  /** Get the current (innermost) scope */
  private currentScope(): Scope {
    return this.scopes[this.scopes.length - 1];
  }

  // === Declaration ===

  /** Declare a variable with its type in the current scope */
  declare(name: string, type: LSLType): void {
    this.currentScope().vars.set(name, type);
  }

  /** Declare a user-defined function's return type (always in global scope) */
  declareFunction(name: string, returnType: LSLType): void {
    this.scopes[0].functions.set(name, returnType);
  }

  /** Register all globals and functions from an AST before code generation */
  registerGlobals(globals: (VariableDeclaration | FunctionDeclaration)[]): void {
    for (const decl of globals) {
      if (decl.type === "VariableDeclaration") {
        this.declare(decl.name, decl.dataType);
      } else if (decl.type === "FunctionDeclaration") {
        this.declareFunction(decl.name, decl.returnType ?? "void");
        // Also register parameters so we know their types when referenced
        // (but parameters live in the function's scope, handled at emit time)
      }
    }
  }

  /** Register function/event parameters in the current scope */
  registerParameters(params: Parameter[]): void {
    for (const p of params) {
      this.declare(p.name, p.dataType);
    }
  }

  // === Lookup ===

  /** Look up a variable's type through the scope chain */
  lookup(name: string): LSLType | undefined {
    // Search from innermost to outermost scope
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const type = this.scopes[i].vars.get(name);
      if (type !== undefined) return type;
    }
    return undefined;
  }

  /** Look up a function's return type (user-defined or built-in) */
  lookupFunction(name: string): LSLType {
    // User-defined functions (in global scope)
    const userType = this.scopes[0].functions.get(name);
    if (userType !== undefined) return userType;

    // Built-in ll*/os* functions
    const builtinType = BUILTIN_RETURN_TYPES[name];
    if (builtinType !== undefined) return builtinType;

    return "unknown";
  }

  // === Expression type inference ===

  /** Infer the LSL type of an expression, bottom-up */
  inferType(expr: Expression): LSLType {
    switch (expr.type) {
      case "IntegerLiteral":
        return "integer";

      case "FloatLiteral":
        return "float";

      case "StringLiteral":
        return "string";

      case "VectorLiteral":
        return "vector";

      case "RotationLiteral":
        return "rotation";

      case "ListLiteral":
        return "list";

      case "IdentifierExpression":
        return this.lookup(expr.name) ?? "unknown";

      case "FunctionCallExpression":
        return this.lookupFunction(expr.name);

      case "MemberExpression":
        // vector.x, vector.y, vector.z → float
        // rotation.x, rotation.y, rotation.z, rotation.s → float
        return "float";

      case "TypeCastExpression":
        return expr.targetType;

      case "UnaryExpression":
        return this.inferUnaryType(expr.operator, expr.operand);

      case "PostfixExpression":
        // ++ / -- preserve type
        return this.inferType(expr.operand);

      case "BinaryExpression":
        return this.inferBinaryType(expr.operator, expr.left, expr.right);

      case "AssignmentExpression":
        // Assignment result type = target type
        return this.inferType(expr.target);

      case "ParenthesizedExpression":
        return this.inferType(expr.expression);

      default:
        return "unknown";
    }
  }

  /** Infer unary expression type */
  private inferUnaryType(operator: string, operand: Expression): LSLType {
    const type = this.inferType(operand);

    switch (operator) {
      case "-":
        // -integer → integer, -float → float, -vector → vector, -rotation → rotation
        return type;
      case "!":
        // Logical NOT → always integer (LSL boolean)
        return "integer";
      case "~":
        // Bitwise NOT → integer
        return "integer";
      case "++":
      case "--":
        // Pre-increment/decrement preserves type
        return type;
      default:
        return type;
    }
  }

  /** Infer binary expression type from operator and operand types */
  private inferBinaryType(operator: string, left: Expression, right: Expression): LSLType {
    const leftType = this.inferType(left);
    const rightType = this.inferType(right);

    // Comparison and logical operators always return integer (LSL boolean)
    if (["==", "!=", "<", ">", "<=", ">=", "&&", "||"].includes(operator)) {
      return "integer";
    }

    // Bitwise operators always return integer
    if (["&", "|", "^", "<<", ">>"].includes(operator)) {
      return "integer";
    }

    // String concatenation
    if (operator === "+" && (leftType === "string" || rightType === "string")) {
      return "string";
    }

    // List operations
    if (leftType === "list" || rightType === "list") {
      if (operator === "+") return "list";
      return "list";
    }

    // Vector arithmetic
    if (leftType === "vector" && rightType === "vector") {
      switch (operator) {
        case "+": case "-": return "vector";
        case "*": return "float"; // dot product
        case "%": return "vector"; // cross product
        default: return "unknown";
      }
    }

    // Vector * scalar and scalar * vector
    if (leftType === "vector" && (rightType === "integer" || rightType === "float")) {
      if (["+", "-", "*", "/"].includes(operator)) return "vector";
    }
    if ((leftType === "integer" || leftType === "float") && rightType === "vector") {
      if (operator === "*") return "vector";
    }

    // Vector * rotation (rotate vector by rotation)
    if (leftType === "vector" && rightType === "rotation") {
      if (operator === "*") return "vector";
    }

    // Rotation arithmetic
    if (leftType === "rotation" && rightType === "rotation") {
      switch (operator) {
        case "*": case "/": return "rotation";
        case "+": case "-": return "rotation";
        default: return "unknown";
      }
    }

    // Numeric arithmetic
    if (
      (leftType === "integer" || leftType === "float") &&
      (rightType === "integer" || rightType === "float")
    ) {
      switch (operator) {
        case "+": case "-": case "*": case "/":
          // Float wins over integer
          return (leftType === "float" || rightType === "float") ? "float" : "integer";
        case "%":
          return "integer"; // LSL modulo is always integer
        default:
          return "unknown";
      }
    }

    // Key comparisons return integer but that's handled above

    return "unknown";
  }

  // === Operator overload queries ===

  /**
   * Determine if a binary expression needs operator method calls
   * instead of native JS operators.
   *
   * Returns the method to call, or null if native operator is fine.
   */
  getOperatorMethod(
    operator: string,
    left: Expression,
    right: Expression
  ): OperatorOverload | null {
    const leftType = this.inferType(left);
    const rightType = this.inferType(right);

    // Vector operations
    if (leftType === "vector" && rightType === "vector") {
      switch (operator) {
        case "+": return { kind: "method", method: "add", on: "left" };
        case "-": return { kind: "method", method: "subtract", on: "left" };
        case "*": return { kind: "method", method: "dot", on: "left" };
        case "%": return { kind: "method", method: "cross", on: "left" };
        default: return null;
      }
    }

    // Vector * scalar → left.scale(right)
    if (leftType === "vector" && (rightType === "integer" || rightType === "float")) {
      if (operator === "*") return { kind: "method", method: "scale", on: "left" };
      if (operator === "/") return { kind: "method", method: "scale", on: "left", invert: true };
    }

    // Scalar * vector → right.scale(left)
    if ((leftType === "integer" || leftType === "float") && rightType === "vector") {
      if (operator === "*") return { kind: "method", method: "scale", on: "right" };
    }

    // Vector * rotation → left.applyRotation(right)
    if (leftType === "vector" && rightType === "rotation") {
      if (operator === "*") return { kind: "method", method: "applyRotation", on: "left" };
      if (operator === "/") return { kind: "method", method: "applyRotation", on: "left", invert: true };
    }

    // Rotation * rotation
    if (leftType === "rotation" && rightType === "rotation") {
      switch (operator) {
        case "*": return { kind: "method", method: "multiply", on: "left" };
        case "/": return { kind: "method", method: "divide", on: "left" };
        default: return null;
      }
    }

    // Unary negate for vectors/rotations is handled in getUnaryMethod

    return null; // Use native JS operator
  }

  /**
   * Determine if a unary expression needs a method call.
   */
  getUnaryMethod(operator: string, operand: Expression): OperatorOverload | null {
    const type = this.inferType(operand);

    if (operator === "-") {
      if (type === "vector") return { kind: "method", method: "negate", on: "left" };
      if (type === "rotation") return { kind: "method", method: "negate", on: "left" };
    }

    return null; // Use native JS operator
  }
}

/** Describes how to emit an overloaded operator */
export interface OperatorOverload {
  kind: "method";
  /** Method name to call (e.g., "add", "scale", "dot") */
  method: string;
  /** Which operand has the method ("left" or "right") */
  on: "left" | "right";
  /** For division: emit 1/right as the scale factor */
  invert?: boolean;
}

/** Expose for testing */
export { BUILTIN_RETURN_TYPES };
