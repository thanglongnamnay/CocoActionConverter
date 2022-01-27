import { toString, Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { class_type, union_type, record_type, string_type, int32_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { contains, ofSeq } from "./fable_modules/fable-library.3.6.3/Set.js";
import { partialApply, max as max_4, compare, comparePrimitives } from "./fable_modules/fable-library.3.6.3/Util.js";
import { map as map_1, take, length as length_25, reverse, cons, empty as empty_1, append as append_1, head as head_3, tail, isEmpty, ofArray, singleton as singleton_1, sortByDescending } from "./fable_modules/fable-library.3.6.3/List.js";
import { defaultArg, map } from "./fable_modules/fable-library.3.6.3/Option.js";
import { toConsole, replace, substring, toFail, printf, toText, join } from "./fable_modules/fable-library.3.6.3/String.js";
import { map as map_2, empty, singleton, append, collect, delay, toList } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { FSharpChoice$2, Result_MapError, FSharpResult$2 } from "./fable_modules/fable-library.3.6.3/Choice.js";
import { isDigit } from "./fable_modules/fable-library.3.6.3/Char.js";
import { parse } from "./fable_modules/fable-library.3.6.3/Double.js";
import { op_UnaryNegation_Int32, op_UnaryNegation_Int16, op_UnaryNegation_Int8, parse as parse_1 } from "./fable_modules/fable-library.3.6.3/Int32.js";
import { op_UnaryNegation, parse as parse_2 } from "./fable_modules/fable-library.3.6.3/Long.js";
import { equalsWith, fill } from "./fable_modules/fable-library.3.6.3/Array.js";
import { create } from "./fable_modules/fable-library.3.6.3/Date.js";
import { create as create_1 } from "./fable_modules/fable-library.3.6.3/DateOffset.js";
import { create as create_2 } from "./fable_modules/fable-library.3.6.3/TimeSpan.js";

export class StringSegment extends Record {
    constructor(startIndex, length, underlying, startLine, startColumn) {
        super();
        this.startIndex = (startIndex | 0);
        this.length = (length | 0);
        this.underlying = underlying;
        this.startLine = (startLine | 0);
        this.startColumn = (startColumn | 0);
    }
}

export function StringSegment$reflection() {
    return record_type("Parsec.StringSegment", [], StringSegment, () => [["startIndex", int32_type], ["length", int32_type], ["underlying", string_type], ["startLine", int32_type], ["startColumn", int32_type]]);
}

export function StringSegmentModule_startsWith(s, seg) {
    const check = (i_mut) => {
        check:
        while (true) {
            const i = i_mut;
            if (i === s.length) {
                return true;
            }
            else if ((i === seg.length) ? true : (seg.underlying[i + seg.startIndex] !== s[i])) {
                return false;
            }
            else {
                i_mut = (i + 1);
                continue check;
            }
            break;
        }
    };
    return check(0);
}

export function StringSegmentModule_indexOfItem(c, seg) {
    const check = (i_mut) => {
        check:
        while (true) {
            const i = i_mut;
            if (i === seg.length) {
                return -1;
            }
            else if (seg.underlying[i + seg.startIndex] === c) {
                return i | 0;
            }
            else {
                i_mut = (i + 1);
                continue check;
            }
            break;
        }
    };
    return check(0) | 0;
}

export function StringSegmentModule_indexOfAny(cs, seg) {
    const s = ofSeq(cs, {
        Compare: (x, y) => comparePrimitives(x, y),
    });
    const check = (i_mut) => {
        check:
        while (true) {
            const i = i_mut;
            if (i === seg.length) {
                return -1;
            }
            else if (contains(seg.underlying[i + seg.startIndex], s)) {
                return i | 0;
            }
            else {
                i_mut = (i + 1);
                continue check;
            }
            break;
        }
    };
    return check(0) | 0;
}

export function StringSegmentModule_indexOfSequence(s, seg) {
    const check = (i_mut, j_mut) => {
        check:
        while (true) {
            const i = i_mut, j = j_mut;
            if (j === s.length) {
                return (i - j) | 0;
            }
            else if (((i + s.length) - j) > seg.length) {
                return -1;
            }
            else if (seg.underlying[i + seg.startIndex] === s[j]) {
                i_mut = (i + 1);
                j_mut = (j + 1);
                continue check;
            }
            else {
                i_mut = (i + 1);
                j_mut = 0;
                continue check;
            }
            break;
        }
    };
    return check(0, 0) | 0;
}

export class Position extends Record {
    constructor(Line, Col) {
        super();
        this.Line = (Line | 0);
        this.Col = (Col | 0);
    }
}

export function Position$reflection() {
    return record_type("Parsec.Position", [], Position, () => [["Line", int32_type], ["Col", int32_type]]);
}

export class ErrorType extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Expected", "Unexpected", "Message"];
    }
}

export function ErrorType$reflection() {
    return union_type("Parsec.ErrorType", [], ErrorType, () => [[["Item", string_type]], [["Item", string_type]], [["Item", string_type]]]);
}

export function ParseError_sort(_arg1_0, _arg1_1) {
    const _arg1 = [_arg1_0, _arg1_1];
    const state = _arg1[1];
    const es = _arg1[0];
    return [sortByDescending((tuple) => tuple[0], es, {
        Compare: (x, y) => compare(x, y),
    }), state];
}

export function ParseError_prettyPrint(_arg1_0, _arg1_1, input) {
    const es = _arg1_0;
    const input_1 = map((s) => s.split("\n"), input);
    return join("", toList(delay(() => collect((matchValue) => {
        const pos = matchValue[0];
        const msgs = matchValue[1];
        return append(singleton(toText(printf("at Line %i, Col %i:\n"))(pos.Line)(pos.Col)), delay(() => {
            let lines, arg10_1;
            return append((input_1 != null) ? ((lines = input_1, singleton((arg10_1 = lines[pos.Line], toText(printf("\u003e %s"))(arg10_1))))) : ((empty())), delay(() => collect((msg) => {
                switch (msg.tag) {
                    case 1: {
                        const label_1 = msg.fields[0];
                        return singleton(toText(printf("    Unexpected %s.\n"))(label_1));
                    }
                    case 2: {
                        const msg_1 = msg.fields[0];
                        return singleton(toText(printf("  %s\n"))(msg_1));
                    }
                    default: {
                        const label = msg.fields[0];
                        return singleton(toText(printf("    Expected %s.\n"))(label));
                    }
                }
            }, msgs)));
        }));
    }, es))));
}

export function Primitives_pzero(state, s) {
    let this$;
    return new FSharpResult$2(1, [singleton_1([(this$ = s, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "pzero"))]), state]);
}

export class Primitives_Inline {
    constructor() {
    }
}

export function Primitives_Inline$reflection() {
    return class_type("Parsec.Primitives.Inline", void 0, Primitives_Inline);
}

export class Primitives_ParserCombinator {
    constructor() {
    }
}

export function Primitives_ParserCombinator$reflection() {
    return class_type("Parsec.Primitives.ParserCombinator", void 0, Primitives_ParserCombinator);
}

export function Primitives_ParserCombinator_$ctor() {
    return new Primitives_ParserCombinator();
}

export const Primitives_parse = Primitives_ParserCombinator_$ctor();

export function CharParsers_anyChar(state, s) {
    let this$_1, this$_2, start_1, finish_1, len, line, column;
    let matchValue;
    const this$ = s;
    const index = 0;
    matchValue = (((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]);
    if (matchValue === "￿") {
        return new FSharpResult$2(1, [singleton_1([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "any char"), new ErrorType(1, "EOF")])]), state]);
    }
    else {
        const c = matchValue;
        return new FSharpResult$2(0, [c, (this$_2 = s, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
            for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                    line = ((line + 1) | 0);
                    column = 0;
                }
                else {
                    column = ((column + 1) | 0);
                }
            }
        })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), state]);
    }
}

export function CharParsers_skipAnyChar(state, s) {
    let this$, index, this$_1, this$_2, start_1, finish_1, len, line, column;
    if (((this$ = s, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))) === "￿") {
        return new FSharpResult$2(1, [singleton_1([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, "any char"), new ErrorType(1, "EOF")])]), state]);
    }
    else {
        return new FSharpResult$2(0, [void 0, (this$_2 = s, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
            for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                    line = ((line + 1) | 0);
                    column = 0;
                }
                else {
                    column = ((column + 1) | 0);
                }
            }
        })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), state]);
    }
}

