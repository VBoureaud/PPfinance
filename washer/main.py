from fastapi import FastAPI

from fastapi_utils.session import FastAPISessionMaker
from fastapi_utils.tasks import repeat_every

import colors

app = FastAPI()


@app.get("/")
async def get_colors():
    return colors.token_color_map


@app.on_event("startup")
@repeat_every(seconds=15)  # 1 hour
def update_colors() -> None:
    r1, r2 = colors.send_multicall()
    colors.parse_rgb(r1, r2)
