from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

class LoginItem(BaseModel):
    message: str

auth_router = APIRouter()
@auth_router.post("/login")
async def login(loginitem: LoginItem):
    data = jsonable_encoder(loginitem)
    return {"token": "ABCDEF", "data": data}

@auth_router.post("/logout")
async def login():
    return {"message": 'Loggout ok'}