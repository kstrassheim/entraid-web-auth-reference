from fastapi import FastAPI, APIRouter, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pathlib import Path
# load environment variables
from dotenv import load_dotenv
load_dotenv()
# get routers
from api import api_router
from auth import auth_router
from common import azure_scheme
# Init FastAPI
app = FastAPI()
origins = ["http://localhost:5173", "localhost:5173"]
app.add_middleware(CORSMiddleware,allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Register Auth Router
app.include_router(auth_router, prefix="/auth")

# Register API Router
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


@app.get("/protected")
async def protected_route(token=Security(azure_scheme, scopes=["user_impersonation"])):
    return {"message": "Access granted"}

# On startup, load the OpenID configuration (optional but recommended)
from common import azure_scheme
@app.on_event("startup")
async def startup_event():
    await azure_scheme.openid_config.load_config()

# Bootstrap the app
if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)