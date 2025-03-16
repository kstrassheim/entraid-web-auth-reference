from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from os import environ as os_environ;

class LoginItem(BaseModel):
    message: str

auth_router = APIRouter()

# Send Client Id and Tenant Id to frontend for Entra Authentication
@auth_router.get("/entra-config")
async def get_entra_config():
    clientid = os_environ.get("WEB_CLIENT_ID")
    tenantid = os_environ.get("TENANT_ID")
    return {"client_id": os_environ.get("WEB_CLIENT_ID"), "tenant_id": os_environ.get("TENANT_ID")}