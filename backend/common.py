from os import environ as os_environ, path as os_path
from fastapi_azure_auth.auth import SingleTenantAzureAuthorizationCodeBearer

tenantid=os_environ.get("TENANT_ID")
web_client_id=os_environ.get("WEB_CLIENT_ID")
azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    # app_client_id=web_client_id,
    # tenant_id=tenantid, 
    # scopes={f"https://graph.microsoft.com/User.Read": "User.Read"},
    app_client_id=web_client_id,  
    tenant_id=tenantid, 
    scopes={"api://6a8e74ac-e0e1-429b-9ac1-8135042f973d/user_impersonation": "user_impersonation"},
    allow_guest_users=True
)