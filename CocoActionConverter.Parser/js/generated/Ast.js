import { Record, Union } from "./fable_modules/fable-library.3.6.3/Types.js";
import { record_type, option_type, list_type, union_type, string_type, float64_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";

export class Ast extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["ANumber", "AString", "AVariable", "ACocoAction", "ACallFunc"];
    }
}

export function Ast$reflection() {
    return union_type("CocoActionConverter.Ast", [], Ast, () => [[["Item", float64_type]], [["Item", string_type]], [["Item", string_type]], [["Item", CocoAction$reflection()]], [["Item", string_type]]]);
}

export class CocoAction extends Record {
    constructor(Name, Params, Easing, Repeat) {
        super();
        this.Name = Name;
        this.Params = Params;
        this.Easing = Easing;
        this.Repeat = Repeat;
    }
}

export function CocoAction$reflection() {
    return record_type("CocoActionConverter.CocoAction", [], CocoAction, () => [["Name", string_type], ["Params", list_type(Ast$reflection())], ["Easing", option_type(Easing$reflection())], ["Repeat", option_type(Repeat$reflection())]]);
}

export class Repeat extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Forever", "Limit"];
    }
}

export function Repeat$reflection() {
    return union_type("CocoActionConverter.Repeat", [], Repeat, () => [[], [["Item", Ast$reflection()]]]);
}

export class Easing extends Record {
    constructor(Name, Params) {
        super();
        this.Name = Name;
        this.Params = Params;
    }
}

export function Easing$reflection() {
    return record_type("CocoActionConverter.Easing", [], Easing, () => [["Name", string_type], ["Params", list_type(Ast$reflection())]]);
}

