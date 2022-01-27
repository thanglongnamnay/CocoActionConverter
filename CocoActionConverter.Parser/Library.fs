namespace CocoActionConverter
open FParsec
module Parser =
    let actions = [
        "cc.sequence"
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
    ]
    let pRaw = CharParsers.many1CharsTill CharParsers.anyChar (CharParsers.eof :: (actions |> List.map CharParsers.followedByString) |> choice)
    let pAction = AstParser.parser |>> AstCompiler.compile
    let parser = [pAction; pRaw] |> choice |> many
    exception ParseFailed of string
    let run str =
        match run parser str with
        | Success(str, _, _) -> str |> String.concat ""
        | Failure (e, _, _) -> e


