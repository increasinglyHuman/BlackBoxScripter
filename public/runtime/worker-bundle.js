/* Worker Bundle — Black Box Scripter v0.5.0 */
/* Includes: SES (Hardened JavaScript), acorn, astring */
/* Load with: new Worker(url, { type: 'module' }) */


// node_modules/ses/src/commons.js
var universalThis = globalThis;
var {
  Array,
  ArrayBuffer,
  Date: Date2,
  FinalizationRegistry,
  Float32Array,
  JSON: JSON2,
  Map: Map2,
  Math: Math2,
  Number: Number2,
  Object: Object2,
  Promise: Promise2,
  Proxy: Proxy2,
  Reflect: Reflect2,
  RegExp: FERAL_REG_EXP,
  Set,
  String: String2,
  Symbol: Symbol2,
  Uint8Array,
  WeakMap,
  WeakSet
} = globalThis;
var {
  // The feral Error constructor is safe for internal use, but must not be
  // revealed to post-lockdown code in any compartment including the start
  // compartment since in V8 at least it bears stack inspection capabilities.
  Error: FERAL_ERROR,
  RangeError: RangeError2,
  ReferenceError: ReferenceError2,
  SyntaxError: SyntaxError2,
  TypeError: TypeError2,
  AggregateError: AggregateError2
} = globalThis;
var {
  assign,
  create,
  defineProperties,
  entries,
  freeze,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getOwnPropertyNames,
  getPrototypeOf,
  is,
  isFrozen,
  isSealed,
  isExtensible,
  keys,
  prototype: objectPrototype,
  seal,
  preventExtensions,
  setPrototypeOf,
  values,
  fromEntries,
  hasOwn
} = Object2;
var {
  species: speciesSymbol,
  toStringTag: toStringTagSymbol,
  iterator: iteratorSymbol,
  matchAll: matchAllSymbol,
  unscopables: unscopablesSymbol,
  keyFor: symbolKeyFor,
  for: symbolFor
} = Symbol2;
var { isInteger } = Number2;
var { stringify: stringifyJson } = JSON2;
var { defineProperty: originalDefineProperty } = Object2;
var defineProperty = (object, prop, descriptor) => {
  const result = originalDefineProperty(object, prop, descriptor);
  if (result !== object) {
    throw TypeError2(
      `Please report that the original defineProperty silently failed to set ${stringifyJson(
        String2(prop)
      )}. (SES_DEFINE_PROPERTY_FAILED_SILENTLY)`
    );
  }
  return result;
};
var {
  apply,
  construct,
  get: reflectGet,
  getOwnPropertyDescriptor: reflectGetOwnPropertyDescriptor,
  has: reflectHas,
  isExtensible: reflectIsExtensible,
  ownKeys,
  preventExtensions: reflectPreventExtensions,
  set: reflectSet
} = Reflect2;
var { isArray, prototype: arrayPrototype } = Array;
var { prototype: arrayBufferPrototype } = ArrayBuffer;
var { prototype: mapPrototype } = Map2;
var { revocable: proxyRevocable } = Proxy2;
var { prototype: regexpPrototype } = RegExp;
var { prototype: setPrototype } = Set;
var { prototype: stringPrototype } = String2;
var { prototype: weakmapPrototype } = WeakMap;
var { prototype: weaksetPrototype } = WeakSet;
var { prototype: functionPrototype } = Function;
var { prototype: promisePrototype } = Promise2;
var { prototype: generatorPrototype } = getPrototypeOf(
  // eslint-disable-next-line no-empty-function, func-names
  function* () {
  }
);
var iteratorPrototype = getPrototypeOf(
  // eslint-disable-next-line @endo/no-polymorphic-call
  getPrototypeOf(arrayPrototype.values())
);
var typedArrayPrototype = getPrototypeOf(Uint8Array.prototype);
var { bind } = functionPrototype;
var uncurryThis = bind.bind(bind.call);
var arrayFilter = uncurryThis(arrayPrototype.filter);
var arrayForEach = uncurryThis(arrayPrototype.forEach);
var arrayIncludes = uncurryThis(arrayPrototype.includes);
var arrayJoin = uncurryThis(arrayPrototype.join);
var arrayMap = (
  /** @type {any} */
  uncurryThis(arrayPrototype.map)
);
var arrayFlatMap = (
  /** @type {any} */
  uncurryThis(arrayPrototype.flatMap)
);
var arrayPop = uncurryThis(arrayPrototype.pop);
var arrayPush = uncurryThis(arrayPrototype.push);
var arraySlice = uncurryThis(arrayPrototype.slice);
var arraySome = uncurryThis(arrayPrototype.some);
var arraySort = uncurryThis(arrayPrototype.sort);
var iterateArray = uncurryThis(arrayPrototype[iteratorSymbol]);
var arrayBufferSlice = uncurryThis(arrayBufferPrototype.slice);
var arrayBufferGetByteLength = uncurryThis(
  // @ts-expect-error we know it is there on all conforming platforms
  getOwnPropertyDescriptor(arrayBufferPrototype, "byteLength").get
);
var typedArraySet = uncurryThis(typedArrayPrototype.set);
var mapSet = uncurryThis(mapPrototype.set);
var mapGet = uncurryThis(mapPrototype.get);
var mapHas = uncurryThis(mapPrototype.has);
var mapDelete = uncurryThis(mapPrototype.delete);
var mapEntries = uncurryThis(mapPrototype.entries);
var iterateMap = uncurryThis(mapPrototype[iteratorSymbol]);
var setAdd = uncurryThis(setPrototype.add);
var setDelete = uncurryThis(setPrototype.delete);
var setForEach = uncurryThis(setPrototype.forEach);
var setHas = uncurryThis(setPrototype.has);
var iterateSet = uncurryThis(setPrototype[iteratorSymbol]);
var regexpTest = uncurryThis(regexpPrototype.test);
var regexpExec = uncurryThis(regexpPrototype.exec);
var matchAllRegExp = uncurryThis(regexpPrototype[matchAllSymbol]);
var stringEndsWith = uncurryThis(stringPrototype.endsWith);
var stringIncludes = uncurryThis(stringPrototype.includes);
var stringIndexOf = uncurryThis(stringPrototype.indexOf);
var stringMatch = uncurryThis(stringPrototype.match);
var generatorNext = uncurryThis(generatorPrototype.next);
var generatorThrow = uncurryThis(generatorPrototype.throw);
var stringReplace = (
  /** @type {any} */
  uncurryThis(stringPrototype.replace)
);
var stringSearch = uncurryThis(stringPrototype.search);
var stringSlice = uncurryThis(stringPrototype.slice);
var stringSplit = (
  /** @type {(thisArg: string, splitter: string | RegExp | { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number) => string[]} */
  uncurryThis(stringPrototype.split)
);
var stringStartsWith = uncurryThis(stringPrototype.startsWith);
var iterateString = uncurryThis(stringPrototype[iteratorSymbol]);
var weakmapDelete = uncurryThis(weakmapPrototype.delete);
var weakmapGet = uncurryThis(weakmapPrototype.get);
var weakmapHas = uncurryThis(weakmapPrototype.has);
var weakmapSet = uncurryThis(weakmapPrototype.set);
var weaksetAdd = uncurryThis(weaksetPrototype.add);
var weaksetHas = uncurryThis(weaksetPrototype.has);
var functionToString = uncurryThis(functionPrototype.toString);
var functionBind = uncurryThis(bind);
var { all } = Promise2;
var promiseCatch = uncurryThis(promisePrototype.catch);
var promiseThen = (
  /** @type {any} */
  uncurryThis(promisePrototype.then)
);
var finalizationRegistryRegister = FinalizationRegistry && uncurryThis(FinalizationRegistry.prototype.register);
var finalizationRegistryUnregister = FinalizationRegistry && uncurryThis(FinalizationRegistry.prototype.unregister);
var isPrimitive = (val) => !val || typeof val !== "object" && typeof val !== "function";
var isError = (value) => value instanceof FERAL_ERROR;
var identity = (x) => x;
var FERAL_EVAL = eval;
var FERAL_FUNCTION = Function;
var noEvalEvaluate = () => {
  throw TypeError2('Cannot eval with evalTaming set to "no-eval" (SES_NO_EVAL)');
};
var er1StackDesc = getOwnPropertyDescriptor(Error("er1"), "stack");
var er2StackDesc = getOwnPropertyDescriptor(TypeError2("er2"), "stack");
var feralStackGetter;
var feralStackSetter;
if (er1StackDesc && er2StackDesc && er1StackDesc.get) {
  if (
    // In the v8 case as we understand it, all errors have an own stack
    // accessor property, but within the same realm, all these accessor
    // properties have the same getter and have the same setter.
    // This is therefore the case that we repair.
    typeof er1StackDesc.get === "function" && er1StackDesc.get === er2StackDesc.get && typeof er1StackDesc.set === "function" && er1StackDesc.set === er2StackDesc.set
  ) {
    feralStackGetter = freeze(er1StackDesc.get);
    feralStackSetter = freeze(er1StackDesc.set);
  } else {
    throw TypeError2(
      "Unexpected Error own stack accessor functions (SES_UNEXPECTED_ERROR_OWN_STACK_ACCESSOR)"
    );
  }
}
var FERAL_STACK_GETTER = feralStackGetter;
var FERAL_STACK_SETTER = feralStackSetter;
var getAsyncGeneratorFunctionInstance = () => {
  try {
    return new FERAL_FUNCTION(
      "return (async function* AsyncGeneratorFunctionInstance() {})"
    )();
  } catch (error) {
    if (error.name === "SyntaxError") {
      return void 0;
    } else if (error.name === "EvalError") {
      return async function* AsyncGeneratorFunctionInstance2() {
      };
    } else {
      throw error;
    }
  }
};
var AsyncGeneratorFunctionInstance = getAsyncGeneratorFunctionInstance();

// node_modules/ses/src/assert-sloppy-mode.js
function getThis() {
  return this;
}
if (getThis()) {
  throw TypeError2(`SES failed to initialize, sloppy mode (SES_NO_SLOPPY)`);
}

// node_modules/@endo/env-options/src/env-options.js
var localThis = globalThis;
var { Object: Object3, Reflect: Reflect3, Array: Array2, String: String3, JSON: JSON3, Error: Error2 } = localThis;
var { freeze: freeze2 } = Object3;
var { apply: apply2 } = Reflect3;
var uncurryThis2 = (fn2) => (receiver, ...args) => apply2(fn2, receiver, args);
var arrayPush2 = uncurryThis2(Array2.prototype.push);
var arrayIncludes2 = uncurryThis2(Array2.prototype.includes);
var stringSplit2 = uncurryThis2(String3.prototype.split);
var q = JSON3.stringify;
var Fail = (literals, ...args) => {
  let msg = literals[0];
  for (let i = 0; i < args.length; i += 1) {
    msg = `${msg}${args[i]}${literals[i + 1]}`;
  }
  throw Error2(msg);
};
var makeEnvironmentCaptor = (aGlobal, dropNames = false) => {
  const capturedEnvironmentOptionNames = [];
  const getEnvironmentOption2 = (optionName, defaultSetting, optOtherValues = void 0) => {
    typeof optionName === "string" || Fail`Environment option name ${q(optionName)} must be a string.`;
    typeof defaultSetting === "string" || Fail`Environment option default setting ${q(
      defaultSetting
    )} must be a string.`;
    let setting = defaultSetting;
    const globalProcess = aGlobal.process || void 0;
    const globalEnv = typeof globalProcess === "object" && globalProcess.env || void 0;
    if (typeof globalEnv === "object") {
      if (optionName in globalEnv) {
        if (!dropNames) {
          arrayPush2(capturedEnvironmentOptionNames, optionName);
        }
        const optionValue = globalEnv[optionName];
        typeof optionValue === "string" || Fail`Environment option named ${q(
          optionName
        )}, if present, must have a corresponding string value, got ${q(
          optionValue
        )}`;
        setting = optionValue;
      }
    }
    optOtherValues === void 0 || setting === defaultSetting || arrayIncludes2(optOtherValues, setting) || Fail`Unrecognized ${q(optionName)} value ${q(
      setting
    )}. Expected one of ${q([defaultSetting, ...optOtherValues])}`;
    return setting;
  };
  freeze2(getEnvironmentOption2);
  const getEnvironmentOptionsList2 = (optionName) => {
    const option = getEnvironmentOption2(optionName, "");
    return freeze2(option === "" ? [] : stringSplit2(option, ","));
  };
  freeze2(getEnvironmentOptionsList2);
  const environmentOptionsListHas2 = (optionName, element) => arrayIncludes2(getEnvironmentOptionsList2(optionName), element);
  const getCapturedEnvironmentOptionNames = () => {
    return freeze2([...capturedEnvironmentOptionNames]);
  };
  freeze2(getCapturedEnvironmentOptionNames);
  return freeze2({
    getEnvironmentOption: getEnvironmentOption2,
    getEnvironmentOptionsList: getEnvironmentOptionsList2,
    environmentOptionsListHas: environmentOptionsListHas2,
    getCapturedEnvironmentOptionNames
  });
};
freeze2(makeEnvironmentCaptor);
var {
  getEnvironmentOption,
  getEnvironmentOptionsList,
  environmentOptionsListHas
} = makeEnvironmentCaptor(localThis, true);

// node_modules/@endo/immutable-arraybuffer/src/immutable-arraybuffer-pony.js
var {
  ArrayBuffer: ArrayBuffer2,
  Object: Object4,
  Reflect: Reflect4,
  Symbol: Symbol3,
  TypeError: TypeError3,
  Uint8Array: Uint8Array2,
  WeakMap: WeakMap2,
  // Capture structuredClone before it can be scuttled.
  structuredClone: optStructuredClone
  // eslint-disable-next-line no-restricted-globals
} = globalThis;
var { freeze: freeze3, defineProperty: defineProperty2, getPrototypeOf: getPrototypeOf2, getOwnPropertyDescriptor: getOwnPropertyDescriptor2 } = Object4;
var { apply: apply3, ownKeys: ownKeys2 } = Reflect4;
var { toStringTag } = Symbol3;
var { prototype: arrayBufferPrototype2 } = ArrayBuffer2;
var { slice, transfer: optTransfer } = arrayBufferPrototype2;
var { get: arrayBufferByteLength } = getOwnPropertyDescriptor2(
  arrayBufferPrototype2,
  "byteLength"
);
var typedArrayPrototype2 = getPrototypeOf2(Uint8Array2.prototype);
var { set: uint8ArraySet } = typedArrayPrototype2;
var { get: uint8ArrayBuffer } = getOwnPropertyDescriptor2(
  typedArrayPrototype2,
  "buffer"
);
var arrayBufferSlice2 = (realBuffer, start = void 0, end = void 0) => apply3(slice, realBuffer, [start, end]);
var optArrayBufferTransfer;
if (optTransfer) {
  optArrayBufferTransfer = (arrayBuffer) => apply3(optTransfer, arrayBuffer, []);
} else if (optStructuredClone) {
  optArrayBufferTransfer = (arrayBuffer) => {
    arrayBufferSlice2(arrayBuffer, 0, 0);
    return optStructuredClone(arrayBuffer, {
      transfer: [arrayBuffer]
    });
  };
} else {
  optArrayBufferTransfer = void 0;
}
var buffers = new WeakMap2();
for (const methodName of ["get", "has", "set"]) {
  defineProperty2(buffers, methodName, { value: buffers[methodName] });
}
var getBuffer = (immuAB) => {
  const result = buffers.get(immuAB);
  if (result) {
    return result;
  }
  throw TypeError3("Not an emulated Immutable ArrayBuffer");
};
var ImmutableArrayBufferInternalPrototype = {
  __proto__: arrayBufferPrototype2,
  get byteLength() {
    return apply3(arrayBufferByteLength, getBuffer(this), []);
  },
  get detached() {
    getBuffer(this);
    return false;
  },
  get maxByteLength() {
    return apply3(arrayBufferByteLength, getBuffer(this), []);
  },
  get resizable() {
    getBuffer(this);
    return false;
  },
  get immutable() {
    getBuffer(this);
    return true;
  },
  slice(start = void 0, end = void 0) {
    return arrayBufferSlice2(getBuffer(this), start, end);
  },
  sliceToImmutable(start = void 0, end = void 0) {
    return sliceBufferToImmutable(getBuffer(this), start, end);
  },
  resize(_newByteLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot resize an immutable ArrayBuffer");
  },
  transfer(_newLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot detach an immutable ArrayBuffer");
  },
  transferToFixedLength(_newLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot detach an immutable ArrayBuffer");
  },
  transferToImmutable(_newLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot detach an immutable ArrayBuffer");
  },
  /**
   * See https://github.com/endojs/endo/tree/master/packages/immutable-arraybuffer#purposeful-violation
   */
  [toStringTag]: "ImmutableArrayBuffer"
};
for (const key of ownKeys2(ImmutableArrayBufferInternalPrototype)) {
  defineProperty2(ImmutableArrayBufferInternalPrototype, key, {
    enumerable: false
  });
}
var makeImmutableArrayBufferInternal = (realBuffer) => {
  const result = (
    /** @type {ArrayBuffer} */
    /** @type {unknown} */
    {
      __proto__: ImmutableArrayBufferInternalPrototype
    }
  );
  buffers.set(result, realBuffer);
  return result;
};
freeze3(makeImmutableArrayBufferInternal);
var isBufferImmutable = (buffer) => buffers.has(buffer);
var sliceBufferToImmutable = (buffer, start = void 0, end = void 0) => {
  let realBuffer = buffers.get(buffer);
  if (realBuffer === void 0) {
    realBuffer = buffer;
  }
  return makeImmutableArrayBufferInternal(
    arrayBufferSlice2(realBuffer, start, end)
  );
};
var transferBufferToImmutable;
if (optArrayBufferTransfer) {
  transferBufferToImmutable = (buffer, newLength = void 0) => {
    if (newLength === void 0) {
      buffer = optArrayBufferTransfer(buffer);
    } else if (optTransfer) {
      buffer = apply3(optTransfer, buffer, [newLength]);
    } else {
      buffer = optArrayBufferTransfer(buffer);
      const oldLength = buffer.byteLength;
      if (newLength <= oldLength) {
        buffer = arrayBufferSlice2(buffer, 0, newLength);
      } else {
        const oldTA = new Uint8Array2(buffer);
        const newTA = new Uint8Array2(newLength);
        apply3(uint8ArraySet, newTA, [oldTA]);
        buffer = apply3(uint8ArrayBuffer, newTA, []);
      }
    }
    const result = makeImmutableArrayBufferInternal(buffer);
    return (
      /** @type {ArrayBuffer} */
      /** @type {unknown} */
      result
    );
  };
} else {
  transferBufferToImmutable = void 0;
}
var optTransferBufferToImmutable = transferBufferToImmutable;

// node_modules/@endo/immutable-arraybuffer/src/immutable-arraybuffer-shim.js
var {
  ArrayBuffer: ArrayBuffer3,
  JSON: JSON4,
  Object: Object5,
  Reflect: Reflect5
  // eslint-disable-next-line no-restricted-globals
} = globalThis;
var optTransferBufferToImmutable2 = optTransferBufferToImmutable;
var { getOwnPropertyDescriptors: getOwnPropertyDescriptors2, defineProperties: defineProperties2, defineProperty: defineProperty3 } = Object5;
var { ownKeys: ownKeys3 } = Reflect5;
var { prototype: arrayBufferPrototype3 } = ArrayBuffer3;
var { stringify } = JSON4;
var arrayBufferMethods = {
  /**
   * Creates an immutable slice of the given buffer.
   *
   * @this {ArrayBuffer} buffer The original buffer.
   * @param {number} [start] The start index.
   * @param {number} [end] The end index.
   * @returns {ArrayBuffer} The sliced immutable ArrayBuffer.
   */
  sliceToImmutable(start = void 0, end = void 0) {
    return sliceBufferToImmutable(this, start, end);
  },
  /**
   * @this {ArrayBuffer}
   */
  get immutable() {
    return isBufferImmutable(this);
  },
  ...optTransferBufferToImmutable2 ? {
    /**
     * Transfer the contents to a new Immutable ArrayBuffer
     *
     * @this {ArrayBuffer} buffer The original buffer.
     * @param {number} [newLength] The start index.
     * @returns {ArrayBuffer} The sliced immutable ArrayBuffer.
     */
    transferToImmutable(newLength = void 0) {
      return optTransferBufferToImmutable2(this, newLength);
    }
  } : {}
};
for (const key of ownKeys3(arrayBufferMethods)) {
  defineProperty3(arrayBufferMethods, key, {
    enumerable: false
  });
}
var overwrites = ownKeys3(arrayBufferMethods).filter(
  (key) => key in arrayBufferPrototype3
);
if (overwrites.length > 0) {
  console.warn(
    `About to overwrite ArrayBuffer.prototype properties ${stringify(overwrites)}`
  );
}
defineProperties2(
  arrayBufferPrototype3,
  getOwnPropertyDescriptors2(arrayBufferMethods)
);

// node_modules/ses/src/error/stringify-utils.js
var an = (str) => {
  str = `${str}`;
  if (str.length >= 1 && stringIncludes("aeiouAEIOU", str[0])) {
    return `an ${str}`;
  }
  return `a ${str}`;
};
freeze(an);
var bestEffortStringify = (payload, spaces = void 0) => {
  const seenSet = new Set();
  const replacer = (_, val) => {
    switch (typeof val) {
      case "object": {
        if (val === null) {
          return null;
        }
        if (setHas(seenSet, val)) {
          return "[Seen]";
        }
        setAdd(seenSet, val);
        if (isError(val)) {
          return `[${val.name}: ${val.message}]`;
        }
        if (toStringTagSymbol in val) {
          return `[${val[toStringTagSymbol]}]`;
        }
        if (isArray(val)) {
          return val;
        }
        const names = keys(val);
        if (names.length < 2) {
          return val;
        }
        let sorted = true;
        for (let i = 1; i < names.length; i += 1) {
          if (names[i - 1] >= names[i]) {
            sorted = false;
            break;
          }
        }
        if (sorted) {
          return val;
        }
        arraySort(names);
        const entries2 = arrayMap(names, (name) => [name, val[name]]);
        return fromEntries(entries2);
      }
      case "function": {
        return `[Function ${val.name || "<anon>"}]`;
      }
      case "string": {
        if (stringStartsWith(val, "[")) {
          return `[${val}]`;
        }
        return val;
      }
      case "undefined":
      case "symbol": {
        return `[${String2(val)}]`;
      }
      case "bigint": {
        return `[${val}n]`;
      }
      case "number": {
        if (is(val, NaN)) {
          return "[NaN]";
        } else if (val === Infinity) {
          return "[Infinity]";
        } else if (val === -Infinity) {
          return "[-Infinity]";
        }
        return val;
      }
      default: {
        return val;
      }
    }
  };
  try {
    return stringifyJson(payload, replacer, spaces);
  } catch (_err) {
    return "[Something that failed to stringify]";
  }
};
freeze(bestEffortStringify);

// node_modules/@endo/cache-map/src/cachemap.js
var { Error: Error3, TypeError: TypeError4, WeakMap: WeakMap3 } = globalThis;
var { parse, stringify: stringify2 } = JSON;
var { isSafeInteger } = Number;
var { freeze: freeze4 } = Object;
var { toStringTag: toStringTagSymbol2 } = Symbol;
var UNKNOWN_KEY = /* @__PURE__ */ Symbol("UNKNOWN_KEY");
var deepCopyJsonable = (value, reviver) => {
  const encoded = stringify2(value);
  const decoded = parse(encoded, reviver);
  return decoded;
};
var freezingReviver = (_name, value) => freeze4(value);
var deepCopyAndFreezeJsonable = (value) => deepCopyJsonable(value, freezingReviver);
var appendNewCell = (prev, id, data) => {
  const next = prev?.next;
  const cell = { id, next, prev, data };
  prev.next = cell;
  next.prev = cell;
  return cell;
};
var moveCellAfter = (cell, prev, next = prev.next) => {
  if (cell === prev || cell === next) return;
  const { prev: oldPrev, next: oldNext } = cell;
  oldPrev.next = oldNext;
  oldNext.prev = oldPrev;
  cell.prev = prev;
  cell.next = next;
  prev.next = cell;
  next.prev = cell;
};
var resetCell = (cell, oldKey, makeMap) => {
  if (oldKey !== UNKNOWN_KEY) {
    cell.data.delete(oldKey);
    return;
  }
  if (cell.data.clear) {
    cell.data.clear();
    return;
  }
  if (!makeMap) {
    throw Error3("internal: makeMap is required with UNKNOWN_KEY");
  }
  cell.data = makeMap();
};
var zeroMetrics = freeze4({
  totalQueryCount: 0,
  totalHitCount: 0
  // TODO?
  // * method-specific counts
  // * liveTouchStats/evictedTouchStats { count, sum, mean, min, max }
  //   * p50/p90/p95/p99 via Ben-Haim/Tom-Tov streaming histograms
});
var makeCacheMapKit = (capacity, options = {}) => {
  if (!isSafeInteger(capacity) || capacity < 0) {
    throw TypeError4(
      "capacity must be a non-negative safe integer number <= 2**53 - 1"
    );
  }
  const makeMap = ((MaybeCtor) => {
    try {
      MaybeCtor();
      return (
        /** @type {any} */
        MaybeCtor
      );
    } catch (err) {
      const constructNewMap = () => new MaybeCtor();
      return constructNewMap;
    }
  })(options.makeMap ?? WeakMap3);
  const tag = (
    /** @type {any} */
    makeMap().clear === void 0 ? "WeakCacheMap" : "CacheMap"
  );
  const keyToCell = makeMap();
  const head = (
    /** @type {CacheMapCell<K, V>} */
    {
      id: 0,
      // next and prev are established below as self-referential.
      next: void 0,
      prev: void 0,
      data: {
        has: () => {
          throw Error3("internal: sentinel head cell has no data");
        }
      }
    }
  );
  head.next = head;
  head.prev = head;
  let cellCount = 0;
  const metrics = deepCopyJsonable(zeroMetrics);
  const getMetrics = () => deepCopyAndFreezeJsonable(metrics);
  const touchKey = (key) => {
    metrics.totalQueryCount += 1;
    const cell = keyToCell.get(key);
    if (!cell?.data.has(key)) return void 0;
    metrics.totalHitCount += 1;
    moveCellAfter(cell, head);
    return cell;
  };
  const has = (key) => {
    const cell = touchKey(key);
    return cell !== void 0;
  };
  freeze4(has);
  const get = (key) => {
    const cell = touchKey(key);
    return cell?.data.get(key);
  };
  freeze4(get);
  const set = (key, value) => {
    let cell = touchKey(key);
    if (cell) {
      cell.data.set(key, value);
      return implementation;
    }
    if (cellCount < capacity) {
      cell = appendNewCell(head, cellCount + 1, makeMap());
      cellCount += 1;
      cell.data.set(key, value);
    } else if (capacity > 0) {
      cell = head.prev;
      resetCell(
        /** @type {any} */
        cell,
        UNKNOWN_KEY,
        makeMap
      );
      cell.data.set(key, value);
      moveCellAfter(cell, head);
    }
    if (cell) keyToCell.set(key, cell);
    return implementation;
  };
  freeze4(set);
  const { delete: deleteEntry } = {
    /** @type {WeakMapAPI<K, V>['delete']} */
    delete: (key) => {
      const cell = keyToCell.get(key);
      if (!cell?.data.has(key)) {
        keyToCell.delete(key);
        return false;
      }
      moveCellAfter(cell, head.prev);
      resetCell(cell, key);
      keyToCell.delete(key);
      return true;
    }
  };
  freeze4(deleteEntry);
  const implementation = (
    /** @type {WeakMapAPI<K, V>} */
    {
      has,
      get,
      set,
      delete: deleteEntry,
      // eslint-disable-next-line jsdoc/check-types
      [
        /** @type {typeof Symbol.toStringTag} */
        toStringTagSymbol2
      ]: tag
    }
  );
  freeze4(implementation);
  const kit = { cache: implementation, getMetrics };
  return freeze4(kit);
};
freeze4(makeCacheMapKit);

