import jwt 
from fastapi import APIRouter, Security, HTTPException#, Depends, HTTPException, Header
from common import azure_scheme, scopes
import logging
import requests
from common import logger, tfconfig

api_router = APIRouter()

# Validate if user is in specific role
def check_user_roles(token, required_roles):
    logger.info("Role check - Checking roles for expected", required_roles)
    if not token:
        http_ex = HTTPException(status_code=401, detail="Token is missing or invalid")
        logger.error(http_ex)
        raise http_ex
    roles = getattr(token, "roles", None)
    if roles is None:
        http_ex = HTTPException(status_code=403, detail="Roles are missing in the token")
        logger.error(http_ex)
        raise http_ex
    
    if not any(role in roles for role in required_roles):
        http_ex = HTTPException(status_code=403, detail="You do not have access to this resource")
        raise http_ex
    logger.info("Role check - Role check successfull")

@api_router.get("/user-data")
async def get_user_data(token=Security(azure_scheme, scopes=scopes)):
    logger.info("User Api - Returning User data")
    return {"message": "Hello from API"}


@api_router.get("/admin-data")
async def get_admin_data(token=Security(azure_scheme, scopes=scopes)):

    check_user_roles(token, ["Admin"])
    logger.info("Admin API - Started gathering groups")
        # Extract the access token from the Security token
    access_token = getattr(token, "access_token") 
    logger.info("Admin API - Token received")
    # Define the Microsoft Graph API endpoint for getting all groups
    graph_api_endpoint = "https://graph.microsoft.com/v1.0/groups"

    # Set the headers for the request
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Make the request to the Microsoft Graph API
    logger.info("Admin API - Querying Graph API")
    response = requests.get(graph_api_endpoint, headers=headers)

    if response.status_code != 200:
        http_ex = HTTPException(status_code=response.status_code, detail="Failed to retrieve groups from Azure AD")
        logger.error(http_ex)
        raise http_ex

    logger.info("Admin API - Preparing response")
    groups = response.json()

    logger.info("Admin API - Returning response")
    return {"message": "Hello Admin", "groups": groups}