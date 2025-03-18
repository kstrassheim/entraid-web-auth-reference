data "azurerm_resource_group" "rg" {
  name = "entraid-web-auth-reference-dev"   // name of your resource group
}

// Create an App Service Plan (Linux)
resource "azurerm_service_plan" "plan" {
  name                = module.naming.app_service_plan.name_unique
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "web" {
  name                = replace(module.naming.app_service.name,"_","-")
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id
  site_config {
    always_on = false # in free version, always_on is not supported
    application_stack {
        python_version = "3.12"
    }
    # Startup command for FASTAPI
    app_command_line  = "gunicorn --worker-class uvicorn.workers.UvicornWorker --timeout 600 --access-logfile '-' --error-logfile '-' main:app"
  }

  # Add the telemetry instrumentation key as an app setting
  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.log.instrumentation_key
  }
}

resource "azurerm_application_insights" "log" {
  name                = module.naming.application_insights.name_unique
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  application_type    = "web"
}

data "azuread_client_config" "current" {}

resource "azuread_application" "reg" {
  display_name     = "${replace(var.app_name, "_", "-")}-${var.env}"
  identifier_uris  = ["api://example-app"]
  logo_image       = filebase64("${path.module}/frontend/src/assets/logo.png")
  owners           = [data.azuread_client_config.current.object_id]
  sign_in_audience = "AzureADMyOrg"

  api {
    mapped_claims_enabled          = true
    requested_access_token_version = 2

    # known_client_applications = [
    #   azuread_application.known1.client_id,
    #   azuread_application.known2.client_id,
    # ]

    oauth2_permission_scope {
      admin_consent_description  = "Allow the application to access the backend on behalf of the signed-in user."
      admin_consent_display_name = "Backend Access"
      enabled                    = true
      id                         = "96183846-204b-4b43-82e1-5d2222eb4b9b"
      type                       = "User"
      user_consent_description   = "Allow the application to access backend on your behalf."
      user_consent_display_name  = "Backend Access"
      value                      = "user_impersonation"
    }

    oauth2_permission_scope {
      admin_consent_description  = "Administer the application"
      admin_consent_display_name = "Administer"
      enabled                    = true
      id                         = "be98fa3e-ab5b-4b11-83d9-04ba2b7946bc"
      type                       = "Admin"
      value                      = "administer"
    }
  }

  app_role {
    allowed_member_types = ["User", "Application"]
    description          = "Admins can manage roles and perform all task actions"
    display_name         = "Admin"
    enabled              = true
    id                   = "1b19509b-32b1-4e9f-b71d-4992aa991967"
    value                = "admin"
  }

  app_role {
    allowed_member_types = ["User"]
    description          = "ReadOnly roles have limited query access"
    display_name         = "ReadOnly"
    enabled              = true
    id                   = "497406e4-012a-4267-bf18-45a1cb148a01"
    value                = "User"
  }

#   feature_tags {
#     enterprise = true
#     gallery    = true
#   }

#   optional_claims {
#     access_token {
#       name = "myclaim"
#     }

#     access_token {
#       name = "otherclaim"
#     }

#     id_token {
#       name                  = "userclaim"
#       source                = "user"
#       essential             = true
#       additional_properties = ["emit_as_roles"]
#     }

#     saml2_token {
#       name = "samlexample"
#     }
#   }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph

    resource_access {
      id   = "df021288-bdef-4463-88db-98f22de89214" # User.Read.All
      type = "Role"
    }

    resource_access {
        id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # Group.Read.All
        type = "Role"
    }
  }

  web {
    homepage_url  = "https://${azurerm_linux_web_app.web.default_hostname}"
    logout_url    = "https://${azurerm_linux_web_app.web.default_hostname}"

    # Add the local dev uris here 8000 for FASTAPI Backend and 5173 for Vite/React Frontend
    redirect_uris = var.env == "dev" ? ["http://localhost:8000/", "http://localhost:5173/"] : []

    implicit_grant {
      access_token_issuance_enabled = false
      id_token_issuance_enabled     = false
    }
  }
}

resource "azuread_service_principal" "enterprise" {
  client_id = azuread_application.reg.client_id
}

output "web_url" {
  value = "https://${azurerm_linux_web_app.web.default_hostname}"
  description = "The URL of the deployed web app"
}

output "instrumentation_key" {
  value = azurerm_application_insights.log.instrumentation_key
  sensitive = true
}

output "client_id" {
  description = "The Client ID for logon"
  value       = azuread_application.reg.client_id
}

output "tenant_id" {
  description = "The Tenant for the logon"
  value       =  azuread_service_principal.enterprise.application_tenant_id
}

# resource "local_file" "outputs_json" {
#   content = jsonencode({
#     web_url              = "https://${azurerm_linux_web_app.web.default_hostname}"
#     instrumentation_key  = azurerm_application_insights.log.instrumentation_key
#     client_id            = azuread_application.reg.client_id
#     tenant_id            = azuread_service_principal.enterprise.application_tenant_id
#   })
#   filename = "${path.module}/terraform_output.json"
# }