// node_modules/ses/src/error/note-log-args.js
var { freeze: freeze5 } = Object;
var { isSafeInteger: isSafeInteger2 } = Number;
var defaultLoggedErrorsBudget = 1e3;
var defaultArgsPerErrorBudget = 100;
var makeNoteLogArgsArrayKit = (errorsBudget = defaultLoggedErrorsBudget, argsPerErrorBudget = defaultArgsPerErrorBudget) => {
  if (!isSafeInteger2(argsPerErrorBudget) || argsPerErrorBudget < 1) {
    throw TypeError(
      "argsPerErrorBudget must be a safe positive integer number"
    );
  }
  const { cache: noteLogArgsArrayMap } = makeCacheMapKit(errorsBudget);
  const addLogArgs2 = (error, logArgs) => {
    const logArgsArray = noteLogArgsArrayMap.get(error);
    if (logArgsArray !== void 0) {
      if (logArgsArray.length >= argsPerErrorBudget) {
        logArgsArray.shift();
      }
      logArgsArray.push(logArgs);
    } else {
      noteLogArgsArrayMap.set(error, [logArgs]);
    }
  };
  freeze5(addLogArgs2);
  const takeLogArgsArray2 = (error) => {
    const result = noteLogArgsArrayMap.get(error);
    noteLogArgsArrayMap.delete(error);
    return result;
  };
  freeze5(takeLogArgsArray2);
  return freeze5({
    addLogArgs: addLogArgs2,
    takeLogArgsArray: takeLogArgsArray2
  });
};
freeze5(makeNoteLogArgsArrayKit);

