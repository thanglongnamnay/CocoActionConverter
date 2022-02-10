module CocoActionConverter.Wasm.Client.Main

open System.Net.Http
open Microsoft.AspNetCore.Components
open Microsoft.JSInterop
open Elmish
open Bolero
open Bolero.Html

open CocoActionConverter
open FParsec
type Model = { Source: string; Dest: string }

type Msg =
    | EditSource of string
    | EditComplete of string
    | Convert

let initModel = { Source = ""; Dest = "" }, Cmd.none

let init () = initModel, Cmd.none

let parser = AstParser.parser |>> AstCompiler.compile

let rec update (js: IJSRuntime) msg model =
    match msg with
    | EditSource str -> {model with Source = str}, Cmd.none
    | EditComplete str -> update js Convert { model with Source = str }
    | Convert ->
        let result = CharParsers.run parser model.Source
        match result with
        | Success (text, _, _) ->
//                { model with Dest = text }, (Bolero.Remoting.Client.Cmd.OfJS.perform js "window.copyDest" [|text|] id)
            { model with Dest = text }, Cmd.none
        | Failure(s, _, _) -> { model with Dest = s }, Cmd.none

let btn attrs children =
    p [attr.classes ["control"]] [
        button attrs children
    ]
let tarea attrs children =
    div [attr.classes ["column"]] [
        textarea attrs children
    ]
// Note, this declaration is needed if you enable LiveUpdate
let view (js: IJSRuntime) (model: Model) dispatch =
    div [] [
        div [attr.classes ["field"; "has-addons"]] [
            btn [
                on.click (fun _ -> dispatch Convert)
                attr.classes ["button"; "is-primary"]
            ] [text "Convert"]
            btn [
                on.click (fun _ -> js.InvokeVoidAsync("window.copyDest", model.Dest) |> ignore)
                attr.id "btnCopy"
                attr.classes ["button"; "is-primary-dark"]
            ] [text "Copy to Clipboard"]
        ]
        div [attr.classes ["columns"]] [
            tarea [
                bind.input.string model.Source (dispatch << EditSource)
                attr.id "source"
                attr.placeholder "Source code"
                attr.classes ["textarea"; "has-text-white"; "has-background-dark"]
                attr.rows 25
            ] []
            tarea [
                attr.readonly true
                attr.placeholder "Output"
                attr.id "result"
                attr.rows 25
                attr.classes ["textarea"; "has-text-white"; "has-background-dark"]
            ] [text model.Dest]
        ]
    ]


type MyApp() =
    inherit ProgramComponent<Model, Msg>()

    [<Inject>]
    member val HttpClient = Unchecked.defaultof<HttpClient> with get, set

    override this.Program =
        let update = update this.JSRuntime
        let view = view this.JSRuntime
        Program.mkProgram (fun _ -> initModel) update view
