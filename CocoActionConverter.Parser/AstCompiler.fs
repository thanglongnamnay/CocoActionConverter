namespace CocoActionConverter

open System

module AstCompiler =
    let cppCocoConverter name =
        name
        |> String.mapi
            (fun i c ->
                match i with
                | 0 -> Char.ToUpper c
                | _ -> c)

    let cppNumberConverter (value: float) =
        let floor = System.Math.Floor value

        if (value = floor) then
            string floor
        else
            $"{value}f"

    let getPrecedence =
        function
        | AInfix data -> data.Precedence
        | APrefix data -> data.Precedence
        | _ -> Int32.MaxValue

    let rec compileAst ast =
        match ast with
        | ANumber value -> cppNumberConverter value
        | AString value -> $"\"{value}\""
        | AVariable value -> value
        | AFuncCall data ->
            let inside =
                data.Params
                |> List.map compileAst
                |> String.concat ","

            $"{data.Name}({inside})"
        | ACocoAction data ->
            let dataParams =
                match data.Name with
                | "sequence" | "spawn" -> data.Params @ [ AVariable "nullptr" ]
                | _ -> data.Params

            let paramsString =
                dataParams
                |> List.map compileAst
                |> String.concat ", "

            let wrapEasing inner data =
                let paramsString =
                    data.Params
                    |> List.map compileAst
                    |> String.concat ", "

                let lastParamsString =
                    match paramsString with
                    | "" -> ""
                    | str -> $", {str}"

                $"{cppCocoConverter data.Name}::create({inner}{lastParamsString})"

            let easing inner =
                data.Easing
                |> Option.map (wrapEasing inner)
                |> Option.defaultValue inner

            let wrapRepeat inner data =
                match data with
                | Forever -> $"RepeatForever::create({inner})"
                | Limit data -> $"Repeat::create({inner}, {compileAst data})"

            let repeat inner =
                data.Repeat
                |> Option.map (wrapRepeat inner)
                |> Option.defaultValue inner

            $"{cppCocoConverter data.Name}::create({paramsString})"
            |> easing
            |> repeat
        | ACallFunc data ->
            let inside =
                data |> List.map compileAst |> String.concat ""

            $"CallFunc::create{inside}"
        | ARaw str -> str
        | AArray astList ->
            let inside =
                astList
                |> List.map compileAst
                |> String.concat ", "

            $"makeVector({inside})"
        | APrefix data -> $"{data.Operator}{compileAst data.Value}"
        | AInfix data as ast ->
            let pre = getPrecedence ast

            let left =
                if pre <= getPrecedence data.Left then
                    compileAst data.Left
                else
                    $"({compileAst data.Left})"

            let right =
                if pre <= getPrecedence data.Right then
                    compileAst data.Right
                else
                    $"({compileAst data.Right})"

            $"{left} {data.Operator} {right}"

    let compile astList =
        astList |> List.map compileAst |> String.concat ""
