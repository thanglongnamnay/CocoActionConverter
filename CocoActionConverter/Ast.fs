namespace CocoActionConverter

type Ast =
    | ANumber of float
    | AString of string
    | AVariable of string
    | ACocoAction of CocoAction
    | ACallFunc of string
and CocoAction = {
    Name: string
    Params: Ast list
    Easing: Easing option
    Repeat: Repeat option
}
and Repeat = Forever | Limit of Ast
and Easing = {
    Name: string
    Params: Ast list
}

