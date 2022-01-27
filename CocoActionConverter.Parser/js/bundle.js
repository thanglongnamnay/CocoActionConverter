// generated/fable_modules/fable-library.3.6.3/Int32.js
var NumberStyles;
(function(NumberStyles2) {
  NumberStyles2[NumberStyles2["AllowHexSpecifier"] = 512] = "AllowHexSpecifier";
})(NumberStyles || (NumberStyles = {}));
function validResponse(regexMatch, radix) {
  const [, sign, prefix, digits] = regexMatch;
  return {
    sign: sign || "",
    prefix: prefix || "",
    digits,
    radix
  };
}
function getRange(unsigned, bitsize) {
  switch (bitsize) {
    case 8:
      return unsigned ? [0, 255] : [-128, 127];
    case 16:
      return unsigned ? [0, 65535] : [-32768, 32767];
    case 32:
      return unsigned ? [0, 4294967295] : [-2147483648, 2147483647];
    default:
      throw new Error("Invalid bit size.");
  }
}
function getInvalidDigits(radix) {
  switch (radix) {
    case 2:
      return /[^0-1]/;
    case 8:
      return /[^0-7]/;
    case 10:
      return /[^0-9]/;
    case 16:
      return /[^0-9a-fA-F]/;
    default:
      throw new Error("Invalid Base.");
  }
}
function getRadix(prefix, style) {
  if (style & NumberStyles.AllowHexSpecifier) {
    return 16;
  } else {
    switch (prefix) {
      case "0b":
      case "0B":
        return 2;
      case "0o":
      case "0O":
        return 8;
      case "0x":
      case "0X":
        return 16;
      default:
        return 10;
    }
  }
}
function isValid(str, style, radix) {
  const integerRegex = /^\s*([\+\-])?(0[xXoObB])?([0-9a-fA-F]+)\s*$/;
  const res = integerRegex.exec(str.replace(/_/g, ""));
  if (res != null) {
    const [, , prefix, digits] = res;
    radix = radix || getRadix(prefix, style);
    const invalidDigits = getInvalidDigits(radix);
    if (!invalidDigits.test(digits)) {
      return validResponse(res, radix);
    }
  }
  return null;
}
function parse(str, style, unsigned, bitsize, radix) {
  const res = isValid(str, style, radix);
  if (res != null) {
    let v = Number.parseInt(res.sign + res.digits, res.radix);
    if (!Number.isNaN(v)) {
      const [umin, umax] = getRange(true, bitsize);
      if (!unsigned && res.radix !== 10 && v >= umin && v <= umax) {
        v = v << 32 - bitsize >> 32 - bitsize;
      }
      const [min, max2] = getRange(unsigned, bitsize);
      if (v >= min && v <= max2) {
        return v;
      }
    }
  }
  throw new Error("Input string was not in a correct format.");
}

// generated/fable_modules/fable-library.3.6.3/Numeric.js
var symbol = Symbol("numeric");
function isNumeric(x) {
  return typeof x === "number" || (x === null || x === void 0 ? void 0 : x[symbol]);
}
function compare(x, y) {
  if (typeof x === "number") {
    return x < y ? -1 : x > y ? 1 : 0;
  } else {
    return x.CompareTo(y);
  }
}
function multiply(x, y) {
  if (typeof x === "number") {
    return x * y;
  } else {
    return x[symbol]().multiply(y);
  }
}
function toFixed(x, dp) {
  if (typeof x === "number") {
    return x.toFixed(dp);
  } else {
    return x[symbol]().toFixed(dp);
  }
}
function toPrecision(x, sd) {
  if (typeof x === "number") {
    return x.toPrecision(sd);
  } else {
    return x[symbol]().toPrecision(sd);
  }
}
function toExponential(x, dp) {
  if (typeof x === "number") {
    return x.toExponential(dp);
  } else {
    return x[symbol]().toExponential(dp);
  }
}
function toHex(x) {
  if (typeof x === "number") {
    return (Number(x) >>> 0).toString(16);
  } else {
    return x[symbol]().toHex();
  }
}

// generated/fable_modules/fable-library.3.6.3/Util.js
function isArrayLike(x) {
  return Array.isArray(x) || ArrayBuffer.isView(x);
}
function isComparable(x) {
  return typeof x.CompareTo === "function";
}
function isEquatable(x) {
  return typeof x.Equals === "function";
}
function isHashable(x) {
  return typeof x.GetHashCode === "function";
}
function sameConstructor(x, y) {
  return Object.getPrototypeOf(x).constructor === Object.getPrototypeOf(y).constructor;
}
var Enumerator = class {
  constructor(iter) {
    this.iter = iter;
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    return this.current;
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    return this.current;
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const cur = this.iter.next();
    this.current = cur.value;
    return !cur.done;
  }
  ["System.Collections.IEnumerator.Reset"]() {
    throw new Error("JS iterators cannot be reset");
  }
  Dispose() {
    return;
  }
};
function getEnumerator(o) {
  return typeof o.GetEnumerator === "function" ? o.GetEnumerator() : new Enumerator(o[Symbol.iterator]());
}
function toIterator(en) {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const hasNext = en["System.Collections.IEnumerator.MoveNext"]();
      const current = hasNext ? en["System.Collections.IEnumerator.get_Current"]() : void 0;
      return { done: !hasNext, value: current };
    }
  };
}
function padWithZeros(i, length2) {
  let str = i.toString(10);
  while (str.length < length2) {
    str = "0" + str;
  }
  return str;
}
function dateOffset(date) {
  const date1 = date;
  return typeof date1.offset === "number" ? date1.offset : date.kind === 1 ? 0 : date.getTimezoneOffset() * -6e4;
}
function int32ToString(i, radix) {
  i = i < 0 && radix != null && radix !== 10 ? 4294967295 + i + 1 : i;
  return i.toString(radix);
}
var ObjectRef = class {
  static id(o) {
    if (!ObjectRef.idMap.has(o)) {
      ObjectRef.idMap.set(o, ++ObjectRef.count);
    }
    return ObjectRef.idMap.get(o);
  }
};
ObjectRef.idMap = /* @__PURE__ */ new WeakMap();
ObjectRef.count = 0;
function stringHash(s) {
  let i = 0;
  let h = 5381;
  const len = s.length;
  while (i < len) {
    h = h * 33 ^ s.charCodeAt(i++);
  }
  return h;
}
function numberHash(x) {
  return x * 2654435761 | 0;
}
function combineHashCodes(hashes) {
  if (hashes.length === 0) {
    return 0;
  }
  return hashes.reduce((h1, h2) => {
    return (h1 << 5) + h1 ^ h2;
  });
}
function dateHash(x) {
  return x.getTime();
}
function arrayHash(x) {
  const len = x.length;
  const hashes = new Array(len);
  for (let i = 0; i < len; i++) {
    hashes[i] = structuralHash(x[i]);
  }
  return combineHashCodes(hashes);
}
function structuralHash(x) {
  if (x == null) {
    return 0;
  }
  switch (typeof x) {
    case "boolean":
      return x ? 1 : 0;
    case "number":
      return numberHash(x);
    case "string":
      return stringHash(x);
    default: {
      if (isHashable(x)) {
        return x.GetHashCode();
      } else if (isArrayLike(x)) {
        return arrayHash(x);
      } else if (x instanceof Date) {
        return dateHash(x);
      } else if (Object.getPrototypeOf(x).constructor === Object) {
        const hashes = Object.values(x).map((v) => structuralHash(v));
        return combineHashCodes(hashes);
      } else {
        return numberHash(ObjectRef.id(x));
      }
    }
  }
}
function equalArraysWith(x, y, eq) {
  if (x == null) {
    return y == null;
  }
  if (y == null) {
    return false;
  }
  if (x.length !== y.length) {
    return false;
  }
  for (let i = 0; i < x.length; i++) {
    if (!eq(x[i], y[i])) {
      return false;
    }
  }
  return true;
}
function equalArrays(x, y) {
  return equalArraysWith(x, y, equals);
}
function equalObjects(x, y) {
  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);
  if (xKeys.length !== yKeys.length) {
    return false;
  }
  xKeys.sort();
  yKeys.sort();
  for (let i = 0; i < xKeys.length; i++) {
    if (xKeys[i] !== yKeys[i] || !equals(x[xKeys[i]], y[yKeys[i]])) {
      return false;
    }
  }
  return true;
}
function equals(x, y) {
  if (x === y) {
    return true;
  } else if (x == null) {
    return y == null;
  } else if (y == null) {
    return false;
  } else if (typeof x !== "object") {
    return false;
  } else if (isEquatable(x)) {
    return x.Equals(y);
  } else if (isArrayLike(x)) {
    return isArrayLike(y) && equalArrays(x, y);
  } else if (x instanceof Date) {
    return y instanceof Date && compareDates(x, y) === 0;
  } else {
    return Object.getPrototypeOf(x).constructor === Object && equalObjects(x, y);
  }
}
function compareDates(x, y) {
  let xtime;
  let ytime;
  if ("offset" in x && "offset" in y) {
    xtime = x.getTime();
    ytime = y.getTime();
  } else {
    xtime = x.getTime() + dateOffset(x);
    ytime = y.getTime() + dateOffset(y);
  }
  return xtime === ytime ? 0 : xtime < ytime ? -1 : 1;
}
function comparePrimitives(x, y) {
  return x === y ? 0 : x < y ? -1 : 1;
}
function compareArraysWith(x, y, comp) {
  if (x == null) {
    return y == null ? 0 : 1;
  }
  if (y == null) {
    return -1;
  }
  if (x.length !== y.length) {
    return x.length < y.length ? -1 : 1;
  }
  for (let i = 0, j = 0; i < x.length; i++) {
    j = comp(x[i], y[i]);
    if (j !== 0) {
      return j;
    }
  }
  return 0;
}
function compareArrays(x, y) {
  return compareArraysWith(x, y, compare2);
}
function compareObjects(x, y) {
  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);
  if (xKeys.length !== yKeys.length) {
    return xKeys.length < yKeys.length ? -1 : 1;
  }
  xKeys.sort();
  yKeys.sort();
  for (let i = 0, j = 0; i < xKeys.length; i++) {
    const key = xKeys[i];
    if (key !== yKeys[i]) {
      return key < yKeys[i] ? -1 : 1;
    } else {
      j = compare2(x[key], y[key]);
      if (j !== 0) {
        return j;
      }
    }
  }
  return 0;
}
function compare2(x, y) {
  if (x === y) {
    return 0;
  } else if (x == null) {
    return y == null ? 0 : -1;
  } else if (y == null) {
    return 1;
  } else if (typeof x !== "object") {
    return x < y ? -1 : 1;
  } else if (isComparable(x)) {
    return x.CompareTo(y);
  } else if (isArrayLike(x)) {
    return isArrayLike(y) ? compareArrays(x, y) : -1;
  } else if (x instanceof Date) {
    return y instanceof Date ? compareDates(x, y) : -1;
  } else {
    return Object.getPrototypeOf(x).constructor === Object ? compareObjects(x, y) : -1;
  }
}
function max(comparer, x, y) {
  return comparer(x, y) > 0 ? x : y;
}
var CURRIED = Symbol("curried");
function _curry(args, arity, f) {
  return (arg) => arity === 1 ? f(...args.concat([arg])) : _curry(args.concat([arg]), arity - 1, f);
}
function partialApply(arity, f, args) {
  if (f == null) {
    return void 0;
  } else if (CURRIED in f) {
    f = f[CURRIED];
    for (let i = 0; i < args.length; i++) {
      f = f(args[i]);
    }
    return f;
  } else {
    return _curry(args, arity, f);
  }
}

// generated/fable_modules/fable-library.3.6.3/Date.js
function dateOffsetToString(offset) {
  const isMinus = offset < 0;
  offset = Math.abs(offset);
  const hours = ~~(offset / 36e5);
  const minutes = offset % 36e5 / 6e4;
  return (isMinus ? "-" : "+") + padWithZeros(hours, 2) + ":" + padWithZeros(minutes, 2);
}
function dateToHalfUTCString(date, half) {
  const str = date.toISOString();
  return half === "first" ? str.substring(0, str.indexOf("T")) : str.substring(str.indexOf("T") + 1, str.length - 1);
}
function dateToISOString(d, utc) {
  if (utc) {
    return d.toISOString();
  } else {
    const printOffset = d.kind == null ? true : d.kind === 2;
    return padWithZeros(d.getFullYear(), 4) + "-" + padWithZeros(d.getMonth() + 1, 2) + "-" + padWithZeros(d.getDate(), 2) + "T" + padWithZeros(d.getHours(), 2) + ":" + padWithZeros(d.getMinutes(), 2) + ":" + padWithZeros(d.getSeconds(), 2) + "." + padWithZeros(d.getMilliseconds(), 3) + (printOffset ? dateOffsetToString(d.getTimezoneOffset() * -6e4) : "");
  }
}
function dateToISOStringWithOffset(dateWithOffset, offset) {
  const str = dateWithOffset.toISOString();
  return str.substring(0, str.length - 1) + dateOffsetToString(offset);
}
function dateToStringWithCustomFormat(date, format, utc) {
  return format.replace(/(\w)\1*/g, (match2) => {
    let rep = Number.NaN;
    switch (match2.substring(0, 1)) {
      case "y":
        const y = utc ? date.getUTCFullYear() : date.getFullYear();
        rep = match2.length < 4 ? y % 100 : y;
        break;
      case "M":
        rep = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
        break;
      case "d":
        rep = utc ? date.getUTCDate() : date.getDate();
        break;
      case "H":
        rep = utc ? date.getUTCHours() : date.getHours();
        break;
      case "h":
        const h = utc ? date.getUTCHours() : date.getHours();
        rep = h > 12 ? h % 12 : h;
        break;
      case "m":
        rep = utc ? date.getUTCMinutes() : date.getMinutes();
        break;
      case "s":
        rep = utc ? date.getUTCSeconds() : date.getSeconds();
        break;
      case "f":
        rep = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
        break;
    }
    if (Number.isNaN(rep)) {
      return match2;
    } else {
      return rep < 10 && match2.length > 1 ? "0" + rep : "" + rep;
    }
  });
}
function dateToStringWithOffset(date, format) {
  var _a, _b, _c;
  const d = new Date(date.getTime() + ((_a = date.offset) !== null && _a !== void 0 ? _a : 0));
  if (typeof format !== "string") {
    return d.toISOString().replace(/\.\d+/, "").replace(/[A-Z]|\.\d+/g, " ") + dateOffsetToString((_b = date.offset) !== null && _b !== void 0 ? _b : 0);
  } else if (format.length === 1) {
    switch (format) {
      case "D":
      case "d":
        return dateToHalfUTCString(d, "first");
      case "T":
      case "t":
        return dateToHalfUTCString(d, "second");
      case "O":
      case "o":
        return dateToISOStringWithOffset(d, (_c = date.offset) !== null && _c !== void 0 ? _c : 0);
      default:
        throw new Error("Unrecognized Date print format");
    }
  } else {
    return dateToStringWithCustomFormat(d, format, true);
  }
}
function dateToStringWithKind(date, format) {
  const utc = date.kind === 1;
  if (typeof format !== "string") {
    return utc ? date.toUTCString() : date.toLocaleString();
  } else if (format.length === 1) {
    switch (format) {
      case "D":
      case "d":
        return utc ? dateToHalfUTCString(date, "first") : date.toLocaleDateString();
      case "T":
      case "t":
        return utc ? dateToHalfUTCString(date, "second") : date.toLocaleTimeString();
      case "O":
      case "o":
        return dateToISOString(date, utc);
      default:
        throw new Error("Unrecognized Date print format");
    }
  } else {
    return dateToStringWithCustomFormat(date, format, utc);
  }
}
function toString(date, format, _provider) {
  return date.offset != null ? dateToStringWithOffset(date, format) : dateToStringWithKind(date, format);
}

// generated/fable_modules/fable-library.3.6.3/RegExp.js
function create(pattern, options = 0) {
  if ((options & ~(1 ^ 2 ^ 16 ^ 256)) !== 0) {
    throw new Error("RegexOptions only supports: IgnoreCase, Multiline, Singleline and ECMAScript");
  }
  let flags = "g";
  flags += options & 1 ? "i" : "";
  flags += options & 2 ? "m" : "";
  flags += options & 16 ? "s" : "";
  return new RegExp(pattern, flags);
}
function escape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function match(reg, input, startAt = 0) {
  reg.lastIndex = startAt;
  return reg.exec(input);
}

// generated/fable_modules/fable-library.3.6.3/Types.js
function seqToString(self) {
  let count = 0;
  let str = "[";
  for (const x of self) {
    if (count === 0) {
      str += toString2(x);
    } else if (count === 100) {
      str += "; ...";
      break;
    } else {
      str += "; " + toString2(x);
    }
    count++;
  }
  return str + "]";
}
function toString2(x, callStack = 0) {
  if (x != null && typeof x === "object") {
    if (typeof x.toString === "function") {
      return x.toString();
    } else if (Symbol.iterator in x) {
      return seqToString(x);
    } else {
      const cons2 = Object.getPrototypeOf(x).constructor;
      return cons2 === Object && callStack < 10 ? "{ " + Object.entries(x).map(([k, v]) => k + " = " + toString2(v, callStack + 1)).join("\n  ") + " }" : cons2.name;
    }
  }
  return String(x);
}
function unionToString(name, fields) {
  if (fields.length === 0) {
    return name;
  } else {
    let fieldStr = "";
    let withParens = true;
    if (fields.length === 1) {
      fieldStr = toString2(fields[0]);
      withParens = fieldStr.indexOf(" ") >= 0;
    } else {
      fieldStr = fields.map((x) => toString2(x)).join(", ");
    }
    return name + (withParens ? " (" : " ") + fieldStr + (withParens ? ")" : "");
  }
}
var Union = class {
  get name() {
    return this.cases()[this.tag];
  }
  toJSON() {
    return this.fields.length === 0 ? this.name : [this.name].concat(this.fields);
  }
  toString() {
    return unionToString(this.name, this.fields);
  }
  GetHashCode() {
    const hashes = this.fields.map((x) => structuralHash(x));
    hashes.splice(0, 0, numberHash(this.tag));
    return combineHashCodes(hashes);
  }
  Equals(other) {
    if (this === other) {
      return true;
    } else if (!sameConstructor(this, other)) {
      return false;
    } else if (this.tag === other.tag) {
      return equalArrays(this.fields, other.fields);
    } else {
      return false;
    }
  }
  CompareTo(other) {
    if (this === other) {
      return 0;
    } else if (!sameConstructor(this, other)) {
      return -1;
    } else if (this.tag === other.tag) {
      return compareArrays(this.fields, other.fields);
    } else {
      return this.tag < other.tag ? -1 : 1;
    }
  }
};
function recordToJSON(self) {
  const o = {};
  const keys = Object.keys(self);
  for (let i = 0; i < keys.length; i++) {
    o[keys[i]] = self[keys[i]];
  }
  return o;
}
function recordToString(self) {
  return "{ " + Object.entries(self).map(([k, v]) => k + " = " + toString2(v)).join("\n  ") + " }";
}
function recordGetHashCode(self) {
  const hashes = Object.values(self).map((v) => structuralHash(v));
  return combineHashCodes(hashes);
}
function recordEquals(self, other) {
  if (self === other) {
    return true;
  } else if (!sameConstructor(self, other)) {
    return false;
  } else {
    const thisNames = Object.keys(self);
    for (let i = 0; i < thisNames.length; i++) {
      if (!equals(self[thisNames[i]], other[thisNames[i]])) {
        return false;
      }
    }
    return true;
  }
}
function recordCompareTo(self, other) {
  if (self === other) {
    return 0;
  } else if (!sameConstructor(self, other)) {
    return -1;
  } else {
    const thisNames = Object.keys(self);
    for (let i = 0; i < thisNames.length; i++) {
      const result = compare2(self[thisNames[i]], other[thisNames[i]]);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  }
}
var Record = class {
  toJSON() {
    return recordToJSON(this);
  }
  toString() {
    return recordToString(this);
  }
  GetHashCode() {
    return recordGetHashCode(this);
  }
  Equals(other) {
    return recordEquals(this, other);
  }
  CompareTo(other) {
    return recordCompareTo(this, other);
  }
};
var FSharpRef = class {
  constructor(contentsOrGetter, setter) {
    if (typeof setter === "function") {
      this.getter = contentsOrGetter;
      this.setter = setter;
    } else {
      this.getter = () => contentsOrGetter;
      this.setter = (v) => {
        contentsOrGetter = v;
      };
    }
  }
  get contents() {
    return this.getter();
  }
  set contents(v) {
    this.setter(v);
  }
};
var Exception = class {
  constructor(message) {
    this.message = message;
  }
};
var FSharpException = class extends Exception {
  toJSON() {
    return recordToJSON(this);
  }
  toString() {
    return recordToString(this);
  }
  GetHashCode() {
    return recordGetHashCode(this);
  }
  Equals(other) {
    return recordEquals(this, other);
  }
  CompareTo(other) {
    return recordCompareTo(this, other);
  }
};

// generated/fable_modules/fable-library.3.6.3/String.js
var fsFormatRegExp = /(^|[^%])%([0+\- ]*)(\*|\d+)?(?:\.(\d+))?(\w)/g;
function isLessThan(x, y) {
  return compare(x, y) < 0;
}
function printf(input) {
  return {
    input,
    cont: fsFormat(input)
  };
}
function continuePrint(cont, arg) {
  return typeof arg === "string" ? cont(arg) : arg.cont(cont);
}
function toText(arg) {
  return continuePrint((x) => x, arg);
}
function toFail(arg) {
  return continuePrint((x) => {
    throw new Error(x);
  }, arg);
}
function formatReplacement(rep, flags, padLength, precision, format) {
  let sign = "";
  flags = flags || "";
  format = format || "";
  if (isNumeric(rep)) {
    if (format.toLowerCase() !== "x") {
      if (isLessThan(rep, 0)) {
        rep = multiply(rep, -1);
        sign = "-";
      } else {
        if (flags.indexOf(" ") >= 0) {
          sign = " ";
        } else if (flags.indexOf("+") >= 0) {
          sign = "+";
        }
      }
    }
    precision = precision == null ? null : parseInt(precision, 10);
    switch (format) {
      case "f":
      case "F":
        precision = precision != null ? precision : 6;
        rep = toFixed(rep, precision);
        break;
      case "g":
      case "G":
        rep = precision != null ? toPrecision(rep, precision) : toPrecision(rep);
        break;
      case "e":
      case "E":
        rep = precision != null ? toExponential(rep, precision) : toExponential(rep);
        break;
      case "x":
        rep = toHex(rep);
        break;
      case "X":
        rep = toHex(rep).toUpperCase();
        break;
      default:
        rep = String(rep);
        break;
    }
  } else if (rep instanceof Date) {
    rep = toString(rep);
  } else {
    rep = toString2(rep);
  }
  padLength = typeof padLength === "number" ? padLength : parseInt(padLength, 10);
  if (!isNaN(padLength)) {
    const zeroFlag = flags.indexOf("0") >= 0;
    const minusFlag = flags.indexOf("-") >= 0;
    const ch = minusFlag || !zeroFlag ? " " : "0";
    if (ch === "0") {
      rep = padLeft(rep, padLength - sign.length, ch, minusFlag);
      rep = sign + rep;
    } else {
      rep = padLeft(sign + rep, padLength, ch, minusFlag);
    }
  } else {
    rep = sign + rep;
  }
  return rep;
}
function createPrinter(cont, _strParts, _matches, _result = "", padArg = -1) {
  return (...args) => {
    let result = _result;
    const strParts = _strParts.slice();
    const matches = _matches.slice();
    for (const arg of args) {
      const [, , flags, _padLength, precision, format] = matches[0];
      let padLength = _padLength;
      if (padArg >= 0) {
        padLength = padArg;
        padArg = -1;
      } else if (padLength === "*") {
        if (arg < 0) {
          throw new Error("Non-negative number required");
        }
        padArg = arg;
        continue;
      }
      result += strParts[0];
      result += formatReplacement(arg, flags, padLength, precision, format);
      strParts.splice(0, 1);
      matches.splice(0, 1);
    }
    if (matches.length === 0) {
      result += strParts[0];
      return cont(result);
    } else {
      return createPrinter(cont, strParts, matches, result, padArg);
    }
  };
}
function fsFormat(str) {
  return (cont) => {
    fsFormatRegExp.lastIndex = 0;
    const strParts = [];
    const matches = [];
    let strIdx = 0;
    let match2 = fsFormatRegExp.exec(str);
    while (match2) {
      const matchIndex = match2.index + (match2[1] || "").length;
      strParts.push(str.substring(strIdx, matchIndex).replace(/%%/g, "%"));
      matches.push(match2);
      strIdx = fsFormatRegExp.lastIndex;
      fsFormatRegExp.lastIndex -= 1;
      match2 = fsFormatRegExp.exec(str);
    }
    if (strParts.length === 0) {
      return cont(str.replace(/%%/g, "%"));
    } else {
      strParts.push(str.substring(strIdx).replace(/%%/g, "%"));
      return createPrinter(cont, strParts, matches);
    }
  };
}
function join(delimiter, xs) {
  if (Array.isArray(xs)) {
    return xs.join(delimiter);
  } else {
    return Array.from(xs).join(delimiter);
  }
}
function padLeft(str, len, ch, isRight) {
  ch = ch || " ";
  len = len - str.length;
  for (let i = 0; i < len; i++) {
    str = isRight ? str + ch : ch + str;
  }
  return str;
}
function replace(str, search, replace2) {
  return str.replace(new RegExp(escape(search), "g"), replace2);
}
function substring(str, startIndex, length2) {
  if (startIndex + (length2 || 0) > str.length) {
    throw new Error("Invalid startIndex and/or length");
  }
  return length2 != null ? str.substr(startIndex, length2) : str.substr(startIndex);
}

// generated/fable_modules/fable-library.3.6.3/Global.js
var SR_inputWasEmpty = "Collection was empty.";
var SR_inputMustBeNonNegative = "The input must be non-negative.";
var SR_notEnoughElements = "The input sequence has an insufficient number of elements.";

// generated/fable_modules/fable-library.3.6.3/Option.js
var Some = class {
  constructor(value2) {
    this.value = value2;
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
  GetHashCode() {
    return structuralHash(this.value);
  }
  Equals(other) {
    if (other == null) {
      return false;
    } else {
      return equals(this.value, other instanceof Some ? other.value : other);
    }
  }
  CompareTo(other) {
    if (other == null) {
      return 1;
    } else {
      return compare2(this.value, other instanceof Some ? other.value : other);
    }
  }
};
function some(x) {
  return x == null || x instanceof Some ? new Some(x) : x;
}
function value(x) {
  if (x == null) {
    throw new Error("Option has no value");
  } else {
    return x instanceof Some ? x.value : x;
  }
}
function defaultArg(opt, defaultValue) {
  return opt != null ? value(opt) : defaultValue;
}
function map(mapping, opt) {
  return opt != null ? some(mapping(value(opt))) : void 0;
}

// generated/fable_modules/fable-library.3.6.3/Array.js
function fill(target, targetIndex, count, value2) {
  const start = targetIndex | 0;
  return target.fill(value2, start, start + count);
}
function equalsWith(equals2, array1, array2) {
  if (array1 == null) {
    if (array2 == null) {
      return true;
    } else {
      return false;
    }
  } else if (array2 == null) {
    return false;
  } else {
    let i = 0;
    let result = true;
    const length1 = array1.length | 0;
    const length2 = array2.length | 0;
    if (length1 > length2) {
      return false;
    } else if (length1 < length2) {
      return false;
    } else {
      while (i < length1 && result) {
        result = equals2(array1[i], array2[i]);
        i = i + 1 | 0;
      }
      return result;
    }
  }
}

// generated/fable_modules/fable-library.3.6.3/FSharp.Core.js
var LanguagePrimitives_GenericEqualityComparer = {
  ["System.Collections.IEqualityComparer.Equals541DA560"](x, y) {
    return equals(x, y);
  },
  ["System.Collections.IEqualityComparer.GetHashCode4E60E31B"](x_1) {
    return structuralHash(x_1);
  }
};
var LanguagePrimitives_GenericEqualityERComparer = {
  ["System.Collections.IEqualityComparer.Equals541DA560"](x, y) {
    return equals(x, y);
  },
  ["System.Collections.IEqualityComparer.GetHashCode4E60E31B"](x_1) {
    return structuralHash(x_1);
  }
};
function Operators_NullArg(x) {
  throw new Error(x);
}

// generated/fable_modules/fable-library.3.6.3/Seq.js
var SR_enumerationAlreadyFinished = "Enumeration already finished.";
var SR_enumerationNotStarted = "Enumeration has not started. Call MoveNext.";
var SR_resetNotSupported = "Reset is not supported on this enumerator.";
function Enumerator_noReset() {
  throw new Error(SR_resetNotSupported);
}
function Enumerator_notStarted() {
  throw new Error(SR_enumerationNotStarted);
}
function Enumerator_alreadyFinished() {
  throw new Error(SR_enumerationAlreadyFinished);
}
var Enumerator_Seq = class {
  constructor(f) {
    this.f = f;
  }
  toString() {
    const xs = this;
    const maxCount = 4;
    let i = 0;
    let str = "seq [";
    const e = getEnumerator(xs);
    try {
      while (i < maxCount && e["System.Collections.IEnumerator.MoveNext"]()) {
        if (i > 0) {
          str = str + "; ";
        }
        str = str + toString2(e["System.Collections.Generic.IEnumerator`1.get_Current"]());
        i = i + 1 | 0;
      }
      if (i === maxCount) {
        str = str + "; ...";
      }
      return str + "]";
    } finally {
      e.Dispose();
    }
  }
  GetEnumerator() {
    const x = this;
    return x.f();
  }
  [Symbol.iterator]() {
    return toIterator(this.GetEnumerator());
  }
  ["System.Collections.IEnumerable.GetEnumerator"]() {
    const x = this;
    return x.f();
  }
};
function Enumerator_Seq_$ctor_673A07F2(f) {
  return new Enumerator_Seq(f);
}
var Enumerator_FromFunctions$1 = class {
  constructor(current, next, dispose) {
    this.current = current;
    this.next = next;
    this.dispose = dispose;
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    const __ = this;
    return __.current();
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    const __ = this;
    return __.current();
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const __ = this;
    return __.next();
  }
  ["System.Collections.IEnumerator.Reset"]() {
    Enumerator_noReset();
  }
  Dispose() {
    const __ = this;
    __.dispose();
  }
};
function Enumerator_FromFunctions$1_$ctor_58C54629(current, next, dispose) {
  return new Enumerator_FromFunctions$1(current, next, dispose);
}
function Enumerator_generateWhileSome(openf, compute, closef) {
  let started = false;
  let curr = void 0;
  let state = some(openf());
  const dispose = () => {
    if (state != null) {
      const x_1 = value(state);
      try {
        closef(x_1);
      } finally {
        state = void 0;
      }
    }
  };
  const finish = () => {
    try {
      dispose();
    } finally {
      curr = void 0;
    }
  };
  return Enumerator_FromFunctions$1_$ctor_58C54629(() => {
    if (!started) {
      Enumerator_notStarted();
    }
    if (curr != null) {
      return value(curr);
    } else {
      return Enumerator_alreadyFinished();
    }
  }, () => {
    if (!started) {
      started = true;
    }
    if (state != null) {
      const s = value(state);
      let matchValue_1;
      try {
        matchValue_1 = compute(s);
      } catch (matchValue) {
        finish();
        throw matchValue;
      }
      if (matchValue_1 != null) {
        curr = matchValue_1;
        return true;
      } else {
        finish();
        return false;
      }
    } else {
      return false;
    }
  }, dispose);
}
function checkNonNull(argName, arg) {
  if (arg == null) {
    Operators_NullArg(argName);
  }
}
function mkSeq(f) {
  return Enumerator_Seq_$ctor_673A07F2(f);
}
function ofSeq2(xs) {
  checkNonNull("source", xs);
  return getEnumerator(xs);
}
function toList(xs) {
  if (isArrayLike(xs)) {
    return ofArray(xs);
  } else if (xs instanceof FSharpList) {
    return xs;
  } else {
    return ofSeq(xs);
  }
}
function generateIndexed(create2, compute, dispose) {
  return mkSeq(() => {
    let i = -1;
    return Enumerator_generateWhileSome(create2, (x) => {
      i = i + 1 | 0;
      return compute(i, x);
    }, dispose);
  });
}
function mapIndexed(mapping, xs) {
  return generateIndexed(() => ofSeq2(xs), (i, e) => e["System.Collections.IEnumerator.MoveNext"]() ? some(mapping(i, e["System.Collections.Generic.IEnumerator`1.get_Current"]())) : void 0, (e_1) => {
    e_1.Dispose();
  });
}
var CachedSeq$1 = class {
  constructor(cleanup, res) {
    this.cleanup = cleanup;
    this.res = res;
  }
  Dispose() {
    const _ = this;
    _.cleanup();
  }
  GetEnumerator() {
    const _ = this;
    return getEnumerator(_.res);
  }
  [Symbol.iterator]() {
    return toIterator(this.GetEnumerator());
  }
  ["System.Collections.IEnumerable.GetEnumerator"]() {
    const _ = this;
    return getEnumerator(_.res);
  }
};

// generated/fable_modules/fable-library.3.6.3/List.js
var FSharpList = class extends Record {
  constructor(head2, tail2) {
    super();
    this.head = head2;
    this.tail = tail2;
  }
  toString() {
    const xs = this;
    return "[" + join("; ", xs) + "]";
  }
  Equals(other) {
    const xs = this;
    if (xs === other) {
      return true;
    } else {
      const loop = (xs_1_mut, ys_1_mut) => {
        loop:
          while (true) {
            const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
            const matchValue = [xs_1.tail, ys_1.tail];
            if (matchValue[0] != null) {
              if (matchValue[1] != null) {
                const xt = matchValue[0];
                const yt = matchValue[1];
                if (equals(xs_1.head, ys_1.head)) {
                  xs_1_mut = xt;
                  ys_1_mut = yt;
                  continue loop;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            } else if (matchValue[1] != null) {
              return false;
            } else {
              return true;
            }
            break;
          }
      };
      return loop(xs, other);
    }
  }
  GetHashCode() {
    const xs = this;
    const loop = (i_mut, h_mut, xs_1_mut) => {
      loop:
        while (true) {
          const i = i_mut, h = h_mut, xs_1 = xs_1_mut;
          const matchValue = xs_1.tail;
          if (matchValue != null) {
            const t = matchValue;
            if (i > 18) {
              return h | 0;
            } else {
              i_mut = i + 1;
              h_mut = (h << 1) + structuralHash(xs_1.head) + 631 * i;
              xs_1_mut = t;
              continue loop;
            }
          } else {
            return h | 0;
          }
          break;
        }
    };
    return loop(0, 0, xs) | 0;
  }
  toJSON(_key) {
    const this$ = this;
    return Array.from(this$);
  }
  CompareTo(other) {
    const xs = this;
    const loop = (xs_1_mut, ys_1_mut) => {
      loop:
        while (true) {
          const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
          const matchValue = [xs_1.tail, ys_1.tail];
          if (matchValue[0] != null) {
            if (matchValue[1] != null) {
              const xt = matchValue[0];
              const yt = matchValue[1];
              const c = compare2(xs_1.head, ys_1.head) | 0;
              if (c === 0) {
                xs_1_mut = xt;
                ys_1_mut = yt;
                continue loop;
              } else {
                return c | 0;
              }
            } else {
              return 1;
            }
          } else if (matchValue[1] != null) {
            return -1;
          } else {
            return 0;
          }
          break;
        }
    };
    return loop(xs, other) | 0;
  }
  GetEnumerator() {
    const xs = this;
    return ListEnumerator$1_$ctor_3002E699(xs);
  }
  [Symbol.iterator]() {
    return toIterator(this.GetEnumerator());
  }
  ["System.Collections.IEnumerable.GetEnumerator"]() {
    const xs = this;
    return getEnumerator(xs);
  }
};
var ListEnumerator$1 = class {
  constructor(xs) {
    this.xs = xs;
    this.it = this.xs;
    this.current = null;
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    const __ = this;
    return __.current;
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    const __ = this;
    return __.current;
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const __ = this;
    const matchValue = __.it.tail;
    if (matchValue != null) {
      const t = matchValue;
      __.current = __.it.head;
      __.it = t;
      return true;
    } else {
      return false;
    }
  }
  ["System.Collections.IEnumerator.Reset"]() {
    const __ = this;
    __.it = __.xs;
    __.current = null;
  }
  Dispose() {
  }
};
function ListEnumerator$1_$ctor_3002E699(xs) {
  return new ListEnumerator$1(xs);
}
function FSharpList_get_Empty() {
  return new FSharpList(null, void 0);
}
function FSharpList_Cons_305B8EAC(x, xs) {
  return new FSharpList(x, xs);
}
function FSharpList__get_IsEmpty(xs) {
  return xs.tail == null;
}
function FSharpList__get_Length(xs) {
  const loop = (i_mut, xs_1_mut) => {
    loop:
      while (true) {
        const i = i_mut, xs_1 = xs_1_mut;
        const matchValue = xs_1.tail;
        if (matchValue != null) {
          i_mut = i + 1;
          xs_1_mut = matchValue;
          continue loop;
        } else {
          return i | 0;
        }
        break;
      }
  };
  return loop(0, xs) | 0;
}
function FSharpList__get_Head(xs) {
  const matchValue = xs.tail;
  if (matchValue != null) {
    return xs.head;
  } else {
    throw new Error(SR_inputWasEmpty + "\\nParameter name: list");
  }
}
function FSharpList__get_Tail(xs) {
  const matchValue = xs.tail;
  if (matchValue != null) {
    return matchValue;
  } else {
    throw new Error(SR_inputWasEmpty + "\\nParameter name: list");
  }
}
function empty() {
  return FSharpList_get_Empty();
}
function cons(x, xs) {
  return FSharpList_Cons_305B8EAC(x, xs);
}
function singleton(x) {
  return FSharpList_Cons_305B8EAC(x, FSharpList_get_Empty());
}
function isEmpty(xs) {
  return FSharpList__get_IsEmpty(xs);
}
function length(xs) {
  return FSharpList__get_Length(xs);
}
function head(xs) {
  return FSharpList__get_Head(xs);
}
function tail(xs) {
  return FSharpList__get_Tail(xs);
}
function toArray(xs) {
  const len = FSharpList__get_Length(xs) | 0;
  const res = fill(new Array(len), 0, len, null);
  const loop = (i_mut, xs_1_mut) => {
    loop:
      while (true) {
        const i = i_mut, xs_1 = xs_1_mut;
        if (!FSharpList__get_IsEmpty(xs_1)) {
          res[i] = FSharpList__get_Head(xs_1);
          i_mut = i + 1;
          xs_1_mut = FSharpList__get_Tail(xs_1);
          continue loop;
        }
        break;
      }
  };
  loop(0, xs);
  return res;
}
function fold(folder, state, xs) {
  let acc = state;
  let xs_1 = xs;
  while (!FSharpList__get_IsEmpty(xs_1)) {
    acc = folder(acc, FSharpList__get_Head(xs_1));
    xs_1 = FSharpList__get_Tail(xs_1);
  }
  return acc;
}
function reverse(xs) {
  return fold((acc, x) => FSharpList_Cons_305B8EAC(x, acc), FSharpList_get_Empty(), xs);
}
function ofArrayWithTail(xs, tail_1) {
  let res = tail_1;
  for (let i = xs.length - 1; i >= 0; i--) {
    res = FSharpList_Cons_305B8EAC(xs[i], res);
  }
  return res;
}
function ofArray(xs) {
  return ofArrayWithTail(xs, FSharpList_get_Empty());
}
function ofSeq(xs) {
  let xs_3, t;
  if (isArrayLike(xs)) {
    return ofArray(xs);
  } else if (xs instanceof FSharpList) {
    return xs;
  } else {
    const root = FSharpList_get_Empty();
    let node = root;
    const enumerator = getEnumerator(xs);
    try {
      while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
        const x = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
        node = (xs_3 = node, t = new FSharpList(x, void 0), xs_3.tail = t, t);
      }
    } finally {
      enumerator.Dispose();
    }
    const xs_5 = node;
    const t_2 = FSharpList_get_Empty();
    xs_5.tail = t_2;
    return FSharpList__get_Tail(root);
  }
}
function append(xs, ys) {
  return fold((acc, x) => FSharpList_Cons_305B8EAC(x, acc), ys, reverse(xs));
}
function map3(mapping, xs) {
  const root = FSharpList_get_Empty();
  const node = fold((acc, x) => {
    const t = new FSharpList(mapping(x), void 0);
    acc.tail = t;
    return t;
  }, root, xs);
  const t_2 = FSharpList_get_Empty();
  node.tail = t_2;
  return FSharpList__get_Tail(root);
}
function sortWith(comparer, xs) {
  const arr = toArray(xs);
  arr.sort(comparer);
  return ofArray(arr);
}
function sortByDescending(projection, xs, comparer) {
  return sortWith((x, y) => comparer.Compare(projection(x), projection(y)) * -1, xs);
}
function take(count, xs) {
  if (count < 0) {
    throw new Error(SR_inputMustBeNonNegative + "\\nParameter name: count");
  }
  const loop = (i_mut, acc_mut, xs_1_mut) => {
    let t;
    loop:
      while (true) {
        const i = i_mut, acc = acc_mut, xs_1 = xs_1_mut;
        if (i <= 0) {
          return acc;
        } else if (FSharpList__get_IsEmpty(xs_1)) {
          throw new Error(SR_notEnoughElements + "\\nParameter name: list");
        } else {
          i_mut = i - 1;
          acc_mut = (t = new FSharpList(FSharpList__get_Head(xs_1), void 0), acc.tail = t, t);
          xs_1_mut = FSharpList__get_Tail(xs_1);
          continue loop;
        }
        break;
      }
  };
  const root = FSharpList_get_Empty();
  const node = loop(count, root, xs);
  const t_2 = FSharpList_get_Empty();
  node.tail = t_2;
  return FSharpList__get_Tail(root);
}

// generated/fable_modules/fable-library.3.6.3/Choice.js
var FSharpResult$2 = class extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag | 0;
    this.fields = fields;
  }
  cases() {
    return ["Ok", "Error"];
  }
};
function Result_MapError(mapping, result) {
  if (result.tag === 0) {
    return new FSharpResult$2(0, result.fields[0]);
  } else {
    return new FSharpResult$2(1, mapping(result.fields[0]));
  }
}
var FSharpChoice$2 = class extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag | 0;
    this.fields = fields;
  }
  cases() {
    return ["Choice1Of2", "Choice2Of2"];
  }
};

