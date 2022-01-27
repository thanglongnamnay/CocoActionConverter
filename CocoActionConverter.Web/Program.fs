open System
open System.Net
open System.Text
open System.IO
 
// Modified from http://sergeytihon.wordpress.com/2013/05/18/three-easy-ways-to-create-simple-web-server-with-f/
// download this file to your root directory and name as ws.fsx
// run with `fsi --load:ws.fsx`
// visit http://localhost:8080
 
let siteRoot = @"."
let defaultFile = "index.html"
let host = "http://*:8080/"
 
let listener (handler:(HttpListenerRequest->HttpListenerResponse->Async<unit>)) =
    let hl = new HttpListener()
    hl.Prefixes.Add host
    hl.Start()
    let task = Async.FromBeginEnd(hl.BeginGetContext, hl.EndGetContext)
    async {
        while true do
            let! context = task
            Async.Start(handler context.Request context.Response)
    } |> Async.Start
 
let getFileNameWithDefault (req:HttpListenerRequest) = 
    let relPath = Uri(host).MakeRelativeUri(req.Url).OriginalString
    if (String.IsNullOrEmpty(relPath))
    then Path.Combine(siteRoot, defaultFile)
    else Path.Combine(siteRoot, relPath)

listener (fun req resp ->
    async {
        let body = req.InputStream
        let reader = new StreamReader(body)
        if (req.HttpMethod = "GET")
        then
            let output = File.ReadAllText("res/index.html")
            let txt = Encoding.ASCII.GetBytes(output)
            resp.ContentType <- "text/html"         
            resp.OutputStream.Write(txt, 0, txt.Length)
            resp.OutputStream.Close()
        else
            resp.ContentType <- "text/plain"
            let str = reader.ReadToEnd()
            let parseResult = CocoActionConverter.Parser.run str
            let bytes = Encoding.UTF8.GetBytes(parseResult)
            let! r = Async.AwaitTask (resp.OutputStream.WriteAsync(bytes, 0, bytes.Length))
            body.Close()
            reader.Close()
            resp.OutputStream.Close()
    })


Console.ReadKey() |> ignore
