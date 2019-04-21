
function initws(){
  // 웹소켓 전역 객체 생성
  var ws = new WebSocket("ws://imnotkind.tk:3081");

  // 연결이 수립되면 서버에 메시지를 전송한다
  ws.onopen = function(event) {
    ws.send("Client message: Hi!");
  }

  // 서버로 부터 메시지를 수신한다
  ws.onmessage = function(event) {
    console.log("Server message: ", event.data);
  }

  // error event handler
  ws.onerror = function(event) {
    console.log("Server error message: ", event.data);
  }
}


function initpixi(){
  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  PIXI.utils.sayHello(type)

  //Create a Pixi Application
  let app = new PIXI.Application({width: 256, height: 256});

  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);
}

initws();
initpixi();