// generated/fable_modules/fable-library.3.6.3/Unicode.13.0.0.js
var rangeDeltas = "#C$&$&$$$$$$%-%&%=$$$$$$=$$$$D$$'$$$$$$$$$$$$%$$%$$$$&$:$*;$+$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%$$$$$$$$$$$$$$$%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%$$$$&%$$$%$&%'$%$&&%$%$$$$$%$$%$$%$&$$$%%$$&'$$$$$$$$$$$$$$$$$$$$$$$$%$$$$$$$$$$$$$$$$$%$$$$$&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*%$%%$$'$$$$$$$$h$>5'/1(*$$$4\x93$$$$$$$$%$&$$'%$$&$$$%$4$,F$%&&$$$$$$$$$$$$$$$$$$$$$$$($$$$$%%VS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$(%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%$$$$$$$$$$$$%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$I%$)L$$%%$$P$$$%$%$$+>''%.)&%$%%.$$$%C$-8-'%$\x86$$*$$)%%$'%-&%$1$$$$A>%|.$1-D,%$&$%$%9'$,$&$(%2$<&%$$.X8$5.2$C$Y$$$$&+'$%$*-%%-$$2$%$+%%%9$*$$&'%$$&'%%%%$$+$'%$&%%-%%)$$$$$%%$$)'%%9$*$%$%$%%$$&%'%%&&$*'$$*-%&$$-%$$,$&$9$*$%$(%$$&($%$$%$%$2%%%-$$*$)$$%$+%%%9$*$%$(%$$$$$'%%%%$*%$'%$&%%-$$)-$$$)&&$'&%$$$%&%&&&/'%$%&&$&$%$)$1-&)$$($&$+$&$:$3&$&'$&$'*%$&(%%%-*$*$$$%$+$&$:$-$(%$$$$($$%$%%*%*$$%%%-$%0%%,$&$L%$&'$&$&$$$'&$*&%%-,$)$$%$5&;$,$$%*&$'&&$$$+)-%%$/S$%*'$)$+$-%H%$$$($;$$$-$%,$%($$$)%-%'C$&2$$&%)--$$$$$$$$$$%+$G'1$($%(.$G$+$)$%('%HN%'$)$%%%$-))%%'&$&%*&'0$%%)$$$-&$%I$$($%N$$&\u016C$'%*$$$'%L$'%D$'%*$$$'%2$\\$'%f%&,7&3-)y%)%$\u028F$$4$=$$&n&&+*0$'&.5&%,5%/0$&$%/W%$*+$%.&$&$$$%-)-))$'&$$-)F$X*(%E$$(i-B$&'%&'%$)&'$&%-A%(.O'=)-$&E:%%$%%X$$$*$$$$%+)-%$-)-)*$)%1$%b'$R$$($$($%*'-*-,,&%$A$'%%$&%-O$$%&$$&%+'G++%%&(-&&-A)%,*N%&++&$0$*'$)$%$%$(Ob0$EH]$($$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$,$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$,+)%)%++++)%)%+$$$$$$$$++1%++++++($%'$$$&&$%'$&'%%'$&+(&%&$%'$%$.()%$$$%$$$+$$($,$$'%&$$$.$$$-$($-$$%)&$$$-&$$$0&C30'$&/2%$'$%$&%&$$$%$()$$$$$$'$$'$'$%%%($'$$%$$3F$$'$%'((%'$%$%$*$B%%$$$B\u012F+$$$$7%*$$t$A<K)h<.8_q9\xDA$,$Y+\x92$\u011B$$$$$$$$$$$$$$AO($$B$$$$$$$$$$3\u0123\xA6$$$$$$$$$$$$$$$$$$$$$$b$$$$C$$\u0125S8%)J%C$\x8CR$R$$$&%$$$$$$'$$%$)%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%)$$$$&$$('$%I$$($%[*$$1$:,*$*$*$*$*$*$*$*$C%$$$$&$$$$$,$%$$$$%$$$$$$$$$$($-%'$$$0%$P=$|/\xF9=/'$&$$$$$$$$$$$$$$%$$$$$$$$$$%$,'%$(%&$$$%$y%%%%$$}$&$(N$\x81$%'-CG/3B$-A+$2C-J2\u0163\u19E3c\u5220&8$\u049A&Z,K)%\u012F$&3-%7$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&$-$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%%i-%)+:,%$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$+$$$$%$$$$$$$$$$%$$$$$$$$&$$$$$$$$$$$$$$$$$$$$($($$$$$$$$$$$%$$'$$$M$$$%$*$&$'$:%%$'$&)%$$)W'+%U3%+%-)5)&$$%$-?+%:.%.$@&&$R$%'%%&0$$-'%($$,-($L)%%%%,&$+$$%-%'3$)&$$$$U$$&%%(%$$$;%$%.$%%%$%$$-)%)%),*$*$N$',$%'sF%$%$%$$$%-)\u2BC7/:'T'\u0823\u1923\u0191%\x8DI*/(($$-$0$($$$%$%$\x8F34\u018E$$3c%YK/$$%3*$$$)3$%%$$$$$$$$$$$$$$$$%$$'&&$'$$$$$$$&$$&$$$%'($\xAA%$$&$&$$$$$$%-%&%=$$$$$$=$$$$$$$$$%-$P%B&)%)%)%&&%$$$%$$'%-&%%/$=$6$%$2%1E\x9E(&'P&,X'4%&$0&$RP$\xA5@&T2$>'C',7$+$(I((A$$G'+$(MKKq%-)G'G'K+W.$\xB3\u015A,9-+\xBB)%$$O$%&$%:$$+:%*B+,S6$%((9)&$=($c['%%3%Q$&$%(''$&$@%&'$,*,*@%$@&C+$?%'(*,Y&*9%+6(+5*'/*slZV0V*)G'+-\u0149B$M$%$%%q@-$+9.'(y8*7:,$$$X2*'7-2&$P&'%%%$'.$%<*-)&G($+$-'$%$+F$%$,%$S&,%'''$$$-$$$&$7.5$<&&%$$%)$d*$$$'$2$-$)R$&+(-)%%$+%%%9$*$%$($%$%$'%%%&%$)$((%%*&(\xAEX&+%&$$'(-%$$$&AS&)$$'%$%%$$+-\xC9R&'%'%$%:'%ES&+%$$%&$.-)06N$$$%)$$$*-Y>%&%'$('-%&$\xE3O&,$%$\x87CC-,/+%$%+$%$;)$%%%$$$$$$$&,-i+%J&'%%'$$$$$>$-K)$$'+$+$)%&Q0$%&$(@\\\u012A,$H$*$)$$$(--6&%A%9$$*$%$%l*$%$I)&$$%$*$$+-))$%$C($%$%$$$$*-\u01596%%%\xDA$28+'40$\u03BD\x89\x92$(.\xE7\u0ADF\u0452$,\u0FEA\u026A\u21DC\u025C*B$-'%\x83A%($-S*(''$$--$*$8(6\u02D3CC:'\x88n'$$Z*'0c%$$$.%1\u181B+\u04F9M,\u231A\u0142T&4'+\u01AF\u0927\x8E(0&,*-%$%$'\u137F\u0119-J%_%&&)++%*A'^:e&$\xBD7/z,<\xAA===*$5==$$%%$%%%'$+'$$$*$.==%$'%+$*$=%$'$($$&*$============?%<$<$)<$<$)<$<$)<$<$)<$<$)$$%U\u0223Z'U+$1$%(2($2\u0573*$4%*$%$(\xF8P&**%-'$$\u0193O'-($\u0523\xE8%,*LEE*$'-'%\u0334^$&$'oP$2\xE5'$>$%$$%$$-$'$$$$)$'$$$$$$&$%$$%$$$$$$$$$$%$$%'$*$'$'$$$-$4(&$($4W%\u0131O'\x87/2%2$2$H-0\xC4[@0O',*%1)\xBD\u011E(\u02FB+0&0&\x97/|*/7/'[+-)K+A%%q\x9C$u$\xAA/1%(&&(*,<**,&0*L\xB6$ZH-\u0429\uA701E\u1058.\u0101%\u16A51\u1D54\u0C42\u0241\u0605\u136E\u{AECD9}$A\x83\xA3\u0113\uFE33\u{10021}%\u{10021}";
var categories = "1.;=;78;<;6;+;<;#7;8>5>$7<8<1.;=?;>?'9<2?>?<->$;>-':-;#<#$<$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$'#$'#%$#%$#%$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#%$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$'$&>&>&>&>&>(#$#$&>#$@&$;#@>#;#@#@#$#@#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$<#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$?(*#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$@#@&;$;6@?=@(6(;(;(;(@'@';@2<;=;?(;2@;'&'(+;'(';'(2?(&(?('+'?';@2'('(@'('@+'(&?;&@(='(&(&(&(@;@'(@;@'@'@'@(2()'()(')()()'('(;+;&'()@'@'@'@'@'@'@(')(@)@)('@)@'@'(@+'=-?=';(@()@'@'@'@'@'@'@'@(@)(@(@(@(@'@'@+('(;@()@'@'@'@'@'@'@(')(@()@)(@'@'(@+;=@'(@()@'@'@'@'@'@'@(')()(@)@)(@()@'@'(@+?'-@('@'@'@'@'@'@'@'@'@'@)()@)@)(@'@)@+-?=?@()('@'@'@'@'()@(@(@(@'@'(@+@;-?'();'@'@'@'@'@(')()@()@)(@)@'@'(@+@'@()'@'@'(')(@)@)('?@')-'(@+-?'@()@'@'@'@'@'@(@)(@(@)@+@);@'('(@='&(;+;@'@'@'@'@'@'('('@'@&@(@+@'@'?;?;?(?+-?(?(?(7878)'@'@()(;('(@(@?(?@?;?;@')()()()('+;')('(')')'('()()(')+)(?#@#@#@$;&$'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@(;-@'?@#@$@6'?;'.'78@';,'@'@'(@'(;@'(@'@'@(@'()()()(;&;='(@+@-@;6;(2@+@'&'@'('('@'@'@()()@)()(@?@;+'@'@'@'@+-@?'()(@;')()(@()()()(@(+@+@;&;@(*(@()'()()()()'@+;?(?@()')()()('+'()()()()@;')()(@;+@'+'&;$@#@#;@(;()('('(')('@$&$&$&(@(#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$@#@$#$#$@#@$@#@#@#@#$#$@$%$%$%$@$#%>$>$@$#%>$@$#@>$#>@$@$#%>@.26;9:79:79;/02.;9:;5;<78;<;5;.2@2-&@-<78&-<78@&@=@(*(*(@?#?#?$#$#$?#?<#?#?#?#?#?$#$'$?$#<#$?<?$?-,#$,-?@<?<?<?<?<?<?<?<?<?<?7878?<?78?<?<?<?@?@-?-?<?<?<?<?78787878787878-?<78<7878787878<?<7878787878787878787878<7878<78<?<?<?@?@?#@$@#$#$#$#$#$#$#$#$&#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$?#$#$(#$@;-;$@$@$@'@&;@('@'@'@'@'@'@'@'@'@(;9:9:;9:;9:;6;6;9:;9:78787878;&;6;6;7;?;@?@?@?@?@.;?&',7878787878?78787878678?,()6&?,&';?@'@(>&'6';&'@'@'@?-?'?@'?@-?-?-?-?-?'?'@'&'@?@'&;'&;'+'@#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$'(*;(;&#$#$#$#$#$#$#$#$#$#$#$#$#$#$&(',(;@>&>#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$&$#$#$#$#$#$#$#$&>#$#$'#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$@#$#$#$@#$'&$'('('(')()?(@-?=?@';@)')(@;+@(';';'(+'(;'()@;'@()'()()();@&+@;'(&'+'@'()()(@'('()@+@;'&'?')()'('('('('('@'&;')();'&)(@'@'@'@'@'@$>&$&>@$')()();)(@+@'@'@'@34'@'@$@$@'('<'@'@'@'@'@'>@'87@'@'@'=?@(;78;@(;657878787878787878;78;5;@;6787878;<6<@;=;@'@'@2@;=;78;<;6;+;<;#7;8>5>$7<8<78;78;'&'&'@'@'@'@'@=<>?=@?<?@2?@'@'@'@'@'@'@'@;@-@?,-?-?@?@?@?(@'@'@(-@'-@',',@'(@'@;'@';,@#$'@+@#@$@'@'@;@'@'@'@'@'@'@'@'@'@;-'?-'@-@'@'@-'-@;'@;@'@-'-@-'(@(@('@'@'@(@(-@;@'-;'-@'?'(@-;@'@;'@-'@-'@;@-@'@#@$@-'(@+@-@'@(6@'@'-'@'(-;@'-@'@)()'(;@-+@()')()(;2;@2@'@+@('()(@+;')'@'(;'@()')()';(;)(+';';@-@'@')()()(;(@'@'@'@'@';@'()(@+@()@'@'@'@'@'@'@(')()@)@)@'@)@')@(@(@')()()(';+;@;('@')()()()(';'@+@')(@)()(;'(@')()()(;'@+@;@'()()()('@+@'@()()(@+-;?@')()(;@#$+-@'@'@'@'@')@)@()(')')(;@+@'@')(@()(';')@'('()'(;(@'()('()(;';@'@'@')(@()(';@+-@;'@(@)()()(@'@'@'(@(@(@('(@+@'@'@')@(@)()('@+@'();@'@-?=?@;'@,@;@'@'@2@'@'@'@+@;@'@(;@'(;?&;?@+@-@'@'@#$-;@'@(')@(&@&;&(@)@'@'@'@'@'@'@'@'@'@'@'@?(;2@?@?@?)(?)2(?(?(?@?(?@-@?@-@#$#$@$#$#@#@#@#@#@#$@$@$@$#$#@#@#@#@$#@#@#@#@#@$#$#$#$#$#$#$@#<$<$#<$<$#<$<$#<$<$#<$<$#$@+?(?(?(?(?;@(@(@(@(@(@(@(@'@(&@+@'?@'(+@=@'@-(@#$(&@+@;@-?-=-@-?-@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@'@<@?@?@?@?@?@?@-?@?@?@?@?@?@?>?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@?@+@'@'@'@'@'@'@'@2@2@(@4@4@";

// generated/fable_modules/fable-library.3.6.3/Char.js
function getCategoryFunc() {
  const offset = 35;
  const a1 = [...rangeDeltas].map((ch) => {
    var _a;
    return ((_a = ch.codePointAt(0)) !== null && _a !== void 0 ? _a : 0) - offset;
  });
  const a2 = [...categories].map((ch) => {
    var _a;
    return ((_a = ch.codePointAt(0)) !== null && _a !== void 0 ? _a : 0) - offset;
  });
  const codepoints = new Uint32Array(a1);
  const categories2 = new Uint8Array(a2);
  for (let i = 1; i < codepoints.length; ++i) {
    codepoints[i] += codepoints[i - 1];
  }
  return (cp) => {
    let hi = codepoints.length;
    let lo = 0;
    while (hi - lo > 1) {
      const mid = Math.floor((hi + lo) / 2);
      const test = codepoints[mid];
      if (cp < test) {
        hi = mid;
      } else if (cp === test) {
        hi = lo = mid;
        break;
      } else if (test < cp) {
        lo = mid;
      }
    }
    return categories2[lo];
  };
}
var isControlMask = 1 << 14;
var isDigitMask = 1 << 8;
var isLetterMask = 0 | 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4;
var isLetterOrDigitMask = isLetterMask | isDigitMask;
var isUpperMask = 1 << 0;
var isLowerMask = 1 << 1;
var isNumberMask = 0 | 1 << 8 | 1 << 9 | 1 << 10;
var isPunctuationMask = 0 | 1 << 18 | 1 << 19 | 1 << 20 | 1 << 21 | 1 << 22 | 1 << 23 | 1 << 24;
var isSeparatorMask = 0 | 1 << 11 | 1 << 12 | 1 << 13;
var isSymbolMask = 0 | 1 << 25 | 1 << 26 | 1 << 27 | 1 << 28;
var isWhiteSpaceMask = 0 | 1 << 11 | 1 << 12 | 1 << 13;
var unicodeCategoryFunc = getCategoryFunc();
function charCodeAt(s, index) {
  if (index >= 0 && index < s.length) {
    return s.charCodeAt(index);
  } else {
    throw new Error("Index out of range.");
  }
}
var isDigit = (s) => isDigit2(s, 0);
function getUnicodeCategory2(s, index) {
  const cp = charCodeAt(s, index);
  return unicodeCategoryFunc(cp);
}
function isDigit2(s, index) {
  const test = 1 << getUnicodeCategory2(s, index);
  return (test & isDigitMask) !== 0;
}

// generated/fable_modules/fable-library.3.6.3/Double.js
function tryParse(str, defValue) {
  if (str != null && /\S/.test(str)) {
    const v = +str.replace("_", "");
    if (!Number.isNaN(v)) {
      defValue.contents = v;
      return true;
    }
  }
  return false;
}
function parse2(str) {
  const defValue = new FSharpRef(0);
  if (tryParse(str, defValue)) {
    return defValue.contents;
  } else {
    throw new Error("Input string was not in a correct format.");
  }
}

