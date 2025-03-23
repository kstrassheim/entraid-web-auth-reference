import jwt 
from fastapi import APIRouter, Security, HTTPException#, Depends, HTTPException, Header
from common import azure_scheme, scopes
import logging
import requests

logging.basicConfig(level=logging.DEBUG)

health_router = APIRouter()

