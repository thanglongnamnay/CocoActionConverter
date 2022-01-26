namespace CocoActionConverter
open System
open FParsec

module AstParser =
    let pAst, pAstRef = createParserForwardedToRef<Ast, unit>()
    let charsTill str = CharParsers.charsTillString str false Int32.MaxValue
    let pCoco = CharParsers.pstring "cc."
    let pNumber = CharParsers.pfloat |>> ANumber
    let pString = CharParsers.pchar '"' >>. charsTill "\"" |>> AString
    let pVariable = CharParsers.regex """^[_$a-z][\w$]*$""" |>> AVariable
    let pCallFunc = CharParsers.pstring "cc.callFunc" >>. ParingParensParser.parser |>> ACallFunc
    let pParenOpen = CharParsers.pchar '('
    let pParenClose = CharParsers.pchar ')'
    let pInsideParens parser = pParenOpen >>. parser .>> pParenClose
    let splitBy token parser = Primitives.between pParenOpen pParenClose (CharParsers.spaces >>. sepBy (parser .>> CharParsers.spaces) (CharParsers.pstring token >>. CharParsers.spaces))
    let pParamsInsideParens = splitBy "," pAst
    let pCocoActionName = pCoco >>. charsTill "("
    let pEasing = CharParsers.pstringCI ".easing(cc." >>. charsTill "(" .>>. pParamsInsideParens .>> CharParsers.pstring ")"
    let pRepeatForever = CharParsers.stringCIReturn ".repeatForever()" Forever
    let pRepeatLimit = CharParsers.pstringCI ".repeat" >>. pInsideParens pAst |>> Limit
    let pRepeat = pRepeatForever <|> pRepeatLimit
    let pCocoAction =
        pCocoActionName
        .>>. pParamsInsideParens
        .>>. Primitives.opt pEasing
        .>>. Primitives.opt pRepeat
        |>> fun (((name, list), easing), repeat) -> ACocoAction {
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
    ]
    let parser = pAst
    // For more information see https://aka.ms/fsharp-console-apps
    