// generated/Parsec.js
var StringSegment = class extends Record {
  constructor(startIndex, length2, underlying, startLine, startColumn) {
    super();
    this.startIndex = startIndex | 0;
    this.length = length2 | 0;
    this.underlying = underlying;
    this.startLine = startLine | 0;
    this.startColumn = startColumn | 0;
  }
};
function StringSegmentModule_startsWith(s, seg) {
  const check = (i_mut) => {
    check:
      while (true) {
        const i = i_mut;
        if (i === s.length) {
          return true;
        } else if (i === seg.length ? true : seg.underlying[i + seg.startIndex] !== s[i]) {
          return false;
        } else {
          i_mut = i + 1;
          continue check;
        }
        break;
      }
  };
  return check(0);
}
function StringSegmentModule_indexOfSequence(s, seg) {
  const check = (i_mut, j_mut) => {
    check:
      while (true) {
        const i = i_mut, j = j_mut;
        if (j === s.length) {
          return i - j | 0;
        } else if (i + s.length - j > seg.length) {
          return -1;
        } else if (seg.underlying[i + seg.startIndex] === s[j]) {
          i_mut = i + 1;
          j_mut = j + 1;
          continue check;
        } else {
          i_mut = i + 1;
          j_mut = 0;
          continue check;
        }
        break;
      }
  };
  return check(0, 0) | 0;
}
var Position = class extends Record {
  constructor(Line, Col) {
    super();
    this.Line = Line | 0;
    this.Col = Col | 0;
  }
};
var ErrorType = class extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag | 0;
    this.fields = fields;
  }
  cases() {
    return ["Expected", "Unexpected", "Message"];
  }
};
function ParseError_sort(_arg1_0, _arg1_1) {
  const _arg1 = [_arg1_0, _arg1_1];
  const state = _arg1[1];
  const es = _arg1[0];
  return [sortByDescending((tuple) => tuple[0], es, {
    Compare: (x, y) => compare2(x, y)
  }), state];
}
var Primitives_ParserCombinator = class {
  constructor() {
  }
};
function Primitives_ParserCombinator_$ctor() {
  return new Primitives_ParserCombinator();
}
var Primitives_parse = Primitives_ParserCombinator_$ctor();
function CharParsers_anyChar(state, s) {
  let this$_1, this$_2, start_1, finish_1, len, line, column;
  let matchValue;
  const this$ = s;
  const index = 0;
  matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
  if (matchValue === "\uFFFF") {
    return new FSharpResult$2(1, [singleton([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "any char"), new ErrorType(1, "EOF")])]), state]);
  } else {
    const c = matchValue;
    return new FSharpResult$2(0, [c, (this$_2 = s, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
      for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), state]);
  }
}
function CharParsers_spaces() {
  const go = (tupledArg_mut) => {
    let this$_1, start_1, finish_1, len, line, column;
    go:
      while (true) {
        const tupledArg = tupledArg_mut;
        const state = tupledArg[0];
        const s = tupledArg[1];
        let matchValue;
        const this$ = s;
        const index = 0;
        matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
        switch (matchValue) {
          case "	":
          case "\n":
          case " ": {
            tupledArg_mut = [state, (this$_1 = s, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_1.length - 1) | 0, start_1 >= 0 && start_1 <= this$_1.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_1.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_1.startLine, column = this$_1.startColumn, (() => {
              for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
                if (this$_1.underlying[this$_1.startIndex + i_1] === "\n") {
                  line = line + 1 | 0;
                  column = 0;
                } else {
                  column = column + 1 | 0;
                }
              }
            })(), new StringSegment(this$_1.startIndex + start_1, len, this$_1.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1))];
            continue go;
          }
          default: {
            return new FSharpResult$2(0, [void 0, s, state]);
          }
        }
        break;
      }
  };
  return go;
}
function CharParsers_eof(state, s) {
  let this$, index, this$_1;
  if ((this$ = s, index = 0, (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index]) === "\uFFFF") {
    return new FSharpResult$2(0, [void 0, s, state]);
  } else {
    return new FSharpResult$2(1, [singleton([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "EOF"))]), state]);
  }
}
var CharParsers_StringBuilder = class {
  constructor(s) {
    this["s@784"] = s;
  }
  toString() {
    const __ = this;
    return __["s@784"];
  }
};
function CharParsers_StringBuilder_$ctor_Z721C83C5(s) {
  return new CharParsers_StringBuilder(s);
}
function CharParsers_StringBuilder_$ctor() {
  return CharParsers_StringBuilder_$ctor_Z721C83C5("");
}
function CharParsers_StringBuilder__Append_Z721C83C5(sb, s$0027) {
  sb["s@784"] = sb["s@784"] + s$0027;
  return sb;
}
var CharParsers_Internal_pfloatUnit = (() => {
  let p1_9, p_5, p2_8, p_11, p2_2, cond_1, go_1, p3, p_30, p_27, p2_6, cond_9, go_2;
  const ps = ofArray([(tupledArg) => {
    let this$, start_1, finish_1, len, line, column, this$_1;
    const str_1 = "NaN";
    const s_1 = tupledArg[1];
    return StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, ["NaN", (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
  }, (tupledArg_5) => {
    let str_3, s_4, this$_2, start_3, finish_3, len_1, line_1, column_1, this$_3, s_10, matchValue_3, str_5, s_7, this$_4, start_5, finish_5, len_2, line_2, column_2, this$_5, state_13, state_12, s_11;
    const matchValue_4 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), (str_3 = "Inf", s_4 = tupledArg_5[1], StringSegmentModule_startsWith(str_3, s_4) ? new FSharpResult$2(0, ["Infinity", (this$_2 = s_4, start_3 = defaultArg(str_3.length, 0) | 0, finish_3 = defaultArg(void 0, this$_2.length - 1) | 0, start_3 >= 0 && start_3 <= this$_2.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_2.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_2.startLine, column_1 = this$_2.startColumn, (() => {
      for (let i_1 = 0; i_1 <= start_3 - 1; i_1++) {
        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
          line_1 = line_1 + 1 | 0;
          column_1 = 0;
        } else {
          column_1 = column_1 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_2.startIndex + start_3, len_1, this$_2.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_4, new Position(this$_3.startLine, this$_3.startColumn)), singleton(new ErrorType(0, "'" + str_3 + "'"))]), void 0])));
    if (matchValue_4.tag === 0) {
      const state_17 = matchValue_4.fields[0][2];
      const s_14 = matchValue_4.fields[0][1];
      const r1 = matchValue_4.fields[0][0];
      const matchValue_5 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (s_10 = s_14, matchValue_3 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (str_5 = "inity", s_7 = s_10, StringSegmentModule_startsWith(str_5, s_7) ? new FSharpResult$2(0, [void 0, (this$_4 = s_7, start_5 = defaultArg(str_5.length, 0) | 0, finish_5 = defaultArg(void 0, this$_4.length - 1) | 0, start_5 >= 0 && start_5 <= this$_4.length && finish_5 < max((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_4.length) ? (len_2 = max((x_5, y_5) => comparePrimitives(x_5, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_4.startLine, column_2 = this$_4.startColumn, (() => {
        for (let i_2 = 0; i_2 <= start_5 - 1; i_2++) {
          if (this$_4.underlying[this$_4.startIndex + i_2] === "\n") {
            line_2 = line_2 + 1 | 0;
            column_2 = 0;
          } else {
            column_2 = column_2 + 1 | 0;
          }
        }
      })(), new StringSegment(this$_4.startIndex + start_5, len_2, this$_4.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), void 0]) : new FSharpResult$2(1, [singleton([(this$_5 = s_7, new Position(this$_5.startLine, this$_5.startColumn)), singleton(new ErrorType(0, "'" + str_5 + "'"))]), void 0]))), matchValue_3.tag === 1 ? (state_13 = matchValue_3.fields[0][1], new FSharpResult$2(0, [void 0, s_10, void 0])) : (state_12 = matchValue_3.fields[0][2], s_11 = matchValue_3.fields[0][1], new FSharpResult$2(0, [void 0, s_11, void 0]))));
      if (matchValue_5.tag === 0) {
        const state_19 = matchValue_5.fields[0][2];
        const s_15 = matchValue_5.fields[0][1];
        return new FSharpResult$2(0, [r1, s_15, void 0]);
      } else {
        const e_1 = matchValue_5.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_4.fields[0];
      return new FSharpResult$2(1, e);
    }
  }, (p1_9 = (p_5 = (tupledArg_8) => {
    let this$_7, this$_8, start_7, finish_7, len_3, line_3, column_3, this$_9;
    const label = "[0-9]";
    const s_18 = tupledArg_8[1];
    let matchValue_6;
    const this$_6 = s_18;
    const index = 0;
    matchValue_6 = (index < 0 ? true : index >= this$_6.length) ? "\uFFFF" : this$_6.underlying[this$_6.startIndex + index];
    if (matchValue_6 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_7 = s_18, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c = matchValue_6;
      if (isDigit(c)) {
        return new FSharpResult$2(0, [c, (this$_8 = s_18, start_7 = defaultArg(1, 0) | 0, finish_7 = defaultArg(void 0, this$_8.length - 1) | 0, start_7 >= 0 && start_7 <= this$_8.length && finish_7 < max((x_6, y_6) => comparePrimitives(x_6, y_6), start_7, this$_8.length) ? (len_3 = max((x_7, y_7) => comparePrimitives(x_7, y_7), 0, finish_7 - start_7 + 1) | 0, line_3 = this$_8.startLine, column_3 = this$_8.startColumn, (() => {
          for (let i_4 = 0; i_4 <= start_7 - 1; i_4++) {
            if (this$_8.underlying[this$_8.startIndex + i_4] === "\n") {
              line_3 = line_3 + 1 | 0;
              column_3 = 0;
            } else {
              column_3 = column_3 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_8.startIndex + start_7, len_3, this$_8.underlying, line_3, column_3)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_9 = s_18, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c)])]), void 0]);
      }
    }
  }, (tupledArg_9) => {
    const s_20 = tupledArg_9[1];
    const matchValue_8 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), p_5([void 0, s_20]));
    if (matchValue_8.tag === 0) {
      const state_29 = matchValue_8.fields[0][2];
      const s_21 = matchValue_8.fields[0][1];
      const c1 = matchValue_8.fields[0][0];
      const sb = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb, c1);
      const go = (tupledArg_11_mut) => {
        go:
          while (true) {
            const tupledArg_11 = tupledArg_11_mut;
            const state_30 = tupledArg_11[0];
            const s_22 = tupledArg_11[1];
            const matchValue_9 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), p_5([void 0, s_22]));
            if (matchValue_9.tag === 0) {
              const state_32 = matchValue_9.fields[0][2];
              const s_23 = matchValue_9.fields[0][1];
              const c_2 = matchValue_9.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb, c_2);
              tupledArg_11_mut = [void 0, s_23];
              continue go;
            } else {
              return new FSharpResult$2(0, [toString2(sb), s_22, void 0]);
            }
            break;
          }
      };
      return go([void 0, s_21]);
    } else {
      const state_28 = matchValue_8.fields[0][1];
      const es = matchValue_8.fields[0][0];
      return new FSharpResult$2(1, [es, void 0]);
    }
  }), p2_8 = (p_11 = (p2_2 = (cond_1 = (c_6) => isDigit(c_6), go_1 = (i_7_mut, tupledArg_14_mut) => {
    let this$_16, start_11, finish_11, len_5, line_5, column_5;
    go_1:
      while (true) {
        const i_7 = i_7_mut, tupledArg_14 = tupledArg_14_mut;
        const state_37 = tupledArg_14[0];
        const s_32 = tupledArg_14[1];
        let c_8;
        const this$_14 = s_32;
        const index_2 = i_7 | 0;
        c_8 = (index_2 < 0 ? true : index_2 >= this$_14.length) ? "\uFFFF" : this$_14.underlying[this$_14.startIndex + index_2];
        if (i_7 === 0) {
          if (cond_1(c_8)) {
            i_7_mut = i_7 + 1;
            tupledArg_14_mut = [state_37, s_32];
            continue go_1;
          } else {
            return new FSharpResult$2(0, [void 0, s_32, state_37]);
          }
        } else if (cond_1(c_8)) {
          i_7_mut = i_7 + 1;
          tupledArg_14_mut = [state_37, s_32];
          continue go_1;
        } else {
          return new FSharpResult$2(0, [void 0, (this$_16 = s_32, start_11 = defaultArg(i_7, 0) | 0, finish_11 = defaultArg(void 0, this$_16.length - 1) | 0, start_11 >= 0 && start_11 <= this$_16.length && finish_11 < max((x_10, y_10) => comparePrimitives(x_10, y_10), start_11, this$_16.length) ? (len_5 = max((x_11, y_11) => comparePrimitives(x_11, y_11), 0, finish_11 - start_11 + 1) | 0, line_5 = this$_16.startLine, column_5 = this$_16.startColumn, (() => {
            for (let i_9 = 0; i_9 <= start_11 - 1; i_9++) {
              if (this$_16.underlying[this$_16.startIndex + i_9] === "\n") {
                line_5 = line_5 + 1 | 0;
                column_5 = 0;
              } else {
                column_5 = column_5 + 1 | 0;
              }
            }
          })(), new StringSegment(this$_16.startIndex + start_11, len_5, this$_16.underlying, line_5, column_5)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)), state_37]);
        }
        break;
      }
  }, partialApply(1, go_1, [0])), (tupledArg_15) => {
    let c_5, s_25, matchValue_10, this$_10, index_1, this$_11, head2, this$_12, start_9, finish_9, len_4, line_4, column_4, this$_13;
    const matchValue_13 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (c_5 = ".", s_25 = tupledArg_15[1], matchValue_10 = (this$_10 = s_25, index_1 = 0, (index_1 < 0 ? true : index_1 >= this$_10.length) ? "\uFFFF" : this$_10.underlying[this$_10.startIndex + index_1]), matchValue_10 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_11 = s_25, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, "'" + c_5 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head2 = matchValue_10, head2 === c_5 ? new FSharpResult$2(0, [void 0, (this$_12 = s_25, start_9 = defaultArg(1, 0) | 0, finish_9 = defaultArg(void 0, this$_12.length - 1) | 0, start_9 >= 0 && start_9 <= this$_12.length && finish_9 < max((x_8, y_8) => comparePrimitives(x_8, y_8), start_9, this$_12.length) ? (len_4 = max((x_9, y_9) => comparePrimitives(x_9, y_9), 0, finish_9 - start_9 + 1) | 0, line_4 = this$_12.startLine, column_4 = this$_12.startColumn, (() => {
      for (let i_6 = 0; i_6 <= start_9 - 1; i_6++) {
        if (this$_12.underlying[this$_12.startIndex + i_6] === "\n") {
          line_4 = line_4 + 1 | 0;
          column_4 = 0;
        } else {
          column_4 = column_4 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_12.startIndex + start_9, len_4, this$_12.underlying, line_4, column_4)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)), void 0]) : new FSharpResult$2(1, [singleton([(this$_13 = s_25, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, "'" + c_5 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0]))));
    if (matchValue_13.tag === 0) {
      const state_42 = matchValue_13.fields[0][2];
      const s_35 = matchValue_13.fields[0][1];
      const matchValue_14 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), p2_2([void 0, s_35]));
      if (matchValue_14.tag === 0) {
        const state_44 = matchValue_14.fields[0][2];
        const s_36 = matchValue_14.fields[0][1];
        const r2 = matchValue_14.fields[0][0];
        return new FSharpResult$2(0, [void 0, s_36, void 0]);
      } else {
        const e_3 = matchValue_14.fields[0];
        return new FSharpResult$2(1, e_3);
      }
    } else {
      const e_2 = matchValue_13.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  }), (tupledArg_18) => {
    const s_38 = tupledArg_18[1];
    const matchValue_15 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), p_11([void 0, s_38]));
    if (matchValue_15.tag === 0) {
      const state_48 = matchValue_15.fields[0][2];
      const s$0027 = matchValue_15.fields[0][1];
      let str_6;
      let this$_18;
      const this$_17 = s_38;
      const finish_12 = s$0027.startIndex - s_38.startIndex - 1;
      const start_13 = defaultArg(0, 0) | 0;
      const finish_13 = defaultArg(finish_12, this$_17.length - 1) | 0;
      if (start_13 >= 0 && start_13 <= this$_17.length && finish_13 < max((x_12, y_12) => comparePrimitives(x_12, y_12), start_13, this$_17.length)) {
        const len_6 = max((x_13, y_13) => comparePrimitives(x_13, y_13), 0, finish_13 - start_13 + 1) | 0;
        let line_6 = this$_17.startLine;
        let column_6 = this$_17.startColumn;
        for (let i_10 = 0; i_10 <= start_13 - 1; i_10++) {
          if (this$_17.underlying[this$_17.startIndex + i_10] === "\n") {
            line_6 = line_6 + 1 | 0;
            column_6 = 0;
          } else {
            column_6 = column_6 + 1 | 0;
          }
        }
        this$_18 = new StringSegment(this$_17.startIndex + start_13, len_6, this$_17.underlying, line_6, column_6);
      } else {
        this$_18 = toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13);
      }
      str_6 = substring(this$_18.underlying, this$_18.startIndex, this$_18.length);
      return new FSharpResult$2(0, [str_6, s$0027, void 0]);
    } else {
      const e_4 = matchValue_15.fields[0];
      return new FSharpResult$2(1, e_4);
    }
  }), p3 = (p_30 = (p_27 = (p2_6 = (cond_9 = (c_11) => isDigit(c_11), go_2 = (i_15_mut, tupledArg_31_mut) => {
    let this$_28, this$_29, start_19, finish_19, len_9, line_9, column_9;
    go_2:
      while (true) {
        const i_15 = i_15_mut, tupledArg_31 = tupledArg_31_mut;
        const state_76 = tupledArg_31[0];
        const s_56 = tupledArg_31[1];
        let c_13;
        const this$_27 = s_56;
        const index_5 = i_15 | 0;
        c_13 = (index_5 < 0 ? true : index_5 >= this$_27.length) ? "\uFFFF" : this$_27.underlying[this$_27.startIndex + index_5];
        if (i_15 === 0) {
          if (cond_9(c_13)) {
            i_15_mut = i_15 + 1;
            tupledArg_31_mut = [state_76, s_56];
            continue go_2;
          } else {
            return new FSharpResult$2(1, [singleton([(this$_28 = s_56, new Position(this$_28.startLine, this$_28.startColumn)), singleton(new ErrorType(0, "a char satisfying the condition"))]), state_76]);
          }
        } else if (cond_9(c_13)) {
          i_15_mut = i_15 + 1;
          tupledArg_31_mut = [state_76, s_56];
          continue go_2;
        } else {
          return new FSharpResult$2(0, [void 0, (this$_29 = s_56, start_19 = defaultArg(i_15, 0) | 0, finish_19 = defaultArg(void 0, this$_29.length - 1) | 0, start_19 >= 0 && start_19 <= this$_29.length && finish_19 < max((x_20, y_18) => comparePrimitives(x_20, y_18), start_19, this$_29.length) ? (len_9 = max((x_21, y_19) => comparePrimitives(x_21, y_19), 0, finish_19 - start_19 + 1) | 0, line_9 = this$_29.startLine, column_9 = this$_29.startColumn, (() => {
            for (let i_17 = 0; i_17 <= start_19 - 1; i_17++) {
              if (this$_29.underlying[this$_29.startIndex + i_17] === "\n") {
                line_9 = line_9 + 1 | 0;
                column_9 = 0;
              } else {
                column_9 = column_9 + 1 | 0;
              }
            }
          })(), new StringSegment(this$_29.startIndex + start_19, len_9, this$_29.underlying, line_9, column_9)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)), state_76]);
        }
        break;
      }
  }, partialApply(1, go_2, [0])), (tupledArg_32) => {
    let matchValue_24, matchValue_19, label_3, s_40, matchValue_17, this$_19, index_3, this$_20, c_9, _arg1, this$_21, start_15, finish_15, len_7, line_7, column_7, this$_22, state_56, s_43, e_5, state_73, s_54, matchValue_25, s_50, matchValue_23, matchValue_22, label_5, s_45, matchValue_20, this$_23, index_4, this$_24, c_10, _arg2, this$_25, start_17, finish_17, len_8, line_8, column_8, this$_26, state_64, s_48, e_6, state_69, state_68, s_51, state_75, s_55, r2_1, e_8, e_7;
    const matchValue_27 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), (matchValue_24 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), (matchValue_19 = Result_MapError((tupledArg_22) => ParseError_sort(tupledArg_22[0], void 0), (label_3 = "a char with condition", s_40 = tupledArg_32[1], matchValue_17 = (this$_19 = s_40, index_3 = 0, (index_3 < 0 ? true : index_3 >= this$_19.length) ? "\uFFFF" : this$_19.underlying[this$_19.startIndex + index_3]), matchValue_17 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_20 = s_40, new Position(this$_20.startLine, this$_20.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]) : (c_9 = matchValue_17, (_arg1 = c_9, _arg1 === "E" ? true : _arg1 === "e") ? new FSharpResult$2(0, [c_9, (this$_21 = s_40, start_15 = defaultArg(1, 0) | 0, finish_15 = defaultArg(void 0, this$_21.length - 1) | 0, start_15 >= 0 && start_15 <= this$_21.length && finish_15 < max((x_14, y_14) => comparePrimitives(x_14, y_14), start_15, this$_21.length) ? (len_7 = max((x_15, y_15) => comparePrimitives(x_15, y_15), 0, finish_15 - start_15 + 1) | 0, line_7 = this$_21.startLine, column_7 = this$_21.startColumn, (() => {
      for (let i_12 = 0; i_12 <= start_15 - 1; i_12++) {
        if (this$_21.underlying[this$_21.startIndex + i_12] === "\n") {
          line_7 = line_7 + 1 | 0;
          column_7 = 0;
        } else {
          column_7 = column_7 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_21.startIndex + start_15, len_7, this$_21.underlying, line_7, column_7)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)), void 0]) : new FSharpResult$2(1, [singleton([(this$_22 = s_40, new Position(this$_22.startLine, this$_22.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_9)])]), void 0])))), matchValue_19.tag === 0 ? (state_56 = matchValue_19.fields[0][2], s_43 = matchValue_19.fields[0][1], new FSharpResult$2(0, [void 0, s_43, void 0])) : (e_5 = matchValue_19.fields[0], new FSharpResult$2(1, e_5)))), matchValue_24.tag === 0 ? (state_73 = matchValue_24.fields[0][2], s_54 = matchValue_24.fields[0][1], matchValue_25 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), (s_50 = s_54, matchValue_23 = Result_MapError((tupledArg_27) => ParseError_sort(tupledArg_27[0], void 0), (matchValue_22 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), (label_5 = "a char with condition", s_45 = s_50, matchValue_20 = (this$_23 = s_45, index_4 = 0, (index_4 < 0 ? true : index_4 >= this$_23.length) ? "\uFFFF" : this$_23.underlying[this$_23.startIndex + index_4]), matchValue_20 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_24 = s_45, new Position(this$_24.startLine, this$_24.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, "EOF")])]), void 0]) : (c_10 = matchValue_20, (_arg2 = c_10, _arg2 === "+" ? true : _arg2 === "-") ? new FSharpResult$2(0, [c_10, (this$_25 = s_45, start_17 = defaultArg(1, 0) | 0, finish_17 = defaultArg(void 0, this$_25.length - 1) | 0, start_17 >= 0 && start_17 <= this$_25.length && finish_17 < max((x_17, y_16) => comparePrimitives(x_17, y_16), start_17, this$_25.length) ? (len_8 = max((x_18, y_17) => comparePrimitives(x_18, y_17), 0, finish_17 - start_17 + 1) | 0, line_8 = this$_25.startLine, column_8 = this$_25.startColumn, (() => {
      for (let i_14 = 0; i_14 <= start_17 - 1; i_14++) {
        if (this$_25.underlying[this$_25.startIndex + i_14] === "\n") {
          line_8 = line_8 + 1 | 0;
          column_8 = 0;
        } else {
          column_8 = column_8 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_25.startIndex + start_17, len_8, this$_25.underlying, line_8, column_8)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)), void 0]) : new FSharpResult$2(1, [singleton([(this$_26 = s_45, new Position(this$_26.startLine, this$_26.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, c_10)])]), void 0])))), matchValue_22.tag === 0 ? (state_64 = matchValue_22.fields[0][2], s_48 = matchValue_22.fields[0][1], new FSharpResult$2(0, [void 0, s_48, void 0])) : (e_6 = matchValue_22.fields[0], new FSharpResult$2(1, e_6)))), matchValue_23.tag === 1 ? (state_69 = matchValue_23.fields[0][1], new FSharpResult$2(0, [void 0, s_50, void 0])) : (state_68 = matchValue_23.fields[0][2], s_51 = matchValue_23.fields[0][1], new FSharpResult$2(0, [void 0, s_51, void 0])))), matchValue_25.tag === 0 ? (state_75 = matchValue_25.fields[0][2], s_55 = matchValue_25.fields[0][1], r2_1 = matchValue_25.fields[0][0], new FSharpResult$2(0, [void 0, s_55, void 0])) : (e_8 = matchValue_25.fields[0], new FSharpResult$2(1, e_8))) : (e_7 = matchValue_24.fields[0], new FSharpResult$2(1, e_7))));
    if (matchValue_27.tag === 0) {
      const state_81 = matchValue_27.fields[0][2];
      const s_59 = matchValue_27.fields[0][1];
      const matchValue_28 = Result_MapError((tupledArg_34) => ParseError_sort(tupledArg_34[0], void 0), p2_6([void 0, s_59]));
      if (matchValue_28.tag === 0) {
        const state_83 = matchValue_28.fields[0][2];
        const s_60 = matchValue_28.fields[0][1];
        const r2_2 = matchValue_28.fields[0][0];
        return new FSharpResult$2(0, [void 0, s_60, void 0]);
      } else {
        const e_10 = matchValue_28.fields[0];
        return new FSharpResult$2(1, e_10);
      }
    } else {
      const e_9 = matchValue_27.fields[0];
      return new FSharpResult$2(1, e_9);
    }
  }), (tupledArg_35) => {
    const s_62 = tupledArg_35[1];
    const matchValue_29 = Result_MapError((tupledArg_36) => ParseError_sort(tupledArg_36[0], void 0), p_27([void 0, s_62]));
    if (matchValue_29.tag === 1) {
      const state_88 = matchValue_29.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_62, void 0]);
    } else {
      const state_87 = matchValue_29.fields[0][2];
      const s_63 = matchValue_29.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_63, void 0]);
    }
  }), (tupledArg_37) => {
    const s_65 = tupledArg_37[1];
    const matchValue_30 = Result_MapError((tupledArg_38) => ParseError_sort(tupledArg_38[0], void 0), p_30([void 0, s_65]));
    if (matchValue_30.tag === 0) {
      const state_92 = matchValue_30.fields[0][2];
      const s$0027_1 = matchValue_30.fields[0][1];
      let str_7;
      let this$_31;
      const this$_30 = s_65;
      const finish_20 = s$0027_1.startIndex - s_65.startIndex - 1;
      const start_21 = defaultArg(0, 0) | 0;
      const finish_21 = defaultArg(finish_20, this$_30.length - 1) | 0;
      if (start_21 >= 0 && start_21 <= this$_30.length && finish_21 < max((x_22, y_20) => comparePrimitives(x_22, y_20), start_21, this$_30.length)) {
        const len_10 = max((x_23, y_21) => comparePrimitives(x_23, y_21), 0, finish_21 - start_21 + 1) | 0;
        let line_10 = this$_30.startLine;
        let column_10 = this$_30.startColumn;
        for (let i_18 = 0; i_18 <= start_21 - 1; i_18++) {
          if (this$_30.underlying[this$_30.startIndex + i_18] === "\n") {
            line_10 = line_10 + 1 | 0;
            column_10 = 0;
          } else {
            column_10 = column_10 + 1 | 0;
          }
        }
        this$_31 = new StringSegment(this$_30.startIndex + start_21, len_10, this$_30.underlying, line_10, column_10);
      } else {
        this$_31 = toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_21)(finish_21);
      }
      str_7 = substring(this$_31.underlying, this$_31.startIndex, this$_31.length);
      return new FSharpResult$2(0, [str_7, s$0027_1, void 0]);
    } else {
      const e_11 = matchValue_30.fields[0];
      return new FSharpResult$2(1, e_11);
    }
  }), (tupledArg_46) => {
    let matchValue_33, state_103, s_73, r_1, matchValue_32, state_98, s_70, r, e_12, e_13;
    const matchValue_34 = Result_MapError((tupledArg_47) => ParseError_sort(tupledArg_47[0], void 0), p1_9([void 0, tupledArg_46[1]]));
    if (matchValue_34.tag === 0) {
      const state_108 = matchValue_34.fields[0][2];
      const s_76 = matchValue_34.fields[0][1];
      const r_2 = matchValue_34.fields[0][0];
      return Result_MapError((tupledArg_48) => ParseError_sort(tupledArg_48[0], void 0), (matchValue_33 = Result_MapError((tupledArg_44) => ParseError_sort(tupledArg_44[0], void 0), p2_8([void 0, s_76])), matchValue_33.tag === 0 ? (state_103 = matchValue_33.fields[0][2], s_73 = matchValue_33.fields[0][1], r_1 = matchValue_33.fields[0][0], Result_MapError((tupledArg_45) => ParseError_sort(tupledArg_45[0], void 0), (matchValue_32 = Result_MapError((tupledArg_41) => ParseError_sort(tupledArg_41[0], void 0), p3([void 0, s_73])), matchValue_32.tag === 0 ? (state_98 = matchValue_32.fields[0][2], s_70 = matchValue_32.fields[0][1], r = matchValue_32.fields[0][0], Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), new FSharpResult$2(0, [r_2 + r_1 + r, s_70, void 0]))) : (e_12 = matchValue_32.fields[0], new FSharpResult$2(1, e_12))))) : (e_13 = matchValue_33.fields[0], new FSharpResult$2(1, e_13))));
    } else {
      const e_14 = matchValue_34.fields[0];
      return new FSharpResult$2(1, e_14);
    }
  })]);
  return (tupledArg_49) => {
    const s_78 = tupledArg_49[1];
    const go_3 = (state_112_mut, _arg1_1_mut) => {
      let this$_33, this$_32;
      go_3:
        while (true) {
          const state_112 = state_112_mut, _arg1_1 = _arg1_1_mut;
          if (!isEmpty(_arg1_1)) {
            if (isEmpty(tail(_arg1_1))) {
              const p_42 = head(_arg1_1);
              const matchValue_35 = Result_MapError((tupledArg_50) => ParseError_sort(tupledArg_50[0], tupledArg_50[1]), p_42([state_112, s_78]));
              if (matchValue_35.tag === 1) {
                const state_115 = matchValue_35.fields[0][1];
                return new FSharpResult$2(1, [singleton([(this$_33 = s_78, new Position(this$_33.startLine, this$_33.startColumn)), singleton(new ErrorType(0, "float"))]), state_115]);
              } else {
                const x_26 = matchValue_35;
                return x_26;
              }
            } else {
              const p_44 = head(_arg1_1);
              const ps_2 = tail(_arg1_1);
              const matchValue_36 = Result_MapError((tupledArg_51) => ParseError_sort(tupledArg_51[0], tupledArg_51[1]), p_44([state_112, s_78]));
              if (matchValue_36.tag === 1) {
                const state_117 = matchValue_36.fields[0][1];
                state_112_mut = state_117;
                _arg1_1_mut = ps_2;
                continue go_3;
              } else {
                const x_27 = matchValue_36;
                return x_27;
              }
            }
          } else {
            return new FSharpResult$2(1, [singleton([(this$_32 = s_78, new Position(this$_32.startLine, this$_32.startColumn)), singleton(new ErrorType(2, "No parsers given"))]), state_112]);
          }
          break;
        }
    };
    return go_3(void 0, ps);
  };
})();
var CharParsers_Internal_pIntLikeUnit = (() => {
  let p_11, p2_2, p_5, p_22, p2_6, p_16, p_33, p2_10, p_27, p_40, p_36;
  let p_52;
  let p_49;
  let p2_12;
  const ps = ofArray([(p_11 = (p2_2 = (p_5 = (tupledArg_8) => {
    let this$_9, c_1, this$_10, start_7, finish_7, len_3, line_3, column_3, this$_11;
    const label_2 = "[0-9a-fA-F]";
    const s_15 = tupledArg_8[1];
    let matchValue_7;
    const this$_8 = s_15;
    const index_1 = 0;
    matchValue_7 = (index_1 < 0 ? true : index_1 >= this$_8.length) ? "\uFFFF" : this$_8.underlying[this$_8.startIndex + index_1];
    if (matchValue_7 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_9 = s_15, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_2 = matchValue_7;
      if (c_1 = c_2, (isDigit(c_1) ? true : "A" <= c_1 && c_1 <= "F") ? true : "a" <= c_1 && c_1 <= "f") {
        return new FSharpResult$2(0, [c_2, (this$_10 = s_15, start_7 = defaultArg(1, 0) | 0, finish_7 = defaultArg(void 0, this$_10.length - 1) | 0, start_7 >= 0 && start_7 <= this$_10.length && finish_7 < max((x_8, y_6) => comparePrimitives(x_8, y_6), start_7, this$_10.length) ? (len_3 = max((x_9, y_7) => comparePrimitives(x_9, y_7), 0, finish_7 - start_7 + 1) | 0, line_3 = this$_10.startLine, column_3 = this$_10.startColumn, (() => {
          for (let i_5 = 0; i_5 <= start_7 - 1; i_5++) {
            if (this$_10.underlying[this$_10.startIndex + i_5] === "\n") {
              line_3 = line_3 + 1 | 0;
              column_3 = 0;
            } else {
              column_3 = column_3 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_10.startIndex + start_7, len_3, this$_10.underlying, line_3, column_3)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_11 = s_15, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, c_2)])]), void 0]);
      }
    }
  }, (tupledArg_9) => {
    const s_17 = tupledArg_9[1];
    const matchValue_9 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), p_5([void 0, s_17]));
    if (matchValue_9.tag === 0) {
      const state_30 = matchValue_9.fields[0][2];
      const s_18 = matchValue_9.fields[0][1];
      const c1 = matchValue_9.fields[0][0];
      const sb = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb, c1);
      const go = (tupledArg_11_mut_1) => {
        go:
          while (true) {
            const tupledArg_11 = tupledArg_11_mut_1;
            const state_31 = tupledArg_11[0];
            const s_19 = tupledArg_11[1];
            const matchValue_10 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), p_5([void 0, s_19]));
            if (matchValue_10.tag === 0) {
              const state_33 = matchValue_10.fields[0][2];
              const s_20 = matchValue_10.fields[0][1];
              const c_4 = matchValue_10.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb, c_4);
              tupledArg_11_mut_1 = [void 0, s_20];
              continue go;
            } else {
              return new FSharpResult$2(0, [toString2(sb), s_19, void 0]);
            }
            break;
          }
      };
      return go([void 0, s_18]);
    } else {
      const state_29 = matchValue_9.fields[0][1];
      const es_1 = matchValue_9.fields[0][0];
      return new FSharpResult$2(1, [es_1, void 0]);
    }
  }), (tupledArg_13) => {
    let s_12, matchValue_5, str_1, s_6, this$_4, start_3, finish_3, len_1, line_1, column_1, this$_5, state_18, es, matchValue_6, str_3, s_9, this$_6, start_5, finish_5, len_2, line_2, column_2, this$_7, state_20, es$0027, x_7, x_6;
    const matchValue_11 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), (s_12 = tupledArg_13[1], matchValue_5 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), (str_1 = "0x", s_6 = s_12, StringSegmentModule_startsWith(str_1, s_6) ? new FSharpResult$2(0, [void 0, (this$_4 = s_6, start_3 = defaultArg(str_1.length, 0) | 0, finish_3 = defaultArg(void 0, this$_4.length - 1) | 0, start_3 >= 0 && start_3 <= this$_4.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_4.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_4.startLine, column_1 = this$_4.startColumn, (() => {
      for (let i_2 = 0; i_2 <= start_3 - 1; i_2++) {
        if (this$_4.underlying[this$_4.startIndex + i_2] === "\n") {
          line_1 = line_1 + 1 | 0;
          column_1 = 0;
        } else {
          column_1 = column_1 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_4.startIndex + start_3, len_1, this$_4.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_5 = s_6, new Position(this$_5.startLine, this$_5.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]))), matchValue_5.tag === 1 ? (state_18 = matchValue_5.fields[0][1], es = matchValue_5.fields[0][0], matchValue_6 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (str_3 = "0X", s_9 = s_12, StringSegmentModule_startsWith(str_3, s_9) ? new FSharpResult$2(0, [void 0, (this$_6 = s_9, start_5 = defaultArg(str_3.length, 0) | 0, finish_5 = defaultArg(void 0, this$_6.length - 1) | 0, start_5 >= 0 && start_5 <= this$_6.length && finish_5 < max((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_6.length) ? (len_2 = max((x_5, y_5) => comparePrimitives(x_5, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_6.startLine, column_2 = this$_6.startColumn, (() => {
      for (let i_3 = 0; i_3 <= start_5 - 1; i_3++) {
        if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
          line_2 = line_2 + 1 | 0;
          column_2 = 0;
        } else {
          column_2 = column_2 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_6.startIndex + start_5, len_2, this$_6.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_9, new Position(this$_7.startLine, this$_7.startColumn)), singleton(new ErrorType(0, "'" + str_3 + "'"))]), void 0]))), matchValue_6.tag === 1 ? (state_20 = matchValue_6.fields[0][1], es$0027 = matchValue_6.fields[0][0], new FSharpResult$2(1, [append(es, es$0027), void 0])) : (x_7 = matchValue_6, x_7)) : (x_6 = matchValue_5, x_6)));
    if (matchValue_11.tag === 0) {
      const state_37 = matchValue_11.fields[0][2];
      const s_23 = matchValue_11.fields[0][1];
      const matchValue_12 = Result_MapError((tupledArg_15) => ParseError_sort(tupledArg_15[0], void 0), p2_2([void 0, s_23]));
      if (matchValue_12.tag === 0) {
        const state_39 = matchValue_12.fields[0][2];
        const s_24 = matchValue_12.fields[0][1];
        const r2 = matchValue_12.fields[0][0];
        return new FSharpResult$2(0, [r2, s_24, void 0]);
      } else {
        const e_1 = matchValue_12.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_11.fields[0];
      return new FSharpResult$2(1, e);
    }
  }), (tupledArg_16) => {
    const matchValue_13 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), p_11([void 0, tupledArg_16[1]]));
    if (matchValue_13.tag === 0) {
      const state_43 = matchValue_13.fields[0][2];
      const s_27 = matchValue_13.fields[0][1];
      const r_1 = matchValue_13.fields[0][0];
      return new FSharpResult$2(0, [[16, r_1], s_27, void 0]);
    } else {
      const e_2 = matchValue_13.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  }), (p_22 = (p2_6 = (p_16 = (tupledArg_23) => {
    let this$_17, c_6, this$_18, start_13, finish_13, len_6, line_6, column_6, this$_19;
    const label_3 = "[0-7]";
    const s_38 = tupledArg_23[1];
    let matchValue_18;
    const this$_16 = s_38;
    const index_2 = 0;
    matchValue_18 = (index_2 < 0 ? true : index_2 >= this$_16.length) ? "\uFFFF" : this$_16.underlying[this$_16.startIndex + index_2];
    if (matchValue_18 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_17 = s_38, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_7 = matchValue_18;
      if (c_6 = c_7, "0" <= c_6 && c_6 <= "7") {
        return new FSharpResult$2(0, [c_7, (this$_18 = s_38, start_13 = defaultArg(1, 0) | 0, finish_13 = defaultArg(void 0, this$_18.length - 1) | 0, start_13 >= 0 && start_13 <= this$_18.length && finish_13 < max((x_17, y_12) => comparePrimitives(x_17, y_12), start_13, this$_18.length) ? (len_6 = max((x_18, y_13) => comparePrimitives(x_18, y_13), 0, finish_13 - start_13 + 1) | 0, line_6 = this$_18.startLine, column_6 = this$_18.startColumn, (() => {
          for (let i_9 = 0; i_9 <= start_13 - 1; i_9++) {
            if (this$_18.underlying[this$_18.startIndex + i_9] === "\n") {
              line_6 = line_6 + 1 | 0;
              column_6 = 0;
            } else {
              column_6 = column_6 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_18.startIndex + start_13, len_6, this$_18.underlying, line_6, column_6)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_19 = s_38, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_7)])]), void 0]);
      }
    }
  }, (tupledArg_24) => {
    const s_40 = tupledArg_24[1];
    const matchValue_20 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), p_16([void 0, s_40]));
    if (matchValue_20.tag === 0) {
      const state_65 = matchValue_20.fields[0][2];
      const s_41 = matchValue_20.fields[0][1];
      const c1_1 = matchValue_20.fields[0][0];
      const sb_3 = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb_3, c1_1);
      const go_1 = (tupledArg_26_mut) => {
        go_1:
          while (true) {
            const tupledArg_26 = tupledArg_26_mut;
            const state_66 = tupledArg_26[0];
            const s_42 = tupledArg_26[1];
            const matchValue_21 = Result_MapError((tupledArg_27) => ParseError_sort(tupledArg_27[0], void 0), p_16([void 0, s_42]));
            if (matchValue_21.tag === 0) {
              const state_68 = matchValue_21.fields[0][2];
              const s_43 = matchValue_21.fields[0][1];
              const c_9 = matchValue_21.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb_3, c_9);
              tupledArg_26_mut = [void 0, s_43];
              continue go_1;
            } else {
              return new FSharpResult$2(0, [toString2(sb_3), s_42, void 0]);
            }
            break;
          }
      };
      return go_1([void 0, s_41]);
    } else {
      const state_64 = matchValue_20.fields[0][1];
      const es_3 = matchValue_20.fields[0][0];
      return new FSharpResult$2(1, [es_3, void 0]);
    }
  }), (tupledArg_28) => {
    let s_35, matchValue_16, str_5, s_29, this$_12, start_9, finish_9, len_4, line_4, column_4, this$_13, state_53, es_2, matchValue_17, str_7, s_32, this$_14, start_11, finish_11, len_5, line_5, column_5, this$_15, state_55, es$0027_1, x_16, x_15;
    const matchValue_22 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), (s_35 = tupledArg_28[1], matchValue_16 = Result_MapError((tupledArg_21) => ParseError_sort(tupledArg_21[0], void 0), (str_5 = "0o", s_29 = s_35, StringSegmentModule_startsWith(str_5, s_29) ? new FSharpResult$2(0, [void 0, (this$_12 = s_29, start_9 = defaultArg(str_5.length, 0) | 0, finish_9 = defaultArg(void 0, this$_12.length - 1) | 0, start_9 >= 0 && start_9 <= this$_12.length && finish_9 < max((x_11, y_8) => comparePrimitives(x_11, y_8), start_9, this$_12.length) ? (len_4 = max((x_12, y_9) => comparePrimitives(x_12, y_9), 0, finish_9 - start_9 + 1) | 0, line_4 = this$_12.startLine, column_4 = this$_12.startColumn, (() => {
      for (let i_6 = 0; i_6 <= start_9 - 1; i_6++) {
        if (this$_12.underlying[this$_12.startIndex + i_6] === "\n") {
          line_4 = line_4 + 1 | 0;
          column_4 = 0;
        } else {
          column_4 = column_4 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_12.startIndex + start_9, len_4, this$_12.underlying, line_4, column_4)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)), void 0]) : new FSharpResult$2(1, [singleton([(this$_13 = s_29, new Position(this$_13.startLine, this$_13.startColumn)), singleton(new ErrorType(0, "'" + str_5 + "'"))]), void 0]))), matchValue_16.tag === 1 ? (state_53 = matchValue_16.fields[0][1], es_2 = matchValue_16.fields[0][0], matchValue_17 = Result_MapError((tupledArg_22) => ParseError_sort(tupledArg_22[0], void 0), (str_7 = "0O", s_32 = s_35, StringSegmentModule_startsWith(str_7, s_32) ? new FSharpResult$2(0, [void 0, (this$_14 = s_32, start_11 = defaultArg(str_7.length, 0) | 0, finish_11 = defaultArg(void 0, this$_14.length - 1) | 0, start_11 >= 0 && start_11 <= this$_14.length && finish_11 < max((x_13, y_10) => comparePrimitives(x_13, y_10), start_11, this$_14.length) ? (len_5 = max((x_14, y_11) => comparePrimitives(x_14, y_11), 0, finish_11 - start_11 + 1) | 0, line_5 = this$_14.startLine, column_5 = this$_14.startColumn, (() => {
      for (let i_7 = 0; i_7 <= start_11 - 1; i_7++) {
        if (this$_14.underlying[this$_14.startIndex + i_7] === "\n") {
          line_5 = line_5 + 1 | 0;
          column_5 = 0;
        } else {
          column_5 = column_5 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_14.startIndex + start_11, len_5, this$_14.underlying, line_5, column_5)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)), void 0]) : new FSharpResult$2(1, [singleton([(this$_15 = s_32, new Position(this$_15.startLine, this$_15.startColumn)), singleton(new ErrorType(0, "'" + str_7 + "'"))]), void 0]))), matchValue_17.tag === 1 ? (state_55 = matchValue_17.fields[0][1], es$0027_1 = matchValue_17.fields[0][0], new FSharpResult$2(1, [append(es_2, es$0027_1), void 0])) : (x_16 = matchValue_17, x_16)) : (x_15 = matchValue_16, x_15)));
    if (matchValue_22.tag === 0) {
      const state_72 = matchValue_22.fields[0][2];
      const s_46 = matchValue_22.fields[0][1];
      const matchValue_23 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), p2_6([void 0, s_46]));
      if (matchValue_23.tag === 0) {
        const state_74 = matchValue_23.fields[0][2];
        const s_47 = matchValue_23.fields[0][1];
        const r2_1 = matchValue_23.fields[0][0];
        return new FSharpResult$2(0, [r2_1, s_47, void 0]);
      } else {
        const e_4 = matchValue_23.fields[0];
        return new FSharpResult$2(1, e_4);
      }
    } else {
      const e_3 = matchValue_22.fields[0];
      return new FSharpResult$2(1, e_3);
    }
  }), (tupledArg_31) => {
    const matchValue_24 = Result_MapError((tupledArg_32) => ParseError_sort(tupledArg_32[0], void 0), p_22([void 0, tupledArg_31[1]]));
    if (matchValue_24.tag === 0) {
      const state_78 = matchValue_24.fields[0][2];
      const s_50 = matchValue_24.fields[0][1];
      const r_2 = matchValue_24.fields[0][0];
      return new FSharpResult$2(0, [[8, r_2], s_50, void 0]);
    } else {
      const e_5 = matchValue_24.fields[0];
      return new FSharpResult$2(1, e_5);
    }
  }), (p_33 = (p2_10 = (p_27 = (tupledArg_38) => {
    let this$_25, _arg2, this$_26, start_19, finish_19, len_9, line_9, column_9, this$_27;
    const label_5 = "a char with condition";
    const s_60 = tupledArg_38[1];
    let matchValue_29;
    const this$_24 = s_60;
    const index_3 = 0;
    matchValue_29 = (index_3 < 0 ? true : index_3 >= this$_24.length) ? "\uFFFF" : this$_24.underlying[this$_24.startIndex + index_3];
    if (matchValue_29 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_25 = s_60, new Position(this$_25.startLine, this$_25.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_11 = matchValue_29;
      if (_arg2 = c_11, _arg2 === "0" ? true : _arg2 === "1") {
        return new FSharpResult$2(0, [c_11, (this$_26 = s_60, start_19 = defaultArg(1, 0) | 0, finish_19 = defaultArg(void 0, this$_26.length - 1) | 0, start_19 >= 0 && start_19 <= this$_26.length && finish_19 < max((x_26, y_18) => comparePrimitives(x_26, y_18), start_19, this$_26.length) ? (len_9 = max((x_27, y_19) => comparePrimitives(x_27, y_19), 0, finish_19 - start_19 + 1) | 0, line_9 = this$_26.startLine, column_9 = this$_26.startColumn, (() => {
          for (let i_13 = 0; i_13 <= start_19 - 1; i_13++) {
            if (this$_26.underlying[this$_26.startIndex + i_13] === "\n") {
              line_9 = line_9 + 1 | 0;
              column_9 = 0;
            } else {
              column_9 = column_9 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_26.startIndex + start_19, len_9, this$_26.underlying, line_9, column_9)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_27 = s_60, new Position(this$_27.startLine, this$_27.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, c_11)])]), void 0]);
      }
    }
  }, (tupledArg_39) => {
    const s_62 = tupledArg_39[1];
    const matchValue_31 = Result_MapError((tupledArg_40) => ParseError_sort(tupledArg_40[0], void 0), p_27([void 0, s_62]));
    if (matchValue_31.tag === 0) {
      const state_99 = matchValue_31.fields[0][2];
      const s_63 = matchValue_31.fields[0][1];
      const c1_2 = matchValue_31.fields[0][0];
      const sb_6 = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb_6, c1_2);
      const go_2 = (tupledArg_41_mut) => {
        go_2:
          while (true) {
            const tupledArg_41 = tupledArg_41_mut;
            const state_100 = tupledArg_41[0];
            const s_64 = tupledArg_41[1];
            const matchValue_32 = Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), p_27([void 0, s_64]));
            if (matchValue_32.tag === 0) {
              const state_102 = matchValue_32.fields[0][2];
              const s_65 = matchValue_32.fields[0][1];
              const c_13 = matchValue_32.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb_6, c_13);
              tupledArg_41_mut = [void 0, s_65];
              continue go_2;
            } else {
              return new FSharpResult$2(0, [toString2(sb_6), s_64, void 0]);
            }
            break;
          }
      };
      return go_2([void 0, s_63]);
    } else {
      const state_98 = matchValue_31.fields[0][1];
      const es_5 = matchValue_31.fields[0][0];
      return new FSharpResult$2(1, [es_5, void 0]);
    }
  }), (tupledArg_43) => {
    let s_58, matchValue_27, str_9, s_52, this$_20, start_15, finish_15, len_7, line_7, column_7, this$_21, state_88, es_4, matchValue_28, str_11, s_55, this$_22, start_17, finish_17, len_8, line_8, column_8, this$_23, state_90, es$0027_2, x_25, x_24;
    const matchValue_33 = Result_MapError((tupledArg_44) => ParseError_sort(tupledArg_44[0], void 0), (s_58 = tupledArg_43[1], matchValue_27 = Result_MapError((tupledArg_36) => ParseError_sort(tupledArg_36[0], void 0), (str_9 = "0b", s_52 = s_58, StringSegmentModule_startsWith(str_9, s_52) ? new FSharpResult$2(0, [void 0, (this$_20 = s_52, start_15 = defaultArg(str_9.length, 0) | 0, finish_15 = defaultArg(void 0, this$_20.length - 1) | 0, start_15 >= 0 && start_15 <= this$_20.length && finish_15 < max((x_20, y_14) => comparePrimitives(x_20, y_14), start_15, this$_20.length) ? (len_7 = max((x_21, y_15) => comparePrimitives(x_21, y_15), 0, finish_15 - start_15 + 1) | 0, line_7 = this$_20.startLine, column_7 = this$_20.startColumn, (() => {
      for (let i_10 = 0; i_10 <= start_15 - 1; i_10++) {
        if (this$_20.underlying[this$_20.startIndex + i_10] === "\n") {
          line_7 = line_7 + 1 | 0;
          column_7 = 0;
        } else {
          column_7 = column_7 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_20.startIndex + start_15, len_7, this$_20.underlying, line_7, column_7)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)), void 0]) : new FSharpResult$2(1, [singleton([(this$_21 = s_52, new Position(this$_21.startLine, this$_21.startColumn)), singleton(new ErrorType(0, "'" + str_9 + "'"))]), void 0]))), matchValue_27.tag === 1 ? (state_88 = matchValue_27.fields[0][1], es_4 = matchValue_27.fields[0][0], matchValue_28 = Result_MapError((tupledArg_37) => ParseError_sort(tupledArg_37[0], void 0), (str_11 = "0B", s_55 = s_58, StringSegmentModule_startsWith(str_11, s_55) ? new FSharpResult$2(0, [void 0, (this$_22 = s_55, start_17 = defaultArg(str_11.length, 0) | 0, finish_17 = defaultArg(void 0, this$_22.length - 1) | 0, start_17 >= 0 && start_17 <= this$_22.length && finish_17 < max((x_22, y_16) => comparePrimitives(x_22, y_16), start_17, this$_22.length) ? (len_8 = max((x_23, y_17) => comparePrimitives(x_23, y_17), 0, finish_17 - start_17 + 1) | 0, line_8 = this$_22.startLine, column_8 = this$_22.startColumn, (() => {
      for (let i_11 = 0; i_11 <= start_17 - 1; i_11++) {
        if (this$_22.underlying[this$_22.startIndex + i_11] === "\n") {
          line_8 = line_8 + 1 | 0;
          column_8 = 0;
        } else {
          column_8 = column_8 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_22.startIndex + start_17, len_8, this$_22.underlying, line_8, column_8)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)), void 0]) : new FSharpResult$2(1, [singleton([(this$_23 = s_55, new Position(this$_23.startLine, this$_23.startColumn)), singleton(new ErrorType(0, "'" + str_11 + "'"))]), void 0]))), matchValue_28.tag === 1 ? (state_90 = matchValue_28.fields[0][1], es$0027_2 = matchValue_28.fields[0][0], new FSharpResult$2(1, [append(es_4, es$0027_2), void 0])) : (x_25 = matchValue_28, x_25)) : (x_24 = matchValue_27, x_24)));
    if (matchValue_33.tag === 0) {
      const state_106 = matchValue_33.fields[0][2];
      const s_68 = matchValue_33.fields[0][1];
      const matchValue_34 = Result_MapError((tupledArg_45) => ParseError_sort(tupledArg_45[0], void 0), p2_10([void 0, s_68]));
      if (matchValue_34.tag === 0) {
        const state_108 = matchValue_34.fields[0][2];
        const s_69 = matchValue_34.fields[0][1];
        const r2_2 = matchValue_34.fields[0][0];
        return new FSharpResult$2(0, [r2_2, s_69, void 0]);
      } else {
        const e_7 = matchValue_34.fields[0];
        return new FSharpResult$2(1, e_7);
      }
    } else {
      const e_6 = matchValue_33.fields[0];
      return new FSharpResult$2(1, e_6);
    }
  }), (tupledArg_46) => {
    const matchValue_35 = Result_MapError((tupledArg_47) => ParseError_sort(tupledArg_47[0], void 0), p_33([void 0, tupledArg_46[1]]));
    if (matchValue_35.tag === 0) {
      const state_112 = matchValue_35.fields[0][2];
      const s_72 = matchValue_35.fields[0][1];
      const r_3 = matchValue_35.fields[0][0];
      return new FSharpResult$2(0, [[2, r_3], s_72, void 0]);
    } else {
      const e_8 = matchValue_35.fields[0];
      return new FSharpResult$2(1, e_8);
    }
  }), (p_40 = (p_36 = (tupledArg_48) => {
    let this$_29, this$_30, start_21, finish_21, len_10, line_10, column_10, this$_31;
    const label_6 = "[0-9]";
    const s_75 = tupledArg_48[1];
    let matchValue_36;
    const this$_28 = s_75;
    const index_4 = 0;
    matchValue_36 = (index_4 < 0 ? true : index_4 >= this$_28.length) ? "\uFFFF" : this$_28.underlying[this$_28.startIndex + index_4];
    if (matchValue_36 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_29 = s_75, new Position(this$_29.startLine, this$_29.startColumn)), ofArray([new ErrorType(0, label_6), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_15 = matchValue_36;
      if (isDigit(c_15)) {
        return new FSharpResult$2(0, [c_15, (this$_30 = s_75, start_21 = defaultArg(1, 0) | 0, finish_21 = defaultArg(void 0, this$_30.length - 1) | 0, start_21 >= 0 && start_21 <= this$_30.length && finish_21 < max((x_29, y_20) => comparePrimitives(x_29, y_20), start_21, this$_30.length) ? (len_10 = max((x_30, y_21) => comparePrimitives(x_30, y_21), 0, finish_21 - start_21 + 1) | 0, line_10 = this$_30.startLine, column_10 = this$_30.startColumn, (() => {
          for (let i_15 = 0; i_15 <= start_21 - 1; i_15++) {
            if (this$_30.underlying[this$_30.startIndex + i_15] === "\n") {
              line_10 = line_10 + 1 | 0;
              column_10 = 0;
            } else {
              column_10 = column_10 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_30.startIndex + start_21, len_10, this$_30.underlying, line_10, column_10)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_21)(finish_21)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_31 = s_75, new Position(this$_31.startLine, this$_31.startColumn)), ofArray([new ErrorType(0, label_6), new ErrorType(1, c_15)])]), void 0]);
      }
    }
  }, (tupledArg_49) => {
    const s_77 = tupledArg_49[1];
    const matchValue_38 = Result_MapError((tupledArg_50) => ParseError_sort(tupledArg_50[0], void 0), p_36([void 0, s_77]));
    if (matchValue_38.tag === 0) {
      const state_122 = matchValue_38.fields[0][2];
      const s_78 = matchValue_38.fields[0][1];
      const c1_3 = matchValue_38.fields[0][0];
      const sb_9 = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb_9, c1_3);
      const go_3 = (tupledArg_51_mut) => {
        go_3:
          while (true) {
            const tupledArg_51 = tupledArg_51_mut;
            const state_123 = tupledArg_51[0];
            const s_79 = tupledArg_51[1];
            const matchValue_39 = Result_MapError((tupledArg_52) => ParseError_sort(tupledArg_52[0], void 0), p_36([void 0, s_79]));
            if (matchValue_39.tag === 0) {
              const state_125 = matchValue_39.fields[0][2];
              const s_80 = matchValue_39.fields[0][1];
              const c_17 = matchValue_39.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb_9, c_17);
              tupledArg_51_mut = [void 0, s_80];
              continue go_3;
            } else {
              return new FSharpResult$2(0, [toString2(sb_9), s_79, void 0]);
            }
            break;
          }
      };
      return go_3([void 0, s_78]);
    } else {
      const state_121 = matchValue_38.fields[0][1];
      const es_6 = matchValue_38.fields[0][0];
      return new FSharpResult$2(1, [es_6, void 0]);
    }
  }), (tupledArg_53) => {
    const matchValue_40 = Result_MapError((tupledArg_54) => ParseError_sort(tupledArg_54[0], void 0), p_40([void 0, tupledArg_53[1]]));
    if (matchValue_40.tag === 0) {
      const state_129 = matchValue_40.fields[0][2];
      const s_83 = matchValue_40.fields[0][1];
      const r_4 = matchValue_40.fields[0][0];
      return new FSharpResult$2(0, [[10, r_4], s_83, void 0]);
    } else {
      const e_9 = matchValue_40.fields[0];
      return new FSharpResult$2(1, e_9);
    }
  })]);
  p2_12 = (tupledArg_55) => {
    const s_85 = tupledArg_55[1];
    const go_4 = (state_132_mut, errorsAcc_mut, _arg1_1_mut) => {
      let this$_32;
      go_4:
        while (true) {
          const state_132 = state_132_mut, errorsAcc = errorsAcc_mut, _arg1_1 = _arg1_1_mut;
          if (!isEmpty(_arg1_1)) {
            if (isEmpty(tail(_arg1_1))) {
              const p_43 = head(_arg1_1);
              const matchValue_41 = Result_MapError((tupledArg_56) => ParseError_sort(tupledArg_56[0], tupledArg_56[1]), p_43([state_132, s_85]));
              if (matchValue_41.tag === 1) {
                const state_135 = matchValue_41.fields[0][1];
                const errors = matchValue_41.fields[0][0];
                return new FSharpResult$2(1, [append(errorsAcc, errors), state_135]);
              } else {
                const x_32 = matchValue_41;
                return x_32;
              }
            } else {
              const p_45 = head(_arg1_1);
              const ps_2 = tail(_arg1_1);
              const matchValue_42 = Result_MapError((tupledArg_57) => ParseError_sort(tupledArg_57[0], tupledArg_57[1]), p_45([state_132, s_85]));
              if (matchValue_42.tag === 1) {
                const state_137 = matchValue_42.fields[0][1];
                const errors_1 = matchValue_42.fields[0][0];
                state_132_mut = state_137;
                errorsAcc_mut = append(errors_1, errorsAcc);
                _arg1_1_mut = ps_2;
                continue go_4;
              } else {
                const x_33 = matchValue_42;
                return x_33;
              }
            }
          } else {
            return new FSharpResult$2(1, [singleton([(this$_32 = s_85, new Position(this$_32.startLine, this$_32.startColumn)), singleton(new ErrorType(2, "No parsers given"))]), state_132]);
          }
          break;
        }
    };
    return go_4(void 0, empty(), ps);
  };
  p_49 = (tupledArg_58) => {
    const matchValue_43 = Result_MapError((tupledArg_59) => ParseError_sort(tupledArg_59[0], void 0), ((tupledArg) => {
      const s_1 = tupledArg[1];
      const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), ((tupledArg_2) => {
        let this$_1, _arg1, this$_2, start_1, finish_1, len, line, column, this$_3;
        const label_1 = "a char with condition";
        const s_4 = tupledArg_2[1];
        let matchValue_1;
        const this$ = s_4;
        const index = 0;
        matchValue_1 = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
        if (matchValue_1 === "\uFFFF") {
          return new FSharpResult$2(1, [singleton([(this$_1 = s_4, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
        } else {
          const c = matchValue_1;
          return (_arg1 = c, _arg1 === "+" ? true : _arg1 === "-") ? new FSharpResult$2(0, [c, (this$_2 = s_4, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
            for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
              if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                line = line + 1 | 0;
                column = 0;
              } else {
                column = column + 1 | 0;
              }
            }
          })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_4, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c)])]), void 0]);
        }
      })([void 0, s_1]));
      if (matchValue.tag === 1) {
        const state_4 = matchValue.fields[0][1];
        return new FSharpResult$2(0, [void 0, s_1, void 0]);
      } else {
        const state_3 = matchValue.fields[0][2];
        const s_2 = matchValue.fields[0][1];
        const r = matchValue.fields[0][0];
        return new FSharpResult$2(0, [r, s_2, void 0]);
      }
    })([void 0, tupledArg_58[1]]));
    if (matchValue_43.tag === 0) {
      const state_141 = matchValue_43.fields[0][2];
      const s_88 = matchValue_43.fields[0][1];
      const r1 = matchValue_43.fields[0][0];
      const matchValue_44 = Result_MapError((tupledArg_60) => ParseError_sort(tupledArg_60[0], void 0), p2_12([void 0, s_88]));
      if (matchValue_44.tag === 0) {
        const state_143 = matchValue_44.fields[0][2];
        const s_89 = matchValue_44.fields[0][1];
        const r2_3 = matchValue_44.fields[0][0];
        return new FSharpResult$2(0, [[r1, r2_3], s_89, void 0]);
      } else {
        const e_11 = matchValue_44.fields[0];
        return new FSharpResult$2(1, e_11);
      }
    } else {
      const e_10 = matchValue_43.fields[0];
      return new FSharpResult$2(1, e_10);
    }
  };
  p_52 = (tupledArg_61) => {
    let _arg3, s_90, style, s_91, style_1;
    const matchValue_45 = Result_MapError((tupledArg_62) => ParseError_sort(tupledArg_62[0], void 0), p_49([void 0, tupledArg_61[1]]));
    if (matchValue_45.tag === 0) {
      const state_147 = matchValue_45.fields[0][2];
      const s_94 = matchValue_45.fields[0][1];
      const r_5 = matchValue_45.fields[0][0];
      return new FSharpResult$2(0, [(_arg3 = r_5, _arg3[0] != null ? _arg3[0] === "+" ? (s_90 = _arg3[1][1], style = _arg3[1][0] | 0, [true, style, s_90]) : (s_91 = _arg3[1][1], style_1 = _arg3[1][0] | 0, [false, style_1, s_91]) : (s_90 = _arg3[1][1], style = _arg3[1][0] | 0, [true, style, s_90])), s_94, void 0]);
    } else {
      const e_12 = matchValue_45.fields[0];
      return new FSharpResult$2(1, e_12);
    }
  };
  return (tupledArg_63) => {
    let this$_33;
    const s_96 = tupledArg_63[1];
    const matchValue_46 = Result_MapError((tupledArg_64) => ParseError_sort(tupledArg_64[0], void 0), p_52([void 0, s_96]));
    if (matchValue_46.tag === 1) {
      const state_151 = matchValue_46.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_33 = s_96, new Position(this$_33.startLine, this$_33.startColumn)), singleton(new ErrorType(0, "integer"))]), void 0]);
    } else {
      const x_34 = matchValue_46;
      return x_34;
    }
  };
})();
var CharParsers_Internal_pUIntLikeUnit = (() => {
  let p_8, p2_2, p_2, p_19, p2_6, p_13, p_30, p2_10, p_24, p_37, p_33;
  const ps = ofArray([(p_8 = (p2_2 = (p_2 = (tupledArg_5) => {
    let this$_5, c, this$_6, start_5, finish_5, len_2, line_2, column_2, this$_7;
    const label = "[0-9a-fA-F]";
    const s_10 = tupledArg_5[1];
    let matchValue_4;
    const this$_4 = s_10;
    const index = 0;
    matchValue_4 = (index < 0 ? true : index >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index];
    if (matchValue_4 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_5 = s_10, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_1 = matchValue_4;
      if (c = c_1, (isDigit(c) ? true : "A" <= c && c <= "F") ? true : "a" <= c && c <= "f") {
        return new FSharpResult$2(0, [c_1, (this$_6 = s_10, start_5 = defaultArg(1, 0) | 0, finish_5 = defaultArg(void 0, this$_6.length - 1) | 0, start_5 >= 0 && start_5 <= this$_6.length && finish_5 < max((x_6, y_4) => comparePrimitives(x_6, y_4), start_5, this$_6.length) ? (len_2 = max((x_7, y_5) => comparePrimitives(x_7, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_6.startLine, column_2 = this$_6.startColumn, (() => {
          for (let i_3 = 0; i_3 <= start_5 - 1; i_3++) {
            if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
              line_2 = line_2 + 1 | 0;
              column_2 = 0;
            } else {
              column_2 = column_2 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_6.startIndex + start_5, len_2, this$_6.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_7 = s_10, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c_1)])]), void 0]);
      }
    }
  }, (tupledArg_6) => {
    const s_12 = tupledArg_6[1];
    const matchValue_6 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), p_2([void 0, s_12]));
    if (matchValue_6.tag === 0) {
      const state_21 = matchValue_6.fields[0][2];
      const s_13 = matchValue_6.fields[0][1];
      const c1 = matchValue_6.fields[0][0];
      const sb = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb, c1);
      const go = (tupledArg_8_mut_1) => {
        go:
          while (true) {
            const tupledArg_8 = tupledArg_8_mut_1;
            const state_22 = tupledArg_8[0];
            const s_14 = tupledArg_8[1];
            const matchValue_7 = Result_MapError((tupledArg_9) => ParseError_sort(tupledArg_9[0], void 0), p_2([void 0, s_14]));
            if (matchValue_7.tag === 0) {
              const state_24 = matchValue_7.fields[0][2];
              const s_15 = matchValue_7.fields[0][1];
              const c_3 = matchValue_7.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb, c_3);
              tupledArg_8_mut_1 = [void 0, s_15];
              continue go;
            } else {
              return new FSharpResult$2(0, [toString2(sb), s_14, void 0]);
            }
            break;
          }
      };
      return go([void 0, s_13]);
    } else {
      const state_20 = matchValue_6.fields[0][1];
      const es_1 = matchValue_6.fields[0][0];
      return new FSharpResult$2(1, [es_1, void 0]);
    }
  }), (tupledArg_10) => {
    let s_7, matchValue_2, str_1, s_1, this$, start_1, finish_1, len, line, column, this$_1, state_9, es, matchValue_3, str_3, s_4, this$_2, start_3, finish_3, len_1, line_1, column_1, this$_3, state_11, es$0027, x_5, x_4;
    const matchValue_8 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), (s_7 = tupledArg_10[1], matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), (str_1 = "0x", s_1 = s_7, StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, [void 0, (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]))), matchValue_2.tag === 1 ? (state_9 = matchValue_2.fields[0][1], es = matchValue_2.fields[0][0], matchValue_3 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (str_3 = "0X", s_4 = s_7, StringSegmentModule_startsWith(str_3, s_4) ? new FSharpResult$2(0, [void 0, (this$_2 = s_4, start_3 = defaultArg(str_3.length, 0) | 0, finish_3 = defaultArg(void 0, this$_2.length - 1) | 0, start_3 >= 0 && start_3 <= this$_2.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_2.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_2.startLine, column_1 = this$_2.startColumn, (() => {
      for (let i_1 = 0; i_1 <= start_3 - 1; i_1++) {
        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
          line_1 = line_1 + 1 | 0;
          column_1 = 0;
        } else {
          column_1 = column_1 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_2.startIndex + start_3, len_1, this$_2.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_4, new Position(this$_3.startLine, this$_3.startColumn)), singleton(new ErrorType(0, "'" + str_3 + "'"))]), void 0]))), matchValue_3.tag === 1 ? (state_11 = matchValue_3.fields[0][1], es$0027 = matchValue_3.fields[0][0], new FSharpResult$2(1, [append(es, es$0027), void 0])) : (x_5 = matchValue_3, x_5)) : (x_4 = matchValue_2, x_4)));
    if (matchValue_8.tag === 0) {
      const state_28 = matchValue_8.fields[0][2];
      const s_18 = matchValue_8.fields[0][1];
      const matchValue_9 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), p2_2([void 0, s_18]));
      if (matchValue_9.tag === 0) {
        const state_30 = matchValue_9.fields[0][2];
        const s_19 = matchValue_9.fields[0][1];
        const r2 = matchValue_9.fields[0][0];
        return new FSharpResult$2(0, [r2, s_19, void 0]);
      } else {
        const e_1 = matchValue_9.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_8.fields[0];
      return new FSharpResult$2(1, e);
    }
  }), (tupledArg_13) => {
    const matchValue_10 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), p_8([void 0, tupledArg_13[1]]));
    if (matchValue_10.tag === 0) {
      const state_34 = matchValue_10.fields[0][2];
      const s_22 = matchValue_10.fields[0][1];
      const r = matchValue_10.fields[0][0];
      return new FSharpResult$2(0, [[16, r], s_22, void 0]);
    } else {
      const e_2 = matchValue_10.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  }), (p_19 = (p2_6 = (p_13 = (tupledArg_20) => {
    let this$_13, c_5, this$_14, start_11, finish_11, len_5, line_5, column_5, this$_15;
    const label_1 = "[0-7]";
    const s_33 = tupledArg_20[1];
    let matchValue_15;
    const this$_12 = s_33;
    const index_1 = 0;
    matchValue_15 = (index_1 < 0 ? true : index_1 >= this$_12.length) ? "\uFFFF" : this$_12.underlying[this$_12.startIndex + index_1];
    if (matchValue_15 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_13 = s_33, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_6 = matchValue_15;
      if (c_5 = c_6, "0" <= c_5 && c_5 <= "7") {
        return new FSharpResult$2(0, [c_6, (this$_14 = s_33, start_11 = defaultArg(1, 0) | 0, finish_11 = defaultArg(void 0, this$_14.length - 1) | 0, start_11 >= 0 && start_11 <= this$_14.length && finish_11 < max((x_15, y_10) => comparePrimitives(x_15, y_10), start_11, this$_14.length) ? (len_5 = max((x_16, y_11) => comparePrimitives(x_16, y_11), 0, finish_11 - start_11 + 1) | 0, line_5 = this$_14.startLine, column_5 = this$_14.startColumn, (() => {
          for (let i_7 = 0; i_7 <= start_11 - 1; i_7++) {
            if (this$_14.underlying[this$_14.startIndex + i_7] === "\n") {
              line_5 = line_5 + 1 | 0;
              column_5 = 0;
            } else {
              column_5 = column_5 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_14.startIndex + start_11, len_5, this$_14.underlying, line_5, column_5)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_15 = s_33, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_6)])]), void 0]);
      }
    }
  }, (tupledArg_21) => {
    const s_35 = tupledArg_21[1];
    const matchValue_17 = Result_MapError((tupledArg_22) => ParseError_sort(tupledArg_22[0], void 0), p_13([void 0, s_35]));
    if (matchValue_17.tag === 0) {
      const state_56 = matchValue_17.fields[0][2];
      const s_36 = matchValue_17.fields[0][1];
      const c1_1 = matchValue_17.fields[0][0];
      const sb_3 = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb_3, c1_1);
      const go_1 = (tupledArg_23_mut) => {
        go_1:
          while (true) {
            const tupledArg_23 = tupledArg_23_mut;
            const state_57 = tupledArg_23[0];
            const s_37 = tupledArg_23[1];
            const matchValue_18 = Result_MapError((tupledArg_24) => ParseError_sort(tupledArg_24[0], void 0), p_13([void 0, s_37]));
            if (matchValue_18.tag === 0) {
              const state_59 = matchValue_18.fields[0][2];
              const s_38 = matchValue_18.fields[0][1];
              const c_8 = matchValue_18.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb_3, c_8);
              tupledArg_23_mut = [void 0, s_38];
              continue go_1;
            } else {
              return new FSharpResult$2(0, [toString2(sb_3), s_37, void 0]);
            }
            break;
          }
      };
      return go_1([void 0, s_36]);
    } else {
      const state_55 = matchValue_17.fields[0][1];
      const es_3 = matchValue_17.fields[0][0];
      return new FSharpResult$2(1, [es_3, void 0]);
    }
  }), (tupledArg_25) => {
    let s_30, matchValue_13, str_5, s_24, this$_8, start_7, finish_7, len_3, line_3, column_3, this$_9, state_44, es_2, matchValue_14, str_7, s_27, this$_10, start_9, finish_9, len_4, line_4, column_4, this$_11, state_46, es$0027_1, x_14, x_13;
    const matchValue_19 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), (s_30 = tupledArg_25[1], matchValue_13 = Result_MapError((tupledArg_18) => ParseError_sort(tupledArg_18[0], void 0), (str_5 = "0o", s_24 = s_30, StringSegmentModule_startsWith(str_5, s_24) ? new FSharpResult$2(0, [void 0, (this$_8 = s_24, start_7 = defaultArg(str_5.length, 0) | 0, finish_7 = defaultArg(void 0, this$_8.length - 1) | 0, start_7 >= 0 && start_7 <= this$_8.length && finish_7 < max((x_9, y_6) => comparePrimitives(x_9, y_6), start_7, this$_8.length) ? (len_3 = max((x_10, y_7) => comparePrimitives(x_10, y_7), 0, finish_7 - start_7 + 1) | 0, line_3 = this$_8.startLine, column_3 = this$_8.startColumn, (() => {
      for (let i_4 = 0; i_4 <= start_7 - 1; i_4++) {
        if (this$_8.underlying[this$_8.startIndex + i_4] === "\n") {
          line_3 = line_3 + 1 | 0;
          column_3 = 0;
        } else {
          column_3 = column_3 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_8.startIndex + start_7, len_3, this$_8.underlying, line_3, column_3)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)), void 0]) : new FSharpResult$2(1, [singleton([(this$_9 = s_24, new Position(this$_9.startLine, this$_9.startColumn)), singleton(new ErrorType(0, "'" + str_5 + "'"))]), void 0]))), matchValue_13.tag === 1 ? (state_44 = matchValue_13.fields[0][1], es_2 = matchValue_13.fields[0][0], matchValue_14 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (str_7 = "0O", s_27 = s_30, StringSegmentModule_startsWith(str_7, s_27) ? new FSharpResult$2(0, [void 0, (this$_10 = s_27, start_9 = defaultArg(str_7.length, 0) | 0, finish_9 = defaultArg(void 0, this$_10.length - 1) | 0, start_9 >= 0 && start_9 <= this$_10.length && finish_9 < max((x_11, y_8) => comparePrimitives(x_11, y_8), start_9, this$_10.length) ? (len_4 = max((x_12, y_9) => comparePrimitives(x_12, y_9), 0, finish_9 - start_9 + 1) | 0, line_4 = this$_10.startLine, column_4 = this$_10.startColumn, (() => {
      for (let i_5 = 0; i_5 <= start_9 - 1; i_5++) {
        if (this$_10.underlying[this$_10.startIndex + i_5] === "\n") {
          line_4 = line_4 + 1 | 0;
          column_4 = 0;
        } else {
          column_4 = column_4 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_10.startIndex + start_9, len_4, this$_10.underlying, line_4, column_4)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)), void 0]) : new FSharpResult$2(1, [singleton([(this$_11 = s_27, new Position(this$_11.startLine, this$_11.startColumn)), singleton(new ErrorType(0, "'" + str_7 + "'"))]), void 0]))), matchValue_14.tag === 1 ? (state_46 = matchValue_14.fields[0][1], es$0027_1 = matchValue_14.fields[0][0], new FSharpResult$2(1, [append(es_2, es$0027_1), void 0])) : (x_14 = matchValue_14, x_14)) : (x_13 = matchValue_13, x_13)));
    if (matchValue_19.tag === 0) {
      const state_63 = matchValue_19.fields[0][2];
      const s_41 = matchValue_19.fields[0][1];
      const matchValue_20 = Result_MapError((tupledArg_27) => ParseError_sort(tupledArg_27[0], void 0), p2_6([void 0, s_41]));
      if (matchValue_20.tag === 0) {
        const state_65 = matchValue_20.fields[0][2];
        const s_42 = matchValue_20.fields[0][1];
        const r2_1 = matchValue_20.fields[0][0];
        return new FSharpResult$2(0, [r2_1, s_42, void 0]);
      } else {
        const e_4 = matchValue_20.fields[0];
        return new FSharpResult$2(1, e_4);
      }
    } else {
      const e_3 = matchValue_19.fields[0];
      return new FSharpResult$2(1, e_3);
    }
  }), (tupledArg_28) => {
    const matchValue_21 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), p_19([void 0, tupledArg_28[1]]));
    if (matchValue_21.tag === 0) {
      const state_69 = matchValue_21.fields[0][2];
      const s_45 = matchValue_21.fields[0][1];
      const r_1 = matchValue_21.fields[0][0];
      return new FSharpResult$2(0, [[8, r_1], s_45, void 0]);
    } else {
      const e_5 = matchValue_21.fields[0];
      return new FSharpResult$2(1, e_5);
    }
  }), (p_30 = (p2_10 = (p_24 = (tupledArg_35) => {
    let this$_21, _arg1, this$_22, start_17, finish_17, len_8, line_8, column_8, this$_23;
    const label_3 = "a char with condition";
    const s_55 = tupledArg_35[1];
    let matchValue_26;
    const this$_20 = s_55;
    const index_2 = 0;
    matchValue_26 = (index_2 < 0 ? true : index_2 >= this$_20.length) ? "\uFFFF" : this$_20.underlying[this$_20.startIndex + index_2];
    if (matchValue_26 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_21 = s_55, new Position(this$_21.startLine, this$_21.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_10 = matchValue_26;
      if (_arg1 = c_10, _arg1 === "0" ? true : _arg1 === "1") {
        return new FSharpResult$2(0, [c_10, (this$_22 = s_55, start_17 = defaultArg(1, 0) | 0, finish_17 = defaultArg(void 0, this$_22.length - 1) | 0, start_17 >= 0 && start_17 <= this$_22.length && finish_17 < max((x_24, y_16) => comparePrimitives(x_24, y_16), start_17, this$_22.length) ? (len_8 = max((x_25, y_17) => comparePrimitives(x_25, y_17), 0, finish_17 - start_17 + 1) | 0, line_8 = this$_22.startLine, column_8 = this$_22.startColumn, (() => {
          for (let i_11 = 0; i_11 <= start_17 - 1; i_11++) {
            if (this$_22.underlying[this$_22.startIndex + i_11] === "\n") {
              line_8 = line_8 + 1 | 0;
              column_8 = 0;
            } else {
              column_8 = column_8 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_22.startIndex + start_17, len_8, this$_22.underlying, line_8, column_8)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_23 = s_55, new Position(this$_23.startLine, this$_23.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_10)])]), void 0]);
      }
    }
  }, (tupledArg_36) => {
    const s_57 = tupledArg_36[1];
    const matchValue_28 = Result_MapError((tupledArg_37) => ParseError_sort(tupledArg_37[0], void 0), p_24([void 0, s_57]));
    if (matchValue_28.tag === 0) {
      const state_90 = matchValue_28.fields[0][2];
      const s_58 = matchValue_28.fields[0][1];
      const c1_2 = matchValue_28.fields[0][0];
      const sb_6 = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb_6, c1_2);
      const go_2 = (tupledArg_38_mut) => {
        go_2:
          while (true) {
            const tupledArg_38 = tupledArg_38_mut;
            const state_91 = tupledArg_38[0];
            const s_59 = tupledArg_38[1];
            const matchValue_29 = Result_MapError((tupledArg_39) => ParseError_sort(tupledArg_39[0], void 0), p_24([void 0, s_59]));
            if (matchValue_29.tag === 0) {
              const state_93 = matchValue_29.fields[0][2];
              const s_60 = matchValue_29.fields[0][1];
              const c_12 = matchValue_29.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb_6, c_12);
              tupledArg_38_mut = [void 0, s_60];
              continue go_2;
            } else {
              return new FSharpResult$2(0, [toString2(sb_6), s_59, void 0]);
            }
            break;
          }
      };
      return go_2([void 0, s_58]);
    } else {
      const state_89 = matchValue_28.fields[0][1];
      const es_5 = matchValue_28.fields[0][0];
      return new FSharpResult$2(1, [es_5, void 0]);
    }
  }), (tupledArg_40) => {
    let s_53, matchValue_24, str_9, s_47, this$_16, start_13, finish_13, len_6, line_6, column_6, this$_17, state_79, es_4, matchValue_25, str_11, s_50, this$_18, start_15, finish_15, len_7, line_7, column_7, this$_19, state_81, es$0027_2, x_23, x_22;
    const matchValue_30 = Result_MapError((tupledArg_41) => ParseError_sort(tupledArg_41[0], void 0), (s_53 = tupledArg_40[1], matchValue_24 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), (str_9 = "0b", s_47 = s_53, StringSegmentModule_startsWith(str_9, s_47) ? new FSharpResult$2(0, [void 0, (this$_16 = s_47, start_13 = defaultArg(str_9.length, 0) | 0, finish_13 = defaultArg(void 0, this$_16.length - 1) | 0, start_13 >= 0 && start_13 <= this$_16.length && finish_13 < max((x_18, y_12) => comparePrimitives(x_18, y_12), start_13, this$_16.length) ? (len_6 = max((x_19, y_13) => comparePrimitives(x_19, y_13), 0, finish_13 - start_13 + 1) | 0, line_6 = this$_16.startLine, column_6 = this$_16.startColumn, (() => {
      for (let i_8 = 0; i_8 <= start_13 - 1; i_8++) {
        if (this$_16.underlying[this$_16.startIndex + i_8] === "\n") {
          line_6 = line_6 + 1 | 0;
          column_6 = 0;
        } else {
          column_6 = column_6 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_16.startIndex + start_13, len_6, this$_16.underlying, line_6, column_6)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13)), void 0]) : new FSharpResult$2(1, [singleton([(this$_17 = s_47, new Position(this$_17.startLine, this$_17.startColumn)), singleton(new ErrorType(0, "'" + str_9 + "'"))]), void 0]))), matchValue_24.tag === 1 ? (state_79 = matchValue_24.fields[0][1], es_4 = matchValue_24.fields[0][0], matchValue_25 = Result_MapError((tupledArg_34) => ParseError_sort(tupledArg_34[0], void 0), (str_11 = "0B", s_50 = s_53, StringSegmentModule_startsWith(str_11, s_50) ? new FSharpResult$2(0, [void 0, (this$_18 = s_50, start_15 = defaultArg(str_11.length, 0) | 0, finish_15 = defaultArg(void 0, this$_18.length - 1) | 0, start_15 >= 0 && start_15 <= this$_18.length && finish_15 < max((x_20, y_14) => comparePrimitives(x_20, y_14), start_15, this$_18.length) ? (len_7 = max((x_21, y_15) => comparePrimitives(x_21, y_15), 0, finish_15 - start_15 + 1) | 0, line_7 = this$_18.startLine, column_7 = this$_18.startColumn, (() => {
      for (let i_9 = 0; i_9 <= start_15 - 1; i_9++) {
        if (this$_18.underlying[this$_18.startIndex + i_9] === "\n") {
          line_7 = line_7 + 1 | 0;
          column_7 = 0;
        } else {
          column_7 = column_7 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_18.startIndex + start_15, len_7, this$_18.underlying, line_7, column_7)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)), void 0]) : new FSharpResult$2(1, [singleton([(this$_19 = s_50, new Position(this$_19.startLine, this$_19.startColumn)), singleton(new ErrorType(0, "'" + str_11 + "'"))]), void 0]))), matchValue_25.tag === 1 ? (state_81 = matchValue_25.fields[0][1], es$0027_2 = matchValue_25.fields[0][0], new FSharpResult$2(1, [append(es_4, es$0027_2), void 0])) : (x_23 = matchValue_25, x_23)) : (x_22 = matchValue_24, x_22)));
    if (matchValue_30.tag === 0) {
      const state_97 = matchValue_30.fields[0][2];
      const s_63 = matchValue_30.fields[0][1];
      const matchValue_31 = Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), p2_10([void 0, s_63]));
      if (matchValue_31.tag === 0) {
        const state_99 = matchValue_31.fields[0][2];
        const s_64 = matchValue_31.fields[0][1];
        const r2_2 = matchValue_31.fields[0][0];
        return new FSharpResult$2(0, [r2_2, s_64, void 0]);
      } else {
        const e_7 = matchValue_31.fields[0];
        return new FSharpResult$2(1, e_7);
      }
    } else {
      const e_6 = matchValue_30.fields[0];
      return new FSharpResult$2(1, e_6);
    }
  }), (tupledArg_43) => {
    const matchValue_32 = Result_MapError((tupledArg_44) => ParseError_sort(tupledArg_44[0], void 0), p_30([void 0, tupledArg_43[1]]));
    if (matchValue_32.tag === 0) {
      const state_103 = matchValue_32.fields[0][2];
      const s_67 = matchValue_32.fields[0][1];
      const r_2 = matchValue_32.fields[0][0];
      return new FSharpResult$2(0, [[2, r_2], s_67, void 0]);
    } else {
      const e_8 = matchValue_32.fields[0];
      return new FSharpResult$2(1, e_8);
    }
  }), (p_37 = (p_33 = (tupledArg_45) => {
    let this$_25, this$_26, start_19, finish_19, len_9, line_9, column_9, this$_27;
    const label_4 = "[0-9]";
    const s_70 = tupledArg_45[1];
    let matchValue_33;
    const this$_24 = s_70;
    const index_3 = 0;
    matchValue_33 = (index_3 < 0 ? true : index_3 >= this$_24.length) ? "\uFFFF" : this$_24.underlying[this$_24.startIndex + index_3];
    if (matchValue_33 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_25 = s_70, new Position(this$_25.startLine, this$_25.startColumn)), ofArray([new ErrorType(0, label_4), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_14 = matchValue_33;
      if (isDigit(c_14)) {
        return new FSharpResult$2(0, [c_14, (this$_26 = s_70, start_19 = defaultArg(1, 0) | 0, finish_19 = defaultArg(void 0, this$_26.length - 1) | 0, start_19 >= 0 && start_19 <= this$_26.length && finish_19 < max((x_27, y_18) => comparePrimitives(x_27, y_18), start_19, this$_26.length) ? (len_9 = max((x_28, y_19) => comparePrimitives(x_28, y_19), 0, finish_19 - start_19 + 1) | 0, line_9 = this$_26.startLine, column_9 = this$_26.startColumn, (() => {
          for (let i_13 = 0; i_13 <= start_19 - 1; i_13++) {
            if (this$_26.underlying[this$_26.startIndex + i_13] === "\n") {
              line_9 = line_9 + 1 | 0;
              column_9 = 0;
            } else {
              column_9 = column_9 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_26.startIndex + start_19, len_9, this$_26.underlying, line_9, column_9)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_27 = s_70, new Position(this$_27.startLine, this$_27.startColumn)), ofArray([new ErrorType(0, label_4), new ErrorType(1, c_14)])]), void 0]);
      }
    }
  }, (tupledArg_46) => {
    const s_72 = tupledArg_46[1];
    const matchValue_35 = Result_MapError((tupledArg_47) => ParseError_sort(tupledArg_47[0], void 0), p_33([void 0, s_72]));
    if (matchValue_35.tag === 0) {
      const state_113 = matchValue_35.fields[0][2];
      const s_73 = matchValue_35.fields[0][1];
      const c1_3 = matchValue_35.fields[0][0];
      const sb_9 = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb_9, c1_3);
      const go_3 = (tupledArg_48_mut) => {
        go_3:
          while (true) {
            const tupledArg_48 = tupledArg_48_mut;
            const state_114 = tupledArg_48[0];
            const s_74 = tupledArg_48[1];
            const matchValue_36 = Result_MapError((tupledArg_49) => ParseError_sort(tupledArg_49[0], void 0), p_33([void 0, s_74]));
            if (matchValue_36.tag === 0) {
              const state_116 = matchValue_36.fields[0][2];
              const s_75 = matchValue_36.fields[0][1];
              const c_16 = matchValue_36.fields[0][0];
              CharParsers_StringBuilder__Append_Z721C83C5(sb_9, c_16);
              tupledArg_48_mut = [void 0, s_75];
              continue go_3;
            } else {
              return new FSharpResult$2(0, [toString2(sb_9), s_74, void 0]);
            }
            break;
          }
      };
      return go_3([void 0, s_73]);
    } else {
      const state_112 = matchValue_35.fields[0][1];
      const es_6 = matchValue_35.fields[0][0];
      return new FSharpResult$2(1, [es_6, void 0]);
    }
  }), (tupledArg_50) => {
    const matchValue_37 = Result_MapError((tupledArg_51) => ParseError_sort(tupledArg_51[0], void 0), p_37([void 0, tupledArg_50[1]]));
    if (matchValue_37.tag === 0) {
      const state_120 = matchValue_37.fields[0][2];
      const s_78 = matchValue_37.fields[0][1];
      const r_3 = matchValue_37.fields[0][0];
      return new FSharpResult$2(0, [[10, r_3], s_78, void 0]);
    } else {
      const e_9 = matchValue_37.fields[0];
      return new FSharpResult$2(1, e_9);
    }
  })]);
  return (tupledArg_52) => {
    const s_80 = tupledArg_52[1];
    const go_4 = (state_123_mut, _arg1_1_mut) => {
      let this$_29, this$_28;
      go_4:
        while (true) {
          const state_123 = state_123_mut, _arg1_1 = _arg1_1_mut;
          if (!isEmpty(_arg1_1)) {
            if (isEmpty(tail(_arg1_1))) {
              const p_40 = head(_arg1_1);
              const matchValue_38 = Result_MapError((tupledArg_53) => ParseError_sort(tupledArg_53[0], tupledArg_53[1]), p_40([state_123, s_80]));
              if (matchValue_38.tag === 1) {
                const state_126 = matchValue_38.fields[0][1];
                return new FSharpResult$2(1, [singleton([(this$_29 = s_80, new Position(this$_29.startLine, this$_29.startColumn)), singleton(new ErrorType(0, "unsigned integer"))]), state_126]);
              } else {
                const x_30 = matchValue_38;
                return x_30;
              }
            } else {
              const p_42 = head(_arg1_1);
              const ps_2 = tail(_arg1_1);
              const matchValue_39 = Result_MapError((tupledArg_54) => ParseError_sort(tupledArg_54[0], tupledArg_54[1]), p_42([state_123, s_80]));
              if (matchValue_39.tag === 1) {
                const state_128 = matchValue_39.fields[0][1];
                state_123_mut = state_128;
                _arg1_1_mut = ps_2;
                continue go_4;
              } else {
                const x_31 = matchValue_39;
                return x_31;
              }
            }
          } else {
            return new FSharpResult$2(1, [singleton([(this$_28 = s_80, new Position(this$_28.startLine, this$_28.startColumn)), singleton(new ErrorType(2, "No parsers given"))]), state_123]);
          }
          break;
        }
    };
    return go_4(void 0, ps);
  };
})();
function CharParsers_pfloat(state, s) {
  let this$;
  const matchValue = Result_MapError((tupledArg) => ParseError_sort(tupledArg[0], void 0), CharParsers_Internal_pfloatUnit([void 0, s]));
  if (matchValue.tag === 0) {
    const x = matchValue.fields[0][0];
    const s_1 = matchValue.fields[0][1];
    try {
      return new FSharpResult$2(0, [parse2(x), s_1, state]);
    } catch (matchValue_1) {
      return new FSharpResult$2(1, [singleton([(this$ = s_1, new Position(this$.startLine, this$.startColumn)), singleton(new ErrorType(2, "value was too large and too small."))]), state]);
    }
  } else {
    const es = matchValue.fields[0][0];
    return new FSharpResult$2(1, [es, state]);
  }
}
var Tests_ISO8601DateTime_iso8601_full_date = (tupledArg_20) => {
  let s_35, matchValue_13, matchValue_11, len_2, result, go, state_38, s_32, r1, matchValue_12, len_8, result_6, go_2, state_40, s_33, r2_1, e_6, e_5, state_44, this$_12, x_6, _arg1, testExpr, year, month, day;
  const matchValue_14 = Result_MapError((tupledArg_21) => ParseError_sort(tupledArg_21[0], void 0), (s_35 = tupledArg_20[1], matchValue_13 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (matchValue_11 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (len_2 = 4, result = fill(new Array(len_2), 0, len_2, ""), go = (i_2_mut, tupledArg_2_mut) => {
    let label, s_2, matchValue, this$, index, this$_1, c, this$_2, start_1, finish_1, len_1, line, column, this$_3;
    go:
      while (true) {
        const i_2 = i_2_mut, tupledArg_2 = tupledArg_2_mut;
        const state_7 = tupledArg_2[0];
        const s_5 = tupledArg_2[1];
        if (i_2 === len_2) {
          return new FSharpResult$2(0, [result, s_5, void 0]);
        } else {
          const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), (label = "[0-9]", s_2 = s_5, matchValue = (this$ = s_2, index = 0, (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index]), matchValue === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_1 = s_2, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]) : (c = matchValue, isDigit(c) ? new FSharpResult$2(0, [c, (this$_2 = s_2, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len_1 = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
            for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
              if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                line = line + 1 | 0;
                column = 0;
              } else {
                column = column + 1 | 0;
              }
            }
          })(), new StringSegment(this$_2.startIndex + start_1, len_1, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_2, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c)])]), void 0]))));
          if (matchValue_2.tag === 0) {
            const state_9 = matchValue_2.fields[0][2];
            const s_6 = matchValue_2.fields[0][1];
            const r = matchValue_2.fields[0][0];
            result[i_2] = r;
            i_2_mut = i_2 + 1;
            tupledArg_2_mut = [void 0, s_6];
            continue go;
          } else {
            const e = matchValue_2.fields[0];
            return new FSharpResult$2(1, e);
          }
        }
        break;
      }
  }, go(0, [void 0, s_35]))), matchValue_11.tag === 0 ? (state_38 = matchValue_11.fields[0][2], s_32 = matchValue_11.fields[0][1], r1 = matchValue_11.fields[0][0], matchValue_12 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), (len_8 = 2, result_6 = fill(new Array(len_8), 0, len_8, null), go_2 = (i_8_mut, tupledArg_13_mut) => {
    let matchValue_8, c_2, s_8, matchValue_3, this$_4, index_1, this$_5, head2, this$_6, start_3, finish_3, len_4, line_1, column_1, this$_7, state_27, s_24, matchValue_9, len_7, result_2, go_1, state_29, s_25, r2, e_3, e_2;
    go_2:
      while (true) {
        const i_8 = i_8_mut, tupledArg_13 = tupledArg_13_mut;
        const state_32 = tupledArg_13[0];
        const s_28 = tupledArg_13[1];
        if (i_8 === len_8) {
          return new FSharpResult$2(0, [result_6, s_28, void 0]);
        } else {
          const matchValue_10 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), (matchValue_8 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), (c_2 = "-", s_8 = s_28, matchValue_3 = (this$_4 = s_8, index_1 = 0, (index_1 < 0 ? true : index_1 >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index_1]), matchValue_3 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_5 = s_8, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, "'" + c_2 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head2 = matchValue_3, head2 === c_2 ? new FSharpResult$2(0, [void 0, (this$_6 = s_8, start_3 = defaultArg(1, 0) | 0, finish_3 = defaultArg(void 0, this$_6.length - 1) | 0, start_3 >= 0 && start_3 <= this$_6.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length) ? (len_4 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_6.startLine, column_1 = this$_6.startColumn, (() => {
            for (let i_4 = 0; i_4 <= start_3 - 1; i_4++) {
              if (this$_6.underlying[this$_6.startIndex + i_4] === "\n") {
                line_1 = line_1 + 1 | 0;
                column_1 = 0;
              } else {
                column_1 = column_1 + 1 | 0;
              }
            }
          })(), new StringSegment(this$_6.startIndex + start_3, len_4, this$_6.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_8, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, "'" + c_2 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0])))), matchValue_8.tag === 0 ? (state_27 = matchValue_8.fields[0][2], s_24 = matchValue_8.fields[0][1], matchValue_9 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), (len_7 = 2, result_2 = fill(new Array(len_7), 0, len_7, ""), go_1 = (i_7_mut, tupledArg_7_mut) => {
            let label_1, s_17, matchValue_5, this$_8, index_2, this$_9, c_3, this$_10, start_5, finish_5, len_6, line_2, column_2, this$_11;
            go_1:
              while (true) {
                const i_7 = i_7_mut, tupledArg_7 = tupledArg_7_mut;
                const state_21 = tupledArg_7[0];
                const s_20 = tupledArg_7[1];
                if (i_7 === len_7) {
                  return new FSharpResult$2(0, [result_2, s_20, void 0]);
                } else {
                  const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (label_1 = "[0-9]", s_17 = s_20, matchValue_5 = (this$_8 = s_17, index_2 = 0, (index_2 < 0 ? true : index_2 >= this$_8.length) ? "\uFFFF" : this$_8.underlying[this$_8.startIndex + index_2]), matchValue_5 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_9 = s_17, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]) : (c_3 = matchValue_5, isDigit(c_3) ? new FSharpResult$2(0, [c_3, (this$_10 = s_17, start_5 = defaultArg(1, 0) | 0, finish_5 = defaultArg(void 0, this$_10.length - 1) | 0, start_5 >= 0 && start_5 <= this$_10.length && finish_5 < max((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_10.length) ? (len_6 = max((x_5, y_5) => comparePrimitives(x_5, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_10.startLine, column_2 = this$_10.startColumn, (() => {
                    for (let i_6 = 0; i_6 <= start_5 - 1; i_6++) {
                      if (this$_10.underlying[this$_10.startIndex + i_6] === "\n") {
                        line_2 = line_2 + 1 | 0;
                        column_2 = 0;
                      } else {
                        column_2 = column_2 + 1 | 0;
                      }
                    }
                  })(), new StringSegment(this$_10.startIndex + start_5, len_6, this$_10.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), void 0]) : new FSharpResult$2(1, [singleton([(this$_11 = s_17, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_3)])]), void 0]))));
                  if (matchValue_7.tag === 0) {
                    const state_23 = matchValue_7.fields[0][2];
                    const s_21 = matchValue_7.fields[0][1];
                    const r_1 = matchValue_7.fields[0][0];
                    result_2[i_7] = r_1;
                    i_7_mut = i_7 + 1;
                    tupledArg_7_mut = [void 0, s_21];
                    continue go_1;
                  } else {
                    const e_1 = matchValue_7.fields[0];
                    return new FSharpResult$2(1, e_1);
                  }
                }
                break;
              }
          }, go_1(0, [void 0, s_24]))), matchValue_9.tag === 0 ? (state_29 = matchValue_9.fields[0][2], s_25 = matchValue_9.fields[0][1], r2 = matchValue_9.fields[0][0], new FSharpResult$2(0, [r2, s_25, void 0])) : (e_3 = matchValue_9.fields[0], new FSharpResult$2(1, e_3))) : (e_2 = matchValue_8.fields[0], new FSharpResult$2(1, e_2))));
          if (matchValue_10.tag === 0) {
            const state_34 = matchValue_10.fields[0][2];
            const s_29 = matchValue_10.fields[0][1];
            const r_2 = matchValue_10.fields[0][0];
            result_6[i_8] = r_2;
            i_8_mut = i_8 + 1;
            tupledArg_13_mut = [void 0, s_29];
            continue go_2;
          } else {
            const e_4 = matchValue_10.fields[0];
            return new FSharpResult$2(1, e_4);
          }
        }
        break;
      }
  }, go_2(0, [void 0, s_32]))), matchValue_12.tag === 0 ? (state_40 = matchValue_12.fields[0][2], s_33 = matchValue_12.fields[0][1], r2_1 = matchValue_12.fields[0][0], new FSharpResult$2(0, [[r1, r2_1], s_33, void 0])) : (e_6 = matchValue_12.fields[0], new FSharpResult$2(1, e_6))) : (e_5 = matchValue_11.fields[0], new FSharpResult$2(1, e_5)))), matchValue_13.tag === 1 ? (state_44 = matchValue_13.fields[0][1], new FSharpResult$2(1, [singleton([(this$_12 = s_35, new Position(this$_12.startLine, this$_12.startColumn)), singleton(new ErrorType(0, "ISO8601 Full Date"))]), void 0])) : (x_6 = matchValue_13, x_6)));
  if (matchValue_14.tag === 0) {
    const state_49 = matchValue_14.fields[0][2];
    const s_38 = matchValue_14.fields[0][1];
    const r_3 = matchValue_14.fields[0][0];
    return new FSharpResult$2(0, [(_arg1 = r_3, (testExpr = _arg1[1], !equalsWith((x_7, y_6) => equalsWith((x_8, y_7) => x_8 === y_7, x_7, y_6), testExpr, null) && testExpr.length === 2) ? (year = _arg1[0], month = _arg1[1][0], day = _arg1[1][1], [parse(join("", year), 511, false, 32), parse(join("", month), 511, false, 32), parse(join("", day), 511, false, 32)]) : (() => {
      throw new Error("impossible");
    })()), s_38, void 0]);
  } else {
    const e_7 = matchValue_14.fields[0];
    return new FSharpResult$2(1, e_7);
  }
};
var Tests_ISO8601DateTime_iso8601_partial_time = (() => {
  let p_27;
  let p_24;
  let p2_6;
  let p_19;
  let p2_4;
  const resultForEmptySequence = void 0;
  const p_14 = (tupledArg_19) => {
    let this$_17, this$_18, start_9, finish_9, len_10, line_4, column_4, this$_19;
    const label_2 = "[0-9]";
    const s_44 = tupledArg_19[1];
    let matchValue_15;
    const this$_16 = s_44;
    const index_4 = 0;
    matchValue_15 = (index_4 < 0 ? true : index_4 >= this$_16.length) ? "\uFFFF" : this$_16.underlying[this$_16.startIndex + index_4];
    if (matchValue_15 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_17 = s_44, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_6 = matchValue_15;
      if (isDigit(c_6)) {
        return new FSharpResult$2(0, [c_6, (this$_18 = s_44, start_9 = defaultArg(1, 0) | 0, finish_9 = defaultArg(void 0, this$_18.length - 1) | 0, start_9 >= 0 && start_9 <= this$_18.length && finish_9 < max((x_8, y_8) => comparePrimitives(x_8, y_8), start_9, this$_18.length) ? (len_10 = max((x_9, y_9) => comparePrimitives(x_9, y_9), 0, finish_9 - start_9 + 1) | 0, line_4 = this$_18.startLine, column_4 = this$_18.startColumn, (() => {
          for (let i_12 = 0; i_12 <= start_9 - 1; i_12++) {
            if (this$_18.underlying[this$_18.startIndex + i_12] === "\n") {
              line_4 = line_4 + 1 | 0;
              column_4 = 0;
            } else {
              column_4 = column_4 + 1 | 0;
            }
          }
        })(), new StringSegment(this$_18.startIndex + start_9, len_10, this$_18.underlying, line_4, column_4)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)), void 0]);
      } else {
        return new FSharpResult$2(1, [singleton([(this$_19 = s_44, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, c_6)])]), void 0]);
      }
    }
  };
  const fp = defaultArg(void 0, p_14);
  const go_3 = (acc_mut, tupledArg_20_mut) => {
    go_3:
      while (true) {
        const acc = acc_mut, tupledArg_20 = tupledArg_20_mut;
        const state_50 = tupledArg_20[0];
        const s_45 = tupledArg_20[1];
        const matchValue_17 = Result_MapError((tupledArg_21) => ParseError_sort(tupledArg_21[0], void 0), p_14([void 0, s_45]));
        if (matchValue_17.tag === 0) {
          const state_53 = matchValue_17.fields[0][2];
          const s_46 = matchValue_17.fields[0][1];
          const r_3 = matchValue_17.fields[0][0];
          acc_mut = cons(r_3, acc);
          tupledArg_20_mut = [void 0, s_46];
          continue go_3;
        } else {
          const state_52 = matchValue_17.fields[0][1];
          return new FSharpResult$2(0, [reverse(acc), s_45, void 0]);
        }
        break;
      }
  };
  p2_4 = (tupledArg_22) => {
    let f;
    const state_54 = tupledArg_22[0];
    const s_47 = tupledArg_22[1];
    const matchValue_18 = Result_MapError((tupledArg_23) => ParseError_sort(tupledArg_23[0], void 0), fp([void 0, s_47]));
    if (matchValue_18.tag === 0) {
      const state_57 = matchValue_18.fields[0][2];
      const s_48 = matchValue_18.fields[0][1];
      const r_4 = matchValue_18.fields[0][0];
      const r_5 = singleton(r_4);
      return go_3(r_5, [void 0, s_48]);
    } else {
      const state_56 = matchValue_18.fields[0][1];
      const es = matchValue_18.fields[0][0];
      return resultForEmptySequence == null ? new FSharpResult$2(1, [es, void 0]) : new FSharpResult$2(0, [resultForEmptySequence == null ? null : (f = resultForEmptySequence, f()), s_47, void 0]);
    }
  };
  p_19 = (tupledArg_24) => {
    let c_5, s_35, matchValue_13, this$_12, index_3, this$_13, head_1, this$_14, start_7, finish_7, len_9, line_3, column_3, this$_15;
    const matchValue_19 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), (c_5 = ".", s_35 = tupledArg_24[1], matchValue_13 = (this$_12 = s_35, index_3 = 0, (index_3 < 0 ? true : index_3 >= this$_12.length) ? "\uFFFF" : this$_12.underlying[this$_12.startIndex + index_3]), matchValue_13 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_13 = s_35, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, "'" + c_5 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head_1 = matchValue_13, head_1 === c_5 ? new FSharpResult$2(0, [void 0, (this$_14 = s_35, start_7 = defaultArg(1, 0) | 0, finish_7 = defaultArg(void 0, this$_14.length - 1) | 0, start_7 >= 0 && start_7 <= this$_14.length && finish_7 < max((x_6, y_6) => comparePrimitives(x_6, y_6), start_7, this$_14.length) ? (len_9 = max((x_7, y_7) => comparePrimitives(x_7, y_7), 0, finish_7 - start_7 + 1) | 0, line_3 = this$_14.startLine, column_3 = this$_14.startColumn, (() => {
      for (let i_10 = 0; i_10 <= start_7 - 1; i_10++) {
        if (this$_14.underlying[this$_14.startIndex + i_10] === "\n") {
          line_3 = line_3 + 1 | 0;
          column_3 = 0;
        } else {
          column_3 = column_3 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_14.startIndex + start_7, len_9, this$_14.underlying, line_3, column_3)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)), void 0]) : new FSharpResult$2(1, [singleton([(this$_15 = s_35, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, "'" + c_5 + "'"), new ErrorType(1, "'" + head_1 + "'")])]), void 0]))));
    if (matchValue_19.tag === 0) {
      const state_61 = matchValue_19.fields[0][2];
      const s_51 = matchValue_19.fields[0][1];
      const matchValue_20 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), p2_4([void 0, s_51]));
      if (matchValue_20.tag === 0) {
        const state_63 = matchValue_20.fields[0][2];
        const s_52 = matchValue_20.fields[0][1];
        const r2_2 = matchValue_20.fields[0][0];
        return new FSharpResult$2(0, [r2_2, s_52, void 0]);
      } else {
        const e_8 = matchValue_20.fields[0];
        return new FSharpResult$2(1, e_8);
      }
    } else {
      const e_7 = matchValue_19.fields[0];
      return new FSharpResult$2(1, e_7);
    }
  };
  p2_6 = (tupledArg_27) => {
    const s_54 = tupledArg_27[1];
    const matchValue_21 = Result_MapError((tupledArg_28) => ParseError_sort(tupledArg_28[0], void 0), p_19([void 0, s_54]));
    if (matchValue_21.tag === 1) {
      const state_68 = matchValue_21.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_54, void 0]);
    } else {
      const state_67 = matchValue_21.fields[0][2];
      const s_55 = matchValue_21.fields[0][1];
      const r_6 = matchValue_21.fields[0][0];
      return new FSharpResult$2(0, [r_6, s_55, void 0]);
    }
  };
  p_24 = (tupledArg_29) => {
    let matchValue_11, len_2, result, go, state_38, s_32, r1, matchValue_12, len_8, result_6, go_2, state_40, s_33, r2_1, e_6, e_5;
    const matchValue_22 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), (matchValue_11 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (len_2 = 2, result = fill(new Array(len_2), 0, len_2, ""), go = (i_2_mut, tupledArg_2_mut) => {
      let label, s_2, matchValue, this$, index, this$_1, c, this$_2, start_1, finish_1, len_1, line, column, this$_3;
      go:
        while (true) {
          const i_2 = i_2_mut, tupledArg_2 = tupledArg_2_mut;
          const state_7 = tupledArg_2[0];
          const s_5 = tupledArg_2[1];
          if (i_2 === len_2) {
            return new FSharpResult$2(0, [result, s_5, void 0]);
          } else {
            const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), (label = "[0-9]", s_2 = s_5, matchValue = (this$ = s_2, index = 0, (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index]), matchValue === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_1 = s_2, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]) : (c = matchValue, isDigit(c) ? new FSharpResult$2(0, [c, (this$_2 = s_2, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len_1 = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
              for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
                if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                  line = line + 1 | 0;
                  column = 0;
                } else {
                  column = column + 1 | 0;
                }
              }
            })(), new StringSegment(this$_2.startIndex + start_1, len_1, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_2, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c)])]), void 0]))));
            if (matchValue_2.tag === 0) {
              const state_9 = matchValue_2.fields[0][2];
              const s_6 = matchValue_2.fields[0][1];
              const r = matchValue_2.fields[0][0];
              result[i_2] = r;
              i_2_mut = i_2 + 1;
              tupledArg_2_mut = [void 0, s_6];
              continue go;
            } else {
              const e = matchValue_2.fields[0];
              return new FSharpResult$2(1, e);
            }
          }
          break;
        }
    }, go(0, [void 0, tupledArg_29[1]]))), matchValue_11.tag === 0 ? (state_38 = matchValue_11.fields[0][2], s_32 = matchValue_11.fields[0][1], r1 = matchValue_11.fields[0][0], matchValue_12 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), (len_8 = 2, result_6 = fill(new Array(len_8), 0, len_8, null), go_2 = (i_8_mut, tupledArg_13_mut) => {
      let matchValue_8, c_2, s_8, matchValue_3, this$_4, index_1, this$_5, head2, this$_6, start_3, finish_3, len_4, line_1, column_1, this$_7, state_27, s_24, matchValue_9, len_7, result_2, go_1, state_29, s_25, r2, e_3, e_2;
      go_2:
        while (true) {
          const i_8 = i_8_mut, tupledArg_13 = tupledArg_13_mut;
          const state_32 = tupledArg_13[0];
          const s_28 = tupledArg_13[1];
          if (i_8 === len_8) {
            return new FSharpResult$2(0, [result_6, s_28, void 0]);
          } else {
            const matchValue_10 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), (matchValue_8 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), (c_2 = ":", s_8 = s_28, matchValue_3 = (this$_4 = s_8, index_1 = 0, (index_1 < 0 ? true : index_1 >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index_1]), matchValue_3 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_5 = s_8, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, "'" + c_2 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head2 = matchValue_3, head2 === c_2 ? new FSharpResult$2(0, [void 0, (this$_6 = s_8, start_3 = defaultArg(1, 0) | 0, finish_3 = defaultArg(void 0, this$_6.length - 1) | 0, start_3 >= 0 && start_3 <= this$_6.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length) ? (len_4 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_6.startLine, column_1 = this$_6.startColumn, (() => {
              for (let i_4 = 0; i_4 <= start_3 - 1; i_4++) {
                if (this$_6.underlying[this$_6.startIndex + i_4] === "\n") {
                  line_1 = line_1 + 1 | 0;
                  column_1 = 0;
                } else {
                  column_1 = column_1 + 1 | 0;
                }
              }
            })(), new StringSegment(this$_6.startIndex + start_3, len_4, this$_6.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_8, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, "'" + c_2 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0])))), matchValue_8.tag === 0 ? (state_27 = matchValue_8.fields[0][2], s_24 = matchValue_8.fields[0][1], matchValue_9 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), (len_7 = 2, result_2 = fill(new Array(len_7), 0, len_7, ""), go_1 = (i_7_mut, tupledArg_7_mut) => {
              let label_1, s_17, matchValue_5, this$_8, index_2, this$_9, c_3, this$_10, start_5, finish_5, len_6, line_2, column_2, this$_11;
              go_1:
                while (true) {
                  const i_7 = i_7_mut, tupledArg_7 = tupledArg_7_mut;
                  const state_21 = tupledArg_7[0];
                  const s_20 = tupledArg_7[1];
                  if (i_7 === len_7) {
                    return new FSharpResult$2(0, [result_2, s_20, void 0]);
                  } else {
                    const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (label_1 = "[0-9]", s_17 = s_20, matchValue_5 = (this$_8 = s_17, index_2 = 0, (index_2 < 0 ? true : index_2 >= this$_8.length) ? "\uFFFF" : this$_8.underlying[this$_8.startIndex + index_2]), matchValue_5 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_9 = s_17, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]) : (c_3 = matchValue_5, isDigit(c_3) ? new FSharpResult$2(0, [c_3, (this$_10 = s_17, start_5 = defaultArg(1, 0) | 0, finish_5 = defaultArg(void 0, this$_10.length - 1) | 0, start_5 >= 0 && start_5 <= this$_10.length && finish_5 < max((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_10.length) ? (len_6 = max((x_5, y_5) => comparePrimitives(x_5, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_10.startLine, column_2 = this$_10.startColumn, (() => {
                      for (let i_6 = 0; i_6 <= start_5 - 1; i_6++) {
                        if (this$_10.underlying[this$_10.startIndex + i_6] === "\n") {
                          line_2 = line_2 + 1 | 0;
                          column_2 = 0;
                        } else {
                          column_2 = column_2 + 1 | 0;
                        }
                      }
                    })(), new StringSegment(this$_10.startIndex + start_5, len_6, this$_10.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), void 0]) : new FSharpResult$2(1, [singleton([(this$_11 = s_17, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_3)])]), void 0]))));
                    if (matchValue_7.tag === 0) {
                      const state_23 = matchValue_7.fields[0][2];
                      const s_21 = matchValue_7.fields[0][1];
                      const r_1 = matchValue_7.fields[0][0];
                      result_2[i_7] = r_1;
                      i_7_mut = i_7 + 1;
                      tupledArg_7_mut = [void 0, s_21];
                      continue go_1;
                    } else {
                      const e_1 = matchValue_7.fields[0];
                      return new FSharpResult$2(1, e_1);
                    }
                  }
                  break;
                }
            }, go_1(0, [void 0, s_24]))), matchValue_9.tag === 0 ? (state_29 = matchValue_9.fields[0][2], s_25 = matchValue_9.fields[0][1], r2 = matchValue_9.fields[0][0], new FSharpResult$2(0, [r2, s_25, void 0])) : (e_3 = matchValue_9.fields[0], new FSharpResult$2(1, e_3))) : (e_2 = matchValue_8.fields[0], new FSharpResult$2(1, e_2))));
            if (matchValue_10.tag === 0) {
              const state_34 = matchValue_10.fields[0][2];
              const s_29 = matchValue_10.fields[0][1];
              const r_2 = matchValue_10.fields[0][0];
              result_6[i_8] = r_2;
              i_8_mut = i_8 + 1;
              tupledArg_13_mut = [void 0, s_29];
              continue go_2;
            } else {
              const e_4 = matchValue_10.fields[0];
              return new FSharpResult$2(1, e_4);
            }
          }
          break;
        }
    }, go_2(0, [void 0, s_32]))), matchValue_12.tag === 0 ? (state_40 = matchValue_12.fields[0][2], s_33 = matchValue_12.fields[0][1], r2_1 = matchValue_12.fields[0][0], new FSharpResult$2(0, [[r1, r2_1], s_33, void 0])) : (e_6 = matchValue_12.fields[0], new FSharpResult$2(1, e_6))) : (e_5 = matchValue_11.fields[0], new FSharpResult$2(1, e_5))));
    if (matchValue_22.tag === 0) {
      const state_72 = matchValue_22.fields[0][2];
      const s_58 = matchValue_22.fields[0][1];
      const r1_1 = matchValue_22.fields[0][0];
      const matchValue_23 = Result_MapError((tupledArg_31) => ParseError_sort(tupledArg_31[0], void 0), p2_6([void 0, s_58]));
      if (matchValue_23.tag === 0) {
        const state_74 = matchValue_23.fields[0][2];
        const s_59 = matchValue_23.fields[0][1];
        const r2_3 = matchValue_23.fields[0][0];
        return new FSharpResult$2(0, [[r1_1, r2_3], s_59, void 0]);
      } else {
        const e_10 = matchValue_23.fields[0];
        return new FSharpResult$2(1, e_10);
      }
    } else {
      const e_9 = matchValue_22.fields[0];
      return new FSharpResult$2(1, e_9);
    }
  };
  p_27 = (tupledArg_32) => {
    let this$_20;
    const s_61 = tupledArg_32[1];
    const matchValue_24 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), p_24([void 0, s_61]));
    if (matchValue_24.tag === 1) {
      const state_78 = matchValue_24.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_20 = s_61, new Position(this$_20.startLine, this$_20.startColumn)), singleton(new ErrorType(0, "ISO8601 Partial Time"))]), void 0]);
    } else {
      const x_12 = matchValue_24;
      return x_12;
    }
  };
  return (tupledArg_34) => {
    let _arg1, testExpr, second, secfrac, minute, hour;
    const matchValue_25 = Result_MapError((tupledArg_35) => ParseError_sort(tupledArg_35[0], void 0), p_27([void 0, tupledArg_34[1]]));
    if (matchValue_25.tag === 0) {
      const state_83 = matchValue_25.fields[0][2];
      const s_64 = matchValue_25.fields[0][1];
      const r_7 = matchValue_25.fields[0][0];
      return new FSharpResult$2(0, [(_arg1 = r_7, (testExpr = _arg1[0][1], !equalsWith((x_13, y_10) => equalsWith((x_14, y_11) => x_14 === y_11, x_13, y_10), testExpr, null) && testExpr.length === 2) ? (second = _arg1[0][1][1], secfrac = _arg1[1], minute = _arg1[0][1][0], hour = _arg1[0][0], [parse(join("", hour), 511, false, 32), parse(join("", minute), 511, false, 32), parse(join("", second), 511, false, 32), defaultArg(map((xs_11) => parse(join("", length(xs_11) > 3 ? take(3, xs_11) : xs_11), 511, false, 32), secfrac), 0)]) : (() => {
        throw new Error("impossible");
      })()), s_64, void 0]);
    } else {
      const e_11 = matchValue_25.fields[0];
      return new FSharpResult$2(1, e_11);
    }
  };
})();
var Tests_ISO8601DateTime_iso8601_offset = (() => {
  const sign = (tupledArg_6) => {
    let matchValue_2, c_1, s_1, matchValue, this$, index, this$_1, head2, this$_2, start_1, finish_1, len, line, column, this$_3, state_7, s_10, e, matchValue_5, c_3, s_12, matchValue_3, this$_4, index_1, this$_5, head_1, this$_6, start_3, finish_3, len_1, line_1, column_1, this$_7, state_15, s_21, e_1;
    const s_23 = tupledArg_6[1];
    const matchValue_6 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (matchValue_2 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), (c_1 = "+", s_1 = s_23, matchValue = (this$ = s_1, index = 0, (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index]), matchValue === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head2 = matchValue, head2 === c_1 ? new FSharpResult$2(0, [void 0, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
      for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0])))), matchValue_2.tag === 0 ? (state_7 = matchValue_2.fields[0][2], s_10 = matchValue_2.fields[0][1], new FSharpResult$2(0, [true, s_10, void 0])) : (e = matchValue_2.fields[0], new FSharpResult$2(1, e))));
    if (matchValue_6.tag === 1) {
      const state_19 = matchValue_6.fields[0][1];
      const es = matchValue_6.fields[0][0];
      const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (matchValue_5 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), (c_3 = "-", s_12 = s_23, matchValue_3 = (this$_4 = s_12, index_1 = 0, (index_1 < 0 ? true : index_1 >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index_1]), matchValue_3 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_5 = s_12, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head_1 = matchValue_3, head_1 === c_3 ? new FSharpResult$2(0, [void 0, (this$_6 = s_12, start_3 = defaultArg(1, 0) | 0, finish_3 = defaultArg(void 0, this$_6.length - 1) | 0, start_3 >= 0 && start_3 <= this$_6.length && finish_3 < max((x_4, y_2) => comparePrimitives(x_4, y_2), start_3, this$_6.length) ? (len_1 = max((x_5, y_3) => comparePrimitives(x_5, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_6.startLine, column_1 = this$_6.startColumn, (() => {
        for (let i_3 = 0; i_3 <= start_3 - 1; i_3++) {
          if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
            line_1 = line_1 + 1 | 0;
            column_1 = 0;
          } else {
            column_1 = column_1 + 1 | 0;
          }
        }
      })(), new StringSegment(this$_6.startIndex + start_3, len_1, this$_6.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_12, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "'" + head_1 + "'")])]), void 0])))), matchValue_5.tag === 0 ? (state_15 = matchValue_5.fields[0][2], s_21 = matchValue_5.fields[0][1], new FSharpResult$2(0, [false, s_21, void 0])) : (e_1 = matchValue_5.fields[0], new FSharpResult$2(1, e_1))));
      if (matchValue_7.tag === 1) {
        const state_21 = matchValue_7.fields[0][1];
        const es$0027 = matchValue_7.fields[0][0];
        return new FSharpResult$2(1, [append(es, es$0027), void 0]);
      } else {
        const x_9 = matchValue_7;
        return x_9;
      }
    } else {
      const x_8 = matchValue_6;
      return x_8;
    }
  };
  const numoffset = (tupledArg_28) => {
    let matchValue_20, matchValue_15, matchValue_11, state_35, s_33, r1, matchValue_12, len_4, result_4, go, state_37, s_34, r2, e_4, e_3, state_45, s_45, r1_1, matchValue_16, c_6, s_36, matchValue_13, this$_12, index_3, this$_13, head_2, this$_14, start_7, finish_7, len_5, line_3, column_3, this$_15, state_47, s_46, e_6, e_5, state_61, s_56, r1_2, matchValue_21, len_8, result_10, go_1, state_63, s_57, r2_1, e_9, e_8, tupledArg_27, _arg1, second, sign_1, minute;
    const matchValue_22 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), (matchValue_20 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), (matchValue_15 = Result_MapError((tupledArg_18) => ParseError_sort(tupledArg_18[0], void 0), (matchValue_11 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), sign([void 0, tupledArg_28[1]])), matchValue_11.tag === 0 ? (state_35 = matchValue_11.fields[0][2], s_33 = matchValue_11.fields[0][1], r1 = matchValue_11.fields[0][0], matchValue_12 = Result_MapError((tupledArg_15) => ParseError_sort(tupledArg_15[0], void 0), (len_4 = 2, result_4 = fill(new Array(len_4), 0, len_4, ""), go = (i_6_mut, tupledArg_11_mut) => {
      let label, s_26, matchValue_8, this$_8, index_2, this$_9, c_4, this$_10, start_5, finish_5, len_3, line_2, column_2, this$_11;
      go:
        while (true) {
          const i_6 = i_6_mut, tupledArg_11 = tupledArg_11_mut;
          const state_29 = tupledArg_11[0];
          const s_29 = tupledArg_11[1];
          if (i_6 === len_4) {
            return new FSharpResult$2(0, [result_4, s_29, void 0]);
          } else {
            const matchValue_10 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), (label = "[0-9]", s_26 = s_29, matchValue_8 = (this$_8 = s_26, index_2 = 0, (index_2 < 0 ? true : index_2 >= this$_8.length) ? "\uFFFF" : this$_8.underlying[this$_8.startIndex + index_2]), matchValue_8 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_9 = s_26, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]) : (c_4 = matchValue_8, isDigit(c_4) ? new FSharpResult$2(0, [c_4, (this$_10 = s_26, start_5 = defaultArg(1, 0) | 0, finish_5 = defaultArg(void 0, this$_10.length - 1) | 0, start_5 >= 0 && start_5 <= this$_10.length && finish_5 < max((x_10, y_4) => comparePrimitives(x_10, y_4), start_5, this$_10.length) ? (len_3 = max((x_11, y_5) => comparePrimitives(x_11, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_10.startLine, column_2 = this$_10.startColumn, (() => {
              for (let i_5 = 0; i_5 <= start_5 - 1; i_5++) {
                if (this$_10.underlying[this$_10.startIndex + i_5] === "\n") {
                  line_2 = line_2 + 1 | 0;
                  column_2 = 0;
                } else {
                  column_2 = column_2 + 1 | 0;
                }
              }
            })(), new StringSegment(this$_10.startIndex + start_5, len_3, this$_10.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), void 0]) : new FSharpResult$2(1, [singleton([(this$_11 = s_26, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c_4)])]), void 0]))));
            if (matchValue_10.tag === 0) {
              const state_31 = matchValue_10.fields[0][2];
              const s_30 = matchValue_10.fields[0][1];
              const r = matchValue_10.fields[0][0];
              result_4[i_6] = r;
              i_6_mut = i_6 + 1;
              tupledArg_11_mut = [void 0, s_30];
              continue go;
            } else {
              const e_2 = matchValue_10.fields[0];
              return new FSharpResult$2(1, e_2);
            }
          }
          break;
        }
    }, go(0, [void 0, s_33]))), matchValue_12.tag === 0 ? (state_37 = matchValue_12.fields[0][2], s_34 = matchValue_12.fields[0][1], r2 = matchValue_12.fields[0][0], new FSharpResult$2(0, [[r1, r2], s_34, void 0])) : (e_4 = matchValue_12.fields[0], new FSharpResult$2(1, e_4))) : (e_3 = matchValue_11.fields[0], new FSharpResult$2(1, e_3)))), matchValue_15.tag === 0 ? (state_45 = matchValue_15.fields[0][2], s_45 = matchValue_15.fields[0][1], r1_1 = matchValue_15.fields[0][0], matchValue_16 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (c_6 = ":", s_36 = s_45, matchValue_13 = (this$_12 = s_36, index_3 = 0, (index_3 < 0 ? true : index_3 >= this$_12.length) ? "\uFFFF" : this$_12.underlying[this$_12.startIndex + index_3]), matchValue_13 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_13 = s_36, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, "'" + c_6 + "'"), new ErrorType(1, "EOF")])]), void 0]) : (head_2 = matchValue_13, head_2 === c_6 ? new FSharpResult$2(0, [void 0, (this$_14 = s_36, start_7 = defaultArg(1, 0) | 0, finish_7 = defaultArg(void 0, this$_14.length - 1) | 0, start_7 >= 0 && start_7 <= this$_14.length && finish_7 < max((x_12, y_6) => comparePrimitives(x_12, y_6), start_7, this$_14.length) ? (len_5 = max((x_13, y_7) => comparePrimitives(x_13, y_7), 0, finish_7 - start_7 + 1) | 0, line_3 = this$_14.startLine, column_3 = this$_14.startColumn, (() => {
      for (let i_8 = 0; i_8 <= start_7 - 1; i_8++) {
        if (this$_14.underlying[this$_14.startIndex + i_8] === "\n") {
          line_3 = line_3 + 1 | 0;
          column_3 = 0;
        } else {
          column_3 = column_3 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_14.startIndex + start_7, len_5, this$_14.underlying, line_3, column_3)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)), void 0]) : new FSharpResult$2(1, [singleton([(this$_15 = s_36, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, "'" + c_6 + "'"), new ErrorType(1, "'" + head_2 + "'")])]), void 0])))), matchValue_16.tag === 0 ? (state_47 = matchValue_16.fields[0][2], s_46 = matchValue_16.fields[0][1], new FSharpResult$2(0, [r1_1, s_46, void 0])) : (e_6 = matchValue_16.fields[0], new FSharpResult$2(1, e_6))) : (e_5 = matchValue_15.fields[0], new FSharpResult$2(1, e_5)))), matchValue_20.tag === 0 ? (state_61 = matchValue_20.fields[0][2], s_56 = matchValue_20.fields[0][1], r1_2 = matchValue_20.fields[0][0], matchValue_21 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), (len_8 = 2, result_10 = fill(new Array(len_8), 0, len_8, ""), go_1 = (i_11_mut, tupledArg_22_mut) => {
      let label_1, s_49, matchValue_17, this$_16, index_4, this$_17, c_7, this$_18, start_9, finish_9, len_7, line_4, column_4, this$_19;
      go_1:
        while (true) {
          const i_11 = i_11_mut, tupledArg_22 = tupledArg_22_mut;
          const state_55 = tupledArg_22[0];
          const s_52 = tupledArg_22[1];
          if (i_11 === len_8) {
            return new FSharpResult$2(0, [result_10, s_52, void 0]);
          } else {
            const matchValue_19 = Result_MapError((tupledArg_23) => ParseError_sort(tupledArg_23[0], void 0), (label_1 = "[0-9]", s_49 = s_52, matchValue_17 = (this$_16 = s_49, index_4 = 0, (index_4 < 0 ? true : index_4 >= this$_16.length) ? "\uFFFF" : this$_16.underlying[this$_16.startIndex + index_4]), matchValue_17 === "\uFFFF" ? new FSharpResult$2(1, [singleton([(this$_17 = s_49, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]) : (c_7 = matchValue_17, isDigit(c_7) ? new FSharpResult$2(0, [c_7, (this$_18 = s_49, start_9 = defaultArg(1, 0) | 0, finish_9 = defaultArg(void 0, this$_18.length - 1) | 0, start_9 >= 0 && start_9 <= this$_18.length && finish_9 < max((x_14, y_8) => comparePrimitives(x_14, y_8), start_9, this$_18.length) ? (len_7 = max((x_15, y_9) => comparePrimitives(x_15, y_9), 0, finish_9 - start_9 + 1) | 0, line_4 = this$_18.startLine, column_4 = this$_18.startColumn, (() => {
              for (let i_10 = 0; i_10 <= start_9 - 1; i_10++) {
                if (this$_18.underlying[this$_18.startIndex + i_10] === "\n") {
                  line_4 = line_4 + 1 | 0;
                  column_4 = 0;
                } else {
                  column_4 = column_4 + 1 | 0;
                }
              }
            })(), new StringSegment(this$_18.startIndex + start_9, len_7, this$_18.underlying, line_4, column_4)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)), void 0]) : new FSharpResult$2(1, [singleton([(this$_19 = s_49, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_7)])]), void 0]))));
            if (matchValue_19.tag === 0) {
              const state_57 = matchValue_19.fields[0][2];
              const s_53 = matchValue_19.fields[0][1];
              const r_1 = matchValue_19.fields[0][0];
              result_10[i_11] = r_1;
              i_11_mut = i_11 + 1;
              tupledArg_22_mut = [void 0, s_53];
              continue go_1;
            } else {
              const e_7 = matchValue_19.fields[0];
              return new FSharpResult$2(1, e_7);
            }
          }
          break;
        }
    }, go_1(0, [void 0, s_56]))), matchValue_21.tag === 0 ? (state_63 = matchValue_21.fields[0][2], s_57 = matchValue_21.fields[0][1], r2_1 = matchValue_21.fields[0][0], new FSharpResult$2(0, [[r1_2, r2_1], s_57, void 0])) : (e_9 = matchValue_21.fields[0], new FSharpResult$2(1, e_9))) : (e_8 = matchValue_20.fields[0], new FSharpResult$2(1, e_8))));
    if (matchValue_22.tag === 0) {
      const state_67 = matchValue_22.fields[0][2];
      const s_60 = matchValue_22.fields[0][1];
      const r_2 = matchValue_22.fields[0][0];
      return new FSharpResult$2(0, [(tupledArg_27 = r_2, _arg1 = tupledArg_27[0], second = tupledArg_27[1], sign_1 = _arg1[0], minute = _arg1[1], [sign_1, parse(join("", minute), 511, false, 32), parse(join("", second), 511, false, 32)]), s_60, void 0]);
    } else {
      const e_10 = matchValue_22.fields[0];
      return new FSharpResult$2(1, e_10);
    }
  };
  let p_32;
  let a;
  let p_23;
  let clo1_7;
  const chars = "zZ".split("");
  const set$ = new Set(chars);
  let label_2;
  const arg10_5 = toList(chars);
  label_2 = toText(printf("one of %A"))(arg10_5);
  clo1_7 = (tupledArg_30) => {
    let this$_21, this$_22, start_11, finish_11, len_9, line_5, column_5, this$_23;
    const label_3 = label_2;
    const s_62 = tupledArg_30[1];
    let matchValue_23;
    const this$_20 = s_62;
    const index_5 = 0;
    matchValue_23 = (index_5 < 0 ? true : index_5 >= this$_20.length) ? "\uFFFF" : this$_20.underlying[this$_20.startIndex + index_5];
    if (matchValue_23 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_21 = s_62, new Position(this$_21.startLine, this$_21.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c_8 = matchValue_23;
      return set$.has(c_8) ? new FSharpResult$2(0, [c_8, (this$_22 = s_62, start_11 = defaultArg(1, 0) | 0, finish_11 = defaultArg(void 0, this$_22.length - 1) | 0, start_11 >= 0 && start_11 <= this$_22.length && finish_11 < max((x_16, y_10) => comparePrimitives(x_16, y_10), start_11, this$_22.length) ? (len_9 = max((x_17, y_11) => comparePrimitives(x_17, y_11), 0, finish_11 - start_11 + 1) | 0, line_5 = this$_22.startLine, column_5 = this$_22.startColumn, (() => {
        for (let i_13 = 0; i_13 <= start_11 - 1; i_13++) {
          if (this$_22.underlying[this$_22.startIndex + i_13] === "\n") {
            line_5 = line_5 + 1 | 0;
            column_5 = 0;
          } else {
            column_5 = column_5 + 1 | 0;
          }
        }
      })(), new StringSegment(this$_22.startIndex + start_11, len_9, this$_22.underlying, line_5, column_5)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)), void 0]) : new FSharpResult$2(1, [singleton([(this$_23 = s_62, new Position(this$_23.startLine, this$_23.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_8)])]), void 0]);
    }
  };
  p_23 = (tupledArg_31) => clo1_7([void 0, tupledArg_31[1]]);
  a = (tupledArg_32) => {
    const matchValue_25 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), p_23([void 0, tupledArg_32[1]]));
    if (matchValue_25.tag === 0) {
      const state_75 = matchValue_25.fields[0][2];
      const s_65 = matchValue_25.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_65, void 0]);
    } else {
      const e_11 = matchValue_25.fields[0];
      return new FSharpResult$2(1, e_11);
    }
  };
  p_32 = (tupledArg_38) => {
    let matchValue_26, state_79, s_68, r_3, e_12, matchValue_27, state_83, s_71, r_4, e_13;
    const s_73 = tupledArg_38[1];
    const matchValue_28 = Result_MapError((tupledArg_39) => ParseError_sort(tupledArg_39[0], void 0), (matchValue_26 = Result_MapError((tupledArg_35) => ParseError_sort(tupledArg_35[0], void 0), a([void 0, s_73])), matchValue_26.tag === 0 ? (state_79 = matchValue_26.fields[0][2], s_68 = matchValue_26.fields[0][1], r_3 = matchValue_26.fields[0][0], new FSharpResult$2(0, [new FSharpChoice$2(0, void 0), s_68, void 0])) : (e_12 = matchValue_26.fields[0], new FSharpResult$2(1, e_12))));
    if (matchValue_28.tag === 1) {
      const state_87 = matchValue_28.fields[0][1];
      const es_1 = matchValue_28.fields[0][0];
      const matchValue_29 = Result_MapError((tupledArg_40) => ParseError_sort(tupledArg_40[0], void 0), (matchValue_27 = Result_MapError((tupledArg_37) => ParseError_sort(tupledArg_37[0], void 0), numoffset([void 0, s_73])), matchValue_27.tag === 0 ? (state_83 = matchValue_27.fields[0][2], s_71 = matchValue_27.fields[0][1], r_4 = matchValue_27.fields[0][0], new FSharpResult$2(0, [new FSharpChoice$2(1, r_4), s_71, void 0])) : (e_13 = matchValue_27.fields[0], new FSharpResult$2(1, e_13))));
      if (matchValue_29.tag === 1) {
        const state_89 = matchValue_29.fields[0][1];
        const es$0027_1 = matchValue_29.fields[0][0];
        return new FSharpResult$2(1, [append(es_1, es$0027_1), void 0]);
      } else {
        const x_20 = matchValue_29;
        return x_20;
      }
    } else {
      const x_19 = matchValue_28;
      return x_19;
    }
  };
  return (tupledArg_41) => {
    let this$_24;
    const s_75 = tupledArg_41[1];
    const matchValue_30 = Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), p_32([void 0, s_75]));
    if (matchValue_30.tag === 1) {
      const state_93 = matchValue_30.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_24 = s_75, new Position(this$_24.startLine, this$_24.startColumn)), singleton(new ErrorType(0, "ISO8601 Time Offset"))]), void 0]);
    } else {
      const x_21 = matchValue_30;
      return x_21;
    }
  };
})();
var Tests_ISO8601DateTime_iso8601_full_time = (tupledArg_6) => {
  let s_5, matchValue_2, matchValue, state_3, s_2, r1, matchValue_1, state_5, s_3, r2, e_1, e, state_9, this$, x, tupledArg_5, _arg1, o, s_6, m, h, f;
  const matchValue_3 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (s_5 = tupledArg_6[1], matchValue_2 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), Tests_ISO8601DateTime_iso8601_partial_time([void 0, s_5])), matchValue.tag === 0 ? (state_3 = matchValue.fields[0][2], s_2 = matchValue.fields[0][1], r1 = matchValue.fields[0][0], matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), Tests_ISO8601DateTime_iso8601_offset([void 0, s_2])), matchValue_1.tag === 0 ? (state_5 = matchValue_1.fields[0][2], s_3 = matchValue_1.fields[0][1], r2 = matchValue_1.fields[0][0], new FSharpResult$2(0, [[r1, r2], s_3, void 0])) : (e_1 = matchValue_1.fields[0], new FSharpResult$2(1, e_1))) : (e = matchValue.fields[0], new FSharpResult$2(1, e)))), matchValue_2.tag === 1 ? (state_9 = matchValue_2.fields[0][1], new FSharpResult$2(1, [singleton([(this$ = s_5, new Position(this$.startLine, this$.startColumn)), singleton(new ErrorType(0, "ISO8601 Full Time"))]), void 0])) : (x = matchValue_2, x)));
  if (matchValue_3.tag === 0) {
    const state_14 = matchValue_3.fields[0][2];
    const s_9 = matchValue_3.fields[0][1];
    const r = matchValue_3.fields[0][0];
    return new FSharpResult$2(0, [(tupledArg_5 = r, _arg1 = tupledArg_5[0], o = tupledArg_5[1], s_6 = _arg1[2] | 0, m = _arg1[1] | 0, h = _arg1[0] | 0, f = _arg1[3] | 0, [h, m, s_6, f, o]), s_9, void 0]);
  } else {
    const e_2 = matchValue_3.fields[0];
    return new FSharpResult$2(1, e_2);
  }
};
var Tests_ISO8601DateTime_iso8601_date_time = (() => {
  let p_10;
  let p_7;
  let p1_1;
  let p2;
  let p;
  let clo1_2;
  const chars = "tT ".split("");
  const set$ = new Set(chars);
  let label;
  const arg10 = toList(chars);
  label = toText(printf("one of %A"))(arg10);
  clo1_2 = (tupledArg) => {
    let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
    const label_1 = label;
    const s_1 = tupledArg[1];
    let matchValue;
    const this$ = s_1;
    const index = 0;
    matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
    if (matchValue === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c = matchValue;
      return set$.has(c) ? new FSharpResult$2(0, [c, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
        for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
          if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
            line = line + 1 | 0;
            column = 0;
          } else {
            column = column + 1 | 0;
          }
        }
      })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c)])]), void 0]);
    }
  };
  p = (tupledArg_1) => clo1_2([void 0, tupledArg_1[1]]);
  p2 = (tupledArg_2) => {
    const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p([void 0, tupledArg_2[1]]));
    if (matchValue_2.tag === 0) {
      const state_7 = matchValue_2.fields[0][2];
      const s_4 = matchValue_2.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_4, void 0]);
    } else {
      const e = matchValue_2.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  p1_1 = (tupledArg_4) => {
    const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), Tests_ISO8601DateTime_iso8601_full_date([void 0, tupledArg_4[1]]));
    if (matchValue_3.tag === 0) {
      const state_11 = matchValue_3.fields[0][2];
      const s_7 = matchValue_3.fields[0][1];
      const r1 = matchValue_3.fields[0][0];
      const matchValue_4 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), p2([void 0, s_7]));
      if (matchValue_4.tag === 0) {
        const state_13 = matchValue_4.fields[0][2];
        const s_8 = matchValue_4.fields[0][1];
        return new FSharpResult$2(0, [r1, s_8, void 0]);
      } else {
        const e_2 = matchValue_4.fields[0];
        return new FSharpResult$2(1, e_2);
      }
    } else {
      const e_1 = matchValue_3.fields[0];
      return new FSharpResult$2(1, e_1);
    }
  };
  p_7 = (tupledArg_7) => {
    const matchValue_5 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), p1_1([void 0, tupledArg_7[1]]));
    if (matchValue_5.tag === 0) {
      const state_17 = matchValue_5.fields[0][2];
      const s_11 = matchValue_5.fields[0][1];
      const r1_1 = matchValue_5.fields[0][0];
      const matchValue_6 = Result_MapError((tupledArg_9) => ParseError_sort(tupledArg_9[0], void 0), Tests_ISO8601DateTime_iso8601_full_time([void 0, s_11]));
      if (matchValue_6.tag === 0) {
        const state_19 = matchValue_6.fields[0][2];
        const s_12 = matchValue_6.fields[0][1];
        const r2 = matchValue_6.fields[0][0];
        return new FSharpResult$2(0, [[r1_1, r2], s_12, void 0]);
      } else {
        const e_4 = matchValue_6.fields[0];
        return new FSharpResult$2(1, e_4);
      }
    } else {
      const e_3 = matchValue_5.fields[0];
      return new FSharpResult$2(1, e_3);
    }
  };
  p_10 = (tupledArg_10) => {
    let this$_4;
    const s_14 = tupledArg_10[1];
    const matchValue_7 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), p_7([void 0, s_14]));
    if (matchValue_7.tag === 1) {
      const state_23 = matchValue_7.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_4 = s_14, new Position(this$_4.startLine, this$_4.startColumn)), singleton(new ErrorType(0, "ISO8601 Date Time"))]), void 0]);
    } else {
      const x_3 = matchValue_7;
      return x_3;
    }
  };
  return (tupledArg_13) => {
    let tupledArg_12, _arg1, _arg2, Y, M, D, s_15, o, m, h, f;
    const matchValue_8 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), p_10([void 0, tupledArg_13[1]]));
    if (matchValue_8.tag === 0) {
      const state_28 = matchValue_8.fields[0][2];
      const s_18 = matchValue_8.fields[0][1];
      const r = matchValue_8.fields[0][0];
      return new FSharpResult$2(0, [(tupledArg_12 = r, _arg1 = tupledArg_12[0], _arg2 = tupledArg_12[1], Y = _arg1[0] | 0, M = _arg1[1] | 0, D = _arg1[2] | 0, s_15 = _arg2[2] | 0, o = _arg2[4], m = _arg2[1] | 0, h = _arg2[0] | 0, f = _arg2[3] | 0, [Y, M, D, h, m, s_15, f, o]), s_18, void 0]);
    } else {
      const e_5 = matchValue_8.fields[0];
      return new FSharpResult$2(1, e_5);
    }
  };
})();

