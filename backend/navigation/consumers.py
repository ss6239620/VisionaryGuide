import json
import time
from objectml.ocr.ocr import extract_text_from_video_frame

from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        print(text_data)
        if(text_data=='start ocr'):
            value =  extract_text_from_video_frame()
            self.send(value)
            
        