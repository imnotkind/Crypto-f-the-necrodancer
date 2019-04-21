const express  = require("express");
const session = require('express-session');
const fs = require("fs")
const url = require("url");
const nconf = require("nconf");
const ws = require("ws");
const mustache = require("mustache");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongo')(session);

const MongoUrl = 'mongodb://mongo:27017/mydb';


let initdb = async () => {
  db_client = await MongoClient.connect(MongoUrl);
  if(!db_client) throw db_client;
  console.log("Database created");

  var game = db_client.db().collection("game"); //createcollection automatic
  console.log(game);

  res = await game.insertOne({username:"haebin", logged_in:false, time: 999})
  if(!res) throw res;
  console.log("1 document inserted");

  res = await game.findOne({'username':"haebin"})
  if(!res) throw res;
  console.log("found : ",res)
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
    secret: 'SUPER_DUPER_SECRET',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: MongoUrl,
      collection: "sessions"
    })
  }));

  app.use('/static', express.static('static'));
  
  app.get("/", (req, res) => {

    let view = {
      head : "POSITION : "+req.session.num,
    }

    let template = fs.readFileSync('./static/index.html', 'utf8');
    let output = mustache.to_html(template, view);
    res.send(output);

  })

  app.post("/start", (req, res) => {
    req.session.pos = 0
    req.session.time = moment().valueOf()
    res.send("start")
  })

  app.post("/pos", (req, res) => {
    let prev_pos = req.session.pos
    let curr_pos = req.query.pos
    let prev_time = req.session.time
    let curr_time = moment().valueOf()

    let response = {};
    response.info = {
      message: "",
      prev_pos: prev_pos,
      curr_pos: curr_pos,
      prev_time: prev_time,
      curr_time: curr_time,
    }

    if(Math.abs(curr_pos - prev_pos) != 1){
      response.status = "error"
      response.info.message = "invalid position"
      res.send(response)
    }
    else if(curr_time - prev_time > 1000){
      response.status = "error"
      response.info.message = "invalid timing"
      res.send(response)
    }
    else{
      req.session.pos = curr_pos;
      req.session.time = curr_time;

      if(curr_pos < 78){
        response.status = "ok"
        res.send(response)
      }
      else{
        response.status = "clear"
        response.info.message = "PLUS{CRYPTO_F**K_THE_NECRODANCER}"
        res.send(response)
      }
      
    }
  })


	app.listen(3080,"0.0.0.0",() => console.log('listening'));
};



start();