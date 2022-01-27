namespace CocoActionConverter
open System
open FParsec

module AstParser =
    let pAst, pAstRef = createParserForwardedToRef<Ast, unit>()
    let charsTill str = CharParsers.charsTillString str false Int32.MaxValue <?> $"String till '{str}'"
    let pCoco = CharParsers.pstring "cc."
    let pNumber = CharParsers.pfloat |>> ANumber
    let pString = CharParsers.pchar '"' >>. charsTill "\"" |>> AString <?> "Quoted string"
    let pVariable = CharParsers.regex """^[_$a-z][\w$]*$""" |>> AVariable <?> "Any variable or property"
    let pCallFunc = CharParsers.pstring "cc.callFunc" >>. ParingParensParser.parser |>> ACallFunc
    let pParenOpen = CharParsers.pchar '(' .>> (opt (CharParsers.pchar '[')) <?> "Open paren '(' or '(['"
    let pParenClose = (opt (CharParsers.pchar ']')) >>. CharParsers.pchar ')' <?> "Close paren ')' or '])'"
    let pInsideParens parser = pParenOpen >>. parser .>> pParenClose
    let spaces = CharParsers.spaces
    let splitBy token parser = Primitives.between pParenOpen pParenClose (spaces >>. sepEndBy (parser .>> spaces) (CharParsers.pstring token >>. spaces))
    let pParamsInsideParens = splitBy "," pAst <?> "Params split by comma"
    let pCocoActionName = pCoco >>. charsTill "("
    let pEasing = CharParsers.pstringCI ".easing(cc." >>. charsTill "(" .>>. pParamsInsideParens .>> CharParsers.pstring ")" <?> "Coco Easing action"
    let pRepeatForever = CharParsers.stringCIReturn ".repeatForever()" Forever
    let pRepeatLimit = CharParsers.pstringCI ".repeat" >>. pInsideParens pAst |>> Limit
    let pRepeat = pRepeatForever <|> pRepeatLimit
    let pCocoAction =
        tuple4 pCocoActionName pParamsInsideParens (opt pEasing) (opt pRepeat)
        |>> fun (name, list, easing, repeat) -> ACocoAction {
            Name = name
            Params = list
            Easing = easing |> Option.map (fun (name, paramList) -> {
                Name = name
                Params = paramList
            })
            Repeat = repeat
        }
    pAstRef.Value <- Primitives.choice [
        pCallFunc
        pCocoAction
        pNumber
        pString
        pVariable
    ] <?> "string, number or function call"
    let parser = pAst
    // For more information see https://aka.ms/fsharp-console-apps
    