// generated/Ast.js
var Ast = class extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag | 0;
    this.fields = fields;
  }
  cases() {
    return ["ANumber", "AString", "AVariable", "ACocoAction", "ACallFunc"];
  }
};
var CocoAction = class extends Record {
  constructor(Name, Params, Easing2, Repeat2) {
    super();
    this.Name = Name;
    this.Params = Params;
    this.Easing = Easing2;
    this.Repeat = Repeat2;
  }
};
var Repeat = class extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag | 0;
    this.fields = fields;
  }
  cases() {
    return ["Forever", "Limit"];
  }
};
var Easing = class extends Record {
  constructor(Name, Params) {
    super();
    this.Name = Name;
    this.Params = Params;
  }
};

// generated/ParingParensParser.js
var Tree = class extends Union {
  constructor(tag, ...fields) {
    super();
    this.tag = tag | 0;
    this.fields = fields;
  }
  cases() {
    return ["Leaf", "Node"];
  }
};
var ParingParensParser_patternInput$00406$002D1 = (() => {
  const dummy = (tupledArg) => {
    throw new Error("invalid definition with createParserForwardedToRef");
  };
  const r = new FSharpRef(dummy);
  return [(tupledArg_1) => {
    const state = tupledArg_1[0];
    const s = tupledArg_1[1];
    return r.contents([void 0, s]);
  }, r];
})();
var ParingParensParser_parseTreeRef = ParingParensParser_patternInput$00406$002D1[1];
var ParingParensParser_parseTree = ParingParensParser_patternInput$00406$002D1[0];
var ParingParensParser_node = (() => {
  let p_9;
  let pl;
  const c = "(";
  pl = (tupledArg) => {
    let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
    const c_1 = c;
    const s_1 = tupledArg[1];
    let matchValue;
    const this$ = s_1;
    const index = 0;
    matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
    if (matchValue === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head2 = matchValue;
      return head2 === c_1 ? new FSharpResult$2(0, [c, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
        for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
          if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
            line = line + 1 | 0;
            column = 0;
          } else {
            column = column + 1 | 0;
          }
        }
      })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0]);
    }
  };
  let pr;
  const c_2 = ")";
  pr = (tupledArg_1) => {
    let this$_5, this$_6, start_3, finish_3, len_1, line_1, column_1, this$_7;
    const c_3 = c_2;
    const s_9 = tupledArg_1[1];
    let matchValue_2;
    const this$_4 = s_9;
    const index_1 = 0;
    matchValue_2 = (index_1 < 0 ? true : index_1 >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index_1];
    if (matchValue_2 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_5 = s_9, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head_1 = matchValue_2;
      return head_1 === c_3 ? new FSharpResult$2(0, [c_2, (this$_6 = s_9, start_3 = defaultArg(1, 0) | 0, finish_3 = defaultArg(void 0, this$_6.length - 1) | 0, start_3 >= 0 && start_3 <= this$_6.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_6.startLine, column_1 = this$_6.startColumn, (() => {
        for (let i_3 = 0; i_3 <= start_3 - 1; i_3++) {
          if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
            line_1 = line_1 + 1 | 0;
            column_1 = 0;
          } else {
            column_1 = column_1 + 1 | 0;
          }
        }
      })(), new StringSegment(this$_6.startIndex + start_3, len_1, this$_6.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_9, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "'" + head_1 + "'")])]), void 0]);
    }
  };
  let p_4;
  const resultForEmptySequence = empty;
  const p_1 = ParingParensParser_parseTree;
  const fp = defaultArg(void 0, p_1);
  const go = (acc_mut, tupledArg_2_mut) => {
    go:
      while (true) {
        const acc = acc_mut, tupledArg_2 = tupledArg_2_mut;
        const state_8 = tupledArg_2[0];
        const s_16 = tupledArg_2[1];
        const matchValue_4 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p_1([void 0, s_16]));
        if (matchValue_4.tag === 0) {
          const state_11 = matchValue_4.fields[0][2];
          const s_17 = matchValue_4.fields[0][1];
          const r = matchValue_4.fields[0][0];
          acc_mut = cons(r, acc);
          tupledArg_2_mut = [void 0, s_17];
          continue go;
        } else {
          const state_10 = matchValue_4.fields[0][1];
          return new FSharpResult$2(0, [reverse(acc), s_16, void 0]);
        }
        break;
      }
  };
  p_4 = (tupledArg_4) => {
    let f;
    const state_12 = tupledArg_4[0];
    const s_18 = tupledArg_4[1];
    const matchValue_5 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), fp([void 0, s_18]));
    if (matchValue_5.tag === 0) {
      const state_15 = matchValue_5.fields[0][2];
      const s_19 = matchValue_5.fields[0][1];
      const r_1 = matchValue_5.fields[0][0];
      const r_2 = singleton(r_1);
      return go(r_2, [void 0, s_19]);
    } else {
      const state_14 = matchValue_5.fields[0][1];
      const es = matchValue_5.fields[0][0];
      return resultForEmptySequence == null ? new FSharpResult$2(1, [es, void 0]) : new FSharpResult$2(0, [resultForEmptySequence == null ? null : (f = resultForEmptySequence, f()), s_18, void 0]);
    }
  };
  p_9 = (tupledArg_9) => {
    let matchValue_6, state_19, s_22, matchValue_7, state_21, s_23, r2, e_1, e;
    const matchValue_8 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), (matchValue_6 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), pl([void 0, tupledArg_9[1]])), matchValue_6.tag === 0 ? (state_19 = matchValue_6.fields[0][2], s_22 = matchValue_6.fields[0][1], matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), p_4([void 0, s_22])), matchValue_7.tag === 0 ? (state_21 = matchValue_7.fields[0][2], s_23 = matchValue_7.fields[0][1], r2 = matchValue_7.fields[0][0], new FSharpResult$2(0, [r2, s_23, void 0])) : (e_1 = matchValue_7.fields[0], new FSharpResult$2(1, e_1))) : (e = matchValue_6.fields[0], new FSharpResult$2(1, e))));
    if (matchValue_8.tag === 0) {
      const state_25 = matchValue_8.fields[0][2];
      const s_26 = matchValue_8.fields[0][1];
      const r1 = matchValue_8.fields[0][0];
      const matchValue_9 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), pr([void 0, s_26]));
      if (matchValue_9.tag === 0) {
        const state_27 = matchValue_9.fields[0][2];
        const s_27 = matchValue_9.fields[0][1];
        return new FSharpResult$2(0, [r1, s_27, void 0]);
      } else {
        const e_3 = matchValue_9.fields[0];
        return new FSharpResult$2(1, e_3);
      }
    } else {
      const e_2 = matchValue_8.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
  return (tupledArg_12) => {
    const matchValue_10 = Result_MapError((tupledArg_13) => ParseError_sort(tupledArg_13[0], void 0), p_9([void 0, tupledArg_12[1]]));
    if (matchValue_10.tag === 0) {
      const state_31 = matchValue_10.fields[0][2];
      const s_30 = matchValue_10.fields[0][1];
      const r_3 = matchValue_10.fields[0][0];
      return new FSharpResult$2(0, [new Tree(1, r_3), s_30, void 0]);
    } else {
      const e_4 = matchValue_10.fields[0];
      return new FSharpResult$2(1, e_4);
    }
  };
})();
var ParingParensParser_leaf = (() => {
  let p_7;
  let p_4;
  const resultForEmptySequence = void 0;
  let p_1;
  let clo1_2;
  const chars = "()".split("");
  const set$ = new Set(chars);
  let label;
  const arg10 = toList(chars);
  label = toText(printf("one of %A"))(arg10);
  clo1_2 = (tupledArg) => {
    let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
    const label_1 = label;
    const s_1 = tupledArg[1];
    let matchValue;
    const this$ = s_1;
    const index = 0;
    matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
    if (matchValue === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const c = matchValue;
      return !set$.has(c) ? new FSharpResult$2(0, [c, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
        for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
          if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
            line = line + 1 | 0;
            column = 0;
          } else {
            column = column + 1 | 0;
          }
        }
      })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c)])]), void 0]);
    }
  };
  p_1 = (tupledArg_1) => clo1_2([void 0, tupledArg_1[1]]);
  const fp = defaultArg(void 0, p_1);
  const go = (acc_mut, tupledArg_2_mut) => {
    go:
      while (true) {
        const acc = acc_mut, tupledArg_2 = tupledArg_2_mut;
        const state_4 = tupledArg_2[0];
        const s_2 = tupledArg_2[1];
        const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p_1([void 0, s_2]));
        if (matchValue_2.tag === 0) {
          const state_7 = matchValue_2.fields[0][2];
          const s_3 = matchValue_2.fields[0][1];
          const r = matchValue_2.fields[0][0];
          acc_mut = cons(r, acc);
          tupledArg_2_mut = [void 0, s_3];
          continue go;
        } else {
          const state_6 = matchValue_2.fields[0][1];
          return new FSharpResult$2(0, [reverse(acc), s_2, void 0]);
        }
        break;
      }
  };
  p_4 = (tupledArg_4) => {
    let f;
    const state_8 = tupledArg_4[0];
    const s_4 = tupledArg_4[1];
    const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), fp([void 0, s_4]));
    if (matchValue_3.tag === 0) {
      const state_11 = matchValue_3.fields[0][2];
      const s_5 = matchValue_3.fields[0][1];
      const r_1 = matchValue_3.fields[0][0];
      const r_2 = singleton(r_1);
      return go(r_2, [void 0, s_5]);
    } else {
      const state_10 = matchValue_3.fields[0][1];
      const es = matchValue_3.fields[0][0];
      return resultForEmptySequence == null ? new FSharpResult$2(1, [es, void 0]) : new FSharpResult$2(0, [resultForEmptySequence == null ? null : (f = resultForEmptySequence, f()), s_4, void 0]);
    }
  };
  p_7 = (tupledArg_6) => {
    const matchValue_4 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), p_4([void 0, tupledArg_6[1]]));
    if (matchValue_4.tag === 0) {
      const state_15 = matchValue_4.fields[0][2];
      const s_8 = matchValue_4.fields[0][1];
      const r_3 = matchValue_4.fields[0][0];
      return new FSharpResult$2(0, [join("", toArray(r_3)), s_8, void 0]);
    } else {
      const e = matchValue_4.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  return (tupledArg_8) => {
    const matchValue_5 = Result_MapError((tupledArg_9) => ParseError_sort(tupledArg_9[0], void 0), p_7([void 0, tupledArg_8[1]]));
    if (matchValue_5.tag === 0) {
      const state_19 = matchValue_5.fields[0][2];
      const s_11 = matchValue_5.fields[0][1];
      const r_4 = matchValue_5.fields[0][0];
      return new FSharpResult$2(0, [new Tree(0, r_4), s_11, void 0]);
    } else {
      const e_1 = matchValue_5.fields[0];
      return new FSharpResult$2(1, e_1);
    }
  };
})();
ParingParensParser_parseTreeRef.contents = (tupledArg) => {
  const s_1 = tupledArg[1];
  const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), ParingParensParser_node([void 0, s_1]));
  if (matchValue.tag === 1) {
    const state_3 = matchValue.fields[0][1];
    const es = matchValue.fields[0][0];
    const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), ParingParensParser_leaf([void 0, s_1]));
    if (matchValue_1.tag === 1) {
      const state_5 = matchValue_1.fields[0][1];
      const es$0027 = matchValue_1.fields[0][0];
      return new FSharpResult$2(1, [append(es, es$0027), void 0]);
    } else {
      const x_1 = matchValue_1;
      return x_1;
    }
  } else {
    const x = matchValue;
    return x;
  }
};
function ParingParensParser_show(_arg1) {
  if (_arg1.tag === 1) {
    const trees = _arg1.fields[0];
    const inside = join("", map3((_arg1_1) => ParingParensParser_show(_arg1_1), trees));
    return `(${inside})`;
  } else {
    const leaf = _arg1.fields[0];
    return leaf;
  }
}
var ParingParensParser_showTree = (tupledArg) => {
  const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), ParingParensParser_parseTree([void 0, tupledArg[1]]));
  if (matchValue.tag === 0) {
    const state_3 = matchValue.fields[0][2];
    const s_2 = matchValue.fields[0][1];
    const r = matchValue.fields[0][0];
    return new FSharpResult$2(0, [ParingParensParser_show(r), s_2, void 0]);
  } else {
    const e = matchValue.fields[0];
    return new FSharpResult$2(1, e);
  }
};
var ParingParensParser_parser = ParingParensParser_showTree;

