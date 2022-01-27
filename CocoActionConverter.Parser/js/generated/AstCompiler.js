import { mapIndexed } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { partialApply, int32ToString } from "./fable_modules/fable-library.3.6.3/Util.js";
import { map, singleton, append } from "./fable_modules/fable-library.3.6.3/List.js";
import { Ast } from "./Ast.js";
import { join } from "./fable_modules/fable-library.3.6.3/String.js";
import { map as map_1, defaultArg } from "./fable_modules/fable-library.3.6.3/Option.js";

export function cppCocoConverter(name) {
    return Array.from(mapIndexed((i, c) => {
        if (i === 0) {
            return c.toLocaleUpperCase();
        }
        else {
            return c;
        }
    }, name.split(""))).join('');
}

export function cppNumberConverter(value) {
    const floor = Math.floor(value);
    if (value === floor) {
        let copyOfStruct = ~(~floor);
        return int32ToString(copyOfStruct);
    }
    else {
        return `${value}f`;
    }
}

export function compile(ast) {
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
            const dataParams = ((data.Name === "sequence") ? true : (data.Name === "spawn")) ? append(data.Params, singleton(new Ast(2, "nullptr"))) : data.Params;
            const paramsString = join(", ", map((ast_1) => compile(ast_1), dataParams));
            const wrapEasing = (inner, data_1) => {
                const paramsString_1 = join(", ", map((ast_2) => compile(ast_2), data_1.Params));
                const lastParamsString = (paramsString_1.length > 0) ? (`, ${paramsString_1}`) : "";
                return `${cppCocoConverter(data_1.Name)}::create(${inner}${lastParamsString})`;
            };
            const easing = (inner_1) => defaultArg(map_1(partialApply(1, wrapEasing, [inner_1]), data.Easing), inner_1);
            const wrapRepeat = (inner_2, data_2) => {
                if (data_2.tag === 1) {
                    const data_3 = data_2.fields[0];
                    return `Repeat::create(${inner_2}, ${compile(data_3)})`;
                }
                else {
                    return `RepeatForever::create(${inner_2})`;
                }
            };
            const repeat = (inner_3) => defaultArg(map_1(partialApply(1, wrapRepeat, [inner_3]), data.Repeat), inner_3);
            return repeat(easing(`${cppCocoConverter(data.Name)}::create(${paramsString})`));
        }
        case 4: {
            const data_4 = ast.fields[0];
            return `CallFunc::create${data_4}`;
        }
        default: {
            const value = ast.fields[0];
            return cppNumberConverter(value);
        }
    }
}

