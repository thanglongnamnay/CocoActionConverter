namespace CocoActionConverter.Gtk

open System
open Xamarin.Forms
open Xamarin.Forms.Platform.GTK

module Main =
    [<EntryPoint>]
    let Main(args) =
        Gtk.Application.Init()
        Forms.Init()

        let app = new CocoActionConverter.App()
        let window = new FormsWindow()
        window.Maximize();
        window.LoadApplication(app)
        window.SetApplicationTitle("Coco Action Converter 1.0")
        window.Show();

        Gtk.Application.Run()
        0