// generated/AstParser.js
var patternInput$00406 = (() => {
  const dummy = (tupledArg) => {
    throw new Error("invalid definition with createParserForwardedToRef");
  };
  const r = new FSharpRef(dummy);
  return [(tupledArg_1) => {
    const state = tupledArg_1[0];
    const s = tupledArg_1[1];
    return r.contents([void 0, s]);
  }, r];
})();
var pAstRef = patternInput$00406[1];
var pAst = patternInput$00406[0];
function charsTill(str) {
  const label = `String till '${str}'`;
  return (tupledArg_1) => {
    let tupledArg, str_1, state_1, s_1, index, this$_1, this$, start_1, finish_1, len, line, column, res, this$_3, this$_2, finish_2, start_3, finish_3, len_1, line_1, column_1, nextIndex, this$_4, start_5, finish_5, len_2, line_2, column_2, this$_5;
    const s_4 = tupledArg_1[1];
    const matchValue_3 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], tupledArg_2[1]), (tupledArg = [tupledArg_1[0], s_4], str_1 = str, state_1 = tupledArg[0], s_1 = tupledArg[1], index = StringSegmentModule_indexOfSequence(str_1, s_1) | 0, index < 0 ? new FSharpResult$2(1, [singleton([(this$_1 = (this$ = s_1, start_1 = defaultArg(s_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), state_1]) : (res = (this$_3 = (this$_2 = s_1, finish_2 = index - 1, start_3 = defaultArg(0, 0) | 0, finish_3 = defaultArg(finish_2, this$_2.length - 1) | 0, start_3 >= 0 && start_3 <= this$_2.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_2.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_2.startLine, column_1 = this$_2.startColumn, (() => {
      for (let i_1 = 0; i_1 <= start_3 - 1; i_1++) {
        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
          line_1 = line_1 + 1 | 0;
          column_1 = 0;
        } else {
          column_1 = column_1 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_2.startIndex + start_3, len_1, this$_2.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), substring(this$_3.underlying, this$_3.startIndex, this$_3.length)), nextIndex = index | 0, new FSharpResult$2(0, [res, (this$_4 = s_1, start_5 = defaultArg(nextIndex, 0) | 0, finish_5 = defaultArg(void 0, this$_4.length - 1) | 0, start_5 >= 0 && start_5 <= this$_4.length && finish_5 < max((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_4.length) ? (len_2 = max((x_5, y_5) => comparePrimitives(x_5, y_5), 0, finish_5 - start_5 + 1) | 0, line_2 = this$_4.startLine, column_2 = this$_4.startColumn, (() => {
      for (let i_2 = 0; i_2 <= start_5 - 1; i_2++) {
        if (this$_4.underlying[this$_4.startIndex + i_2] === "\n") {
          line_2 = line_2 + 1 | 0;
          column_2 = 0;
        } else {
          column_2 = column_2 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_4.startIndex + start_5, len_2, this$_4.underlying, line_2, column_2)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)), state_1]))));
    if (matchValue_3.tag === 1) {
      const state_6 = matchValue_3.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_5 = s_4, new Position(this$_5.startLine, this$_5.startColumn)), singleton(new ErrorType(0, label))]), state_6]);
    } else {
      const x_6 = matchValue_3;
      return x_6;
    }
  };
}
var pCoco = (() => {
  const str = "cc.";
  return (tupledArg) => {
    let this$, start_1, finish_1, len, line, column, this$_1;
    const str_1 = str;
    const s_1 = tupledArg[1];
    return StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, [str, (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
  };
})();
var pNumber = (tupledArg_1) => {
  const matchValue = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), CharParsers_pfloat(void 0, tupledArg_1[1]));
  if (matchValue.tag === 0) {
    const state_4 = matchValue.fields[0][2];
    const s_3 = matchValue.fields[0][1];
    const r = matchValue.fields[0][0];
    return new FSharpResult$2(0, [new Ast(0, r), s_3, void 0]);
  } else {
    const e = matchValue.fields[0];
    return new FSharpResult$2(1, e);
  }
};
var pString = (() => {
  let p_5;
  let p_2;
  let p1;
  const c = '"';
  p1 = (tupledArg) => {
    let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
    const c_1 = c;
    const s_1 = tupledArg[1];
    let matchValue;
    const this$ = s_1;
    const index = 0;
    matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
    if (matchValue === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head2 = matchValue;
      return head2 === c_1 ? new FSharpResult$2(0, [c, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
        for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
          if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
            line = line + 1 | 0;
            column = 0;
          } else {
            column = column + 1 | 0;
          }
        }
      })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0]);
    }
  };
  const p2 = charsTill('"');
  p_2 = (tupledArg_1) => {
    const matchValue_2 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p1([void 0, tupledArg_1[1]]));
    if (matchValue_2.tag === 0) {
      const state_7 = matchValue_2.fields[0][2];
      const s_10 = matchValue_2.fields[0][1];
      const matchValue_3 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p2([void 0, s_10]));
      if (matchValue_3.tag === 0) {
        const state_9 = matchValue_3.fields[0][2];
        const s_11 = matchValue_3.fields[0][1];
        const r2 = matchValue_3.fields[0][0];
        return new FSharpResult$2(0, [r2, s_11, void 0]);
      } else {
        const e_1 = matchValue_3.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_2.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  p_5 = (tupledArg_4) => {
    const matchValue_4 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p_2([void 0, tupledArg_4[1]]));
    if (matchValue_4.tag === 0) {
      const state_13 = matchValue_4.fields[0][2];
      const s_14 = matchValue_4.fields[0][1];
      const r = matchValue_4.fields[0][0];
      return new FSharpResult$2(0, [new Ast(1, r), s_14, void 0]);
    } else {
      const e_2 = matchValue_4.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
  return (tupledArg_6) => {
    let this$_4;
    const s_16 = tupledArg_6[1];
    const matchValue_5 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), p_5([void 0, s_16]));
    if (matchValue_5.tag === 1) {
      const state_17 = matchValue_5.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_4 = s_16, new Position(this$_4.startLine, this$_4.startColumn)), singleton(new ErrorType(0, "Quoted string"))]), void 0]);
    } else {
      const x_2 = matchValue_5;
      return x_2;
    }
  };
})();
var pVariable = (() => {
  let p_3;
  let p;
  const pattern = "^[_$a-z][\\w$]*";
  let opt;
  const o = 256 | 2 | 0;
  opt = o;
  const regex = create("\\A" + pattern, opt);
  p = (tupledArg) => {
    let this$_1, start_1, finish_1, len, line, column, this$_2;
    const state = tupledArg[0];
    const s = tupledArg[1];
    let str;
    const this$ = s;
    str = substring(this$.underlying, this$.startIndex, this$.length);
    const m = match(regex, str);
    return m != null ? new FSharpResult$2(0, [m[0], (this$_1 = s, start_1 = defaultArg(m[0].length, 0) | 0, finish_1 = defaultArg(void 0, this$_1.length - 1) | 0, start_1 >= 0 && start_1 <= this$_1.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_1.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_1.startLine, column = this$_1.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$_1.underlying[this$_1.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$_1.startIndex + start_1, len, this$_1.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_2 = s, new Position(this$_2.startLine, this$_2.startColumn)), singleton(new ErrorType(0, pattern))]), void 0]);
  };
  p_3 = (tupledArg_1) => {
    const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p([void 0, tupledArg_1[1]]));
    if (matchValue_1.tag === 0) {
      const state_5 = matchValue_1.fields[0][2];
      const s_3 = matchValue_1.fields[0][1];
      const r = matchValue_1.fields[0][0];
      return new FSharpResult$2(0, [new Ast(2, r), s_3, void 0]);
    } else {
      const e = matchValue_1.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  return (tupledArg_3) => {
    let this$_3;
    const s_5 = tupledArg_3[1];
    const matchValue_2 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), p_3([void 0, s_5]));
    if (matchValue_2.tag === 1) {
      const state_9 = matchValue_2.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_3 = s_5, new Position(this$_3.startLine, this$_3.startColumn)), singleton(new ErrorType(0, "Any variable or property"))]), void 0]);
    } else {
      const x_2 = matchValue_2;
      return x_2;
    }
  };
})();
var pCallFunc = (() => {
  let p_2;
  let p1;
  const str = "cc.callFunc";
  p1 = (tupledArg) => {
    let this$, start_1, finish_1, len, line, column, this$_1;
    const str_1 = str;
    const s_1 = tupledArg[1];
    return StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, [str, (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
  };
  p_2 = (tupledArg_1) => {
    const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p1([void 0, tupledArg_1[1]]));
    if (matchValue_1.tag === 0) {
      const state_6 = matchValue_1.fields[0][2];
      const s_5 = matchValue_1.fields[0][1];
      const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), ParingParensParser_parser([void 0, s_5]));
      if (matchValue_2.tag === 0) {
        const state_8 = matchValue_2.fields[0][2];
        const s_6 = matchValue_2.fields[0][1];
        const r2 = matchValue_2.fields[0][0];
        return new FSharpResult$2(0, [r2, s_6, void 0]);
      } else {
        const e_1 = matchValue_2.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_1.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  return (tupledArg_4) => {
    const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p_2([void 0, tupledArg_4[1]]));
    if (matchValue_3.tag === 0) {
      const state_12 = matchValue_3.fields[0][2];
      const s_9 = matchValue_3.fields[0][1];
      const r = matchValue_3.fields[0][0];
      return new FSharpResult$2(0, [new Ast(4, r), s_9, void 0]);
    } else {
      const e_2 = matchValue_3.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
})();
var pParenOpen = (() => {
  let p_5;
  let p1;
  const c = "(";
  p1 = (tupledArg) => {
    let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
    const c_1 = c;
    const s_1 = tupledArg[1];
    let matchValue;
    const this$ = s_1;
    const index = 0;
    matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
    if (matchValue === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head2 = matchValue;
      return head2 === c_1 ? new FSharpResult$2(0, [c, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
        for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
          if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
            line = line + 1 | 0;
            column = 0;
          } else {
            column = column + 1 | 0;
          }
        }
      })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0]);
    }
  };
  let p2;
  let p;
  const c_2 = "[";
  p = (tupledArg_1) => {
    let this$_5, this$_6, start_3, finish_3, len_1, line_1, column_1, this$_7;
    const c_3 = c_2;
    const s_9 = tupledArg_1[1];
    let matchValue_2;
    const this$_4 = s_9;
    const index_1 = 0;
    matchValue_2 = (index_1 < 0 ? true : index_1 >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index_1];
    if (matchValue_2 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_5 = s_9, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head_1 = matchValue_2;
      return head_1 === c_3 ? new FSharpResult$2(0, [c_2, (this$_6 = s_9, start_3 = defaultArg(1, 0) | 0, finish_3 = defaultArg(void 0, this$_6.length - 1) | 0, start_3 >= 0 && start_3 <= this$_6.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_6.startLine, column_1 = this$_6.startColumn, (() => {
        for (let i_3 = 0; i_3 <= start_3 - 1; i_3++) {
          if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
            line_1 = line_1 + 1 | 0;
            column_1 = 0;
          } else {
            column_1 = column_1 + 1 | 0;
          }
        }
      })(), new StringSegment(this$_6.startIndex + start_3, len_1, this$_6.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_9, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "'" + head_1 + "'")])]), void 0]);
    }
  };
  p2 = (tupledArg_2) => {
    const s_17 = tupledArg_2[1];
    const matchValue_4 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p([void 0, s_17]));
    if (matchValue_4.tag === 1) {
      const state_12 = matchValue_4.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_17, void 0]);
    } else {
      const state_11 = matchValue_4.fields[0][2];
      const s_18 = matchValue_4.fields[0][1];
      const r = matchValue_4.fields[0][0];
      return new FSharpResult$2(0, [r, s_18, void 0]);
    }
  };
  p_5 = (tupledArg_4) => {
    const matchValue_5 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p1([void 0, tupledArg_4[1]]));
    if (matchValue_5.tag === 0) {
      const state_16 = matchValue_5.fields[0][2];
      const s_21 = matchValue_5.fields[0][1];
      const r1 = matchValue_5.fields[0][0];
      const matchValue_6 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), p2([void 0, s_21]));
      if (matchValue_6.tag === 0) {
        const state_18 = matchValue_6.fields[0][2];
        const s_22 = matchValue_6.fields[0][1];
        return new FSharpResult$2(0, [r1, s_22, void 0]);
      } else {
        const e_1 = matchValue_6.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_5.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  return (tupledArg_7) => {
    let this$_8;
    const s_24 = tupledArg_7[1];
    const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), p_5([void 0, s_24]));
    if (matchValue_7.tag === 1) {
      const state_22 = matchValue_7.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_8 = s_24, new Position(this$_8.startLine, this$_8.startColumn)), singleton(new ErrorType(0, "Open paren '(' or '(['"))]), void 0]);
    } else {
      const x_4 = matchValue_7;
      return x_4;
    }
  };
})();
var pParenClose = (() => {
  let p_5;
  let p1;
  let p;
  const c = "]";
  p = (tupledArg) => {
    let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
    const c_1 = c;
    const s_1 = tupledArg[1];
    let matchValue;
    const this$ = s_1;
    const index = 0;
    matchValue = (index < 0 ? true : index >= this$.length) ? "\uFFFF" : this$.underlying[this$.startIndex + index];
    if (matchValue === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head2 = matchValue;
      return head2 === c_1 ? new FSharpResult$2(0, [c, (this$_2 = s_1, start_1 = defaultArg(1, 0) | 0, finish_1 = defaultArg(void 0, this$_2.length - 1) | 0, start_1 >= 0 && start_1 <= this$_2.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$_2.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$_2.startLine, column = this$_2.startColumn, (() => {
        for (let i_1 = 0; i_1 <= start_1 - 1; i_1++) {
          if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
            line = line + 1 | 0;
            column = 0;
          } else {
            column = column + 1 | 0;
          }
        }
      })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, "'" + c_1 + "'"), new ErrorType(1, "'" + head2 + "'")])]), void 0]);
    }
  };
  p1 = (tupledArg_1) => {
    const s_9 = tupledArg_1[1];
    const matchValue_2 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p([void 0, s_9]));
    if (matchValue_2.tag === 1) {
      const state_8 = matchValue_2.fields[0][1];
      return new FSharpResult$2(0, [void 0, s_9, void 0]);
    } else {
      const state_7 = matchValue_2.fields[0][2];
      const s_10 = matchValue_2.fields[0][1];
      const r = matchValue_2.fields[0][0];
      return new FSharpResult$2(0, [r, s_10, void 0]);
    }
  };
  let p2;
  const c_2 = ")";
  p2 = (tupledArg_3) => {
    let this$_5, this$_6, start_3, finish_3, len_1, line_1, column_1, this$_7;
    const c_3 = c_2;
    const s_12 = tupledArg_3[1];
    let matchValue_3;
    const this$_4 = s_12;
    const index_1 = 0;
    matchValue_3 = (index_1 < 0 ? true : index_1 >= this$_4.length) ? "\uFFFF" : this$_4.underlying[this$_4.startIndex + index_1];
    if (matchValue_3 === "\uFFFF") {
      return new FSharpResult$2(1, [singleton([(this$_5 = s_12, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "EOF")])]), void 0]);
    } else {
      const head_1 = matchValue_3;
      return head_1 === c_3 ? new FSharpResult$2(0, [c_2, (this$_6 = s_12, start_3 = defaultArg(1, 0) | 0, finish_3 = defaultArg(void 0, this$_6.length - 1) | 0, start_3 >= 0 && start_3 <= this$_6.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_6.startLine, column_1 = this$_6.startColumn, (() => {
        for (let i_3 = 0; i_3 <= start_3 - 1; i_3++) {
          if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
            line_1 = line_1 + 1 | 0;
            column_1 = 0;
          } else {
            column_1 = column_1 + 1 | 0;
          }
        }
      })(), new StringSegment(this$_6.startIndex + start_3, len_1, this$_6.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_7 = s_12, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, "'" + c_3 + "'"), new ErrorType(1, "'" + head_1 + "'")])]), void 0]);
    }
  };
  p_5 = (tupledArg_4) => {
    const matchValue_5 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p1([void 0, tupledArg_4[1]]));
    if (matchValue_5.tag === 0) {
      const state_16 = matchValue_5.fields[0][2];
      const s_21 = matchValue_5.fields[0][1];
      const matchValue_6 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), p2([void 0, s_21]));
      if (matchValue_6.tag === 0) {
        const state_18 = matchValue_6.fields[0][2];
        const s_22 = matchValue_6.fields[0][1];
        const r2 = matchValue_6.fields[0][0];
        return new FSharpResult$2(0, [r2, s_22, void 0]);
      } else {
        const e_1 = matchValue_6.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_5.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  return (tupledArg_7) => {
    let this$_8;
    const s_24 = tupledArg_7[1];
    const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), p_5([void 0, s_24]));
    if (matchValue_7.tag === 1) {
      const state_22 = matchValue_7.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_8 = s_24, new Position(this$_8.startLine, this$_8.startColumn)), singleton(new ErrorType(0, "Close paren ')' or '])'"))]), void 0]);
    } else {
      const x_4 = matchValue_7;
      return x_4;
    }
  };
})();
function pInsideParens(parser_1) {
  return (tupledArg_3) => {
    let matchValue, state_3, s_2, matchValue_1, state_5, s_3, r2, e_1, e;
    const matchValue_2 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), pParenOpen([void 0, tupledArg_3[1]])), matchValue.tag === 0 ? (state_3 = matchValue.fields[0][2], s_2 = matchValue.fields[0][1], matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), parser_1([void 0, s_2])), matchValue_1.tag === 0 ? (state_5 = matchValue_1.fields[0][2], s_3 = matchValue_1.fields[0][1], r2 = matchValue_1.fields[0][0], new FSharpResult$2(0, [r2, s_3, void 0])) : (e_1 = matchValue_1.fields[0], new FSharpResult$2(1, e_1))) : (e = matchValue.fields[0], new FSharpResult$2(1, e))));
    if (matchValue_2.tag === 0) {
      const state_9 = matchValue_2.fields[0][2];
      const s_6 = matchValue_2.fields[0][1];
      const r1 = matchValue_2.fields[0][0];
      const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), pParenClose([void 0, s_6]));
      if (matchValue_3.tag === 0) {
        const state_11 = matchValue_3.fields[0][2];
        const s_7 = matchValue_3.fields[0][1];
        return new FSharpResult$2(0, [r1, s_7, void 0]);
      } else {
        const e_3 = matchValue_3.fields[0];
        return new FSharpResult$2(1, e_3);
      }
    } else {
      const e_2 = matchValue_2.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
}
function spaces() {
  return CharParsers_spaces();
}
function splitBy(token, parser_1) {
  let p_11;
  const p1 = spaces();
  let p2_4;
  let p_4;
  const p2 = spaces();
  p_4 = (tupledArg) => {
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), parser_1([void 0, tupledArg[1]]));
    if (matchValue.tag === 0) {
      const state_3 = matchValue.fields[0][2];
      const s_2 = matchValue.fields[0][1];
      const r1 = matchValue.fields[0][0];
      const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p2([void 0, s_2]));
      if (matchValue_1.tag === 0) {
        const state_5 = matchValue_1.fields[0][2];
        const s_3 = matchValue_1.fields[0][1];
        return new FSharpResult$2(0, [r1, s_3, void 0]);
      } else {
        const e_1 = matchValue_1.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  let sep;
  let p1_2;
  const str = token;
  p1_2 = (tupledArg_3) => {
    let this$, start_1, finish_1, len, line, column, this$_1;
    const str_1 = str;
    const s_5 = tupledArg_3[1];
    return StringSegmentModule_startsWith(str_1, s_5) ? new FSharpResult$2(0, [str, (this$ = s_5, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_5, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
  };
  const p2_2 = spaces();
  sep = (tupledArg_4) => {
    const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p1_2([void 0, tupledArg_4[1]]));
    if (matchValue_3.tag === 0) {
      const state_12 = matchValue_3.fields[0][2];
      const s_9 = matchValue_3.fields[0][1];
      const matchValue_4 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), p2_2([void 0, s_9]));
      if (matchValue_4.tag === 0) {
        const state_14 = matchValue_4.fields[0][2];
        const s_10 = matchValue_4.fields[0][1];
        const r2 = matchValue_4.fields[0][0];
        return new FSharpResult$2(0, [void 0, s_10, void 0]);
      } else {
        const e_3 = matchValue_4.fields[0];
        return new FSharpResult$2(1, e_3);
      }
    } else {
      const e_2 = matchValue_3.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
  const resultFromState = (list) => reverse(list);
  const resultForEmptySequence = empty;
  const p_5 = p_4;
  const fp = defaultArg(void 0, p_5);
  const sep_1 = sep;
  const go = (acc_mut, tupledArg_7_mut) => {
    go:
      while (true) {
        const acc = acc_mut, tupledArg_7 = tupledArg_7_mut;
        const state_15 = tupledArg_7[0];
        const s_11 = tupledArg_7[1];
        const matchValue_5 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], tupledArg_8[1]), sep_1([state_15, s_11]));
        if (matchValue_5.tag === 0) {
          const state_18 = matchValue_5.fields[0][2];
          const s_12 = matchValue_5.fields[0][1];
          const rSep = matchValue_5.fields[0][0];
          const matchValue_6 = Result_MapError((tupledArg_9) => ParseError_sort(tupledArg_9[0], tupledArg_9[1]), p_5([state_18, s_12]));
          if (matchValue_6.tag === 0) {
            const state_21 = matchValue_6.fields[0][2];
            const s_13 = matchValue_6.fields[0][1];
            const r = matchValue_6.fields[0][0];
            acc_mut = cons(r, acc);
            tupledArg_7_mut = [state_21, s_13];
            continue go;
          } else {
            const state_20 = matchValue_6.fields[0][1];
            const es = matchValue_6.fields[0][0];
            if (defaultArg(true, false)) {
              return new FSharpResult$2(0, [resultFromState(acc), s_12, state_20]);
            } else {
              return new FSharpResult$2(1, [es, state_20]);
            }
          }
        } else {
          const state_17 = matchValue_5.fields[0][1];
          return new FSharpResult$2(0, [resultFromState(acc), s_11, state_17]);
        }
        break;
      }
  };
  p2_4 = (tupledArg_10) => {
    let f;
    const state_22 = tupledArg_10[0];
    const s_14 = tupledArg_10[1];
    const matchValue_7 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], tupledArg_11[1]), fp([state_22, s_14]));
    if (matchValue_7.tag === 0) {
      const state_25 = matchValue_7.fields[0][2];
      const s_15 = matchValue_7.fields[0][1];
      const r_1 = matchValue_7.fields[0][0];
      const r_2 = singleton(r_1);
      return go(r_2, [state_25, s_15]);
    } else {
      const state_24 = matchValue_7.fields[0][1];
      const es_1 = matchValue_7.fields[0][0];
      return resultForEmptySequence == null ? new FSharpResult$2(1, [es_1, state_24]) : new FSharpResult$2(0, [resultForEmptySequence == null ? null : (f = resultForEmptySequence, f()), s_14, state_24]);
    }
  };
  p_11 = (tupledArg_12) => {
    const matchValue_8 = Result_MapError((tupledArg_13) => ParseError_sort(tupledArg_13[0], void 0), p1([void 0, tupledArg_12[1]]));
    if (matchValue_8.tag === 0) {
      const state_29 = matchValue_8.fields[0][2];
      const s_18 = matchValue_8.fields[0][1];
      const matchValue_9 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), p2_4([void 0, s_18]));
      if (matchValue_9.tag === 0) {
        const state_31 = matchValue_9.fields[0][2];
        const s_19 = matchValue_9.fields[0][1];
        const r2_1 = matchValue_9.fields[0][0];
        return new FSharpResult$2(0, [r2_1, s_19, void 0]);
      } else {
        const e_5 = matchValue_9.fields[0];
        return new FSharpResult$2(1, e_5);
      }
    } else {
      const e_4 = matchValue_8.fields[0];
      return new FSharpResult$2(1, e_4);
    }
  };
  return (tupledArg_18) => {
    let matchValue_10, state_35, s_22, matchValue_11, state_37, s_23, r2_2, e_7, e_6;
    const matchValue_12 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (matchValue_10 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), pParenOpen([void 0, tupledArg_18[1]])), matchValue_10.tag === 0 ? (state_35 = matchValue_10.fields[0][2], s_22 = matchValue_10.fields[0][1], matchValue_11 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), p_11([void 0, s_22])), matchValue_11.tag === 0 ? (state_37 = matchValue_11.fields[0][2], s_23 = matchValue_11.fields[0][1], r2_2 = matchValue_11.fields[0][0], new FSharpResult$2(0, [r2_2, s_23, void 0])) : (e_7 = matchValue_11.fields[0], new FSharpResult$2(1, e_7))) : (e_6 = matchValue_10.fields[0], new FSharpResult$2(1, e_6))));
    if (matchValue_12.tag === 0) {
      const state_41 = matchValue_12.fields[0][2];
      const s_26 = matchValue_12.fields[0][1];
      const r1_1 = matchValue_12.fields[0][0];
      const matchValue_13 = Result_MapError((tupledArg_20) => ParseError_sort(tupledArg_20[0], void 0), pParenClose([void 0, s_26]));
      if (matchValue_13.tag === 0) {
        const state_43 = matchValue_13.fields[0][2];
        const s_27 = matchValue_13.fields[0][1];
        return new FSharpResult$2(0, [r1_1, s_27, void 0]);
      } else {
        const e_9 = matchValue_13.fields[0];
        return new FSharpResult$2(1, e_9);
      }
    } else {
      const e_8 = matchValue_12.fields[0];
      return new FSharpResult$2(1, e_8);
    }
  };
}
var pParamsInsideParens = (() => {
  const p = splitBy(",", pAst);
  return (tupledArg) => {
    let this$;
    const s_1 = tupledArg[1];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), p([void 0, s_1]));
    if (matchValue.tag === 1) {
      const state_3 = matchValue.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$ = s_1, new Position(this$.startLine, this$.startColumn)), singleton(new ErrorType(0, "Params split by comma"))]), void 0]);
    } else {
      const x = matchValue;
      return x;
    }
  };
})();
var pCocoActionName = (() => {
  const p2 = charsTill("(");
  return (tupledArg) => {
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), pCoco([void 0, tupledArg[1]]));
    if (matchValue.tag === 0) {
      const state_3 = matchValue.fields[0][2];
      const s_2 = matchValue.fields[0][1];
      const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p2([void 0, s_2]));
      if (matchValue_1.tag === 0) {
        const state_5 = matchValue_1.fields[0][2];
        const s_3 = matchValue_1.fields[0][1];
        const r2 = matchValue_1.fields[0][0];
        return new FSharpResult$2(0, [r2, s_3, void 0]);
      } else {
        const e_1 = matchValue_1.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
})();
var pEasing = (() => {
  let p_6;
  let p1_4;
  let p1_2;
  let p1;
  const str = ".easing(cc.";
  p1 = (tupledArg) => {
    let this$, start_1, finish_1, len, line, column, this$_1;
    const str_1 = str;
    const s_1 = tupledArg[1];
    return StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, [str, (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
  };
  const p2 = charsTill("(");
  p1_2 = (tupledArg_1) => {
    const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p1([void 0, tupledArg_1[1]]));
    if (matchValue_1.tag === 0) {
      const state_6 = matchValue_1.fields[0][2];
      const s_5 = matchValue_1.fields[0][1];
      const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p2([void 0, s_5]));
      if (matchValue_2.tag === 0) {
        const state_8 = matchValue_2.fields[0][2];
        const s_6 = matchValue_2.fields[0][1];
        const r2 = matchValue_2.fields[0][0];
        return new FSharpResult$2(0, [r2, s_6, void 0]);
      } else {
        const e_1 = matchValue_2.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_1.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  p1_4 = (tupledArg_4) => {
    const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p1_2([void 0, tupledArg_4[1]]));
    if (matchValue_3.tag === 0) {
      const state_12 = matchValue_3.fields[0][2];
      const s_9 = matchValue_3.fields[0][1];
      const r1 = matchValue_3.fields[0][0];
      const matchValue_4 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), pParamsInsideParens([void 0, s_9]));
      if (matchValue_4.tag === 0) {
        const state_14 = matchValue_4.fields[0][2];
        const s_10 = matchValue_4.fields[0][1];
        const r2_1 = matchValue_4.fields[0][0];
        return new FSharpResult$2(0, [[r1, r2_1], s_10, void 0]);
      } else {
        const e_3 = matchValue_4.fields[0];
        return new FSharpResult$2(1, e_3);
      }
    } else {
      const e_2 = matchValue_3.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
  let p2_3;
  const str_2 = ")";
  p2_3 = (tupledArg_7) => {
    let this$_2, start_3, finish_3, len_1, line_1, column_1, this$_3;
    const str_3 = str_2;
    const s_12 = tupledArg_7[1];
    return StringSegmentModule_startsWith(str_3, s_12) ? new FSharpResult$2(0, [str_2, (this$_2 = s_12, start_3 = defaultArg(str_3.length, 0) | 0, finish_3 = defaultArg(void 0, this$_2.length - 1) | 0, start_3 >= 0 && start_3 <= this$_2.length && finish_3 < max((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_2.length) ? (len_1 = max((x_3, y_3) => comparePrimitives(x_3, y_3), 0, finish_3 - start_3 + 1) | 0, line_1 = this$_2.startLine, column_1 = this$_2.startColumn, (() => {
      for (let i_1 = 0; i_1 <= start_3 - 1; i_1++) {
        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
          line_1 = line_1 + 1 | 0;
          column_1 = 0;
        } else {
          column_1 = column_1 + 1 | 0;
        }
      }
    })(), new StringSegment(this$_2.startIndex + start_3, len_1, this$_2.underlying, line_1, column_1)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)), void 0]) : new FSharpResult$2(1, [singleton([(this$_3 = s_12, new Position(this$_3.startLine, this$_3.startColumn)), singleton(new ErrorType(0, "'" + str_3 + "'"))]), void 0]);
  };
  p_6 = (tupledArg_8) => {
    const matchValue_6 = Result_MapError((tupledArg_9) => ParseError_sort(tupledArg_9[0], void 0), p1_4([void 0, tupledArg_8[1]]));
    if (matchValue_6.tag === 0) {
      const state_21 = matchValue_6.fields[0][2];
      const s_16 = matchValue_6.fields[0][1];
      const r1_1 = matchValue_6.fields[0][0];
      const matchValue_7 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), p2_3([void 0, s_16]));
      if (matchValue_7.tag === 0) {
        const state_23 = matchValue_7.fields[0][2];
        const s_17 = matchValue_7.fields[0][1];
        return new FSharpResult$2(0, [r1_1, s_17, void 0]);
      } else {
        const e_5 = matchValue_7.fields[0];
        return new FSharpResult$2(1, e_5);
      }
    } else {
      const e_4 = matchValue_6.fields[0];
      return new FSharpResult$2(1, e_4);
    }
  };
  return (tupledArg_11) => {
    let this$_4;
    const s_19 = tupledArg_11[1];
    const matchValue_8 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), p_6([void 0, s_19]));
    if (matchValue_8.tag === 1) {
      const state_27 = matchValue_8.fields[0][1];
      return new FSharpResult$2(1, [singleton([(this$_4 = s_19, new Position(this$_4.startLine, this$_4.startColumn)), singleton(new ErrorType(0, "Coco Easing action"))]), void 0]);
    } else {
      const x_4 = matchValue_8;
      return x_4;
    }
  };
})();
var pRepeatForever = (tupledArg) => {
  let this$, start_1, finish_1, len, line, column, this$_1;
  const str_1 = ".repeatForever()";
  const s_1 = tupledArg[1];
  return StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, [new Repeat(0), (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
    for (let i = 0; i <= start_1 - 1; i++) {
      if (this$.underlying[this$.startIndex + i] === "\n") {
        line = line + 1 | 0;
        column = 0;
      } else {
        column = column + 1 | 0;
      }
    }
  })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
};
var pRepeatLimit = (() => {
  let p_2;
  let p1;
  const str = ".repeat";
  p1 = (tupledArg) => {
    let this$, start_1, finish_1, len, line, column, this$_1;
    const str_1 = str;
    const s_1 = tupledArg[1];
    return StringSegmentModule_startsWith(str_1, s_1) ? new FSharpResult$2(0, [str, (this$ = s_1, start_1 = defaultArg(str_1.length, 0) | 0, finish_1 = defaultArg(void 0, this$.length - 1) | 0, start_1 >= 0 && start_1 <= this$.length && finish_1 < max((x, y) => comparePrimitives(x, y), start_1, this$.length) ? (len = max((x_1, y_1) => comparePrimitives(x_1, y_1), 0, finish_1 - start_1 + 1) | 0, line = this$.startLine, column = this$.startColumn, (() => {
      for (let i = 0; i <= start_1 - 1; i++) {
        if (this$.underlying[this$.startIndex + i] === "\n") {
          line = line + 1 | 0;
          column = 0;
        } else {
          column = column + 1 | 0;
        }
      }
    })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)), void 0]) : new FSharpResult$2(1, [singleton([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "'" + str_1 + "'"))]), void 0]);
  };
  const p2 = pInsideParens(pAst);
  p_2 = (tupledArg_1) => {
    const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), p1([void 0, tupledArg_1[1]]));
    if (matchValue_1.tag === 0) {
      const state_6 = matchValue_1.fields[0][2];
      const s_5 = matchValue_1.fields[0][1];
      const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p2([void 0, s_5]));
      if (matchValue_2.tag === 0) {
        const state_8 = matchValue_2.fields[0][2];
        const s_6 = matchValue_2.fields[0][1];
        const r2 = matchValue_2.fields[0][0];
        return new FSharpResult$2(0, [r2, s_6, void 0]);
      } else {
        const e_1 = matchValue_2.fields[0];
        return new FSharpResult$2(1, e_1);
      }
    } else {
      const e = matchValue_1.fields[0];
      return new FSharpResult$2(1, e);
    }
  };
  return (tupledArg_4) => {
    const matchValue_3 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p_2([void 0, tupledArg_4[1]]));
    if (matchValue_3.tag === 0) {
      const state_12 = matchValue_3.fields[0][2];
      const s_9 = matchValue_3.fields[0][1];
      const r = matchValue_3.fields[0][0];
      return new FSharpResult$2(0, [new Repeat(1, r), s_9, void 0]);
    } else {
      const e_2 = matchValue_3.fields[0];
      return new FSharpResult$2(1, e_2);
    }
  };
})();
var pRepeat = (tupledArg) => {
  const s_1 = tupledArg[1];
  const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), pRepeatForever([void 0, s_1]));
  if (matchValue.tag === 1) {
    const state_3 = matchValue.fields[0][1];
    const es = matchValue.fields[0][0];
    const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), pRepeatLimit([void 0, s_1]));
    if (matchValue_1.tag === 1) {
      const state_5 = matchValue_1.fields[0][1];
      const es$0027 = matchValue_1.fields[0][0];
      return new FSharpResult$2(1, [append(es, es$0027), void 0]);
    } else {
      const x_1 = matchValue_1;
      return x_1;
    }
  } else {
    const x = matchValue;
    return x;
  }
};
var pCocoAction = (tupledArg_19) => {
  let matchValue_5, state_30, s_19, r_5, matchValue_4, state_25, s_16, r_4, matchValue_3, s_1, matchValue, state_4, state_3, s_2, r, state_20, s_13, r_3, matchValue_2, s_4, matchValue_1, state_9, state_8, s_5, r_1, state_15, s_10, r_2, e, e_1, e_2, e_3, tupledArg_17, name, list, easing, repeat;
  const matchValue_6 = Result_MapError((tupledArg_20) => ParseError_sort(tupledArg_20[0], void 0), (matchValue_5 = Result_MapError((tupledArg_15) => ParseError_sort(tupledArg_15[0], void 0), pCocoActionName([void 0, tupledArg_19[1]])), matchValue_5.tag === 0 ? (state_30 = matchValue_5.fields[0][2], s_19 = matchValue_5.fields[0][1], r_5 = matchValue_5.fields[0][0], Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (matchValue_4 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), pParamsInsideParens([void 0, s_19])), matchValue_4.tag === 0 ? (state_25 = matchValue_4.fields[0][2], s_16 = matchValue_4.fields[0][1], r_4 = matchValue_4.fields[0][0], Result_MapError((tupledArg_13) => ParseError_sort(tupledArg_13[0], void 0), (matchValue_3 = Result_MapError((tupledArg_9) => ParseError_sort(tupledArg_9[0], void 0), (s_1 = s_16, matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), pEasing([void 0, s_1])), matchValue.tag === 1 ? (state_4 = matchValue.fields[0][1], new FSharpResult$2(0, [void 0, s_1, void 0])) : (state_3 = matchValue.fields[0][2], s_2 = matchValue.fields[0][1], r = matchValue.fields[0][0], new FSharpResult$2(0, [r, s_2, void 0])))), matchValue_3.tag === 0 ? (state_20 = matchValue_3.fields[0][2], s_13 = matchValue_3.fields[0][1], r_3 = matchValue_3.fields[0][0], Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), (matchValue_2 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), (s_4 = s_13, matchValue_1 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), pRepeat([void 0, s_4])), matchValue_1.tag === 1 ? (state_9 = matchValue_1.fields[0][1], new FSharpResult$2(0, [void 0, s_4, void 0])) : (state_8 = matchValue_1.fields[0][2], s_5 = matchValue_1.fields[0][1], r_1 = matchValue_1.fields[0][0], new FSharpResult$2(0, [r_1, s_5, void 0])))), matchValue_2.tag === 0 ? (state_15 = matchValue_2.fields[0][2], s_10 = matchValue_2.fields[0][1], r_2 = matchValue_2.fields[0][0], Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), new FSharpResult$2(0, [[r_5, r_4, r_3, r_2], s_10, void 0]))) : (e = matchValue_2.fields[0], new FSharpResult$2(1, e))))) : (e_1 = matchValue_3.fields[0], new FSharpResult$2(1, e_1))))) : (e_2 = matchValue_4.fields[0], new FSharpResult$2(1, e_2))))) : (e_3 = matchValue_5.fields[0], new FSharpResult$2(1, e_3))));
  if (matchValue_6.tag === 0) {
    const state_35 = matchValue_6.fields[0][2];
    const s_22 = matchValue_6.fields[0][1];
    const r_6 = matchValue_6.fields[0][0];
    return new FSharpResult$2(0, [(tupledArg_17 = r_6, name = tupledArg_17[0], list = tupledArg_17[1], easing = tupledArg_17[2], repeat = tupledArg_17[3], new Ast(3, new CocoAction(name, list, map((tupledArg_18) => {
      const name_1 = tupledArg_18[0];
      const paramList = tupledArg_18[1];
      return new Easing(name_1, paramList);
    }, easing), repeat))), s_22, void 0]);
  } else {
    const e_4 = matchValue_6.fields[0];
    return new FSharpResult$2(1, e_4);
  }
};
pAstRef.contents = (tupledArg_3) => {
  let s_1, go, this$_1;
  const s_3 = tupledArg_3[1];
  const matchValue_2 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (s_1 = s_3, go = (state_2_mut, errorsAcc_mut, _arg1_mut) => {
    let this$;
    go:
      while (true) {
        const state_2 = state_2_mut, errorsAcc = errorsAcc_mut, _arg1 = _arg1_mut;
        if (!isEmpty(_arg1)) {
          if (isEmpty(tail(_arg1))) {
            const p = head(_arg1);
            const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], tupledArg_1[1]), p([state_2, s_1]));
            if (matchValue.tag === 1) {
              const state_5 = matchValue.fields[0][1];
              const errors = matchValue.fields[0][0];
              return new FSharpResult$2(1, [append(errorsAcc, errors), state_5]);
            } else {
              const x = matchValue;
              return x;
            }
          } else {
            const p_2 = head(_arg1);
            const ps_2 = tail(_arg1);
            const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], tupledArg_2[1]), p_2([state_2, s_1]));
            if (matchValue_1.tag === 1) {
              const state_7 = matchValue_1.fields[0][1];
              const errors_1 = matchValue_1.fields[0][0];
              state_2_mut = state_7;
              errorsAcc_mut = append(errors_1, errorsAcc);
              _arg1_mut = ps_2;
              continue go;
            } else {
              const x_1 = matchValue_1;
              return x_1;
            }
          }
        } else {
          return new FSharpResult$2(1, [singleton([(this$ = s_1, new Position(this$.startLine, this$.startColumn)), singleton(new ErrorType(2, "No parsers given"))]), state_2]);
        }
        break;
      }
  }, go(void 0, empty(), ofArray([pCallFunc, pCocoAction, pNumber, pString, pVariable]))));
  if (matchValue_2.tag === 1) {
    const state_11 = matchValue_2.fields[0][1];
    return new FSharpResult$2(1, [singleton([(this$_1 = s_3, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(0, "string, number or function call"))]), void 0]);
  } else {
    const x_2 = matchValue_2;
    return x_2;
  }
};
var parser = pAst;

