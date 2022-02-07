namespace CocoActionConverter.WPF

open System

open System.Windows
open Xamarin.Forms
open Xamarin.Forms.Platform.WPF

type MainWindow() =
    inherit FormsApplicationPage()

module Main =
    [<EntryPoint>]
    [<STAThread>]
    let main (_args) =

        let app = new System.Windows.Application()
        Forms.Init()
        let window = MainWindow()
        window.LoadApplication(new CocoActionConverter.App())
        window.Title <- "Coco Action Converter 1.0"
        window.WindowState <- WindowState.Maximized
        app.Run(window)
