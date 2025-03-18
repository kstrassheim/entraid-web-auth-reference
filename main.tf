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
}

output "web_url" {
  value = "https://${azurerm_linux_web_app.web.default_hostname}"
  description = "The URL of the deployed web app"
}