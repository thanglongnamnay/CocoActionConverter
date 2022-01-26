namespace CocoActionConverter

module AstCompiler =
    let cppCocoConverter name =
        name |> String.mapi (fun i c -> if i = 0 then c |> System.Char.ToUpper else c)
    let cppNumberConverter (value: float) =
        let floor = System.Math.Floor value
        if (value = floor)
        then int(floor).ToString()
        else $"{value}f"
        
    let rec compile ast =
        match ast with
        | ANumber value -> cppNumberConverter value
        | AString value -> $"\"{value}\""
        | AVariable value -> value
        | AFuncCall data ->
            let paramsString = data.Params |> List.map compile |> String.concat ", "
            $"{data.Name}({paramsString})"
        | ACocoAction data ->
            let dataParams =
                if data.Name = "sequence" || data.Name = "spawn"
                then data.Params @ [AVariable "nullptr"]
                else data.Params
            let paramsString = dataParams |> List.map compile |> String.concat ", "
            
            let wrapEasing inner data =
                let paramsString = data.Params |> List.map compile |> String.concat ", "
                let lastParamsString = if (paramsString.Length > 0) then $", {paramsString}" else "";
                $"{cppCocoConverter data.Name}::create({inner}{lastParamsString})"
            let easing inner = data.Easing |> Option.map (wrapEasing inner) |> Option.defaultValue inner
            
            let wrapRepeat inner data =
                match data with
                | Forever -> $"RepeatForever::create({inner})"
                | Limit data -> $"Repeat::create({inner}, {compile data})"
            let repeat inner = data.Repeat |> Option.map (wrapRepeat inner) |> Option.defaultValue inner

            $"{cppCocoConverter data.Name}::create({paramsString})" |> easing |> repeat
        | ACallFunc data -> $"CallFunc::create{data}"
