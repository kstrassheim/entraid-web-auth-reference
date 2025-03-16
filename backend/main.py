from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pathlib import Path
# Init FastAPI
app = FastAPI()
origins = ["http://localhost:5173", "localhost:5173"]
app.add_middleware(CORSMiddleware,allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# API Router
api_router = APIRouter()
@api_router.get("/hello")
def read_hello():
    return {"message": "Hello from API"}
app.include_router(api_router, prefix="/api")

# Frontend Router
dist = Path("./dist")
frontend_router = APIRouter()
@frontend_router.get('/{path:path}')
async def frontend_handler(path: str):
    fp = dist / path
    if path == '' or not fp.exists():
        fp = dist / "index.html"
    return FileResponse(fp)
app.include_router(frontend_router, prefix="")

# Bootstrap the app
if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)