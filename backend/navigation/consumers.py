import json
import time
from objectml.check import main,check

from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        if(text_data=='start detection'):
            print(text_data)
            main()
            
        