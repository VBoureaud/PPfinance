from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi_utils.session import FastAPISessionMaker
from fastapi_utils.tasks import repeat_every

import colors
import database

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get_colors():
    pixels = database.getFirst()
    return {
        "pixels" : pixels
    }


@app.on_event("startup")
@repeat_every(seconds=15)  # 1 hour
def update_colors() -> None:
    r1, r2 = colors.send_multicall()
    colors.parse_rgb(r1, r2)
