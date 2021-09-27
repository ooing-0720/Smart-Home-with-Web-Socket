//ip만 바꾸면 됨
var wsUri = "ws://192.168.35.235:3001";
var output;
var aircon_switch = false;
var window_status = true;
var light1_status = true;
var light2_status = false;


function init()
{
  output = document.getElementById("status");
  testWebSocket();
}

function testWebSocket()
{
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) //처음 연결 됬을 때 호출
{
  // writeToScreen("CONNECTED");
  var message = {
    "msg_type" : "request"
  };
  
  websocket.send(JSON.stringify(message));
}

function onClose(evt) //닫을 때 호출
{
  // writeToScreen("DISCONNECTED");
}

function onMessage(evt) //서버한테서 메시지 받으면 호출
{
  var message = JSON.parse(evt.data);
  if(message.msg_type == "status"){ //메시지타입 status인 것만 받음
    document.getElementById('room_status').innerHTML = '<h4>실내 온도: ' + message.temp + '<br>실내습도: ' + message.humi + '<h4>';
    
    if(message.aircon_onoff == "on" && aircon_switch == false){
      $("#ts").attr("checked", true); //스위치 속성 변경
      document.getElementById("on").style.display = "block"; //on off 글자 바꾸기
      document.getElementById("off").style.display = "none";
      aircon_switch = true;
    }
    else if(message.aircon_onoff == "off" && aircon_switch == true){
      $("#ts").attr("checked", false);
      document.getElementById("on").style.display = "none";
      document.getElementById("off").style.display = "block";
      aircon_switch = false;
    }

    if(message.window == "close"){
      $('.living_window').append(`<img src="image/window.png" style="width: 10vw; height: 10vw;">`);
      $('.room_window').append(`<img src="image/window.png" style="width: 10vw; height: 10vw;">`);

    }
    else if(message.window == "open"){
      $('.living_window').append(`<img src="image/windows.png" style="width: 10vw; height: 10vw;">`);
      $('.room_window').append(`<img src="image/windows.png" style="width: 10vw; height: 10vw;">`);
    }
  
    if(message.light1 == "on"){
      $('.living_light').append(`<i class="fas fa-lightbulb fa-6x" style="color:orange;"></i>`);
    }
    else if(message.light1 == "off"){
      $('.living_light').append(`<i class="fas fa-lightbulb fa-6x"></i>`);
    }
  
    if(message.light2 == "on"){
      $('.room_light').append(`<i class="fas fa-lightbulb fa-6x" style="color:orange;"></i>`);
    }
    else if(message.light2 == "off"){
      $('.room_light').append(`<i class="fas fa-lightbulb fa-6x"></i>`);
    }
  }

}

function onError(evt)
{
  writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

// 이 코드 비슷하게 이용해서 버튼에 onclick 달아서 버튼 누르면 1) on<->off 변경 2) 서버에 바뀐 값 전달 
function doSend(element)
{
  if(element.checked == true){ //에어컨 스위치 눌렀을 때 on이면 on 명령 보냄
    aircon_switch = true;
    var message = {
      "msg_type" : "command",
      "device_id" : "aircon",
      "command" : "on"
    };
  }
  else{
    aircon_switch = false;
    var message = {
      "msg_type" : "command",
      "device_id" : "aircon",
      "command" : "off"
    };
  }
  websocket.send(JSON.stringify(message)); //서버에 메시지 전송
}

function windowcontrol(){
  if(window_status == true){
    document.getElementById('living_window').innerHTML = `<img src="image/window.png" style="width: 10vw; height: 10vw;">`;
    document.getElementById('room_window').innerHTML = `<img src="image/window.png" style="width: 10vw; height: 10vw;">`;
    
    window_status = false;
    var message = {
      "msg_type" : "command",
      "device_id" : "lightwindow",
      "command" : "close"
    };
    websocket.send(JSON.stringify(message))
  }
  else{
    document.getElementById('living_window').innerHTML = `<img src="image/windows.png" style="width: 10vw; height: 10vw;">`;
    document.getElementById('room_window').innerHTML = `<img src="image/windows.png" style="width: 10vw; height: 10vw;">`;

    window_status = true;
    var message = {
      "msg_type" : "command",
      "device_id" : "lightwindow",
      "command" : "open"
    };

  }
  websocket.send(JSON.stringify(message)); //서버에 메시지 전송
}

function light1control(){
  if(light1_status == true){
    document.getElementById('living_light').innerHTML = `<i class="fas fa-lightbulb fa-6x"></i>`;

    light1_status = false;
    var message = {
      "msg_type" : "command",
      "device_id" : "lightwindow",
      "command" : "light1:off"
    };
  }
  else{
    document.getElementById('living_light').innerHTML = `<i class="fas fa-lightbulb fa-6x" style="color:orange;"></i>`;

    light1_status = true;
    var message = {
      "msg_type" : "command",
      "device_id" : "lightwindow",
      "command" : "light1:on"
    };

  }
  websocket.send(JSON.stringify(message)); //서버에 메시지 전송
}

function light2control(){
  if(light2_status == true){
    document.getElementById('room_light').innerHTML = `<i class="fas fa-lightbulb fa-6x"></i>`;

    light2_status = false;
    var message = {
      "msg_type" : "command",
      "device_id" : "lightwindow",
      "command" : "light2:off"
    };
  }
  else{
    document.getElementById('room_light').innerHTML = `<i class="fas fa-lightbulb fa-6x" style="color:orange;"></i>`;

    light2_status = true;
    var message = {
      "msg_type" : "command",
      "device_id" : "lightwindow",
      "command" : "light2:on"
    };

  }
  websocket.send(JSON.stringify(message)); //서버에 메시지 전송
}

function writeToScreen(message)
{
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  output.appendChild(pre);
}

// Notification code will be put here

window.addEventListener("load", init, false);