from os import environ as os_environ, path as os_path
from fastapi_azure_auth.auth import SingleTenantAzureAuthorizationCodeBearer
import json

tfconfig = None
with open("terraform.config.json", "r") as config_file:
    tfconfig = json.load(config_file)
# define scope to use in the API   
scopes = [tfconfig["oauth2_permission_scope"]["value"]]
azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=tfconfig["client_id"]["value"],  
    tenant_id=tfconfig["tenant_id"]["value"], 
    scopes={tfconfig["oauth2_permission_scope_uri"]["value"]: tfconfig["oauth2_permission_scope"]["value"]},
    allow_guest_users=True
)