import pygame

# Инициализация Pygame
pygame.init()
pygame.joystick.init()

# Получение списка подключенных джойстиков
joysticks = [pygame.joystick.Joystick(x) for x in range(pygame.joystick.get_count())]
for joystick in joysticks:
    joystick.init()
    print(f"Found joystick: {joystick.get_name()}")

# Основной игровой цикл
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.JOYBUTTONDOWN:
            print(f"Button {event.button} pressed on joystick {event.joy}")
        if event.type == pygame.JOYAXISMOTION:
            a=list({event.axis})
            print(a[0])
        if event.type == pygame.JOYHATMOTION:
            print(f"Hat {event.hat} moved on joystick {event.joy} to {event.value}")

    # Обновление экрана (если нужно)
    # pygame.display.flip()  # Пример обновления экрана

# Завершение работы
pygame.quit()