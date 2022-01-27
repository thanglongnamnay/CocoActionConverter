import { FSharpRef, Union } from "./fable_modules/fable-library.3.6.3/Types.js";
import { union_type, list_type, string_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { join } from "./fable_modules/fable-library.3.6.3/String.js";
import { empty, map, concat, toArray } from "./fable_modules/fable-library.3.6.3/List.js";

export class Tree extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Leaf", "Node"];
    }
}

export function Tree$reflection() {
    return union_type("CocoActionConverter.Tree", [], Tree, () => [[["Item", string_type]], [["Item", list_type(Tree$reflection())]]]);
}

export function ParingParensParser_lazyParser() {
    const dummyParser = (_arg1) => {
        throw (new Error("a parser created with createParserForwardedToRef was not initialized"));
    };
    const r = new FSharpRef(dummyParser);
    return [(stream) => r.contents(stream), r];
}

const ParingParensParser_patternInput$004011$002D1 = ParingParensParser_lazyParser();

export const ParingParensParser_parseTreeRef = ParingParensParser_patternInput$004011$002D1[1];

export const ParingParensParser_parseTree = ParingParensParser_patternInput$004011$002D1[0];

export const ParingParensParser_node = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_between(FParsec_CharParsers_pchar("("), FParsec_CharParsers_pchar(")"), FParsec_Primitives_many(ParingParensParser_parseTree)), (arg0) => (new Tree(1, arg0)));

export const ParingParensParser_leaf = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_many1((() => {
    const clo1 = FParsec_CharParsers_noneOf("()".split(""));
    return (arg10) => clo1(arg10);
})()), (chars) => join("", toArray(chars))), (arg0) => (new Tree(0, arg0)));

ParingParensParser_parseTreeRef.contents = FParsec_Primitives_op_LessBarGreater(ParingParensParser_node, ParingParensParser_leaf);

export function ParingParensParser_nodes(_arg1) {
    if (_arg1.tag === 1) {
        const ts = _arg1.fields[0];
        return concat(map((_arg1_1) => ParingParensParser_nodes(_arg1_1), ts));
    }
    else {
        return empty();
    }
}

export function ParingParensParser_show(_arg1) {
    if (_arg1.tag === 1) {
        const trees = _arg1.fields[0];
        const inside = join("", map((_arg1_1) => ParingParensParser_show(_arg1_1), trees));
        return `(${inside})`;
    }
    else {
        const leaf = _arg1.fields[0];
        return leaf;
    }
}

export const ParingParensParser_showTree = FParsec_Primitives_op_BarGreaterGreater(ParingParensParser_parseTree, (_arg1) => ParingParensParser_show(_arg1));

export const ParingParensParser_parser = ParingParensParser_showTree;