export function CharParsers_spaces() {
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
            matchValue = (((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]);
            switch (matchValue) {
                case "\t":
                case "\n":
                case " ": {
                    tupledArg_mut = [state, (this$_1 = s, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_1.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_1.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_1.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_1.startLine, (column = this$_1.startColumn, ((() => {
                        for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                            if (this$_1.underlying[this$_1.startIndex + i_1] === "\n") {
                                line = ((line + 1) | 0);
                                column = 0;
                            }
                            else {
                                column = ((column + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_1.startIndex + start_1, len, this$_1.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1))))];
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

export function CharParsers_spaces1() {
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
            matchValue = (((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]);
            switch (matchValue) {
                case "\t":
                case "\n":
                case " ": {
                    tupledArg_mut = [state, (this$_1 = s, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_1.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_1.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_1.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_1.startLine, (column = this$_1.startColumn, ((() => {
                        for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                            if (this$_1.underlying[this$_1.startIndex + i_1] === "\n") {
                                line = ((line + 1) | 0);
                                column = 0;
                            }
                            else {
                                column = ((column + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_1.startIndex + start_1, len, this$_1.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1))))];
                    continue go;
                }
                default: {
                    return new FSharpResult$2(0, [void 0, s, state]);
                }
            }
            break;
        }
    };
    return (tupledArg_1) => {
        let this$_3, start_3, finish_3, len_1, line_1, column_1, this$_4;
        const state_1 = tupledArg_1[0];
        const s_1 = tupledArg_1[1];
        let matchValue_2;
        const this$_2 = s_1;
        const index_1 = 0;
        matchValue_2 = (((index_1 < 0) ? true : (index_1 >= this$_2.length)) ? "￿" : this$_2.underlying[this$_2.startIndex + index_1]);
        switch (matchValue_2) {
            case "\t":
            case "\n":
            case " ": {
                return go([state_1, (this$_3 = s_1, (start_3 = (defaultArg(1, 0) | 0), (finish_3 = (defaultArg(void 0, this$_3.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_3.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_3.length))) ? ((len_1 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_3.startLine, (column_1 = this$_3.startColumn, ((() => {
                    for (let i_3 = 0; i_3 <= (start_3 - 1); i_3++) {
                        if (this$_3.underlying[this$_3.startIndex + i_3] === "\n") {
                            line_1 = ((line_1 + 1) | 0);
                            column_1 = 0;
                        }
                        else {
                            column_1 = ((column_1 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_3.startIndex + start_3, len_1, this$_3.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3))))]);
            }
            default: {
                return new FSharpResult$2(1, [singleton_1([(this$_4 = s_1, new Position(this$_4.startLine, this$_4.startColumn)), singleton_1(new ErrorType(0, "one or more spaces"))]), state_1]);
            }
        }
    };
}

export function CharParsers_eof(state, s) {
    let this$, index, this$_1;
    if (((this$ = s, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))) === "￿") {
        return new FSharpResult$2(0, [void 0, s, state]);
    }
    else {
        return new FSharpResult$2(1, [singleton_1([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(0, "EOF"))]), state]);
    }
}

export class CharParsers_StringBuilder {
    constructor(s) {
        this["s@784"] = s;
    }
    toString() {
        const __ = this;
        return __["s@784"];
    }
}

export function CharParsers_StringBuilder$reflection() {
    return class_type("Parsec.CharParsers.StringBuilder", void 0, CharParsers_StringBuilder);
}

export function CharParsers_StringBuilder_$ctor_Z721C83C5(s) {
    return new CharParsers_StringBuilder(s);
}

export function CharParsers_StringBuilder_$ctor() {
    return CharParsers_StringBuilder_$ctor_Z721C83C5("");
}

export function CharParsers_StringBuilder__get_Length(__) {
    return __["s@784"].length;
}

export function CharParsers_StringBuilder__Append_Z721C83C5(sb, s$0027) {
    sb["s@784"] = (sb["s@784"] + s$0027);
    return sb;
}

export function CharParsers_StringBuilder__Remove_Z37302880(sb, startIndex, length) {
    if ((startIndex + length) >= sb["s@784"].length) {
        sb["s@784"] = substring(sb["s@784"], 0, startIndex);
    }
    else {
        sb["s@784"] = (substring(sb["s@784"], 0, startIndex) + substring(sb["s@784"], startIndex + length));
    }
    return sb;
}

export const CharParsers_Internal_pfloatUnit = (() => {
    let p1_9, p_5, p2_8, p_11, p2_2, cond_1, go_1, p3, p_30, p_27, p2_6, cond_9, go_2;
    const ps = ofArray([(tupledArg) => {
        let this$, start_1, finish_1, len, line, column, this$_1;
        const str_1 = "NaN";
        const s_1 = tupledArg[1];
        return StringSegmentModule_startsWith(str_1, s_1) ? (new FSharpResult$2(0, ["NaN", (this$ = s_1, (start_1 = (defaultArg(str_1.length, 0) | 0), (finish_1 = (defaultArg(void 0, this$.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$.startLine, (column = this$.startColumn, ((() => {
            for (let i = 0; i <= (start_1 - 1); i++) {
                if (this$.underlying[this$.startIndex + i] === "\n") {
                    line = ((line + 1) | 0);
                    column = 0;
                }
                else {
                    column = ((column + 1) | 0);
                }
            }
        })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_1) + "\u0027"))]), void 0]));
    }, (tupledArg_5) => {
        let str_3, s_4, this$_2, start_3, finish_3, len_1, line_1, column_1, this$_3, s_10, matchValue_3, str_5, s_7, this$_4, start_5, finish_5, len_2, line_2, column_2, this$_5, state_13, state_12, s_11;
        const matchValue_4 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), (str_3 = "Inf", (s_4 = tupledArg_5[1], StringSegmentModule_startsWith(str_3, s_4) ? (new FSharpResult$2(0, ["Infinity", (this$_2 = s_4, (start_3 = (defaultArg(str_3.length, 0) | 0), (finish_3 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_2.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_2.length))) ? ((len_1 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_2.startLine, (column_1 = this$_2.startColumn, ((() => {
            for (let i_1 = 0; i_1 <= (start_3 - 1); i_1++) {
                if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                    line_1 = ((line_1 + 1) | 0);
                    column_1 = 0;
                }
                else {
                    column_1 = ((column_1 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_2.startIndex + start_3, len_1, this$_2.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_4, new Position(this$_3.startLine, this$_3.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_3) + "\u0027"))]), void 0])))));
        if (matchValue_4.tag === 0) {
            const state_17 = matchValue_4.fields[0][2];
            const s_14 = matchValue_4.fields[0][1];
            const r1 = matchValue_4.fields[0][0];
            const matchValue_5 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (s_10 = s_14, (matchValue_3 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (str_5 = "inity", (s_7 = s_10, StringSegmentModule_startsWith(str_5, s_7) ? (new FSharpResult$2(0, [void 0, (this$_4 = s_7, (start_5 = (defaultArg(str_5.length, 0) | 0), (finish_5 = (defaultArg(void 0, this$_4.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_4.length)) && (finish_5 < max_4((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_4.length))) ? ((len_2 = (max_4((x_5, y_5) => comparePrimitives(x_5, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_4.startLine, (column_2 = this$_4.startColumn, ((() => {
                for (let i_2 = 0; i_2 <= (start_5 - 1); i_2++) {
                    if (this$_4.underlying[this$_4.startIndex + i_2] === "\n") {
                        line_2 = ((line_2 + 1) | 0);
                        column_2 = 0;
                    }
                    else {
                        column_2 = ((column_2 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_4.startIndex + start_5, len_2, this$_4.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_5 = s_7, new Position(this$_5.startLine, this$_5.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_5) + "\u0027"))]), void 0]))))), (matchValue_3.tag === 1) ? ((state_13 = matchValue_3.fields[0][1], new FSharpResult$2(0, [void 0, s_10, void 0]))) : ((state_12 = matchValue_3.fields[0][2], (s_11 = matchValue_3.fields[0][1], new FSharpResult$2(0, [void 0, s_11, void 0])))))));
            if (matchValue_5.tag === 0) {
                const state_19 = matchValue_5.fields[0][2];
                const s_15 = matchValue_5.fields[0][1];
                return new FSharpResult$2(0, [r1, s_15, void 0]);
            }
            else {
                const e_1 = matchValue_5.fields[0];
                return new FSharpResult$2(1, e_1);
            }
        }
        else {
            const e = matchValue_4.fields[0];
            return new FSharpResult$2(1, e);
        }
    }, (p1_9 = ((p_5 = ((tupledArg_8) => {
        let this$_7, this$_8, start_7, finish_7, len_3, line_3, column_3, this$_9;
        const label = "[0-9]";
        const s_18 = tupledArg_8[1];
        let matchValue_6;
        const this$_6 = s_18;
        const index = 0;
        matchValue_6 = (((index < 0) ? true : (index >= this$_6.length)) ? "￿" : this$_6.underlying[this$_6.startIndex + index]);
        if (matchValue_6 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_7 = s_18, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c = matchValue_6;
            if (isDigit(c)) {
                return new FSharpResult$2(0, [c, (this$_8 = s_18, (start_7 = (defaultArg(1, 0) | 0), (finish_7 = (defaultArg(void 0, this$_8.length - 1) | 0), (((start_7 >= 0) && (start_7 <= this$_8.length)) && (finish_7 < max_4((x_6, y_6) => comparePrimitives(x_6, y_6), start_7, this$_8.length))) ? ((len_3 = (max_4((x_7, y_7) => comparePrimitives(x_7, y_7), 0, (finish_7 - start_7) + 1) | 0), (line_3 = this$_8.startLine, (column_3 = this$_8.startColumn, ((() => {
                    for (let i_4 = 0; i_4 <= (start_7 - 1); i_4++) {
                        if (this$_8.underlying[this$_8.startIndex + i_4] === "\n") {
                            line_3 = ((line_3 + 1) | 0);
                            column_3 = 0;
                        }
                        else {
                            column_3 = ((column_3 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_8.startIndex + start_7, len_3, this$_8.underlying, line_3, column_3)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_9 = s_18, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c)])]), void 0]);
            }
        }
    }), (tupledArg_9) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb), s_22, void 0]);
                    }
                    break;
                }
            };
            return go([void 0, s_21]);
        }
        else {
            const state_28 = matchValue_8.fields[0][1];
            const es = matchValue_8.fields[0][0];
            return new FSharpResult$2(1, [es, void 0]);
        }
    })), (p2_8 = ((p_11 = ((p2_2 = ((cond_1 = ((c_6) => isDigit(c_6)), (go_1 = ((i_7_mut, tupledArg_14_mut) => {
        let this$_16, start_11, finish_11, len_5, line_5, column_5;
        go_1:
        while (true) {
            const i_7 = i_7_mut, tupledArg_14 = tupledArg_14_mut;
            const state_37 = tupledArg_14[0];
            const s_32 = tupledArg_14[1];
            let c_8;
            const this$_14 = s_32;
            const index_2 = i_7 | 0;
            c_8 = (((index_2 < 0) ? true : (index_2 >= this$_14.length)) ? "￿" : this$_14.underlying[this$_14.startIndex + index_2]);
            if (i_7 === 0) {
                if (cond_1(c_8)) {
                    i_7_mut = (i_7 + 1);
                    tupledArg_14_mut = [state_37, s_32];
                    continue go_1;
                }
                else {
                    return new FSharpResult$2(0, [void 0, s_32, state_37]);
                }
            }
            else if (cond_1(c_8)) {
                i_7_mut = (i_7 + 1);
                tupledArg_14_mut = [state_37, s_32];
                continue go_1;
            }
            else {
                return new FSharpResult$2(0, [void 0, (this$_16 = s_32, (start_11 = (defaultArg(i_7, 0) | 0), (finish_11 = (defaultArg(void 0, this$_16.length - 1) | 0), (((start_11 >= 0) && (start_11 <= this$_16.length)) && (finish_11 < max_4((x_10, y_10) => comparePrimitives(x_10, y_10), start_11, this$_16.length))) ? ((len_5 = (max_4((x_11, y_11) => comparePrimitives(x_11, y_11), 0, (finish_11 - start_11) + 1) | 0), (line_5 = this$_16.startLine, (column_5 = this$_16.startColumn, ((() => {
                    for (let i_9 = 0; i_9 <= (start_11 - 1); i_9++) {
                        if (this$_16.underlying[this$_16.startIndex + i_9] === "\n") {
                            line_5 = ((line_5 + 1) | 0);
                            column_5 = 0;
                        }
                        else {
                            column_5 = ((column_5 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_16.startIndex + start_11, len_5, this$_16.underlying, line_5, column_5)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)))), state_37]);
            }
            break;
        }
    }), partialApply(1, go_1, [0])))), (tupledArg_15) => {
        let c_5, s_25, matchValue_10, this$_10, index_1, this$_11, head, this$_12, start_9, finish_9, len_4, line_4, column_4, this$_13;
        const matchValue_13 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (c_5 = ".", (s_25 = tupledArg_15[1], (matchValue_10 = ((this$_10 = s_25, (index_1 = 0, ((index_1 < 0) ? true : (index_1 >= this$_10.length)) ? "￿" : this$_10.underlying[this$_10.startIndex + index_1]))), (matchValue_10 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_11 = s_25, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_5) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head = matchValue_10, (head === c_5) ? (new FSharpResult$2(0, [void 0, (this$_12 = s_25, (start_9 = (defaultArg(1, 0) | 0), (finish_9 = (defaultArg(void 0, this$_12.length - 1) | 0), (((start_9 >= 0) && (start_9 <= this$_12.length)) && (finish_9 < max_4((x_8, y_8) => comparePrimitives(x_8, y_8), start_9, this$_12.length))) ? ((len_4 = (max_4((x_9, y_9) => comparePrimitives(x_9, y_9), 0, (finish_9 - start_9) + 1) | 0), (line_4 = this$_12.startLine, (column_4 = this$_12.startColumn, ((() => {
            for (let i_6 = 0; i_6 <= (start_9 - 1); i_6++) {
                if (this$_12.underlying[this$_12.startIndex + i_6] === "\n") {
                    line_4 = ((line_4 + 1) | 0);
                    column_4 = 0;
                }
                else {
                    column_4 = ((column_4 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_12.startIndex + start_9, len_4, this$_12.underlying, line_4, column_4)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_13 = s_25, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_5) + "\u0027"), new ErrorType(1, ("\u0027" + head) + "\u0027")])]), void 0]))))))));
        if (matchValue_13.tag === 0) {
            const state_42 = matchValue_13.fields[0][2];
            const s_35 = matchValue_13.fields[0][1];
            const matchValue_14 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), p2_2([void 0, s_35]));
            if (matchValue_14.tag === 0) {
                const state_44 = matchValue_14.fields[0][2];
                const s_36 = matchValue_14.fields[0][1];
                const r2 = matchValue_14.fields[0][0];
                return new FSharpResult$2(0, [void 0, s_36, void 0]);
            }
            else {
                const e_3 = matchValue_14.fields[0];
                return new FSharpResult$2(1, e_3);
            }
        }
        else {
            const e_2 = matchValue_13.fields[0];
            return new FSharpResult$2(1, e_2);
        }
    })), (tupledArg_18) => {
        const s_38 = tupledArg_18[1];
        const matchValue_15 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), p_11([void 0, s_38]));
        if (matchValue_15.tag === 0) {
            const state_48 = matchValue_15.fields[0][2];
            const s$0027 = matchValue_15.fields[0][1];
            let str_6;
            let this$_18;
            const this$_17 = s_38;
            const finish_12 = (s$0027.startIndex - s_38.startIndex) - 1;
            const start_13 = defaultArg(0, 0) | 0;
            const finish_13 = defaultArg(finish_12, this$_17.length - 1) | 0;
            if (((start_13 >= 0) && (start_13 <= this$_17.length)) && (finish_13 < max_4((x_12, y_12) => comparePrimitives(x_12, y_12), start_13, this$_17.length))) {
                const len_6 = max_4((x_13, y_13) => comparePrimitives(x_13, y_13), 0, (finish_13 - start_13) + 1) | 0;
                let line_6 = this$_17.startLine;
                let column_6 = this$_17.startColumn;
                for (let i_10 = 0; i_10 <= (start_13 - 1); i_10++) {
                    if (this$_17.underlying[this$_17.startIndex + i_10] === "\n") {
                        line_6 = ((line_6 + 1) | 0);
                        column_6 = 0;
                    }
                    else {
                        column_6 = ((column_6 + 1) | 0);
                    }
                }
                this$_18 = (new StringSegment(this$_17.startIndex + start_13, len_6, this$_17.underlying, line_6, column_6));
            }
            else {
                this$_18 = toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13);
            }
            str_6 = substring(this$_18.underlying, this$_18.startIndex, this$_18.length);
            return new FSharpResult$2(0, [str_6, s$0027, void 0]);
        }
        else {
            const e_4 = matchValue_15.fields[0];
            return new FSharpResult$2(1, e_4);
        }
    })), (p3 = ((p_30 = ((p_27 = ((p2_6 = ((cond_9 = ((c_11) => isDigit(c_11)), (go_2 = ((i_15_mut, tupledArg_31_mut) => {
        let this$_28, this$_29, start_19, finish_19, len_9, line_9, column_9;
        go_2:
        while (true) {
            const i_15 = i_15_mut, tupledArg_31 = tupledArg_31_mut;
            const state_76 = tupledArg_31[0];
            const s_56 = tupledArg_31[1];
            let c_13;
            const this$_27 = s_56;
            const index_5 = i_15 | 0;
            c_13 = (((index_5 < 0) ? true : (index_5 >= this$_27.length)) ? "￿" : this$_27.underlying[this$_27.startIndex + index_5]);
            if (i_15 === 0) {
                if (cond_9(c_13)) {
                    i_15_mut = (i_15 + 1);
                    tupledArg_31_mut = [state_76, s_56];
                    continue go_2;
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_28 = s_56, new Position(this$_28.startLine, this$_28.startColumn)), singleton_1(new ErrorType(0, "a char satisfying the condition"))]), state_76]);
                }
            }
            else if (cond_9(c_13)) {
                i_15_mut = (i_15 + 1);
                tupledArg_31_mut = [state_76, s_56];
                continue go_2;
            }
            else {
                return new FSharpResult$2(0, [void 0, (this$_29 = s_56, (start_19 = (defaultArg(i_15, 0) | 0), (finish_19 = (defaultArg(void 0, this$_29.length - 1) | 0), (((start_19 >= 0) && (start_19 <= this$_29.length)) && (finish_19 < max_4((x_20, y_18) => comparePrimitives(x_20, y_18), start_19, this$_29.length))) ? ((len_9 = (max_4((x_21, y_19) => comparePrimitives(x_21, y_19), 0, (finish_19 - start_19) + 1) | 0), (line_9 = this$_29.startLine, (column_9 = this$_29.startColumn, ((() => {
                    for (let i_17 = 0; i_17 <= (start_19 - 1); i_17++) {
                        if (this$_29.underlying[this$_29.startIndex + i_17] === "\n") {
                            line_9 = ((line_9 + 1) | 0);
                            column_9 = 0;
                        }
                        else {
                            column_9 = ((column_9 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_29.startIndex + start_19, len_9, this$_29.underlying, line_9, column_9)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)))), state_76]);
            }
            break;
        }
    }), partialApply(1, go_2, [0])))), (tupledArg_32) => {
        let matchValue_24, matchValue_19, label_3, s_40, matchValue_17, this$_19, index_3, this$_20, c_9, _arg1, this$_21, start_15, finish_15, len_7, line_7, column_7, this$_22, state_56, s_43, e_5, state_73, s_54, matchValue_25, s_50, matchValue_23, matchValue_22, label_5, s_45, matchValue_20, this$_23, index_4, this$_24, c_10, _arg2, this$_25, start_17, finish_17, len_8, line_8, column_8, this$_26, state_64, s_48, e_6, state_69, state_68, s_51, state_75, s_55, r2_1, e_8, e_7;
        const matchValue_27 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), (matchValue_24 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), (matchValue_19 = Result_MapError((tupledArg_22) => ParseError_sort(tupledArg_22[0], void 0), (label_3 = "a char with condition", (s_40 = tupledArg_32[1], (matchValue_17 = ((this$_19 = s_40, (index_3 = 0, ((index_3 < 0) ? true : (index_3 >= this$_19.length)) ? "￿" : this$_19.underlying[this$_19.startIndex + index_3]))), (matchValue_17 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_20 = s_40, new Position(this$_20.startLine, this$_20.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0])) : ((c_9 = matchValue_17, ((_arg1 = c_9, (_arg1 === "E") ? true : (_arg1 === "e"))) ? (new FSharpResult$2(0, [c_9, (this$_21 = s_40, (start_15 = (defaultArg(1, 0) | 0), (finish_15 = (defaultArg(void 0, this$_21.length - 1) | 0), (((start_15 >= 0) && (start_15 <= this$_21.length)) && (finish_15 < max_4((x_14, y_14) => comparePrimitives(x_14, y_14), start_15, this$_21.length))) ? ((len_7 = (max_4((x_15, y_15) => comparePrimitives(x_15, y_15), 0, (finish_15 - start_15) + 1) | 0), (line_7 = this$_21.startLine, (column_7 = this$_21.startColumn, ((() => {
            for (let i_12 = 0; i_12 <= (start_15 - 1); i_12++) {
                if (this$_21.underlying[this$_21.startIndex + i_12] === "\n") {
                    line_7 = ((line_7 + 1) | 0);
                    column_7 = 0;
                }
                else {
                    column_7 = ((column_7 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_21.startIndex + start_15, len_7, this$_21.underlying, line_7, column_7)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_22 = s_40, new Position(this$_22.startLine, this$_22.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_9)])]), void 0])))))))), (matchValue_19.tag === 0) ? ((state_56 = matchValue_19.fields[0][2], (s_43 = matchValue_19.fields[0][1], new FSharpResult$2(0, [void 0, s_43, void 0])))) : ((e_5 = matchValue_19.fields[0], new FSharpResult$2(1, e_5))))), (matchValue_24.tag === 0) ? ((state_73 = matchValue_24.fields[0][2], (s_54 = matchValue_24.fields[0][1], (matchValue_25 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), (s_50 = s_54, (matchValue_23 = Result_MapError((tupledArg_27) => ParseError_sort(tupledArg_27[0], void 0), (matchValue_22 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), (label_5 = "a char with condition", (s_45 = s_50, (matchValue_20 = ((this$_23 = s_45, (index_4 = 0, ((index_4 < 0) ? true : (index_4 >= this$_23.length)) ? "￿" : this$_23.underlying[this$_23.startIndex + index_4]))), (matchValue_20 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_24 = s_45, new Position(this$_24.startLine, this$_24.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, "EOF")])]), void 0])) : ((c_10 = matchValue_20, ((_arg2 = c_10, (_arg2 === "+") ? true : (_arg2 === "-"))) ? (new FSharpResult$2(0, [c_10, (this$_25 = s_45, (start_17 = (defaultArg(1, 0) | 0), (finish_17 = (defaultArg(void 0, this$_25.length - 1) | 0), (((start_17 >= 0) && (start_17 <= this$_25.length)) && (finish_17 < max_4((x_17, y_16) => comparePrimitives(x_17, y_16), start_17, this$_25.length))) ? ((len_8 = (max_4((x_18, y_17) => comparePrimitives(x_18, y_17), 0, (finish_17 - start_17) + 1) | 0), (line_8 = this$_25.startLine, (column_8 = this$_25.startColumn, ((() => {
            for (let i_14 = 0; i_14 <= (start_17 - 1); i_14++) {
                if (this$_25.underlying[this$_25.startIndex + i_14] === "\n") {
                    line_8 = ((line_8 + 1) | 0);
                    column_8 = 0;
                }
                else {
                    column_8 = ((column_8 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_25.startIndex + start_17, len_8, this$_25.underlying, line_8, column_8)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_26 = s_45, new Position(this$_26.startLine, this$_26.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, c_10)])]), void 0])))))))), (matchValue_22.tag === 0) ? ((state_64 = matchValue_22.fields[0][2], (s_48 = matchValue_22.fields[0][1], new FSharpResult$2(0, [void 0, s_48, void 0])))) : ((e_6 = matchValue_22.fields[0], new FSharpResult$2(1, e_6))))), (matchValue_23.tag === 1) ? ((state_69 = matchValue_23.fields[0][1], new FSharpResult$2(0, [void 0, s_50, void 0]))) : ((state_68 = matchValue_23.fields[0][2], (s_51 = matchValue_23.fields[0][1], new FSharpResult$2(0, [void 0, s_51, void 0]))))))), (matchValue_25.tag === 0) ? ((state_75 = matchValue_25.fields[0][2], (s_55 = matchValue_25.fields[0][1], (r2_1 = matchValue_25.fields[0][0], new FSharpResult$2(0, [void 0, s_55, void 0]))))) : ((e_8 = matchValue_25.fields[0], new FSharpResult$2(1, e_8))))))) : ((e_7 = matchValue_24.fields[0], new FSharpResult$2(1, e_7)))));
        if (matchValue_27.tag === 0) {
            const state_81 = matchValue_27.fields[0][2];
            const s_59 = matchValue_27.fields[0][1];
            const matchValue_28 = Result_MapError((tupledArg_34) => ParseError_sort(tupledArg_34[0], void 0), p2_6([void 0, s_59]));
            if (matchValue_28.tag === 0) {
                const state_83 = matchValue_28.fields[0][2];
                const s_60 = matchValue_28.fields[0][1];
                const r2_2 = matchValue_28.fields[0][0];
                return new FSharpResult$2(0, [void 0, s_60, void 0]);
            }
            else {
                const e_10 = matchValue_28.fields[0];
                return new FSharpResult$2(1, e_10);
            }
        }
        else {
            const e_9 = matchValue_27.fields[0];
            return new FSharpResult$2(1, e_9);
        }
    })), (tupledArg_35) => {
        const s_62 = tupledArg_35[1];
        const matchValue_29 = Result_MapError((tupledArg_36) => ParseError_sort(tupledArg_36[0], void 0), p_27([void 0, s_62]));
        if (matchValue_29.tag === 1) {
            const state_88 = matchValue_29.fields[0][1];
            return new FSharpResult$2(0, [void 0, s_62, void 0]);
        }
        else {
            const state_87 = matchValue_29.fields[0][2];
            const s_63 = matchValue_29.fields[0][1];
            return new FSharpResult$2(0, [void 0, s_63, void 0]);
        }
    })), (tupledArg_37) => {
        const s_65 = tupledArg_37[1];
        const matchValue_30 = Result_MapError((tupledArg_38) => ParseError_sort(tupledArg_38[0], void 0), p_30([void 0, s_65]));
        if (matchValue_30.tag === 0) {
            const state_92 = matchValue_30.fields[0][2];
            const s$0027_1 = matchValue_30.fields[0][1];
            let str_7;
            let this$_31;
            const this$_30 = s_65;
            const finish_20 = (s$0027_1.startIndex - s_65.startIndex) - 1;
            const start_21 = defaultArg(0, 0) | 0;
            const finish_21 = defaultArg(finish_20, this$_30.length - 1) | 0;
            if (((start_21 >= 0) && (start_21 <= this$_30.length)) && (finish_21 < max_4((x_22, y_20) => comparePrimitives(x_22, y_20), start_21, this$_30.length))) {
                const len_10 = max_4((x_23, y_21) => comparePrimitives(x_23, y_21), 0, (finish_21 - start_21) + 1) | 0;
                let line_10 = this$_30.startLine;
                let column_10 = this$_30.startColumn;
                for (let i_18 = 0; i_18 <= (start_21 - 1); i_18++) {
                    if (this$_30.underlying[this$_30.startIndex + i_18] === "\n") {
                        line_10 = ((line_10 + 1) | 0);
                        column_10 = 0;
                    }
                    else {
                        column_10 = ((column_10 + 1) | 0);
                    }
                }
                this$_31 = (new StringSegment(this$_30.startIndex + start_21, len_10, this$_30.underlying, line_10, column_10));
            }
            else {
                this$_31 = toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_21)(finish_21);
            }
            str_7 = substring(this$_31.underlying, this$_31.startIndex, this$_31.length);
            return new FSharpResult$2(0, [str_7, s$0027_1, void 0]);
        }
        else {
            const e_11 = matchValue_30.fields[0];
            return new FSharpResult$2(1, e_11);
        }
    })), (tupledArg_46) => {
        let matchValue_33, state_103, s_73, r_1, matchValue_32, state_98, s_70, r, e_12, e_13;
        const matchValue_34 = Result_MapError((tupledArg_47) => ParseError_sort(tupledArg_47[0], void 0), p1_9([void 0, tupledArg_46[1]]));
        if (matchValue_34.tag === 0) {
            const state_108 = matchValue_34.fields[0][2];
            const s_76 = matchValue_34.fields[0][1];
            const r_2 = matchValue_34.fields[0][0];
            return Result_MapError((tupledArg_48) => ParseError_sort(tupledArg_48[0], void 0), (matchValue_33 = Result_MapError((tupledArg_44) => ParseError_sort(tupledArg_44[0], void 0), p2_8([void 0, s_76])), (matchValue_33.tag === 0) ? ((state_103 = matchValue_33.fields[0][2], (s_73 = matchValue_33.fields[0][1], (r_1 = matchValue_33.fields[0][0], Result_MapError((tupledArg_45) => ParseError_sort(tupledArg_45[0], void 0), (matchValue_32 = Result_MapError((tupledArg_41) => ParseError_sort(tupledArg_41[0], void 0), p3([void 0, s_73])), (matchValue_32.tag === 0) ? ((state_98 = matchValue_32.fields[0][2], (s_70 = matchValue_32.fields[0][1], (r = matchValue_32.fields[0][0], Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), new FSharpResult$2(0, [(r_2 + r_1) + r, s_70, void 0])))))) : ((e_12 = matchValue_32.fields[0], new FSharpResult$2(1, e_12))))))))) : ((e_13 = matchValue_33.fields[0], new FSharpResult$2(1, e_13)))));
        }
        else {
            const e_14 = matchValue_34.fields[0];
            return new FSharpResult$2(1, e_14);
        }
    })))]);
    return (tupledArg_49) => {
        const s_78 = tupledArg_49[1];
        const go_3 = (state_112_mut, _arg1_1_mut) => {
            let this$_33, this$_32;
            go_3:
            while (true) {
                const state_112 = state_112_mut, _arg1_1 = _arg1_1_mut;
                if (!isEmpty(_arg1_1)) {
                    if (isEmpty(tail(_arg1_1))) {
                        const p_42 = head_3(_arg1_1);
                        const matchValue_35 = Result_MapError((tupledArg_50) => ParseError_sort(tupledArg_50[0], tupledArg_50[1]), p_42([state_112, s_78]));
                        if (matchValue_35.tag === 1) {
                            const state_115 = matchValue_35.fields[0][1];
                            return new FSharpResult$2(1, [singleton_1([(this$_33 = s_78, new Position(this$_33.startLine, this$_33.startColumn)), singleton_1(new ErrorType(0, "float"))]), state_115]);
                        }
                        else {
                            const x_26 = matchValue_35;
                            return x_26;
                        }
                    }
                    else {
                        const p_44 = head_3(_arg1_1);
                        const ps_2 = tail(_arg1_1);
                        const matchValue_36 = Result_MapError((tupledArg_51) => ParseError_sort(tupledArg_51[0], tupledArg_51[1]), p_44([state_112, s_78]));
                        if (matchValue_36.tag === 1) {
                            const state_117 = matchValue_36.fields[0][1];
                            state_112_mut = state_117;
                            _arg1_1_mut = ps_2;
                            continue go_3;
                        }
                        else {
                            const x_27 = matchValue_36;
                            return x_27;
                        }
                    }
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_32 = s_78, new Position(this$_32.startLine, this$_32.startColumn)), singleton_1(new ErrorType(2, "No parsers given"))]), state_112]);
                }
                break;
            }
        };
        return go_3(void 0, ps);
    };
})();

export const CharParsers_Internal_pIntLikeUnit = (() => {
    let p_11, p2_2, p_5, p_22, p2_6, p_16, p_33, p2_10, p_27, p_40, p_36;
    let p_52;
    let p_49;
    let p2_12;
    const ps = ofArray([(p_11 = ((p2_2 = ((p_5 = ((tupledArg_8) => {
        let this$_9, c_1, this$_10, start_7, finish_7, len_3, line_3, column_3, this$_11;
        const label_2 = "[0-9a-fA-F]";
        const s_15 = tupledArg_8[1];
        let matchValue_7;
        const this$_8 = s_15;
        const index_1 = 0;
        matchValue_7 = (((index_1 < 0) ? true : (index_1 >= this$_8.length)) ? "￿" : this$_8.underlying[this$_8.startIndex + index_1]);
        if (matchValue_7 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_9 = s_15, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_2 = matchValue_7;
            if ((c_1 = c_2, (isDigit(c_1) ? true : (("A" <= c_1) && (c_1 <= "F"))) ? true : (("a" <= c_1) && (c_1 <= "f")))) {
                return new FSharpResult$2(0, [c_2, (this$_10 = s_15, (start_7 = (defaultArg(1, 0) | 0), (finish_7 = (defaultArg(void 0, this$_10.length - 1) | 0), (((start_7 >= 0) && (start_7 <= this$_10.length)) && (finish_7 < max_4((x_8, y_6) => comparePrimitives(x_8, y_6), start_7, this$_10.length))) ? ((len_3 = (max_4((x_9, y_7) => comparePrimitives(x_9, y_7), 0, (finish_7 - start_7) + 1) | 0), (line_3 = this$_10.startLine, (column_3 = this$_10.startColumn, ((() => {
                    for (let i_5 = 0; i_5 <= (start_7 - 1); i_5++) {
                        if (this$_10.underlying[this$_10.startIndex + i_5] === "\n") {
                            line_3 = ((line_3 + 1) | 0);
                            column_3 = 0;
                        }
                        else {
                            column_3 = ((column_3 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_10.startIndex + start_7, len_3, this$_10.underlying, line_3, column_3)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_11 = s_15, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, c_2)])]), void 0]);
            }
        }
    }), (tupledArg_9) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb), s_19, void 0]);
                    }
                    break;
                }
            };
            return go([void 0, s_18]);
        }
        else {
            const state_29 = matchValue_9.fields[0][1];
            const es_1 = matchValue_9.fields[0][0];
            return new FSharpResult$2(1, [es_1, void 0]);
        }
    })), (tupledArg_13) => {
        let s_12, matchValue_5, str_1, s_6, this$_4, start_3, finish_3, len_1, line_1, column_1, this$_5, state_18, es, matchValue_6, str_3, s_9, this$_6, start_5, finish_5, len_2, line_2, column_2, this$_7, state_20, es$0027, x_7, x_6;
        const matchValue_11 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), (s_12 = tupledArg_13[1], (matchValue_5 = Result_MapError((tupledArg_6) => ParseError_sort(tupledArg_6[0], void 0), (str_1 = "0x", (s_6 = s_12, StringSegmentModule_startsWith(str_1, s_6) ? (new FSharpResult$2(0, [void 0, (this$_4 = s_6, (start_3 = (defaultArg(str_1.length, 0) | 0), (finish_3 = (defaultArg(void 0, this$_4.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_4.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_4.length))) ? ((len_1 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_4.startLine, (column_1 = this$_4.startColumn, ((() => {
            for (let i_2 = 0; i_2 <= (start_3 - 1); i_2++) {
                if (this$_4.underlying[this$_4.startIndex + i_2] === "\n") {
                    line_1 = ((line_1 + 1) | 0);
                    column_1 = 0;
                }
                else {
                    column_1 = ((column_1 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_4.startIndex + start_3, len_1, this$_4.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_5 = s_6, new Position(this$_5.startLine, this$_5.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_1) + "\u0027"))]), void 0]))))), (matchValue_5.tag === 1) ? ((state_18 = matchValue_5.fields[0][1], (es = matchValue_5.fields[0][0], (matchValue_6 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (str_3 = "0X", (s_9 = s_12, StringSegmentModule_startsWith(str_3, s_9) ? (new FSharpResult$2(0, [void 0, (this$_6 = s_9, (start_5 = (defaultArg(str_3.length, 0) | 0), (finish_5 = (defaultArg(void 0, this$_6.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_6.length)) && (finish_5 < max_4((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_6.length))) ? ((len_2 = (max_4((x_5, y_5) => comparePrimitives(x_5, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_6.startLine, (column_2 = this$_6.startColumn, ((() => {
            for (let i_3 = 0; i_3 <= (start_5 - 1); i_3++) {
                if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
                    line_2 = ((line_2 + 1) | 0);
                    column_2 = 0;
                }
                else {
                    column_2 = ((column_2 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_6.startIndex + start_5, len_2, this$_6.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_7 = s_9, new Position(this$_7.startLine, this$_7.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_3) + "\u0027"))]), void 0]))))), (matchValue_6.tag === 1) ? ((state_20 = matchValue_6.fields[0][1], (es$0027 = matchValue_6.fields[0][0], new FSharpResult$2(1, [append_1(es, es$0027), void 0])))) : ((x_7 = matchValue_6, x_7)))))) : ((x_6 = matchValue_5, x_6)))));
        if (matchValue_11.tag === 0) {
            const state_37 = matchValue_11.fields[0][2];
            const s_23 = matchValue_11.fields[0][1];
            const matchValue_12 = Result_MapError((tupledArg_15) => ParseError_sort(tupledArg_15[0], void 0), p2_2([void 0, s_23]));
            if (matchValue_12.tag === 0) {
                const state_39 = matchValue_12.fields[0][2];
                const s_24 = matchValue_12.fields[0][1];
                const r2 = matchValue_12.fields[0][0];
                return new FSharpResult$2(0, [r2, s_24, void 0]);
            }
            else {
                const e_1 = matchValue_12.fields[0];
                return new FSharpResult$2(1, e_1);
            }
        }
        else {
            const e = matchValue_11.fields[0];
            return new FSharpResult$2(1, e);
        }
    })), (tupledArg_16) => {
        const matchValue_13 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), p_11([void 0, tupledArg_16[1]]));
        if (matchValue_13.tag === 0) {
            const state_43 = matchValue_13.fields[0][2];
            const s_27 = matchValue_13.fields[0][1];
            const r_1 = matchValue_13.fields[0][0];
            return new FSharpResult$2(0, [[16, r_1], s_27, void 0]);
        }
        else {
            const e_2 = matchValue_13.fields[0];
            return new FSharpResult$2(1, e_2);
        }
    }), (p_22 = ((p2_6 = ((p_16 = ((tupledArg_23) => {
        let this$_17, c_6, this$_18, start_13, finish_13, len_6, line_6, column_6, this$_19;
        const label_3 = "[0-7]";
        const s_38 = tupledArg_23[1];
        let matchValue_18;
        const this$_16 = s_38;
        const index_2 = 0;
        matchValue_18 = (((index_2 < 0) ? true : (index_2 >= this$_16.length)) ? "￿" : this$_16.underlying[this$_16.startIndex + index_2]);
        if (matchValue_18 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_17 = s_38, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_7 = matchValue_18;
            if ((c_6 = c_7, ("0" <= c_6) && (c_6 <= "7"))) {
                return new FSharpResult$2(0, [c_7, (this$_18 = s_38, (start_13 = (defaultArg(1, 0) | 0), (finish_13 = (defaultArg(void 0, this$_18.length - 1) | 0), (((start_13 >= 0) && (start_13 <= this$_18.length)) && (finish_13 < max_4((x_17, y_12) => comparePrimitives(x_17, y_12), start_13, this$_18.length))) ? ((len_6 = (max_4((x_18, y_13) => comparePrimitives(x_18, y_13), 0, (finish_13 - start_13) + 1) | 0), (line_6 = this$_18.startLine, (column_6 = this$_18.startColumn, ((() => {
                    for (let i_9 = 0; i_9 <= (start_13 - 1); i_9++) {
                        if (this$_18.underlying[this$_18.startIndex + i_9] === "\n") {
                            line_6 = ((line_6 + 1) | 0);
                            column_6 = 0;
                        }
                        else {
                            column_6 = ((column_6 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_18.startIndex + start_13, len_6, this$_18.underlying, line_6, column_6)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_19 = s_38, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_7)])]), void 0]);
            }
        }
    }), (tupledArg_24) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb_3), s_42, void 0]);
                    }
                    break;
                }
            };
            return go_1([void 0, s_41]);
        }
        else {
            const state_64 = matchValue_20.fields[0][1];
            const es_3 = matchValue_20.fields[0][0];
            return new FSharpResult$2(1, [es_3, void 0]);
        }
    })), (tupledArg_28) => {
        let s_35, matchValue_16, str_5, s_29, this$_12, start_9, finish_9, len_4, line_4, column_4, this$_13, state_53, es_2, matchValue_17, str_7, s_32, this$_14, start_11, finish_11, len_5, line_5, column_5, this$_15, state_55, es$0027_1, x_16, x_15;
        const matchValue_22 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), (s_35 = tupledArg_28[1], (matchValue_16 = Result_MapError((tupledArg_21) => ParseError_sort(tupledArg_21[0], void 0), (str_5 = "0o", (s_29 = s_35, StringSegmentModule_startsWith(str_5, s_29) ? (new FSharpResult$2(0, [void 0, (this$_12 = s_29, (start_9 = (defaultArg(str_5.length, 0) | 0), (finish_9 = (defaultArg(void 0, this$_12.length - 1) | 0), (((start_9 >= 0) && (start_9 <= this$_12.length)) && (finish_9 < max_4((x_11, y_8) => comparePrimitives(x_11, y_8), start_9, this$_12.length))) ? ((len_4 = (max_4((x_12, y_9) => comparePrimitives(x_12, y_9), 0, (finish_9 - start_9) + 1) | 0), (line_4 = this$_12.startLine, (column_4 = this$_12.startColumn, ((() => {
            for (let i_6 = 0; i_6 <= (start_9 - 1); i_6++) {
                if (this$_12.underlying[this$_12.startIndex + i_6] === "\n") {
                    line_4 = ((line_4 + 1) | 0);
                    column_4 = 0;
                }
                else {
                    column_4 = ((column_4 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_12.startIndex + start_9, len_4, this$_12.underlying, line_4, column_4)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_13 = s_29, new Position(this$_13.startLine, this$_13.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_5) + "\u0027"))]), void 0]))))), (matchValue_16.tag === 1) ? ((state_53 = matchValue_16.fields[0][1], (es_2 = matchValue_16.fields[0][0], (matchValue_17 = Result_MapError((tupledArg_22) => ParseError_sort(tupledArg_22[0], void 0), (str_7 = "0O", (s_32 = s_35, StringSegmentModule_startsWith(str_7, s_32) ? (new FSharpResult$2(0, [void 0, (this$_14 = s_32, (start_11 = (defaultArg(str_7.length, 0) | 0), (finish_11 = (defaultArg(void 0, this$_14.length - 1) | 0), (((start_11 >= 0) && (start_11 <= this$_14.length)) && (finish_11 < max_4((x_13, y_10) => comparePrimitives(x_13, y_10), start_11, this$_14.length))) ? ((len_5 = (max_4((x_14, y_11) => comparePrimitives(x_14, y_11), 0, (finish_11 - start_11) + 1) | 0), (line_5 = this$_14.startLine, (column_5 = this$_14.startColumn, ((() => {
            for (let i_7 = 0; i_7 <= (start_11 - 1); i_7++) {
                if (this$_14.underlying[this$_14.startIndex + i_7] === "\n") {
                    line_5 = ((line_5 + 1) | 0);
                    column_5 = 0;
                }
                else {
                    column_5 = ((column_5 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_14.startIndex + start_11, len_5, this$_14.underlying, line_5, column_5)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_15 = s_32, new Position(this$_15.startLine, this$_15.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_7) + "\u0027"))]), void 0]))))), (matchValue_17.tag === 1) ? ((state_55 = matchValue_17.fields[0][1], (es$0027_1 = matchValue_17.fields[0][0], new FSharpResult$2(1, [append_1(es_2, es$0027_1), void 0])))) : ((x_16 = matchValue_17, x_16)))))) : ((x_15 = matchValue_16, x_15)))));
        if (matchValue_22.tag === 0) {
            const state_72 = matchValue_22.fields[0][2];
            const s_46 = matchValue_22.fields[0][1];
            const matchValue_23 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), p2_6([void 0, s_46]));
            if (matchValue_23.tag === 0) {
                const state_74 = matchValue_23.fields[0][2];
                const s_47 = matchValue_23.fields[0][1];
                const r2_1 = matchValue_23.fields[0][0];
                return new FSharpResult$2(0, [r2_1, s_47, void 0]);
            }
            else {
                const e_4 = matchValue_23.fields[0];
                return new FSharpResult$2(1, e_4);
            }
        }
        else {
            const e_3 = matchValue_22.fields[0];
            return new FSharpResult$2(1, e_3);
        }
    })), (tupledArg_31) => {
        const matchValue_24 = Result_MapError((tupledArg_32) => ParseError_sort(tupledArg_32[0], void 0), p_22([void 0, tupledArg_31[1]]));
        if (matchValue_24.tag === 0) {
            const state_78 = matchValue_24.fields[0][2];
            const s_50 = matchValue_24.fields[0][1];
            const r_2 = matchValue_24.fields[0][0];
            return new FSharpResult$2(0, [[8, r_2], s_50, void 0]);
        }
        else {
            const e_5 = matchValue_24.fields[0];
            return new FSharpResult$2(1, e_5);
        }
    }), (p_33 = ((p2_10 = ((p_27 = ((tupledArg_38) => {
        let this$_25, _arg2, this$_26, start_19, finish_19, len_9, line_9, column_9, this$_27;
        const label_5 = "a char with condition";
        const s_60 = tupledArg_38[1];
        let matchValue_29;
        const this$_24 = s_60;
        const index_3 = 0;
        matchValue_29 = (((index_3 < 0) ? true : (index_3 >= this$_24.length)) ? "￿" : this$_24.underlying[this$_24.startIndex + index_3]);
        if (matchValue_29 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_25 = s_60, new Position(this$_25.startLine, this$_25.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_11 = matchValue_29;
            if ((_arg2 = c_11, (_arg2 === "0") ? true : (_arg2 === "1"))) {
                return new FSharpResult$2(0, [c_11, (this$_26 = s_60, (start_19 = (defaultArg(1, 0) | 0), (finish_19 = (defaultArg(void 0, this$_26.length - 1) | 0), (((start_19 >= 0) && (start_19 <= this$_26.length)) && (finish_19 < max_4((x_26, y_18) => comparePrimitives(x_26, y_18), start_19, this$_26.length))) ? ((len_9 = (max_4((x_27, y_19) => comparePrimitives(x_27, y_19), 0, (finish_19 - start_19) + 1) | 0), (line_9 = this$_26.startLine, (column_9 = this$_26.startColumn, ((() => {
                    for (let i_13 = 0; i_13 <= (start_19 - 1); i_13++) {
                        if (this$_26.underlying[this$_26.startIndex + i_13] === "\n") {
                            line_9 = ((line_9 + 1) | 0);
                            column_9 = 0;
                        }
                        else {
                            column_9 = ((column_9 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_26.startIndex + start_19, len_9, this$_26.underlying, line_9, column_9)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_27 = s_60, new Position(this$_27.startLine, this$_27.startColumn)), ofArray([new ErrorType(0, label_5), new ErrorType(1, c_11)])]), void 0]);
            }
        }
    }), (tupledArg_39) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb_6), s_64, void 0]);
                    }
                    break;
                }
            };
            return go_2([void 0, s_63]);
        }
        else {
            const state_98 = matchValue_31.fields[0][1];
            const es_5 = matchValue_31.fields[0][0];
            return new FSharpResult$2(1, [es_5, void 0]);
        }
    })), (tupledArg_43) => {
        let s_58, matchValue_27, str_9, s_52, this$_20, start_15, finish_15, len_7, line_7, column_7, this$_21, state_88, es_4, matchValue_28, str_11, s_55, this$_22, start_17, finish_17, len_8, line_8, column_8, this$_23, state_90, es$0027_2, x_25, x_24;
        const matchValue_33 = Result_MapError((tupledArg_44) => ParseError_sort(tupledArg_44[0], void 0), (s_58 = tupledArg_43[1], (matchValue_27 = Result_MapError((tupledArg_36) => ParseError_sort(tupledArg_36[0], void 0), (str_9 = "0b", (s_52 = s_58, StringSegmentModule_startsWith(str_9, s_52) ? (new FSharpResult$2(0, [void 0, (this$_20 = s_52, (start_15 = (defaultArg(str_9.length, 0) | 0), (finish_15 = (defaultArg(void 0, this$_20.length - 1) | 0), (((start_15 >= 0) && (start_15 <= this$_20.length)) && (finish_15 < max_4((x_20, y_14) => comparePrimitives(x_20, y_14), start_15, this$_20.length))) ? ((len_7 = (max_4((x_21, y_15) => comparePrimitives(x_21, y_15), 0, (finish_15 - start_15) + 1) | 0), (line_7 = this$_20.startLine, (column_7 = this$_20.startColumn, ((() => {
            for (let i_10 = 0; i_10 <= (start_15 - 1); i_10++) {
                if (this$_20.underlying[this$_20.startIndex + i_10] === "\n") {
                    line_7 = ((line_7 + 1) | 0);
                    column_7 = 0;
                }
                else {
                    column_7 = ((column_7 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_20.startIndex + start_15, len_7, this$_20.underlying, line_7, column_7)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_21 = s_52, new Position(this$_21.startLine, this$_21.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_9) + "\u0027"))]), void 0]))))), (matchValue_27.tag === 1) ? ((state_88 = matchValue_27.fields[0][1], (es_4 = matchValue_27.fields[0][0], (matchValue_28 = Result_MapError((tupledArg_37) => ParseError_sort(tupledArg_37[0], void 0), (str_11 = "0B", (s_55 = s_58, StringSegmentModule_startsWith(str_11, s_55) ? (new FSharpResult$2(0, [void 0, (this$_22 = s_55, (start_17 = (defaultArg(str_11.length, 0) | 0), (finish_17 = (defaultArg(void 0, this$_22.length - 1) | 0), (((start_17 >= 0) && (start_17 <= this$_22.length)) && (finish_17 < max_4((x_22, y_16) => comparePrimitives(x_22, y_16), start_17, this$_22.length))) ? ((len_8 = (max_4((x_23, y_17) => comparePrimitives(x_23, y_17), 0, (finish_17 - start_17) + 1) | 0), (line_8 = this$_22.startLine, (column_8 = this$_22.startColumn, ((() => {
            for (let i_11 = 0; i_11 <= (start_17 - 1); i_11++) {
                if (this$_22.underlying[this$_22.startIndex + i_11] === "\n") {
                    line_8 = ((line_8 + 1) | 0);
                    column_8 = 0;
                }
                else {
                    column_8 = ((column_8 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_22.startIndex + start_17, len_8, this$_22.underlying, line_8, column_8)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_23 = s_55, new Position(this$_23.startLine, this$_23.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_11) + "\u0027"))]), void 0]))))), (matchValue_28.tag === 1) ? ((state_90 = matchValue_28.fields[0][1], (es$0027_2 = matchValue_28.fields[0][0], new FSharpResult$2(1, [append_1(es_4, es$0027_2), void 0])))) : ((x_25 = matchValue_28, x_25)))))) : ((x_24 = matchValue_27, x_24)))));
        if (matchValue_33.tag === 0) {
            const state_106 = matchValue_33.fields[0][2];
            const s_68 = matchValue_33.fields[0][1];
            const matchValue_34 = Result_MapError((tupledArg_45) => ParseError_sort(tupledArg_45[0], void 0), p2_10([void 0, s_68]));
            if (matchValue_34.tag === 0) {
                const state_108 = matchValue_34.fields[0][2];
                const s_69 = matchValue_34.fields[0][1];
                const r2_2 = matchValue_34.fields[0][0];
                return new FSharpResult$2(0, [r2_2, s_69, void 0]);
            }
            else {
                const e_7 = matchValue_34.fields[0];
                return new FSharpResult$2(1, e_7);
            }
        }
        else {
            const e_6 = matchValue_33.fields[0];
            return new FSharpResult$2(1, e_6);
        }
    })), (tupledArg_46) => {
        const matchValue_35 = Result_MapError((tupledArg_47) => ParseError_sort(tupledArg_47[0], void 0), p_33([void 0, tupledArg_46[1]]));
        if (matchValue_35.tag === 0) {
            const state_112 = matchValue_35.fields[0][2];
            const s_72 = matchValue_35.fields[0][1];
            const r_3 = matchValue_35.fields[0][0];
            return new FSharpResult$2(0, [[2, r_3], s_72, void 0]);
        }
        else {
            const e_8 = matchValue_35.fields[0];
            return new FSharpResult$2(1, e_8);
        }
    }), (p_40 = ((p_36 = ((tupledArg_48) => {
        let this$_29, this$_30, start_21, finish_21, len_10, line_10, column_10, this$_31;
        const label_6 = "[0-9]";
        const s_75 = tupledArg_48[1];
        let matchValue_36;
        const this$_28 = s_75;
        const index_4 = 0;
        matchValue_36 = (((index_4 < 0) ? true : (index_4 >= this$_28.length)) ? "￿" : this$_28.underlying[this$_28.startIndex + index_4]);
        if (matchValue_36 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_29 = s_75, new Position(this$_29.startLine, this$_29.startColumn)), ofArray([new ErrorType(0, label_6), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_15 = matchValue_36;
            if (isDigit(c_15)) {
                return new FSharpResult$2(0, [c_15, (this$_30 = s_75, (start_21 = (defaultArg(1, 0) | 0), (finish_21 = (defaultArg(void 0, this$_30.length - 1) | 0), (((start_21 >= 0) && (start_21 <= this$_30.length)) && (finish_21 < max_4((x_29, y_20) => comparePrimitives(x_29, y_20), start_21, this$_30.length))) ? ((len_10 = (max_4((x_30, y_21) => comparePrimitives(x_30, y_21), 0, (finish_21 - start_21) + 1) | 0), (line_10 = this$_30.startLine, (column_10 = this$_30.startColumn, ((() => {
                    for (let i_15 = 0; i_15 <= (start_21 - 1); i_15++) {
                        if (this$_30.underlying[this$_30.startIndex + i_15] === "\n") {
                            line_10 = ((line_10 + 1) | 0);
                            column_10 = 0;
                        }
                        else {
                            column_10 = ((column_10 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_30.startIndex + start_21, len_10, this$_30.underlying, line_10, column_10)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_21)(finish_21)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_31 = s_75, new Position(this$_31.startLine, this$_31.startColumn)), ofArray([new ErrorType(0, label_6), new ErrorType(1, c_15)])]), void 0]);
            }
        }
    }), (tupledArg_49) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb_9), s_79, void 0]);
                    }
                    break;
                }
            };
            return go_3([void 0, s_78]);
        }
        else {
            const state_121 = matchValue_38.fields[0][1];
            const es_6 = matchValue_38.fields[0][0];
            return new FSharpResult$2(1, [es_6, void 0]);
        }
    })), (tupledArg_53) => {
        const matchValue_40 = Result_MapError((tupledArg_54) => ParseError_sort(tupledArg_54[0], void 0), p_40([void 0, tupledArg_53[1]]));
        if (matchValue_40.tag === 0) {
            const state_129 = matchValue_40.fields[0][2];
            const s_83 = matchValue_40.fields[0][1];
            const r_4 = matchValue_40.fields[0][0];
            return new FSharpResult$2(0, [[10, r_4], s_83, void 0]);
        }
        else {
            const e_9 = matchValue_40.fields[0];
            return new FSharpResult$2(1, e_9);
        }
    })]);
    p2_12 = ((tupledArg_55) => {
        const s_85 = tupledArg_55[1];
        const go_4 = (state_132_mut, errorsAcc_mut, _arg1_1_mut) => {
            let this$_32;
            go_4:
            while (true) {
                const state_132 = state_132_mut, errorsAcc = errorsAcc_mut, _arg1_1 = _arg1_1_mut;
                if (!isEmpty(_arg1_1)) {
                    if (isEmpty(tail(_arg1_1))) {
                        const p_43 = head_3(_arg1_1);
                        const matchValue_41 = Result_MapError((tupledArg_56) => ParseError_sort(tupledArg_56[0], tupledArg_56[1]), p_43([state_132, s_85]));
                        if (matchValue_41.tag === 1) {
                            const state_135 = matchValue_41.fields[0][1];
                            const errors = matchValue_41.fields[0][0];
                            return new FSharpResult$2(1, [append_1(errorsAcc, errors), state_135]);
                        }
                        else {
                            const x_32 = matchValue_41;
                            return x_32;
                        }
                    }
                    else {
                        const p_45 = head_3(_arg1_1);
                        const ps_2 = tail(_arg1_1);
                        const matchValue_42 = Result_MapError((tupledArg_57) => ParseError_sort(tupledArg_57[0], tupledArg_57[1]), p_45([state_132, s_85]));
                        if (matchValue_42.tag === 1) {
                            const state_137 = matchValue_42.fields[0][1];
                            const errors_1 = matchValue_42.fields[0][0];
                            state_132_mut = state_137;
                            errorsAcc_mut = append_1(errors_1, errorsAcc);
                            _arg1_1_mut = ps_2;
                            continue go_4;
                        }
                        else {
                            const x_33 = matchValue_42;
                            return x_33;
                        }
                    }
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_32 = s_85, new Position(this$_32.startLine, this$_32.startColumn)), singleton_1(new ErrorType(2, "No parsers given"))]), state_132]);
                }
                break;
            }
        };
        return go_4(void 0, empty_1(), ps);
    });
    p_49 = ((tupledArg_58) => {
        const matchValue_43 = Result_MapError((tupledArg_59) => ParseError_sort(tupledArg_59[0], void 0), ((tupledArg) => {
            const s_1 = tupledArg[1];
            const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), ((tupledArg_2) => {
                let this$_1, _arg1, this$_2, start_1, finish_1, len, line, column, this$_3;
                const label_1 = "a char with condition";
                const s_4 = tupledArg_2[1];
                let matchValue_1;
                const this$ = s_4;
                const index = 0;
                matchValue_1 = (((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]);
                if (matchValue_1 === "￿") {
                    return new FSharpResult$2(1, [singleton_1([(this$_1 = s_4, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
                }
                else {
                    const c = matchValue_1;
                    return ((_arg1 = c, (_arg1 === "+") ? true : (_arg1 === "-"))) ? (new FSharpResult$2(0, [c, (this$_2 = s_4, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
                        for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                            if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                                line = ((line + 1) | 0);
                                column = 0;
                            }
                            else {
                                column = ((column + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_4, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c)])]), void 0]));
                }
            })([void 0, s_1]));
            if (matchValue.tag === 1) {
                const state_4 = matchValue.fields[0][1];
                return new FSharpResult$2(0, [void 0, s_1, void 0]);
            }
            else {
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
            }
            else {
                const e_11 = matchValue_44.fields[0];
                return new FSharpResult$2(1, e_11);
            }
        }
        else {
            const e_10 = matchValue_43.fields[0];
            return new FSharpResult$2(1, e_10);
        }
    });
    p_52 = ((tupledArg_61) => {
        let _arg3, s_90, style, s_91, style_1;
        const matchValue_45 = Result_MapError((tupledArg_62) => ParseError_sort(tupledArg_62[0], void 0), p_49([void 0, tupledArg_61[1]]));
        if (matchValue_45.tag === 0) {
            const state_147 = matchValue_45.fields[0][2];
            const s_94 = matchValue_45.fields[0][1];
            const r_5 = matchValue_45.fields[0][0];
            return new FSharpResult$2(0, [(_arg3 = r_5, (_arg3[0] != null) ? ((_arg3[0] === "+") ? ((s_90 = _arg3[1][1], (style = (_arg3[1][0] | 0), [true, style, s_90]))) : ((s_91 = _arg3[1][1], (style_1 = (_arg3[1][0] | 0), [false, style_1, s_91])))) : ((s_90 = _arg3[1][1], (style = (_arg3[1][0] | 0), [true, style, s_90])))), s_94, void 0]);
        }
        else {
            const e_12 = matchValue_45.fields[0];
            return new FSharpResult$2(1, e_12);
        }
    });
    return (tupledArg_63) => {
        let this$_33;
        const s_96 = tupledArg_63[1];
        const matchValue_46 = Result_MapError((tupledArg_64) => ParseError_sort(tupledArg_64[0], void 0), p_52([void 0, s_96]));
        if (matchValue_46.tag === 1) {
            const state_151 = matchValue_46.fields[0][1];
            return new FSharpResult$2(1, [singleton_1([(this$_33 = s_96, new Position(this$_33.startLine, this$_33.startColumn)), singleton_1(new ErrorType(0, "integer"))]), void 0]);
        }
        else {
            const x_34 = matchValue_46;
            return x_34;
        }
    };
})();

export const CharParsers_Internal_pUIntLikeUnit = (() => {
    let p_8, p2_2, p_2, p_19, p2_6, p_13, p_30, p2_10, p_24, p_37, p_33;
    const ps = ofArray([(p_8 = ((p2_2 = ((p_2 = ((tupledArg_5) => {
        let this$_5, c, this$_6, start_5, finish_5, len_2, line_2, column_2, this$_7;
        const label = "[0-9a-fA-F]";
        const s_10 = tupledArg_5[1];
        let matchValue_4;
        const this$_4 = s_10;
        const index = 0;
        matchValue_4 = (((index < 0) ? true : (index >= this$_4.length)) ? "￿" : this$_4.underlying[this$_4.startIndex + index]);
        if (matchValue_4 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_5 = s_10, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_1 = matchValue_4;
            if ((c = c_1, (isDigit(c) ? true : (("A" <= c) && (c <= "F"))) ? true : (("a" <= c) && (c <= "f")))) {
                return new FSharpResult$2(0, [c_1, (this$_6 = s_10, (start_5 = (defaultArg(1, 0) | 0), (finish_5 = (defaultArg(void 0, this$_6.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_6.length)) && (finish_5 < max_4((x_6, y_4) => comparePrimitives(x_6, y_4), start_5, this$_6.length))) ? ((len_2 = (max_4((x_7, y_5) => comparePrimitives(x_7, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_6.startLine, (column_2 = this$_6.startColumn, ((() => {
                    for (let i_3 = 0; i_3 <= (start_5 - 1); i_3++) {
                        if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
                            line_2 = ((line_2 + 1) | 0);
                            column_2 = 0;
                        }
                        else {
                            column_2 = ((column_2 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_6.startIndex + start_5, len_2, this$_6.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_7 = s_10, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c_1)])]), void 0]);
            }
        }
    }), (tupledArg_6) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb), s_14, void 0]);
                    }
                    break;
                }
            };
            return go([void 0, s_13]);
        }
        else {
            const state_20 = matchValue_6.fields[0][1];
            const es_1 = matchValue_6.fields[0][0];
            return new FSharpResult$2(1, [es_1, void 0]);
        }
    })), (tupledArg_10) => {
        let s_7, matchValue_2, str_1, s_1, this$, start_1, finish_1, len, line, column, this$_1, state_9, es, matchValue_3, str_3, s_4, this$_2, start_3, finish_3, len_1, line_1, column_1, this$_3, state_11, es$0027, x_5, x_4;
        const matchValue_8 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), (s_7 = tupledArg_10[1], (matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), (str_1 = "0x", (s_1 = s_7, StringSegmentModule_startsWith(str_1, s_1) ? (new FSharpResult$2(0, [void 0, (this$ = s_1, (start_1 = (defaultArg(str_1.length, 0) | 0), (finish_1 = (defaultArg(void 0, this$.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$.startLine, (column = this$.startColumn, ((() => {
            for (let i = 0; i <= (start_1 - 1); i++) {
                if (this$.underlying[this$.startIndex + i] === "\n") {
                    line = ((line + 1) | 0);
                    column = 0;
                }
                else {
                    column = ((column + 1) | 0);
                }
            }
        })(), new StringSegment(this$.startIndex + start_1, len, this$.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_1) + "\u0027"))]), void 0]))))), (matchValue_2.tag === 1) ? ((state_9 = matchValue_2.fields[0][1], (es = matchValue_2.fields[0][0], (matchValue_3 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (str_3 = "0X", (s_4 = s_7, StringSegmentModule_startsWith(str_3, s_4) ? (new FSharpResult$2(0, [void 0, (this$_2 = s_4, (start_3 = (defaultArg(str_3.length, 0) | 0), (finish_3 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_2.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_2.length))) ? ((len_1 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_2.startLine, (column_1 = this$_2.startColumn, ((() => {
            for (let i_1 = 0; i_1 <= (start_3 - 1); i_1++) {
                if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                    line_1 = ((line_1 + 1) | 0);
                    column_1 = 0;
                }
                else {
                    column_1 = ((column_1 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_2.startIndex + start_3, len_1, this$_2.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_4, new Position(this$_3.startLine, this$_3.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_3) + "\u0027"))]), void 0]))))), (matchValue_3.tag === 1) ? ((state_11 = matchValue_3.fields[0][1], (es$0027 = matchValue_3.fields[0][0], new FSharpResult$2(1, [append_1(es, es$0027), void 0])))) : ((x_5 = matchValue_3, x_5)))))) : ((x_4 = matchValue_2, x_4)))));
        if (matchValue_8.tag === 0) {
            const state_28 = matchValue_8.fields[0][2];
            const s_18 = matchValue_8.fields[0][1];
            const matchValue_9 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), p2_2([void 0, s_18]));
            if (matchValue_9.tag === 0) {
                const state_30 = matchValue_9.fields[0][2];
                const s_19 = matchValue_9.fields[0][1];
                const r2 = matchValue_9.fields[0][0];
                return new FSharpResult$2(0, [r2, s_19, void 0]);
            }
            else {
                const e_1 = matchValue_9.fields[0];
                return new FSharpResult$2(1, e_1);
            }
        }
        else {
            const e = matchValue_8.fields[0];
            return new FSharpResult$2(1, e);
        }
    })), (tupledArg_13) => {
        const matchValue_10 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), p_8([void 0, tupledArg_13[1]]));
        if (matchValue_10.tag === 0) {
            const state_34 = matchValue_10.fields[0][2];
            const s_22 = matchValue_10.fields[0][1];
            const r = matchValue_10.fields[0][0];
            return new FSharpResult$2(0, [[16, r], s_22, void 0]);
        }
        else {
            const e_2 = matchValue_10.fields[0];
            return new FSharpResult$2(1, e_2);
        }
    }), (p_19 = ((p2_6 = ((p_13 = ((tupledArg_20) => {
        let this$_13, c_5, this$_14, start_11, finish_11, len_5, line_5, column_5, this$_15;
        const label_1 = "[0-7]";
        const s_33 = tupledArg_20[1];
        let matchValue_15;
        const this$_12 = s_33;
        const index_1 = 0;
        matchValue_15 = (((index_1 < 0) ? true : (index_1 >= this$_12.length)) ? "￿" : this$_12.underlying[this$_12.startIndex + index_1]);
        if (matchValue_15 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_13 = s_33, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_6 = matchValue_15;
            if ((c_5 = c_6, ("0" <= c_5) && (c_5 <= "7"))) {
                return new FSharpResult$2(0, [c_6, (this$_14 = s_33, (start_11 = (defaultArg(1, 0) | 0), (finish_11 = (defaultArg(void 0, this$_14.length - 1) | 0), (((start_11 >= 0) && (start_11 <= this$_14.length)) && (finish_11 < max_4((x_15, y_10) => comparePrimitives(x_15, y_10), start_11, this$_14.length))) ? ((len_5 = (max_4((x_16, y_11) => comparePrimitives(x_16, y_11), 0, (finish_11 - start_11) + 1) | 0), (line_5 = this$_14.startLine, (column_5 = this$_14.startColumn, ((() => {
                    for (let i_7 = 0; i_7 <= (start_11 - 1); i_7++) {
                        if (this$_14.underlying[this$_14.startIndex + i_7] === "\n") {
                            line_5 = ((line_5 + 1) | 0);
                            column_5 = 0;
                        }
                        else {
                            column_5 = ((column_5 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_14.startIndex + start_11, len_5, this$_14.underlying, line_5, column_5)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_15 = s_33, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_6)])]), void 0]);
            }
        }
    }), (tupledArg_21) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb_3), s_37, void 0]);
                    }
                    break;
                }
            };
            return go_1([void 0, s_36]);
        }
        else {
            const state_55 = matchValue_17.fields[0][1];
            const es_3 = matchValue_17.fields[0][0];
            return new FSharpResult$2(1, [es_3, void 0]);
        }
    })), (tupledArg_25) => {
        let s_30, matchValue_13, str_5, s_24, this$_8, start_7, finish_7, len_3, line_3, column_3, this$_9, state_44, es_2, matchValue_14, str_7, s_27, this$_10, start_9, finish_9, len_4, line_4, column_4, this$_11, state_46, es$0027_1, x_14, x_13;
        const matchValue_19 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), (s_30 = tupledArg_25[1], (matchValue_13 = Result_MapError((tupledArg_18) => ParseError_sort(tupledArg_18[0], void 0), (str_5 = "0o", (s_24 = s_30, StringSegmentModule_startsWith(str_5, s_24) ? (new FSharpResult$2(0, [void 0, (this$_8 = s_24, (start_7 = (defaultArg(str_5.length, 0) | 0), (finish_7 = (defaultArg(void 0, this$_8.length - 1) | 0), (((start_7 >= 0) && (start_7 <= this$_8.length)) && (finish_7 < max_4((x_9, y_6) => comparePrimitives(x_9, y_6), start_7, this$_8.length))) ? ((len_3 = (max_4((x_10, y_7) => comparePrimitives(x_10, y_7), 0, (finish_7 - start_7) + 1) | 0), (line_3 = this$_8.startLine, (column_3 = this$_8.startColumn, ((() => {
            for (let i_4 = 0; i_4 <= (start_7 - 1); i_4++) {
                if (this$_8.underlying[this$_8.startIndex + i_4] === "\n") {
                    line_3 = ((line_3 + 1) | 0);
                    column_3 = 0;
                }
                else {
                    column_3 = ((column_3 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_8.startIndex + start_7, len_3, this$_8.underlying, line_3, column_3)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_9 = s_24, new Position(this$_9.startLine, this$_9.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_5) + "\u0027"))]), void 0]))))), (matchValue_13.tag === 1) ? ((state_44 = matchValue_13.fields[0][1], (es_2 = matchValue_13.fields[0][0], (matchValue_14 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (str_7 = "0O", (s_27 = s_30, StringSegmentModule_startsWith(str_7, s_27) ? (new FSharpResult$2(0, [void 0, (this$_10 = s_27, (start_9 = (defaultArg(str_7.length, 0) | 0), (finish_9 = (defaultArg(void 0, this$_10.length - 1) | 0), (((start_9 >= 0) && (start_9 <= this$_10.length)) && (finish_9 < max_4((x_11, y_8) => comparePrimitives(x_11, y_8), start_9, this$_10.length))) ? ((len_4 = (max_4((x_12, y_9) => comparePrimitives(x_12, y_9), 0, (finish_9 - start_9) + 1) | 0), (line_4 = this$_10.startLine, (column_4 = this$_10.startColumn, ((() => {
            for (let i_5 = 0; i_5 <= (start_9 - 1); i_5++) {
                if (this$_10.underlying[this$_10.startIndex + i_5] === "\n") {
                    line_4 = ((line_4 + 1) | 0);
                    column_4 = 0;
                }
                else {
                    column_4 = ((column_4 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_10.startIndex + start_9, len_4, this$_10.underlying, line_4, column_4)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_11 = s_27, new Position(this$_11.startLine, this$_11.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_7) + "\u0027"))]), void 0]))))), (matchValue_14.tag === 1) ? ((state_46 = matchValue_14.fields[0][1], (es$0027_1 = matchValue_14.fields[0][0], new FSharpResult$2(1, [append_1(es_2, es$0027_1), void 0])))) : ((x_14 = matchValue_14, x_14)))))) : ((x_13 = matchValue_13, x_13)))));
        if (matchValue_19.tag === 0) {
            const state_63 = matchValue_19.fields[0][2];
            const s_41 = matchValue_19.fields[0][1];
            const matchValue_20 = Result_MapError((tupledArg_27) => ParseError_sort(tupledArg_27[0], void 0), p2_6([void 0, s_41]));
            if (matchValue_20.tag === 0) {
                const state_65 = matchValue_20.fields[0][2];
                const s_42 = matchValue_20.fields[0][1];
                const r2_1 = matchValue_20.fields[0][0];
                return new FSharpResult$2(0, [r2_1, s_42, void 0]);
            }
            else {
                const e_4 = matchValue_20.fields[0];
                return new FSharpResult$2(1, e_4);
            }
        }
        else {
            const e_3 = matchValue_19.fields[0];
            return new FSharpResult$2(1, e_3);
        }
    })), (tupledArg_28) => {
        const matchValue_21 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), p_19([void 0, tupledArg_28[1]]));
        if (matchValue_21.tag === 0) {
            const state_69 = matchValue_21.fields[0][2];
            const s_45 = matchValue_21.fields[0][1];
            const r_1 = matchValue_21.fields[0][0];
            return new FSharpResult$2(0, [[8, r_1], s_45, void 0]);
        }
        else {
            const e_5 = matchValue_21.fields[0];
            return new FSharpResult$2(1, e_5);
        }
    }), (p_30 = ((p2_10 = ((p_24 = ((tupledArg_35) => {
        let this$_21, _arg1, this$_22, start_17, finish_17, len_8, line_8, column_8, this$_23;
        const label_3 = "a char with condition";
        const s_55 = tupledArg_35[1];
        let matchValue_26;
        const this$_20 = s_55;
        const index_2 = 0;
        matchValue_26 = (((index_2 < 0) ? true : (index_2 >= this$_20.length)) ? "￿" : this$_20.underlying[this$_20.startIndex + index_2]);
        if (matchValue_26 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_21 = s_55, new Position(this$_21.startLine, this$_21.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_10 = matchValue_26;
            if ((_arg1 = c_10, (_arg1 === "0") ? true : (_arg1 === "1"))) {
                return new FSharpResult$2(0, [c_10, (this$_22 = s_55, (start_17 = (defaultArg(1, 0) | 0), (finish_17 = (defaultArg(void 0, this$_22.length - 1) | 0), (((start_17 >= 0) && (start_17 <= this$_22.length)) && (finish_17 < max_4((x_24, y_16) => comparePrimitives(x_24, y_16), start_17, this$_22.length))) ? ((len_8 = (max_4((x_25, y_17) => comparePrimitives(x_25, y_17), 0, (finish_17 - start_17) + 1) | 0), (line_8 = this$_22.startLine, (column_8 = this$_22.startColumn, ((() => {
                    for (let i_11 = 0; i_11 <= (start_17 - 1); i_11++) {
                        if (this$_22.underlying[this$_22.startIndex + i_11] === "\n") {
                            line_8 = ((line_8 + 1) | 0);
                            column_8 = 0;
                        }
                        else {
                            column_8 = ((column_8 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_22.startIndex + start_17, len_8, this$_22.underlying, line_8, column_8)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_23 = s_55, new Position(this$_23.startLine, this$_23.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_10)])]), void 0]);
            }
        }
    }), (tupledArg_36) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb_6), s_59, void 0]);
                    }
                    break;
                }
            };
            return go_2([void 0, s_58]);
        }
        else {
            const state_89 = matchValue_28.fields[0][1];
            const es_5 = matchValue_28.fields[0][0];
            return new FSharpResult$2(1, [es_5, void 0]);
        }
    })), (tupledArg_40) => {
        let s_53, matchValue_24, str_9, s_47, this$_16, start_13, finish_13, len_6, line_6, column_6, this$_17, state_79, es_4, matchValue_25, str_11, s_50, this$_18, start_15, finish_15, len_7, line_7, column_7, this$_19, state_81, es$0027_2, x_23, x_22;
        const matchValue_30 = Result_MapError((tupledArg_41) => ParseError_sort(tupledArg_41[0], void 0), (s_53 = tupledArg_40[1], (matchValue_24 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), (str_9 = "0b", (s_47 = s_53, StringSegmentModule_startsWith(str_9, s_47) ? (new FSharpResult$2(0, [void 0, (this$_16 = s_47, (start_13 = (defaultArg(str_9.length, 0) | 0), (finish_13 = (defaultArg(void 0, this$_16.length - 1) | 0), (((start_13 >= 0) && (start_13 <= this$_16.length)) && (finish_13 < max_4((x_18, y_12) => comparePrimitives(x_18, y_12), start_13, this$_16.length))) ? ((len_6 = (max_4((x_19, y_13) => comparePrimitives(x_19, y_13), 0, (finish_13 - start_13) + 1) | 0), (line_6 = this$_16.startLine, (column_6 = this$_16.startColumn, ((() => {
            for (let i_8 = 0; i_8 <= (start_13 - 1); i_8++) {
                if (this$_16.underlying[this$_16.startIndex + i_8] === "\n") {
                    line_6 = ((line_6 + 1) | 0);
                    column_6 = 0;
                }
                else {
                    column_6 = ((column_6 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_16.startIndex + start_13, len_6, this$_16.underlying, line_6, column_6)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_17 = s_47, new Position(this$_17.startLine, this$_17.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_9) + "\u0027"))]), void 0]))))), (matchValue_24.tag === 1) ? ((state_79 = matchValue_24.fields[0][1], (es_4 = matchValue_24.fields[0][0], (matchValue_25 = Result_MapError((tupledArg_34) => ParseError_sort(tupledArg_34[0], void 0), (str_11 = "0B", (s_50 = s_53, StringSegmentModule_startsWith(str_11, s_50) ? (new FSharpResult$2(0, [void 0, (this$_18 = s_50, (start_15 = (defaultArg(str_11.length, 0) | 0), (finish_15 = (defaultArg(void 0, this$_18.length - 1) | 0), (((start_15 >= 0) && (start_15 <= this$_18.length)) && (finish_15 < max_4((x_20, y_14) => comparePrimitives(x_20, y_14), start_15, this$_18.length))) ? ((len_7 = (max_4((x_21, y_15) => comparePrimitives(x_21, y_15), 0, (finish_15 - start_15) + 1) | 0), (line_7 = this$_18.startLine, (column_7 = this$_18.startColumn, ((() => {
            for (let i_9 = 0; i_9 <= (start_15 - 1); i_9++) {
                if (this$_18.underlying[this$_18.startIndex + i_9] === "\n") {
                    line_7 = ((line_7 + 1) | 0);
                    column_7 = 0;
                }
                else {
                    column_7 = ((column_7 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_18.startIndex + start_15, len_7, this$_18.underlying, line_7, column_7)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_19 = s_50, new Position(this$_19.startLine, this$_19.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_11) + "\u0027"))]), void 0]))))), (matchValue_25.tag === 1) ? ((state_81 = matchValue_25.fields[0][1], (es$0027_2 = matchValue_25.fields[0][0], new FSharpResult$2(1, [append_1(es_4, es$0027_2), void 0])))) : ((x_23 = matchValue_25, x_23)))))) : ((x_22 = matchValue_24, x_22)))));
        if (matchValue_30.tag === 0) {
            const state_97 = matchValue_30.fields[0][2];
            const s_63 = matchValue_30.fields[0][1];
            const matchValue_31 = Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), p2_10([void 0, s_63]));
            if (matchValue_31.tag === 0) {
                const state_99 = matchValue_31.fields[0][2];
                const s_64 = matchValue_31.fields[0][1];
                const r2_2 = matchValue_31.fields[0][0];
                return new FSharpResult$2(0, [r2_2, s_64, void 0]);
            }
            else {
                const e_7 = matchValue_31.fields[0];
                return new FSharpResult$2(1, e_7);
            }
        }
        else {
            const e_6 = matchValue_30.fields[0];
            return new FSharpResult$2(1, e_6);
        }
    })), (tupledArg_43) => {
        const matchValue_32 = Result_MapError((tupledArg_44) => ParseError_sort(tupledArg_44[0], void 0), p_30([void 0, tupledArg_43[1]]));
        if (matchValue_32.tag === 0) {
            const state_103 = matchValue_32.fields[0][2];
            const s_67 = matchValue_32.fields[0][1];
            const r_2 = matchValue_32.fields[0][0];
            return new FSharpResult$2(0, [[2, r_2], s_67, void 0]);
        }
        else {
            const e_8 = matchValue_32.fields[0];
            return new FSharpResult$2(1, e_8);
        }
    }), (p_37 = ((p_33 = ((tupledArg_45) => {
        let this$_25, this$_26, start_19, finish_19, len_9, line_9, column_9, this$_27;
        const label_4 = "[0-9]";
        const s_70 = tupledArg_45[1];
        let matchValue_33;
        const this$_24 = s_70;
        const index_3 = 0;
        matchValue_33 = (((index_3 < 0) ? true : (index_3 >= this$_24.length)) ? "￿" : this$_24.underlying[this$_24.startIndex + index_3]);
        if (matchValue_33 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_25 = s_70, new Position(this$_25.startLine, this$_25.startColumn)), ofArray([new ErrorType(0, label_4), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_14 = matchValue_33;
            if (isDigit(c_14)) {
                return new FSharpResult$2(0, [c_14, (this$_26 = s_70, (start_19 = (defaultArg(1, 0) | 0), (finish_19 = (defaultArg(void 0, this$_26.length - 1) | 0), (((start_19 >= 0) && (start_19 <= this$_26.length)) && (finish_19 < max_4((x_27, y_18) => comparePrimitives(x_27, y_18), start_19, this$_26.length))) ? ((len_9 = (max_4((x_28, y_19) => comparePrimitives(x_28, y_19), 0, (finish_19 - start_19) + 1) | 0), (line_9 = this$_26.startLine, (column_9 = this$_26.startColumn, ((() => {
                    for (let i_13 = 0; i_13 <= (start_19 - 1); i_13++) {
                        if (this$_26.underlying[this$_26.startIndex + i_13] === "\n") {
                            line_9 = ((line_9 + 1) | 0);
                            column_9 = 0;
                        }
                        else {
                            column_9 = ((column_9 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_26.startIndex + start_19, len_9, this$_26.underlying, line_9, column_9)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_27 = s_70, new Position(this$_27.startLine, this$_27.startColumn)), ofArray([new ErrorType(0, label_4), new ErrorType(1, c_14)])]), void 0]);
            }
        }
    }), (tupledArg_46) => {
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
                    }
                    else {
                        return new FSharpResult$2(0, [toString(sb_9), s_74, void 0]);
                    }
                    break;
                }
            };
            return go_3([void 0, s_73]);
        }
        else {
            const state_112 = matchValue_35.fields[0][1];
            const es_6 = matchValue_35.fields[0][0];
            return new FSharpResult$2(1, [es_6, void 0]);
        }
    })), (tupledArg_50) => {
        const matchValue_37 = Result_MapError((tupledArg_51) => ParseError_sort(tupledArg_51[0], void 0), p_37([void 0, tupledArg_50[1]]));
        if (matchValue_37.tag === 0) {
            const state_120 = matchValue_37.fields[0][2];
            const s_78 = matchValue_37.fields[0][1];
            const r_3 = matchValue_37.fields[0][0];
            return new FSharpResult$2(0, [[10, r_3], s_78, void 0]);
        }
        else {
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
                        const p_40 = head_3(_arg1_1);
                        const matchValue_38 = Result_MapError((tupledArg_53) => ParseError_sort(tupledArg_53[0], tupledArg_53[1]), p_40([state_123, s_80]));
                        if (matchValue_38.tag === 1) {
                            const state_126 = matchValue_38.fields[0][1];
                            return new FSharpResult$2(1, [singleton_1([(this$_29 = s_80, new Position(this$_29.startLine, this$_29.startColumn)), singleton_1(new ErrorType(0, "unsigned integer"))]), state_126]);
                        }
                        else {
                            const x_30 = matchValue_38;
                            return x_30;
                        }
                    }
                    else {
                        const p_42 = head_3(_arg1_1);
                        const ps_2 = tail(_arg1_1);
                        const matchValue_39 = Result_MapError((tupledArg_54) => ParseError_sort(tupledArg_54[0], tupledArg_54[1]), p_42([state_123, s_80]));
                        if (matchValue_39.tag === 1) {
                            const state_128 = matchValue_39.fields[0][1];
                            state_123_mut = state_128;
                            _arg1_1_mut = ps_2;
                            continue go_4;
                        }
                        else {
                            const x_31 = matchValue_39;
                            return x_31;
                        }
                    }
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_28 = s_80, new Position(this$_28.startLine, this$_28.startColumn)), singleton_1(new ErrorType(2, "No parsers given"))]), state_123]);
                }
                break;
            }
        };
        return go_4(void 0, ps);
    };
})();

export function CharParsers_pfloat(state, s) {
    let this$;
    const matchValue = Result_MapError((tupledArg) => ParseError_sort(tupledArg[0], void 0), CharParsers_Internal_pfloatUnit([void 0, s]));
    if (matchValue.tag === 0) {
        const x = matchValue.fields[0][0];
        const s_1 = matchValue.fields[0][1];
        try {
            return new FSharpResult$2(0, [parse(x), s_1, state]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_1, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state]);
    }
}

export function CharParsers_pint8(x_0, x_1) {
    let this$, x_3, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][2];
        const s_2 = matchValue.fields[0][1];
        const positive = matchValue.fields[0][0][0];
        const adic = matchValue.fields[0][0][1] | 0;
        try {
            return new FSharpResult$2(0, [(x_3 = (((tupledArg = [str, adic], parse_1(tupledArg[0], 511, false, 8, tupledArg[1]))) | 0), positive ? x_3 : op_UnaryNegation_Int8(x_3)), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_puint8(x_0, x_1) {
    let this$, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pUIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][1];
        const s_2 = matchValue.fields[0][1];
        const adic = matchValue.fields[0][0][0] | 0;
        try {
            return new FSharpResult$2(0, [(tupledArg = [str, adic], parse_1(tupledArg[0], 511, true, 8, tupledArg[1])), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_pint16(x_0, x_1) {
    let this$, x_3, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][2];
        const s_2 = matchValue.fields[0][1];
        const positive = matchValue.fields[0][0][0];
        const adic = matchValue.fields[0][0][1] | 0;
        try {
            return new FSharpResult$2(0, [(x_3 = (((tupledArg = [str, adic], parse_1(tupledArg[0], 511, false, 16, tupledArg[1]))) | 0), positive ? x_3 : op_UnaryNegation_Int16(x_3)), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_puint16(x_0, x_1) {
    let this$, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pUIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][1];
        const s_2 = matchValue.fields[0][1];
        const adic = matchValue.fields[0][0][0] | 0;
        try {
            return new FSharpResult$2(0, [(tupledArg = [str, adic], parse_1(tupledArg[0], 511, true, 16, tupledArg[1])), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_pint32(x_0, x_1) {
    let this$, x_3, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][2];
        const s_2 = matchValue.fields[0][1];
        const positive = matchValue.fields[0][0][0];
        const adic = matchValue.fields[0][0][1] | 0;
        try {
            return new FSharpResult$2(0, [(x_3 = (((tupledArg = [str, adic], parse_1(tupledArg[0], 511, false, 32, tupledArg[1]))) | 0), positive ? x_3 : op_UnaryNegation_Int32(x_3)), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_puint32(x_0, x_1) {
    let this$, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pUIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][1];
        const s_2 = matchValue.fields[0][1];
        const adic = matchValue.fields[0][0][0] | 0;
        try {
            return new FSharpResult$2(0, [(tupledArg = [str, adic], parse_1(tupledArg[0], 511, true, 32, tupledArg[1])), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_pint64(x_0, x_1) {
    let this$, x_3, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][2];
        const s_2 = matchValue.fields[0][1];
        const positive = matchValue.fields[0][0][0];
        const adic = matchValue.fields[0][0][1] | 0;
        try {
            return new FSharpResult$2(0, [(x_3 = ((tupledArg = [str, adic], parse_2(tupledArg[0], 511, false, 64, tupledArg[1]))), positive ? x_3 : op_UnaryNegation(x_3)), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_puint64(x_0, x_1) {
    let this$, tupledArg;
    const x = [x_0, x_1];
    const state_1 = x[0];
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), CharParsers_Internal_pUIntLikeUnit([void 0, x[1]]));
    if (matchValue.tag === 0) {
        const str = matchValue.fields[0][0][1];
        const s_2 = matchValue.fields[0][1];
        const adic = matchValue.fields[0][0][0] | 0;
        try {
            return new FSharpResult$2(0, [(tupledArg = [str, adic], parse_2(tupledArg[0], 511, true, 64, tupledArg[1])), s_2, state_1]);
        }
        catch (matchValue_1) {
            return new FSharpResult$2(1, [singleton_1([(this$ = s_2, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(2, "value was too large and too small."))]), state_1]);
        }
    }
    else {
        const es = matchValue.fields[0][0];
        return new FSharpResult$2(1, [es, state_1]);
    }
}

export function CharParsers_notFollowedByEof(state, s) {
    let this$, index, this$_1;
    if (((this$ = s, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))) !== "￿") {
        return new FSharpResult$2(0, [void 0, s, state]);
    }
    else {
        return new FSharpResult$2(1, [singleton_1([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(1, "EOF"))]), state]);
    }
}

export function CharParsers_followedByNewline(state, s) {
    let this$, index, this$_1;
    if (((this$ = s, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))) === "\n") {
        return new FSharpResult$2(0, [void 0, s, state]);
    }
    else {
        return new FSharpResult$2(1, [singleton_1([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(0, "newline"))]), state]);
    }
}

export function CharParsers_notFollowedByNewline(state, s) {
    let this$, index, this$_1;
    if (((this$ = s, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))) !== "\n") {
        return new FSharpResult$2(0, [void 0, s, state]);
    }
    else {
        return new FSharpResult$2(1, [singleton_1([(this$_1 = s, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(1, "newline"))]), state]);
    }
}

export function CharParsers_previousCharSatisfiesNot(cond) {
    return (tupledArg) => {
        let this$_1, c, this$_2;
        const state_1 = tupledArg[0];
        const s_1 = tupledArg[1];
        let matchValue;
        const this$ = s_1;
        const i = (this$.startIndex + -1) | 0;
        matchValue = (((i >= 0) && (i < this$.underlying.length)) ? this$.underlying[i] : "￿");
        if (matchValue === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), singleton_1(new ErrorType(1, "start of input"))]), state_1]);
        }
        else if ((c = matchValue, !cond(c))) {
            const c_1 = matchValue;
            return new FSharpResult$2(0, [void 0, s_1, state_1]);
        }
        else {
            return new FSharpResult$2(1, [singleton_1([(this$_2 = s_1, new Position(this$_2.startLine, this$_2.startColumn)), singleton_1(new ErrorType(0, "previous char satisfying the condition"))]), state_1]);
        }
    };
}

const Tests_ISO8601DateTime_iso8601_full_date = (tupledArg_20) => {
    let s_35, matchValue_13, matchValue_11, len_2, result, go, state_38, s_32, r1, matchValue_12, len_8, result_6, go_2, state_40, s_33, r2_1, e_6, e_5, state_44, this$_12, x_6, _arg1, testExpr, year, month, day;
    const matchValue_14 = Result_MapError((tupledArg_21) => ParseError_sort(tupledArg_21[0], void 0), (s_35 = tupledArg_20[1], (matchValue_13 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (matchValue_11 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (len_2 = 4, (result = fill(new Array(len_2), 0, len_2, ""), (go = ((i_2_mut, tupledArg_2_mut) => {
        let label, s_2, matchValue, this$, index, this$_1, c, this$_2, start_1, finish_1, len_1, line, column, this$_3;
        go:
        while (true) {
            const i_2 = i_2_mut, tupledArg_2 = tupledArg_2_mut;
            const state_7 = tupledArg_2[0];
            const s_5 = tupledArg_2[1];
            if (i_2 === len_2) {
                return new FSharpResult$2(0, [result, s_5, void 0]);
            }
            else {
                const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), (label = "[0-9]", (s_2 = s_5, (matchValue = ((this$ = s_2, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))), (matchValue === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_1 = s_2, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0])) : ((c = matchValue, isDigit(c) ? (new FSharpResult$2(0, [c, (this$_2 = s_2, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len_1 = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
                    for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                        if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                            line = ((line + 1) | 0);
                            column = 0;
                        }
                        else {
                            column = ((column + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_2.startIndex + start_1, len_1, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_2, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c)])]), void 0]))))))));
                if (matchValue_2.tag === 0) {
                    const state_9 = matchValue_2.fields[0][2];
                    const s_6 = matchValue_2.fields[0][1];
                    const r = matchValue_2.fields[0][0];
                    result[i_2] = r;
                    i_2_mut = (i_2 + 1);
                    tupledArg_2_mut = [void 0, s_6];
                    continue go;
                }
                else {
                    const e = matchValue_2.fields[0];
                    return new FSharpResult$2(1, e);
                }
            }
            break;
        }
    }), go(0, [void 0, s_35]))))), (matchValue_11.tag === 0) ? ((state_38 = matchValue_11.fields[0][2], (s_32 = matchValue_11.fields[0][1], (r1 = matchValue_11.fields[0][0], (matchValue_12 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), (len_8 = 2, (result_6 = fill(new Array(len_8), 0, len_8, null), (go_2 = ((i_8_mut, tupledArg_13_mut) => {
        let matchValue_8, c_2, s_8, matchValue_3, this$_4, index_1, this$_5, head, this$_6, start_3, finish_3, len_4, line_1, column_1, this$_7, state_27, s_24, matchValue_9, len_7, result_2, go_1, state_29, s_25, r2, e_3, e_2;
        go_2:
        while (true) {
            const i_8 = i_8_mut, tupledArg_13 = tupledArg_13_mut;
            const state_32 = tupledArg_13[0];
            const s_28 = tupledArg_13[1];
            if (i_8 === len_8) {
                return new FSharpResult$2(0, [result_6, s_28, void 0]);
            }
            else {
                const matchValue_10 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), (matchValue_8 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), (c_2 = "-", (s_8 = s_28, (matchValue_3 = ((this$_4 = s_8, (index_1 = 0, ((index_1 < 0) ? true : (index_1 >= this$_4.length)) ? "￿" : this$_4.underlying[this$_4.startIndex + index_1]))), (matchValue_3 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_5 = s_8, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_2) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head = matchValue_3, (head === c_2) ? (new FSharpResult$2(0, [void 0, (this$_6 = s_8, (start_3 = (defaultArg(1, 0) | 0), (finish_3 = (defaultArg(void 0, this$_6.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_6.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length))) ? ((len_4 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_6.startLine, (column_1 = this$_6.startColumn, ((() => {
                    for (let i_4 = 0; i_4 <= (start_3 - 1); i_4++) {
                        if (this$_6.underlying[this$_6.startIndex + i_4] === "\n") {
                            line_1 = ((line_1 + 1) | 0);
                            column_1 = 0;
                        }
                        else {
                            column_1 = ((column_1 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_6.startIndex + start_3, len_4, this$_6.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_7 = s_8, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_2) + "\u0027"), new ErrorType(1, ("\u0027" + head) + "\u0027")])]), void 0])))))))), (matchValue_8.tag === 0) ? ((state_27 = matchValue_8.fields[0][2], (s_24 = matchValue_8.fields[0][1], (matchValue_9 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), (len_7 = 2, (result_2 = fill(new Array(len_7), 0, len_7, ""), (go_1 = ((i_7_mut, tupledArg_7_mut) => {
                    let label_1, s_17, matchValue_5, this$_8, index_2, this$_9, c_3, this$_10, start_5, finish_5, len_6, line_2, column_2, this$_11;
                    go_1:
                    while (true) {
                        const i_7 = i_7_mut, tupledArg_7 = tupledArg_7_mut;
                        const state_21 = tupledArg_7[0];
                        const s_20 = tupledArg_7[1];
                        if (i_7 === len_7) {
                            return new FSharpResult$2(0, [result_2, s_20, void 0]);
                        }
                        else {
                            const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (label_1 = "[0-9]", (s_17 = s_20, (matchValue_5 = ((this$_8 = s_17, (index_2 = 0, ((index_2 < 0) ? true : (index_2 >= this$_8.length)) ? "￿" : this$_8.underlying[this$_8.startIndex + index_2]))), (matchValue_5 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_9 = s_17, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0])) : ((c_3 = matchValue_5, isDigit(c_3) ? (new FSharpResult$2(0, [c_3, (this$_10 = s_17, (start_5 = (defaultArg(1, 0) | 0), (finish_5 = (defaultArg(void 0, this$_10.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_10.length)) && (finish_5 < max_4((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_10.length))) ? ((len_6 = (max_4((x_5, y_5) => comparePrimitives(x_5, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_10.startLine, (column_2 = this$_10.startColumn, ((() => {
                                for (let i_6 = 0; i_6 <= (start_5 - 1); i_6++) {
                                    if (this$_10.underlying[this$_10.startIndex + i_6] === "\n") {
                                        line_2 = ((line_2 + 1) | 0);
                                        column_2 = 0;
                                    }
                                    else {
                                        column_2 = ((column_2 + 1) | 0);
                                    }
                                }
                            })(), new StringSegment(this$_10.startIndex + start_5, len_6, this$_10.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_11 = s_17, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_3)])]), void 0]))))))));
                            if (matchValue_7.tag === 0) {
                                const state_23 = matchValue_7.fields[0][2];
                                const s_21 = matchValue_7.fields[0][1];
                                const r_1 = matchValue_7.fields[0][0];
                                result_2[i_7] = r_1;
                                i_7_mut = (i_7 + 1);
                                tupledArg_7_mut = [void 0, s_21];
                                continue go_1;
                            }
                            else {
                                const e_1 = matchValue_7.fields[0];
                                return new FSharpResult$2(1, e_1);
                            }
                        }
                        break;
                    }
                }), go_1(0, [void 0, s_24]))))), (matchValue_9.tag === 0) ? ((state_29 = matchValue_9.fields[0][2], (s_25 = matchValue_9.fields[0][1], (r2 = matchValue_9.fields[0][0], new FSharpResult$2(0, [r2, s_25, void 0]))))) : ((e_3 = matchValue_9.fields[0], new FSharpResult$2(1, e_3))))))) : ((e_2 = matchValue_8.fields[0], new FSharpResult$2(1, e_2)))));
                if (matchValue_10.tag === 0) {
                    const state_34 = matchValue_10.fields[0][2];
                    const s_29 = matchValue_10.fields[0][1];
                    const r_2 = matchValue_10.fields[0][0];
                    result_6[i_8] = r_2;
                    i_8_mut = (i_8 + 1);
                    tupledArg_13_mut = [void 0, s_29];
                    continue go_2;
                }
                else {
                    const e_4 = matchValue_10.fields[0];
                    return new FSharpResult$2(1, e_4);
                }
            }
            break;
        }
    }), go_2(0, [void 0, s_32]))))), (matchValue_12.tag === 0) ? ((state_40 = matchValue_12.fields[0][2], (s_33 = matchValue_12.fields[0][1], (r2_1 = matchValue_12.fields[0][0], new FSharpResult$2(0, [[r1, r2_1], s_33, void 0]))))) : ((e_6 = matchValue_12.fields[0], new FSharpResult$2(1, e_6)))))))) : ((e_5 = matchValue_11.fields[0], new FSharpResult$2(1, e_5))))), (matchValue_13.tag === 1) ? ((state_44 = matchValue_13.fields[0][1], new FSharpResult$2(1, [singleton_1([(this$_12 = s_35, new Position(this$_12.startLine, this$_12.startColumn)), singleton_1(new ErrorType(0, "ISO8601 Full Date"))]), void 0]))) : ((x_6 = matchValue_13, x_6)))));
    if (matchValue_14.tag === 0) {
        const state_49 = matchValue_14.fields[0][2];
        const s_38 = matchValue_14.fields[0][1];
        const r_3 = matchValue_14.fields[0][0];
        return new FSharpResult$2(0, [(_arg1 = r_3, ((testExpr = _arg1[1], (!equalsWith((x_7, y_6) => equalsWith((x_8, y_7) => (x_8 === y_7), x_7, y_6), testExpr, null)) && (testExpr.length === 2))) ? ((year = _arg1[0], (month = _arg1[1][0], (day = _arg1[1][1], [parse_1(join("", year), 511, false, 32), parse_1(join("", month), 511, false, 32), parse_1(join("", day), 511, false, 32)])))) : (() => {
            throw (new Error("impossible"));
        })()), s_38, void 0]);
    }
    else {
        const e_7 = matchValue_14.fields[0];
        return new FSharpResult$2(1, e_7);
    }
};

const Tests_ISO8601DateTime_iso8601_partial_time = (() => {
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
        matchValue_15 = (((index_4 < 0) ? true : (index_4 >= this$_16.length)) ? "￿" : this$_16.underlying[this$_16.startIndex + index_4]);
        if (matchValue_15 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_17 = s_44, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_6 = matchValue_15;
            if (isDigit(c_6)) {
                return new FSharpResult$2(0, [c_6, (this$_18 = s_44, (start_9 = (defaultArg(1, 0) | 0), (finish_9 = (defaultArg(void 0, this$_18.length - 1) | 0), (((start_9 >= 0) && (start_9 <= this$_18.length)) && (finish_9 < max_4((x_8, y_8) => comparePrimitives(x_8, y_8), start_9, this$_18.length))) ? ((len_10 = (max_4((x_9, y_9) => comparePrimitives(x_9, y_9), 0, (finish_9 - start_9) + 1) | 0), (line_4 = this$_18.startLine, (column_4 = this$_18.startColumn, ((() => {
                    for (let i_12 = 0; i_12 <= (start_9 - 1); i_12++) {
                        if (this$_18.underlying[this$_18.startIndex + i_12] === "\n") {
                            line_4 = ((line_4 + 1) | 0);
                            column_4 = 0;
                        }
                        else {
                            column_4 = ((column_4 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_18.startIndex + start_9, len_10, this$_18.underlying, line_4, column_4)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)))), void 0]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_19 = s_44, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, c_6)])]), void 0]);
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
            }
            else {
                const state_52 = matchValue_17.fields[0][1];
                return new FSharpResult$2(0, [reverse(acc), s_45, void 0]);
            }
            break;
        }
    };
    p2_4 = ((tupledArg_22) => {
        let f;
        const state_54 = tupledArg_22[0];
        const s_47 = tupledArg_22[1];
        const matchValue_18 = Result_MapError((tupledArg_23) => ParseError_sort(tupledArg_23[0], void 0), fp([void 0, s_47]));
        if (matchValue_18.tag === 0) {
            const state_57 = matchValue_18.fields[0][2];
            const s_48 = matchValue_18.fields[0][1];
            const r_4 = matchValue_18.fields[0][0];
            const r_5 = singleton_1(r_4);
            return go_3(r_5, [void 0, s_48]);
        }
        else {
            const state_56 = matchValue_18.fields[0][1];
            const es = matchValue_18.fields[0][0];
            return (resultForEmptySequence == null) ? (new FSharpResult$2(1, [es, void 0])) : (new FSharpResult$2(0, [(resultForEmptySequence == null) ? null : ((f = resultForEmptySequence, f())), s_47, void 0]));
        }
    });
    p_19 = ((tupledArg_24) => {
        let c_5, s_35, matchValue_13, this$_12, index_3, this$_13, head_1, this$_14, start_7, finish_7, len_9, line_3, column_3, this$_15;
        const matchValue_19 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), (c_5 = ".", (s_35 = tupledArg_24[1], (matchValue_13 = ((this$_12 = s_35, (index_3 = 0, ((index_3 < 0) ? true : (index_3 >= this$_12.length)) ? "￿" : this$_12.underlying[this$_12.startIndex + index_3]))), (matchValue_13 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_13 = s_35, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_5) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head_1 = matchValue_13, (head_1 === c_5) ? (new FSharpResult$2(0, [void 0, (this$_14 = s_35, (start_7 = (defaultArg(1, 0) | 0), (finish_7 = (defaultArg(void 0, this$_14.length - 1) | 0), (((start_7 >= 0) && (start_7 <= this$_14.length)) && (finish_7 < max_4((x_6, y_6) => comparePrimitives(x_6, y_6), start_7, this$_14.length))) ? ((len_9 = (max_4((x_7, y_7) => comparePrimitives(x_7, y_7), 0, (finish_7 - start_7) + 1) | 0), (line_3 = this$_14.startLine, (column_3 = this$_14.startColumn, ((() => {
            for (let i_10 = 0; i_10 <= (start_7 - 1); i_10++) {
                if (this$_14.underlying[this$_14.startIndex + i_10] === "\n") {
                    line_3 = ((line_3 + 1) | 0);
                    column_3 = 0;
                }
                else {
                    column_3 = ((column_3 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_14.startIndex + start_7, len_9, this$_14.underlying, line_3, column_3)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_15 = s_35, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_5) + "\u0027"), new ErrorType(1, ("\u0027" + head_1) + "\u0027")])]), void 0]))))))));
        if (matchValue_19.tag === 0) {
            const state_61 = matchValue_19.fields[0][2];
            const s_51 = matchValue_19.fields[0][1];
            const matchValue_20 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), p2_4([void 0, s_51]));
            if (matchValue_20.tag === 0) {
                const state_63 = matchValue_20.fields[0][2];
                const s_52 = matchValue_20.fields[0][1];
                const r2_2 = matchValue_20.fields[0][0];
                return new FSharpResult$2(0, [r2_2, s_52, void 0]);
            }
            else {
                const e_8 = matchValue_20.fields[0];
                return new FSharpResult$2(1, e_8);
            }
        }
        else {
            const e_7 = matchValue_19.fields[0];
            return new FSharpResult$2(1, e_7);
        }
    });
    p2_6 = ((tupledArg_27) => {
        const s_54 = tupledArg_27[1];
        const matchValue_21 = Result_MapError((tupledArg_28) => ParseError_sort(tupledArg_28[0], void 0), p_19([void 0, s_54]));
        if (matchValue_21.tag === 1) {
            const state_68 = matchValue_21.fields[0][1];
            return new FSharpResult$2(0, [void 0, s_54, void 0]);
        }
        else {
            const state_67 = matchValue_21.fields[0][2];
            const s_55 = matchValue_21.fields[0][1];
            const r_6 = matchValue_21.fields[0][0];
            return new FSharpResult$2(0, [r_6, s_55, void 0]);
        }
    });
    p_24 = ((tupledArg_29) => {
        let matchValue_11, len_2, result, go, state_38, s_32, r1, matchValue_12, len_8, result_6, go_2, state_40, s_33, r2_1, e_6, e_5;
        const matchValue_22 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), (matchValue_11 = Result_MapError((tupledArg_16) => ParseError_sort(tupledArg_16[0], void 0), (len_2 = 2, (result = fill(new Array(len_2), 0, len_2, ""), (go = ((i_2_mut, tupledArg_2_mut) => {
            let label, s_2, matchValue, this$, index, this$_1, c, this$_2, start_1, finish_1, len_1, line, column, this$_3;
            go:
            while (true) {
                const i_2 = i_2_mut, tupledArg_2 = tupledArg_2_mut;
                const state_7 = tupledArg_2[0];
                const s_5 = tupledArg_2[1];
                if (i_2 === len_2) {
                    return new FSharpResult$2(0, [result, s_5, void 0]);
                }
                else {
                    const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), (label = "[0-9]", (s_2 = s_5, (matchValue = ((this$ = s_2, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))), (matchValue === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_1 = s_2, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0])) : ((c = matchValue, isDigit(c) ? (new FSharpResult$2(0, [c, (this$_2 = s_2, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len_1 = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
                        for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                            if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                                line = ((line + 1) | 0);
                                column = 0;
                            }
                            else {
                                column = ((column + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_2.startIndex + start_1, len_1, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_2, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c)])]), void 0]))))))));
                    if (matchValue_2.tag === 0) {
                        const state_9 = matchValue_2.fields[0][2];
                        const s_6 = matchValue_2.fields[0][1];
                        const r = matchValue_2.fields[0][0];
                        result[i_2] = r;
                        i_2_mut = (i_2 + 1);
                        tupledArg_2_mut = [void 0, s_6];
                        continue go;
                    }
                    else {
                        const e = matchValue_2.fields[0];
                        return new FSharpResult$2(1, e);
                    }
                }
                break;
            }
        }), go(0, [void 0, tupledArg_29[1]]))))), (matchValue_11.tag === 0) ? ((state_38 = matchValue_11.fields[0][2], (s_32 = matchValue_11.fields[0][1], (r1 = matchValue_11.fields[0][0], (matchValue_12 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), (len_8 = 2, (result_6 = fill(new Array(len_8), 0, len_8, null), (go_2 = ((i_8_mut, tupledArg_13_mut) => {
            let matchValue_8, c_2, s_8, matchValue_3, this$_4, index_1, this$_5, head, this$_6, start_3, finish_3, len_4, line_1, column_1, this$_7, state_27, s_24, matchValue_9, len_7, result_2, go_1, state_29, s_25, r2, e_3, e_2;
            go_2:
            while (true) {
                const i_8 = i_8_mut, tupledArg_13 = tupledArg_13_mut;
                const state_32 = tupledArg_13[0];
                const s_28 = tupledArg_13[1];
                if (i_8 === len_8) {
                    return new FSharpResult$2(0, [result_6, s_28, void 0]);
                }
                else {
                    const matchValue_10 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), (matchValue_8 = Result_MapError((tupledArg_10) => ParseError_sort(tupledArg_10[0], void 0), (c_2 = ":", (s_8 = s_28, (matchValue_3 = ((this$_4 = s_8, (index_1 = 0, ((index_1 < 0) ? true : (index_1 >= this$_4.length)) ? "￿" : this$_4.underlying[this$_4.startIndex + index_1]))), (matchValue_3 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_5 = s_8, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_2) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head = matchValue_3, (head === c_2) ? (new FSharpResult$2(0, [void 0, (this$_6 = s_8, (start_3 = (defaultArg(1, 0) | 0), (finish_3 = (defaultArg(void 0, this$_6.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_6.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_6.length))) ? ((len_4 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_6.startLine, (column_1 = this$_6.startColumn, ((() => {
                        for (let i_4 = 0; i_4 <= (start_3 - 1); i_4++) {
                            if (this$_6.underlying[this$_6.startIndex + i_4] === "\n") {
                                line_1 = ((line_1 + 1) | 0);
                                column_1 = 0;
                            }
                            else {
                                column_1 = ((column_1 + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_6.startIndex + start_3, len_4, this$_6.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_7 = s_8, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_2) + "\u0027"), new ErrorType(1, ("\u0027" + head) + "\u0027")])]), void 0])))))))), (matchValue_8.tag === 0) ? ((state_27 = matchValue_8.fields[0][2], (s_24 = matchValue_8.fields[0][1], (matchValue_9 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), (len_7 = 2, (result_2 = fill(new Array(len_7), 0, len_7, ""), (go_1 = ((i_7_mut, tupledArg_7_mut) => {
                        let label_1, s_17, matchValue_5, this$_8, index_2, this$_9, c_3, this$_10, start_5, finish_5, len_6, line_2, column_2, this$_11;
                        go_1:
                        while (true) {
                            const i_7 = i_7_mut, tupledArg_7 = tupledArg_7_mut;
                            const state_21 = tupledArg_7[0];
                            const s_20 = tupledArg_7[1];
                            if (i_7 === len_7) {
                                return new FSharpResult$2(0, [result_2, s_20, void 0]);
                            }
                            else {
                                const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (label_1 = "[0-9]", (s_17 = s_20, (matchValue_5 = ((this$_8 = s_17, (index_2 = 0, ((index_2 < 0) ? true : (index_2 >= this$_8.length)) ? "￿" : this$_8.underlying[this$_8.startIndex + index_2]))), (matchValue_5 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_9 = s_17, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0])) : ((c_3 = matchValue_5, isDigit(c_3) ? (new FSharpResult$2(0, [c_3, (this$_10 = s_17, (start_5 = (defaultArg(1, 0) | 0), (finish_5 = (defaultArg(void 0, this$_10.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_10.length)) && (finish_5 < max_4((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_10.length))) ? ((len_6 = (max_4((x_5, y_5) => comparePrimitives(x_5, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_10.startLine, (column_2 = this$_10.startColumn, ((() => {
                                    for (let i_6 = 0; i_6 <= (start_5 - 1); i_6++) {
                                        if (this$_10.underlying[this$_10.startIndex + i_6] === "\n") {
                                            line_2 = ((line_2 + 1) | 0);
                                            column_2 = 0;
                                        }
                                        else {
                                            column_2 = ((column_2 + 1) | 0);
                                        }
                                    }
                                })(), new StringSegment(this$_10.startIndex + start_5, len_6, this$_10.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_11 = s_17, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_3)])]), void 0]))))))));
                                if (matchValue_7.tag === 0) {
                                    const state_23 = matchValue_7.fields[0][2];
                                    const s_21 = matchValue_7.fields[0][1];
                                    const r_1 = matchValue_7.fields[0][0];
                                    result_2[i_7] = r_1;
                                    i_7_mut = (i_7 + 1);
                                    tupledArg_7_mut = [void 0, s_21];
                                    continue go_1;
                                }
                                else {
                                    const e_1 = matchValue_7.fields[0];
                                    return new FSharpResult$2(1, e_1);
                                }
                            }
                            break;
                        }
                    }), go_1(0, [void 0, s_24]))))), (matchValue_9.tag === 0) ? ((state_29 = matchValue_9.fields[0][2], (s_25 = matchValue_9.fields[0][1], (r2 = matchValue_9.fields[0][0], new FSharpResult$2(0, [r2, s_25, void 0]))))) : ((e_3 = matchValue_9.fields[0], new FSharpResult$2(1, e_3))))))) : ((e_2 = matchValue_8.fields[0], new FSharpResult$2(1, e_2)))));
                    if (matchValue_10.tag === 0) {
                        const state_34 = matchValue_10.fields[0][2];
                        const s_29 = matchValue_10.fields[0][1];
                        const r_2 = matchValue_10.fields[0][0];
                        result_6[i_8] = r_2;
                        i_8_mut = (i_8 + 1);
                        tupledArg_13_mut = [void 0, s_29];
                        continue go_2;
                    }
                    else {
                        const e_4 = matchValue_10.fields[0];
                        return new FSharpResult$2(1, e_4);
                    }
                }
                break;
            }
        }), go_2(0, [void 0, s_32]))))), (matchValue_12.tag === 0) ? ((state_40 = matchValue_12.fields[0][2], (s_33 = matchValue_12.fields[0][1], (r2_1 = matchValue_12.fields[0][0], new FSharpResult$2(0, [[r1, r2_1], s_33, void 0]))))) : ((e_6 = matchValue_12.fields[0], new FSharpResult$2(1, e_6)))))))) : ((e_5 = matchValue_11.fields[0], new FSharpResult$2(1, e_5)))));
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
            }
            else {
                const e_10 = matchValue_23.fields[0];
                return new FSharpResult$2(1, e_10);
            }
        }
        else {
            const e_9 = matchValue_22.fields[0];
            return new FSharpResult$2(1, e_9);
        }
    });
    p_27 = ((tupledArg_32) => {
        let this$_20;
        const s_61 = tupledArg_32[1];
        const matchValue_24 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), p_24([void 0, s_61]));
        if (matchValue_24.tag === 1) {
            const state_78 = matchValue_24.fields[0][1];
            return new FSharpResult$2(1, [singleton_1([(this$_20 = s_61, new Position(this$_20.startLine, this$_20.startColumn)), singleton_1(new ErrorType(0, "ISO8601 Partial Time"))]), void 0]);
        }
        else {
            const x_12 = matchValue_24;
            return x_12;
        }
    });
    return (tupledArg_34) => {
        let _arg1, testExpr, second, secfrac, minute, hour;
        const matchValue_25 = Result_MapError((tupledArg_35) => ParseError_sort(tupledArg_35[0], void 0), p_27([void 0, tupledArg_34[1]]));
        if (matchValue_25.tag === 0) {
            const state_83 = matchValue_25.fields[0][2];
            const s_64 = matchValue_25.fields[0][1];
            const r_7 = matchValue_25.fields[0][0];
            return new FSharpResult$2(0, [(_arg1 = r_7, ((testExpr = _arg1[0][1], (!equalsWith((x_13, y_10) => equalsWith((x_14, y_11) => (x_14 === y_11), x_13, y_10), testExpr, null)) && (testExpr.length === 2))) ? ((second = _arg1[0][1][1], (secfrac = _arg1[1], (minute = _arg1[0][1][0], (hour = _arg1[0][0], [parse_1(join("", hour), 511, false, 32), parse_1(join("", minute), 511, false, 32), parse_1(join("", second), 511, false, 32), defaultArg(map((xs_11) => parse_1(join("", (length_25(xs_11) > 3) ? take(3, xs_11) : xs_11), 511, false, 32), secfrac), 0)]))))) : (() => {
                throw (new Error("impossible"));
            })()), s_64, void 0]);
        }
        else {
            const e_11 = matchValue_25.fields[0];
            return new FSharpResult$2(1, e_11);
        }
    };
})();

const Tests_ISO8601DateTime_iso8601_offset = (() => {
    const sign = (tupledArg_6) => {
        let matchValue_2, c_1, s_1, matchValue, this$, index, this$_1, head, this$_2, start_1, finish_1, len, line, column, this$_3, state_7, s_10, e, matchValue_5, c_3, s_12, matchValue_3, this$_4, index_1, this$_5, head_1, this$_6, start_3, finish_3, len_1, line_1, column_1, this$_7, state_15, s_21, e_1;
        const s_23 = tupledArg_6[1];
        const matchValue_6 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (matchValue_2 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), (c_1 = "+", (s_1 = s_23, (matchValue = ((this$ = s_1, (index = 0, ((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]))), (matchValue === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_1) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head = matchValue, (head === c_1) ? (new FSharpResult$2(0, [void 0, (this$_2 = s_1, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
            for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                    line = ((line + 1) | 0);
                    column = 0;
                }
                else {
                    column = ((column + 1) | 0);
                }
            }
        })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_1) + "\u0027"), new ErrorType(1, ("\u0027" + head) + "\u0027")])]), void 0])))))))), (matchValue_2.tag === 0) ? ((state_7 = matchValue_2.fields[0][2], (s_10 = matchValue_2.fields[0][1], new FSharpResult$2(0, [true, s_10, void 0])))) : ((e = matchValue_2.fields[0], new FSharpResult$2(1, e)))));
        if (matchValue_6.tag === 1) {
            const state_19 = matchValue_6.fields[0][1];
            const es = matchValue_6.fields[0][0];
            const matchValue_7 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (matchValue_5 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), (c_3 = "-", (s_12 = s_23, (matchValue_3 = ((this$_4 = s_12, (index_1 = 0, ((index_1 < 0) ? true : (index_1 >= this$_4.length)) ? "￿" : this$_4.underlying[this$_4.startIndex + index_1]))), (matchValue_3 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_5 = s_12, new Position(this$_5.startLine, this$_5.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_3) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head_1 = matchValue_3, (head_1 === c_3) ? (new FSharpResult$2(0, [void 0, (this$_6 = s_12, (start_3 = (defaultArg(1, 0) | 0), (finish_3 = (defaultArg(void 0, this$_6.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_6.length)) && (finish_3 < max_4((x_4, y_2) => comparePrimitives(x_4, y_2), start_3, this$_6.length))) ? ((len_1 = (max_4((x_5, y_3) => comparePrimitives(x_5, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_6.startLine, (column_1 = this$_6.startColumn, ((() => {
                for (let i_3 = 0; i_3 <= (start_3 - 1); i_3++) {
                    if (this$_6.underlying[this$_6.startIndex + i_3] === "\n") {
                        line_1 = ((line_1 + 1) | 0);
                        column_1 = 0;
                    }
                    else {
                        column_1 = ((column_1 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_6.startIndex + start_3, len_1, this$_6.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_7 = s_12, new Position(this$_7.startLine, this$_7.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_3) + "\u0027"), new ErrorType(1, ("\u0027" + head_1) + "\u0027")])]), void 0])))))))), (matchValue_5.tag === 0) ? ((state_15 = matchValue_5.fields[0][2], (s_21 = matchValue_5.fields[0][1], new FSharpResult$2(0, [false, s_21, void 0])))) : ((e_1 = matchValue_5.fields[0], new FSharpResult$2(1, e_1)))));
            if (matchValue_7.tag === 1) {
                const state_21 = matchValue_7.fields[0][1];
                const es$0027 = matchValue_7.fields[0][0];
                return new FSharpResult$2(1, [append_1(es, es$0027), void 0]);
            }
            else {
                const x_9 = matchValue_7;
                return x_9;
            }
        }
        else {
            const x_8 = matchValue_6;
            return x_8;
        }
    };
    const numoffset = (tupledArg_28) => {
        let matchValue_20, matchValue_15, matchValue_11, state_35, s_33, r1, matchValue_12, len_4, result_4, go, state_37, s_34, r2, e_4, e_3, state_45, s_45, r1_1, matchValue_16, c_6, s_36, matchValue_13, this$_12, index_3, this$_13, head_2, this$_14, start_7, finish_7, len_5, line_3, column_3, this$_15, state_47, s_46, e_6, e_5, state_61, s_56, r1_2, matchValue_21, len_8, result_10, go_1, state_63, s_57, r2_1, e_9, e_8, tupledArg_27, _arg1, second, sign_1, minute;
        const matchValue_22 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), (matchValue_20 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), (matchValue_15 = Result_MapError((tupledArg_18) => ParseError_sort(tupledArg_18[0], void 0), (matchValue_11 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), sign([void 0, tupledArg_28[1]])), (matchValue_11.tag === 0) ? ((state_35 = matchValue_11.fields[0][2], (s_33 = matchValue_11.fields[0][1], (r1 = matchValue_11.fields[0][0], (matchValue_12 = Result_MapError((tupledArg_15) => ParseError_sort(tupledArg_15[0], void 0), (len_4 = 2, (result_4 = fill(new Array(len_4), 0, len_4, ""), (go = ((i_6_mut, tupledArg_11_mut) => {
            let label, s_26, matchValue_8, this$_8, index_2, this$_9, c_4, this$_10, start_5, finish_5, len_3, line_2, column_2, this$_11;
            go:
            while (true) {
                const i_6 = i_6_mut, tupledArg_11 = tupledArg_11_mut;
                const state_29 = tupledArg_11[0];
                const s_29 = tupledArg_11[1];
                if (i_6 === len_4) {
                    return new FSharpResult$2(0, [result_4, s_29, void 0]);
                }
                else {
                    const matchValue_10 = Result_MapError((tupledArg_12) => ParseError_sort(tupledArg_12[0], void 0), (label = "[0-9]", (s_26 = s_29, (matchValue_8 = ((this$_8 = s_26, (index_2 = 0, ((index_2 < 0) ? true : (index_2 >= this$_8.length)) ? "￿" : this$_8.underlying[this$_8.startIndex + index_2]))), (matchValue_8 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_9 = s_26, new Position(this$_9.startLine, this$_9.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, "EOF")])]), void 0])) : ((c_4 = matchValue_8, isDigit(c_4) ? (new FSharpResult$2(0, [c_4, (this$_10 = s_26, (start_5 = (defaultArg(1, 0) | 0), (finish_5 = (defaultArg(void 0, this$_10.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_10.length)) && (finish_5 < max_4((x_10, y_4) => comparePrimitives(x_10, y_4), start_5, this$_10.length))) ? ((len_3 = (max_4((x_11, y_5) => comparePrimitives(x_11, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_10.startLine, (column_2 = this$_10.startColumn, ((() => {
                        for (let i_5 = 0; i_5 <= (start_5 - 1); i_5++) {
                            if (this$_10.underlying[this$_10.startIndex + i_5] === "\n") {
                                line_2 = ((line_2 + 1) | 0);
                                column_2 = 0;
                            }
                            else {
                                column_2 = ((column_2 + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_10.startIndex + start_5, len_3, this$_10.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_11 = s_26, new Position(this$_11.startLine, this$_11.startColumn)), ofArray([new ErrorType(0, label), new ErrorType(1, c_4)])]), void 0]))))))));
                    if (matchValue_10.tag === 0) {
                        const state_31 = matchValue_10.fields[0][2];
                        const s_30 = matchValue_10.fields[0][1];
                        const r = matchValue_10.fields[0][0];
                        result_4[i_6] = r;
                        i_6_mut = (i_6 + 1);
                        tupledArg_11_mut = [void 0, s_30];
                        continue go;
                    }
                    else {
                        const e_2 = matchValue_10.fields[0];
                        return new FSharpResult$2(1, e_2);
                    }
                }
                break;
            }
        }), go(0, [void 0, s_33]))))), (matchValue_12.tag === 0) ? ((state_37 = matchValue_12.fields[0][2], (s_34 = matchValue_12.fields[0][1], (r2 = matchValue_12.fields[0][0], new FSharpResult$2(0, [[r1, r2], s_34, void 0]))))) : ((e_4 = matchValue_12.fields[0], new FSharpResult$2(1, e_4)))))))) : ((e_3 = matchValue_11.fields[0], new FSharpResult$2(1, e_3))))), (matchValue_15.tag === 0) ? ((state_45 = matchValue_15.fields[0][2], (s_45 = matchValue_15.fields[0][1], (r1_1 = matchValue_15.fields[0][0], (matchValue_16 = Result_MapError((tupledArg_19) => ParseError_sort(tupledArg_19[0], void 0), (c_6 = ":", (s_36 = s_45, (matchValue_13 = ((this$_12 = s_36, (index_3 = 0, ((index_3 < 0) ? true : (index_3 >= this$_12.length)) ? "￿" : this$_12.underlying[this$_12.startIndex + index_3]))), (matchValue_13 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_13 = s_36, new Position(this$_13.startLine, this$_13.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_6) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head_2 = matchValue_13, (head_2 === c_6) ? (new FSharpResult$2(0, [void 0, (this$_14 = s_36, (start_7 = (defaultArg(1, 0) | 0), (finish_7 = (defaultArg(void 0, this$_14.length - 1) | 0), (((start_7 >= 0) && (start_7 <= this$_14.length)) && (finish_7 < max_4((x_12, y_6) => comparePrimitives(x_12, y_6), start_7, this$_14.length))) ? ((len_5 = (max_4((x_13, y_7) => comparePrimitives(x_13, y_7), 0, (finish_7 - start_7) + 1) | 0), (line_3 = this$_14.startLine, (column_3 = this$_14.startColumn, ((() => {
            for (let i_8 = 0; i_8 <= (start_7 - 1); i_8++) {
                if (this$_14.underlying[this$_14.startIndex + i_8] === "\n") {
                    line_3 = ((line_3 + 1) | 0);
                    column_3 = 0;
                }
                else {
                    column_3 = ((column_3 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_14.startIndex + start_7, len_5, this$_14.underlying, line_3, column_3)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_15 = s_36, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_6) + "\u0027"), new ErrorType(1, ("\u0027" + head_2) + "\u0027")])]), void 0])))))))), (matchValue_16.tag === 0) ? ((state_47 = matchValue_16.fields[0][2], (s_46 = matchValue_16.fields[0][1], new FSharpResult$2(0, [r1_1, s_46, void 0])))) : ((e_6 = matchValue_16.fields[0], new FSharpResult$2(1, e_6)))))))) : ((e_5 = matchValue_15.fields[0], new FSharpResult$2(1, e_5))))), (matchValue_20.tag === 0) ? ((state_61 = matchValue_20.fields[0][2], (s_56 = matchValue_20.fields[0][1], (r1_2 = matchValue_20.fields[0][0], (matchValue_21 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), (len_8 = 2, (result_10 = fill(new Array(len_8), 0, len_8, ""), (go_1 = ((i_11_mut, tupledArg_22_mut) => {
            let label_1, s_49, matchValue_17, this$_16, index_4, this$_17, c_7, this$_18, start_9, finish_9, len_7, line_4, column_4, this$_19;
            go_1:
            while (true) {
                const i_11 = i_11_mut, tupledArg_22 = tupledArg_22_mut;
                const state_55 = tupledArg_22[0];
                const s_52 = tupledArg_22[1];
                if (i_11 === len_8) {
                    return new FSharpResult$2(0, [result_10, s_52, void 0]);
                }
                else {
                    const matchValue_19 = Result_MapError((tupledArg_23) => ParseError_sort(tupledArg_23[0], void 0), (label_1 = "[0-9]", (s_49 = s_52, (matchValue_17 = ((this$_16 = s_49, (index_4 = 0, ((index_4 < 0) ? true : (index_4 >= this$_16.length)) ? "￿" : this$_16.underlying[this$_16.startIndex + index_4]))), (matchValue_17 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_17 = s_49, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0])) : ((c_7 = matchValue_17, isDigit(c_7) ? (new FSharpResult$2(0, [c_7, (this$_18 = s_49, (start_9 = (defaultArg(1, 0) | 0), (finish_9 = (defaultArg(void 0, this$_18.length - 1) | 0), (((start_9 >= 0) && (start_9 <= this$_18.length)) && (finish_9 < max_4((x_14, y_8) => comparePrimitives(x_14, y_8), start_9, this$_18.length))) ? ((len_7 = (max_4((x_15, y_9) => comparePrimitives(x_15, y_9), 0, (finish_9 - start_9) + 1) | 0), (line_4 = this$_18.startLine, (column_4 = this$_18.startColumn, ((() => {
                        for (let i_10 = 0; i_10 <= (start_9 - 1); i_10++) {
                            if (this$_18.underlying[this$_18.startIndex + i_10] === "\n") {
                                line_4 = ((line_4 + 1) | 0);
                                column_4 = 0;
                            }
                            else {
                                column_4 = ((column_4 + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_18.startIndex + start_9, len_7, this$_18.underlying, line_4, column_4)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_19 = s_49, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c_7)])]), void 0]))))))));
                    if (matchValue_19.tag === 0) {
                        const state_57 = matchValue_19.fields[0][2];
                        const s_53 = matchValue_19.fields[0][1];
                        const r_1 = matchValue_19.fields[0][0];
                        result_10[i_11] = r_1;
                        i_11_mut = (i_11 + 1);
                        tupledArg_22_mut = [void 0, s_53];
                        continue go_1;
                    }
                    else {
                        const e_7 = matchValue_19.fields[0];
                        return new FSharpResult$2(1, e_7);
                    }
                }
                break;
            }
        }), go_1(0, [void 0, s_56]))))), (matchValue_21.tag === 0) ? ((state_63 = matchValue_21.fields[0][2], (s_57 = matchValue_21.fields[0][1], (r2_1 = matchValue_21.fields[0][0], new FSharpResult$2(0, [[r1_2, r2_1], s_57, void 0]))))) : ((e_9 = matchValue_21.fields[0], new FSharpResult$2(1, e_9)))))))) : ((e_8 = matchValue_20.fields[0], new FSharpResult$2(1, e_8)))));
        if (matchValue_22.tag === 0) {
            const state_67 = matchValue_22.fields[0][2];
            const s_60 = matchValue_22.fields[0][1];
            const r_2 = matchValue_22.fields[0][0];
            return new FSharpResult$2(0, [(tupledArg_27 = r_2, (_arg1 = tupledArg_27[0], (second = tupledArg_27[1], (sign_1 = _arg1[0], (minute = _arg1[1], [sign_1, parse_1(join("", minute), 511, false, 32), parse_1(join("", second), 511, false, 32)]))))), s_60, void 0]);
        }
        else {
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
    clo1_7 = ((tupledArg_30) => {
        let this$_21, this$_22, start_11, finish_11, len_9, line_5, column_5, this$_23;
        const label_3 = label_2;
        const s_62 = tupledArg_30[1];
        let matchValue_23;
        const this$_20 = s_62;
        const index_5 = 0;
        matchValue_23 = (((index_5 < 0) ? true : (index_5 >= this$_20.length)) ? "￿" : this$_20.underlying[this$_20.startIndex + index_5]);
        if (matchValue_23 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_21 = s_62, new Position(this$_21.startLine, this$_21.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_8 = matchValue_23;
            return set$.has(c_8) ? (new FSharpResult$2(0, [c_8, (this$_22 = s_62, (start_11 = (defaultArg(1, 0) | 0), (finish_11 = (defaultArg(void 0, this$_22.length - 1) | 0), (((start_11 >= 0) && (start_11 <= this$_22.length)) && (finish_11 < max_4((x_16, y_10) => comparePrimitives(x_16, y_10), start_11, this$_22.length))) ? ((len_9 = (max_4((x_17, y_11) => comparePrimitives(x_17, y_11), 0, (finish_11 - start_11) + 1) | 0), (line_5 = this$_22.startLine, (column_5 = this$_22.startColumn, ((() => {
                for (let i_13 = 0; i_13 <= (start_11 - 1); i_13++) {
                    if (this$_22.underlying[this$_22.startIndex + i_13] === "\n") {
                        line_5 = ((line_5 + 1) | 0);
                        column_5 = 0;
                    }
                    else {
                        column_5 = ((column_5 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_22.startIndex + start_11, len_9, this$_22.underlying, line_5, column_5)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_23 = s_62, new Position(this$_23.startLine, this$_23.startColumn)), ofArray([new ErrorType(0, label_3), new ErrorType(1, c_8)])]), void 0]));
        }
    });
    p_23 = ((tupledArg_31) => clo1_7([void 0, tupledArg_31[1]]));
    a = ((tupledArg_32) => {
        const matchValue_25 = Result_MapError((tupledArg_33) => ParseError_sort(tupledArg_33[0], void 0), p_23([void 0, tupledArg_32[1]]));
        if (matchValue_25.tag === 0) {
            const state_75 = matchValue_25.fields[0][2];
            const s_65 = matchValue_25.fields[0][1];
            return new FSharpResult$2(0, [void 0, s_65, void 0]);
        }
        else {
            const e_11 = matchValue_25.fields[0];
            return new FSharpResult$2(1, e_11);
        }
    });
    p_32 = ((tupledArg_38) => {
        let matchValue_26, state_79, s_68, r_3, e_12, matchValue_27, state_83, s_71, r_4, e_13;
        const s_73 = tupledArg_38[1];
        const matchValue_28 = Result_MapError((tupledArg_39) => ParseError_sort(tupledArg_39[0], void 0), (matchValue_26 = Result_MapError((tupledArg_35) => ParseError_sort(tupledArg_35[0], void 0), a([void 0, s_73])), (matchValue_26.tag === 0) ? ((state_79 = matchValue_26.fields[0][2], (s_68 = matchValue_26.fields[0][1], (r_3 = matchValue_26.fields[0][0], new FSharpResult$2(0, [new FSharpChoice$2(0, void 0), s_68, void 0]))))) : ((e_12 = matchValue_26.fields[0], new FSharpResult$2(1, e_12)))));
        if (matchValue_28.tag === 1) {
            const state_87 = matchValue_28.fields[0][1];
            const es_1 = matchValue_28.fields[0][0];
            const matchValue_29 = Result_MapError((tupledArg_40) => ParseError_sort(tupledArg_40[0], void 0), (matchValue_27 = Result_MapError((tupledArg_37) => ParseError_sort(tupledArg_37[0], void 0), numoffset([void 0, s_73])), (matchValue_27.tag === 0) ? ((state_83 = matchValue_27.fields[0][2], (s_71 = matchValue_27.fields[0][1], (r_4 = matchValue_27.fields[0][0], new FSharpResult$2(0, [new FSharpChoice$2(1, r_4), s_71, void 0]))))) : ((e_13 = matchValue_27.fields[0], new FSharpResult$2(1, e_13)))));
            if (matchValue_29.tag === 1) {
                const state_89 = matchValue_29.fields[0][1];
                const es$0027_1 = matchValue_29.fields[0][0];
                return new FSharpResult$2(1, [append_1(es_1, es$0027_1), void 0]);
            }
            else {
                const x_20 = matchValue_29;
                return x_20;
            }
        }
        else {
            const x_19 = matchValue_28;
            return x_19;
        }
    });
    return (tupledArg_41) => {
        let this$_24;
        const s_75 = tupledArg_41[1];
        const matchValue_30 = Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), p_32([void 0, s_75]));
        if (matchValue_30.tag === 1) {
            const state_93 = matchValue_30.fields[0][1];
            return new FSharpResult$2(1, [singleton_1([(this$_24 = s_75, new Position(this$_24.startLine, this$_24.startColumn)), singleton_1(new ErrorType(0, "ISO8601 Time Offset"))]), void 0]);
        }
        else {
            const x_21 = matchValue_30;
            return x_21;
        }
    };
})();

const Tests_ISO8601DateTime_iso8601_full_time = (tupledArg_6) => {
    let s_5, matchValue_2, matchValue, state_3, s_2, r1, matchValue_1, state_5, s_3, r2, e_1, e, state_9, this$, x, tupledArg_5, _arg1, o, s_6, m, h, f;
    const matchValue_3 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), (s_5 = tupledArg_6[1], (matchValue_2 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), (matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), Tests_ISO8601DateTime_iso8601_partial_time([void 0, s_5])), (matchValue.tag === 0) ? ((state_3 = matchValue.fields[0][2], (s_2 = matchValue.fields[0][1], (r1 = matchValue.fields[0][0], (matchValue_1 = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), Tests_ISO8601DateTime_iso8601_offset([void 0, s_2])), (matchValue_1.tag === 0) ? ((state_5 = matchValue_1.fields[0][2], (s_3 = matchValue_1.fields[0][1], (r2 = matchValue_1.fields[0][0], new FSharpResult$2(0, [[r1, r2], s_3, void 0]))))) : ((e_1 = matchValue_1.fields[0], new FSharpResult$2(1, e_1)))))))) : ((e = matchValue.fields[0], new FSharpResult$2(1, e))))), (matchValue_2.tag === 1) ? ((state_9 = matchValue_2.fields[0][1], new FSharpResult$2(1, [singleton_1([(this$ = s_5, new Position(this$.startLine, this$.startColumn)), singleton_1(new ErrorType(0, "ISO8601 Full Time"))]), void 0]))) : ((x = matchValue_2, x)))));
    if (matchValue_3.tag === 0) {
        const state_14 = matchValue_3.fields[0][2];
        const s_9 = matchValue_3.fields[0][1];
        const r = matchValue_3.fields[0][0];
        return new FSharpResult$2(0, [(tupledArg_5 = r, (_arg1 = tupledArg_5[0], (o = tupledArg_5[1], (s_6 = (_arg1[2] | 0), (m = (_arg1[1] | 0), (h = (_arg1[0] | 0), (f = (_arg1[3] | 0), [h, m, s_6, f, o]))))))), s_9, void 0]);
    }
    else {
        const e_2 = matchValue_3.fields[0];
        return new FSharpResult$2(1, e_2);
    }
};

const Tests_ISO8601DateTime_iso8601_date_time = (() => {
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
    clo1_2 = ((tupledArg) => {
        let this$_1, this$_2, start_1, finish_1, len, line, column, this$_3;
        const label_1 = label;
        const s_1 = tupledArg[1];
        let matchValue;
        const this$ = s_1;
        const index = 0;
        matchValue = (((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]);
        if (matchValue === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_1 = s_1, new Position(this$_1.startLine, this$_1.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c = matchValue;
            return set$.has(c) ? (new FSharpResult$2(0, [c, (this$_2 = s_1, (start_1 = (defaultArg(1, 0) | 0), (finish_1 = (defaultArg(void 0, this$_2.length - 1) | 0), (((start_1 >= 0) && (start_1 <= this$_2.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_2.length))) ? ((len = (max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0), (line = this$_2.startLine, (column = this$_2.startColumn, ((() => {
                for (let i_1 = 0; i_1 <= (start_1 - 1); i_1++) {
                    if (this$_2.underlying[this$_2.startIndex + i_1] === "\n") {
                        line = ((line + 1) | 0);
                        column = 0;
                    }
                    else {
                        column = ((column + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_2.startIndex + start_1, len, this$_2.underlying, line, column)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_3 = s_1, new Position(this$_3.startLine, this$_3.startColumn)), ofArray([new ErrorType(0, label_1), new ErrorType(1, c)])]), void 0]));
        }
    });
    p = ((tupledArg_1) => clo1_2([void 0, tupledArg_1[1]]));
    p2 = ((tupledArg_2) => {
        const matchValue_2 = Result_MapError((tupledArg_3) => ParseError_sort(tupledArg_3[0], void 0), p([void 0, tupledArg_2[1]]));
        if (matchValue_2.tag === 0) {
            const state_7 = matchValue_2.fields[0][2];
            const s_4 = matchValue_2.fields[0][1];
            return new FSharpResult$2(0, [void 0, s_4, void 0]);
        }
        else {
            const e = matchValue_2.fields[0];
            return new FSharpResult$2(1, e);
        }
    });
    p1_1 = ((tupledArg_4) => {
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
            }
            else {
                const e_2 = matchValue_4.fields[0];
                return new FSharpResult$2(1, e_2);
            }
        }
        else {
            const e_1 = matchValue_3.fields[0];
            return new FSharpResult$2(1, e_1);
        }
    });
    p_7 = ((tupledArg_7) => {
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
            }
            else {
                const e_4 = matchValue_6.fields[0];
                return new FSharpResult$2(1, e_4);
            }
        }
        else {
            const e_3 = matchValue_5.fields[0];
            return new FSharpResult$2(1, e_3);
        }
    });
    p_10 = ((tupledArg_10) => {
        let this$_4;
        const s_14 = tupledArg_10[1];
        const matchValue_7 = Result_MapError((tupledArg_11) => ParseError_sort(tupledArg_11[0], void 0), p_7([void 0, s_14]));
        if (matchValue_7.tag === 1) {
            const state_23 = matchValue_7.fields[0][1];
            return new FSharpResult$2(1, [singleton_1([(this$_4 = s_14, new Position(this$_4.startLine, this$_4.startColumn)), singleton_1(new ErrorType(0, "ISO8601 Date Time"))]), void 0]);
        }
        else {
            const x_3 = matchValue_7;
            return x_3;
        }
    });
    return (tupledArg_13) => {
        let tupledArg_12, _arg1, _arg2, Y, M, D, s_15, o, m, h, f;
        const matchValue_8 = Result_MapError((tupledArg_14) => ParseError_sort(tupledArg_14[0], void 0), p_10([void 0, tupledArg_13[1]]));
        if (matchValue_8.tag === 0) {
            const state_28 = matchValue_8.fields[0][2];
            const s_18 = matchValue_8.fields[0][1];
            const r = matchValue_8.fields[0][0];
            return new FSharpResult$2(0, [(tupledArg_12 = r, (_arg1 = tupledArg_12[0], (_arg2 = tupledArg_12[1], (Y = (_arg1[0] | 0), (M = (_arg1[1] | 0), (D = (_arg1[2] | 0), (s_15 = (_arg2[2] | 0), (o = _arg2[4], (m = (_arg2[1] | 0), (h = (_arg2[0] | 0), (f = (_arg2[3] | 0), [Y, M, D, h, m, s_15, f, o]))))))))))), s_18, void 0]);
        }
        else {
            const e_5 = matchValue_8.fields[0];
            return new FSharpResult$2(1, e_5);
        }
    };
})();

export const Tests_ISO8601DateTime_ppartialtime = (tupledArg_1) => {
    let tupledArg, h, m, s, f;
    const matchValue = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), Tests_ISO8601DateTime_iso8601_partial_time([void 0, tupledArg_1[1]]));
    if (matchValue.tag === 0) {
        const state_3 = matchValue.fields[0][2];
        const s_3 = matchValue.fields[0][1];
        const r = matchValue.fields[0][0];
        return new FSharpResult$2(0, [(tupledArg = r, (h = (tupledArg[0] | 0), (m = (tupledArg[1] | 0), (s = (tupledArg[2] | 0), (f = (tupledArg[3] | 0), create(0, 0, 0, h, m, s, f, 2)))))), s_3, void 0]);
    }
    else {
        const e = matchValue.fields[0];
        return new FSharpResult$2(1, e);
    }
};

export const Tests_ISO8601DateTime_pfulltime = (tupledArg) => {
    let _arg1, sign, s_1, om, oh, m_1, h_1, f_1, x, x_1, s, m, h, f;
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), Tests_ISO8601DateTime_iso8601_full_time([void 0, tupledArg[1]]));
    if (matchValue.tag === 0) {
        const state_3 = matchValue.fields[0][2];
        const s_4 = matchValue.fields[0][1];
        const r = matchValue.fields[0][0];
        return new FSharpResult$2(0, [(_arg1 = r, (_arg1[4].tag === 1) ? ((sign = _arg1[4].fields[0][0], (s_1 = (_arg1[2] | 0), (om = (_arg1[4].fields[0][2] | 0), (oh = (_arg1[4].fields[0][1] | 0), (m_1 = (_arg1[1] | 0), (h_1 = (_arg1[0] | 0), (f_1 = (_arg1[3] | 0), create_1(0, 0, 0, h_1, m_1, s_1, f_1, create_2((x = (oh | 0), sign ? x : op_UnaryNegation_Int32(x)), (x_1 = (om | 0), sign ? x_1 : op_UnaryNegation_Int32(x_1)), 0)))))))))) : ((s = (_arg1[2] | 0), (m = (_arg1[1] | 0), (h = (_arg1[0] | 0), (f = (_arg1[3] | 0), create_1(0, 0, 0, h, m, s, f, 0))))))), s_4, void 0]);
    }
    else {
        const e = matchValue.fields[0];
        return new FSharpResult$2(1, e);
    }
};

export const Tests_ISO8601DateTime_pfulldate = (tupledArg_1) => {
    let tupledArg, y, m, d;
    const matchValue = Result_MapError((tupledArg_2) => ParseError_sort(tupledArg_2[0], void 0), Tests_ISO8601DateTime_iso8601_full_date([void 0, tupledArg_1[1]]));
    if (matchValue.tag === 0) {
        const state_3 = matchValue.fields[0][2];
        const s_2 = matchValue.fields[0][1];
        const r = matchValue.fields[0][0];
        return new FSharpResult$2(0, [(tupledArg = r, (y = (tupledArg[0] | 0), (m = (tupledArg[1] | 0), (d = (tupledArg[2] | 0), create(y, m, d, 0, 0, 0, 0, 2))))), s_2, void 0]);
    }
    else {
        const e = matchValue.fields[0];
        return new FSharpResult$2(1, e);
    }
};

export const Tests_ISO8601DateTime_pdatetime = (tupledArg) => {
    let _arg1, sign, s_1, om, oh, m_1, h_1, f_1, Y_1, M_1, D_1, x, x_1, s, m, h, f, Y, M, D;
    const matchValue = Result_MapError((tupledArg_1) => ParseError_sort(tupledArg_1[0], void 0), Tests_ISO8601DateTime_iso8601_date_time([void 0, tupledArg[1]]));
    if (matchValue.tag === 0) {
        const state_3 = matchValue.fields[0][2];
        const s_4 = matchValue.fields[0][1];
        const r = matchValue.fields[0][0];
        return new FSharpResult$2(0, [(_arg1 = r, (_arg1[7].tag === 1) ? ((sign = _arg1[7].fields[0][0], (s_1 = (_arg1[5] | 0), (om = (_arg1[7].fields[0][2] | 0), (oh = (_arg1[7].fields[0][1] | 0), (m_1 = (_arg1[4] | 0), (h_1 = (_arg1[3] | 0), (f_1 = (_arg1[6] | 0), (Y_1 = (_arg1[0] | 0), (M_1 = (_arg1[1] | 0), (D_1 = (_arg1[2] | 0), create_1(Y_1, M_1, D_1, h_1, m_1, s_1, f_1, create_2((x = (oh | 0), sign ? x : op_UnaryNegation_Int32(x)), (x_1 = (om | 0), sign ? x_1 : op_UnaryNegation_Int32(x_1)), 0))))))))))))) : ((s = (_arg1[5] | 0), (m = (_arg1[4] | 0), (h = (_arg1[3] | 0), (f = (_arg1[6] | 0), (Y = (_arg1[0] | 0), (M = (_arg1[1] | 0), (D = (_arg1[2] | 0), create_1(Y, M, D, h, m, s, f, 0)))))))))), s_4, void 0]);
    }
    else {
        const e = matchValue.fields[0];
        return new FSharpResult$2(1, e);
    }
};

export function Tests_f(x) {
    let str_2;
    return Result_MapError((tupledArg) => ParseError_sort(tupledArg[0], void 0), Tests_ISO8601DateTime_pdatetime([void 0, (str_2 = replace(replace(x, "\r\n", "\n"), "\r", "\n"), new StringSegment(0, str_2.length, str_2, 0, 0))]));
}

export function Tests_test() {
    let tupledArg_6, str_3, resultFromState, resultForEmptySequence, p_1, go, fp, sep_1, go_1, state_13, s_8, matchValue_8, state_16, s_9, r_1, r_2, state_15, es_1, f, str_9, tupledArg_75, str_18, p_53, escapedChars, controls, ps, unicode16bit, p_28, p2_4, cond_4, max_1, exn, go_5, unicode32bit, p_33, p2_6, cond_6, max_3, exn_1, go_6, customEscapedChars, ps_3, escape, nonEscape, p_44, clo1_27, chars_1, set$_1, label_9, arg10_25, character, p_49, matchValue_59, matchValue_57, c_6, s_40, matchValue_26, this$_18, index_4, this$_19, head, this$_20, start_15, finish_15, len_7, line_7, column_7, this$_21, state_155, s_105, matchValue_58, state_157, s_106, r2_4, e_19, e_18, state_161, s_109, r1_1, matchValue_60, c_8, s_48, matchValue_28, this$_22, index_5, this$_23, head_1, this$_24, start_17, finish_17, len_8, line_8, column_8, this$_25, state_163, s_110, e_21, e_20;
    const matchValue = Tests_f("2019-12-10T14:57:13+09:00");
    if (matchValue.tag === 1) {
        const e = matchValue.fields[0];
        toConsole(printf("error: %A"))([e[0], void 0]);
    }
    else {
        const date = matchValue.fields[0][0];
        toConsole(printf("success: %A"))(date);
    }
    const matchValue_9 = Result_MapError((tupledArg_8) => ParseError_sort(tupledArg_8[0], void 0), (tupledArg_6 = [void 0, (str_3 = replace(replace("line1\nline2\nline3", "\r\n", "\n"), "\r", "\n"), new StringSegment(0, str_3.length, str_3, 0, 0))], (resultFromState = ((list) => reverse(list)), (resultForEmptySequence = (empty_1), (p_1 = ((go = ((i_mut, state_mut, s_mut) => {
        let this$_3, start_3, finish_3, len_1, line_1, column_1;
        go:
        while (true) {
            const i = i_mut, state = state_mut, s = s_mut;
            let matchValue_1;
            const this$ = s;
            const index = i | 0;
            matchValue_1 = (((index < 0) ? true : (index >= this$.length)) ? "￿" : this$.underlying[this$.startIndex + index]);
            switch (matchValue_1) {
                case "\n":
                case "￿": {
                    let str;
                    let this$_2;
                    const this$_1 = s;
                    const finish = i - 1;
                    const start_1 = defaultArg(0, 0) | 0;
                    const finish_1 = defaultArg(finish, this$_1.length - 1) | 0;
                    if (((start_1 >= 0) && (start_1 <= this$_1.length)) && (finish_1 < max_4((x, y) => comparePrimitives(x, y), start_1, this$_1.length))) {
                        const len = max_4((x_1, y_1) => comparePrimitives(x_1, y_1), 0, (finish_1 - start_1) + 1) | 0;
                        let line = this$_1.startLine;
                        let column = this$_1.startColumn;
                        for (let i_2 = 0; i_2 <= (start_1 - 1); i_2++) {
                            if (this$_1.underlying[this$_1.startIndex + i_2] === "\n") {
                                line = ((line + 1) | 0);
                                column = 0;
                            }
                            else {
                                column = ((column + 1) | 0);
                            }
                        }
                        this$_2 = (new StringSegment(this$_1.startIndex + start_1, len, this$_1.underlying, line, column));
                    }
                    else {
                        this$_2 = toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_1)(finish_1);
                    }
                    str = substring(this$_2.underlying, this$_2.startIndex, this$_2.length);
                    return new FSharpResult$2(0, [str, (this$_3 = s, (start_3 = (defaultArg(i, 0) | 0), (finish_3 = (defaultArg(void 0, this$_3.length - 1) | 0), (((start_3 >= 0) && (start_3 <= this$_3.length)) && (finish_3 < max_4((x_2, y_2) => comparePrimitives(x_2, y_2), start_3, this$_3.length))) ? ((len_1 = (max_4((x_3, y_3) => comparePrimitives(x_3, y_3), 0, (finish_3 - start_3) + 1) | 0), (line_1 = this$_3.startLine, (column_1 = this$_3.startColumn, ((() => {
                        for (let i_3 = 0; i_3 <= (start_3 - 1); i_3++) {
                            if (this$_3.underlying[this$_3.startIndex + i_3] === "\n") {
                                line_1 = ((line_1 + 1) | 0);
                                column_1 = 0;
                            }
                            else {
                                column_1 = ((column_1 + 1) | 0);
                            }
                        }
                    })(), new StringSegment(this$_3.startIndex + start_3, len_1, this$_3.underlying, line_1, column_1)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_3)(finish_3)))), state]);
                }
                default: {
                    i_mut = (i + 1);
                    state_mut = state;
                    s_mut = s;
                    continue go;
                }
            }
            break;
        }
    }), (tupledArg_1) => {
        const state_1 = tupledArg_1[0];
        const s_1 = tupledArg_1[1];
        return go(0, void 0, s_1);
    })), (fp = defaultArg(void 0, p_1), (sep_1 = ((tupledArg_2) => {
        let this$_4, index_1, this$_5, start_5, finish_5, len_2, line_2, column_2, this$_6;
        const s_4 = tupledArg_2[1];
        if (((this$_4 = s_4, (index_1 = 0, ((index_1 < 0) ? true : (index_1 >= this$_4.length)) ? "￿" : this$_4.underlying[this$_4.startIndex + index_1]))) === "\n") {
            return new FSharpResult$2(0, ["\n", (this$_5 = s_4, (start_5 = (defaultArg(1, 0) | 0), (finish_5 = (defaultArg(void 0, this$_5.length - 1) | 0), (((start_5 >= 0) && (start_5 <= this$_5.length)) && (finish_5 < max_4((x_4, y_4) => comparePrimitives(x_4, y_4), start_5, this$_5.length))) ? ((len_2 = (max_4((x_5, y_5) => comparePrimitives(x_5, y_5), 0, (finish_5 - start_5) + 1) | 0), (line_2 = this$_5.startLine, (column_2 = this$_5.startColumn, ((() => {
                for (let i_5 = 0; i_5 <= (start_5 - 1); i_5++) {
                    if (this$_5.underlying[this$_5.startIndex + i_5] === "\n") {
                        line_2 = ((line_2 + 1) | 0);
                        column_2 = 0;
                    }
                    else {
                        column_2 = ((column_2 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_5.startIndex + start_5, len_2, this$_5.underlying, line_2, column_2)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_5)(finish_5)))), void 0]);
        }
        else {
            return new FSharpResult$2(1, [singleton_1([(this$_6 = s_4, new Position(this$_6.startLine, this$_6.startColumn)), singleton_1(new ErrorType(0, "newline"))]), void 0]);
        }
    }), (go_1 = ((acc_mut, tupledArg_3_mut) => {
        go_1:
        while (true) {
            const acc = acc_mut, tupledArg_3 = tupledArg_3_mut;
            const state_6 = tupledArg_3[0];
            const s_5 = tupledArg_3[1];
            const matchValue_6 = Result_MapError((tupledArg_4) => ParseError_sort(tupledArg_4[0], void 0), sep_1([void 0, s_5]));
            if (matchValue_6.tag === 0) {
                const state_9 = matchValue_6.fields[0][2];
                const s_6 = matchValue_6.fields[0][1];
                const rSep = matchValue_6.fields[0][0];
                const matchValue_7 = Result_MapError((tupledArg_5) => ParseError_sort(tupledArg_5[0], void 0), p_1([void 0, s_6]));
                if (matchValue_7.tag === 0) {
                    const state_12 = matchValue_7.fields[0][2];
                    const s_7 = matchValue_7.fields[0][1];
                    const r = matchValue_7.fields[0][0];
                    acc_mut = cons(r, acc);
                    tupledArg_3_mut = [void 0, s_7];
                    continue go_1;
                }
                else {
                    const state_11 = matchValue_7.fields[0][1];
                    const es = matchValue_7.fields[0][0];
                    if (defaultArg(void 0, false)) {
                        return new FSharpResult$2(0, [resultFromState(acc), s_6, void 0]);
                    }
                    else {
                        return new FSharpResult$2(1, [es, void 0]);
                    }
                }
            }
            else {
                const state_8 = matchValue_6.fields[0][1];
                return new FSharpResult$2(0, [resultFromState(acc), s_5, void 0]);
            }
            break;
        }
    }), (state_13 = tupledArg_6[0], (s_8 = tupledArg_6[1], (matchValue_8 = Result_MapError((tupledArg_7) => ParseError_sort(tupledArg_7[0], void 0), fp([void 0, s_8])), (matchValue_8.tag === 0) ? ((state_16 = matchValue_8.fields[0][2], (s_9 = matchValue_8.fields[0][1], (r_1 = matchValue_8.fields[0][0], (r_2 = singleton_1(r_1), go_1(r_2, [void 0, s_9])))))) : ((state_15 = matchValue_8.fields[0][1], (es_1 = matchValue_8.fields[0][0], (resultForEmptySequence == null) ? (new FSharpResult$2(1, [es_1, void 0])) : (new FSharpResult$2(0, [(resultForEmptySequence == null) ? null : ((f = resultForEmptySequence, f())), s_8, void 0]))))))))))))))));
    let pattern_matching_result, xs_1, e_1;
    if (matchValue_9.tag === 1) {
        pattern_matching_result = 2;
        e_1 = matchValue_9.fields[0];
    }
    else if (!isEmpty(matchValue_9.fields[0][0])) {
        if (head_3(matchValue_9.fields[0][0]) === "line1") {
            if (!isEmpty(tail(matchValue_9.fields[0][0]))) {
                if (head_3(tail(matchValue_9.fields[0][0])) === "line2") {
                    if (!isEmpty(tail(tail(matchValue_9.fields[0][0])))) {
                        if (head_3(tail(tail(matchValue_9.fields[0][0]))) === "line3") {
                            if (isEmpty(tail(tail(tail(matchValue_9.fields[0][0]))))) {
                                pattern_matching_result = 0;
                            }
                            else {
                                pattern_matching_result = 1;
                                xs_1 = matchValue_9.fields[0][0];
                            }
                        }
                        else {
                            pattern_matching_result = 1;
                            xs_1 = matchValue_9.fields[0][0];
                        }
                    }
                    else {
                        pattern_matching_result = 1;
                        xs_1 = matchValue_9.fields[0][0];
                    }
                }
                else {
                    pattern_matching_result = 1;
                    xs_1 = matchValue_9.fields[0][0];
                }
            }
            else {
                pattern_matching_result = 1;
                xs_1 = matchValue_9.fields[0][0];
            }
        }
        else {
            pattern_matching_result = 1;
            xs_1 = matchValue_9.fields[0][0];
        }
    }
    else {
        pattern_matching_result = 1;
        xs_1 = matchValue_9.fields[0][0];
    }
    switch (pattern_matching_result) {
        case 0: {
            toConsole(printf("success"));
            break;
        }
        case 1: {
            toConsole(printf("wrong: %A"))(xs_1);
            break;
        }
        case 2: {
            toConsole(printf("error: %A"))([e_1[0], void 0]);
            break;
        }
    }
    let stringLiteral;
    const str_6 = (s_10) => {
        const str_4 = s_10;
        return (tupledArg_10) => {
            let this$_7, start_7, finish_7, len_3, line_3, column_3, this$_8;
            const str_5 = str_4;
            const state_19 = tupledArg_10[0];
            const s_12 = tupledArg_10[1];
            return StringSegmentModule_startsWith(str_5, s_12) ? (new FSharpResult$2(0, [str_4, (this$_7 = s_12, (start_7 = (defaultArg(str_5.length, 0) | 0), (finish_7 = (defaultArg(void 0, this$_7.length - 1) | 0), (((start_7 >= 0) && (start_7 <= this$_7.length)) && (finish_7 < max_4((x_8, y_6) => comparePrimitives(x_8, y_6), start_7, this$_7.length))) ? ((len_3 = (max_4((x_9, y_7) => comparePrimitives(x_9, y_7), 0, (finish_7 - start_7) + 1) | 0), (line_3 = this$_7.startLine, (column_3 = this$_7.startColumn, ((() => {
                for (let i_6 = 0; i_6 <= (start_7 - 1); i_6++) {
                    if (this$_7.underlying[this$_7.startIndex + i_6] === "\n") {
                        line_3 = ((line_3 + 1) | 0);
                        column_3 = 0;
                    }
                    else {
                        column_3 = ((column_3 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_7.startIndex + start_7, len_3, this$_7.underlying, line_3, column_3)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_7)(finish_7)))), state_19])) : (new FSharpResult$2(1, [singleton_1([(this$_8 = s_12, new Position(this$_8.startLine, this$_8.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_5) + "\u0027"))]), state_19]));
        };
    };
    let normalCharSnippet;
    const cond = (c) => {
        if (c !== "\\") {
            return c !== "\"";
        }
        else {
            return false;
        }
    };
    const go_2 = (i_7_mut, tupledArg_11_mut) => {
        let this$_12, this$_11, finish_8, start_9, finish_9, len_4, line_4, column_4, this$_13, start_11, finish_11, len_5, line_5, column_5;
        go_2:
        while (true) {
            const i_7 = i_7_mut, tupledArg_11 = tupledArg_11_mut;
            const state_21 = tupledArg_11[0];
            const s_14 = tupledArg_11[1];
            let c_1;
            const this$_9 = s_14;
            const index_2 = i_7 | 0;
            c_1 = (((index_2 < 0) ? true : (index_2 >= this$_9.length)) ? "￿" : this$_9.underlying[this$_9.startIndex + index_2]);
            if (i_7 === 0) {
                if (cond(c_1)) {
                    i_7_mut = (i_7 + 1);
                    tupledArg_11_mut = [state_21, s_14];
                    continue go_2;
                }
                else {
                    return new FSharpResult$2(0, ["", s_14, state_21]);
                }
            }
            else if (cond(c_1)) {
                i_7_mut = (i_7 + 1);
                tupledArg_11_mut = [state_21, s_14];
                continue go_2;
            }
            else {
                return new FSharpResult$2(0, [(this$_12 = ((this$_11 = s_14, (finish_8 = (i_7 - 1), (start_9 = (defaultArg(0, 0) | 0), (finish_9 = (defaultArg(finish_8, this$_11.length - 1) | 0), (((start_9 >= 0) && (start_9 <= this$_11.length)) && (finish_9 < max_4((x_10, y_8) => comparePrimitives(x_10, y_8), start_9, this$_11.length))) ? ((len_4 = (max_4((x_11, y_9) => comparePrimitives(x_11, y_9), 0, (finish_9 - start_9) + 1) | 0), (line_4 = this$_11.startLine, (column_4 = this$_11.startColumn, ((() => {
                    for (let i_9 = 0; i_9 <= (start_9 - 1); i_9++) {
                        if (this$_11.underlying[this$_11.startIndex + i_9] === "\n") {
                            line_4 = ((line_4 + 1) | 0);
                            column_4 = 0;
                        }
                        else {
                            column_4 = ((column_4 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_11.startIndex + start_9, len_4, this$_11.underlying, line_4, column_4)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_9)(finish_9)))))), substring(this$_12.underlying, this$_12.startIndex, this$_12.length)), (this$_13 = s_14, (start_11 = (defaultArg(i_7, 0) | 0), (finish_11 = (defaultArg(void 0, this$_13.length - 1) | 0), (((start_11 >= 0) && (start_11 <= this$_13.length)) && (finish_11 < max_4((x_12, y_10) => comparePrimitives(x_12, y_10), start_11, this$_13.length))) ? ((len_5 = (max_4((x_13, y_11) => comparePrimitives(x_13, y_11), 0, (finish_11 - start_11) + 1) | 0), (line_5 = this$_13.startLine, (column_5 = this$_13.startColumn, ((() => {
                    for (let i_10 = 0; i_10 <= (start_11 - 1); i_10++) {
                        if (this$_13.underlying[this$_13.startIndex + i_10] === "\n") {
                            line_5 = ((line_5 + 1) | 0);
                            column_5 = 0;
                        }
                        else {
                            column_5 = ((column_5 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_13.startIndex + start_11, len_5, this$_13.underlying, line_5, column_5)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_11)(finish_11)))), state_21]);
            }
            break;
        }
    };
    normalCharSnippet = partialApply(1, go_2, [0]);
    let escapedChar;
    const p1 = str_6("\\");
    let p2;
    let p_6;
    let clo1_12;
    const chars = "\\\"nrt".split("");
    const set$ = new Set(chars);
    let label_1;
    const arg10_10 = toList(chars);
    label_1 = toText(printf("one of %A"))(arg10_10);
    clo1_12 = ((tupledArg_12) => {
        let this$_15, this$_16, start_13, finish_13, len_6, line_6, column_6, this$_17;
        const label_2 = label_1;
        const s_16 = tupledArg_12[1];
        let matchValue_13;
        const this$_14 = s_16;
        const index_3 = 0;
        matchValue_13 = (((index_3 < 0) ? true : (index_3 >= this$_14.length)) ? "￿" : this$_14.underlying[this$_14.startIndex + index_3]);
        if (matchValue_13 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_15 = s_16, new Position(this$_15.startLine, this$_15.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_2 = matchValue_13;
            return set$.has(c_2) ? (new FSharpResult$2(0, [c_2, (this$_16 = s_16, (start_13 = (defaultArg(1, 0) | 0), (finish_13 = (defaultArg(void 0, this$_16.length - 1) | 0), (((start_13 >= 0) && (start_13 <= this$_16.length)) && (finish_13 < max_4((x_14, y_12) => comparePrimitives(x_14, y_12), start_13, this$_16.length))) ? ((len_6 = (max_4((x_15, y_13) => comparePrimitives(x_15, y_13), 0, (finish_13 - start_13) + 1) | 0), (line_6 = this$_16.startLine, (column_6 = this$_16.startColumn, ((() => {
                for (let i_12 = 0; i_12 <= (start_13 - 1); i_12++) {
                    if (this$_16.underlying[this$_16.startIndex + i_12] === "\n") {
                        line_6 = ((line_6 + 1) | 0);
                        column_6 = 0;
                    }
                    else {
                        column_6 = ((column_6 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_16.startIndex + start_13, len_6, this$_16.underlying, line_6, column_6)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_13)(finish_13)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_17 = s_16, new Position(this$_17.startLine, this$_17.startColumn)), ofArray([new ErrorType(0, label_2), new ErrorType(1, c_2)])]), void 0]));
        }
    });
    p_6 = ((tupledArg_13) => clo1_12([void 0, tupledArg_13[1]]));
    p2 = ((tupledArg_14) => {
        let _arg1_1, c_3;
        const matchValue_15 = Result_MapError((tupledArg_15) => ParseError_sort(tupledArg_15[0], void 0), p_6([void 0, tupledArg_14[1]]));
        if (matchValue_15.tag === 0) {
            const state_30 = matchValue_15.fields[0][2];
            const s_19 = matchValue_15.fields[0][1];
            const r_3 = matchValue_15.fields[0][0];
            return new FSharpResult$2(0, [(_arg1_1 = r_3, (_arg1_1 === "n") ? "\n" : ((_arg1_1 === "r") ? "\r" : ((_arg1_1 === "t") ? "\t" : ((c_3 = _arg1_1, c_3))))), s_19, void 0]);
        }
        else {
            const e_2 = matchValue_15.fields[0];
            return new FSharpResult$2(1, e_2);
        }
    });
    escapedChar = ((tupledArg_16) => {
        const matchValue_16 = Result_MapError((tupledArg_17) => ParseError_sort(tupledArg_17[0], void 0), p1([void 0, tupledArg_16[1]]));
        if (matchValue_16.tag === 0) {
            const state_34 = matchValue_16.fields[0][2];
            const s_22 = matchValue_16.fields[0][1];
            const matchValue_17 = Result_MapError((tupledArg_18) => ParseError_sort(tupledArg_18[0], void 0), p2([void 0, s_22]));
            if (matchValue_17.tag === 0) {
                const state_36 = matchValue_17.fields[0][2];
                const s_23 = matchValue_17.fields[0][1];
                const r2 = matchValue_17.fields[0][0];
                return new FSharpResult$2(0, [r2, s_23, void 0]);
            }
            else {
                const e_4 = matchValue_17.fields[0];
                return new FSharpResult$2(1, e_4);
            }
        }
        else {
            const e_3 = matchValue_16.fields[0];
            return new FSharpResult$2(1, e_3);
        }
    });
    const pl = str_6("\"");
    const pr = str_6("\"");
    stringLiteral = ((tupledArg_27) => {
        let matchValue_21, state_51, s_32, matchValue_22, p_12, s_25, matchValue_18, state_41, s_26, c1, sb, go_3, state_40, es_2, state_53, s_33, r2_1, e_7, e_6;
        const matchValue_23 = Result_MapError((tupledArg_28) => ParseError_sort(tupledArg_28[0], void 0), (matchValue_21 = Result_MapError((tupledArg_25) => ParseError_sort(tupledArg_25[0], void 0), pl([void 0, tupledArg_27[1]])), (matchValue_21.tag === 0) ? ((state_51 = matchValue_21.fields[0][2], (s_32 = matchValue_21.fields[0][1], (matchValue_22 = Result_MapError((tupledArg_26) => ParseError_sort(tupledArg_26[0], void 0), (p_12 = normalCharSnippet, (s_25 = s_32, (matchValue_18 = Result_MapError((tupledArg_20) => ParseError_sort(tupledArg_20[0], void 0), p_12([void 0, s_25])), (matchValue_18.tag === 0) ? ((state_41 = matchValue_18.fields[0][2], (s_26 = matchValue_18.fields[0][1], (c1 = matchValue_18.fields[0][0], (sb = CharParsers_StringBuilder_$ctor_Z721C83C5(c1), (go_3 = ((tupledArg_21_mut) => {
            go_3:
            while (true) {
                const tupledArg_21 = tupledArg_21_mut;
                const state_42 = tupledArg_21[0];
                const s_27 = tupledArg_21[1];
                const matchValue_19 = Result_MapError((tupledArg_22) => ParseError_sort(tupledArg_22[0], void 0), escapedChar([void 0, s_27]));
                if (matchValue_19.tag === 0) {
                    const state_45 = matchValue_19.fields[0][2];
                    const s_28 = matchValue_19.fields[0][1];
                    const csep = matchValue_19.fields[0][0];
                    const matchValue_20 = Result_MapError((tupledArg_23) => ParseError_sort(tupledArg_23[0], void 0), p_12([void 0, s_28]));
                    if (matchValue_20.tag === 1) {
                        const e_5 = matchValue_20.fields[0];
                        return new FSharpResult$2(1, e_5);
                    }
                    else {
                        const state_47 = matchValue_20.fields[0][2];
                        const s_29 = matchValue_20.fields[0][1];
                        const c_4 = matchValue_20.fields[0][0];
                        CharParsers_StringBuilder__Append_Z721C83C5(sb, csep);
                        CharParsers_StringBuilder__Append_Z721C83C5(sb, c_4);
                        tupledArg_21_mut = [void 0, s_29];
                        continue go_3;
                    }
                }
                else {
                    const state_44 = matchValue_19.fields[0][1];
                    return new FSharpResult$2(0, [toString(sb), s_27, void 0]);
                }
                break;
            }
        }), go_3([void 0, s_26]))))))) : ((state_40 = matchValue_18.fields[0][1], (es_2 = matchValue_18.fields[0][0], new FSharpResult$2(0, ["", s_25, void 0])))))))), (matchValue_22.tag === 0) ? ((state_53 = matchValue_22.fields[0][2], (s_33 = matchValue_22.fields[0][1], (r2_1 = matchValue_22.fields[0][0], new FSharpResult$2(0, [r2_1, s_33, void 0]))))) : ((e_7 = matchValue_22.fields[0], new FSharpResult$2(1, e_7))))))) : ((e_6 = matchValue_21.fields[0], new FSharpResult$2(1, e_6)))));
        if (matchValue_23.tag === 0) {
            const state_57 = matchValue_23.fields[0][2];
            const s_36 = matchValue_23.fields[0][1];
            const r1 = matchValue_23.fields[0][0];
            const matchValue_24 = Result_MapError((tupledArg_29) => ParseError_sort(tupledArg_29[0], void 0), pr([void 0, s_36]));
            if (matchValue_24.tag === 0) {
                const state_59 = matchValue_24.fields[0][2];
                const s_37 = matchValue_24.fields[0][1];
                return new FSharpResult$2(0, [r1, s_37, void 0]);
            }
            else {
                const e_9 = matchValue_24.fields[0];
                return new FSharpResult$2(1, e_9);
            }
        }
        else {
            const e_8 = matchValue_23.fields[0];
            return new FSharpResult$2(1, e_8);
        }
    });
    const matchValue_25 = Result_MapError((tupledArg_30) => ParseError_sort(tupledArg_30[0], void 0), stringLiteral([void 0, (str_9 = replace(replace("\"\\\"hello\\\", world!\" ", "\r\n", "\n"), "\r", "\n"), new StringSegment(0, str_9.length, str_9, 0, 0))]));
    if (matchValue_25.tag === 1) {
        const e_10 = matchValue_25.fields[0];
        toConsole(printf("error: %A"))([e_10[0], void 0]);
    }
    else if (matchValue_25.fields[0][0] === "\"hello\", world!") {
        toConsole(printf("success"));
    }
    else {
        const s_38 = matchValue_25.fields[0][0];
        toConsole(printf("wrong: %A"))(s_38);
    }
    const src = "\"H\\u0065llo, world\\U0001F47D\"";
    const matchValue_61 = Result_MapError((tupledArg_78) => ParseError_sort(tupledArg_78[0], void 0), (tupledArg_75 = [void 0, (str_18 = replace(replace(src, "\r\n", "\n"), "\r", "\n"), new StringSegment(0, str_18.length, str_18, 0, 0))], (p_53 = ((escapedChars = "\"", (controls = ((ps = map_1((tupledArg_34) => {
        const k = tupledArg_34[0];
        const v_4 = tupledArg_34[1];
        return (tupledArg_35) => {
            let this$_26, start_19, finish_19, len_9, line_9, column_9, this$_27;
            const str_10 = k;
            const s_56 = tupledArg_35[1];
            return StringSegmentModule_startsWith(str_10, s_56) ? (new FSharpResult$2(0, [v_4, (this$_26 = s_56, (start_19 = (defaultArg(str_10.length, 0) | 0), (finish_19 = (defaultArg(void 0, this$_26.length - 1) | 0), (((start_19 >= 0) && (start_19 <= this$_26.length)) && (finish_19 < max_4((x_20, y_18) => comparePrimitives(x_20, y_18), start_19, this$_26.length))) ? ((len_9 = (max_4((x_21, y_19) => comparePrimitives(x_21, y_19), 0, (finish_19 - start_19) + 1) | 0), (line_9 = this$_26.startLine, (column_9 = this$_26.startColumn, ((() => {
                for (let i_17 = 0; i_17 <= (start_19 - 1); i_17++) {
                    if (this$_26.underlying[this$_26.startIndex + i_17] === "\n") {
                        line_9 = ((line_9 + 1) | 0);
                        column_9 = 0;
                    }
                    else {
                        column_9 = ((column_9 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_26.startIndex + start_19, len_9, this$_26.underlying, line_9, column_9)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_19)(finish_19)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_27 = s_56, new Position(this$_27.startLine, this$_27.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_10) + "\u0027"))]), void 0]));
        };
    }, ofArray([["\\b", "\b"], ["\\t", "\t"], ["\\n", "\n"], ["\\v", "\u000b"], ["\\f", "\f"], ["\\r", "\r"], ["\\\\", "\\"]])), (tupledArg_36) => {
        const s_59 = tupledArg_36[1];
        const go_4 = (state_74_mut, _arg1_2_mut) => {
            let this$_29, this$_28;
            go_4:
            while (true) {
                const state_74 = state_74_mut, _arg1_2 = _arg1_2_mut;
                if (!isEmpty(_arg1_2)) {
                    if (isEmpty(tail(_arg1_2))) {
                        const p_22 = head_3(_arg1_2);
                        const matchValue_31 = Result_MapError((tupledArg_37) => ParseError_sort(tupledArg_37[0], tupledArg_37[1]), p_22([state_74, s_59]));
                        if (matchValue_31.tag === 1) {
                            const state_77 = matchValue_31.fields[0][1];
                            return new FSharpResult$2(1, [singleton_1([(this$_29 = s_59, new Position(this$_29.startLine, this$_29.startColumn)), singleton_1(new ErrorType(0, "control characters"))]), state_77]);
                        }
                        else {
                            const x_22 = matchValue_31;
                            return x_22;
                        }
                    }
                    else {
                        const p_24 = head_3(_arg1_2);
                        const ps_2 = tail(_arg1_2);
                        const matchValue_32 = Result_MapError((tupledArg_38) => ParseError_sort(tupledArg_38[0], tupledArg_38[1]), p_24([state_74, s_59]));
                        if (matchValue_32.tag === 1) {
                            const state_79 = matchValue_32.fields[0][1];
                            state_74_mut = state_79;
                            _arg1_2_mut = ps_2;
                            continue go_4;
                        }
                        else {
                            const x_23 = matchValue_32;
                            return x_23;
                        }
                    }
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_28 = s_59, new Position(this$_28.startLine, this$_28.startColumn)), singleton_1(new ErrorType(2, "No parsers given"))]), state_74]);
                }
                break;
            }
        };
        return go_4(void 0, ps);
    })), (unicode16bit = ((p_28 = ((p2_4 = ((cond_4 = ((c_9) => {
        const c_10 = c_9;
        if (isDigit(c_10) ? true : (("A" <= c_10) && (c_10 <= "F"))) {
            return true;
        }
        else if ("a" <= c_10) {
            return c_10 <= "f";
        }
        else {
            return false;
        }
    }), (max_1 = 4, ((max_1 < 0) ? ((exn = (new Error("max", "max is negative")), (() => {
        throw exn;
    })())) : (void 0), (go_5 = ((i_19_mut, tupledArg_40_mut) => {
        let this$_34, this$_33, finish_22, start_23, finish_23, len_11, line_11, column_11, this$_35, start_25, finish_25, len_12, line_12, column_12, this$_36;
        go_5:
        while (true) {
            const i_19 = i_19_mut, tupledArg_40 = tupledArg_40_mut;
            const state_83 = tupledArg_40[0];
            const s_63 = tupledArg_40[1];
            let c_11;
            const this$_32 = s_63;
            const index_6 = i_19 | 0;
            c_11 = (((index_6 < 0) ? true : (index_6 >= this$_32.length)) ? "￿" : this$_32.underlying[this$_32.startIndex + index_6]);
            if ((i_19 < max_1) && ((i_19 === 0) ? cond_4(c_11) : cond_4(c_11))) {
                i_19_mut = (i_19 + 1);
                tupledArg_40_mut = [state_83, s_63];
                continue go_5;
            }
            else if (4 <= i_19) {
                return new FSharpResult$2(0, [(this$_34 = ((this$_33 = s_63, (finish_22 = (i_19 - 1), (start_23 = (defaultArg(0, 0) | 0), (finish_23 = (defaultArg(finish_22, this$_33.length - 1) | 0), (((start_23 >= 0) && (start_23 <= this$_33.length)) && (finish_23 < max_4((x_26, y_22) => comparePrimitives(x_26, y_22), start_23, this$_33.length))) ? ((len_11 = (max_4((x_27, y_23) => comparePrimitives(x_27, y_23), 0, (finish_23 - start_23) + 1) | 0), (line_11 = this$_33.startLine, (column_11 = this$_33.startColumn, ((() => {
                    for (let i_21 = 0; i_21 <= (start_23 - 1); i_21++) {
                        if (this$_33.underlying[this$_33.startIndex + i_21] === "\n") {
                            line_11 = ((line_11 + 1) | 0);
                            column_11 = 0;
                        }
                        else {
                            column_11 = ((column_11 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_33.startIndex + start_23, len_11, this$_33.underlying, line_11, column_11)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_23)(finish_23)))))), substring(this$_34.underlying, this$_34.startIndex, this$_34.length)), (this$_35 = s_63, (start_25 = (defaultArg(i_19, 0) | 0), (finish_25 = (defaultArg(void 0, this$_35.length - 1) | 0), (((start_25 >= 0) && (start_25 <= this$_35.length)) && (finish_25 < max_4((x_28, y_24) => comparePrimitives(x_28, y_24), start_25, this$_35.length))) ? ((len_12 = (max_4((x_29, y_25) => comparePrimitives(x_29, y_25), 0, (finish_25 - start_25) + 1) | 0), (line_12 = this$_35.startLine, (column_12 = this$_35.startColumn, ((() => {
                    for (let i_22 = 0; i_22 <= (start_25 - 1); i_22++) {
                        if (this$_35.underlying[this$_35.startIndex + i_22] === "\n") {
                            line_12 = ((line_12 + 1) | 0);
                            column_12 = 0;
                        }
                        else {
                            column_12 = ((column_12 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_35.startIndex + start_25, len_12, this$_35.underlying, line_12, column_12)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_25)(finish_25)))), state_83]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_36 = s_63, new Position(this$_36.startLine, this$_36.startColumn)), singleton_1(new ErrorType(0, "hex"))]), state_83]);
            }
            break;
        }
    }), partialApply(1, go_5, [0])))))), (tupledArg_41) => {
        let str_12, s_61, this$_30, start_21, finish_21, len_10, line_10, column_10, this$_31;
        const matchValue_36 = Result_MapError((tupledArg_42) => ParseError_sort(tupledArg_42[0], void 0), (str_12 = "\\u", (s_61 = tupledArg_41[1], StringSegmentModule_startsWith(str_12, s_61) ? (new FSharpResult$2(0, [void 0, (this$_30 = s_61, (start_21 = (defaultArg(str_12.length, 0) | 0), (finish_21 = (defaultArg(void 0, this$_30.length - 1) | 0), (((start_21 >= 0) && (start_21 <= this$_30.length)) && (finish_21 < max_4((x_24, y_20) => comparePrimitives(x_24, y_20), start_21, this$_30.length))) ? ((len_10 = (max_4((x_25, y_21) => comparePrimitives(x_25, y_21), 0, (finish_21 - start_21) + 1) | 0), (line_10 = this$_30.startLine, (column_10 = this$_30.startColumn, ((() => {
            for (let i_18 = 0; i_18 <= (start_21 - 1); i_18++) {
                if (this$_30.underlying[this$_30.startIndex + i_18] === "\n") {
                    line_10 = ((line_10 + 1) | 0);
                    column_10 = 0;
                }
                else {
                    column_10 = ((column_10 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_30.startIndex + start_21, len_10, this$_30.underlying, line_10, column_10)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_21)(finish_21)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_31 = s_61, new Position(this$_31.startLine, this$_31.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_12) + "\u0027"))]), void 0])))));
        if (matchValue_36.tag === 0) {
            const state_88 = matchValue_36.fields[0][2];
            const s_66 = matchValue_36.fields[0][1];
            const matchValue_37 = Result_MapError((tupledArg_43) => ParseError_sort(tupledArg_43[0], void 0), p2_4([void 0, s_66]));
            if (matchValue_37.tag === 0) {
                const state_90 = matchValue_37.fields[0][2];
                const s_67 = matchValue_37.fields[0][1];
                const r2_2 = matchValue_37.fields[0][0];
                return new FSharpResult$2(0, [r2_2, s_67, void 0]);
            }
            else {
                const e_12 = matchValue_37.fields[0];
                return new FSharpResult$2(1, e_12);
            }
        }
        else {
            const e_11 = matchValue_36.fields[0];
            return new FSharpResult$2(1, e_11);
        }
    })), (tupledArg_44) => {
        const matchValue_38 = Result_MapError((tupledArg_45) => ParseError_sort(tupledArg_45[0], void 0), p_28([void 0, tupledArg_44[1]]));
        if (matchValue_38.tag === 0) {
            const state_94 = matchValue_38.fields[0][2];
            const s_71 = matchValue_38.fields[0][1];
            const r_4 = matchValue_38.fields[0][0];
            return new FSharpResult$2(0, [String.fromCharCode(parse_1(r_4, 511, false, 16, 16)), s_71, void 0]);
        }
        else {
            const e_13 = matchValue_38.fields[0];
            return new FSharpResult$2(1, e_13);
        }
    })), (unicode32bit = ((p_33 = ((p2_6 = ((cond_6 = ((c_12) => {
        const c_13 = c_12;
        if (isDigit(c_13) ? true : (("A" <= c_13) && (c_13 <= "F"))) {
            return true;
        }
        else if ("a" <= c_13) {
            return c_13 <= "f";
        }
        else {
            return false;
        }
    }), (max_3 = 8, ((max_3 < 0) ? ((exn_1 = (new Error("max", "max is negative")), (() => {
        throw exn_1;
    })())) : (void 0), (go_6 = ((i_24_mut, tupledArg_47_mut) => {
        let this$_41, this$_40, finish_28, start_29, finish_29, len_14, line_14, column_14, this$_42, start_31, finish_31, len_15, line_15, column_15, this$_43;
        go_6:
        while (true) {
            const i_24 = i_24_mut, tupledArg_47 = tupledArg_47_mut;
            const state_98 = tupledArg_47[0];
            const s_75 = tupledArg_47[1];
            let c_14;
            const this$_39 = s_75;
            const index_7 = i_24 | 0;
            c_14 = (((index_7 < 0) ? true : (index_7 >= this$_39.length)) ? "￿" : this$_39.underlying[this$_39.startIndex + index_7]);
            if ((i_24 < max_3) && ((i_24 === 0) ? cond_6(c_14) : cond_6(c_14))) {
                i_24_mut = (i_24 + 1);
                tupledArg_47_mut = [state_98, s_75];
                continue go_6;
            }
            else if (8 <= i_24) {
                return new FSharpResult$2(0, [(this$_41 = ((this$_40 = s_75, (finish_28 = (i_24 - 1), (start_29 = (defaultArg(0, 0) | 0), (finish_29 = (defaultArg(finish_28, this$_40.length - 1) | 0), (((start_29 >= 0) && (start_29 <= this$_40.length)) && (finish_29 < max_4((x_32, y_28) => comparePrimitives(x_32, y_28), start_29, this$_40.length))) ? ((len_14 = (max_4((x_33, y_29) => comparePrimitives(x_33, y_29), 0, (finish_29 - start_29) + 1) | 0), (line_14 = this$_40.startLine, (column_14 = this$_40.startColumn, ((() => {
                    for (let i_26 = 0; i_26 <= (start_29 - 1); i_26++) {
                        if (this$_40.underlying[this$_40.startIndex + i_26] === "\n") {
                            line_14 = ((line_14 + 1) | 0);
                            column_14 = 0;
                        }
                        else {
                            column_14 = ((column_14 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_40.startIndex + start_29, len_14, this$_40.underlying, line_14, column_14)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_29)(finish_29)))))), substring(this$_41.underlying, this$_41.startIndex, this$_41.length)), (this$_42 = s_75, (start_31 = (defaultArg(i_24, 0) | 0), (finish_31 = (defaultArg(void 0, this$_42.length - 1) | 0), (((start_31 >= 0) && (start_31 <= this$_42.length)) && (finish_31 < max_4((x_34, y_30) => comparePrimitives(x_34, y_30), start_31, this$_42.length))) ? ((len_15 = (max_4((x_35, y_31) => comparePrimitives(x_35, y_31), 0, (finish_31 - start_31) + 1) | 0), (line_15 = this$_42.startLine, (column_15 = this$_42.startColumn, ((() => {
                    for (let i_27 = 0; i_27 <= (start_31 - 1); i_27++) {
                        if (this$_42.underlying[this$_42.startIndex + i_27] === "\n") {
                            line_15 = ((line_15 + 1) | 0);
                            column_15 = 0;
                        }
                        else {
                            column_15 = ((column_15 + 1) | 0);
                        }
                    }
                })(), new StringSegment(this$_42.startIndex + start_31, len_15, this$_42.underlying, line_15, column_15)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_31)(finish_31)))), state_98]);
            }
            else {
                return new FSharpResult$2(1, [singleton_1([(this$_43 = s_75, new Position(this$_43.startLine, this$_43.startColumn)), singleton_1(new ErrorType(0, "hex"))]), state_98]);
            }
            break;
        }
    }), partialApply(1, go_6, [0])))))), (tupledArg_48) => {
        let str_14, s_73, this$_37, start_27, finish_27, len_13, line_13, column_13, this$_38;
        const matchValue_42 = Result_MapError((tupledArg_49) => ParseError_sort(tupledArg_49[0], void 0), (str_14 = "\\U", (s_73 = tupledArg_48[1], StringSegmentModule_startsWith(str_14, s_73) ? (new FSharpResult$2(0, [void 0, (this$_37 = s_73, (start_27 = (defaultArg(str_14.length, 0) | 0), (finish_27 = (defaultArg(void 0, this$_37.length - 1) | 0), (((start_27 >= 0) && (start_27 <= this$_37.length)) && (finish_27 < max_4((x_30, y_26) => comparePrimitives(x_30, y_26), start_27, this$_37.length))) ? ((len_13 = (max_4((x_31, y_27) => comparePrimitives(x_31, y_27), 0, (finish_27 - start_27) + 1) | 0), (line_13 = this$_37.startLine, (column_13 = this$_37.startColumn, ((() => {
            for (let i_23 = 0; i_23 <= (start_27 - 1); i_23++) {
                if (this$_37.underlying[this$_37.startIndex + i_23] === "\n") {
                    line_13 = ((line_13 + 1) | 0);
                    column_13 = 0;
                }
                else {
                    column_13 = ((column_13 + 1) | 0);
                }
            }
        })(), new StringSegment(this$_37.startIndex + start_27, len_13, this$_37.underlying, line_13, column_13)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_27)(finish_27)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_38 = s_73, new Position(this$_38.startLine, this$_38.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_14) + "\u0027"))]), void 0])))));
        if (matchValue_42.tag === 0) {
            const state_103 = matchValue_42.fields[0][2];
            const s_78 = matchValue_42.fields[0][1];
            const matchValue_43 = Result_MapError((tupledArg_50) => ParseError_sort(tupledArg_50[0], void 0), p2_6([void 0, s_78]));
            if (matchValue_43.tag === 0) {
                const state_105 = matchValue_43.fields[0][2];
                const s_79 = matchValue_43.fields[0][1];
                const r2_3 = matchValue_43.fields[0][0];
                return new FSharpResult$2(0, [r2_3, s_79, void 0]);
            }
            else {
                const e_15 = matchValue_43.fields[0];
                return new FSharpResult$2(1, e_15);
            }
        }
        else {
            const e_14 = matchValue_42.fields[0];
            return new FSharpResult$2(1, e_14);
        }
    })), (tupledArg_51) => {
        let utf32_1, hs, ls;
        const matchValue_44 = Result_MapError((tupledArg_52) => ParseError_sort(tupledArg_52[0], void 0), p_33([void 0, tupledArg_51[1]]));
        if (matchValue_44.tag === 0) {
            const state_109 = matchValue_44.fields[0][2];
            const s_83 = matchValue_44.fields[0][1];
            const r_5 = matchValue_44.fields[0][0];
            return new FSharpResult$2(0, [(utf32_1 = (parse_1(r_5, 511, false, 32, 16) | 0), (65536 > utf32_1) ? String.fromCharCode(utf32_1) : ((hs = (((~(~((utf32_1 - 65536) / 1024))) + 55296) | 0), (ls = ((((utf32_1 - 65536) % 1024) + 56320) | 0), String.fromCharCode(hs) + String.fromCharCode(ls))))), s_83, void 0]);
        }
        else {
            const e_16 = matchValue_44.fields[0];
            return new FSharpResult$2(1, e_16);
        }
    })), (customEscapedChars = ((ps_3 = map_1((tupledArg_53) => {
        const k_1 = tupledArg_53[0];
        const v_8 = tupledArg_53[1];
        return (tupledArg_54) => {
            let this$_44, start_33, finish_33, len_16, line_16, column_16, this$_45;
            const str_15 = k_1;
            const s_85 = tupledArg_54[1];
            return StringSegmentModule_startsWith(str_15, s_85) ? (new FSharpResult$2(0, [v_8, (this$_44 = s_85, (start_33 = (defaultArg(str_15.length, 0) | 0), (finish_33 = (defaultArg(void 0, this$_44.length - 1) | 0), (((start_33 >= 0) && (start_33 <= this$_44.length)) && (finish_33 < max_4((x_36, y_32) => comparePrimitives(x_36, y_32), start_33, this$_44.length))) ? ((len_16 = (max_4((x_37, y_33) => comparePrimitives(x_37, y_33), 0, (finish_33 - start_33) + 1) | 0), (line_16 = this$_44.startLine, (column_16 = this$_44.startColumn, ((() => {
                for (let i_28 = 0; i_28 <= (start_33 - 1); i_28++) {
                    if (this$_44.underlying[this$_44.startIndex + i_28] === "\n") {
                        line_16 = ((line_16 + 1) | 0);
                        column_16 = 0;
                    }
                    else {
                        column_16 = ((column_16 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_44.startIndex + start_33, len_16, this$_44.underlying, line_16, column_16)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_33)(finish_33)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_45 = s_85, new Position(this$_45.startLine, this$_45.startColumn)), singleton_1(new ErrorType(0, ("\u0027" + str_15) + "\u0027"))]), void 0]));
        };
    }, toList(map_2((c_15) => {
        const c_16 = c_15;
        return ["\\" + c_16, c_16];
    }, escapedChars.split("")))), (tupledArg_55) => {
        const s_88 = tupledArg_55[1];
        const go_7 = (state_115_mut, errorsAcc_mut, _arg1_3_mut) => {
            let this$_46;
            go_7:
            while (true) {
                const state_115 = state_115_mut, errorsAcc = errorsAcc_mut, _arg1_3 = _arg1_3_mut;
                if (!isEmpty(_arg1_3)) {
                    if (isEmpty(tail(_arg1_3))) {
                        const p_36 = head_3(_arg1_3);
                        const matchValue_46 = Result_MapError((tupledArg_56) => ParseError_sort(tupledArg_56[0], tupledArg_56[1]), p_36([state_115, s_88]));
                        if (matchValue_46.tag === 1) {
                            const state_118 = matchValue_46.fields[0][1];
                            const errors = matchValue_46.fields[0][0];
                            return new FSharpResult$2(1, [append_1(errorsAcc, errors), state_118]);
                        }
                        else {
                            const x_38 = matchValue_46;
                            return x_38;
                        }
                    }
                    else {
                        const p_38 = head_3(_arg1_3);
                        const ps_5 = tail(_arg1_3);
                        const matchValue_47 = Result_MapError((tupledArg_57) => ParseError_sort(tupledArg_57[0], tupledArg_57[1]), p_38([state_115, s_88]));
                        if (matchValue_47.tag === 1) {
                            const state_120 = matchValue_47.fields[0][1];
                            const errors_1 = matchValue_47.fields[0][0];
                            state_115_mut = state_120;
                            errorsAcc_mut = append_1(errors_1, errorsAcc);
                            _arg1_3_mut = ps_5;
                            continue go_7;
                        }
                        else {
                            const x_39 = matchValue_47;
                            return x_39;
                        }
                    }
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_46 = s_88, new Position(this$_46.startLine, this$_46.startColumn)), singleton_1(new ErrorType(2, "No parsers given"))]), state_115]);
                }
                break;
            }
        };
        return go_7(void 0, empty_1(), ps_3);
    })), (escape = ((tupledArg_58) => {
        const s_90 = tupledArg_58[1];
        const go_8 = (state_123_mut, errorsAcc_1_mut, _arg1_4_mut) => {
            let this$_47;
            go_8:
            while (true) {
                const state_123 = state_123_mut, errorsAcc_1 = errorsAcc_1_mut, _arg1_4 = _arg1_4_mut;
                if (!isEmpty(_arg1_4)) {
                    if (isEmpty(tail(_arg1_4))) {
                        const p_40 = head_3(_arg1_4);
                        const matchValue_48 = Result_MapError((tupledArg_59) => ParseError_sort(tupledArg_59[0], tupledArg_59[1]), p_40([state_123, s_90]));
                        if (matchValue_48.tag === 1) {
                            const state_126 = matchValue_48.fields[0][1];
                            const errors_2 = matchValue_48.fields[0][0];
                            return new FSharpResult$2(1, [append_1(errorsAcc_1, errors_2), state_126]);
                        }
                        else {
                            const x_40 = matchValue_48;
                            return x_40;
                        }
                    }
                    else {
                        const p_42 = head_3(_arg1_4);
                        const ps_8 = tail(_arg1_4);
                        const matchValue_49 = Result_MapError((tupledArg_60) => ParseError_sort(tupledArg_60[0], tupledArg_60[1]), p_42([state_123, s_90]));
                        if (matchValue_49.tag === 1) {
                            const state_128 = matchValue_49.fields[0][1];
                            const errors_3 = matchValue_49.fields[0][0];
                            state_123_mut = state_128;
                            errorsAcc_1_mut = append_1(errors_3, errorsAcc_1);
                            _arg1_4_mut = ps_8;
                            continue go_8;
                        }
                        else {
                            const x_41 = matchValue_49;
                            return x_41;
                        }
                    }
                }
                else {
                    return new FSharpResult$2(1, [singleton_1([(this$_47 = s_90, new Position(this$_47.startLine, this$_47.startColumn)), singleton_1(new ErrorType(2, "No parsers given"))]), state_123]);
                }
                break;
            }
        };
        return go_8(void 0, empty_1(), ofArray([controls, unicode16bit, unicode32bit, customEscapedChars]));
    }), (nonEscape = ((p_44 = ((clo1_27 = ((chars_1 = ("\\\b\t\n\u000b\f\r" + join("", escapedChars.split(""))).split(""), (set$_1 = (new Set(chars_1)), (label_9 = ((arg10_25 = toList(chars_1), toText(printf("one of %A"))(arg10_25))), (tupledArg_61) => {
        let this$_49, this$_50, start_35, finish_35, len_17, line_17, column_17, this$_51;
        const label_10 = label_9;
        const s_92 = tupledArg_61[1];
        let matchValue_50;
        const this$_48 = s_92;
        const index_8 = 0;
        matchValue_50 = (((index_8 < 0) ? true : (index_8 >= this$_48.length)) ? "￿" : this$_48.underlying[this$_48.startIndex + index_8]);
        if (matchValue_50 === "￿") {
            return new FSharpResult$2(1, [singleton_1([(this$_49 = s_92, new Position(this$_49.startLine, this$_49.startColumn)), ofArray([new ErrorType(0, label_10), new ErrorType(1, "EOF")])]), void 0]);
        }
        else {
            const c_17 = matchValue_50;
            return (!set$_1.has(c_17)) ? (new FSharpResult$2(0, [c_17, (this$_50 = s_92, (start_35 = (defaultArg(1, 0) | 0), (finish_35 = (defaultArg(void 0, this$_50.length - 1) | 0), (((start_35 >= 0) && (start_35 <= this$_50.length)) && (finish_35 < max_4((x_42, y_34) => comparePrimitives(x_42, y_34), start_35, this$_50.length))) ? ((len_17 = (max_4((x_43, y_35) => comparePrimitives(x_43, y_35), 0, (finish_35 - start_35) + 1) | 0), (line_17 = this$_50.startLine, (column_17 = this$_50.startColumn, ((() => {
                for (let i_30 = 0; i_30 <= (start_35 - 1); i_30++) {
                    if (this$_50.underlying[this$_50.startIndex + i_30] === "\n") {
                        line_17 = ((line_17 + 1) | 0);
                        column_17 = 0;
                    }
                    else {
                        column_17 = ((column_17 + 1) | 0);
                    }
                }
            })(), new StringSegment(this$_50.startIndex + start_35, len_17, this$_50.underlying, line_17, column_17)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_35)(finish_35)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_51 = s_92, new Position(this$_51.startLine, this$_51.startColumn)), ofArray([new ErrorType(0, label_10), new ErrorType(1, c_17)])]), void 0]));
        }
    })))), (tupledArg_62) => clo1_27([void 0, tupledArg_62[1]]))), (tupledArg_63) => {
        const matchValue_52 = Result_MapError((tupledArg_64) => ParseError_sort(tupledArg_64[0], void 0), p_44([void 0, tupledArg_63[1]]));
        if (matchValue_52.tag === 0) {
            const state_136 = matchValue_52.fields[0][2];
            const s_95 = matchValue_52.fields[0][1];
            const r_6 = matchValue_52.fields[0][0];
            return new FSharpResult$2(0, [r_6, s_95, void 0]);
        }
        else {
            const e_17 = matchValue_52.fields[0];
            return new FSharpResult$2(1, e_17);
        }
    })), (character = ((tupledArg_65) => {
        const s_97 = tupledArg_65[1];
        const matchValue_53 = Result_MapError((tupledArg_66) => ParseError_sort(tupledArg_66[0], void 0), nonEscape([void 0, s_97]));
        if (matchValue_53.tag === 1) {
            const state_140 = matchValue_53.fields[0][1];
            const es_3 = matchValue_53.fields[0][0];
            const matchValue_54 = Result_MapError((tupledArg_67) => ParseError_sort(tupledArg_67[0], void 0), escape([void 0, s_97]));
            if (matchValue_54.tag === 1) {
                const state_142 = matchValue_54.fields[0][1];
                const es$0027 = matchValue_54.fields[0][0];
                return new FSharpResult$2(1, [append_1(es_3, es$0027), void 0]);
            }
            else {
                const x_45 = matchValue_54;
                return x_45;
            }
        }
        else {
            const x_44 = matchValue_53;
            return x_44;
        }
    }), (p_49 = character, (tupledArg_68) => {
        const s_99 = tupledArg_68[1];
        const matchValue_55 = Result_MapError((tupledArg_69) => ParseError_sort(tupledArg_69[0], void 0), p_49([void 0, s_99]));
        if (matchValue_55.tag === 0) {
            const state_147 = matchValue_55.fields[0][2];
            const s_100 = matchValue_55.fields[0][1];
            const c1_1 = matchValue_55.fields[0][0];
            const sb_1 = CharParsers_StringBuilder_$ctor_Z721C83C5(c1_1);
            const go_9 = (tupledArg_70_mut) => {
                go_9:
                while (true) {
                    const tupledArg_70 = tupledArg_70_mut;
                    const state_148 = tupledArg_70[0];
                    const s_101 = tupledArg_70[1];
                    const matchValue_56 = Result_MapError((tupledArg_71) => ParseError_sort(tupledArg_71[0], void 0), p_49([void 0, s_101]));
                    if (matchValue_56.tag === 0) {
                        const state_151 = matchValue_56.fields[0][2];
                        const s_102 = matchValue_56.fields[0][1];
                        const c_18 = matchValue_56.fields[0][0];
                        CharParsers_StringBuilder__Append_Z721C83C5(sb_1, c_18);
                        tupledArg_70_mut = [void 0, s_102];
                        continue go_9;
                    }
                    else {
                        const state_150 = matchValue_56.fields[0][1];
                        return new FSharpResult$2(0, [toString(sb_1), s_101, void 0]);
                    }
                    break;
                }
            };
            return go_9([void 0, s_100]);
        }
        else {
            const state_146 = matchValue_55.fields[0][1];
            const es_4 = matchValue_55.fields[0][0];
            return new FSharpResult$2(0, ["", s_99, void 0]);
        }
    })))))))))), (matchValue_59 = Result_MapError((tupledArg_76) => ParseError_sort(tupledArg_76[0], void 0), (matchValue_57 = Result_MapError((tupledArg_73) => ParseError_sort(tupledArg_73[0], void 0), (c_6 = "\"", (s_40 = tupledArg_75[1], (matchValue_26 = ((this$_18 = s_40, (index_4 = 0, ((index_4 < 0) ? true : (index_4 >= this$_18.length)) ? "￿" : this$_18.underlying[this$_18.startIndex + index_4]))), (matchValue_26 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_19 = s_40, new Position(this$_19.startLine, this$_19.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_6) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head = matchValue_26, (head === c_6) ? (new FSharpResult$2(0, [void 0, (this$_20 = s_40, (start_15 = (defaultArg(1, 0) | 0), (finish_15 = (defaultArg(void 0, this$_20.length - 1) | 0), (((start_15 >= 0) && (start_15 <= this$_20.length)) && (finish_15 < max_4((x_16, y_14) => comparePrimitives(x_16, y_14), start_15, this$_20.length))) ? ((len_7 = (max_4((x_17, y_15) => comparePrimitives(x_17, y_15), 0, (finish_15 - start_15) + 1) | 0), (line_7 = this$_20.startLine, (column_7 = this$_20.startColumn, ((() => {
        for (let i_14 = 0; i_14 <= (start_15 - 1); i_14++) {
            if (this$_20.underlying[this$_20.startIndex + i_14] === "\n") {
                line_7 = ((line_7 + 1) | 0);
                column_7 = 0;
            }
            else {
                column_7 = ((column_7 + 1) | 0);
            }
        }
    })(), new StringSegment(this$_20.startIndex + start_15, len_7, this$_20.underlying, line_7, column_7)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_15)(finish_15)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_21 = s_40, new Position(this$_21.startLine, this$_21.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_6) + "\u0027"), new ErrorType(1, ("\u0027" + head) + "\u0027")])]), void 0])))))))), (matchValue_57.tag === 0) ? ((state_155 = matchValue_57.fields[0][2], (s_105 = matchValue_57.fields[0][1], (matchValue_58 = Result_MapError((tupledArg_74) => ParseError_sort(tupledArg_74[0], void 0), p_53([void 0, s_105])), (matchValue_58.tag === 0) ? ((state_157 = matchValue_58.fields[0][2], (s_106 = matchValue_58.fields[0][1], (r2_4 = matchValue_58.fields[0][0], new FSharpResult$2(0, [r2_4, s_106, void 0]))))) : ((e_19 = matchValue_58.fields[0], new FSharpResult$2(1, e_19))))))) : ((e_18 = matchValue_57.fields[0], new FSharpResult$2(1, e_18))))), (matchValue_59.tag === 0) ? ((state_161 = matchValue_59.fields[0][2], (s_109 = matchValue_59.fields[0][1], (r1_1 = matchValue_59.fields[0][0], (matchValue_60 = Result_MapError((tupledArg_77) => ParseError_sort(tupledArg_77[0], void 0), (c_8 = "\"", (s_48 = s_109, (matchValue_28 = ((this$_22 = s_48, (index_5 = 0, ((index_5 < 0) ? true : (index_5 >= this$_22.length)) ? "￿" : this$_22.underlying[this$_22.startIndex + index_5]))), (matchValue_28 === "￿") ? (new FSharpResult$2(1, [singleton_1([(this$_23 = s_48, new Position(this$_23.startLine, this$_23.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_8) + "\u0027"), new ErrorType(1, "EOF")])]), void 0])) : ((head_1 = matchValue_28, (head_1 === c_8) ? (new FSharpResult$2(0, [void 0, (this$_24 = s_48, (start_17 = (defaultArg(1, 0) | 0), (finish_17 = (defaultArg(void 0, this$_24.length - 1) | 0), (((start_17 >= 0) && (start_17 <= this$_24.length)) && (finish_17 < max_4((x_18, y_16) => comparePrimitives(x_18, y_16), start_17, this$_24.length))) ? ((len_8 = (max_4((x_19, y_17) => comparePrimitives(x_19, y_17), 0, (finish_17 - start_17) + 1) | 0), (line_8 = this$_24.startLine, (column_8 = this$_24.startColumn, ((() => {
        for (let i_16 = 0; i_16 <= (start_17 - 1); i_16++) {
            if (this$_24.underlying[this$_24.startIndex + i_16] === "\n") {
                line_8 = ((line_8 + 1) | 0);
                column_8 = 0;
            }
            else {
                column_8 = ((column_8 + 1) | 0);
            }
        }
    })(), new StringSegment(this$_24.startIndex + start_17, len_8, this$_24.underlying, line_8, column_8)))))) : toFail(printf("Index was out of range (GetSlice(%i, %i))."))(start_17)(finish_17)))), void 0])) : (new FSharpResult$2(1, [singleton_1([(this$_25 = s_48, new Position(this$_25.startLine, this$_25.startColumn)), ofArray([new ErrorType(0, ("\u0027" + c_8) + "\u0027"), new ErrorType(1, ("\u0027" + head_1) + "\u0027")])]), void 0])))))))), (matchValue_60.tag === 0) ? ((state_163 = matchValue_60.fields[0][2], (s_110 = matchValue_60.fields[0][1], new FSharpResult$2(0, [r1_1, s_110, void 0])))) : ((e_21 = matchValue_60.fields[0], new FSharpResult$2(1, e_21)))))))) : ((e_20 = matchValue_59.fields[0], new FSharpResult$2(1, e_20)))))));
    if (matchValue_61.tag === 1) {
        const e_22 = matchValue_61.fields[0];
        toConsole(printf("error: %A"))([e_22[0], void 0]);
    }
    else if (matchValue_61.fields[0][0] === "Hello, world👽") {
        toConsole(printf("success"));
    }
    else {
        const s_111 = matchValue_61.fields[0][0];
        toConsole(printf("wrong: %A"))(s_111);
    }
}

