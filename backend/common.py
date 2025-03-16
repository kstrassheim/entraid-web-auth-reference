from os import environ as os_environ, path as os_path
from dotenv import load_dotenv
from fastapi_azure_auth.auth import SingleTenantAzureAuthorizationCodeBearer
load_dotenv()
WEB_CLIENT_ID = os_environ.get("WEB_CLIENT_ID")
TENANT_ID = os_environ.get("TENANT_ID")

azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=WEB_CLIENT_ID,  # API’s client ID from Entra
    tenant_id=TENANT_ID,
    scopes={f"api://${TENANT_ID}/user_impersonation": "user_impersonation"},
)