// generated/AstCompiler.js
function cppCocoConverter(name) {
  return Array.from(mapIndexed((i, c) => {
    if (i === 0) {
      return c.toLocaleUpperCase();
    } else {
      return c;
    }
  }, name.split(""))).join("");
}
function cppNumberConverter(value2) {
  const floor = Math.floor(value2);
  if (value2 === floor) {
    let copyOfStruct = ~~floor;
    return int32ToString(copyOfStruct);
  } else {
    return `${value2}f`;
  }
}
function compile(ast) {
  switch (ast.tag) {
    case 1: {
      const value_1 = ast.fields[0];
      return `"${value_1}"`;
    }
    case 2: {
      const value_2 = ast.fields[0];
      return value_2;
    }
    case 3: {
      const data = ast.fields[0];
      const dataParams = (data.Name === "sequence" ? true : data.Name === "spawn") ? append(data.Params, singleton(new Ast(2, "nullptr"))) : data.Params;
      const paramsString = join(", ", map3((ast_1) => compile(ast_1), dataParams));
      const wrapEasing = (inner, data_1) => {
        const paramsString_1 = join(", ", map3((ast_2) => compile(ast_2), data_1.Params));
        const lastParamsString = paramsString_1.length > 0 ? `, ${paramsString_1}` : "";
        return `${cppCocoConverter(data_1.Name)}::create(${inner}${lastParamsString})`;
      };
      const easing = (inner_1) => defaultArg(map(partialApply(1, wrapEasing, [inner_1]), data.Easing), inner_1);
      const wrapRepeat = (inner_2, data_2) => {
        if (data_2.tag === 1) {
          const data_3 = data_2.fields[0];
          return `Repeat::create(${inner_2}, ${compile(data_3)})`;
        } else {
          return `RepeatForever::create(${inner_2})`;
        }
      };
      const repeat = (inner_3) => defaultArg(map(partialApply(1, wrapRepeat, [inner_3]), data.Repeat), inner_3);
      return repeat(easing(`${cppCocoConverter(data.Name)}::create(${paramsString})`));
    }
    case 4: {
      const data_4 = ast.fields[0];
      return `CallFunc::create${data_4}`;
    }
    default: {
      const value2 = ast.fields[0];
      return cppNumberConverter(value2);
    }
  }
}

