import { FSharpRef } from "./fable_modules/fable-library.3.6.3/Types.js";
import { CocoAction, Easing, Repeat, Ast } from "./Ast.js";
import { ParingParensParser_parser } from "./ParingParensParser.js";
import { map } from "./fable_modules/fable-library.3.6.3/Option.js";

export function lazyParser() {
    const dummyParser = (_arg1) => {
        throw (new Error("a parser created with createParserForwardedToRef was not initialized"));
    };
    const r = new FSharpRef(dummyParser);
    return [(stream) => r.contents(stream), r];
}

const patternInput$004010 = lazyParser();

export const pAstRef = patternInput$004010[1];

export const pAst = patternInput$004010[0];

export function charsTill(str) {
    return FParsec_Primitives_op_LessQmarkGreater(FParsec_CharParsers_charsTillString(str, false, 2147483647), `String till '${str}'`);
}

export const pCoco = FParsec_CharParsers_pstring("cc.");

export const pNumber = FParsec_Primitives_op_BarGreaterGreater(FParsec_CharParsers_pfloat(), (arg0) => (new Ast(0, arg0)));

export const pString = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar("\""), charsTill("\"")), (arg0) => (new Ast(1, arg0))), "Quoted string");

export const pVariable = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_CharParsers_regex("^[_$a-z][\\w$]*"), (arg0) => (new Ast(2, arg0))), "Any variable or property");

export const pCallFunc = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("cc.callFunc"), ParingParensParser_parser), (arg0) => (new Ast(4, arg0)));

export const pParenOpen = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_DotGreaterGreater(FParsec_CharParsers_pchar("("), FParsec_Primitives_opt(FParsec_CharParsers_pchar("["))), "Open paren \u0027(\u0027 or \u0027([\u0027");

export const pParenClose = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_opt(FParsec_CharParsers_pchar("]")), FParsec_CharParsers_pchar(")")), "Close paren \u0027)\u0027 or \u0027])\u0027");

export function pInsideParens(parser_1) {
    return FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(pParenOpen, parser_1), pParenClose);
}

export function spaces() {
    return FParsec_CharParsers_spaces();
}

export function splitBy(token, parser_1) {
    return FParsec_Primitives_between(pParenOpen, pParenClose, FParsec_Primitives_op_GreaterGreaterDot(spaces(), FParsec_Primitives_sepEndBy(FParsec_Primitives_op_DotGreaterGreater(parser_1, spaces()), FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(token), spaces()))));
}

export const pParamsInsideParens = FParsec_Primitives_op_LessQmarkGreater(splitBy(",", pAst), "Params split by comma");

export const pCocoActionName = FParsec_Primitives_op_GreaterGreaterDot(pCoco, charsTill("("));

export const pEasing = FParsec_Primitives_op_LessQmarkGreater(FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_DotGreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(".easing(cc."), charsTill("(")), pParamsInsideParens), FParsec_CharParsers_pstring(")")), "Coco Easing action");

export const pRepeatForever = FParsec_CharParsers_stringReturn(".repeatForever()", new Repeat(0));

export const pRepeatLimit = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(".repeat"), pInsideParens(pAst)), (arg0) => (new Repeat(1, arg0)));

export const pRepeat = FParsec_Primitives_op_LessBarGreater(pRepeatForever, pRepeatLimit);

export const pCocoAction = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_tuple4(pCocoActionName, pParamsInsideParens, FParsec_Primitives_opt(pEasing), FParsec_Primitives_opt(pRepeat)), (tupledArg) => {
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

export const parser = pAst;

