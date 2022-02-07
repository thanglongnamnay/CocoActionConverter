namespace CocoActionConverter

type Ast =
    | ANumber of float
    | AString of string
    | AVariable of string
    | ACocoAction of CocoAction
    | ACallFunc of Ast list
    | AFuncCall of FuncCall
    | ARaw of string
    | AArray of Ast list
    | APrefix of Prefix
    | AInfix of Infix

and FuncCall = { Name: string; Params: Ast List }

and CocoAction =
    { Name: string
      Params: Ast list
      Easing: Easing option
      Repeat: Repeat option }

and Repeat =
    | Forever
    | Limit of Ast

and Easing = { Name: string; Params: Ast list }

and Infix =
    { Operator: string
      Precedence: int
      Left: Ast
      Right: Ast }

and Prefix =
    { Operator: string
      Precedence: int
      Value: Ast }
