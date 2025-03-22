data "external" "graph_token" {
  program = [  
    "bash",
    "-c", 
    "az account get-access-token --resource 'https://graph.microsoft.com' --query '{accessToken: accessToken}' --output json"
    ]
}

data "http" "graph_permissions" {
  #url = "https://graph.microsoft.com/v1.0/servicePrincipals?\$filter=appId%20eq%20'00000003-0000-0000-c000-000000000000'&\$select=appRoles,oauth2PermissionScopes"
  url = "https://graph.microsoft.com/v1.0/servicePrincipals?&%24filter=appId%20eq%20'00000003-0000-0000-c000-000000000000'&&%24select=appRoles,oauth2PermissionScopes"  
  request_headers = {
    "Authorization" = "Bearer ${data.external.graph_token.result.accessToken}" #data.external.az_cli_token.result.accessToken}" ${var.token}"
    "Content-Type"  = "application/json"
  }
}

locals {
  # Azure AD Graph API permissions lookups
  graph_permissions =  jsondecode(data.http.graph_permissions.response_body)  #jsondecode(file("${path.module}/graph_permissions.json"))
  graph_permission_types = { "Delegated" ="Scope", "Application" = "Role" }
  # graph_app_permissions_lookup = { for role in flatten([  for obj in local.graph_permissions.value : obj.appRoles ]) : role.value => role.id }

  # # { for role in flatten([  for obj in local.graph_permissions.value : obj.appRoles ]) : (role.value) => role.id }
  # graph_app_permissions_lookup_rev = { for friendly, id in local.graph_app_permissions_lookup : id => friendly }
  # graph_user_permissions_lookup = merge(
  #   reverse([
  #     for role in flatten([
  #       for obj in local.graph_permissions.value : obj.oauth2PermissionScopes
  #     ]) : { (role.value) = role.id }
  #   ])...
  # )
  # graph_user_permissions_lookup_rev = { for friendly, id in local.graph_user_permissions_lookup : id => friendly }
}

# output "debug_os" {
#   value = data.external.os.result
# }

# output token {
#   value = data.external.graph_token.result.accessToken
# }

# output "debug_graph_permissions" {
#     value = distinct(compact(flatten([
#     for rra in local.graph_permissions.value : [
#       for ra in rra.oauth2PermissionScopes : ra.value == "Scope" ? lookup(local.graph_user_permissions_lookup_rev, ra.id, "unknown") : null
#     ]
#   ])))
# }

output "debug_graph_output" {
    value = jsondecode(data.http.graph_permissions.response_body)
}

# output "debug_user_permissions_lookup" {
#   value = local.graph_user_permissions_lookup
# }

# output "debug_app_permissions_lookup" {
#   value = local.graph_app_permissions_lookup
# }