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
  return compareArraysWith(x, y, compare);
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
      j = compare(x[key], y[key]);
      if (j !== 0) {
        return j;
      }
    }
  }
  return 0;
}
function compare(x, y) {
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

// generated/fable_modules/fable-library.3.6.3/Types.js
function seqToString(self) {
  let count = 0;
  let str = "[";
  for (const x of self) {
    if (count === 0) {
      str += toString(x);
    } else if (count === 100) {
      str += "; ...";
      break;
    } else {
      str += "; " + toString(x);
    }
    count++;
  }
  return str + "]";
}
function toString(x, callStack = 0) {
  if (x != null && typeof x === "object") {
    if (typeof x.toString === "function") {
      return x.toString();
    } else if (Symbol.iterator in x) {
      return seqToString(x);
    } else {
      const cons2 = Object.getPrototypeOf(x).constructor;
      return cons2 === Object && callStack < 10 ? "{ " + Object.entries(x).map(([k, v]) => k + " = " + toString(v, callStack + 1)).join("\n  ") + " }" : cons2.name;
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
      fieldStr = toString(fields[0]);
      withParens = fieldStr.indexOf(" ") >= 0;
    } else {
      fieldStr = fields.map((x) => toString(x)).join(", ");
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
  return "{ " + Object.entries(self).map(([k, v]) => k + " = " + toString(v)).join("\n  ") + " }";
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
      const result = compare(self[thisNames[i]], other[thisNames[i]]);
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
function join(delimiter, xs) {
  if (Array.isArray(xs)) {
    return xs.join(delimiter);
  } else {
    return Array.from(xs).join(delimiter);
  }
}

// generated/fable_modules/fable-library.3.6.3/Global.js
var SR_inputWasEmpty = "Collection was empty.";

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
      return compare(this.value, other instanceof Some ? other.value : other);
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
        str = str + toString(e["System.Collections.Generic.IEnumerator`1.get_Current"]());
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
function ofSeq(xs) {
  checkNonNull("source", xs);
  return getEnumerator(xs);
}
function generateIndexed(create, compute, dispose) {
  return mkSeq(() => {
    let i = -1;
    return Enumerator_generateWhileSome(create, (x) => {
      i = i + 1 | 0;
      return compute(i, x);
    }, dispose);
  });
}
function mapIndexed(mapping, xs) {
  return generateIndexed(() => ofSeq(xs), (i, e) => e["System.Collections.IEnumerator.MoveNext"]() ? some(mapping(i, e["System.Collections.Generic.IEnumerator`1.get_Current"]())) : void 0, (e_1) => {
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
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
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
              const c = compare(xs_1.head, ys_1.head) | 0;
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
function cons(x, xs) {
  return FSharpList_Cons_305B8EAC(x, xs);
}
function singleton(x) {
  return FSharpList_Cons_305B8EAC(x, FSharpList_get_Empty());
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
function ParingParensParser_lazyParser() {
  const dummyParser = (_arg1) => {
    throw new Error("a parser created with createParserForwardedToRef was not initialized");
  };
  const r = new FSharpRef(dummyParser);
  return [(stream) => r.contents(stream), r];
}
var ParingParensParser_patternInput$004011$002D1 = ParingParensParser_lazyParser();
var ParingParensParser_parseTreeRef = ParingParensParser_patternInput$004011$002D1[1];
var ParingParensParser_parseTree = ParingParensParser_patternInput$004011$002D1[0];
var ParingParensParser_node = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_between(FParsec_CharParsers_pchar("("), FParsec_CharParsers_pchar(")"), FParsec_Primitives_many(ParingParensParser_parseTree)), (arg0) => new Tree(1, arg0));
var ParingParensParser_leaf = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_many1((() => {
  const clo1 = FParsec_CharParsers_noneOf("()".split(""));
  return (arg10) => clo1(arg10);
})()), (chars) => join("", toArray(chars))), (arg0) => new Tree(0, arg0));
ParingParensParser_parseTreeRef.contents = FParsec_Primitives_op_LessBarGreater(ParingParensParser_node, ParingParensParser_leaf);
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
var ParingParensParser_showTree = FParsec_Primitives_op_BarGreaterGreater(ParingParensParser_parseTree, (_arg1) => ParingParensParser_show(_arg1));
var ParingParensParser_parser = ParingParensParser_showTree;

// generated/AstParser.js
function lazyParser() {
  const dummyParser = (_arg1) => {
    throw new Error("a parser created with createParserForwardedToRef was not initialized");
  };
  const r = new FSharpRef(dummyParser);
  return [(stream) => r.contents(stream), r];
}
var patternInput$004010 = lazyParser();
var pAstRef = patternInput$004010[1];
var pAst = patternInput$004010[0];
function charsTill(str) {
  return FParsec_Primitives_op_LessQmarkGreater(FParsec_CharParsers_charsTillString(str, false, 2147483647), `String till '${str}'`);
}
var pCoco = FParsec_CharParsers_pstring("cc.");
var pNumber = FParsec_Primitives_op_BarGreaterGreater(FParsec_CharParsers_pfloat(), (arg0) => new Ast(0, arg0));
var pString = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar('"'), charsTill('"')), (arg0) => new Ast(1, arg0)), "Quoted string");
var pVariable = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_CharParsers_regex("^[_$a-z][\\w$]*"), (arg0) => new Ast(2, arg0)), "Any variable or property");
var pCallFunc = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("cc.callFunc"), ParingParensParser_parser), (arg0) => new Ast(4, arg0));
var pParenOpen = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_DotGreaterGreater(FParsec_CharParsers_pchar("("), FParsec_Primitives_opt(FParsec_CharParsers_pchar("["))), "Open paren '(' or '(['");
var pParenClose = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_opt(FParsec_CharParsers_pchar("]")), FParsec_CharParsers_pchar(")")), "Close paren ')' or '])'");
function pInsideParens(parser_1) {
  return FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(pParenOpen, parser_1), pParenClose);
}
function spaces() {
  return FParsec_CharParsers_spaces();
}
function splitBy(token, parser_1) {
  return FParsec_Primitives_between(pParenOpen, pParenClose, FParsec_Primitives_op_GreaterGreaterDot(spaces(), FParsec_Primitives_sepEndBy(FParsec_Primitives_op_DotGreaterGreater(parser_1, spaces()), FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(token), spaces()))));
}
var pParamsInsideParens = FParsec_Primitives_op_LessQmarkGreater(splitBy(",", pAst), "Params split by comma");
var pCocoActionName = FParsec_Primitives_op_GreaterGreaterDot(pCoco, charsTill("("));
var pEasing = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_DotGreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(".easing(cc."), charsTill("(")), pParamsInsideParens), FParsec_CharParsers_pstring(")")), "Coco Easing action");
var pRepeatForever = FParsec_CharParsers_stringReturn(".repeatForever()", new Repeat(0));
var pRepeatLimit = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(".repeat"), pInsideParens(pAst)), (arg0) => new Repeat(1, arg0));
var pRepeat = FParsec_Primitives_op_LessBarGreater(pRepeatForever, pRepeatLimit);
var pCocoAction = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_tuple4(pCocoActionName, pParamsInsideParens, FParsec_Primitives_opt(pEasing), FParsec_Primitives_opt(pRepeat)), (tupledArg) => {
  const name = tupledArg[0];
  const list = tupledArg[1];
  const easing = tupledArg[2];
  const repeat = tupledArg[3];
  return new Ast(3, new CocoAction(name, list, map((tupledArg_1) => {
    const name_1 = tupledArg_1[0];
    const paramList = tupledArg_1[1];
    return new Easing(name_1, paramList);
  }, easing), repeat));
});
pAstRef.contents = FParsec_Primitives_op_LessQmarkGreater((() => {
  const clo1 = FParsec_Primitives_choice([pCallFunc, pCocoAction, pNumber, pString, pVariable]);
  return (arg10) => clo1(arg10);
})(), "string, number or function call");
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
var pRaw = FParsec_CharParsers_many1CharsTill(FParsec_CharParsers_anyChar(), (() => {
  const clo1 = FParsec_Primitives_choice(cons(FParsec_CharParsers_eof(), map3((arg00$0040) => FParsec_CharParsers_followedByString(arg00$0040), actions)));
  return (arg10) => clo1(arg10);
})());
var pAction = FParsec_Primitives_op_BarGreaterGreater(parser, (ast) => compile(ast));
var parser2 = FParsec_Primitives_many((() => {
  const clo1 = FParsec_Primitives_choice([pAction, pRaw]);
  return (arg10) => clo1(arg10);
})());
var ParseFailed = class extends FSharpException {
  constructor(Data0) {
    super();
    this.Data0 = Data0;
  }
};
function run(str) {
  const matchValue = FParsec_CharParsers_run(parser2, str);
  if (matchValue.tag === 1) {
    const e = matchValue.fields[0];
    throw new ParseFailed(e);
  } else {
    const str_1 = matchValue.fields[0];
    return join("", str_1);
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
