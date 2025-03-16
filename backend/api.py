from fastapi import APIRouter

api_router = APIRouter()
@api_router.get("/data")
def read_hello():
    return {"message": "Hello from API"}