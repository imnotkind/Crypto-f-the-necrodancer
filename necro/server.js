const express  = require("express");
const session = require('express-session');
const fs = require("fs")
const url = require("url");
const nconf = require("nconf");
const ws = require("ws");
const mustache = require("mustache");
const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongo')(session);

const MongoUrl = 'mongodb://mongo:27017/mydb';
var db_client;
var res;


let initdb = async () => {
  db_client = await MongoClient.connect(MongoUrl);
  if(!db_client) throw db_client;
  console.log("Database created", db_client);


  //res = await db_client.createCollection("game");
  //if(!res) throw res;
  //console.log("Collection created", res);

  var game = db_client.db().Collection("game");
  console.log(game);

  res = await game.insertOne({username:"haebin", logged_in:false, time: 0})
  if(!res) throw res;
  console.log("1 document inserted", res);


}

let initws = async () => {
  var WebSocketServer = ws.Server;
  var wss = new WebSocketServer({ port: 3081 });

  // 연결이 수립되면 클라이언트에 메시지를 전송하고 클라이언트로부터의 메시지를 수신한다
  wss.on("connection", function(ws) {
    ws.send("Hello! I am a server.");
    ws.on("message", function(message) {
      console.log("Received: %s", message);
    });
  });
}


let start = async() => {
  
  initdb();
  initws();

  let app = express();

  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: MongoUrl,
      collection: "sessions"
    })
  }));

  app.use(express.static('static'));
  
  app.get("/", (req, res) => {
    
    if(!req.session.num) {
      req.session.num = 1;
    } else {
      req.session.num += 1;
    }

    let view = {
      title: "GAME",
      head : "NUM : "+req.session.num,
    }

    let template = fs.readFileSync('./static/index.html', 'utf8');
    console.log(template)
    let output = mustache.to_html(template, view);
    console.log(output)
    res.send(output);

  })


	app.listen(3080,"0.0.0.0",() => console.log('listening'));
};



start();