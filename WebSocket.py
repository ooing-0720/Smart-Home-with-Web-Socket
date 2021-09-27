from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import json

class SimpleChat(WebSocket):
    temp = "30"
    humi = "39"
    aircon_onoff = "on"
    light1 = "on"
    light2 = "off"
    window = "open"

    def handleMessage(self):   #메시지 받으면 실행됨
        json_data = json.loads(self.data)
        print(json_data)   #받은 메시지 출력
        #메시지타입
        #request: 웹페이지 요청
        #status: 웹페이지가 필요한 스마트홈 정보
        #command: 웹페이지->아두이노 명령
        if json_data['msg_type'] == 'request':
            responseString = '{"msg_type":"status", "device_id":"oled", "temp":"%s", "humi":"%s", "aircon_onoff" : "%s", "light1":"%s", "light2":"%s", "window":"%s"}'%(self.temp, self.humi, self.aircon_onoff, self.light1, self.light2, self.window)
            self.sendMessage(responseString) #모든 클라이언트에게 메시지 전송, 각 클라이언트에서 메시지 타입을 구별해서 필요 없는 메시지 거름
        elif json_data['msg_type'] == 'command':
                responseString = '{"msg_type":"command", "device_id":"%s", "command":"%s"}'%(json_data['device_id'], json_data['command'])
                print('Send', responseString)
                self.sendMessage(responseString)
                
    def handleConnected(self):   ##처음 연결 되면 실행됨
        print(self.address, 'connected')

    def handleClose(self):       #연결 끊기면 실행됨
        print(self.address, 'closed')

server = SimpleWebSocketServer('192.168.35.235', 3001, SimpleChat)  #ip만 바꾸면 댐
server.serveforever()  #서버 실행