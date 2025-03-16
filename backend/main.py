from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from os import path as os_path



app = FastAPI()

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

api_router = APIRouter()

@api_router.get("/hello")
def read_hello():
    return {"message": "Hello from API"}

app.include_router(api_router, prefix="/api")

# @app.get("/{full_path:path}")
# def catch_all(full_path: str):
#     return FileResponse('./dist/index.html')

# Mount static files on /static (adjust if you want a different prefix)
#app.mount("/{full_path:path}", StaticFiles(directory="./dist", html=True), name="client")
router = APIRouter()
@router.get('/{path:path}')
async def frontend_handler(path: str):
    from pathlib import Path
    FRONTEND_DIST = Path("./dist")
    fp = FRONTEND_DIST  / path
    if not fp.exists():
        fp = FRONTEND_DIST / "index.html"
    return FileResponse(fp)
app.include_router(router, prefix="")

# Optional: Serve index.html at the root
# @app.get('/{full_path:path}')
# async def client(path: str):  
#     # if path.startswith("api"):
#     #     target_url = app.url_path_for("api:read_hello")
#     #     return RedirectResponse(url=target_url)
#     # else:
#     print(path)
#     return RedirectResponse(url="client")

if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)