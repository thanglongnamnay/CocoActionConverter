module CocoActionConverter.Wasm.Client.Main

open System.Net.Http
open System.Text.RegularExpressions
open System.Threading.Tasks
open Blazored.LocalStorage
open Microsoft.AspNetCore.Components
open Microsoft.JSInterop
open Elmish
open Bolero
open Bolero.Html

open CocoActionConverter
open System.Text.Json
open System.Text.Json.Serialization

module Crud =
    type Model<'T> = 'T list

    type Msg<'T> =
        | Add of 'T
        | Filter of ('T -> bool)
        | Map of ('T -> 'T)
        | RemoveIndex of int
        | InsertIndex of int * 'T
        | Shift of index: int * amount: int

    let initModel<'T> : 'T list = []

    let update msg model =
        match msg with
        | Add value -> model @ [value]
        | Filter filter -> model |> List.filter filter
        | Map map -> model |> List.map map
        | RemoveIndex index -> model |> List.removeAt index
        | InsertIndex (index, element) -> model |> List.insertAt index element
        | Shift (index, amount) ->
            let element = model |> List.item index

            model
            |> List.removeAt index
            |> List.insertAt (index + amount) element

    let test () =
        let model0 = [ 1; 2; 3 ]
        let model1 = model0 |> update (Add 0)

        let model2 =
            model1 |> update (Filter(fun x -> x % 2 = 0))

        let model3 = model1 |> update (Shift(0, 2))

        System.Console.WriteLine model0
        System.Console.WriteLine model1
        System.Console.WriteLine model2
        System.Console.WriteLine model3

module Converter =
    type RegexReplace = { Pattern: string; Value: string }

    type Type =
        | RegexReplace of RegexReplace
        | ActionConverter

    type Status =
        | Enabled
        | Disabled

    type T = { Type: Type; Status: Status }

    type Model = Crud.Model<T>
    type Msg = Crud.Msg<T>

    type Move =
        | Up
        | Down

    let initModel =
        [ { Type = ActionConverter
            Status = Enabled }
          { Type =
                RegexReplace
                    { Pattern = "const"
                      Value = "auto" }
            Status = Enabled } ]

    let parser =
        let (|>>) = FParsec.Primitives.op_BarGreaterGreater
        AstParser.parser |>> AstCompiler.compile

    let convert model str =
        match model.Type with
        | RegexReplace data -> Ok(data.Pattern.Replace(str, data.Value))
        | ActionConverter ->
            match FParsec.CharParsers.run parser str with
            | FParsec.CharParsers.ParserResult.Success (v, _, _) -> Ok v
            | FParsec.CharParsers.ParserResult.Failure (v, _, _) -> Error v

    let updateElement oldModel newModel =
        System.Console.WriteLine $"updateElement {oldModel} -> {newModel}"

        Msg.Map
            (fun model ->
                if model = oldModel then
                    newModel
                else
                    model)

    let regexReplaceView onInputChange onOutputChange model =
        [ div [ attr.classes [ "column is-6" ] ] [
            input [ bind.input.string (string model.Pattern) onInputChange
                    attr.classes [ "input" ] ]
          ]
          div [ attr.classes [ "column is-6" ] ] [
              input [ bind.input.string (model.Value) onOutputChange
                      attr.classes [ "input" ] ]
          ] ]

    let actionConverterView = []

    let elementName model =
        match model with
        | RegexReplace _ -> "Regex Replace"
        | ActionConverter -> "Action Converter"

    let elementView model dispatch =
        match model.Type with
        | RegexReplace data ->
            let update = updateElement model

            let onChange fn =
                fun str ->
                    dispatch (
                        update
                            { model with
                                  Type = RegexReplace(fn str) }
                    )

            regexReplaceView
                (onChange (fun str -> { data with Pattern = str }))
                (onChange (fun str -> { data with Value = str }))
                data
        | ActionConverter -> actionConverterView

    let view model dispatch =
        div [] [
            div
                []
                (model
                 |> List.mapi
                     (fun index el ->
                         let view = elementView el dispatch

                         div [ attr.classes [ "columns"
                                              "field"
                                              "has-addons" ] ] [
                             input [ attr.``type`` "checkbox" ]
                             div [ attr.classes [ "column is-2" ] ] [
                                 text (elementName el.Type)
                             ]
                             div [ attr.classes [ "column is-8 columns" ] ] view
                             div [ attr.classes [ "column is-2" ] ] [
                                 button [ on.click (fun _ -> dispatch (Msg.Shift(index, -1)))
                                          attr.disabled (index = 0)
                                          attr.classes [ "button" ] ] [
                                     text "Up"
                                 ]
                                 button [ on.click (fun _ -> dispatch (Msg.Shift(index, 1)))
                                          attr.disabled (index = model.Length - 1)
                                          attr.classes [ "button" ] ] [
                                     text "Down"
                                 ]
                                 button [ on.click (fun _ -> dispatch (Msg.RemoveIndex(index)))
                                          attr.classes [ "delete is-large" ] ] []
                             ]
                         ]))
            div [ attr.classes [ "columns" ] ] [
                div [ attr.classes [ "column is-3 select" ] ] [
                    select
                        []
                        (model
                         |> List.map (fun el -> elementName el.Type)
                         |> List.map (fun name -> option [] [ text name ]))
                ]
                div [ attr.classes [ "column is-3" ] ] [
                    button [ on.click
                                 (fun _ ->
                                     dispatch (
                                         Msg.Add
                                             { Type =
                                                   RegexReplace
                                                       { Pattern = "const"
                                                         Value = "auto" }
                                               Status = Enabled }
                                     ))
                             attr.classes [ "button" ] ] [text "Add converter"]
                ]
            ]
        ]

type Model =
    { Source: string
      Dest: string
      Pipeline: Converter.Model }

type Msg =
    | EditSource of string
    | PipelineMsg of Converter.Msg
    | Convert

let initModel =
    { Source = ""
      Dest = ""
      Pipeline = Converter.initModel },
    Cmd.none

let flip2 f a b = f b a

let rec update msg model =
    match msg with
    | EditSource str -> { model with Source = str }, Cmd.none
    | PipelineMsg msg ->
        { model with
              Pipeline = Crud.update msg model.Pipeline },
        Cmd.none
    | Convert ->
        match model.Pipeline
              |> List.map Converter.convert
              |> List.fold (flip2 Result.bind) (Ok model.Source) with
        | Ok text -> { model with Dest = text }, Cmd.none
        | Error err -> { model with Dest = err }, Cmd.none

let btn attrs children =
    p [ attr.classes [ "control" ] ] [
        button attrs children
    ]

let tarea attrs children =
    div [ attr.classes [ "column" ] ] [
        textarea attrs children
    ]
// Note, this declaration is needed if you enable LiveUpdate
let view (js: IJSRuntime) (model: Model) dispatch =
    div [] [
        div [ attr.classes [ "field"; "has-addons" ] ] [
            btn [ on.click (fun _ -> dispatch Convert)
                  attr.classes [ "button"; "is-primary" ] ] [
                text "Convert"
            ]
            btn [ on.click
                      (fun _ ->
                          js.InvokeVoidAsync("window.copyDest", model.Dest)
                          |> ignore)
                  attr.id "btnCopy"
                  attr.classes [ "button"
                                 "is-primary-dark" ] ] [
                text "Copy to Clipboard"
            ]
        ]

        model.Pipeline
        |> (fun model ->
            Converter.view
                model
                (fun msg ->
                    System.Console.WriteLine $"Dispatch ${msg}"
                    dispatch (PipelineMsg msg)))
        div [ attr.classes [ "columns" ] ] [
            tarea [ bind.input.string model.Source (dispatch << EditSource)
                    attr.id "source"
                    attr.placeholder "Source code"
                    attr.classes [ "textarea"
                                   "has-text-white"
                                   "has-background-dark" ]
                    attr.rows 25 ] []
            tarea [ attr.readonly true
                    attr.placeholder "Output"
                    attr.id "result"
                    attr.rows 25
                    attr.classes [ "textarea"
                                   "has-text-white"
                                   "has-background-dark" ] ] [
                text model.Dest
            ]
        ]
    ]


type MyApp() =
    inherit ProgramComponent<Model, Msg>()

    [<Inject>]
    member val HttpClient = Unchecked.defaultof<HttpClient> with get, set

    [<Inject>]
    member val LocalStorage = Unchecked.defaultof<ILocalStorageService> with get, set

    [<Inject>]
    member val LocalStorageSync = Unchecked.defaultof<ISyncLocalStorageService> with get, set


    override this.Program =
        let options = JsonSerializerOptions()
        options.Converters.Add(JsonFSharpConverter())
        let view = view this.JSRuntime
        let update msg model =
            let (newModel, cmd) = update msg model
            try
                System.Console.WriteLine $"""1this.LocalStorageSync.SetItem("model", {newModel})"""
                this.LocalStorage.SetItemAsStringAsync("model", JsonSerializer.Serialize(newModel, options)) |> ignore
                System.Console.WriteLine """2this.LocalStorageSync.SetItem("model", newModel)"""
            with
            | ex -> System.Console.WriteLine $"LocalStorage error: {ex}"
            newModel, cmd
        let init _ =
            try
                let modelStr = this.LocalStorageSync.GetItemAsString("model")
                JsonSerializer.Deserialize<Model>(modelStr, options), Cmd.none
            with
            | ex ->
                System.Console.WriteLine(ex)
                initModel
        Crud.test ()

        Program.mkProgram init update view
//        |> Program.withConsoleTrace