// node_modules/ses/src/error/assert.js
var declassifiers = new WeakMap();
var quote = (payload, spaces = void 0) => {
  const result = freeze({
    toString: freeze(() => bestEffortStringify(payload, spaces))
  });
  weakmapSet(declassifiers, result, payload);
  return result;
};
freeze(quote);
var canBeBare = freeze(/^[\w:-]( ?[\w:-])*$/);
var bare = (payload, spaces = void 0) => {
  if (typeof payload !== "string" || !regexpTest(canBeBare, payload)) {
    return quote(payload, spaces);
  }
  const result = freeze({
    toString: freeze(() => payload)
  });
  weakmapSet(declassifiers, result, payload);
  return result;
};
freeze(bare);
var hiddenDetailsMap = new WeakMap();
var getMessageString = ({ template, args }) => {
  const parts = [template[0]];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    let argStr;
    if (weakmapHas(declassifiers, arg)) {
      argStr = `${arg}`;
    } else if (isError(arg)) {
      argStr = `(${an(arg.name)})`;
    } else {
      argStr = `(${an(typeof arg)})`;
    }
    arrayPush(parts, argStr, template[i + 1]);
  }
  return arrayJoin(parts, "");
};
var DetailsTokenProto = freeze({
  toString() {
    const hiddenDetails = weakmapGet(hiddenDetailsMap, this);
    if (hiddenDetails === void 0) {
      return "[Not a DetailsToken]";
    }
    return getMessageString(hiddenDetails);
  }
});
freeze(DetailsTokenProto.toString);
var redactedDetails = (template, ...args) => {
  const detailsToken = freeze({ __proto__: DetailsTokenProto });
  weakmapSet(hiddenDetailsMap, detailsToken, { template, args });
  return (
    /** @type {DetailsToken} */
    /** @type {unknown} */
    detailsToken
  );
};
freeze(redactedDetails);
var unredactedDetails = (template, ...args) => {
  args = arrayMap(
    args,
    (arg) => weakmapHas(declassifiers, arg) ? arg : quote(arg)
  );
  return redactedDetails(template, ...args);
};
freeze(unredactedDetails);
var getLogArgs = ({ template, args }) => {
  const logArgs = [template[0]];
  for (let i = 0; i < args.length; i += 1) {
    let arg = args[i];
    if (weakmapHas(declassifiers, arg)) {
      arg = weakmapGet(declassifiers, arg);
    }
    const priorWithoutSpace = stringReplace(arrayPop(logArgs) || "", / $/, "");
    if (priorWithoutSpace !== "") {
      arrayPush(logArgs, priorWithoutSpace);
    }
    const nextWithoutSpace = stringReplace(template[i + 1], /^ /, "");
    arrayPush(logArgs, arg, nextWithoutSpace);
  }
  if (logArgs[logArgs.length - 1] === "") {
    arrayPop(logArgs);
  }
  return logArgs;
};
var hiddenMessageLogArgs = new WeakMap();
var errorTagNum = 0;
var errorTags = new WeakMap();
var tagError = (err, optErrorName = err.name) => {
  let errorTag = weakmapGet(errorTags, err);
  if (errorTag !== void 0) {
    return errorTag;
  }
  errorTagNum += 1;
  errorTag = `${optErrorName}#${errorTagNum}`;
  weakmapSet(errorTags, err, errorTag);
  return errorTag;
};
var sanitizeError = (error) => {
  const descs = getOwnPropertyDescriptors(error);
  const {
    name: _nameDesc,
    message: _messageDesc,
    errors: _errorsDesc = void 0,
    cause: _causeDesc = void 0,
    stack: _stackDesc = void 0,
    ...restDescs
  } = descs;
  const restNames = ownKeys(restDescs);
  if (restNames.length >= 1) {
    for (const name of restNames) {
      delete error[name];
    }
    const droppedNote = create(objectPrototype, restDescs);
    note(
      error,
      redactedDetails`originally with properties ${quote(droppedNote)}`
    );
  }
  for (const name of ownKeys(error)) {
    const desc = descs[name];
    if (desc && hasOwn(desc, "get")) {
      defineProperty(error, name, {
        value: error[name]
        // invoke the getter to convert to data property
      });
    }
  }
  freeze(error);
};
var makeError = (optDetails = redactedDetails`Assert failed`, errConstructor = universalThis.Error, {
  errorName = void 0,
  cause = void 0,
  errors = void 0,
  sanitize = true
} = {}) => {
  if (typeof optDetails === "string") {
    optDetails = redactedDetails([optDetails]);
  }
  const hiddenDetails = weakmapGet(hiddenDetailsMap, optDetails);
  if (hiddenDetails === void 0) {
    throw TypeError2(`unrecognized details ${quote(optDetails)}`);
  }
  const messageString = getMessageString(hiddenDetails);
  const opts = cause && { cause };
  let error;
  if (typeof AggregateError2 !== "undefined" && errConstructor === AggregateError2) {
    error = AggregateError2(errors || [], messageString, opts);
  } else {
    error = /** @type {ErrorConstructor} */
    errConstructor(
      messageString,
      opts
    );
    if (errors !== void 0) {
      defineProperty(error, "errors", {
        value: errors,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
  weakmapSet(hiddenMessageLogArgs, error, getLogArgs(hiddenDetails));
  if (errorName !== void 0) {
    tagError(error, errorName);
  }
  if (sanitize) {
    sanitizeError(error);
  }
  return error;
};
freeze(makeError);
var { addLogArgs, takeLogArgsArray } = makeNoteLogArgsArrayKit();
var hiddenNoteCallbackArrays = new WeakMap();
var note = (error, detailsNote) => {
  if (typeof detailsNote === "string") {
    detailsNote = redactedDetails([detailsNote]);
  }
  const hiddenDetails = weakmapGet(hiddenDetailsMap, detailsNote);
  if (hiddenDetails === void 0) {
    throw TypeError2(`unrecognized details ${quote(detailsNote)}`);
  }
  const logArgs = getLogArgs(hiddenDetails);
  const callbacks = weakmapGet(hiddenNoteCallbackArrays, error);
  if (callbacks !== void 0) {
    for (const callback of callbacks) {
      callback(error, logArgs);
    }
  } else {
    addLogArgs(error, logArgs);
  }
};
freeze(note);
var defaultGetStackString = (error) => {
  if (!("stack" in error)) {
    return "";
  }
  const stackString = `${error.stack}`;
  const pos = stringIndexOf(stackString, "\n");
  if (stringStartsWith(stackString, " ") || pos === -1) {
    return stackString;
  }
  return stringSlice(stackString, pos + 1);
};
var loggedErrorHandler = {
  getStackString: universalThis.getStackString || defaultGetStackString,
  tagError: (error) => tagError(error),
  resetErrorTagNum: () => {
    errorTagNum = 0;
  },
  getMessageLogArgs: (error) => weakmapGet(hiddenMessageLogArgs, error),
  takeMessageLogArgs: (error) => {
    const result = weakmapGet(hiddenMessageLogArgs, error);
    weakmapDelete(hiddenMessageLogArgs, error);
    return result;
  },
  takeNoteLogArgsArray: (error, callback) => {
    const result = takeLogArgsArray(error);
    if (callback !== void 0) {
      const callbacks = weakmapGet(hiddenNoteCallbackArrays, error);
      if (callbacks) {
        arrayPush(callbacks, callback);
      } else {
        weakmapSet(hiddenNoteCallbackArrays, error, [callback]);
      }
    }
    return result || [];
  }
};
freeze(loggedErrorHandler);
var makeAssert = (optRaise = void 0, unredacted = false) => {
  const details = unredacted ? unredactedDetails : redactedDetails;
  const assertFailedDetails = details`Check failed`;
  const fail = (optDetails = assertFailedDetails, errConstructor = void 0, options = void 0) => {
    const reason = makeError(optDetails, errConstructor, options);
    if (optRaise !== void 0) {
      optRaise(reason);
    }
    throw reason;
  };
  freeze(fail);
  const Fail9 = (template, ...args) => fail(details(template, ...args));
  function baseAssert(flag, optDetails = void 0, errConstructor = void 0, options = void 0) {
    flag || fail(optDetails, errConstructor, options);
  }
  const equal = (actual, expected, optDetails = void 0, errConstructor = void 0, options = void 0) => {
    is(actual, expected) || fail(
      optDetails || details`Expected ${actual} is same as ${expected}`,
      errConstructor || RangeError2,
      options
    );
  };
  freeze(equal);
  const assertTypeof = (specimen, typename, optDetails) => {
    if (typeof specimen === typename) {
      return;
    }
    typeof typename === "string" || Fail9`${quote(typename)} must be a string`;
    if (optDetails === void 0) {
      const typeWithDeterminer = an(typename);
      optDetails = details`${specimen} must be ${bare(typeWithDeterminer)}`;
    }
    fail(optDetails, TypeError2);
  };
  freeze(assertTypeof);
  const assertString = (specimen, optDetails = void 0) => assertTypeof(specimen, "string", optDetails);
  const assert2 = assign(baseAssert, {
    error: makeError,
    fail,
    equal,
    typeof: assertTypeof,
    string: assertString,
    note,
    details,
    Fail: Fail9,
    quote,
    bare,
    makeAssert
  });
  return freeze(assert2);
};
freeze(makeAssert);
var assert = makeAssert();
var assertEqual = assert.equal;

// node_modules/ses/src/make-hardener.js
var typedArrayToStringTag = getOwnPropertyDescriptor(
  typedArrayPrototype,
  toStringTagSymbol
);
assert(typedArrayToStringTag);
var getTypedArrayToStringTag = typedArrayToStringTag.get;
assert(getTypedArrayToStringTag);
var isTypedArray = (object) => {
  const tag = apply(getTypedArrayToStringTag, object, []);
  return tag !== void 0;
};
var isCanonicalIntegerIndexString = (propertyKey) => {
  const n = +String2(propertyKey);
  return isInteger(n) && String2(n) === propertyKey;
};
var freezeTypedArray = (array) => {
  preventExtensions(array);
  arrayForEach(ownKeys(array), (name) => {
    const desc = getOwnPropertyDescriptor(array, name);
    assert(desc);
    if (!isCanonicalIntegerIndexString(name)) {
      defineProperty(array, name, {
        ...desc,
        writable: false,
        configurable: false
      });
    }
  });
};
var makeHardener = () => {
  if (typeof universalThis.harden === "function") {
    const safeHarden2 = universalThis.harden;
    return safeHarden2;
  }
  const hardened = new WeakSet();
  const { harden: harden2 } = {
    /**
     * @template T
     * @param {T} root
     * @returns {T}
     */
    harden(root) {
      const toFreeze = new Set();
      function enqueue(val) {
        if (isPrimitive(val)) {
          return;
        }
        const type = typeof val;
        if (type !== "object" && type !== "function") {
          throw TypeError2(`Unexpected typeof: ${type}`);
        }
        if (weaksetHas(hardened, val) || setHas(toFreeze, val)) {
          return;
        }
        setAdd(toFreeze, val);
      }
      const baseFreezeAndTraverse = (obj) => {
        if (isTypedArray(obj)) {
          freezeTypedArray(obj);
        } else {
          freeze(obj);
        }
        const descs = getOwnPropertyDescriptors(obj);
        const proto = getPrototypeOf(obj);
        enqueue(proto);
        arrayForEach(ownKeys(descs), (name) => {
          const desc = descs[
            /** @type {string} */
            name
          ];
          if (hasOwn(desc, "value")) {
            enqueue(desc.value);
          } else {
            enqueue(desc.get);
            enqueue(desc.set);
          }
        });
      };
      const freezeAndTraverse = FERAL_STACK_GETTER === void 0 && FERAL_STACK_SETTER === void 0 ? (
        // On platforms without v8's error own stack accessor problem,
        // don't pay for any extra overhead.
        baseFreezeAndTraverse
      ) : (obj) => {
        if (isError(obj)) {
          const stackDesc2 = getOwnPropertyDescriptor(obj, "stack");
          if (stackDesc2 && stackDesc2.get === FERAL_STACK_GETTER && stackDesc2.configurable) {
            defineProperty(obj, "stack", {
              // NOTE: Calls getter during harden, which seems dangerous.
              // But we're only calling the problematic getter whose
              // hazards we think we understand.
              // @ts-expect-error TS should know FERAL_STACK_GETTER
              // cannot be `undefined` here.
              // See https://github.com/endojs/endo/pull/2232#discussion_r1575179471
              value: apply(FERAL_STACK_GETTER, obj, [])
            });
          }
        }
        return baseFreezeAndTraverse(obj);
      };
      const dequeue = () => {
        setForEach(toFreeze, freezeAndTraverse);
      };
      const markHardened = (value) => {
        weaksetAdd(hardened, value);
      };
      const commit = () => {
        setForEach(toFreeze, markHardened);
      };
      enqueue(root);
      dequeue();
      commit();
      return root;
    }
  };
  return harden2;
};

// node_modules/ses/src/cauterize-property.js
var cauterizeProperty = (obj, prop, known, subPath, { warn, error }) => {
  if (!known) {
    warn(`Removing ${subPath}`);
  }
  try {
    delete obj[prop];
  } catch (err) {
    if (hasOwn(obj, prop)) {
      if (typeof obj === "function" && prop === "prototype") {
        obj.prototype = void 0;
        if (obj.prototype === void 0) {
          warn(`Tolerating undeletable ${subPath} === undefined`);
          return;
        }
      }
      error(`failed to delete ${subPath}`, err);
    } else {
      error(`deleting ${subPath} threw`, err);
    }
    throw err;
  }
};

// node_modules/ses/src/permits.js
var constantProperties = {
  // *** Value Properties of the Global Object
  Infinity: Infinity,
  NaN: NaN,
  undefined: void 0
};
var universalPropertyNames = {
  // *** Function Properties of the Global Object
  isFinite: "isFinite",
  isNaN: "isNaN",
  parseFloat: "parseFloat",
  parseInt: "parseInt",
  decodeURI: "decodeURI",
  decodeURIComponent: "decodeURIComponent",
  encodeURI: "encodeURI",
  encodeURIComponent: "encodeURIComponent",
  // *** Constructor Properties of the Global Object
  Array: "Array",
  ArrayBuffer: "ArrayBuffer",
  BigInt: "BigInt",
  BigInt64Array: "BigInt64Array",
  BigUint64Array: "BigUint64Array",
  Boolean: "Boolean",
  DataView: "DataView",
  EvalError: "EvalError",
  // https://github.com/tc39/proposal-float16array
  Float16Array: "Float16Array",
  Float32Array: "Float32Array",
  Float64Array: "Float64Array",
  Int8Array: "Int8Array",
  Int16Array: "Int16Array",
  Int32Array: "Int32Array",
  Map: "Map",
  Number: "Number",
  Object: "Object",
  Promise: "Promise",
  Proxy: "Proxy",
  RangeError: "RangeError",
  ReferenceError: "ReferenceError",
  Set: "Set",
  String: "String",
  SyntaxError: "SyntaxError",
  TypeError: "TypeError",
  Uint8Array: "Uint8Array",
  Uint8ClampedArray: "Uint8ClampedArray",
  Uint16Array: "Uint16Array",
  Uint32Array: "Uint32Array",
  URIError: "URIError",
  WeakMap: "WeakMap",
  WeakSet: "WeakSet",
  // https://github.com/tc39/proposal-iterator-helpers
  Iterator: "Iterator",
  // https://github.com/tc39/proposal-async-iterator-helpers
  AsyncIterator: "AsyncIterator",
  // https://github.com/endojs/endo/issues/550
  AggregateError: "AggregateError",
  // https://github.com/tc39/proposal-explicit-resource-management
  // TODO DisposableStack, AsyncDisposableStack
  // DisposableStack: 'DisposableStack',
  // AsyncDisposableStack: 'AsyncDisposableStack',
  // https://tc39.es/proposal-shadowrealm/
  // TODO ShadowRealm
  // ShadowRealm: 'ShadowRealm',
  // *** Other Properties of the Global Object
  JSON: "JSON",
  Reflect: "Reflect",
  // *** Annex B
  escape: "escape",
  unescape: "unescape",
  // ESNext
  // https://github.com/tc39/proposal-source-phase-imports?tab=readme-ov-file#js-module-source
  ModuleSource: "ModuleSource",
  lockdown: "lockdown",
  harden: "harden",
  HandledPromise: "HandledPromise"
  // TODO: Until Promise.delegate (see below).
};
var initialGlobalPropertyNames = {
  // *** Constructor Properties of the Global Object
  Date: "%InitialDate%",
  Error: "%InitialError%",
  RegExp: "%InitialRegExp%",
  // Omit `Symbol`, because we want the original to appear on the
  // start compartment without passing through the permits mechanism, since
  // we want to preserve all its properties, even if we never heard of them.
  // Symbol: '%InitialSymbol%',
  // *** Other Properties of the Global Object
  Math: "%InitialMath%",
  // ESNext
  // From Error-stack proposal
  // Only on initial global. No corresponding
  // powerless form for other globals.
  getStackString: "%InitialGetStackString%"
  // TODO https://github.com/Agoric/SES-shim/issues/551
  // Need initial WeakRef and FinalizationGroup in
  // start compartment only.
  // TODO Temporal
  // https://github.com/tc39/proposal-temporal
  // Temporal: '%InitialTemporal%' // with Temporal.Now
};
var sharedGlobalPropertyNames = {
  // *** Constructor Properties of the Global Object
  Date: "%SharedDate%",
  Error: "%SharedError%",
  RegExp: "%SharedRegExp%",
  Symbol: "%SharedSymbol%",
  // *** Other Properties of the Global Object
  Math: "%SharedMath%"
  // TODO Temporal
  // https://github.com/tc39/proposal-temporal
  // Temporal: '%SharedTemporal%' // without Temporal.Now
};
var NativeErrors = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
  // https://github.com/endojs/endo/issues/550
  // Commented out to accommodate platforms prior to AggregateError.
  // Instead, conditional push below.
  // AggregateError,
];
if (typeof AggregateError !== "undefined") {
  arrayPush(NativeErrors, AggregateError);
}
var FunctionInstance = {
  "[[Proto]]": "%FunctionPrototype%",
  length: "number",
  name: "string"
  // Do not specify "prototype" here, since only Function instances that can
  // be used as a constructor have a prototype property. For constructors,
  // since prototype properties are instance-specific, we define it there.
};
var AsyncFunctionInstance = {
  // This property is not mentioned in ECMA 262, but is present in V8 and
  // necessary for lockdown to succeed.
  "[[Proto]]": "%AsyncFunctionPrototype%"
};
var fn = FunctionInstance;
var asyncFn = AsyncFunctionInstance;
var getter = {
  get: fn,
  set: "undefined"
};
var accessor = {
  get: fn,
  set: fn
};
var strict = function() {
  "use strict";
};
arrayForEach(["caller", "arguments"], (prop) => {
  try {
    strict[prop];
  } catch (e) {
    if (e.message === "Restricted in strict mode") {
      FunctionInstance[prop] = accessor;
    }
  }
});
var isAccessorPermit = (permit) => {
  return permit === getter || permit === accessor;
};
function NativeError(prototype) {
  return {
    // Properties of the NativeError Constructors
    "[[Proto]]": "%SharedError%",
    // NativeError.prototype
    prototype
  };
}
function NativeErrorPrototype(constructor) {
  return {
    // Properties of the NativeError Prototype Objects
    "[[Proto]]": "%ErrorPrototype%",
    constructor,
    message: "string",
    name: "string",
    // Redundantly present only on v8. Safe to remove.
    toString: false,
    // Superfluously present in some versions of V8.
    // https://github.com/tc39/notes/blob/master/meetings/2021-10/oct-26.md#:~:text=However%2C%20Chrome%2093,and%20node%2016.11.
    cause: false
  };
}
function TypedArray(prototype) {
  return {
    // Properties of the TypedArray Constructors
    "[[Proto]]": "%TypedArray%",
    BYTES_PER_ELEMENT: "number",
    prototype
  };
}
function TypedArrayPrototype(constructor) {
  return {
    // Properties of the TypedArray Prototype Objects
    "[[Proto]]": "%TypedArrayPrototype%",
    BYTES_PER_ELEMENT: "number",
    constructor
  };
}
var CommonMath = {
  E: "number",
  LN10: "number",
  LN2: "number",
  LOG10E: "number",
  LOG2E: "number",
  PI: "number",
  SQRT1_2: "number",
  SQRT2: "number",
  "@@toStringTag": "string",
  abs: fn,
  acos: fn,
  acosh: fn,
  asin: fn,
  asinh: fn,
  atan: fn,
  atanh: fn,
  atan2: fn,
  cbrt: fn,
  ceil: fn,
  clz32: fn,
  cos: fn,
  cosh: fn,
  exp: fn,
  expm1: fn,
  floor: fn,
  fround: fn,
  hypot: fn,
  imul: fn,
  log: fn,
  log1p: fn,
  log10: fn,
  log2: fn,
  max: fn,
  min: fn,
  pow: fn,
  round: fn,
  sign: fn,
  sin: fn,
  sinh: fn,
  sqrt: fn,
  tan: fn,
  tanh: fn,
  trunc: fn,
  // https://github.com/tc39/proposal-float16array
  f16round: fn,
  // https://github.com/tc39/proposal-math-sum
  sumPrecise: fn,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  idiv: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  idivmod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  imod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  imuldiv: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  irem: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  mod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
  irandom: false
};
var permitted = {
  // ECMA https://tc39.es/ecma262
  // The intrinsics object has no prototype to avoid conflicts.
  "[[Proto]]": null,
  // %ThrowTypeError%
  "%ThrowTypeError%": fn,
  // *** The Global Object
  // *** Value Properties of the Global Object
  Infinity: "number",
  NaN: "number",
  undefined: "undefined",
  // *** Function Properties of the Global Object
  // eval
  "%UniqueEval%": fn,
  isFinite: fn,
  isNaN: fn,
  parseFloat: fn,
  parseInt: fn,
  decodeURI: fn,
  decodeURIComponent: fn,
  encodeURI: fn,
  encodeURIComponent: fn,
  // *** Fundamental Objects
  Object: {
    // Properties of the Object Constructor
    "[[Proto]]": "%FunctionPrototype%",
    assign: fn,
    create: fn,
    defineProperties: fn,
    defineProperty: fn,
    entries: fn,
    freeze: fn,
    fromEntries: fn,
    getOwnPropertyDescriptor: fn,
    getOwnPropertyDescriptors: fn,
    getOwnPropertyNames: fn,
    getOwnPropertySymbols: fn,
    getPrototypeOf: fn,
    is: fn,
    isExtensible: fn,
    isFrozen: fn,
    isSealed: fn,
    keys: fn,
    preventExtensions: fn,
    prototype: "%ObjectPrototype%",
    seal: fn,
    setPrototypeOf: fn,
    values: fn,
    // https://github.com/tc39/proposal-accessible-object-hasownproperty
    hasOwn: fn,
    // https://github.com/tc39/proposal-array-grouping
    groupBy: fn,
    // Seen on QuickJS
    __getClass: false
  },
  "%ObjectPrototype%": {
    // Properties of the Object Prototype Object
    "[[Proto]]": null,
    constructor: "Object",
    hasOwnProperty: fn,
    isPrototypeOf: fn,
    propertyIsEnumerable: fn,
    toLocaleString: fn,
    toString: fn,
    valueOf: fn,
    // Annex B: Additional Properties of the Object.prototype Object
    // See note in header about the difference between [[Proto]] and --proto--
    // special notations.
    "--proto--": accessor,
    __defineGetter__: fn,
    __defineSetter__: fn,
    __lookupGetter__: fn,
    __lookupSetter__: fn
  },
  "%UniqueFunction%": {
    // Properties of the Function Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%FunctionPrototype%"
  },
  "%InertFunction%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%FunctionPrototype%"
  },
  "%FunctionPrototype%": {
    apply: fn,
    bind: fn,
    call: fn,
    constructor: "%InertFunction%",
    toString: fn,
    "@@hasInstance": fn,
    // proposed but not yet std. To be removed if there
    caller: false,
    // proposed but not yet std. To be removed if there
    arguments: false,
    // Seen on QuickJS. TODO grab getter for use by console
    fileName: false,
    // Seen on QuickJS. TODO grab getter for use by console
    lineNumber: false
  },
  Boolean: {
    // Properties of the Boolean Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%BooleanPrototype%"
  },
  "%BooleanPrototype%": {
    constructor: "Boolean",
    toString: fn,
    valueOf: fn
  },
  "%SharedSymbol%": {
    // Properties of the Symbol Constructor
    "[[Proto]]": "%FunctionPrototype%",
    asyncIterator: "symbol",
    for: fn,
    hasInstance: "symbol",
    isConcatSpreadable: "symbol",
    iterator: "symbol",
    keyFor: fn,
    match: "symbol",
    matchAll: "symbol",
    prototype: "%SymbolPrototype%",
    replace: "symbol",
    search: "symbol",
    species: "symbol",
    split: "symbol",
    toPrimitive: "symbol",
    toStringTag: "symbol",
    unscopables: "symbol",
    // https://github.com/tc39/proposal-explicit-resource-management
    asyncDispose: "symbol",
    // https://github.com/tc39/proposal-explicit-resource-management
    dispose: "symbol",
    // Seen at core-js https://github.com/zloirock/core-js#ecmascript-symbol
    useSimple: false,
    // Seen at core-js https://github.com/zloirock/core-js#ecmascript-symbol
    useSetter: false,
    // Seen on QuickJS
    operatorSet: false
  },
  "%SymbolPrototype%": {
    // Properties of the Symbol Prototype Object
    constructor: "%SharedSymbol%",
    description: getter,
    toString: fn,
    valueOf: fn,
    "@@toPrimitive": fn,
    "@@toStringTag": "string"
  },
  "%InitialError%": {
    // Properties of the Error Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%ErrorPrototype%",
    // Non standard, v8 only, used by tap
    captureStackTrace: fn,
    // Non standard, v8 only, used by tap, tamed to accessor
    stackTraceLimit: accessor,
    // Non standard, v8 only, used by several, tamed to accessor
    prepareStackTrace: accessor,
    // https://github.com/tc39/proposal-is-error
    isError: fn
  },
  "%SharedError%": {
    // Properties of the Error Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%ErrorPrototype%",
    // Non standard, v8 only, used by tap
    captureStackTrace: fn,
    // Non standard, v8 only, used by tap, tamed to accessor
    stackTraceLimit: accessor,
    // Non standard, v8 only, used by several, tamed to accessor
    prepareStackTrace: accessor,
    // https://github.com/tc39/proposal-is-error
    isError: fn
  },
  "%ErrorPrototype%": {
    constructor: "%SharedError%",
    message: "string",
    name: "string",
    toString: fn,
    // proposed de-facto, assumed TODO
    // Seen on FF Nightly 88.0a1
    at: false,
    // Seen on FF and XS
    stack: accessor,
    // Superfluously present in some versions of V8.
    // https://github.com/tc39/notes/blob/master/meetings/2021-10/oct-26.md#:~:text=However%2C%20Chrome%2093,and%20node%2016.11.
    cause: false
  },
  // NativeError
  EvalError: NativeError("%EvalErrorPrototype%"),
  RangeError: NativeError("%RangeErrorPrototype%"),
  ReferenceError: NativeError("%ReferenceErrorPrototype%"),
  SyntaxError: NativeError("%SyntaxErrorPrototype%"),
  TypeError: NativeError("%TypeErrorPrototype%"),
  URIError: NativeError("%URIErrorPrototype%"),
  // https://github.com/endojs/endo/issues/550
  AggregateError: NativeError("%AggregateErrorPrototype%"),
  // TODO SuppressedError
  // https://github.com/tc39/proposal-explicit-resource-management
  // SuppressedError: NativeError('%SuppressedErrorPrototype%'),
  "%EvalErrorPrototype%": NativeErrorPrototype("EvalError"),
  "%RangeErrorPrototype%": NativeErrorPrototype("RangeError"),
  "%ReferenceErrorPrototype%": NativeErrorPrototype("ReferenceError"),
  "%SyntaxErrorPrototype%": NativeErrorPrototype("SyntaxError"),
  "%TypeErrorPrototype%": NativeErrorPrototype("TypeError"),
  "%URIErrorPrototype%": NativeErrorPrototype("URIError"),
  // https://github.com/endojs/endo/issues/550
  "%AggregateErrorPrototype%": NativeErrorPrototype("AggregateError"),
  // TODO AggregateError .errors
  // TODO SuppressedError
  // https://github.com/tc39/proposal-explicit-resource-management
  // '%SuppressedErrorPrototype%': NativeErrorPrototype('SuppressedError'),
  // TODO SuppressedError .error
  // TODO SuppressedError .suppressed
  // *** Numbers and Dates
  Number: {
    // Properties of the Number Constructor
    "[[Proto]]": "%FunctionPrototype%",
    EPSILON: "number",
    isFinite: fn,
    isInteger: fn,
    isNaN: fn,
    isSafeInteger: fn,
    MAX_SAFE_INTEGER: "number",
    MAX_VALUE: "number",
    MIN_SAFE_INTEGER: "number",
    MIN_VALUE: "number",
    NaN: "number",
    NEGATIVE_INFINITY: "number",
    parseFloat: fn,
    parseInt: fn,
    POSITIVE_INFINITY: "number",
    prototype: "%NumberPrototype%"
  },
  "%NumberPrototype%": {
    // Properties of the Number Prototype Object
    constructor: "Number",
    toExponential: fn,
    toFixed: fn,
    toLocaleString: fn,
    toPrecision: fn,
    toString: fn,
    valueOf: fn
  },
  BigInt: {
    // Properties of the BigInt Constructor
    "[[Proto]]": "%FunctionPrototype%",
    asIntN: fn,
    asUintN: fn,
    prototype: "%BigIntPrototype%",
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    bitLength: false,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromArrayBuffer: false,
    // Seen on QuickJS
    tdiv: false,
    // Seen on QuickJS
    fdiv: false,
    // Seen on QuickJS
    cdiv: false,
    // Seen on QuickJS
    ediv: false,
    // Seen on QuickJS
    tdivrem: false,
    // Seen on QuickJS
    fdivrem: false,
    // Seen on QuickJS
    cdivrem: false,
    // Seen on QuickJS
    edivrem: false,
    // Seen on QuickJS
    sqrt: false,
    // Seen on QuickJS
    sqrtrem: false,
    // Seen on QuickJS
    floorLog2: false,
    // Seen on QuickJS
    ctz: false
  },
  "%BigIntPrototype%": {
    constructor: "BigInt",
    toLocaleString: fn,
    toString: fn,
    valueOf: fn,
    "@@toStringTag": "string"
  },
  "%InitialMath%": {
    ...CommonMath,
    // `%InitialMath%.random()` has the standard unsafe behavior
    random: fn
  },
  "%SharedMath%": {
    ...CommonMath,
    // `%SharedMath%.random()` is tamed to always throw
    random: fn
  },
  "%InitialDate%": {
    // Properties of the Date Constructor
    "[[Proto]]": "%FunctionPrototype%",
    now: fn,
    parse: fn,
    prototype: "%DatePrototype%",
    UTC: fn
  },
  "%SharedDate%": {
    // Properties of the Date Constructor
    "[[Proto]]": "%FunctionPrototype%",
    // `%SharedDate%.now()` is tamed to always throw
    now: fn,
    parse: fn,
    prototype: "%DatePrototype%",
    UTC: fn
  },
  "%DatePrototype%": {
    constructor: "%SharedDate%",
    getDate: fn,
    getDay: fn,
    getFullYear: fn,
    getHours: fn,
    getMilliseconds: fn,
    getMinutes: fn,
    getMonth: fn,
    getSeconds: fn,
    getTime: fn,
    getTimezoneOffset: fn,
    getUTCDate: fn,
    getUTCDay: fn,
    getUTCFullYear: fn,
    getUTCHours: fn,
    getUTCMilliseconds: fn,
    getUTCMinutes: fn,
    getUTCMonth: fn,
    getUTCSeconds: fn,
    setDate: fn,
    setFullYear: fn,
    setHours: fn,
    setMilliseconds: fn,
    setMinutes: fn,
    setMonth: fn,
    setSeconds: fn,
    setTime: fn,
    setUTCDate: fn,
    setUTCFullYear: fn,
    setUTCHours: fn,
    setUTCMilliseconds: fn,
    setUTCMinutes: fn,
    setUTCMonth: fn,
    setUTCSeconds: fn,
    toDateString: fn,
    toISOString: fn,
    toJSON: fn,
    toLocaleDateString: fn,
    toLocaleString: fn,
    toLocaleTimeString: fn,
    toString: fn,
    toTimeString: fn,
    toUTCString: fn,
    valueOf: fn,
    "@@toPrimitive": fn,
    // Annex B: Additional Properties of the Date.prototype Object
    getYear: fn,
    setYear: fn,
    toGMTString: fn
  },
  // Text Processing
  String: {
    // Properties of the String Constructor
    "[[Proto]]": "%FunctionPrototype%",
    fromCharCode: fn,
    fromCodePoint: fn,
    prototype: "%StringPrototype%",
    raw: fn,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromArrayBuffer: false
  },
  "%StringPrototype%": {
    // Properties of the String Prototype Object
    length: "number",
    charAt: fn,
    charCodeAt: fn,
    codePointAt: fn,
    concat: fn,
    constructor: "String",
    endsWith: fn,
    includes: fn,
    indexOf: fn,
    lastIndexOf: fn,
    localeCompare: fn,
    match: fn,
    matchAll: fn,
    normalize: fn,
    padEnd: fn,
    padStart: fn,
    repeat: fn,
    replace: fn,
    replaceAll: fn,
    // ES2021
    search: fn,
    slice: fn,
    split: fn,
    startsWith: fn,
    substring: fn,
    toLocaleLowerCase: fn,
    toLocaleUpperCase: fn,
    toLowerCase: fn,
    toString: fn,
    toUpperCase: fn,
    trim: fn,
    trimEnd: fn,
    trimStart: fn,
    valueOf: fn,
    "@@iterator": fn,
    // Failed tc39 proposal
    // https://github.com/tc39/proposal-relative-indexing-method
    at: fn,
    // https://github.com/tc39/proposal-is-usv-string
    isWellFormed: fn,
    toWellFormed: fn,
    unicodeSets: fn,
    // Annex B: Additional Properties of the String.prototype Object
    substr: fn,
    anchor: fn,
    big: fn,
    blink: fn,
    bold: fn,
    fixed: fn,
    fontcolor: fn,
    fontsize: fn,
    italics: fn,
    link: fn,
    small: fn,
    strike: fn,
    sub: fn,
    sup: fn,
    trimLeft: fn,
    trimRight: fn,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    compare: false,
    // Seen on QuickJS
    __quote: false
  },
  "%StringIteratorPrototype%": {
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  "%InitialRegExp%": {
    // Properties of the RegExp Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%RegExpPrototype%",
    "@@species": getter,
    // https://github.com/tc39/proposal-regex-escaping
    escape: fn,
    // The https://github.com/tc39/proposal-regexp-legacy-features
    // are all optional, unsafe, and omitted
    input: false,
    $_: false,
    lastMatch: false,
    "$&": false,
    lastParen: false,
    "$+": false,
    leftContext: false,
    "$`": false,
    rightContext: false,
    "$'": false,
    $1: false,
    $2: false,
    $3: false,
    $4: false,
    $5: false,
    $6: false,
    $7: false,
    $8: false,
    $9: false
  },
  "%SharedRegExp%": {
    // Properties of the RegExp Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%RegExpPrototype%",
    "@@species": getter,
    // https://github.com/tc39/proposal-regex-escaping
    escape: fn
  },
  "%RegExpPrototype%": {
    // Properties of the RegExp Prototype Object
    constructor: "%SharedRegExp%",
    exec: fn,
    dotAll: getter,
    flags: getter,
    global: getter,
    hasIndices: getter,
    ignoreCase: getter,
    "@@match": fn,
    "@@matchAll": fn,
    multiline: getter,
    "@@replace": fn,
    "@@search": fn,
    source: getter,
    "@@split": fn,
    sticky: getter,
    test: fn,
    toString: fn,
    unicode: getter,
    unicodeSets: getter,
    // Annex B: Additional Properties of the RegExp.prototype Object
    compile: false
    // UNSAFE and suppressed.
  },
  "%RegExpStringIteratorPrototype%": {
    // The %RegExpStringIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  // Indexed Collections
  Array: {
    // Properties of the Array Constructor
    "[[Proto]]": "%FunctionPrototype%",
    from: fn,
    isArray: fn,
    of: fn,
    prototype: "%ArrayPrototype%",
    "@@species": getter,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
    // https://tc39.es/proposal-array-from-async/
    fromAsync: fn
  },
  "%ArrayPrototype%": {
    // Properties of the Array Prototype Object
    length: "number",
    concat: fn,
    constructor: "Array",
    copyWithin: fn,
    entries: fn,
    every: fn,
    fill: fn,
    filter: fn,
    find: fn,
    findIndex: fn,
    flat: fn,
    flatMap: fn,
    forEach: fn,
    includes: fn,
    indexOf: fn,
    join: fn,
    keys: fn,
    lastIndexOf: fn,
    map: fn,
    pop: fn,
    push: fn,
    reduce: fn,
    reduceRight: fn,
    reverse: fn,
    shift: fn,
    slice: fn,
    some: fn,
    sort: fn,
    splice: fn,
    toLocaleString: fn,
    toString: fn,
    unshift: fn,
    values: fn,
    "@@iterator": fn,
    "@@unscopables": {
      "[[Proto]]": null,
      copyWithin: "boolean",
      entries: "boolean",
      fill: "boolean",
      find: "boolean",
      findIndex: "boolean",
      flat: "boolean",
      flatMap: "boolean",
      includes: "boolean",
      keys: "boolean",
      values: "boolean",
      // Failed tc39 proposal
      // https://tc39.es/proposal-relative-indexing-method/
      // Seen on FF Nightly 88.0a1
      at: "boolean",
      // See https://github.com/tc39/proposal-array-find-from-last
      findLast: "boolean",
      findLastIndex: "boolean",
      // https://github.com/tc39/proposal-change-array-by-copy
      toReversed: "boolean",
      toSorted: "boolean",
      toSpliced: "boolean",
      with: "boolean",
      // https://github.com/tc39/proposal-array-grouping
      group: "boolean",
      groupToMap: "boolean",
      groupBy: "boolean"
    },
    // See https://github.com/tc39/proposal-array-find-from-last
    findLast: fn,
    findLastIndex: fn,
    // https://github.com/tc39/proposal-change-array-by-copy
    toReversed: fn,
    toSorted: fn,
    toSpliced: fn,
    with: fn,
    // https://github.com/tc39/proposal-array-grouping
    group: fn,
    // Not in proposal? Where?
    groupToMap: fn,
    // Not in proposal? Where?
    groupBy: fn,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn
  },
  "%ArrayIteratorPrototype%": {
    // The %ArrayIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  // *** TypedArray Objects
  "%TypedArray%": {
    // Properties of the %TypedArray% Intrinsic Object
    "[[Proto]]": "%FunctionPrototype%",
    from: fn,
    of: fn,
    prototype: "%TypedArrayPrototype%",
    "@@species": getter
  },
  "%TypedArrayPrototype%": {
    buffer: getter,
    byteLength: getter,
    byteOffset: getter,
    constructor: "%TypedArray%",
    copyWithin: fn,
    entries: fn,
    every: fn,
    fill: fn,
    filter: fn,
    find: fn,
    findIndex: fn,
    forEach: fn,
    includes: fn,
    indexOf: fn,
    join: fn,
    keys: fn,
    lastIndexOf: fn,
    length: getter,
    map: fn,
    reduce: fn,
    reduceRight: fn,
    reverse: fn,
    set: fn,
    slice: fn,
    some: fn,
    sort: fn,
    subarray: fn,
    toLocaleString: fn,
    toString: fn,
    values: fn,
    "@@iterator": fn,
    "@@toStringTag": getter,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
    // See https://github.com/tc39/proposal-array-find-from-last
    findLast: fn,
    findLastIndex: fn,
    // https://github.com/tc39/proposal-change-array-by-copy
    toReversed: fn,
    toSorted: fn,
    with: fn
  },
  // The TypedArray Constructors
  BigInt64Array: TypedArray("%BigInt64ArrayPrototype%"),
  BigUint64Array: TypedArray("%BigUint64ArrayPrototype%"),
  // https://github.com/tc39/proposal-float16array
  Float16Array: TypedArray("%Float16ArrayPrototype%"),
  Float32Array: TypedArray("%Float32ArrayPrototype%"),
  Float64Array: TypedArray("%Float64ArrayPrototype%"),
  Int16Array: TypedArray("%Int16ArrayPrototype%"),
  Int32Array: TypedArray("%Int32ArrayPrototype%"),
  Int8Array: TypedArray("%Int8ArrayPrototype%"),
  Uint16Array: TypedArray("%Uint16ArrayPrototype%"),
  Uint32Array: TypedArray("%Uint32ArrayPrototype%"),
  Uint8ClampedArray: TypedArray("%Uint8ClampedArrayPrototype%"),
  Uint8Array: {
    ...TypedArray("%Uint8ArrayPrototype%"),
    // https://github.com/tc39/proposal-arraybuffer-base64
    fromBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    fromHex: fn
  },
  "%BigInt64ArrayPrototype%": TypedArrayPrototype("BigInt64Array"),
  "%BigUint64ArrayPrototype%": TypedArrayPrototype("BigUint64Array"),
  // https://github.com/tc39/proposal-float16array
  "%Float16ArrayPrototype%": TypedArrayPrototype("Float16Array"),
  "%Float32ArrayPrototype%": TypedArrayPrototype("Float32Array"),
  "%Float64ArrayPrototype%": TypedArrayPrototype("Float64Array"),
  "%Int16ArrayPrototype%": TypedArrayPrototype("Int16Array"),
  "%Int32ArrayPrototype%": TypedArrayPrototype("Int32Array"),
  "%Int8ArrayPrototype%": TypedArrayPrototype("Int8Array"),
  "%Uint16ArrayPrototype%": TypedArrayPrototype("Uint16Array"),
  "%Uint32ArrayPrototype%": TypedArrayPrototype("Uint32Array"),
  "%Uint8ClampedArrayPrototype%": TypedArrayPrototype("Uint8ClampedArray"),
  "%Uint8ArrayPrototype%": {
    ...TypedArrayPrototype("Uint8Array"),
    // https://github.com/tc39/proposal-arraybuffer-base64
    setFromBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    setFromHex: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    toBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    toHex: fn
  },
  // *** Keyed Collections
  Map: {
    // Properties of the Map Constructor
    "[[Proto]]": "%FunctionPrototype%",
    "@@species": getter,
    prototype: "%MapPrototype%",
    // https://github.com/tc39/proposal-array-grouping
    groupBy: fn
  },
  "%MapPrototype%": {
    clear: fn,
    constructor: "Map",
    delete: fn,
    entries: fn,
    forEach: fn,
    get: fn,
    has: fn,
    keys: fn,
    set: fn,
    size: getter,
    values: fn,
    "@@iterator": fn,
    "@@toStringTag": "string"
  },
  "%MapIteratorPrototype%": {
    // The %MapIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  Set: {
    // Properties of the Set Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%SetPrototype%",
    "@@species": getter,
    // Seen on QuickJS
    groupBy: false
  },
  "%SetPrototype%": {
    add: fn,
    clear: fn,
    constructor: "Set",
    delete: fn,
    entries: fn,
    forEach: fn,
    has: fn,
    keys: fn,
    size: getter,
    values: fn,
    "@@iterator": fn,
    "@@toStringTag": "string",
    // See https://github.com/tc39/proposal-set-methods
    intersection: fn,
    // See https://github.com/tc39/proposal-set-methods
    union: fn,
    // See https://github.com/tc39/proposal-set-methods
    difference: fn,
    // See https://github.com/tc39/proposal-set-methods
    symmetricDifference: fn,
    // See https://github.com/tc39/proposal-set-methods
    isSubsetOf: fn,
    // See https://github.com/tc39/proposal-set-methods
    isSupersetOf: fn,
    // See https://github.com/tc39/proposal-set-methods
    isDisjointFrom: fn
  },
  "%SetIteratorPrototype%": {
    // The %SetIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  WeakMap: {
    // Properties of the WeakMap Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%WeakMapPrototype%"
  },
  "%WeakMapPrototype%": {
    constructor: "WeakMap",
    delete: fn,
    get: fn,
    has: fn,
    set: fn,
    "@@toStringTag": "string"
  },
  WeakSet: {
    // Properties of the WeakSet Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%WeakSetPrototype%"
  },
  "%WeakSetPrototype%": {
    add: fn,
    constructor: "WeakSet",
    delete: fn,
    has: fn,
    "@@toStringTag": "string"
  },
  // *** Structured Data
  ArrayBuffer: {
    // Properties of the ArrayBuffer Constructor
    "[[Proto]]": "%FunctionPrototype%",
    isView: fn,
    prototype: "%ArrayBufferPrototype%",
    "@@species": getter,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromString: false,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromBigInt: false
  },
  "%ArrayBufferPrototype%": {
    byteLength: getter,
    constructor: "ArrayBuffer",
    slice: fn,
    "@@toStringTag": "string",
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    concat: false,
    // See https://github.com/tc39/proposal-resizablearraybuffer
    transfer: fn,
    resize: fn,
    resizable: getter,
    maxByteLength: getter,
    // https://github.com/tc39/proposal-arraybuffer-transfer
    transferToFixedLength: fn,
    detached: getter,
    // https://github.com/endojs/endo/pull/2309#issuecomment-2155513240
    // to be proposed
    transferToImmutable: fn,
    sliceToImmutable: fn,
    immutable: getter
  },
  // If this exists, it is purely an artifact of how we currently shim
  // `transferToImmutable`. As natively implemented, there would be no
  // such extra prototype.
  "%ImmutableArrayBufferPrototype%": {
    "[[Proto]]": "%ArrayBufferPrototype%",
    byteLength: getter,
    slice: fn,
    // See https://github.com/endojs/endo/tree/master/packages/immutable-arraybuffer#purposeful-violation
    "@@toStringTag": "string",
    // See https://github.com/tc39/proposal-resizablearraybuffer
    transfer: fn,
    resize: fn,
    resizable: getter,
    maxByteLength: getter,
    // https://github.com/tc39/proposal-arraybuffer-transfer
    transferToFixedLength: fn,
    detached: getter,
    // https://github.com/endojs/endo/pull/2309#issuecomment-2155513240
    // to be proposed
    transferToImmutable: fn,
    sliceToImmutable: fn,
    immutable: getter
  },
  // SharedArrayBuffer Objects
  SharedArrayBuffer: false,
  // UNSAFE and purposely suppressed.
  "%SharedArrayBufferPrototype%": false,
  // UNSAFE and purposely suppressed.
  DataView: {
    // Properties of the DataView Constructor
    "[[Proto]]": "%FunctionPrototype%",
    BYTES_PER_ELEMENT: "number",
    // Non std but undeletable on Safari.
    prototype: "%DataViewPrototype%"
  },
  "%DataViewPrototype%": {
    buffer: getter,
    byteLength: getter,
    byteOffset: getter,
    constructor: "DataView",
    getBigInt64: fn,
    getBigUint64: fn,
    // https://github.com/tc39/proposal-float16array
    getFloat16: fn,
    getFloat32: fn,
    getFloat64: fn,
    getInt8: fn,
    getInt16: fn,
    getInt32: fn,
    getUint8: fn,
    getUint16: fn,
    getUint32: fn,
    setBigInt64: fn,
    setBigUint64: fn,
    // https://github.com/tc39/proposal-float16array
    setFloat16: fn,
    setFloat32: fn,
    setFloat64: fn,
    setInt8: fn,
    setInt16: fn,
    setInt32: fn,
    setUint8: fn,
    setUint16: fn,
    setUint32: fn,
    "@@toStringTag": "string"
  },
  // Atomics
  Atomics: false,
  // UNSAFE and suppressed.
  JSON: {
    parse: fn,
    stringify: fn,
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-json-parse-with-source/
    rawJSON: fn,
    isRawJSON: fn
  },
  // *** Control Abstraction Objects
  // https://github.com/tc39/proposal-iterator-helpers
  Iterator: {
    // Properties of the Iterator Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%IteratorPrototype%",
    from: fn,
    // https://github.com/tc39/proposal-joint-iteration
    zip: fn,
    zipKeyed: fn,
    // https://github.com/tc39/proposal-iterator-sequencing
    concat: fn
  },
  "%IteratorPrototype%": {
    // The %IteratorPrototype% Object
    "@@iterator": fn,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: "Iterator",
    map: fn,
    filter: fn,
    take: fn,
    drop: fn,
    flatMap: fn,
    reduce: fn,
    toArray: fn,
    forEach: fn,
    some: fn,
    every: fn,
    find: fn,
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-async-iterator-helpers
    toAsync: fn,
    // https://github.com/tc39/proposal-explicit-resource-management
    // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
    "@@dispose": false
  },
  // https://github.com/tc39/proposal-iterator-helpers
  "%WrapForValidIteratorPrototype%": {
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    return: fn
  },
  // https://github.com/tc39/proposal-iterator-helpers
  "%IteratorHelperPrototype%": {
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    return: fn,
    "@@toStringTag": "string"
  },
  // https://github.com/tc39/proposal-async-iterator-helpers
  AsyncIterator: {
    // Properties of the Iterator Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%AsyncIteratorPrototype%",
    from: fn
  },
  "%AsyncIteratorPrototype%": {
    // The %AsyncIteratorPrototype% Object
    "@@asyncIterator": fn,
    // https://github.com/tc39/proposal-async-iterator-helpers
    constructor: "AsyncIterator",
    map: fn,
    filter: fn,
    take: fn,
    drop: fn,
    flatMap: fn,
    reduce: fn,
    toArray: fn,
    forEach: fn,
    some: fn,
    every: fn,
    find: fn,
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-explicit-resource-management
    // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
    "@@asyncDispose": false
  },
  // https://github.com/tc39/proposal-async-iterator-helpers
  "%WrapForValidAsyncIteratorPrototype%": {
    "[[Proto]]": "%AsyncIteratorPrototype%",
    next: fn,
    return: fn
  },
  // https://github.com/tc39/proposal-async-iterator-helpers
  "%AsyncIteratorHelperPrototype%": {
    "[[Proto]]": "%AsyncIteratorPrototype%",
    next: fn,
    return: fn,
    "@@toStringTag": "string"
  },
  "%InertGeneratorFunction%": {
    // Properties of the GeneratorFunction Constructor
    "[[Proto]]": "%InertFunction%",
    prototype: "%Generator%"
  },
  "%Generator%": {
    // Properties of the GeneratorFunction Prototype Object
    "[[Proto]]": "%FunctionPrototype%",
    constructor: "%InertGeneratorFunction%",
    prototype: "%GeneratorPrototype%",
    "@@toStringTag": "string"
  },
  "%InertAsyncGeneratorFunction%": {
    // Properties of the AsyncGeneratorFunction Constructor
    "[[Proto]]": "%InertFunction%",
    prototype: "%AsyncGenerator%"
  },
  "%AsyncGenerator%": {
    // Properties of the AsyncGeneratorFunction Prototype Object
    "[[Proto]]": "%FunctionPrototype%",
    constructor: "%InertAsyncGeneratorFunction%",
    prototype: "%AsyncGeneratorPrototype%",
    // length prop added here for React Native jsc-android
    // https://github.com/endojs/endo/issues/660
    // https://github.com/react-native-community/jsc-android-buildscripts/issues/181
    length: "number",
    "@@toStringTag": "string"
  },
  "%GeneratorPrototype%": {
    // Properties of the Generator Prototype Object
    "[[Proto]]": "%IteratorPrototype%",
    constructor: "%Generator%",
    next: fn,
    return: fn,
    throw: fn,
    "@@toStringTag": "string"
  },
  "%AsyncGeneratorPrototype%": {
    // Properties of the AsyncGenerator Prototype Object
    "[[Proto]]": "%AsyncIteratorPrototype%",
    constructor: "%AsyncGenerator%",
    next: fn,
    return: fn,
    throw: fn,
    "@@toStringTag": "string"
  },
  // TODO: To be replaced with Promise.delegate
  //
  // The HandledPromise global variable shimmed by `@agoric/eventual-send/shim`
  // implements an initial version of the eventual send specification at:
  // https://github.com/tc39/proposal-eventual-send
  //
  // We will likely change this to add a property to Promise called
  // Promise.delegate and put static methods on it, which will necessitate
  // another permits change to update to the current proposed standard.
  HandledPromise: {
    "[[Proto]]": "Promise",
    applyFunction: fn,
    applyFunctionSendOnly: fn,
    applyMethod: fn,
    applyMethodSendOnly: fn,
    get: fn,
    getSendOnly: fn,
    prototype: "%PromisePrototype%",
    resolve: fn
  },
  // https://github.com/tc39/proposal-source-phase-imports?tab=readme-ov-file#js-module-source
  ModuleSource: {
    "[[Proto]]": "%AbstractModuleSource%",
    prototype: "%ModuleSourcePrototype%"
  },
  "%ModuleSourcePrototype%": {
    "[[Proto]]": "%AbstractModuleSourcePrototype%",
    constructor: "ModuleSource",
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-compartments
    bindings: getter,
    needsImport: getter,
    needsImportMeta: getter,
    // @endo/module-source provides a legacy interface
    imports: getter,
    exports: getter,
    reexports: getter
  },
  "%AbstractModuleSource%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%AbstractModuleSourcePrototype%"
  },
  "%AbstractModuleSourcePrototype%": {
    constructor: "%AbstractModuleSource%"
  },
  Promise: {
    // Properties of the Promise Constructor
    "[[Proto]]": "%FunctionPrototype%",
    all: fn,
    allSettled: fn,
    // https://github.com/Agoric/SES-shim/issues/550
    any: fn,
    prototype: "%PromisePrototype%",
    race: fn,
    reject: fn,
    resolve: fn,
    // https://github.com/tc39/proposal-promise-with-resolvers
    withResolvers: fn,
    "@@species": getter,
    // https://github.com/tc39/proposal-promise-try
    try: fn
  },
  "%PromisePrototype%": {
    // Properties of the Promise Prototype Object
    catch: fn,
    constructor: "Promise",
    finally: fn,
    then: fn,
    "@@toStringTag": "string",
    // Non-standard, used in node to prevent async_hooks from breaking
    "UniqueSymbol(async_id_symbol)": accessor,
    "UniqueSymbol(trigger_async_id_symbol)": accessor,
    "UniqueSymbol(destroyed)": accessor
  },
  "%InertAsyncFunction%": {
    // Properties of the AsyncFunction Constructor
    "[[Proto]]": "%InertFunction%",
    prototype: "%AsyncFunctionPrototype%"
  },
  "%AsyncFunctionPrototype%": {
    // Properties of the AsyncFunction Prototype Object
    "[[Proto]]": "%FunctionPrototype%",
    constructor: "%InertAsyncFunction%",
    // length prop added here for React Native jsc-android
    // https://github.com/endojs/endo/issues/660
    // https://github.com/react-native-community/jsc-android-buildscripts/issues/181
    length: "number",
    "@@toStringTag": "string"
  },
  // Reflection
  Reflect: {
    // The Reflect Object
    // Not a function object.
    apply: fn,
    construct: fn,
    defineProperty: fn,
    deleteProperty: fn,
    get: fn,
    getOwnPropertyDescriptor: fn,
    getPrototypeOf: fn,
    has: fn,
    isExtensible: fn,
    ownKeys: fn,
    preventExtensions: fn,
    set: fn,
    setPrototypeOf: fn,
    "@@toStringTag": "string"
  },
  Proxy: {
    // Properties of the Proxy Constructor
    "[[Proto]]": "%FunctionPrototype%",
    revocable: fn
  },
  // Appendix B
  // Annex B: Additional Properties of the Global Object
  escape: fn,
  unescape: fn,
  // Proposed
  "%UniqueCompartment%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%CompartmentPrototype%",
    toString: fn
  },
  "%InertCompartment%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%CompartmentPrototype%",
    toString: fn
  },
  "%CompartmentPrototype%": {
    constructor: "%InertCompartment%",
    evaluate: fn,
    globalThis: getter,
    name: getter,
    import: asyncFn,
    load: asyncFn,
    importNow: fn,
    module: fn,
    "@@toStringTag": "string"
  },
  lockdown: fn,
  harden: { ...fn, isFake: "boolean" },
  "%InitialGetStackString%": fn
};

// node_modules/ses/src/intrinsics.js
var isFunction = (obj) => typeof obj === "function";
function initProperty(obj, name, desc) {
  if (hasOwn(obj, name)) {
    const preDesc = getOwnPropertyDescriptor(obj, name);
    if (!preDesc || !is(preDesc.value, desc.value) || preDesc.get !== desc.get || preDesc.set !== desc.set || preDesc.writable !== desc.writable || preDesc.enumerable !== desc.enumerable || preDesc.configurable !== desc.configurable) {
      throw TypeError2(`Conflicting definitions of ${name}`);
    }
  }
  defineProperty(obj, name, desc);
}
function initProperties(obj, descs) {
  for (const [name, desc] of entries(descs)) {
    initProperty(obj, name, desc);
  }
}
function sampleGlobals(globalObject, newPropertyNames) {
  const newIntrinsics = { __proto__: null };
  for (const [globalName, intrinsicName] of entries(newPropertyNames)) {
    if (hasOwn(globalObject, globalName)) {
      newIntrinsics[intrinsicName] = globalObject[globalName];
    }
  }
  return newIntrinsics;
}
var makeIntrinsicsCollector = (reporter) => {
  const intrinsics = create(null);
  let pseudoNatives;
  const addIntrinsics = (newIntrinsics) => {
    initProperties(intrinsics, getOwnPropertyDescriptors(newIntrinsics));
  };
  freeze(addIntrinsics);
  const completePrototypes = () => {
    for (const [name, intrinsic] of entries(intrinsics)) {
      if (isPrimitive(intrinsic)) {
        continue;
      }
      if (!hasOwn(intrinsic, "prototype")) {
        continue;
      }
      const permit = permitted[name];
      if (typeof permit !== "object") {
        throw TypeError2(`Expected permit object at permits.${name}`);
      }
      const namePrototype = permit.prototype;
      if (!namePrototype) {
        cauterizeProperty(
          intrinsic,
          "prototype",
          false,
          `${name}.prototype`,
          reporter
        );
        continue;
      }
      if (typeof namePrototype !== "string" || !hasOwn(permitted, namePrototype)) {
        throw TypeError2(`Unrecognized ${name}.prototype permits entry`);
      }
      const intrinsicPrototype = intrinsic.prototype;
      if (hasOwn(intrinsics, namePrototype)) {
        if (intrinsics[namePrototype] !== intrinsicPrototype) {
          throw TypeError2(`Conflicting bindings of ${namePrototype}`);
        }
        continue;
      }
      intrinsics[namePrototype] = intrinsicPrototype;
    }
  };
  freeze(completePrototypes);
  const finalIntrinsics = () => {
    freeze(intrinsics);
    pseudoNatives = new WeakSet(arrayFilter(values(intrinsics), isFunction));
    return intrinsics;
  };
  freeze(finalIntrinsics);
  const isPseudoNative = (obj) => {
    if (!pseudoNatives) {
      throw TypeError2(
        "isPseudoNative can only be called after finalIntrinsics"
      );
    }
    return weaksetHas(pseudoNatives, obj);
  };
  freeze(isPseudoNative);
  const intrinsicsCollector = {
    addIntrinsics,
    completePrototypes,
    finalIntrinsics,
    isPseudoNative
  };
  freeze(intrinsicsCollector);
  addIntrinsics(constantProperties);
  addIntrinsics(sampleGlobals(universalThis, universalPropertyNames));
  return intrinsicsCollector;
};
var getGlobalIntrinsics = (globalObject, reporter) => {
  const { addIntrinsics, finalIntrinsics } = makeIntrinsicsCollector(reporter);
  addIntrinsics(sampleGlobals(globalObject, sharedGlobalPropertyNames));
  return finalIntrinsics();
};

// node_modules/ses/src/permits-intrinsics.js
function removeUnpermittedIntrinsics(intrinsics, markVirtualizedNativeFunction3, reporter) {
  const primitives = ["undefined", "boolean", "number", "string", "symbol"];
  const wellKnownSymbolNames = new Map2(
    Symbol2 ? arrayMap(
      arrayFilter(
        entries(permitted["%SharedSymbol%"]),
        ([name, permit]) => permit === "symbol" && typeof Symbol2[name] === "symbol"
      ),
      ([name]) => [Symbol2[name], `@@${name}`]
    ) : []
  );
  function asStringPropertyName(path, prop) {
    if (typeof prop === "string") {
      return prop;
    }
    const wellKnownSymbol = mapGet(wellKnownSymbolNames, prop);
    if (typeof prop === "symbol") {
      if (wellKnownSymbol) {
        return wellKnownSymbol;
      } else {
        const registeredKey = symbolKeyFor(prop);
        if (registeredKey !== void 0) {
          return `RegisteredSymbol(${registeredKey})`;
        } else {
          return `Unique${String2(prop)}`;
        }
      }
    }
    throw TypeError2(`Unexpected property name type ${path} ${prop}`);
  }
  function visitPrototype(path, obj, protoName) {
    if (isPrimitive(obj)) {
      throw TypeError2(`Object expected: ${path}, ${String2(obj)}, ${protoName}`);
    }
    const proto = getPrototypeOf(obj);
    if (proto === null && protoName === null) {
      return;
    }
    if (protoName !== void 0 && typeof protoName !== "string") {
      throw TypeError2(`Malformed permit ${path}.__proto__`);
    }
    if (proto === intrinsics[protoName || "%ObjectPrototype%"]) {
      return;
    }
    throw TypeError2(
      `Unexpected [[Prototype]] at ${path}.__proto__ (expected ${protoName || "%ObjectPrototype%"})`
    );
  }
  function isAllowedPropertyValue(path, value, prop, permit) {
    if (typeof permit === "object") {
      visitProperties(path, value, permit);
      return true;
    }
    if (permit === false) {
      return false;
    }
    if (typeof permit === "string") {
      if (prop === "prototype" || prop === "constructor") {
        if (hasOwn(intrinsics, permit)) {
          if (value !== intrinsics[permit]) {
            throw TypeError2(`Does not match permit for ${path}`);
          }
          return true;
        }
      } else {
        if (arrayIncludes(primitives, permit)) {
          if (typeof value !== permit) {
            throw TypeError2(
              `At ${path} expected ${permit} not ${typeof value}`
            );
          }
          return true;
        }
      }
    }
    throw TypeError2(
      `Unexpected property ${prop} with permit ${permit} at ${path}`
    );
  }
  function isAllowedProperty(path, obj, prop, permit) {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc) {
      throw TypeError2(`Property ${prop} not found at ${path}`);
    }
    if (hasOwn(desc, "value")) {
      if (isAccessorPermit(permit)) {
        throw TypeError2(`Accessor expected at ${path}`);
      }
      return isAllowedPropertyValue(path, desc.value, prop, permit);
    }
    if (!isAccessorPermit(permit)) {
      throw TypeError2(`Accessor not expected at ${path}`);
    }
    return isAllowedPropertyValue(`${path}<get>`, desc.get, prop, permit.get) && isAllowedPropertyValue(`${path}<set>`, desc.set, prop, permit.set);
  }
  function getSubPermit(obj, permit, prop) {
    const permitProp = prop === "__proto__" ? "--proto--" : prop;
    if (hasOwn(permit, permitProp)) {
      return permit[permitProp];
    }
    if (typeof obj === "function") {
      if (hasOwn(FunctionInstance, permitProp)) {
        return FunctionInstance[permitProp];
      }
    }
    return void 0;
  }
  function visitProperties(path, obj, permit) {
    if (obj === void 0 || obj === null) {
      return;
    }
    const protoName = permit["[[Proto]]"];
    visitPrototype(path, obj, protoName);
    if (typeof obj === "function") {
      markVirtualizedNativeFunction3(obj);
    }
    for (const prop of ownKeys(obj)) {
      const propString = asStringPropertyName(path, prop);
      const subPath = `${path}.${propString}`;
      const subPermit = getSubPermit(obj, permit, propString);
      if (!subPermit || !isAllowedProperty(subPath, obj, prop, subPermit)) {
        cauterizeProperty(obj, prop, subPermit === false, subPath, reporter);
      }
    }
  }
  visitProperties("intrinsics", intrinsics, permitted);
}

// node_modules/ses/src/tame-function-constructors.js
function tameFunctionConstructors() {
  try {
    FERAL_FUNCTION.prototype.constructor("return 1");
  } catch (ignore) {
    return freeze({});
  }
  const newIntrinsics = {};
  function repairFunction(name, intrinsicName, declaration) {
    let FunctionInstance2;
    try {
      FunctionInstance2 = (0, eval)(declaration);
    } catch (e) {
      if (e instanceof SyntaxError2) {
        return;
      }
      throw e;
    }
    const FunctionPrototype = getPrototypeOf(FunctionInstance2);
    const InertConstructor = function() {
      throw TypeError2(
        "Function.prototype.constructor is not a valid constructor."
      );
    };
    defineProperties(InertConstructor, {
      prototype: { value: FunctionPrototype },
      name: {
        value: name,
        writable: false,
        enumerable: false,
        configurable: true
      }
    });
    defineProperties(FunctionPrototype, {
      constructor: { value: InertConstructor }
    });
    if (InertConstructor !== FERAL_FUNCTION.prototype.constructor) {
      setPrototypeOf(InertConstructor, FERAL_FUNCTION.prototype.constructor);
    }
    newIntrinsics[intrinsicName] = InertConstructor;
  }
  repairFunction("Function", "%InertFunction%", "(function(){})");
  repairFunction(
    "GeneratorFunction",
    "%InertGeneratorFunction%",
    "(function*(){})"
  );
  repairFunction(
    "AsyncFunction",
    "%InertAsyncFunction%",
    "(async function(){})"
  );
  if (AsyncGeneratorFunctionInstance !== void 0) {
    repairFunction(
      "AsyncGeneratorFunction",
      "%InertAsyncGeneratorFunction%",
      "(async function*(){})"
    );
  }
  return newIntrinsics;
}

// node_modules/ses/src/tame-date-constructor.js
function tameDateConstructor() {
  const OriginalDate = Date2;
  const DatePrototype = OriginalDate.prototype;
  const tamedMethods3 = {
    /**
     * `%SharedDate%.now()` throw a `TypeError` starting with "secure mode".
     * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
     */
    now() {
      throw TypeError2("secure mode Calling %SharedDate%.now() throws");
    }
  };
  const makeDateConstructor = ({ powers = "none" } = {}) => {
    let ResultDate;
    if (powers === "original") {
      ResultDate = function Date3(...rest) {
        if (new.target === void 0) {
          return apply(OriginalDate, void 0, rest);
        }
        return construct(OriginalDate, rest, new.target);
      };
    } else {
      ResultDate = function Date3(...rest) {
        if (new.target === void 0) {
          throw TypeError2(
            "secure mode Calling %SharedDate% constructor as a function throws"
          );
        }
        if (rest.length === 0) {
          throw TypeError2(
            "secure mode Calling new %SharedDate%() with no arguments throws"
          );
        }
        return construct(OriginalDate, rest, new.target);
      };
    }
    defineProperties(ResultDate, {
      length: { value: 7 },
      prototype: {
        value: DatePrototype,
        writable: false,
        enumerable: false,
        configurable: false
      },
      parse: {
        value: OriginalDate.parse,
        writable: true,
        enumerable: false,
        configurable: true
      },
      UTC: {
        value: OriginalDate.UTC,
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    return ResultDate;
  };
  const InitialDate = makeDateConstructor({ powers: "original" });
  const SharedDate = makeDateConstructor({ powers: "none" });
  defineProperties(InitialDate, {
    now: {
      value: OriginalDate.now,
      writable: true,
      enumerable: false,
      configurable: true
    }
  });
  defineProperties(SharedDate, {
    now: {
      value: tamedMethods3.now,
      writable: true,
      enumerable: false,
      configurable: true
    }
  });
  defineProperties(DatePrototype, {
    constructor: { value: SharedDate }
  });
  return {
    "%InitialDate%": InitialDate,
    "%SharedDate%": SharedDate
  };
}

// node_modules/ses/src/tame-math-object.js
function tameMathObject() {
  const originalMath = Math2;
  const initialMath = originalMath;
  const { random: _, ...otherDescriptors } = getOwnPropertyDescriptors(originalMath);
  const tamedMethods3 = {
    /**
     * `%SharedMath%.random()` throws a TypeError starting with "secure mode".
     * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
     */
    random() {
      throw TypeError2("secure mode %SharedMath%.random() throws");
    }
  };
  const sharedMath = create(objectPrototype, {
    ...otherDescriptors,
    random: {
      value: tamedMethods3.random,
      writable: true,
      enumerable: false,
      configurable: true
    }
  });
  return {
    "%InitialMath%": initialMath,
    "%SharedMath%": sharedMath
  };
}

// node_modules/ses/src/tame-regexp-constructor.js
function tameRegExpConstructor(regExpTaming = "safe") {
  const RegExpPrototype = FERAL_REG_EXP.prototype;
  const makeRegExpConstructor = (_ = {}) => {
    const ResultRegExp = function RegExp2(...rest) {
      if (new.target === void 0) {
        return FERAL_REG_EXP(...rest);
      }
      return construct(FERAL_REG_EXP, rest, new.target);
    };
    defineProperties(ResultRegExp, {
      length: { value: 2 },
      prototype: {
        value: RegExpPrototype,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });
    if (speciesSymbol) {
      const speciesDesc = getOwnPropertyDescriptor(
        FERAL_REG_EXP,
        speciesSymbol
      );
      if (!speciesDesc) {
        throw TypeError2("no RegExp[Symbol.species] descriptor");
      }
      defineProperties(ResultRegExp, {
        [speciesSymbol]: speciesDesc
      });
    }
    return ResultRegExp;
  };
  const InitialRegExp = makeRegExpConstructor();
  const SharedRegExp = makeRegExpConstructor();
  if (regExpTaming !== "unsafe") {
    delete RegExpPrototype.compile;
  }
  defineProperties(RegExpPrototype, {
    constructor: { value: SharedRegExp }
  });
  return {
    "%InitialRegExp%": InitialRegExp,
    "%SharedRegExp%": SharedRegExp
  };
}

// node_modules/ses/src/enablements.js
var minEnablements = {
  "%ObjectPrototype%": {
    toString: true
  },
  "%FunctionPrototype%": {
    toString: true
    // set by "rollup"
  },
  "%ErrorPrototype%": {
    name: true
    // set by "precond", "ava", "node-fetch"
  },
  "%IteratorPrototype%": {
    toString: true,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: true,
    // https://github.com/tc39/proposal-iterator-helpers
    [toStringTagSymbol]: true
  }
};
var moderateEnablements = {
  "%ObjectPrototype%": {
    toString: true,
    valueOf: true
  },
  "%ArrayPrototype%": {
    toString: true,
    push: true,
    // set by "Google Analytics"
    concat: true,
    // set by mobx generated code (old TS compiler?)
    [iteratorSymbol]: true
    // set by mobx generated code (old TS compiler?)
  },
  // Function.prototype has no 'prototype' property to enable.
  // Function instances have their own 'name' and 'length' properties
  // which are configurable and non-writable. Thus, they are already
  // non-assignable anyway.
  "%FunctionPrototype%": {
    constructor: true,
    // set by "regenerator-runtime"
    bind: true,
    // set by "underscore", "express"
    toString: true
    // set by "rollup"
  },
  "%ErrorPrototype%": {
    constructor: true,
    // set by "fast-json-patch", "node-fetch"
    message: true,
    name: true,
    // set by "precond", "ava", "node-fetch", "node 14"
    toString: true
    // set by "bluebird"
  },
  "%TypeErrorPrototype%": {
    constructor: true,
    // set by "readable-stream"
    message: true,
    // set by "tape"
    name: true
    // set by "readable-stream", "node 14"
  },
  "%SyntaxErrorPrototype%": {
    message: true,
    // to match TypeErrorPrototype.message
    name: true
    // set by "node 14"
  },
  "%RangeErrorPrototype%": {
    message: true,
    // to match TypeErrorPrototype.message
    name: true
    // set by "node 14"
  },
  "%URIErrorPrototype%": {
    message: true,
    // to match TypeErrorPrototype.message
    name: true
    // set by "node 14"
  },
  "%EvalErrorPrototype%": {
    message: true,
    // to match TypeErrorPrototype.message
    name: true
    // set by "node 14"
  },
  "%ReferenceErrorPrototype%": {
    message: true,
    // to match TypeErrorPrototype.message
    name: true
    // set by "node 14"
  },
  // https://github.com/endojs/endo/issues/550
  "%AggregateErrorPrototype%": {
    message: true,
    // to match TypeErrorPrototype.message
    name: true
    // set by "node 14"?
  },
  "%PromisePrototype%": {
    constructor: true
    // set by "core-js"
  },
  "%TypedArrayPrototype%": "*",
  // set by https://github.com/feross/buffer
  "%Generator%": {
    constructor: true,
    name: true,
    toString: true
  },
  "%IteratorPrototype%": {
    toString: true,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: true,
    // https://github.com/tc39/proposal-iterator-helpers
    [toStringTagSymbol]: true
  }
};
var severeEnablements = {
  ...moderateEnablements,
  /**
   * Rollup (as used at least by vega) and webpack
   * (as used at least by regenerator) both turn exports into assignments
   * to a big `exports` object that inherits directly from
   * `Object.prototype`. Some of the exported names we've seen include
   * `hasOwnProperty`, `constructor`, and `toString`. But the strategy used
   * by rollup and webpack potentionally turns any exported name
   * into an assignment rejected by the override mistake. That's why
   * the `severe` enablements takes the extreme step of enabling
   * everything on `Object.prototype`.
   *
   * In addition, code doing inheritance manually will often override
   * the `constructor` property on the new prototype by assignment. We've
   * seen this several times.
   *
   * The cost of enabling all these is that they create a miserable debugging
   * experience specifically on Node.
   * https://github.com/Agoric/agoric-sdk/issues/2324
   * explains how it confused the Node console.
   *
   * (TODO Reexamine the vscode situation. I think it may have improved
   * since the following paragraph was written.)
   *
   * The vscode debugger's object inspector shows the own data properties of
   * an object, which is typically what you want, but also shows both getter
   * and setter for every accessor property whether inherited or own.
   * With the `'*'` setting here, all the properties inherited from
   * `Object.prototype` are accessors, creating an unusable display as seen
   * at As explained at
   * https://github.com/endojs/endo/blob/master/packages/ses/docs/lockdown.md#overridetaming-options
   * Open the triangles at the bottom of that section.
   */
  "%ObjectPrototype%": "*",
  /**
   * The widely used Buffer defined at https://github.com/feross/buffer
   * on initialization, manually creates the equivalent of a subclass of
   * `TypedArray`, which it then initializes by assignment. These assignments
   * include enough of the `TypeArray` methods that here, the `severe`
   * enablements just enable them all.
   */
  "%TypedArrayPrototype%": "*",
  /**
   * Needed to work with Immer before https://github.com/immerjs/immer/pull/914
   * is accepted.
   */
  "%MapPrototype%": "*",
  /**
   * Needed to work with Immer before https://github.com/immerjs/immer/pull/914
   * is accepted.
   */
  "%SetPrototype%": "*"
};

// node_modules/ses/src/enable-property-overrides.js
function enablePropertyOverrides(intrinsics, overrideTaming, { warn }, overrideDebug = []) {
  const debugProperties = new Set(overrideDebug);
  function enable(path, obj, prop, desc) {
    if ("value" in desc && desc.configurable) {
      const { value } = desc;
      const isDebug = setHas(debugProperties, prop);
      const { get: getter2, set: setter } = getOwnPropertyDescriptor(
        {
          get [prop]() {
            return value;
          },
          set [prop](newValue) {
            if (obj === this) {
              throw TypeError2(
                `Cannot assign to read only property '${String2(
                  prop
                )}' of '${path}'`
              );
            }
            if (hasOwn(this, prop)) {
              this[prop] = newValue;
            } else {
              if (isDebug) {
                warn(TypeError2(`Override property ${prop}`));
              }
              defineProperty(this, prop, {
                value: newValue,
                writable: true,
                enumerable: true,
                configurable: true
              });
            }
          }
        },
        prop
      );
      defineProperty(getter2, "originalValue", {
        value,
        writable: false,
        enumerable: false,
        configurable: false
      });
      defineProperty(obj, prop, {
        get: getter2,
        set: setter,
        enumerable: desc.enumerable,
        configurable: desc.configurable
      });
    }
  }
  function enableProperty(path, obj, prop) {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc) {
      return;
    }
    enable(path, obj, prop, desc);
  }
  function enableAllProperties(path, obj) {
    const descs = getOwnPropertyDescriptors(obj);
    if (!descs) {
      return;
    }
    arrayForEach(ownKeys(descs), (prop) => enable(path, obj, prop, descs[prop]));
  }
  function enableProperties(path, obj, plan2) {
    for (const prop of ownKeys(plan2)) {
      const desc = getOwnPropertyDescriptor(obj, prop);
      if (!desc || desc.get || desc.set) {
        continue;
      }
      const subPath = `${path}.${String2(prop)}`;
      const subPlan = plan2[prop];
      if (subPlan === true) {
        enableProperty(subPath, obj, prop);
      } else if (subPlan === "*") {
        enableAllProperties(subPath, desc.value);
      } else if (!isPrimitive(subPlan)) {
        enableProperties(subPath, desc.value, subPlan);
      } else {
        throw TypeError2(`Unexpected override enablement plan ${subPath}`);
      }
    }
  }
  let plan;
  switch (overrideTaming) {
    case "min": {
      plan = minEnablements;
      break;
    }
    case "moderate": {
      plan = moderateEnablements;
      break;
    }
    case "severe": {
      plan = severeEnablements;
      break;
    }
    default: {
      throw TypeError2(`unrecognized overrideTaming ${overrideTaming}`);
    }
  }
  enableProperties("root", intrinsics, plan);
}

// node_modules/ses/src/tame-locale-methods.js
var { Fail: Fail2, quote: q2 } = assert;
var localePattern = /^(\w*[a-z])Locale([A-Z]\w*)$/;
var tamedMethods = {
  // See https://tc39.es/ecma262/#sec-string.prototype.localecompare
  localeCompare(arg) {
    if (this === null || this === void 0) {
      throw TypeError2(
        'Cannot localeCompare with null or undefined "this" value'
      );
    }
    const s = `${this}`;
    const that = `${arg}`;
    if (s < that) {
      return -1;
    }
    if (s > that) {
      return 1;
    }
    s === that || Fail2`expected ${q2(s)} and ${q2(that)} to compare`;
    return 0;
  },
  toString() {
    return `${this}`;
  }
};
var nonLocaleCompare = tamedMethods.localeCompare;
var numberToString = tamedMethods.toString;
function tameLocaleMethods(intrinsics, localeTaming = "safe") {
  if (localeTaming === "unsafe") {
    return;
  }
  defineProperty(String2.prototype, "localeCompare", {
    value: nonLocaleCompare
  });
  for (const intrinsicName of getOwnPropertyNames(intrinsics)) {
    const intrinsic = intrinsics[intrinsicName];
    if (!isPrimitive(intrinsic)) {
      for (const methodName of getOwnPropertyNames(intrinsic)) {
        const match = regexpExec(localePattern, methodName);
        if (match) {
          typeof intrinsic[methodName] === "function" || Fail2`expected ${q2(methodName)} to be a function`;
          const nonLocaleMethodName = `${match[1]}${match[2]}`;
          const method = intrinsic[nonLocaleMethodName];
          typeof method === "function" || Fail2`function ${q2(nonLocaleMethodName)} not found`;
          defineProperty(intrinsic, methodName, { value: method });
        }
      }
    }
  }
  defineProperty(Number2.prototype, "toLocaleString", {
    value: numberToString
  });
}

// node_modules/ses/src/make-eval-function.js
var makeEvalFunction = (evaluator) => {
  const newEval = {
    eval(source) {
      if (typeof source !== "string") {
        return source;
      }
      return evaluator(source);
    }
  }.eval;
  return newEval;
};

// node_modules/ses/src/make-function-constructor.js
var { Fail: Fail3 } = assert;
var makeFunctionConstructor = (evaluator) => {
  const newFunction = function Function2(_body) {
    const bodyText = `${arrayPop(arguments) || ""}`;
    const parameters = `${arrayJoin(arguments, ",")}`;
    new FERAL_FUNCTION(parameters, "");
    new FERAL_FUNCTION(bodyText);
    const src = `(function anonymous(${parameters}
) {
${bodyText}
})`;
    return evaluator(src);
  };
  defineProperties(newFunction, {
    // Ensure that any function created in any evaluator in a realm is an
    // instance of Function in any evaluator of the same realm.
    prototype: {
      value: FERAL_FUNCTION.prototype,
      writable: false,
      enumerable: false,
      configurable: false
    }
  });
  getPrototypeOf(FERAL_FUNCTION) === FERAL_FUNCTION.prototype || Fail3`Function prototype is the same accross compartments`;
  getPrototypeOf(newFunction) === FERAL_FUNCTION.prototype || Fail3`Function constructor prototype is the same across compartments`;
  return newFunction;
};

// node_modules/ses/src/global-object.js
var setGlobalObjectSymbolUnscopables = (globalObject) => {
  defineProperty(
    globalObject,
    unscopablesSymbol,
    freeze(
      assign(create(null), {
        set: freeze(() => {
          throw TypeError2(
            `Cannot set Symbol.unscopables of a Compartment's globalThis`
          );
        }),
        enumerable: false,
        configurable: false
      })
    )
  );
};
var setGlobalObjectConstantProperties = (globalObject) => {
  for (const [name, constant] of entries(constantProperties)) {
    defineProperty(globalObject, name, {
      value: constant,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
};
var setGlobalObjectMutableProperties = (globalObject, {
  intrinsics,
  newGlobalPropertyNames,
  makeCompartmentConstructor: makeCompartmentConstructor2,
  markVirtualizedNativeFunction: markVirtualizedNativeFunction3,
  parentCompartment
}) => {
  for (const [name, intrinsicName] of entries(universalPropertyNames)) {
    if (hasOwn(intrinsics, intrinsicName)) {
      defineProperty(globalObject, name, {
        value: intrinsics[intrinsicName],
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
  for (const [name, intrinsicName] of entries(newGlobalPropertyNames)) {
    if (hasOwn(intrinsics, intrinsicName)) {
      defineProperty(globalObject, name, {
        value: intrinsics[intrinsicName],
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
  const perCompartmentGlobals = {
    globalThis: globalObject
  };
  perCompartmentGlobals.Compartment = freeze(
    makeCompartmentConstructor2(
      makeCompartmentConstructor2,
      intrinsics,
      markVirtualizedNativeFunction3,
      {
        parentCompartment,
        enforceNew: true
      }
    )
  );
  for (const [name, value] of entries(perCompartmentGlobals)) {
    defineProperty(globalObject, name, {
      value,
      writable: true,
      enumerable: false,
      configurable: true
    });
    if (typeof value === "function") {
      markVirtualizedNativeFunction3(value);
    }
  }
};
var setGlobalObjectEvaluators = (globalObject, evaluator, markVirtualizedNativeFunction3) => {
  {
    const f = freeze(makeEvalFunction(evaluator));
    markVirtualizedNativeFunction3(f);
    defineProperty(globalObject, "eval", {
      value: f,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
  {
    const f = freeze(makeFunctionConstructor(evaluator));
    markVirtualizedNativeFunction3(f);
    defineProperty(globalObject, "Function", {
      value: f,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
};

// node_modules/ses/src/strict-scope-terminator.js
var { Fail: Fail4, quote: q3 } = assert;
var objTarget = freeze({ __proto__: null });
var alwaysThrowHandler = new Proxy2(
  objTarget,
  freeze({
    get(_shadow, prop) {
      Fail4`Please report unexpected scope handler trap: ${q3(String2(prop))}`;
    }
  })
);
var scopeProxyHandlerProperties = {
  get(_shadow, _prop) {
    return void 0;
  },
  set(_shadow, prop, _value) {
    throw ReferenceError2(`${String2(prop)} is not defined`);
  },
  has(_shadow, prop) {
    return true;
  },
  // note: this is likely a bug of safari
  // https://bugs.webkit.org/show_bug.cgi?id=195534
  getPrototypeOf(_shadow) {
    return null;
  },
  // See https://github.com/endojs/endo/issues/1510
  // TODO: report as bug to v8 or Chrome, and record issue link here.
  getOwnPropertyDescriptor(_shadow, prop) {
    const quotedProp = q3(String2(prop));
    console.warn(
      `getOwnPropertyDescriptor trap on scopeTerminatorHandler for ${quotedProp}`,
      TypeError2().stack
    );
    return void 0;
  },
  // See https://github.com/endojs/endo/issues/1490
  // TODO Report bug to JSC or Safari
  ownKeys(_shadow) {
    return [];
  }
};
var strictScopeTerminatorHandler = freeze(
  create(
    alwaysThrowHandler,
    getOwnPropertyDescriptors(scopeProxyHandlerProperties)
  )
);
var strictScopeTerminator = new Proxy2(
  objTarget,
  strictScopeTerminatorHandler
);

// node_modules/ses/src/sloppy-globals-scope-terminator.js
var objTarget2 = freeze({ __proto__: null });
var createSloppyGlobalsScopeTerminator = (globalObject) => {
  const scopeProxyHandlerProperties2 = {
    // inherit scopeTerminator behavior
    ...strictScopeTerminatorHandler,
    // Redirect set properties to the globalObject.
    set(_shadow, prop, value) {
      return reflectSet(globalObject, prop, value);
    },
    // Always claim to have a potential property in order to be the recipient of a set
    has(_shadow, _prop) {
      return true;
    }
  };
  const sloppyGlobalsScopeTerminatorHandler = freeze(
    create(
      alwaysThrowHandler,
      getOwnPropertyDescriptors(scopeProxyHandlerProperties2)
    )
  );
  const sloppyGlobalsScopeTerminator = new Proxy2(
    objTarget2,
    sloppyGlobalsScopeTerminatorHandler
  );
  return sloppyGlobalsScopeTerminator;
};
freeze(createSloppyGlobalsScopeTerminator);

// node_modules/ses/src/eval-scope.js
var { Fail: Fail5 } = assert;
var makeEvalScopeKit = () => {
  const evalScope = create(null);
  const oneTimeEvalProperties = freeze({
    eval: {
      get() {
        delete evalScope.eval;
        return FERAL_EVAL;
      },
      enumerable: false,
      configurable: true
    }
  });
  const evalScopeKit = {
    evalScope,
    allowNextEvalToBeUnsafe() {
      const { revoked } = evalScopeKit;
      if (revoked !== null) {
        Fail5`a handler did not reset allowNextEvalToBeUnsafe ${revoked.err}`;
      }
      defineProperties(evalScope, oneTimeEvalProperties);
    },
    /** @type {null | { err: any }} */
    revoked: null
  };
  return evalScopeKit;
};

// node_modules/ses/src/get-source-url.js
var sourceMetaEntryRegExp = "\\s*[@#]\\s*([a-zA-Z][a-zA-Z0-9]*)\\s*=\\s*([^\\s\\*]*)";
var sourceMetaEntriesRegExp = new FERAL_REG_EXP(
  `(?:\\s*//${sourceMetaEntryRegExp}|/\\*${sourceMetaEntryRegExp}\\s*\\*/)\\s*$`
);
var getSourceURL = (src) => {
  let sourceURL = "<unknown>";
  while (src.length > 0) {
    const match = regexpExec(sourceMetaEntriesRegExp, src);
    if (match === null) {
      break;
    }
    src = stringSlice(src, 0, src.length - match[0].length);
    if (match[3] === "sourceURL") {
      sourceURL = match[4];
    } else if (match[1] === "sourceURL") {
      sourceURL = match[2];
    }
  }
  return sourceURL;
};

// node_modules/ses/src/transforms.js
function getLineNumber(src, pattern) {
  const index = stringSearch(src, pattern);
  if (index < 0) {
    return -1;
  }
  const adjustment = src[index] === "\n" ? 1 : 0;
  return stringSplit(stringSlice(src, 0, index), "\n").length + adjustment;
}
var htmlCommentPattern = new FERAL_REG_EXP(`(?:${"<"}!--|--${">"})`, "g");
var rejectHtmlComments = (src) => {
  const lineNumber = getLineNumber(src, htmlCommentPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  throw SyntaxError2(
    `Possible HTML comment rejected at ${name}:${lineNumber}. (SES_HTML_COMMENT_REJECTED)`
  );
};
var evadeHtmlCommentTest = (src) => {
  const replaceFn = (match) => match[0] === "<" ? "< ! --" : "-- >";
  return stringReplace(src, htmlCommentPattern, replaceFn);
};
var importPattern = new FERAL_REG_EXP(
  "(^|[^.]|\\.\\.\\.)\\bimport(\\s*(?:\\(|/[/*]))",
  "g"
);
var rejectImportExpressions = (src) => {
  const lineNumber = getLineNumber(src, importPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  throw SyntaxError2(
    `Possible import expression rejected at ${name}:${lineNumber}. (SES_IMPORT_REJECTED)`
  );
};
var evadeImportExpressionTest = (src) => {
  const replaceFn = (_, p1, p2) => `${p1}__import__${p2}`;
  return stringReplace(src, importPattern, replaceFn);
};
var someDirectEvalPattern = new FERAL_REG_EXP(
  "(^|[^.])\\beval(\\s*\\()",
  "g"
);
var rejectSomeDirectEvalExpressions = (src) => {
  const lineNumber = getLineNumber(src, someDirectEvalPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  throw SyntaxError2(
    `Possible direct eval expression rejected at ${name}:${lineNumber}. (SES_EVAL_REJECTED)`
  );
};
var mandatoryTransforms = (source) => {
  source = rejectHtmlComments(source);
  source = rejectImportExpressions(source);
  return source;
};
var applyTransforms = (source, transforms2) => {
  for (let i = 0, l = transforms2.length; i < l; i += 1) {
    const transform = transforms2[i];
    source = transform(source);
  }
  return source;
};
var transforms = freeze({
  rejectHtmlComments: freeze(rejectHtmlComments),
  evadeHtmlCommentTest: freeze(evadeHtmlCommentTest),
  rejectImportExpressions: freeze(rejectImportExpressions),
  evadeImportExpressionTest: freeze(evadeImportExpressionTest),
  rejectSomeDirectEvalExpressions: freeze(rejectSomeDirectEvalExpressions),
  mandatoryTransforms: freeze(mandatoryTransforms),
  applyTransforms: freeze(applyTransforms)
});

// node_modules/ses/src/scope-constants.js
var keywords = [
  // 11.6.2.1 Keywords
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  // Also reserved when parsing strict mode code
  "let",
  "static",
  // 11.6.2.2 Future Reserved Words
  "enum",
  // Also reserved when parsing strict mode code
  "implements",
  "package",
  "protected",
  "interface",
  "private",
  "public",
  // Reserved but not mentioned in specs
  "await",
  "null",
  "true",
  "false",
  "this",
  "arguments"
];
var identifierPattern = /^[a-zA-Z_$][\w$]*$/;
var isValidIdentifierName = (name) => {
  return name !== "eval" && !arrayIncludes(keywords, name) && regexpTest(identifierPattern, name);
};
function isImmutableDataProperty(obj, name) {
  const desc = getOwnPropertyDescriptor(obj, name);
  return desc && //
  // The getters will not have .writable, don't let the falsyness of
  // 'undefined' trick us: test with === false, not ! . However descriptors
  // inherit from the (potentially poisoned) global object, so we might see
  // extra properties which weren't really there. Accessor properties have
  // 'get/set/enumerable/configurable', while data properties have
  // 'value/writable/enumerable/configurable'.
  desc.configurable === false && desc.writable === false && //
  // Checks for data properties because they're the only ones we can
  // optimize (accessors are most likely non-constant). Descriptors can't
  // can't have accessors and value properties at the same time, therefore
  // this check is sufficient. Using explicit own property deal with the
  // case where Object.prototype has been poisoned.
  hasOwn(desc, "value");
}
var getScopeConstants = (globalObject, moduleLexicals = {}) => {
  const globalObjectNames = getOwnPropertyNames(globalObject);
  const moduleLexicalNames = getOwnPropertyNames(moduleLexicals);
  const moduleLexicalConstants = arrayFilter(
    moduleLexicalNames,
    (name) => isValidIdentifierName(name) && isImmutableDataProperty(moduleLexicals, name)
  );
  const globalObjectConstants = arrayFilter(
    globalObjectNames,
    (name) => (
      // Can't define a constant: it would prevent a
      // lookup on the endowments.
      !arrayIncludes(moduleLexicalNames, name) && isValidIdentifierName(name) && isImmutableDataProperty(globalObject, name)
    )
  );
  return {
    globalObjectConstants,
    moduleLexicalConstants
  };
};

// node_modules/ses/src/make-evaluate.js
function buildOptimizer(constants, name) {
  if (constants.length === 0) return "";
  return `const {${arrayJoin(constants, ",")}} = this.${name};`;
}
var makeEvaluate = (context) => {
  const { globalObjectConstants, moduleLexicalConstants } = getScopeConstants(
    context.globalObject,
    context.moduleLexicals
  );
  const globalObjectOptimizer = buildOptimizer(
    globalObjectConstants,
    "globalObject"
  );
  const moduleLexicalOptimizer = buildOptimizer(
    moduleLexicalConstants,
    "moduleLexicals"
  );
  const evaluateFactory = FERAL_FUNCTION(`
    with (this.scopeTerminator) {
      with (this.globalObject) {
        with (this.moduleLexicals) {
          with (this.evalScope) {
            ${globalObjectOptimizer}
            ${moduleLexicalOptimizer}
            return function() {
              'use strict';
              return eval(arguments[0]);
            };
          }
        }
      }
    }
  `);
  return apply(evaluateFactory, context, []);
};

// node_modules/ses/src/make-safe-evaluator.js
var { Fail: Fail6 } = assert;
var makeSafeEvaluator = ({
  globalObject,
  moduleLexicals = {},
  globalTransforms = [],
  sloppyGlobalsMode = false
}) => {
  const scopeTerminator = sloppyGlobalsMode ? createSloppyGlobalsScopeTerminator(globalObject) : strictScopeTerminator;
  const evalScopeKit = makeEvalScopeKit();
  const { evalScope } = evalScopeKit;
  const evaluateContext = freeze({
    evalScope,
    moduleLexicals,
    globalObject,
    scopeTerminator
  });
  let evaluate;
  const provideEvaluate = () => {
    if (!evaluate) {
      evaluate = makeEvaluate(evaluateContext);
    }
  };
  const safeEvaluate = (source, options) => {
    const { localTransforms = [] } = options || {};
    provideEvaluate();
    source = applyTransforms(
      source,
      arrayFlatMap(
        [localTransforms, globalTransforms, [mandatoryTransforms]],
        identity
      )
    );
    let err;
    try {
      evalScopeKit.allowNextEvalToBeUnsafe();
      return apply(evaluate, globalObject, [source]);
    } catch (e) {
      err = e;
      throw e;
    } finally {
      const unsafeEvalWasStillExposed = "eval" in evalScope;
      delete evalScope.eval;
      if (unsafeEvalWasStillExposed) {
        evalScopeKit.revoked = { err };
        Fail6`handler did not reset allowNextEvalToBeUnsafe ${err}`;
      }
    }
  };
  return { safeEvaluate };
};

// node_modules/ses/src/tame-function-tostring.js
var nativeSuffix = ") { [native code] }";
var markVirtualizedNativeFunction;
var tameFunctionToString = () => {
  if (markVirtualizedNativeFunction === void 0) {
    const virtualizedNativeFunctions = new WeakSet();
    const tamingMethods = {
      toString() {
        const str = functionToString(this);
        if (stringEndsWith(str, nativeSuffix) || !weaksetHas(virtualizedNativeFunctions, this)) {
          return str;
        }
        return `function ${this.name}() { [native code] }`;
      }
    };
    defineProperty(functionPrototype, "toString", {
      value: tamingMethods.toString
    });
    markVirtualizedNativeFunction = freeze(
      (func) => weaksetAdd(virtualizedNativeFunctions, func)
    );
  }
  return markVirtualizedNativeFunction;
};

// node_modules/ses/src/tame-domains.js
function tameDomains(domainTaming = "safe") {
  if (domainTaming === "unsafe") {
    return;
  }
  const globalProcess = universalThis.process || void 0;
  if (typeof globalProcess === "object") {
    const domainDescriptor = getOwnPropertyDescriptor(globalProcess, "domain");
    if (domainDescriptor !== void 0 && domainDescriptor.get !== void 0) {
      throw TypeError2(
        `SES failed to lockdown, Node.js domains have been initialized (SES_NO_DOMAINS)`
      );
    }
    defineProperty(globalProcess, "domain", {
      value: null,
      configurable: false,
      writable: false,
      enumerable: false
    });
  }
}

// node_modules/ses/src/tame-module-source.js
var tameModuleSource = () => {
  const newIntrinsics = {};
  const ModuleSource = universalThis.ModuleSource;
  if (ModuleSource !== void 0) {
    let AbstractModuleSource = function() {
    };
    newIntrinsics.ModuleSource = ModuleSource;
    const ModuleSourceProto = getPrototypeOf(ModuleSource);
    if (ModuleSourceProto === functionPrototype) {
      setPrototypeOf(ModuleSource, AbstractModuleSource);
      newIntrinsics["%AbstractModuleSource%"] = AbstractModuleSource;
      newIntrinsics["%AbstractModuleSourcePrototype%"] = AbstractModuleSource.prototype;
    } else {
      newIntrinsics["%AbstractModuleSource%"] = ModuleSourceProto;
      newIntrinsics["%AbstractModuleSourcePrototype%"] = ModuleSourceProto.prototype;
    }
    const ModuleSourcePrototype = ModuleSource.prototype;
    if (ModuleSourcePrototype !== void 0) {
      newIntrinsics["%ModuleSourcePrototype%"] = ModuleSourcePrototype;
      const ModuleSourcePrototypeProto = getPrototypeOf(ModuleSourcePrototype);
      if (ModuleSourcePrototypeProto === objectPrototype) {
        setPrototypeOf(ModuleSource.prototype, AbstractModuleSource.prototype);
      }
    }
  }
  return newIntrinsics;
};

// node_modules/ses/src/error/console.js
var defineName = (name, fn2) => defineProperty(fn2, "name", { value: name });
var consoleLevelMethods = freeze([
  ["debug", "debug"],
  // (fmt?, ...args) verbose level on Chrome
  ["log", "log"],
  // (fmt?, ...args) info level on Chrome
  ["info", "info"],
  // (fmt?, ...args)
  ["warn", "warn"],
  // (fmt?, ...args)
  ["error", "error"],
  // (fmt?, ...args)
  ["trace", "log"],
  // (fmt?, ...args)
  ["dirxml", "log"],
  // (fmt?, ...args)          but TS typed (...data)
  ["group", "log"],
  // (fmt?, ...args)           but TS typed (...label)
  ["groupCollapsed", "log"]
  // (fmt?, ...args)  but TS typed (...label)
]);
var consoleOtherMethods = freeze([
  ["assert", "error"],
  // (value, fmt?, ...args)
  ["timeLog", "log"],
  // (label?, ...args) no fmt string
  // Insensitive to whether any argument is an error. All arguments can pass
  // thru to baseConsole as is.
  ["clear", void 0],
  // ()
  ["count", "info"],
  // (label?)
  ["countReset", void 0],
  // (label?)
  ["dir", "log"],
  // (item, options?)
  ["groupEnd", "log"],
  // ()
  // In theory tabular data may be or contain an error. However, we currently
  // do not detect these and may never.
  ["table", "log"],
  // (tabularData, properties?)
  ["time", "info"],
  // (label?)
  ["timeEnd", "info"],
  // (label?)
  // Node Inspector only, MDN, and TypeScript, but not whatwg
  ["profile", void 0],
  // (label?)
  ["profileEnd", void 0],
  // (label?)
  ["timeStamp", void 0]
  // (label?)
]);
var consoleMethodPermits = freeze([
  ...consoleLevelMethods,
  ...consoleOtherMethods
]);
var makeLoggingConsoleKit = (loggedErrorHandler2, { shouldResetForDebugging = false } = {}) => {
  if (shouldResetForDebugging) {
    loggedErrorHandler2.resetErrorTagNum();
  }
  let logArray = [];
  const loggingConsole = fromEntries(
    arrayMap(consoleMethodPermits, ([name, _]) => {
      const method = defineName(name, (...args) => {
        arrayPush(logArray, [name, ...args]);
      });
      return [name, freeze(method)];
    })
  );
  freeze(loggingConsole);
  const takeLog = () => {
    const result = freeze(logArray);
    logArray = [];
    return result;
  };
  freeze(takeLog);
  const typedLoggingConsole = (
    /** @type {VirtualConsole} */
    loggingConsole
  );
  return freeze({ loggingConsole: typedLoggingConsole, takeLog });
};
freeze(makeLoggingConsoleKit);
var ErrorInfo = {
  NOTE: "ERROR_NOTE:",
  MESSAGE: "ERROR_MESSAGE:",
  CAUSE: "cause:",
  ERRORS: "errors:"
};
freeze(ErrorInfo);
var makeCausalConsole = (baseConsole, loggedErrorHandler2) => {
  if (!baseConsole) {
    return void 0;
  }
  const { getStackString, tagError: tagError2, takeMessageLogArgs, takeNoteLogArgsArray } = loggedErrorHandler2;
  const extractErrorArgs = (logArgs, subErrorsSink) => {
    const argTags = arrayMap(logArgs, (arg) => {
      if (isError(arg)) {
        arrayPush(subErrorsSink, arg);
        return `(${tagError2(arg)})`;
      }
      return arg;
    });
    return argTags;
  };
  const logErrorInfo = (severity, error, kind, logArgs, subErrorsSink) => {
    const errorTag = tagError2(error);
    const errorName = kind === ErrorInfo.MESSAGE ? `${errorTag}:` : `${errorTag} ${kind}`;
    const argTags = extractErrorArgs(logArgs, subErrorsSink);
    baseConsole[severity](errorName, ...argTags);
  };
  const logSubErrors = (severity, subErrors, optTag = void 0) => {
    if (subErrors.length === 0) {
      return;
    }
    if (subErrors.length === 1 && optTag === void 0) {
      logError(severity, subErrors[0]);
      return;
    }
    let label;
    if (subErrors.length === 1) {
      label = `Nested error`;
    } else {
      label = `Nested ${subErrors.length} errors`;
    }
    if (optTag !== void 0) {
      label = `${label} under ${optTag}`;
    }
    baseConsole.group(label);
    try {
      for (const subError of subErrors) {
        logError(severity, subError);
      }
    } finally {
      if (baseConsole.groupEnd) {
        baseConsole.groupEnd();
      }
    }
  };
  const errorsLogged = new WeakSet();
  const makeNoteCallback = (severity) => (error, noteLogArgs) => {
    const subErrors = [];
    logErrorInfo(severity, error, ErrorInfo.NOTE, noteLogArgs, subErrors);
    logSubErrors(severity, subErrors, tagError2(error));
  };
  const logError = (severity, error) => {
    if (weaksetHas(errorsLogged, error)) {
      return;
    }
    const errorTag = tagError2(error);
    weaksetAdd(errorsLogged, error);
    const subErrors = [];
    const messageLogArgs = takeMessageLogArgs(error);
    const noteLogArgsArray = takeNoteLogArgsArray(
      error,
      makeNoteCallback(severity)
    );
    if (messageLogArgs === void 0) {
      baseConsole[severity](`${errorTag}:`, error.message);
    } else {
      logErrorInfo(
        severity,
        error,
        ErrorInfo.MESSAGE,
        messageLogArgs,
        subErrors
      );
    }
    let stackString = getStackString(error);
    if (typeof stackString === "string" && stackString.length >= 1 && !stringEndsWith(stackString, "\n")) {
      stackString += "\n";
    }
    baseConsole[severity](stackString);
    if (error.cause) {
      logErrorInfo(severity, error, ErrorInfo.CAUSE, [error.cause], subErrors);
    }
    if (error.errors) {
      logErrorInfo(severity, error, ErrorInfo.ERRORS, error.errors, subErrors);
    }
    for (const noteLogArgs of noteLogArgsArray) {
      logErrorInfo(severity, error, ErrorInfo.NOTE, noteLogArgs, subErrors);
    }
    logSubErrors(severity, subErrors, errorTag);
  };
  const levelMethods = arrayMap(consoleLevelMethods, ([level, _]) => {
    const levelMethod = defineName(level, (...logArgs) => {
      const subErrors = [];
      const argTags = extractErrorArgs(logArgs, subErrors);
      if (baseConsole[level]) {
        baseConsole[level](...argTags);
      }
      logSubErrors(level, subErrors);
    });
    return [level, freeze(levelMethod)];
  });
  const otherMethodNames = arrayFilter(
    consoleOtherMethods,
    ([name, _]) => name in baseConsole
  );
  const otherMethods = arrayMap(otherMethodNames, ([name, _]) => {
    const otherMethod = defineName(name, (...args) => {
      baseConsole[name](...args);
      return void 0;
    });
    return [name, freeze(otherMethod)];
  });
  const causalConsole = fromEntries([...levelMethods, ...otherMethods]);
  return (
    /** @type {VirtualConsole} */
    freeze(causalConsole)
  );
};
freeze(makeCausalConsole);
var indentAfterAllSeps = (str, sep, indents) => {
  const [firstLine, ...restLines] = stringSplit(str, sep);
  const indentedRest = arrayFlatMap(restLines, (line) => [sep, ...indents, line]);
  return ["", firstLine, ...indentedRest];
};
var defineCausalConsoleFromLogger = (loggedErrorHandler2) => {
  const makeCausalConsoleFromLogger = (tlogger) => {
    const indents = [];
    const logWithIndent = (...args) => {
      if (indents.length > 0) {
        args = arrayFlatMap(
          args,
          (arg) => typeof arg === "string" && stringIncludes(arg, "\n") ? indentAfterAllSeps(arg, "\n", indents) : [arg]
        );
        args = [...indents, ...args];
      }
      return tlogger(...args);
    };
    const baseConsole = fromEntries([
      ...arrayMap(consoleLevelMethods, ([name]) => [
        name,
        defineName(name, (...args) => logWithIndent(...args))
      ]),
      ...arrayMap(consoleOtherMethods, ([name]) => [
        name,
        defineName(name, (...args) => logWithIndent(name, ...args))
      ])
    ]);
    for (const name of ["group", "groupCollapsed"]) {
      if (baseConsole[name]) {
        baseConsole[name] = defineName(name, (...args) => {
          if (args.length >= 1) {
            logWithIndent(...args);
          }
          arrayPush(indents, " ");
        });
      } else {
        baseConsole[name] = defineName(name, () => {
        });
      }
    }
    baseConsole.groupEnd = defineName(
      "groupEnd",
      baseConsole.groupEnd ? (...args) => {
        arrayPop(indents);
      } : () => {
      }
    );
    harden(baseConsole);
    const causalConsole = makeCausalConsole(
      /** @type {VirtualConsole} */
      baseConsole,
      loggedErrorHandler2
    );
    return (
      /** @type {VirtualConsole} */
      causalConsole
    );
  };
  return freeze(makeCausalConsoleFromLogger);
};
freeze(defineCausalConsoleFromLogger);
var filterConsole = (baseConsole, filter, _topic = void 0) => {
  const methodPermits = arrayFilter(
    consoleMethodPermits,
    ([name, _]) => name in baseConsole
  );
  const methods = arrayMap(methodPermits, ([name, severity]) => {
    const method = defineName(name, (...args) => {
      if (severity === void 0 || filter.canLog(severity)) {
        baseConsole[name](...args);
      }
    });
    return [name, freeze(method)];
  });
  const filteringConsole = fromEntries(methods);
  return (
    /** @type {VirtualConsole} */
    freeze(filteringConsole)
  );
};
freeze(filterConsole);

// node_modules/ses/src/error/unhandled-rejection.js
var makeRejectionHandlers = (reportReason) => {
  if (FinalizationRegistry === void 0) {
    return void 0;
  }
  let lastReasonId = 0;
  const idToReason = new Map2();
  let cancelChecking;
  const removeReasonId = (reasonId) => {
    mapDelete(idToReason, reasonId);
    if (cancelChecking && idToReason.size === 0) {
      cancelChecking();
      cancelChecking = void 0;
    }
  };
  const promiseToReasonId = new WeakMap();
  const finalizeDroppedPromise = (heldReasonId) => {
    if (mapHas(idToReason, heldReasonId)) {
      const reason = mapGet(idToReason, heldReasonId);
      removeReasonId(heldReasonId);
      reportReason(reason);
    }
  };
  const promiseToReason = new FinalizationRegistry(finalizeDroppedPromise);
  const unhandledRejectionHandler = (reason, pr) => {
    lastReasonId += 1;
    const reasonId = lastReasonId;
    mapSet(idToReason, reasonId, reason);
    weakmapSet(promiseToReasonId, pr, reasonId);
    finalizationRegistryRegister(promiseToReason, pr, reasonId, pr);
  };
  const rejectionHandledHandler = (pr) => {
    const reasonId = weakmapGet(promiseToReasonId, pr);
    removeReasonId(reasonId);
  };
  const processTerminationHandler = () => {
    for (const [reasonId, reason] of mapEntries(idToReason)) {
      removeReasonId(reasonId);
      reportReason(reason);
    }
  };
  return {
    rejectionHandledHandler,
    unhandledRejectionHandler,
    processTerminationHandler
  };
};

// node_modules/ses/src/error/tame-console.js
var failFast = (message) => {
  throw TypeError2(message);
};
var wrapLogger = (logger, thisArg) => freeze((...args) => apply(logger, thisArg, args));
var tameConsole = (consoleTaming = "safe", errorTrapping = "platform", unhandledRejectionTrapping = "report", optGetStackString = void 0) => {
  let loggedErrorHandler2;
  if (optGetStackString === void 0) {
    loggedErrorHandler2 = loggedErrorHandler;
  } else {
    loggedErrorHandler2 = {
      ...loggedErrorHandler,
      getStackString: optGetStackString
    };
  }
  const originalConsole = (
    /** @type {VirtualConsole} */
    // eslint-disable-next-line no-nested-ternary
    typeof universalThis.console !== "undefined" ? universalThis.console : typeof universalThis.print === "function" ? (
      // Make a good-enough console for eshost (including only functions that
      // log at a specific level with no special argument interpretation).
      // https://console.spec.whatwg.org/#logging
      ((p) => freeze({ debug: p, log: p, info: p, warn: p, error: p }))(
        // eslint-disable-next-line no-undef
        wrapLogger(universalThis.print)
      )
    ) : void 0
  );
  if (originalConsole && originalConsole.log) {
    for (const methodName of ["warn", "error"]) {
      if (!originalConsole[methodName]) {
        defineProperty(originalConsole, methodName, {
          value: wrapLogger(originalConsole.log, originalConsole)
        });
      }
    }
  }
  const ourConsole = (
    /** @type {VirtualConsole} */
    consoleTaming === "unsafe" ? originalConsole : makeCausalConsole(originalConsole, loggedErrorHandler2)
  );
  const globalProcess = universalThis.process || void 0;
  if (errorTrapping !== "none" && typeof globalProcess === "object" && typeof globalProcess.on === "function") {
    let terminate;
    if (errorTrapping === "platform" || errorTrapping === "exit") {
      const { exit } = globalProcess;
      typeof exit === "function" || failFast("missing process.exit");
      terminate = () => exit(globalProcess.exitCode || -1);
    } else if (errorTrapping === "abort") {
      terminate = globalProcess.abort;
      typeof terminate === "function" || failFast("missing process.abort");
    }
    globalProcess.on("uncaughtException", (error) => {
      ourConsole.error("SES_UNCAUGHT_EXCEPTION:", error);
      if (terminate) {
        terminate();
      }
    });
  }
  if (unhandledRejectionTrapping !== "none" && typeof globalProcess === "object" && typeof globalProcess.on === "function") {
    const handleRejection = (reason) => {
      ourConsole.error("SES_UNHANDLED_REJECTION:", reason);
    };
    const h = makeRejectionHandlers(handleRejection);
    if (h) {
      globalProcess.on("unhandledRejection", h.unhandledRejectionHandler);
      globalProcess.on("rejectionHandled", h.rejectionHandledHandler);
      globalProcess.on("exit", h.processTerminationHandler);
    }
  }
  const globalWindow = universalThis.window || void 0;
  if (errorTrapping !== "none" && typeof globalWindow === "object" && typeof globalWindow.addEventListener === "function") {
    globalWindow.addEventListener("error", (event) => {
      event.preventDefault();
      ourConsole.error("SES_UNCAUGHT_EXCEPTION:", event.error);
      if (errorTrapping === "exit" || errorTrapping === "abort") {
        globalWindow.location.href = `about:blank`;
      }
    });
  }
  if (unhandledRejectionTrapping !== "none" && typeof globalWindow === "object" && typeof globalWindow.addEventListener === "function") {
    const handleRejection = (reason) => {
      ourConsole.error("SES_UNHANDLED_REJECTION:", reason);
    };
    const h = makeRejectionHandlers(handleRejection);
    if (h) {
      globalWindow.addEventListener("unhandledrejection", (event) => {
        event.preventDefault();
        h.unhandledRejectionHandler(event.reason, event.promise);
      });
      globalWindow.addEventListener("rejectionhandled", (event) => {
        event.preventDefault();
        h.rejectionHandledHandler(event.promise);
      });
      globalWindow.addEventListener("beforeunload", (_event) => {
        h.processTerminationHandler();
      });
    }
  }
  return { console: ourConsole };
};

// node_modules/ses/src/error/tame-v8-error-constructor.js
var safeV8CallSiteMethodNames = [
  // suppress 'getThis' definitely
  "getTypeName",
  // suppress 'getFunction' definitely
  "getFunctionName",
  "getMethodName",
  "getFileName",
  "getLineNumber",
  "getColumnNumber",
  "getEvalOrigin",
  "isToplevel",
  "isEval",
  "isNative",
  "isConstructor",
  "isAsync",
  // suppress 'isPromiseAll' for now
  // suppress 'getPromiseIndex' for now
  // Additional names found by experiment, absent from
  // https://v8.dev/docs/stack-trace-api
  "getPosition",
  "getScriptNameOrSourceURL",
  "toString"
  // TODO replace to use only permitted info
];
var safeV8CallSiteFacet = (callSite) => {
  const methodEntry = (name) => {
    const method = callSite[name];
    return [name, () => apply(method, callSite, [])];
  };
  const o = fromEntries(arrayMap(safeV8CallSiteMethodNames, methodEntry));
  return create(o, {});
};
var safeV8SST = (sst) => arrayMap(sst, safeV8CallSiteFacet);
var FILENAME_NODE_DEPENDENTS_CENSOR = /\/node_modules\//;
var FILENAME_NODE_INTERNALS_CENSOR = /^(?:node:)?internal\//;
var FILENAME_ASSERT_CENSOR = /\/packages\/ses\/src\/error\/assert\.js$/;
var FILENAME_EVENTUAL_SEND_CENSOR = /\/packages\/eventual-send\/src\//;
var FILENAME_SES_AVA_CENSOR = /\/packages\/ses-ava\/src\/ses-ava-test\.js$/;
var FILENAME_CENSORS = [
  FILENAME_NODE_DEPENDENTS_CENSOR,
  FILENAME_NODE_INTERNALS_CENSOR,
  FILENAME_ASSERT_CENSOR,
  FILENAME_EVENTUAL_SEND_CENSOR,
  FILENAME_SES_AVA_CENSOR
];
var filterFileName = (fileName) => {
  if (!fileName) {
    return true;
  }
  for (const filter of FILENAME_CENSORS) {
    if (regexpTest(filter, fileName)) {
      return false;
    }
  }
  return true;
};
var CALLSITE_ELLIPSIS_PATTERN1 = /^((?:.*[( ])?)[:/\w_-]*\/\.\.\.\/(.+)$/;
var CALLSITE_ELLIPSIS_PATTERN2 = /^((?:.*[( ])?)\.\.\.\/(.+)$/;
var CALLSITE_PACKAGES_PATTERN = /^((?:.*[( ])?)[:/\w_-]*\/(packages\/.+)$/;
var CALLSITE_FILE_2SLASH_PATTERN = /^((?:.*[( ])?)file:\/\/([^/].*)$/;
var CALLSITE_PATTERNS = [
  CALLSITE_ELLIPSIS_PATTERN1,
  CALLSITE_ELLIPSIS_PATTERN2,
  CALLSITE_PACKAGES_PATTERN,
  CALLSITE_FILE_2SLASH_PATTERN
];
var shortenCallSiteString = (callSiteString) => {
  for (const filter of CALLSITE_PATTERNS) {
    const match = regexpExec(filter, callSiteString);
    if (match) {
      return arrayJoin(arraySlice(match, 1), "");
    }
  }
  return callSiteString;
};
var tameV8ErrorConstructor = (OriginalError, InitialError, errorTaming, stackFiltering) => {
  if (errorTaming === "unsafe-debug") {
    throw TypeError2(
      "internal: v8+unsafe-debug special case should already be done"
    );
  }
  const originalCaptureStackTrace = OriginalError.captureStackTrace;
  const omitFrames = stackFiltering === "concise" || stackFiltering === "omit-frames";
  const shortenPaths = stackFiltering === "concise" || stackFiltering === "shorten-paths";
  const callSiteFilter = (callSite) => {
    if (omitFrames) {
      return filterFileName(callSite.getFileName());
    }
    return true;
  };
  const callSiteStringifier = (callSite) => {
    let callSiteString = `${callSite}`;
    if (shortenPaths) {
      callSiteString = shortenCallSiteString(callSiteString);
    }
    return `
  at ${callSiteString}`;
  };
  const stackStringFromSST = (_error, sst) => arrayJoin(
    arrayMap(arrayFilter(sst, callSiteFilter), callSiteStringifier),
    ""
  );
  const stackInfos = new WeakMap();
  const tamedMethods3 = {
    // The optional `optFn` argument is for cutting off the bottom of
    // the stack --- for capturing the stack only above the topmost
    // call to that function. Since this isn't the "real" captureStackTrace
    // but instead calls the real one, if no other cutoff is provided,
    // we cut this one off.
    captureStackTrace(error, optFn = tamedMethods3.captureStackTrace) {
      if (typeof originalCaptureStackTrace === "function") {
        apply(originalCaptureStackTrace, OriginalError, [error, optFn]);
        return;
      }
      reflectSet(error, "stack", "");
    },
    // Shim of proposed special power, to reside by default only
    // in the start compartment, for getting the stack traceback
    // string associated with an error.
    // See https://tc39.es/proposal-error-stacks/
    getStackString(error) {
      let stackInfo = weakmapGet(stackInfos, error);
      if (stackInfo === void 0) {
        void error.stack;
        stackInfo = weakmapGet(stackInfos, error);
        if (!stackInfo) {
          stackInfo = { stackString: "" };
          weakmapSet(stackInfos, error, stackInfo);
        }
      }
      if (stackInfo.stackString !== void 0) {
        return stackInfo.stackString;
      }
      const stackString = stackStringFromSST(error, stackInfo.callSites);
      weakmapSet(stackInfos, error, { stackString });
      return stackString;
    },
    prepareStackTrace(error, sst) {
      if (errorTaming === "unsafe") {
        const stackString = stackStringFromSST(error, sst);
        weakmapSet(stackInfos, error, { stackString });
        return `${error}${stackString}`;
      } else {
        weakmapSet(stackInfos, error, { callSites: sst });
        return "";
      }
    }
  };
  const defaultPrepareFn = tamedMethods3.prepareStackTrace;
  OriginalError.prepareStackTrace = defaultPrepareFn;
  const systemPrepareFnSet = new WeakSet([defaultPrepareFn]);
  const systemPrepareFnFor = (inputPrepareFn) => {
    if (weaksetHas(systemPrepareFnSet, inputPrepareFn)) {
      return inputPrepareFn;
    }
    const systemMethods = {
      prepareStackTrace(error, sst) {
        weakmapSet(stackInfos, error, { callSites: sst });
        return inputPrepareFn(error, safeV8SST(sst));
      }
    };
    weaksetAdd(systemPrepareFnSet, systemMethods.prepareStackTrace);
    return systemMethods.prepareStackTrace;
  };
  defineProperties(InitialError, {
    captureStackTrace: {
      value: tamedMethods3.captureStackTrace,
      writable: true,
      enumerable: false,
      configurable: true
    },
    prepareStackTrace: {
      get() {
        return OriginalError.prepareStackTrace;
      },
      set(inputPrepareStackTraceFn) {
        if (typeof inputPrepareStackTraceFn === "function") {
          const systemPrepareFn = systemPrepareFnFor(inputPrepareStackTraceFn);
          OriginalError.prepareStackTrace = systemPrepareFn;
        } else {
          OriginalError.prepareStackTrace = defaultPrepareFn;
        }
      },
      enumerable: false,
      configurable: true
    }
  });
  return tamedMethods3.getStackString;
};

// node_modules/ses/src/error/tame-error-constructor.js
var stackDesc = getOwnPropertyDescriptor(FERAL_ERROR.prototype, "stack");
var stackGetter = stackDesc && stackDesc.get;
var tamedMethods2 = {
  getStackString(error) {
    if (typeof stackGetter === "function") {
      return apply(stackGetter, error, []);
    } else if ("stack" in error) {
      return `${error.stack}`;
    }
    return "";
  }
};
var initialGetStackString = tamedMethods2.getStackString;
function tameErrorConstructor(errorTaming = "safe", stackFiltering = "concise") {
  const ErrorPrototype = FERAL_ERROR.prototype;
  const { captureStackTrace: originalCaptureStackTrace } = FERAL_ERROR;
  const platform = typeof originalCaptureStackTrace === "function" ? "v8" : "unknown";
  const makeErrorConstructor = (_ = {}) => {
    const ResultError = function Error4(...rest) {
      let error;
      if (new.target === void 0) {
        error = apply(FERAL_ERROR, this, rest);
      } else {
        error = construct(FERAL_ERROR, rest, new.target);
      }
      if (platform === "v8") {
        apply(originalCaptureStackTrace, FERAL_ERROR, [error, ResultError]);
      }
      return error;
    };
    defineProperties(ResultError, {
      length: { value: 1 },
      prototype: {
        value: ErrorPrototype,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });
    return ResultError;
  };
  const InitialError = makeErrorConstructor({ powers: "original" });
  const SharedError = makeErrorConstructor({ powers: "none" });
  defineProperties(ErrorPrototype, {
    constructor: { value: SharedError }
  });
  for (const NativeError2 of NativeErrors) {
    setPrototypeOf(NativeError2, SharedError);
  }
  defineProperties(InitialError, {
    stackTraceLimit: {
      get() {
        if (typeof FERAL_ERROR.stackTraceLimit === "number") {
          return FERAL_ERROR.stackTraceLimit;
        }
        return void 0;
      },
      set(newLimit) {
        if (typeof newLimit !== "number") {
          return;
        }
        if (typeof FERAL_ERROR.stackTraceLimit === "number") {
          FERAL_ERROR.stackTraceLimit = newLimit;
          return;
        }
      },
      // WTF on v8 stackTraceLimit is enumerable
      enumerable: false,
      configurable: true
    }
  });
  if (errorTaming === "unsafe-debug" && platform === "v8") {
    defineProperties(InitialError, {
      prepareStackTrace: {
        get() {
          return FERAL_ERROR.prepareStackTrace;
        },
        set(newPrepareStackTrace) {
          FERAL_ERROR.prepareStackTrace = newPrepareStackTrace;
        },
        enumerable: false,
        configurable: true
      },
      captureStackTrace: {
        value: FERAL_ERROR.captureStackTrace,
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    const descs = getOwnPropertyDescriptors(InitialError);
    defineProperties(SharedError, {
      stackTraceLimit: descs.stackTraceLimit,
      prepareStackTrace: descs.prepareStackTrace,
      captureStackTrace: descs.captureStackTrace
    });
    return {
      "%InitialGetStackString%": initialGetStackString,
      "%InitialError%": InitialError,
      "%SharedError%": SharedError
    };
  }
  defineProperties(SharedError, {
    stackTraceLimit: {
      get() {
        return void 0;
      },
      set(_newLimit) {
      },
      enumerable: false,
      configurable: true
    }
  });
  if (platform === "v8") {
    defineProperties(SharedError, {
      prepareStackTrace: {
        get() {
          return () => "";
        },
        set(_prepareFn) {
        },
        enumerable: false,
        configurable: true
      },
      captureStackTrace: {
        value: (errorish, _constructorOpt) => {
          defineProperty(errorish, "stack", {
            value: ""
          });
        },
        writable: false,
        enumerable: false,
        configurable: true
      }
    });
  }
  if (platform === "v8") {
    initialGetStackString = tameV8ErrorConstructor(
      FERAL_ERROR,
      InitialError,
      errorTaming,
      stackFiltering
    );
  } else if (errorTaming === "unsafe" || errorTaming === "unsafe-debug") {
    defineProperties(ErrorPrototype, {
      stack: {
        get() {
          return initialGetStackString(this);
        },
        set(newValue) {
          defineProperties(this, {
            stack: {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true
            }
          });
        }
      }
    });
  } else {
    defineProperties(ErrorPrototype, {
      stack: {
        get() {
          return `${this}`;
        },
        set(newValue) {
          defineProperties(this, {
            stack: {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true
            }
          });
        }
      }
    });
  }
  return {
    "%InitialGetStackString%": initialGetStackString,
    "%InitialError%": InitialError,
    "%SharedError%": SharedError
  };
}

// node_modules/ses/src/module-load.js
var noop = () => {
};
var asyncTrampoline = async (generatorFunc, args, errorWrapper) => {
  await null;
  const iterator = generatorFunc(...args);
  let result = generatorNext(iterator);
  while (!result.done) {
    try {
      const val = await result.value;
      result = generatorNext(iterator, val);
    } catch (error) {
      result = generatorThrow(iterator, errorWrapper(error));
    }
  }
  return result.value;
};
var syncTrampoline = (generatorFunc, args) => {
  const iterator = generatorFunc(...args);
  let result = generatorNext(iterator);
  while (!result.done) {
    try {
      result = generatorNext(iterator, result.value);
    } catch (error) {
      result = generatorThrow(iterator, error);
    }
  }
  return result.value;
};
var makeAlias = (compartment, specifier) => freeze({ compartment, specifier });
var resolveAll = (imports, resolveHook, fullReferrerSpecifier) => {
  const resolvedImports = create(null);
  for (const importSpecifier of imports) {
    const fullSpecifier = resolveHook(importSpecifier, fullReferrerSpecifier);
    resolvedImports[importSpecifier] = fullSpecifier;
  }
  return freeze(resolvedImports);
};
var loadModuleSource = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, moduleSource, enqueueJob, selectImplementation, moduleLoads, importMeta) => {
  const { resolveHook, name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment
  );
  const { imports } = moduleSource;
  if (!isArray(imports) || arraySome(imports, (specifier) => typeof specifier !== "string")) {
    throw makeError(
      redactedDetails`Invalid module source: 'imports' must be an array of strings, got ${imports} for module ${quote(moduleSpecifier)} of compartment ${quote(compartmentName)}`
    );
  }
  const resolvedImports = resolveAll(imports, resolveHook, moduleSpecifier);
  const moduleRecord = freeze({
    compartment,
    moduleSource,
    moduleSpecifier,
    resolvedImports,
    importMeta
  });
  for (const fullSpecifier of values(resolvedImports)) {
    enqueueJob(memoizedLoadWithErrorAnnotation, [
      compartmentPrivateFields,
      moduleAliases2,
      compartment,
      fullSpecifier,
      enqueueJob,
      selectImplementation,
      moduleLoads
    ]);
  }
  return moduleRecord;
};
function* loadWithoutErrorAnnotation(compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, enqueueJob, selectImplementation, moduleLoads) {
  const {
    importHook,
    importNowHook,
    moduleMap,
    moduleMapHook,
    moduleRecords,
    parentCompartment
  } = weakmapGet(compartmentPrivateFields, compartment);
  if (mapHas(moduleRecords, moduleSpecifier)) {
    return mapGet(moduleRecords, moduleSpecifier);
  }
  let moduleDescriptor = moduleMap[moduleSpecifier];
  if (moduleDescriptor === void 0 && moduleMapHook !== void 0) {
    moduleDescriptor = moduleMapHook(moduleSpecifier);
  }
  if (moduleDescriptor === void 0) {
    const moduleHook = selectImplementation(importHook, importNowHook);
    if (moduleHook === void 0) {
      const moduleHookName = selectImplementation(
        "importHook",
        "importNowHook"
      );
      throw makeError(
        redactedDetails`${bare(moduleHookName)} needed to load module ${quote(
          moduleSpecifier
        )} in compartment ${quote(compartment.name)}`
      );
    }
    moduleDescriptor = moduleHook(moduleSpecifier);
    if (!weakmapHas(moduleAliases2, moduleDescriptor)) {
      moduleDescriptor = yield moduleDescriptor;
    }
  }
  if (typeof moduleDescriptor === "string") {
    throw makeError(
      redactedDetails`Cannot map module ${quote(moduleSpecifier)} to ${quote(
        moduleDescriptor
      )} in parent compartment, use {source} module descriptor`,
      TypeError2
    );
  } else if (!isPrimitive(moduleDescriptor)) {
    let aliasDescriptor = weakmapGet(moduleAliases2, moduleDescriptor);
    if (aliasDescriptor !== void 0) {
      moduleDescriptor = aliasDescriptor;
    }
    if (moduleDescriptor.namespace !== void 0) {
      if (typeof moduleDescriptor.namespace === "string") {
        const {
          compartment: aliasCompartment = parentCompartment,
          namespace: aliasSpecifier
        } = moduleDescriptor;
        if (isPrimitive(aliasCompartment) || !weakmapHas(compartmentPrivateFields, aliasCompartment)) {
          throw makeError(
            redactedDetails`Invalid compartment in module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`
          );
        }
        const aliasRecord = yield memoizedLoadWithErrorAnnotation(
          compartmentPrivateFields,
          moduleAliases2,
          aliasCompartment,
          aliasSpecifier,
          enqueueJob,
          selectImplementation,
          moduleLoads
        );
        mapSet(moduleRecords, moduleSpecifier, aliasRecord);
        return aliasRecord;
      }
      if (!isPrimitive(moduleDescriptor.namespace)) {
        const { namespace } = moduleDescriptor;
        aliasDescriptor = weakmapGet(moduleAliases2, namespace);
        if (aliasDescriptor !== void 0) {
          moduleDescriptor = aliasDescriptor;
        } else {
          const exports = getOwnPropertyNames(namespace);
          const moduleSource2 = {
            imports: [],
            exports,
            execute(env) {
              for (const name of exports) {
                env[name] = namespace[name];
              }
            }
          };
          const importMeta = void 0;
          const moduleRecord2 = loadModuleSource(
            compartmentPrivateFields,
            moduleAliases2,
            compartment,
            moduleSpecifier,
            moduleSource2,
            enqueueJob,
            selectImplementation,
            moduleLoads,
            importMeta
          );
          mapSet(moduleRecords, moduleSpecifier, moduleRecord2);
          return moduleRecord2;
        }
      } else {
        throw makeError(
          redactedDetails`Invalid compartment in module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`
        );
      }
    }
    if (moduleDescriptor.source !== void 0) {
      if (typeof moduleDescriptor.source === "string") {
        const {
          source: loaderSpecifier,
          specifier: instanceSpecifier = moduleSpecifier,
          compartment: loaderCompartment = parentCompartment,
          importMeta = void 0
        } = moduleDescriptor;
        const loaderRecord = yield memoizedLoadWithErrorAnnotation(
          compartmentPrivateFields,
          moduleAliases2,
          loaderCompartment,
          loaderSpecifier,
          enqueueJob,
          selectImplementation,
          moduleLoads
        );
        const { moduleSource: moduleSource2 } = loaderRecord;
        const moduleRecord2 = loadModuleSource(
          compartmentPrivateFields,
          moduleAliases2,
          compartment,
          instanceSpecifier,
          moduleSource2,
          enqueueJob,
          selectImplementation,
          moduleLoads,
          importMeta
        );
        mapSet(moduleRecords, moduleSpecifier, moduleRecord2);
        return moduleRecord2;
      } else {
        const {
          source: moduleSource2,
          specifier: aliasSpecifier = moduleSpecifier,
          importMeta
        } = moduleDescriptor;
        const aliasRecord = loadModuleSource(
          compartmentPrivateFields,
          moduleAliases2,
          compartment,
          aliasSpecifier,
          moduleSource2,
          enqueueJob,
          selectImplementation,
          moduleLoads,
          importMeta
        );
        mapSet(moduleRecords, moduleSpecifier, aliasRecord);
        return aliasRecord;
      }
    }
    if (moduleDescriptor.archive !== void 0) {
      throw makeError(
        redactedDetails`Unsupported archive module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`
      );
    }
    if (moduleDescriptor.record !== void 0) {
      const {
        compartment: aliasCompartment = compartment,
        specifier: aliasSpecifier = moduleSpecifier,
        record: moduleSource2,
        importMeta
      } = moduleDescriptor;
      const aliasRecord = loadModuleSource(
        compartmentPrivateFields,
        moduleAliases2,
        aliasCompartment,
        aliasSpecifier,
        moduleSource2,
        enqueueJob,
        selectImplementation,
        moduleLoads,
        importMeta
      );
      mapSet(moduleRecords, moduleSpecifier, aliasRecord);
      mapSet(moduleRecords, aliasSpecifier, aliasRecord);
      return aliasRecord;
    }
    if (moduleDescriptor.compartment !== void 0 && moduleDescriptor.specifier !== void 0) {
      if (isPrimitive(moduleDescriptor.compartment) || !weakmapHas(compartmentPrivateFields, moduleDescriptor.compartment) || typeof moduleDescriptor.specifier !== "string") {
        throw makeError(
          redactedDetails`Invalid compartment in module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`
        );
      }
      const aliasRecord = yield memoizedLoadWithErrorAnnotation(
        compartmentPrivateFields,
        moduleAliases2,
        moduleDescriptor.compartment,
        moduleDescriptor.specifier,
        enqueueJob,
        selectImplementation,
        moduleLoads
      );
      mapSet(moduleRecords, moduleSpecifier, aliasRecord);
      return aliasRecord;
    }
    const moduleSource = moduleDescriptor;
    const moduleRecord = loadModuleSource(
      compartmentPrivateFields,
      moduleAliases2,
      compartment,
      moduleSpecifier,
      moduleSource,
      enqueueJob,
      selectImplementation,
      moduleLoads
    );
    mapSet(moduleRecords, moduleSpecifier, moduleRecord);
    return moduleRecord;
  } else {
    throw makeError(
      redactedDetails`module descriptor must be a string or object for specifier ${quote(
        moduleSpecifier
      )} in compartment ${quote(compartment.name)}`
    );
  }
}
var memoizedLoadWithErrorAnnotation = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, enqueueJob, selectImplementation, moduleLoads) => {
  const { name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment
  );
  let compartmentLoading = mapGet(moduleLoads, compartment);
  if (compartmentLoading === void 0) {
    compartmentLoading = new Map2();
    mapSet(moduleLoads, compartment, compartmentLoading);
  }
  let moduleLoading = mapGet(compartmentLoading, moduleSpecifier);
  if (moduleLoading !== void 0) {
    return moduleLoading;
  }
  moduleLoading = selectImplementation(asyncTrampoline, syncTrampoline)(
    loadWithoutErrorAnnotation,
    [
      compartmentPrivateFields,
      moduleAliases2,
      compartment,
      moduleSpecifier,
      enqueueJob,
      selectImplementation,
      moduleLoads
    ],
    (error) => {
      note(
        error,
        redactedDetails`${error.message}, loading ${quote(moduleSpecifier)} in compartment ${quote(
          compartmentName
        )}`
      );
      throw error;
    }
  );
  mapSet(compartmentLoading, moduleSpecifier, moduleLoading);
  return moduleLoading;
};
var asyncJobQueue = ({ errors = [], noAggregateErrors = false } = {}) => {
  const pendingJobs = new Set();
  const enqueueJob = (func, args) => {
    setAdd(
      pendingJobs,
      promiseThen(func(...args), noop, (error) => {
        if (noAggregateErrors) {
          throw error;
        } else {
          arrayPush(errors, error);
        }
      })
    );
  };
  const drainQueue = async () => {
    await null;
    for (const job of pendingJobs) {
      await job;
    }
  };
  return { enqueueJob, drainQueue, errors };
};
var syncJobQueue = ({ errors = [], noAggregateErrors = false } = {}) => {
  let current = [];
  let next = [];
  const enqueueJob = (func, args) => {
    arrayPush(next, [func, args]);
  };
  const drainQueue = () => {
    for (const [func, args] of current) {
      try {
        func(...args);
      } catch (error) {
        if (noAggregateErrors) {
          throw error;
        } else {
          arrayPush(errors, error);
        }
      }
    }
    current = next;
    next = [];
    if (current.length > 0) drainQueue();
  };
  return { enqueueJob, drainQueue, errors };
};
var throwAggregateError = ({ errors, errorPrefix }) => {
  if (errors.length > 0) {
    const verbose = (
      /** @type {'' | 'verbose'} */
      getEnvironmentOption("COMPARTMENT_LOAD_ERRORS", "", ["verbose"]) === "verbose"
    );
    throw TypeError2(
      `${errorPrefix} (${errors.length} underlying failures: ${arrayJoin(
        arrayMap(errors, (error) => error.message + (verbose ? error.stack : "")),
        ", "
      )}`
    );
  }
};
var preferSync = (_asyncImpl, syncImpl) => syncImpl;
var preferAsync = (asyncImpl, _syncImpl) => asyncImpl;
var load = async (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, { noAggregateErrors = false } = {}) => {
  const { name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment
  );
  const moduleLoads = new Map2();
  const { enqueueJob, drainQueue, errors } = asyncJobQueue({
    noAggregateErrors
  });
  enqueueJob(memoizedLoadWithErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases2,
    compartment,
    moduleSpecifier,
    enqueueJob,
    preferAsync,
    moduleLoads
  ]);
  await drainQueue();
  throwAggregateError({
    errors,
    errorPrefix: `Failed to load module ${quote(moduleSpecifier)} in package ${quote(
      compartmentName
    )}`
  });
};
var loadNow = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, { noAggregateErrors = false } = {}) => {
  const { name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment
  );
  const moduleLoads = new Map2();
  const { enqueueJob, drainQueue, errors } = syncJobQueue({
    noAggregateErrors
  });
  enqueueJob(memoizedLoadWithErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases2,
    compartment,
    moduleSpecifier,
    enqueueJob,
    preferSync,
    moduleLoads
  ]);
  drainQueue();
  throwAggregateError({
    errors,
    errorPrefix: `Failed to load module ${quote(moduleSpecifier)} in package ${quote(
      compartmentName
    )}`
  });
};

// node_modules/ses/src/module-proxy.js
var { quote: q4 } = assert;
var deferExports = () => {
  let active = false;
  const exportsTarget = create(null, {
    // Make this appear like an ESM module namespace object.
    [toStringTagSymbol]: {
      value: "Module",
      writable: false,
      enumerable: false,
      configurable: false
    }
  });
  return freeze({
    activate() {
      active = true;
    },
    exportsTarget,
    exportsProxy: new Proxy2(exportsTarget, {
      get(_target, name, receiver) {
        if (!active) {
          throw TypeError2(
            `Cannot get property ${q4(
              name
            )} of module exports namespace, the module has not yet begun to execute`
          );
        }
        return reflectGet(exportsTarget, name, receiver);
      },
      set(_target, name, _value) {
        throw TypeError2(
          `Cannot set property ${q4(name)} of module exports namespace`
        );
      },
      has(_target, name) {
        if (!active) {
          throw TypeError2(
            `Cannot check property ${q4(
              name
            )}, the module has not yet begun to execute`
          );
        }
        return reflectHas(exportsTarget, name);
      },
      deleteProperty(_target, name) {
        throw TypeError2(
          `Cannot delete property ${q4(name)}s of module exports namespace`
        );
      },
      ownKeys(_target) {
        if (!active) {
          throw TypeError2(
            "Cannot enumerate keys, the module has not yet begun to execute"
          );
        }
        return ownKeys(exportsTarget);
      },
      getOwnPropertyDescriptor(_target, name) {
        if (!active) {
          throw TypeError2(
            `Cannot get own property descriptor ${q4(
              name
            )}, the module has not yet begun to execute`
          );
        }
        return reflectGetOwnPropertyDescriptor(exportsTarget, name);
      },
      preventExtensions(_target) {
        if (!active) {
          throw TypeError2(
            "Cannot prevent extensions of module exports namespace, the module has not yet begun to execute"
          );
        }
        return reflectPreventExtensions(exportsTarget);
      },
      isExtensible() {
        if (!active) {
          throw TypeError2(
            "Cannot check extensibility of module exports namespace, the module has not yet begun to execute"
          );
        }
        return reflectIsExtensible(exportsTarget);
      },
      getPrototypeOf(_target) {
        return null;
      },
      setPrototypeOf(_target, _proto) {
        throw TypeError2("Cannot set prototype of module exports namespace");
      },
      defineProperty(_target, name, _descriptor) {
        throw TypeError2(
          `Cannot define property ${q4(name)} of module exports namespace`
        );
      },
      apply(_target, _thisArg, _args) {
        throw TypeError2(
          "Cannot call module exports namespace, it is not a function"
        );
      },
      construct(_target, _args) {
        throw TypeError2(
          "Cannot construct module exports namespace, it is not a constructor"
        );
      }
    })
  });
};
var getDeferredExports = (compartment, compartmentPrivateFields, moduleAliases2, specifier) => {
  const { deferredExports } = compartmentPrivateFields;
  if (!mapHas(deferredExports, specifier)) {
    const deferred = deferExports();
    weakmapSet(
      moduleAliases2,
      deferred.exportsProxy,
      makeAlias(compartment, specifier)
    );
    mapSet(deferredExports, specifier, deferred);
  }
  return mapGet(deferredExports, specifier);
};

// node_modules/ses/src/compartment-evaluate.js
var provideCompartmentEvaluator = (compartmentFields, options) => {
  const { sloppyGlobalsMode = false, __moduleShimLexicals__ = void 0 } = options;
  let safeEvaluate;
  if (__moduleShimLexicals__ === void 0 && !sloppyGlobalsMode) {
    ({ safeEvaluate } = compartmentFields);
  } else {
    let { globalTransforms } = compartmentFields;
    const { globalObject } = compartmentFields;
    let moduleLexicals;
    if (__moduleShimLexicals__ !== void 0) {
      globalTransforms = void 0;
      moduleLexicals = create(
        null,
        getOwnPropertyDescriptors(__moduleShimLexicals__)
      );
    }
    ({ safeEvaluate } = makeSafeEvaluator({
      globalObject,
      moduleLexicals,
      globalTransforms,
      sloppyGlobalsMode
    }));
  }
  return { safeEvaluate };
};
var compartmentEvaluate = (compartmentFields, source, options) => {
  if (typeof source !== "string") {
    throw TypeError2("first argument of evaluate() must be a string");
  }
  const {
    transforms: transforms2 = [],
    __evadeHtmlCommentTest__ = false,
    __evadeImportExpressionTest__ = false,
    __rejectSomeDirectEvalExpressions__ = true
    // Note default on
  } = options;
  const localTransforms = [...transforms2];
  if (__evadeHtmlCommentTest__ === true) {
    arrayPush(localTransforms, evadeHtmlCommentTest);
  }
  if (__evadeImportExpressionTest__ === true) {
    arrayPush(localTransforms, evadeImportExpressionTest);
  }
  if (__rejectSomeDirectEvalExpressions__ === true) {
    arrayPush(localTransforms, rejectSomeDirectEvalExpressions);
  }
  const { safeEvaluate } = provideCompartmentEvaluator(
    compartmentFields,
    options
  );
  return safeEvaluate(source, {
    localTransforms
  });
};

// node_modules/ses/src/module-instance.js
var { quote: q5 } = assert;
var makeVirtualModuleInstance = (compartmentPrivateFields, moduleSource, compartment, moduleAliases2, moduleSpecifier, resolvedImports) => {
  const { exportsProxy, exportsTarget, activate } = getDeferredExports(
    compartment,
    weakmapGet(compartmentPrivateFields, compartment),
    moduleAliases2,
    moduleSpecifier
  );
  const notifiers = create(null);
  if (moduleSource.exports) {
    if (!isArray(moduleSource.exports) || arraySome(moduleSource.exports, (name) => typeof name !== "string")) {
      throw TypeError2(
        `SES virtual module source "exports" property must be an array of strings for module ${moduleSpecifier}`
      );
    }
    arrayForEach(moduleSource.exports, (name) => {
      let value = exportsTarget[name];
      const updaters = [];
      const get = () => value;
      const set = (newValue) => {
        value = newValue;
        for (const updater of updaters) {
          updater(newValue);
        }
      };
      defineProperty(exportsTarget, name, {
        get,
        set,
        enumerable: true,
        configurable: false
      });
      notifiers[name] = (update) => {
        arrayPush(updaters, update);
        update(value);
      };
    });
    notifiers["*"] = (update) => {
      update(exportsTarget);
    };
  }
  const localState = {
    activated: false
  };
  return freeze({
    notifiers,
    exportsProxy,
    execute() {
      if (reflectHas(localState, "errorFromExecute")) {
        throw localState.errorFromExecute;
      }
      if (!localState.activated) {
        activate();
        localState.activated = true;
        try {
          moduleSource.execute(exportsTarget, compartment, resolvedImports);
        } catch (err) {
          localState.errorFromExecute = err;
          throw err;
        }
      }
    }
  });
};
var makeModuleInstance = (privateFields2, moduleAliases2, moduleRecord, importedInstances) => {
  const {
    compartment,
    moduleSpecifier,
    moduleSource,
    importMeta: moduleRecordMeta
  } = moduleRecord;
  const {
    reexports: exportAlls = [],
    __syncModuleProgram__: functorSource,
    __fixedExportMap__: fixedExportMap = {},
    __liveExportMap__: liveExportMap = {},
    __reexportMap__: reexportMap = {},
    __needsImport__: needsImport = false,
    __needsImportMeta__: needsImportMeta = false,
    __syncModuleFunctor__
  } = moduleSource;
  const compartmentFields = weakmapGet(privateFields2, compartment);
  const { __shimTransforms__, resolveHook, importMetaHook, compartmentImport } = compartmentFields;
  const { exportsProxy, exportsTarget, activate } = getDeferredExports(
    compartment,
    compartmentFields,
    moduleAliases2,
    moduleSpecifier
  );
  const exportsProps = create(null);
  const moduleLexicals = create(null);
  const onceVar = create(null);
  const liveVar = create(null);
  const importMeta = create(null);
  if (moduleRecordMeta) {
    assign(importMeta, moduleRecordMeta);
  }
  if (needsImportMeta && importMetaHook) {
    importMetaHook(moduleSpecifier, importMeta);
  }
  let dynamicImport;
  if (needsImport) {
    dynamicImport = async (importSpecifier) => compartmentImport(resolveHook(importSpecifier, moduleSpecifier));
  }
  const localGetNotify = create(null);
  const notifiers = create(null);
  arrayForEach(entries(fixedExportMap), ([fixedExportName, [localName]]) => {
    let fixedGetNotify = localGetNotify[localName];
    if (!fixedGetNotify) {
      let value;
      let tdz = true;
      let optUpdaters = [];
      const get = () => {
        if (tdz) {
          throw ReferenceError2(`binding ${q5(localName)} not yet initialized`);
        }
        return value;
      };
      const init = freeze((initValue) => {
        if (!tdz) {
          throw TypeError2(
            `Internal: binding ${q5(localName)} already initialized`
          );
        }
        value = initValue;
        const updaters = optUpdaters;
        optUpdaters = null;
        tdz = false;
        for (const updater of updaters || []) {
          updater(initValue);
        }
        return initValue;
      });
      const notify = (updater) => {
        if (updater === init) {
          return;
        }
        if (tdz) {
          arrayPush(optUpdaters || [], updater);
        } else {
          updater(value);
        }
      };
      fixedGetNotify = {
        get,
        notify
      };
      localGetNotify[localName] = fixedGetNotify;
      onceVar[localName] = init;
    }
    exportsProps[fixedExportName] = {
      get: fixedGetNotify.get,
      set: void 0,
      enumerable: true,
      configurable: false
    };
    notifiers[fixedExportName] = fixedGetNotify.notify;
  });
  arrayForEach(
    entries(liveExportMap),
    ([liveExportName, [localName, setProxyTrap]]) => {
      let liveGetNotify = localGetNotify[localName];
      if (!liveGetNotify) {
        let value;
        let tdz = true;
        const updaters = [];
        const get = () => {
          if (tdz) {
            throw ReferenceError2(
              `binding ${q5(liveExportName)} not yet initialized`
            );
          }
          return value;
        };
        const update = freeze((newValue) => {
          value = newValue;
          tdz = false;
          for (const updater of updaters) {
            updater(newValue);
          }
        });
        const set = (newValue) => {
          if (tdz) {
            throw ReferenceError2(`binding ${q5(localName)} not yet initialized`);
          }
          value = newValue;
          for (const updater of updaters) {
            updater(newValue);
          }
        };
        const notify = (updater) => {
          if (updater === update) {
            return;
          }
          arrayPush(updaters, updater);
          if (!tdz) {
            updater(value);
          }
        };
        liveGetNotify = {
          get,
          notify
        };
        localGetNotify[localName] = liveGetNotify;
        if (setProxyTrap) {
          defineProperty(moduleLexicals, localName, {
            get,
            set,
            enumerable: true,
            configurable: false
          });
        }
        liveVar[localName] = update;
      }
      exportsProps[liveExportName] = {
        get: liveGetNotify.get,
        set: void 0,
        enumerable: true,
        configurable: false
      };
      notifiers[liveExportName] = liveGetNotify.notify;
    }
  );
  const notifyStar = (update) => {
    update(exportsTarget);
  };
  notifiers["*"] = notifyStar;
  function imports(updateRecord) {
    const candidateAll = create(null);
    candidateAll.default = false;
    for (const [specifier, importUpdaters] of updateRecord) {
      const instance = mapGet(importedInstances, specifier);
      instance.execute();
      const { notifiers: importNotifiers } = instance;
      for (const [importName, updaters] of importUpdaters) {
        const importNotify = importNotifiers[importName];
        if (!importNotify) {
          throw SyntaxError2(
            `The requested module '${specifier}' does not provide an export named '${importName}'`
          );
        }
        for (const updater of updaters) {
          importNotify(updater);
        }
      }
      if (arrayIncludes(exportAlls, specifier)) {
        for (const [importAndExportName, importNotify] of entries(
          importNotifiers
        )) {
          if (candidateAll[importAndExportName] === void 0) {
            candidateAll[importAndExportName] = importNotify;
          } else {
            candidateAll[importAndExportName] = false;
          }
        }
      }
      if (reexportMap[specifier]) {
        for (const [localName, exportedName] of reexportMap[specifier]) {
          candidateAll[exportedName] = importNotifiers[localName];
        }
      }
    }
    for (const [exportName, notify] of entries(candidateAll)) {
      if (!notifiers[exportName] && notify !== false) {
        notifiers[exportName] = notify;
        let value;
        const update = (newValue) => value = newValue;
        notify(update);
        exportsProps[exportName] = {
          get() {
            return value;
          },
          set: void 0,
          enumerable: true,
          configurable: false
        };
      }
    }
    arrayForEach(
      arraySort(keys(exportsProps)),
      (k) => defineProperty(exportsTarget, k, exportsProps[k])
    );
    freeze(exportsTarget);
    activate();
  }
  let optFunctor;
  if (__syncModuleFunctor__ !== void 0) {
    optFunctor = __syncModuleFunctor__;
  } else {
    optFunctor = compartmentEvaluate(compartmentFields, functorSource, {
      globalObject: compartment.globalThis,
      transforms: __shimTransforms__,
      __moduleShimLexicals__: moduleLexicals
    });
  }
  let didThrow = false;
  let thrownError;
  function execute() {
    if (optFunctor) {
      const functor = optFunctor;
      optFunctor = null;
      try {
        functor(
          freeze({
            imports: freeze(imports),
            onceVar: freeze(onceVar),
            liveVar: freeze(liveVar),
            import: dynamicImport,
            importMeta
          })
        );
      } catch (e) {
        didThrow = true;
        thrownError = e;
      }
    }
    if (didThrow) {
      throw thrownError;
    }
  }
  return freeze({
    notifiers,
    exportsProxy,
    execute
  });
};

// node_modules/ses/src/module-link.js
var { Fail: Fail7, quote: q6 } = assert;
var link = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier) => {
  const { name: compartmentName, moduleRecords } = weakmapGet(
    compartmentPrivateFields,
    compartment
  );
  const moduleRecord = mapGet(moduleRecords, moduleSpecifier);
  if (moduleRecord === void 0) {
    throw ReferenceError2(
      `Missing link to module ${q6(moduleSpecifier)} from compartment ${q6(
        compartmentName
      )}`
    );
  }
  return instantiate(compartmentPrivateFields, moduleAliases2, moduleRecord);
};
function mayBePrecompiledModuleSource(moduleSource) {
  return typeof moduleSource.__syncModuleProgram__ === "string";
}
function validatePrecompiledModuleSource(moduleSource, moduleSpecifier) {
  const { __fixedExportMap__, __liveExportMap__ } = moduleSource;
  !isPrimitive(__fixedExportMap__) || Fail7`Property '__fixedExportMap__' of a precompiled module source must be an object, got ${q6(
    __fixedExportMap__
  )}, for module ${q6(moduleSpecifier)}`;
  !isPrimitive(__liveExportMap__) || Fail7`Property '__liveExportMap__' of a precompiled module source must be an object, got ${q6(
    __liveExportMap__
  )}, for module ${q6(moduleSpecifier)}`;
}
function mayBeVirtualModuleSource(moduleSource) {
  return typeof moduleSource.execute === "function";
}
function validateVirtualModuleSource(moduleSource, moduleSpecifier) {
  const { exports } = moduleSource;
  isArray(exports) || Fail7`Invalid module source: 'exports' of a virtual module source must be an array, got ${q6(
    exports
  )}, for module ${q6(moduleSpecifier)}`;
}
function validateModuleSource(moduleSource, moduleSpecifier) {
  !isPrimitive(moduleSource) || Fail7`Invalid module source: must be of type object, got ${q6(
    moduleSource
  )}, for module ${q6(moduleSpecifier)}`;
  const { imports, exports, reexports = [] } = moduleSource;
  isArray(imports) || Fail7`Invalid module source: 'imports' must be an array, got ${q6(
    imports
  )}, for module ${q6(moduleSpecifier)}`;
  isArray(exports) || Fail7`Invalid module source: 'exports' must be an array, got ${q6(
    exports
  )}, for module ${q6(moduleSpecifier)}`;
  isArray(reexports) || Fail7`Invalid module source: 'reexports' must be an array if present, got ${q6(
    reexports
  )}, for module ${q6(moduleSpecifier)}`;
}
var instantiate = (compartmentPrivateFields, moduleAliases2, moduleRecord) => {
  const { compartment, moduleSpecifier, resolvedImports, moduleSource } = moduleRecord;
  const { instances } = weakmapGet(compartmentPrivateFields, compartment);
  if (mapHas(instances, moduleSpecifier)) {
    return mapGet(instances, moduleSpecifier);
  }
  validateModuleSource(moduleSource, moduleSpecifier);
  const importedInstances = new Map2();
  let moduleInstance;
  if (mayBePrecompiledModuleSource(moduleSource)) {
    validatePrecompiledModuleSource(moduleSource, moduleSpecifier);
    moduleInstance = makeModuleInstance(
      compartmentPrivateFields,
      moduleAliases2,
      moduleRecord,
      importedInstances
    );
  } else if (mayBeVirtualModuleSource(moduleSource)) {
    validateVirtualModuleSource(moduleSource, moduleSpecifier);
    moduleInstance = makeVirtualModuleInstance(
      compartmentPrivateFields,
      moduleSource,
      compartment,
      moduleAliases2,
      moduleSpecifier,
      resolvedImports
    );
  } else {
    throw TypeError2(`Invalid module source, got ${q6(moduleSource)}`);
  }
  mapSet(instances, moduleSpecifier, moduleInstance);
  for (const [importSpecifier, resolvedSpecifier] of entries(resolvedImports)) {
    const importedInstance = link(
      compartmentPrivateFields,
      moduleAliases2,
      compartment,
      resolvedSpecifier
    );
    mapSet(importedInstances, importSpecifier, importedInstance);
  }
  return moduleInstance;
};

// node_modules/ses/src/compartment.js
var moduleAliases = new WeakMap();
var privateFields = new WeakMap();
var InertCompartment = function Compartment2(_endowments = {}, _modules = {}, _options = {}) {
  throw TypeError2(
    "Compartment.prototype.constructor is not a valid constructor."
  );
};
var compartmentImportNow = (compartment, specifier) => {
  const { execute, exportsProxy } = link(
    privateFields,
    moduleAliases,
    compartment,
    specifier
  );
  execute();
  return exportsProxy;
};
var CompartmentPrototype = {
  constructor: InertCompartment,
  get globalThis() {
    return (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this).globalObject
    );
  },
  get name() {
    return (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this).name
    );
  },
  evaluate(source, options = {}) {
    const compartmentFields = weakmapGet(privateFields, this);
    return compartmentEvaluate(compartmentFields, source, options);
  },
  module(specifier) {
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of module() must be a string");
    }
    const { exportsProxy } = getDeferredExports(
      this,
      weakmapGet(privateFields, this),
      moduleAliases,
      specifier
    );
    return exportsProxy;
  },
  async import(specifier) {
    const { noNamespaceBox, noAggregateLoadErrors } = (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this)
    );
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of import() must be a string");
    }
    return promiseThen(
      load(privateFields, moduleAliases, this, specifier, {
        noAggregateErrors: noAggregateLoadErrors
      }),
      () => {
        const namespace = compartmentImportNow(
          /** @type {Compartment} */
          this,
          specifier
        );
        if (noNamespaceBox) {
          return namespace;
        }
        return { namespace };
      }
    );
  },
  async load(specifier) {
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of load() must be a string");
    }
    const { noAggregateLoadErrors } = (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this)
    );
    return load(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors
    });
  },
  importNow(specifier) {
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of importNow() must be a string");
    }
    const { noAggregateLoadErrors } = (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this)
    );
    loadNow(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors
    });
    return compartmentImportNow(
      /** @type {Compartment} */
      this,
      specifier
    );
  }
};
defineProperties(CompartmentPrototype, {
  [toStringTagSymbol]: {
    value: "Compartment",
    writable: false,
    enumerable: false,
    configurable: true
  }
});
defineProperties(InertCompartment, {
  prototype: { value: CompartmentPrototype }
});
var compartmentOptions = (...args) => {
  if (args.length === 0) {
    return {};
  }
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && "__options__" in args[0]) {
    const { __options__, ...options } = args[0];
    assert(
      __options__ === true,
      `Compartment constructor only supports true __options__ sigil, got ${__options__}`
    );
    return options;
  } else {
    const [
      globals = (
        /** @type {Map<string, any>} */
        {}
      ),
      modules = (
        /** @type {Map<string, ModuleDescriptor>} */
        {}
      ),
      options = {}
    ] = (
      /** @type {LegacyCompartmentOptionsArgs} */
      args
    );
    assertEqual(
      options.modules,
      void 0,
      `Compartment constructor must receive either a module map argument or modules option, not both`
    );
    assertEqual(
      options.globals,
      void 0,
      `Compartment constructor must receive either globals argument or option, not both`
    );
    return {
      ...options,
      globals,
      modules
    };
  }
};
var makeCompartmentConstructor = (targetMakeCompartmentConstructor, intrinsics, markVirtualizedNativeFunction3, { parentCompartment = void 0, enforceNew = false } = {}) => {
  function Compartment3(...args) {
    if (enforceNew && new.target === void 0) {
      throw TypeError2(
        "Class constructor Compartment cannot be invoked without 'new'"
      );
    }
    const {
      name = "<unknown>",
      transforms: transforms2 = [],
      __shimTransforms__ = [],
      globals: endowmentsOption = {},
      modules: moduleMapOption = {},
      resolveHook,
      importHook,
      importNowHook,
      moduleMapHook,
      importMetaHook,
      __noNamespaceBox__: noNamespaceBox = false,
      noAggregateLoadErrors = false
    } = compartmentOptions(...args);
    const globalTransforms = arrayFlatMap(
      [transforms2, __shimTransforms__],
      identity
    );
    const endowments = { __proto__: null, ...endowmentsOption };
    const moduleMap = { __proto__: null, ...moduleMapOption };
    const moduleRecords = new Map2();
    const instances = new Map2();
    const deferredExports = new Map2();
    const globalObject = {};
    const compartment = this;
    setGlobalObjectSymbolUnscopables(globalObject);
    setGlobalObjectConstantProperties(globalObject);
    const { safeEvaluate } = makeSafeEvaluator({
      globalObject,
      globalTransforms,
      sloppyGlobalsMode: false
    });
    setGlobalObjectMutableProperties(globalObject, {
      intrinsics,
      newGlobalPropertyNames: sharedGlobalPropertyNames,
      makeCompartmentConstructor: targetMakeCompartmentConstructor,
      parentCompartment: this,
      markVirtualizedNativeFunction: markVirtualizedNativeFunction3
    });
    setGlobalObjectEvaluators(
      globalObject,
      safeEvaluate,
      markVirtualizedNativeFunction3
    );
    assign(globalObject, endowments);
    const compartmentImport = async (fullSpecifier) => {
      if (typeof resolveHook !== "function") {
        throw TypeError2(
          `Compartment does not support dynamic import: no configured resolveHook for compartment ${quote(name)}`
        );
      }
      await load(privateFields, moduleAliases, compartment, fullSpecifier, {
        noAggregateErrors: noAggregateLoadErrors
      });
      const { execute, exportsProxy } = link(
        privateFields,
        moduleAliases,
        compartment,
        fullSpecifier
      );
      execute();
      return exportsProxy;
    };
    weakmapSet(privateFields, this, {
      name: `${name}`,
      globalTransforms,
      globalObject,
      safeEvaluate,
      resolveHook,
      importHook,
      importNowHook,
      moduleMap,
      moduleMapHook,
      importMetaHook,
      moduleRecords,
      __shimTransforms__,
      deferredExports,
      instances,
      parentCompartment,
      noNamespaceBox,
      compartmentImport,
      noAggregateLoadErrors
    });
  }
  Compartment3.prototype = CompartmentPrototype;
  return Compartment3;
};

// node_modules/ses/src/get-anonymous-intrinsics.js
function getConstructorOf(obj) {
  return getPrototypeOf(obj).constructor;
}
function makeArguments() {
  return arguments;
}
var getAnonymousIntrinsics = () => {
  const InertFunction = FERAL_FUNCTION.prototype.constructor;
  const argsCalleeDesc = getOwnPropertyDescriptor(makeArguments(), "callee");
  const ThrowTypeError = argsCalleeDesc && argsCalleeDesc.get;
  const StringIteratorObject = iterateString(new String2());
  const StringIteratorPrototype = getPrototypeOf(StringIteratorObject);
  const RegExpStringIterator = regexpPrototype[matchAllSymbol] && matchAllRegExp(/./);
  const RegExpStringIteratorPrototype = RegExpStringIterator && getPrototypeOf(RegExpStringIterator);
  const ArrayIteratorObject = iterateArray([]);
  const ArrayIteratorPrototype = getPrototypeOf(ArrayIteratorObject);
  const TypedArray2 = getPrototypeOf(Float32Array);
  const MapIteratorObject = iterateMap(new Map2());
  const MapIteratorPrototype = getPrototypeOf(MapIteratorObject);
  const SetIteratorObject = iterateSet(new Set());
  const SetIteratorPrototype = getPrototypeOf(SetIteratorObject);
  const IteratorPrototype = getPrototypeOf(ArrayIteratorPrototype);
  function* GeneratorFunctionInstance() {
  }
  const GeneratorFunction = getConstructorOf(GeneratorFunctionInstance);
  const Generator = GeneratorFunction.prototype;
  async function AsyncFunctionInstance2() {
  }
  const AsyncFunction = getConstructorOf(AsyncFunctionInstance2);
  const intrinsics = {
    "%InertFunction%": InertFunction,
    "%ArrayIteratorPrototype%": ArrayIteratorPrototype,
    "%InertAsyncFunction%": AsyncFunction,
    "%Generator%": Generator,
    "%InertGeneratorFunction%": GeneratorFunction,
    "%IteratorPrototype%": IteratorPrototype,
    "%MapIteratorPrototype%": MapIteratorPrototype,
    "%RegExpStringIteratorPrototype%": RegExpStringIteratorPrototype,
    "%SetIteratorPrototype%": SetIteratorPrototype,
    "%StringIteratorPrototype%": StringIteratorPrototype,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray2,
    "%InertCompartment%": InertCompartment
  };
  if (AsyncGeneratorFunctionInstance !== void 0) {
    const AsyncGeneratorFunction = getConstructorOf(
      AsyncGeneratorFunctionInstance
    );
    const AsyncGenerator = AsyncGeneratorFunction.prototype;
    const AsyncGeneratorPrototype = AsyncGenerator.prototype;
    const AsyncIteratorPrototype = getPrototypeOf(AsyncGeneratorPrototype);
    assign(intrinsics, {
      "%AsyncGenerator%": AsyncGenerator,
      "%InertAsyncGeneratorFunction%": AsyncGeneratorFunction,
      "%AsyncGeneratorPrototype%": AsyncGeneratorPrototype,
      "%AsyncIteratorPrototype%": AsyncIteratorPrototype
    });
  }
  if (universalThis.Iterator) {
    intrinsics["%IteratorHelperPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.Iterator.from([]).take(0)
    );
    intrinsics["%WrapForValidIteratorPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.Iterator.from({
        next() {
          return { value: void 0 };
        }
      })
    );
  }
  if (universalThis.AsyncIterator) {
    intrinsics["%AsyncIteratorHelperPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.AsyncIterator.from([]).take(0)
    );
    intrinsics["%WrapForValidAsyncIteratorPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.AsyncIterator.from({ next() {
      } })
    );
  }
  const ab = new ArrayBuffer(0);
  const iab = ab.sliceToImmutable();
  const iabProto = getPrototypeOf(iab);
  if (iabProto !== ArrayBuffer.prototype) {
    intrinsics["%ImmutableArrayBufferPrototype%"] = iabProto;
  }
  return intrinsics;
};

// node_modules/ses/src/tame-harden.js
var tameHarden = (safeHarden2, hardenTaming) => {
  if (hardenTaming === "safe") {
    return safeHarden2;
  }
  Object.isExtensible = () => false;
  Object.isFrozen = () => true;
  Object.isSealed = () => true;
  Reflect.isExtensible = () => false;
  if (safeHarden2.isFake) {
    return safeHarden2;
  }
  const fakeHarden = (arg) => arg;
  fakeHarden.isFake = true;
  return freeze(fakeHarden);
};
freeze(tameHarden);

// node_modules/ses/src/tame-symbol-constructor.js
var tameSymbolConstructor = () => {
  const OriginalSymbol = Symbol2;
  const SymbolPrototype = OriginalSymbol.prototype;
  const SharedSymbol = functionBind(Symbol2, void 0);
  defineProperties(SymbolPrototype, {
    constructor: {
      value: SharedSymbol
      // leave other `constructor` attributes as is
    }
  });
  const originalDescsEntries = entries(
    getOwnPropertyDescriptors(OriginalSymbol)
  );
  const descs = fromEntries(
    arrayMap(originalDescsEntries, ([name, desc]) => [
      name,
      { ...desc, configurable: true }
    ])
  );
  defineProperties(SharedSymbol, descs);
  return { "%SharedSymbol%": SharedSymbol };
};

// node_modules/ses/src/tame-faux-data-properties.js
var throws = (thunk) => {
  try {
    thunk();
    return false;
  } catch (er) {
    return true;
  }
};
var tameFauxDataProperty = (obj, prop, expectedValue) => {
  if (obj === void 0) {
    return false;
  }
  const desc = getOwnPropertyDescriptor(obj, prop);
  if (!desc || "value" in desc) {
    return false;
  }
  const { get, set } = desc;
  if (typeof get !== "function" || typeof set !== "function") {
    return false;
  }
  if (get() !== expectedValue) {
    return false;
  }
  if (apply(get, obj, []) !== expectedValue) {
    return false;
  }
  const testValue = "Seems to be a setter";
  const subject1 = { __proto__: null };
  apply(set, subject1, [testValue]);
  if (subject1[prop] !== testValue) {
    return false;
  }
  const subject2 = { __proto__: obj };
  apply(set, subject2, [testValue]);
  if (subject2[prop] !== testValue) {
    return false;
  }
  if (!throws(() => apply(set, obj, [expectedValue]))) {
    return false;
  }
  if ("originalValue" in get) {
    return false;
  }
  if (desc.configurable === false) {
    return false;
  }
  defineProperty(obj, prop, {
    value: expectedValue,
    writable: true,
    enumerable: desc.enumerable,
    configurable: true
  });
  return true;
};
var tameFauxDataProperties = (intrinsics) => {
  tameFauxDataProperty(
    intrinsics["%IteratorPrototype%"],
    "constructor",
    intrinsics.Iterator
  );
  tameFauxDataProperty(
    intrinsics["%IteratorPrototype%"],
    toStringTagSymbol,
    "Iterator"
  );
};

// node_modules/ses/src/tame-regenerator-runtime.js
var tameRegeneratorRuntime = () => {
  const iter = iteratorPrototype[iteratorSymbol];
  defineProperty(iteratorPrototype, iteratorSymbol, {
    configurable: true,
    get() {
      return iter;
    },
    set(value) {
      if (this === iteratorPrototype) return;
      if (hasOwn(this, iteratorSymbol)) {
        this[iteratorSymbol] = value;
      }
      defineProperty(this, iteratorSymbol, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  });
};

// node_modules/ses/src/shim-arraybuffer-transfer.js
var shimArrayBufferTransfer = () => {
  if (typeof arrayBufferPrototype.transfer === "function") {
    return {};
  }
  const clone = universalThis.structuredClone;
  if (typeof clone !== "function") {
    return {};
  }
  const methods = {
    /**
     * @param {number} [newLength]
     */
    transfer(newLength = void 0) {
      const oldLength = arrayBufferGetByteLength(this);
      if (newLength === void 0 || newLength === oldLength) {
        return clone(this, { transfer: [this] });
      }
      if (typeof newLength !== "number") {
        throw TypeError2(`transfer newLength if provided must be a number`);
      }
      if (newLength > oldLength) {
        const result = new ArrayBuffer(newLength);
        const taOld = new Uint8Array(this);
        const taNew = new Uint8Array(result);
        typedArraySet(taNew, taOld);
        clone(this, { transfer: [this] });
        return result;
      } else {
        const result = arrayBufferSlice(this, 0, newLength);
        clone(this, { transfer: [this] });
        return result;
      }
    }
  };
  defineProperty(arrayBufferPrototype, "transfer", {
    // @ts-expect-error
    value: methods.transfer,
    writable: true,
    enumerable: false,
    configurable: true
  });
  return {};
};

// node_modules/ses/src/reporting.js
var makeReportPrinter = (print) => {
  let indent = false;
  const printIndent = (...args) => {
    if (indent) {
      print(" ", ...args);
    } else {
      print(...args);
    }
  };
  return (
    /** @type {GroupReporter} */
    {
      warn(...args) {
        printIndent(...args);
      },
      error(...args) {
        printIndent(...args);
      },
      groupCollapsed(...args) {
        assert(!indent);
        print(...args);
        indent = true;
      },
      groupEnd() {
        indent = false;
      }
    }
  );
};
var mute = () => {
};
var chooseReporter = (reporting) => {
  if (reporting === "none") {
    return makeReportPrinter(mute);
  }
  if (reporting === "console" || universalThis.window === universalThis || universalThis.importScripts !== void 0) {
    return console;
  }
  if (universalThis.console !== void 0) {
    const console2 = universalThis.console;
    const error = functionBind(console2.error, console2);
    return makeReportPrinter(error);
  }
  if (universalThis.print !== void 0) {
    return makeReportPrinter(universalThis.print);
  }
  return makeReportPrinter(mute);
};
var reportInGroup = (groupLabel, console2, callback) => {
  const { warn, error, groupCollapsed, groupEnd } = console2;
  const grouping = groupCollapsed && groupEnd;
  let groupStarted = false;
  try {
    return callback({
      warn(...args) {
        if (grouping && !groupStarted) {
          groupCollapsed(groupLabel);
          groupStarted = true;
        }
        warn(...args);
      },
      error(...args) {
        if (grouping && !groupStarted) {
          groupCollapsed(groupLabel);
          groupStarted = true;
        }
        error(...args);
      }
    });
  } finally {
    if (grouping && groupStarted) {
      groupEnd();
      groupStarted = false;
    }
  }
};

// node_modules/ses/src/lockdown.js
var { Fail: Fail8, details: X, quote: q7 } = assert;
var priorRepairIntrinsics;
var priorHardenIntrinsics;
var safeHarden = makeHardener();
var probeHostEvaluators = () => {
  let functionAllowed;
  try {
    functionAllowed = FERAL_FUNCTION("return true")();
  } catch (_error) {
    functionAllowed = false;
  }
  let evalAllowed;
  try {
    evalAllowed = FERAL_EVAL("true");
  } catch (_error) {
    evalAllowed = false;
  }
  let directEvalAllowed;
  if (functionAllowed && evalAllowed) {
    directEvalAllowed = FERAL_FUNCTION(
      "eval",
      "SES_changed",
      `        eval("SES_changed = true");
        return SES_changed;
      `
    )(FERAL_EVAL, false);
    if (!directEvalAllowed) {
      delete universalThis.SES_changed;
    }
  }
  return { functionAllowed, evalAllowed, directEvalAllowed };
};
var repairIntrinsics = (options = {}) => {
  const {
    errorTaming = (
      /** @type {'safe' | 'unsafe' | 'unsafe-debug'} */
      getEnvironmentOption("LOCKDOWN_ERROR_TAMING", "safe", ["unsafe", "unsafe-debug"])
    ),
    errorTrapping = (
      /** @type {'platform' | 'none' | 'report' | 'abort' | 'exit'} */
      getEnvironmentOption("LOCKDOWN_ERROR_TRAPPING", "platform", [
        "none",
        "report",
        "abort",
        "exit"
      ])
    ),
    reporting = (
      /** @type {'platform' | 'console' | 'none'} */
      getEnvironmentOption("LOCKDOWN_REPORTING", "platform", ["console", "none"])
    ),
    unhandledRejectionTrapping = (
      /** @type {'none' | 'report'} */
      getEnvironmentOption("LOCKDOWN_UNHANDLED_REJECTION_TRAPPING", "report", ["none"])
    ),
    regExpTaming = (
      /** @type {'safe' | 'unsafe'} */
      getEnvironmentOption("LOCKDOWN_REGEXP_TAMING", "safe", ["unsafe"])
    ),
    localeTaming = (
      /** @type {'safe' | 'unsafe'} */
      getEnvironmentOption("LOCKDOWN_LOCALE_TAMING", "safe", ["unsafe"])
    ),
    consoleTaming = (
      /** @type {'unsafe' | 'safe'} */
      getEnvironmentOption("LOCKDOWN_CONSOLE_TAMING", "safe", ["unsafe"])
    ),
    overrideTaming = (
      /** @type {'moderate' | 'min' | 'severe'} */
      getEnvironmentOption("LOCKDOWN_OVERRIDE_TAMING", "moderate", ["min", "severe"])
    ),
    stackFiltering = (
      /** @type {'concise' | 'omit-frames' | 'shorten-paths' | 'verbose'} */
      getEnvironmentOption("LOCKDOWN_STACK_FILTERING", "concise", [
        "omit-frames",
        "shorten-paths",
        "verbose"
      ])
    ),
    domainTaming = (
      /** @type {'safe' | 'unsafe'} */
      getEnvironmentOption("LOCKDOWN_DOMAIN_TAMING", "safe", ["unsafe"])
    ),
    evalTaming = (
      /** @type {'safe-eval' | 'unsafe-eval' | 'no-eval'} */
      getEnvironmentOption("LOCKDOWN_EVAL_TAMING", "safe-eval", [
        "unsafe-eval",
        "no-eval",
        // deprecated
        "safeEval",
        "unsafeEval",
        "noEval"
      ])
    ),
    overrideDebug = (
      /** @type {string[]} */
      arrayFilter(
        stringSplit(getEnvironmentOption("LOCKDOWN_OVERRIDE_DEBUG", ""), ","),
        /** @param {string} debugName */
        (debugName) => debugName !== ""
      )
    ),
    legacyRegeneratorRuntimeTaming = (
      /** @type {'safe' | 'unsafe-ignore'} */
      getEnvironmentOption("LOCKDOWN_LEGACY_REGENERATOR_RUNTIME_TAMING", "safe", [
        "unsafe-ignore"
      ])
    ),
    __hardenTaming__ = (
      /** @type {'safe' | 'unsafe'} */
      getEnvironmentOption("LOCKDOWN_HARDEN_TAMING", "safe", ["unsafe"])
    ),
    dateTaming,
    // deprecated
    mathTaming,
    // deprecated
    ...extraOptions
  } = options;
  const extraOptionsNames = ownKeys(extraOptions);
  extraOptionsNames.length === 0 || Fail8`lockdown(): non supported option ${q7(extraOptionsNames)}`;
  const reporter = chooseReporter(reporting);
  const { warn } = reporter;
  if (dateTaming !== void 0) {
    warn(
      `SES The 'dateTaming' option is deprecated and does nothing. In the future specifying it will be an error.`
    );
  }
  if (mathTaming !== void 0) {
    warn(
      `SES The 'mathTaming' option is deprecated and does nothing. In the future specifying it will be an error.`
    );
  }
  priorRepairIntrinsics === void 0 || // eslint-disable-next-line @endo/no-polymorphic-call
  assert.fail(
    X`Already locked down at ${priorRepairIntrinsics} (SES_ALREADY_LOCKED_DOWN)`,
    TypeError2
  );
  priorRepairIntrinsics = TypeError2("Prior lockdown (SES_ALREADY_LOCKED_DOWN)");
  priorRepairIntrinsics.stack;
  const { functionAllowed, evalAllowed, directEvalAllowed } = probeHostEvaluators();
  if (directEvalAllowed === false && evalTaming === "safe-eval" && (functionAllowed || evalAllowed)) {
    throw TypeError2(
      "SES cannot initialize unless 'eval' is the original intrinsic 'eval', suitable for direct eval (dynamically scoped eval) (SES_DIRECT_EVAL)"
    );
  }
  const seemsToBeLockedDown = () => {
    return universalThis.Function.prototype.constructor !== universalThis.Function && // @ts-ignore harden is absent on globalThis type def.
    typeof universalThis.harden === "function" && // @ts-ignore lockdown is absent on globalThis type def.
    typeof universalThis.lockdown === "function" && universalThis.Date.prototype.constructor !== universalThis.Date && typeof universalThis.Date.now === "function" && // @ts-ignore does not recognize that Date constructor is a special
    // Function.
    // eslint-disable-next-line @endo/no-polymorphic-call
    is(universalThis.Date.prototype.constructor.now(), NaN);
  };
  if (seemsToBeLockedDown()) {
    throw TypeError2(
      `Already locked down but not by this SES instance (SES_MULTIPLE_INSTANCES)`
    );
  }
  tameDomains(domainTaming);
  const markVirtualizedNativeFunction3 = tameFunctionToString();
  const { addIntrinsics, completePrototypes, finalIntrinsics } = makeIntrinsicsCollector(reporter);
  const tamedHarden = tameHarden(safeHarden, __hardenTaming__);
  addIntrinsics({ harden: tamedHarden });
  addIntrinsics(tameFunctionConstructors());
  addIntrinsics(tameDateConstructor());
  addIntrinsics(tameErrorConstructor(errorTaming, stackFiltering));
  addIntrinsics(tameMathObject());
  addIntrinsics(tameRegExpConstructor(regExpTaming));
  addIntrinsics(tameSymbolConstructor());
  addIntrinsics(shimArrayBufferTransfer());
  addIntrinsics(tameModuleSource());
  addIntrinsics(getAnonymousIntrinsics());
  completePrototypes();
  const intrinsics = finalIntrinsics();
  const hostIntrinsics = { __proto__: null };
  if (typeof universalThis.Buffer === "function") {
    hostIntrinsics.Buffer = universalThis.Buffer;
  }
  let optGetStackString;
  if (errorTaming === "safe") {
    optGetStackString = intrinsics["%InitialGetStackString%"];
  }
  const consoleRecord = tameConsole(
    consoleTaming,
    errorTrapping,
    unhandledRejectionTrapping,
    optGetStackString
  );
  universalThis.console = /** @type {Console} */
  consoleRecord.console;
  if (typeof /** @type {any} */
  consoleRecord.console._times === "object") {
    hostIntrinsics.SafeMap = getPrototypeOf(
      // eslint-disable-next-line no-underscore-dangle
      /** @type {any} */
      consoleRecord.console._times
    );
  }
  if ((errorTaming === "unsafe" || errorTaming === "unsafe-debug") && universalThis.assert === assert) {
    universalThis.assert = makeAssert(void 0, true);
  }
  tameLocaleMethods(intrinsics, localeTaming);
  tameFauxDataProperties(intrinsics);
  reportInGroup(
    "SES Removing unpermitted intrinsics",
    reporter,
    (groupReporter) => removeUnpermittedIntrinsics(
      intrinsics,
      markVirtualizedNativeFunction3,
      groupReporter
    )
  );
  setGlobalObjectConstantProperties(universalThis);
  setGlobalObjectMutableProperties(universalThis, {
    intrinsics,
    newGlobalPropertyNames: initialGlobalPropertyNames,
    makeCompartmentConstructor,
    markVirtualizedNativeFunction: markVirtualizedNativeFunction3
  });
  if (evalTaming === "no-eval" || // deprecated
  evalTaming === "noEval") {
    setGlobalObjectEvaluators(
      universalThis,
      noEvalEvaluate,
      markVirtualizedNativeFunction3
    );
  } else if (evalTaming === "safe-eval" || // deprecated
  evalTaming === "safeEval") {
    const { safeEvaluate } = makeSafeEvaluator({ globalObject: universalThis });
    setGlobalObjectEvaluators(
      universalThis,
      safeEvaluate,
      markVirtualizedNativeFunction3
    );
  } else if (evalTaming === "unsafe-eval" || // deprecated
  evalTaming === "unsafeEval") {
  }
  const hardenIntrinsics = () => {
    priorHardenIntrinsics === void 0 || // eslint-disable-next-line @endo/no-polymorphic-call
    assert.fail(
      X`Already locked down at ${priorHardenIntrinsics} (SES_ALREADY_LOCKED_DOWN)`,
      TypeError2
    );
    priorHardenIntrinsics = TypeError2(
      "Prior lockdown (SES_ALREADY_LOCKED_DOWN)"
    );
    priorHardenIntrinsics.stack;
    reportInGroup(
      "SES Enabling property overrides",
      reporter,
      (groupReporter) => enablePropertyOverrides(
        intrinsics,
        overrideTaming,
        groupReporter,
        overrideDebug
      )
    );
    if (legacyRegeneratorRuntimeTaming === "unsafe-ignore") {
      tameRegeneratorRuntime();
    }
    const toHarden = {
      intrinsics,
      hostIntrinsics,
      globals: {
        // Harden evaluators
        Function: universalThis.Function,
        eval: universalThis.eval,
        // @ts-ignore Compartment does exist on globalThis
        Compartment: universalThis.Compartment,
        // Harden Symbol
        Symbol: universalThis.Symbol
      }
    };
    for (const prop of getOwnPropertyNames(initialGlobalPropertyNames)) {
      toHarden.globals[prop] = universalThis[prop];
    }
    tamedHarden(toHarden);
    return tamedHarden;
  };
  return hardenIntrinsics;
};

// node_modules/ses/src/lockdown-shim.js
universalThis.lockdown = (options) => {
  const hardenIntrinsics = repairIntrinsics(options);
  universalThis.harden = hardenIntrinsics();
};
universalThis.repairIntrinsics = (options) => {
  const hardenIntrinsics = repairIntrinsics(options);
  universalThis.hardenIntrinsics = () => {
    universalThis.harden = hardenIntrinsics();
  };
};

// node_modules/ses/src/compartment-shim.js
var markVirtualizedNativeFunction2 = tameFunctionToString();
var muteReporter = chooseReporter("none");
universalThis.Compartment = makeCompartmentConstructor(
  makeCompartmentConstructor,
  // Any reporting that would need to be done should have already been done
  // during `lockdown()`.
  // See https://github.com/endojs/endo/pull/2624#discussion_r1840979770
  getGlobalIntrinsics(universalThis, muteReporter),
  markVirtualizedNativeFunction2,
  {
    enforceNew: true
  }
);

// node_modules/ses/src/assert-shim.js
universalThis.assert = assert;

// node_modules/ses/src/console-shim.js
var makeCausalConsoleFromLoggerForSesAva = defineCausalConsoleFromLogger(loggedErrorHandler);
var MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA = symbolFor(
  "MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA"
);
universalThis[MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA] = makeCausalConsoleFromLoggerForSesAva;

// src/runtime/sandbox.ts
var locked = false;
function initializeSES() {
  if (locked) return;
  lockdown({
    // "unsafe" errorTaming preserves stack traces for debugging
    errorTaming: "unsafe",
    // Report unhandled rejections rather than crashing
    unhandledRejectionTrapping: "report",
    // Preserve console for debugging
    consoleTaming: "unsafe",
    // "moderate" allows safe override of frozen properties via assignment
    overrideTaming: "moderate",
    // Verbose stacks during development
    stackFiltering: "verbose"
  });
  locked = true;
}
function createCompartment(name, endowments) {
  if (!locked) {
    throw new Error("SES not initialized \u2014 call initializeSES() first");
  }
  const hardened = harden({
    console: endowments.console,
    __worldAPI: endowments.__worldAPI,
    __objectAPI: endowments.__objectAPI,
    __containerAPI: endowments.__containerAPI,
    __owner: endowments.__owner,
    __scriptId: endowments.__scriptId,
    // Safe globals that SES already freezes but we explicitly provide
    Math,
    JSON,
    Date,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURI,
    encodeURIComponent,
    decodeURI,
    decodeURIComponent
    // No: fetch, XMLHttpRequest, WebSocket, Worker, eval, Function, Proxy, Reflect
    // No: window, document, location, navigator, self, globalThis
    // No: setTimeout, setInterval (proxied through timer manager)
  });
  return new Compartment(
    {
      ...hardened,
      __exports: endowments.__exports,
      // Runtime types (unhardened so user classes can extend WorldScript)
      WorldScript: endowments.WorldScript,
      Vector3: endowments.Vector3,
      Quaternion: endowments.Quaternion
    },
    {},
    { name: `script:${name}` }
  );
}
function evaluateScript(compartment, code) {
  try {
    compartment.evaluate(code);
    const exports = compartment.globalThis.__exports;
    const scriptClass = exports?.default;
    if (!scriptClass) {
      return {
        scriptClass: null,
        error: "Script did not export a default class"
      };
    }
    return { scriptClass };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { scriptClass: null, error: message };
  }
}

// src/types/math.ts
var Vector3 = class _Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(other) {
    return new _Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  subtract(other) {
    return new _Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  scale(factor) {
    return new _Vector3(this.x * factor, this.y * factor, this.z * factor);
  }
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  cross(other) {
    return new _Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  normalize() {
    const len = this.length();
    if (len === 0) return new _Vector3();
    return this.scale(1 / len);
  }
  distanceTo(other) {
    return this.subtract(other).length();
  }
  equals(other, epsilon = 1e-6) {
    return Math.abs(this.x - other.x) < epsilon && Math.abs(this.y - other.y) < epsilon && Math.abs(this.z - other.z) < epsilon;
  }
  clone() {
    return new _Vector3(this.x, this.y, this.z);
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  toString() {
    return `<${this.x}, ${this.y}, ${this.z}>`;
  }
  static ZERO = new _Vector3(0, 0, 0);
  static ONE = new _Vector3(1, 1, 1);
  static UP = new _Vector3(0, 1, 0);
  static FORWARD = new _Vector3(0, 0, 1);
  static RIGHT = new _Vector3(1, 0, 0);
  /** Parse LSL-style vector string: "<1.0, 2.0, 3.0>" */
  static fromLSL(str) {
    const match = str.match(
      /<\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*>/
    );
    if (!match) throw new Error(`Invalid LSL vector: ${str}`);
    return new _Vector3(
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3])
    );
  }
};
var Quaternion = class _Quaternion {
  constructor(x = 0, y = 0, z = 0, s = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.s = s;
  }
  multiply(other) {
    return new _Quaternion(
      this.s * other.x + this.x * other.s + this.y * other.z - this.z * other.y,
      this.s * other.y - this.x * other.z + this.y * other.s + this.z * other.x,
      this.s * other.z + this.x * other.y - this.y * other.x + this.z * other.s,
      this.s * other.s - this.x * other.x - this.y * other.y - this.z * other.z
    );
  }
  normalize() {
    const len = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.s * this.s
    );
    if (len === 0) return new _Quaternion();
    return new _Quaternion(
      this.x / len,
      this.y / len,
      this.z / len,
      this.s / len
    );
  }
  inverse() {
    const norm = this.x * this.x + this.y * this.y + this.z * this.z + this.s * this.s;
    if (norm === 0) return new _Quaternion();
    return new _Quaternion(
      -this.x / norm,
      -this.y / norm,
      -this.z / norm,
      this.s / norm
    );
  }
  /** Convert to Euler angles (degrees) — matches llRot2Euler behavior */
  toEuler() {
    const sinr_cosp = 2 * (this.s * this.x + this.y * this.z);
    const cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);
    const sinp = 2 * (this.s * this.y - this.z * this.x);
    const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);
    const siny_cosp = 2 * (this.s * this.z + this.x * this.y);
    const cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);
    return new Vector3(roll, pitch, yaw);
  }
  equals(other, epsilon = 1e-6) {
    return Math.abs(this.x - other.x) < epsilon && Math.abs(this.y - other.y) < epsilon && Math.abs(this.z - other.z) < epsilon && Math.abs(this.s - other.s) < epsilon;
  }
  clone() {
    return new _Quaternion(this.x, this.y, this.z, this.s);
  }
  toString() {
    return `<${this.x}, ${this.y}, ${this.z}, ${this.s}>`;
  }
  static IDENTITY = new _Quaternion(0, 0, 0, 1);
  /** Create from Euler angles (radians) — matches llEuler2Rot */
  static fromEuler(v) {
    const cr = Math.cos(v.x / 2);
    const sr = Math.sin(v.x / 2);
    const cp = Math.cos(v.y / 2);
    const sp = Math.sin(v.y / 2);
    const cy = Math.cos(v.z / 2);
    const sy = Math.sin(v.z / 2);
    return new _Quaternion(
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy,
      cr * cp * cy + sr * sp * sy
    );
  }
  /** Create rotation from axis and angle */
  static fromAxisAngle(axis, angle) {
    const half = angle / 2;
    const s = Math.sin(half);
    const norm = axis.normalize();
    return new _Quaternion(norm.x * s, norm.y * s, norm.z * s, Math.cos(half));
  }
  /** Parse LSL-style rotation string: "<0.0, 0.0, 0.0, 1.0>" */
  static fromLSL(str) {
    const match = str.match(
      /<\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*>/
    );
    if (!match) throw new Error(`Invalid LSL rotation: ${str}`);
    return new _Quaternion(
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3]),
      parseFloat(match[4])
    );
  }
};
var Color3 = class _Color3 {
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  toVector3() {
    return new Vector3(this.r, this.g, this.b);
  }
  toHex() {
    const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, "0");
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
  }
  toString() {
    return `<${this.r}, ${this.g}, ${this.b}>`;
  }
  static WHITE = new _Color3(1, 1, 1);
  static BLACK = new _Color3(0, 0, 0);
  static RED = new _Color3(1, 0, 0);
  static GREEN = new _Color3(0, 1, 0);
  static BLUE = new _Color3(0, 0, 1);
  static fromHex(hex) {
    const h = hex.replace("#", "");
    return new _Color3(
      parseInt(h.substring(0, 2), 16) / 255,
      parseInt(h.substring(2, 4), 16) / 255,
      parseInt(h.substring(4, 6), 16) / 255
    );
  }
  static fromVector3(v) {
    return new _Color3(v.x, v.y, v.z);
  }
};

// src/runtime/sandbox-prelude.ts
Vector3.fromString = Vector3.fromLSL;
Quaternion.fromString = Quaternion.fromLSL;
var WorldScript = class {
  /** State definitions — overridden by subclass */
  states = {};
  /** Current state name */
  _currentState = "default";
  get currentState() {
    return this._currentState;
  }
  // === State Machine ===
  async transitionTo(newState) {
    if (newState === this._currentState) return;
    const oldState = this._currentState;
    const exitHandler = this.states[oldState]?.onStateExit;
    if (exitHandler) await exitHandler.call(this, oldState);
    this._currentState = newState;
    const entryHandler = this.states[newState]?.onStateEntry;
    if (entryHandler) await entryHandler.call(this, newState);
  }
  // === Communication (llSay, llWhisper, llShout, etc.) ===
  say(channel, message) {
    this.world.say(channel, message);
  }
  whisper(channel, message) {
    this.world.whisper(channel, message);
  }
  shout(channel, message) {
    this.world.shout(channel, message);
  }
  ownerSay(message) {
    this.world.ownerSay(message);
  }
  listen(channel, name, id, message) {
    return this.world.listen(channel, name, id, message);
  }
  listenRemove(handle) {
    this.world.listenRemove(handle);
  }
  sendLinkMessage(link2, num, str, id) {
    this.container.sendLinkMessage(link2, num, str, id);
  }
  // === Timers ===
  setTimer(interval, id) {
    return this.world.setTimer(interval, id);
  }
  clearTimer(id) {
    this.world.clearTimer(id);
  }
  delay(seconds) {
    return new Promise((resolve) => {
      this.world.setTimeout(resolve, seconds * 1e3);
    });
  }
  // === Permissions ===
  requestPermissions(...args) {
    this.world.requestPermissions(...args);
  }
  getPermissions() {
    return this.world.getPermissions();
  }
  startAnimation(name) {
    this.world.startAnimation(name);
  }
  stopAnimation(name) {
    this.world.stopAnimation(name);
  }
  // === Perception ===
  sensor(name, id, type, range, arc) {
    this.world.sensor(name, id, type, range, arc);
  }
  sensorRepeat(name, id, type, range, arc, rate) {
    this.world.sensorRepeat(name, id, type, range, arc, rate);
  }
  sensorRemove() {
    this.world.sensorRemove();
  }
  // === Lifecycle ===
  die() {
    this.world.die();
  }
  reset() {
    this.world.resetScript();
  }
  // === Utility ===
  random() {
    return Math.random();
  }
  getTime() {
    return this.world.getTime();
  }
  log(...args) {
    this.world.log(...args);
  }
};

// src/runtime/worker-entry.ts
var scripts = /* @__PURE__ */ new Map();
var nextCallId = 0;
var pendingCalls = /* @__PURE__ */ new Map();
function sendToMain(message) {
  self.postMessage(message);
}
function createAPIProxy(scriptId, namespace) {
  return new Proxy({}, {
    get(_target, prop) {
      return (...args) => {
        const callId = nextCallId++;
        const method = `${namespace}.${prop}`;
        return new Promise((resolve, reject) => {
          pendingCalls.set(callId, { resolve, reject });
          sendToMain({
            type: "api-call",
            scriptId,
            callId,
            method,
            args
          });
        });
      };
    }
  });
}
function createConsoleProxy(scriptId) {
  return {
    log: (...args) => sendToMain({ type: "log", scriptId, level: "log", args }),
    warn: (...args) => sendToMain({ type: "log", scriptId, level: "warn", args }),
    error: (...args) => sendToMain({ type: "log", scriptId, level: "error", args })
  };
}
function initScript(scriptId, code, name, config) {
  try {
    const exports = {};
    const endowments = {
      console: createConsoleProxy(scriptId),
      __worldAPI: createAPIProxy(scriptId, "world"),
      __objectAPI: createAPIProxy(scriptId, "object"),
      __containerAPI: createAPIProxy(scriptId, "container"),
      __owner: { id: "", name: "", username: "" },
      // Injected by main thread
      __scriptId: scriptId,
      __exports: exports,
      // Runtime types — provided so stripped imports still resolve
      WorldScript,
      Vector3,
      Quaternion
    };
    const compartment = createCompartment(name, endowments);
    evaluateScript(compartment, code);
    const ScriptClass = exports.default;
    if (!ScriptClass || typeof ScriptClass !== "function") {
      sendToMain({
        type: "error",
        scriptId,
        error: "Script did not export a default class"
      });
      return;
    }
    const instance = new ScriptClass();
    Object.defineProperty(instance, "scriptId", { value: scriptId, writable: false });
    Object.defineProperty(instance, "world", { value: createAPIProxy(scriptId, "world"), writable: false });
    Object.defineProperty(instance, "object", { value: createAPIProxy(scriptId, "object"), writable: false });
    Object.defineProperty(instance, "container", { value: createAPIProxy(scriptId, "container"), writable: false });
    Object.defineProperty(instance, "owner", { value: endowments.__owner, writable: false });
    scripts.set(scriptId, {
      id: scriptId,
      instance,
      currentState: "default",
      states: instance.states ?? {}
    });
    sendToMain({ type: "ready", scriptId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    sendToMain({ type: "error", scriptId, error: message, stack: err instanceof Error ? err.stack : void 0 });
  }
}
async function dispatchEvent(scriptId, event, args) {
  const script = scripts.get(scriptId);
  if (!script) return;
  const { instance, currentState, states } = script;
  try {
    const stateHandler = states[currentState]?.[event];
    if (typeof stateHandler === "function") {
      await stateHandler.call(instance, ...args);
    }
    const globalHandler = instance[event];
    if (typeof globalHandler === "function" && globalHandler !== stateHandler) {
      await globalHandler.call(instance, ...args);
    }
    if (instance._currentState !== void 0) {
      script.currentState = instance._currentState;
    } else if (instance.currentState !== void 0) {
      script.currentState = instance.currentState;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    sendToMain({
      type: "error",
      scriptId,
      error: `Event ${event}: ${message}`,
      stack: err instanceof Error ? err.stack : void 0
    });
  }
}
function terminateScript(scriptId) {
  scripts.delete(scriptId);
}
self.onmessage = (event) => {
  const msg = event.data;
  switch (msg.type) {
    case "init":
      initScript(msg.scriptId, msg.code, msg.name, msg.config);
      break;
    case "event":
      dispatchEvent(msg.scriptId, msg.event, msg.args);
      break;
    case "api-response": {
      const pending = pendingCalls.get(msg.callId);
      if (pending) {
        pendingCalls.delete(msg.callId);
        if (msg.error) {
          pending.reject(new Error(msg.error));
        } else {
          pending.resolve(msg.result);
        }
      }
      break;
    }
    case "terminate":
      terminateScript(msg.scriptId);
      break;
    case "ping":
      sendToMain({ type: "pong", timestamp: msg.timestamp });
      break;
  }
};
try {
  initializeSES();
} catch (err) {
  sendToMain({
    type: "error",
    scriptId: "__worker__",
    error: `SES initialization failed: ${err instanceof Error ? err.message : String(err)}`
  });
}
//# sourceMappingURL=worker-bundle.js.map
