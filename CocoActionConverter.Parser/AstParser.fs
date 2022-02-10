namespace CocoActionConverter

open System
open FParsec

module AstParser =
    let actions =
        [ "cc.sequence"
          "cc.spawn"
          "cc.repeat"
          "cc.repeatForever"
          "cc.speed"
          "cc.show"
          "cc.hide"
          "cc.toggleVisibility"
          "cc.removeSelf"
          "cc.flipX"
          "cc.flipY"
          "cc.place"
          "cc.callFunc"
          "cc.targetedAction"
          "cc.moveTo"
          "cc.moveBy"
          "cc.rotateTo"
          "cc.rotateBy"
          "cc.scaleTo"
          "cc.scaleBy"
          "cc.skewTo"
          "cc.skewBy"
          "cc.jumpBy"
          "cc.jumpTo"
          "cc.follow"
          "cc.bezierTo"
          "cc.bezierBy"
          "cc.blink"
          "cc.fadeTo"
          "cc.fadeIn"
          "cc.fadeOut"
          "cc.tintTo"
          "cc.tintBy"
          "cc.delayTime"
          "//" ]

    let charsTill str =
        CharParsers.charsTillString str false Int32.MaxValue
        <?> $"String till '{str}'"
    let pRaw =
        CharParsers.notFollowedByString "cc."
        >>. (CharParsers.many1CharsTill
                 CharParsers.anyChar
                 (CharParsers.eof
                  :: (actions |> List.map CharParsers.followedByStringCI)
                  |> choice))
        |>> ARaw
    let pComment = pstring "//" >>. restOfLine true |>> fun str -> ARaw $"//{str}\n"

    let ch = CharParsers.pchar
    let str = CharParsers.pstring
    let ws = CharParsers.spaces

    let pParenOpen =
        ch '(' .>> (opt (ch '['))
        <?> "Open paren '(' or '(['"

    let pParenClose =
        (opt (ch ']')) >>. ch ')'
        <?> "Close paren ')' or '])'"

    let pInsideParens parser =
        (between pParenOpen pParenClose parser) .>> ws

    let opp =
        OperatorPrecedenceParser<Ast, unit, unit>()

    let pAst = opp.ExpressionParser
    let parser = [ pComment; pRaw; pAst ] |> choice |> many1

    let pCoco = str "cc."
    let pNumber = CharParsers.pfloat .>> ws |>> ANumber

    let pString =
        ch '"' >>. charsTill "\"" .>> ch '"' .>> ws
        |>> AString
        <?> "Quoted string"

    let pVar =
        CharParsers.regex """^[_$a-zA-Z][\.\w$]*""" .>> ws

    let pVariable = pVar .>> ws |>> AVariable

    let pCallFunc =
        str "cc.callFunc" >>. ParingParensParser.parser
        |>> fun str ->
                let p = parser

                match run p str with
                | Success (astList, _, _) -> astList
                | Failure (s, e, _) as v ->
                    Console.WriteLine $"Call func failed\n Input: {str}\nResult: {v}"
                    [ (ARaw str) ]

    let splitBy pOpen pClose token parser =
        Primitives.between pOpen pClose (ws >>. sepEndBy (parser .>> ws) (str token >>. ws))

    let pParamsInsideParens =
        splitBy pParenOpen pParenClose "," pAst .>> ws

    let pFuncCall =
        pVar .>>. pParamsInsideParens .>> ws
        |>> fun (var, astList) -> AFuncCall { Name = var; Params = astList }

    let pArray =
        splitBy (ch '[') (ch ']') "," pAst .>> ws
        |>> AArray

    let pCocoActionName = pCoco >>. charsTill "("

    let pEasing =
        str ".easing(cc." >>. charsTill "("
        .>>. pParamsInsideParens
        .>> str ")"
        <?> "Coco Easing action"

    let pRepeatForever =
        CharParsers.stringReturn ".repeatForever()" Forever

    let pRepeatLimit =
        str ".repeat" >>. pInsideParens pAst |>> Limit

    let pRepeat = pRepeatForever <|> pRepeatLimit

    let pCocoAction =
        tuple4 pCocoActionName pParamsInsideParens (opt pEasing) (opt pRepeat)
        |>> fun (name, list, easing, repeat) ->
                ACocoAction
                    { Name = name
                      Params = list
                      Easing =
                          easing
                          |> Option.map (fun (name, paramList) -> { Name = name; Params = paramList })
                      Repeat = repeat }

    let makeInfix precedence op left right =
        AInfix
            { Operator = op
              Precedence = precedence
              Left = left
              Right = right }

    opp.AddOperator(InfixOperator("+", ws, 1, Associativity.Left, makeInfix 1 "+"))
    opp.AddOperator(InfixOperator("-", ws, 1, Associativity.Left, makeInfix 1 "-"))
    opp.AddOperator(InfixOperator("*", ws, 2, Associativity.Left, makeInfix 2 "*"))
    opp.AddOperator(InfixOperator("/", ws, 2, Associativity.Left, makeInfix 2 "/"))

    opp.AddOperator(
        PrefixOperator(
            "-",
            ws,
            4,
            true,
            fun x ->
                APrefix
                    { Operator = "-"
                      Precedence = 3
                      Value = x }
        )
    )

    opp.TermParser <-
        choice [ pNumber
                 pString
                 pCallFunc |>> ACallFunc
                 pCocoAction
                 pArray
                 pInsideParens pAst
                 attempt pFuncCall
                 pVariable ]

    let test () =
        Console.WriteLine(
            run
                parser
                """
    eff.setVisible(false);
    // eff.runAction(
    //     cc.sequence(
    //         cc.delayTime(1 + timeMove * 1.5 + 0.15),
    //         cc.callFunc(function () {
    //             this.setVisible(true);
    //             this.getAnimation().gotoAndPlay("idle", -1, -1, 1);
    //             this.setCompleteListener(function () {
    //                 this.setVisible(false);
    //             });
    //         }, eff)
    //     )
    // )"""
        )
// For more information see https://aka.ms/fsharp-console-apps
