namespace CocoActionConverter

open FParsec
type Tree = Leaf of string | Node of Tree list
module ParingParensParser =
    let lazyParser() =
        let dummyParser = fun _ -> failwith "a parser created with createParserForwardedToRef was not initialized"
        let r = ref dummyParser
        (fun stream -> r.Value stream), r : Parser<_,'u> * Parser<_,'u> ref
        
    let parseTree, parseTreeRef = lazyParser<Tree, unit>()
    let node = between (CharParsers.pchar '(') (CharParsers.pchar ')') (many parseTree) |>> Node
    let leaf = many1 (noneOf "()") |>> (fun chars -> System.String.Concat(Array.ofList(chars))) |>> Leaf
    parseTreeRef.Value <- node <|> leaf
    let rec nodes = function
        | Leaf _ -> []
        | Node ts -> ts |> List.map nodes |> List.concat
    
    let rec show = function
        | Leaf leaf -> leaf
        | Node trees ->
            let inside = trees |> List.map show |> String.concat ""
            $"({inside})"
        
    let showTree = parseTree |>> show
    
    let parser = showTree

