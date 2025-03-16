import jwt 
from fastapi import APIRouter, Security #, Depends, HTTPException, Header
from common import azure_scheme
import logging

logging.basicConfig(level=logging.DEBUG)

api_router = APIRouter()

@api_router.get("/data")
def read_hello(token=Security(azure_scheme, scopes=["user_impersonation"])):
    return {"message": "Hello from API"}