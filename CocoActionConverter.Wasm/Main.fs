module CocoActionConverter.Wasm.Client.Main

open System.Net.Http
open Microsoft.AspNetCore.Components
open Microsoft.JSInterop
open Elmish
open Bolero
open Bolero.Html

module ElmishCounter =
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

    // Note, this declaration is needed if you enable LiveUpdate
    let view (js: IJSRuntime) (model: Model) dispatch =
        div [] [
            textarea [
                bind.input.string model.Source (dispatch << EditSource)
                attr.style "width: 99%; height: 500px"
            ] []
            button [on.click (fun _ -> dispatch Convert)] [text "Convert"]
            button [
                on.click (fun _ -> js.InvokeVoidAsync("window.copyDest", [|model.Dest|]) |> ignore)
                attr.id "btnCopy"
            ] [text "Copy to Clipboard"]
            textarea [
                attr.readonly true
                attr.style "width: 99%; height: 500px"
                attr.id "result"
            ] [text model.Dest]
        ]


type MyApp() =
    inherit ProgramComponent<ElmishCounter.Model, ElmishCounter.Msg>()

    [<Inject>]
    member val HttpClient = Unchecked.defaultof<HttpClient> with get, set

    override this.Program =
        let update = ElmishCounter.update this.JSRuntime
        let view = ElmishCounter.view this.JSRuntime
        Program.mkProgram (fun _ -> ElmishCounter.initModel) update view
