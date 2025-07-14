'''
from fastapi import Depends, FastAPI, WebSocket
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
#import webscokets

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Вы сказали: {data}")
'''
'''
origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

cheb = {"battery":0,"altitude":0}

metr = {"led":0,"servo":0}

@app.get("/servo/{angle}")
async def servo(angle: int):
    metr["servo"]=angle
    return {"odom": cheb}

@app.get("/led/{value}")
async def led(value: int):
    metr["led"]=value
    return {"odom": cheb}

@app.get("/")
async def read_items():
    return {"info": metr}

import time

import roslibpy

import pygame
 
rc= [-1.,-1.,-1.,-1,0,0xFF,32767,0xFF]
# Инициализация Pygame
pygame.init()
pygame.joystick.init()

# Получение списка подключенных джойстиков
joysticks = [pygame.joystick.Joystick(x) for x in range(pygame.joystick.get_count())]
for joystick in joysticks:
    joystick.init()
    print(f"Found joystick: {joystick.get_name()}")


client = roslibpy.Ros(host='10.42.0.1', port=9090)#'192.168.1.1', port=9090)
client.run()

talker = roslibpy.Topic(client, '/geoscan/flight/rc', 'std_msgs/Float32MultiArray')

while client.is_connected:
    talker.publish(roslibpy.Message({'data' : rc}))
    for event in pygame.event.get():
        if event.type == pygame.JOYAXISMOTION:
            a=list({event.axis})
            if(a[0]<5):
                normalized_x = (event.value + 0.8346812341685232) / (0.8346812341685232 * 2)
                new_x = normalized_x * 2 - 1
                rc[a[0]]=new_x
    talker.publish(roslibpy.Message({'data' : rc}))
    print('Sending message...')
    #time.sleep(1)

talker.unadvertise()

client.terminate()
'''
import time
import roslibpy
import pygame

rc= [-1.,-1.,-1.,-1,0,0xFF,32767,0xFF]
# Инициализация Pygame
pygame.init()
pygame.joystick.init()

# Получение списка подключенных джойстиков
joysticks = [pygame.joystick.Joystick(x) for x in range(pygame.joystick.get_count())]
for joystick in joysticks:
    joystick.init()
    print(f"Found joystick: {joystick.get_name()}")


clock = pygame.time.Clock()  # создаём «таймер» от Pygame

client = roslibpy.Ros(host='10.42.0.1', port=9090)
client.run()
talker = roslibpy.Topic(client, '/geoscan/flight/rc', 'std_msgs/Float32MultiArray')

while client.is_connected:
    # Обработка событий
    for event in pygame.event.get():
        if event.type == pygame.JOYAXISMOTION and event.axis < 5:
            norm = (event.value + 0.8346812341685232) / (0.8346812341685232 * 2)
            rc[event.axis] = norm * 2 - 1

    # Публикация
    talker.publish(roslibpy.Message({'data': rc}))
    print('Sending message...')

    # Ограничиваем цикл до 100 итераций в секунду
    clock.tick(100)
