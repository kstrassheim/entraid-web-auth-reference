import jwt 
from fastapi import APIRouter, Security, HTTPException#, Depends, HTTPException, Header
from common import azure_scheme
import logging

logging.basicConfig(level=logging.DEBUG)

api_router = APIRouter()

# Validate if user is in specific role
def check_user_roles(token, required_roles):
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or invalid")
    roles = getattr(token, "roles", None)
    if roles is None:
        raise HTTPException(status_code=403, detail="Roles are missing in the token")
    
    if not any(role in roles for role in required_roles):
        raise HTTPException(status_code=403, detail="You do not have access to this resource")

@api_router.get("/user-data")
async def read_hello(token=Security(azure_scheme, scopes=["user_impersonation"])):
    return {"message": "Hello from API"}


@api_router.get("/admin-data")
async def read_admin(token=Security(azure_scheme, scopes=["user_impersonation"])):
    check_user_roles(token, ["Admin"])
    return {"message": "Hello Admin"}