// generated/Library.js
var actions = ofArray(["cc.sequence", "cc.spawn", "cc.repeat", "cc.repeatForever", "cc.speed", "cc.show", "cc.hide", "cc.toggleVisibility", "cc.removeSelf", "cc.flipX", "cc.flipY", "cc.place", "cc.callFunc", "cc.targetedAction", "cc.moveTo", "cc.moveBy", "cc.rotateTo", "cc.rotateBy", "cc.scaleTo", "cc.scaleBy", "cc.skewTo", "cc.skewBy", "cc.jumpBy", "cc.jumpTo", "cc.follow", "cc.bezierTo", "cc.bezierBy", "cc.blink", "cc.fadeTo", "cc.fadeIn", "cc.fadeOut", "cc.tintTo", "cc.tintBy", "cc.delayTime"]);
var pRaw = (() => {
  const p_4 = (tupledArg) => CharParsers_anyChar(void 0, tupledArg[1]);
  let till;
  const ps = cons((tupledArg_1) => CharParsers_eof(void 0, tupledArg_1[1]), map3((str) => (tupledArg_2) => {
    let this$;
    const str_1 = str;
    const s_3 = tupledArg_2[1];
    return StringSegmentModule_startsWith(str_1, s_3) ? new FSharpResult$2(0, [void 0, s_3, void 0]) : new FSharpResult$2(1, [singleton([(this$ = s_3, new Position(this$.startLine, this$.startColumn)), singleton(new ErrorType(0, str_1))]), void 0]);
  }, actions));
  till = (tupledArg_3) => {
    const s_5 = tupledArg_3[1];
    const go = (state_7_mut, errorsAcc_mut, _arg1_mut) => {
      let this$_1;
      go:
        while (true) {
          const state_7 = state_7_mut, errorsAcc = errorsAcc_mut, _arg1 = _arg1_mut;
          if (!isEmpty(_arg1)) {
            if (isEmpty(tail(_arg1))) {
              const p = head(_arg1);
              const matchValue = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], tupledArg_4[1]), p([state_7, s_5]));
              if (matchValue.tag === 1) {
                const state_10 = matchValue.fields[0][1];
                const errors = matchValue.fields[0][0];
                return new FSharpResult$2(1, [append(errorsAcc, errors), state_10]);
              } else {
                const x = matchValue;
                return x;
              }
            } else {
              const p_2 = head(_arg1);
              const ps_2 = tail(_arg1);
              const matchValue_1 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], tupledArg_5[1]), p_2([state_7, s_5]));
              if (matchValue_1.tag === 1) {
                const state_12 = matchValue_1.fields[0][1];
                const errors_1 = matchValue_1.fields[0][0];
                state_7_mut = state_12;
                errorsAcc_mut = append(errors_1, errorsAcc);
                _arg1_mut = ps_2;
                continue go;
              } else {
                const x_1 = matchValue_1;
                return x_1;
              }
            }
          } else {
            return new FSharpResult$2(1, [singleton([(this$_1 = s_5, new Position(this$_1.startLine, this$_1.startColumn)), singleton(new ErrorType(2, "No parsers given"))]), state_7]);
          }
          break;
        }
    };
    return go(void 0, empty(), ps);
  };
  return (tupledArg_6) => {
    const till_1 = till;
    const f_1 = (s_6, _arg1_1) => s_6;
    const s_8 = tupledArg_6[1];
    const matchValue_2 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), p_4([void 0, s_8]));
    if (matchValue_2.tag === 0) {
      const state_19 = matchValue_2.fields[0][2];
      const s_10 = matchValue_2.fields[0][1];
      const c1 = matchValue_2.fields[0][0];
      const sb = CharParsers_StringBuilder_$ctor();
      CharParsers_StringBuilder__Append_Z721C83C5(sb, c1);
      const go_1 = (tupledArg_9_mut) => {
        go_1:
          while (true) {
            const tupledArg_9 = tupledArg_9_mut;
            const state_20 = tupledArg_9[0];
            const s_11 = tupledArg_9[1];
            const matchValue_4 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), till_1([void 0, s_11]));
            if (matchValue_4.tag === 1) {
              const state_23 = matchValue_4.fields[0][1];
              const matchValue_5 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), p_4([void 0, s_11]));
              if (matchValue_5.tag === 0) {
                const state_25 = matchValue_5.fields[0][2];
                const s_13 = matchValue_5.fields[0][1];
                const c_1 = matchValue_5.fields[0][0];
                CharParsers_StringBuilder__Append_Z721C83C5(sb, c_1);
                tupledArg_9_mut = [void 0, s_13];
                continue go_1;
              } else {
                const e_1 = matchValue_5.fields[0];
                return new FSharpResult$2(1, e_1);
              }
            } else {
              const state_22 = matchValue_4.fields[0][2];
              const s_12 = matchValue_4.fields[0][1];
              const a_1 = matchValue_4.fields[0][0];
              return new FSharpResult$2(0, [f_1(toString2(sb), void 0), s_12, void 0]);
            }
            break;
          }
      };
      return go_1([void 0, s_10]);
    } else {
      const state_16 = matchValue_2.fields[0][1];
      const es = matchValue_2.fields[0][0];
      return new FSharpResult$2(1, [es, void 0]);
    }
  };
})();
var pAction = (tupledArg) => {
  const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), parser([void 0, tupledArg[1]]));
  if (matchValue.tag === 0) {
    const state_3 = matchValue.fields[0][2];
    const s_2 = matchValue.fields[0][1];
    const r = matchValue.fields[0][0];
    return new FSharpResult$2(0, [compile(r), s_2, void 0]);
  } else {
    const e = matchValue.fields[0];
    return new FSharpResult$2(1, e);
  }
};
var parser2 = (() => {
  const resultForEmptySequence = empty;
  const p_6 = (tupledArg) => {
    const s_1 = tupledArg[1];
    const go = (state_2_mut, errorsAcc_mut, _arg1_mut) => {
      let this$;
      go:
        while (true) {
          const state_2 = state_2_mut, errorsAcc = errorsAcc_mut, _arg1 = _arg1_mut;
          if (!isEmpty(_arg1)) {
            if (isEmpty(tail(_arg1))) {
              const p = head(_arg1);
              const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], tupledArg_1[1]), p([state_2, s_1]));
              if (matchValue.tag === 1) {
                const state_5 = matchValue.fields[0][1];
                const errors = matchValue.fields[0][0];
                return new FSharpResult$2(1, [append(errorsAcc, errors), state_5]);
              } else {
                const x = matchValue;
                return x;
              }
            } else {
              const p_2 = head(_arg1);
              const ps_2 = tail(_arg1);
              const matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], tupledArg_2[1]), p_2([state_2, s_1]));
              if (matchValue_1.tag === 1) {
                const state_7 = matchValue_1.fields[0][1];
                const errors_1 = matchValue_1.fields[0][0];
                state_2_mut = state_7;
                errorsAcc_mut = append(errors_1, errorsAcc);
                _arg1_mut = ps_2;
                continue go;
              } else {
                const x_1 = matchValue_1;
                return x_1;
              }
            }
          } else {
            return new FSharpResult$2(1, [singleton([(this$ = s_1, new Position(this$.startLine, this$.startColumn)), singleton(new ErrorType(2, "No parsers given"))]), state_2]);
          }
          break;
        }
    };
    return go(void 0, empty(), ofArray([pAction, pRaw]));
  };
  const fp = defaultArg(void 0, p_6);
  const go_1 = (acc_mut, tupledArg_3_mut) => {
    go_1:
      while (true) {
        const acc = acc_mut, tupledArg_3 = tupledArg_3_mut;
        const state_8 = tupledArg_3[0];
        const s_2 = tupledArg_3[1];
        const matchValue_2 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), p_6([void 0, s_2]));
        if (matchValue_2.tag === 0) {
          const state_11 = matchValue_2.fields[0][2];
          const s_3 = matchValue_2.fields[0][1];
          const r = matchValue_2.fields[0][0];
          acc_mut = cons(r, acc);
          tupledArg_3_mut = [void 0, s_3];
          continue go_1;
        } else {
          const state_10 = matchValue_2.fields[0][1];
          return new FSharpResult$2(0, [reverse(acc), s_2, void 0]);
        }
        break;
      }
  };
  return (tupledArg_5) => {
    let f;
    const state_12 = tupledArg_5[0];
    const s_4 = tupledArg_5[1];
    const matchValue_3 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), fp([void 0, s_4]));
    if (matchValue_3.tag === 0) {
      const state_15 = matchValue_3.fields[0][2];
      const s_5 = matchValue_3.fields[0][1];
      const r_1 = matchValue_3.fields[0][0];
      const r_2 = singleton(r_1);
      return go_1(r_2, [void 0, s_5]);
    } else {
      const state_14 = matchValue_3.fields[0][1];
      const es = matchValue_3.fields[0][0];
      return resultForEmptySequence == null ? new FSharpResult$2(1, [es, void 0]) : new FSharpResult$2(0, [resultForEmptySequence == null ? null : (f = resultForEmptySequence, f()), s_4, void 0]);
    }
  };
})();
var ParseFailed = class extends FSharpException {
  constructor(Data0) {
    super();
    this.Data0 = Data0;
  }
};
function run(str) {
  let str_3;
  const matchValue = Result_MapError((tupledArg) => ParseError_sort(tupledArg[0], void 0), parser2([void 0, (str_3 = replace(replace(str, "\r\n", "\n"), "\r", "\n"), new StringSegment(0, str_3.length, str_3, 0, 0))]));
  if (matchValue.tag === 1) {
    const e = matchValue.fields[0];
    throw new ParseFailed(toString2(e));
  } else {
    const str_4 = matchValue.fields[0][0];
    return join("", str_4);
  }
}

// index.js
var import_fs = require("fs");
try {
  const fileName = process.argv[2];
  const data = (0, import_fs.readFileSync)(fileName, "utf8");
  console.log("data", data);
  (0, import_fs.writeFileSync)("out.txt", run(data), "utf8");
} catch (e) {
  console.error(e);
}
