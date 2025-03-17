import jwt 
from fastapi import APIRouter, Security, HTTPException#, Depends, HTTPException, Header
from common import azure_scheme
import logging
import requests

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
async def get_user_data(token=Security(azure_scheme, scopes=["user_impersonation"])):
    return {"message": "Hello from API"}


@api_router.get("/admin-data")
async def get_admin_data(token=Security(azure_scheme, scopes=["user_impersonation"])):
    check_user_roles(token, ["Admin"])
        # Extract the access token from the Security token
    access_token = getattr(token, "access_token") 

    # Define the Microsoft Graph API endpoint for getting all groups
    graph_api_endpoint = "https://graph.microsoft.com/v1.0/groups"

    # Set the headers for the request
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Make the request to the Microsoft Graph API
    response = requests.get(graph_api_endpoint, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to retrieve groups from Azure AD")

    groups = response.json()

    return {"message": "Hello Admin", "groups": groups}