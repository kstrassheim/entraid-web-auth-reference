import jwt 
from fastapi import APIRouter, Security, Depends, HTTPException, Header
from common import azure_scheme
import logging
logger = logging.getLogger("custom_security")
logging.basicConfig(level=logging.DEBUG)

api_router = APIRouter()
# azure_decoder = SingleTenantAzureAuthorizationCodeBearer(
#     app_client_id=web_client_id,
#     tenant_id=tenantid,
#     scopes={"api://6a8e74ac-e0e1-429b-9ac1-8135042f973d/user_impersonation": "user_impersonation"},
# )
async def guest_allowing_security(authorization: str = Header(...)):
    """
    Custom dependency that decodes a bearer token and allows guest users.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    try:
        # Instead of verify_jwt_token (which runs the full checks and may reject guest users),
        # use decode_jwt_token to simply decode the token and look at its claims.
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        validated = await azure_scheme.validate_token(token)
       
        logger.debug("Decoded token: %s", decoded_token)
        if decoded_token.get("userType", "").lower() == "guest":
            logger.info("Guest user detected – allowing access.")
        return decoded_token
    except Exception as e:
        logger.error("Error decoding token: %s", e)
        raise HTTPException(status_code=403, detail="Token validation failed")

@api_router.get("/data")
def read_hello(token=Security(azure_scheme, scopes=["api://6a8e74ac-e0e1-429b-9ac1-8135042f973d/user_impersonation"])):
    return {"message": "Hello from API"}