import socket
import pygame


msgFromClient       = "Hello UDP Server"
bytesToSend         = str.encode(msgFromClient)
serverAddressPort   = ("10.42.0.1", 5000)
bufferSize          = 1024

pygame.init()
pygame.joystick.init()

# Получение списка подключенных джойстиков
joysticks = [pygame.joystick.Joystick(x) for x in range(pygame.joystick.get_count())]
for joystick in joysticks:
    joystick.init()
    print(f"Found joystick: {joystick.get_name()}")

# Create a UDP socket at client side
UDPClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
while True:
    for event in pygame.event.get():
        if event.type == pygame.JOYAXISMOTION:
            print(event.axis)
            a =list({event.axis})

            UDPClientSocket.sendto(str.encode(str(a[0])+": " +str(event.value)), serverAddressPort)
            #UDPClientSocket.sendto(bytesToSend, serverAddressPort)
            #print(str(a[0])+": {event.value}")
    # Send to server using created UDP socket
    #UDPClientSocket.sendto(bytesToSend, serverAddressPort)
            msgFromServer = UDPClientSocket.recvfrom(bufferSize)

            msg = "Message from Server {}".format(msgFromServer[0])
            print(msg)
pygame.quit()