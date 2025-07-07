from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, conint
import random
import uvicorn
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель для входящих данных
class UserData(BaseModel):
    user_text: str

@app.post("/api/data")
async def generate_data(data: UserData):
    random_num = random.randint(1, 100)
    print(f"{datetime.now()}: Получен текст '{data.user_text}', отправлено число {random_num}")
    return {
        "random_number": random_num,
        "received_text": data.user_text,
        "timestamp": datetime.now().isoformat()
    }
class SliderData(BaseModel):
    slider_name: str  
    value: conint(ge=-90, le=255)  
slider_states = {
    "slider1": 50,
    "slider2": 50
}
@app.post("/api/sliders")
async def update_slider(data: SliderData):
    # Проверяем, что слайдер существует
    if data.slider_name not in slider_states:
        raise HTTPException(status_code=400, detail="Неизвестный слайдер")
    slider_states[data.slider_name] = data.value
    print(f"Обновлено: {data.slider_name} = {data.value}")
    return {
        "status": "success",
        "message": f"Слайдер {data.slider_name} установлен на {data.value}",
        "current_state": slider_states
    }

@app.get("/api/sliders")
async def get_sliders():
    return slider_states

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)