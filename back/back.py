from fastapi import Depends, FastAPI, WebSocket
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import socket
import pygame
#import webscokets

app = FastAPI()

t=0
if(t==0):
    pygame.init()
    pygame.joystick.init()
    t=t+1

# Получение списка подключенных джойстиков
joysticks = [pygame.joystick.Joystick(x) for x in range(pygame.joystick.get_count())]
for joystick in joysticks:
    joystick.init()
    print(f"Found joystick: {joystick.get_name()}")

'''
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Вы сказали: {data}")
'''
axis = {"0":0.,"1":0.,"2":0.,"3":0.}
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
    for event in pygame.event.get():
        if event.type == pygame.JOYAXISMOTION:
            a =list({event.axis})
            axis[str(a[0])]={event.value}
    return axis
#    return {"info": metr}


# Основной игровой цикл
#running = True
#while running:
# Завершение работы
#pygame.quit()