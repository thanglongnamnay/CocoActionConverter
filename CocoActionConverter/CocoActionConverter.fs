// Copyright Fabulous contributors. See LICENSE.md for license.
namespace CocoActionConverter

open System.Diagnostics
open Fabulous
open Fabulous.XamarinForms
open Fabulous.XamarinForms.LiveUpdate
open Xamarin.Forms
open FParsec

module App = 
    type Model = {
        Source: string
        Dest: string
    }

    type Msg =
        | EditComplete of string
        | Convert

    let initModel = { Source = ""; Dest = "" }

    let init () = initModel, Cmd.none
    
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

    let pRaw = CharParsers.many1CharsTill CharParsers.anyChar (CharParsers.eof :: (actions |> List.map CharParsers.followedByStringCI) |> choice)
    let pAction = AstParser.parser |>> AstCompiler.compile
    let parser = [pAction; pRaw] |> choice |> many

    let rec update msg model =
        match msg with
        | EditComplete str ->
            update Convert {model with Source = str}
        | Convert ->
            let result = CharParsers.run parser model.Source
            System.Console.Write "result: "
            System.Console.WriteLine result
            match result with
            | Success(strList, _, _) ->
                let text = (strList |> String.concat "")
                TextCopy.ClipboardService.SetTextAsync text |> ignore
                {model with Dest = text}, Cmd.none
            | Failure _ ->
                {model with Dest = result.ToString()}, Cmd.none
             
    let view (model: Model) dispatch =
        View.ContentPage(
          content = View.StackLayout(padding = Thickness 20.0, verticalOptions = LayoutOptions.Center,
            children = [
                View.Editor(
                    text = model.Source,
                    completed = (fun text -> dispatch (EditComplete text)),
                    height = 300.0,
                    fontSize = FontSize.fromValue 32.0)
                View.Button(
                    text = "Convert",
                    command = (fun () -> dispatch Convert),
                    fontSize = FontSize.fromValue 32.0)
                View.Editor(
                    text = model.Dest,
                    isReadOnly = true,
                    height = 300.0,
                    fontSize = FontSize.fromValue 32.0)
            ]))

    // Note, this declaration is needed if you enable LiveUpdate
    let program =
        XamarinFormsProgram.mkProgram init update view
//#if DEBUG
//        |> Program.withConsoleTrace
//#endif

type App () as app = 
    inherit Application ()

    let runner = 
        App.program
        |> XamarinFormsProgram.run app

#if DEBUG
    // Uncomment this line to enable live update in debug mode. 
    // See https://fsprojects.github.io/Fabulous/Fabulous.XamarinForms/tools.html#live-update for further  instructions.
    //
    //do runner.EnableLiveUpdate()
#endif    

    // Uncomment this code to save the application state to app.Properties using Newtonsoft.Json
    // See https://fsprojects.github.io/Fabulous/Fabulous.XamarinForms/models.html#saving-application-state for further  instructions.
#if APPSAVE
    let modelId = "model"
    override __.OnSleep() = 

        let json = Newtonsoft.Json.JsonConvert.SerializeObject(runner.CurrentModel)
        Console.WriteLine("OnSleep: saving model into app.Properties, json = {0}", json)

        app.Properties.[modelId] <- json

    override __.OnResume() = 
        Console.WriteLine "OnResume: checking for model in app.Properties"
        try 
            match app.Properties.TryGetValue modelId with
            | true, (:? string as json) -> 

                Console.WriteLine("OnResume: restoring model from app.Properties, json = {0}", json)
                let model = Newtonsoft.Json.JsonConvert.DeserializeObject<App.Model>(json)

                Console.WriteLine("OnResume: restoring model from app.Properties, model = {0}", (sprintf "%0A" model))
                runner.SetCurrentModel (model, Cmd.none)

            | _ -> ()
        with ex -> 
            App.program.onError("Error while restoring model found in app.Properties", ex)

    override this.OnStart() = 
        Console.WriteLine "OnStart: using same logic as OnResume()"
        this.OnResume()
#endif


