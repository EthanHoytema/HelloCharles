const express = require("express");
const fs = require("fs");

const server = express();

function readEchoes(){
    const data = fs.readFileSync("PreviousInputs.json");
    let revisedData = JSON.parse(""+data);
    return revisedData
}

function htmlTable(jsonData) {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Previous Inputs</title>
            <style>
                td { border: 1px black solid; }
            </style>
        </head>
        <body>
        
        <table>
            <tr>
                <td>A message</td>
                <td>Timestamp</td>
            </tr>
    `;
    for(const message of jsonData){
        html +=
            `<tr>
                <td>`+message.message+`</td>
                <td>`+message.timestamp+`</td>
            </tr>
        `;
    }
    html += `
        </table>
        </body>
        </html>
    `;
    return html;
}



function recordEcho(input) {
    const time = new Date().toString();
    const messageData = {
        message: input,
        timestamp: time
    };
    const echoes = readEchoes();
    echoes.push(messageData);
    fs.writeFileSync("PreviousInputs.json",JSON.stringify(echoes, null, 4));
}

function blankRouteHandler(req,res){
    res.send("Options: echo previousinputs");
}

function echoRouteHandler(req,res) {
    const message = req.params.message;
    res.send(message);
    recordEcho(message)
}

function previousInputsRouteHandler(req,res) {
    const htmlTableEchoes = htmlTable(readEchoes());
    res.send(htmlTableEchoes);
}

// register route handlers
server.get("/",blankRouteHandler);
server.get("/echo/:message",echoRouteHandler);
server.get("/previousinputs", previousInputsRouteHandler);

server.listen(8080, function () {
    console.log("listening");
});