const express  = require("express");
const fs = require("fs")
const url = require("url");
const nconf = require("nconf");
const ws = require("ws");
const mustache = require("mustache");




let start = async() => {
  let app = express();
  
  app.get("/", (req, res) => {
    let view = {
      title: "GAME",
      calc: function () {
        return 2 + 4;
      }
    }

    let template = fs.readFileSync('./index.html', 'utf8');
    let output = mustache.to_html(template, view);
    res.send(output);

  })

  var WebSocketS = ws.Server;
  var wss = new WebSocketServer({ port: 2222 });

  // 연결이 수립되면 클라이언트에 메시지를 전송하고 클라이언트로부터의 메시지를 수신한다
  wss.on("connection", function(ws) {
    ws.send("Hello! I am a server.");
    ws.on("message", function(message) {
      console.log("Received: %s", message);
    });
  });

	

	app.listen(1111,"0.0.0.0",() => console.log('listening'));
};



start();