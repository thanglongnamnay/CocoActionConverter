import { cons, map, ofArray } from "./fable_modules/fable-library.3.6.3/List.js";
import { parser as parser_1 } from "./AstParser.js";
import { compile } from "./AstCompiler.js";
import { FSharpException } from "./fable_modules/fable-library.3.6.3/Types.js";
import { class_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { equals } from "./fable_modules/fable-library.3.6.3/Util.js";
import { join } from "./fable_modules/fable-library.3.6.3/String.js";

export const actions = ofArray(["cc.sequence", "cc.spawn", "cc.repeat", "cc.repeatForever", "cc.speed", "cc.show", "cc.hide", "cc.toggleVisibility", "cc.removeSelf", "cc.flipX", "cc.flipY", "cc.place", "cc.callFunc", "cc.targetedAction", "cc.moveTo", "cc.moveBy", "cc.rotateTo", "cc.rotateBy", "cc.scaleTo", "cc.scaleBy", "cc.skewTo", "cc.skewBy", "cc.jumpBy", "cc.jumpTo", "cc.follow", "cc.bezierTo", "cc.bezierBy", "cc.blink", "cc.fadeTo", "cc.fadeIn", "cc.fadeOut", "cc.tintTo", "cc.tintBy", "cc.delayTime"]);

export const pRaw = FParsec_CharParsers_many1CharsTill(FParsec_CharParsers_anyChar(), (() => {
    const clo1 = FParsec_Primitives_choice(cons(FParsec_CharParsers_eof(), map((arg00$0040) => FParsec_CharParsers_followedByString(arg00$0040), actions)));
    return (arg10) => clo1(arg10);
})());

export const pAction = FParsec_Primitives_op_BarGreaterGreater(parser_1, (ast) => compile(ast));

export const parser = FParsec_Primitives_many((() => {
    const clo1 = FParsec_Primitives_choice([pAction, pRaw]);
    return (arg10) => clo1(arg10);
})());

export class ParseFailed extends FSharpException {
    constructor(Data0) {
        super();
        this.Data0 = Data0;
    }
}

export function ParseFailed$reflection() {
    return class_type("CocoActionConverter.Parser.ParseFailed", void 0, ParseFailed, class_type("System.Exception"));
}

function ParseFailed__Equals_229D3F39(this$, obj) {
    if (!equals(this$, null)) {
        if (!equals(obj, null)) {
            if (obj instanceof ParseFailed) {
                return this$.Data0 === obj.Data0;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else if (!equals(obj, null)) {
        return false;
    }
    else {
        return true;
    }
}

export function run(str) {
    const matchValue = FParsec_CharParsers_run(parser, str);
    if (matchValue.tag === 1) {
        const e = matchValue.fields[0];
        return e;
    }
    else {
        const str_1 = matchValue.fields[0];
        return join("", str_1);
    }
}

