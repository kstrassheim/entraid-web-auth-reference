locals {

  azure_app_permission_types = {
    "Delegated" ="Scope"
    "Application" = "Role" 
  }

  #azure_app_permissions_rev = { for friendly, id in local.azure_app_permissions : id => friendly }

  graph_permissions = jsondecode(file("${path.module}/graph_permissions.json"))

  # Generate a lookup dictionary: key is the permission id, value is the allowedMemberTypes.
  app_permissions_lookup = {
    for role in flatten([
      for obj in local.graph_permissions.value : obj.appRoles
    ]) : role.value => role.id #if lookup(role, "allowedMemberTypes", null) != null && contains(lookup(role, "allowedMemberTypes", []), "Application")
  }

  app_permissions_lookup_rev = { for friendly, id in local.app_permissions_lookup : id => friendly }

  user_permissions_lookup = {
    for role in flatten([
      for obj in local.graph_permissions.value : obj.oauth2PermissionScopes
    ]) : role.value => role.id # if lookup(role, "type", null) == "User" # contains(role.allowedMemberTypes, "Application")
  }

  user_permissions_lookup_rev = { for friendly, id in local.user_permissions_lookup : id => friendly }

  # A lookup mapping from resource access IDs to friendly names for Microsoft Graph permissions.
  # azure_app_permissions = {
  #     "AccessReview.Read.All"             = "d07a8cc0-3d51-4b77-b3b0-32704d1f69fa",
  #     "AccessReview.ReadWrite.All"       = "ef5f7d5c-338f-44b0-86c3-351f46c8bb5f",
  #     "AccessReview.ReadWrite.Membership"= "18228521-a591-40f1-b215-5fad4488c117",
  #     "Acronym.Read.All"                 = "8c0aed2c-0c61-433d-b63c-6370ddc73248",
  #     "AdministrativeUnit.Read.All"      = "134fd756-38ce-4afd-ba33-e9623dbe66c2",
  #     "AdministrativeUnit.ReadWrite.All" = "5eb59dd3-1da2-4329-8733-9dabdc435916",
  #     "Agreement.Read.All"               = "2f3e6f8c-093b-4c57-a58b-ba5ce494a169",
  #     "Agreement.ReadWrite.All"         = "c9090d00-6101-42f0-a729-c41074260d47",
  #     "AgreementAcceptance.Read"        = "0b7643bb-5336-476f-80b5-18fbfbc91806",
  #     "AgreementAcceptance.Read.All"    = "d8e4ec18-f6c0-4620-8122-c8b1f2bf400e",
  #     "AiEnterpriseInteraction.Read"     = "859cceb9-2ec2-4e48-bcd7-b8490b5248a5",
  #     "AiEnterpriseInteraction.Read.All" = "839c90ab-5771-41ee-aef8-a562e8487c1e",
  #     "Analytics.Read"                  = "e03cf23f-8056-446a-8994-7d93dfc8b50e",
  #     "APIConnectors.Read.All"          = "b86848a7-d5b1-41eb-a9b4-54a4e6306e97",
  #     "APIConnectors.ReadWrite.All"     = "1dfe531a-24a6-4f1b-80f4-7a0dc5a0a171",
  #     "AppCatalog.Read.All"             = "e12dae10-5a57-4817-b79d-dfbec5348930",
  #     "AppCatalog.ReadWrite.All"        = "dc149144-f292-421e-b185-5953f2e98d7f",
  #     "AppCatalog.Submit"               = "3db89e36-7fa6-4012-b281-85f3d9d9fd2e",
  #     "AppCertTrustConfiguration.Read.All"   = "af281d3a-030d-4122-886e-146fb30a0413",
  #     "AppCertTrustConfiguration.ReadWrite.All" = "4bae2ed4-473e-4841-a493-9829cfd51d48",
  #     "Application.Read.All"            = "9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30",
  #     "Application.ReadWrite.All"       = "1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9",
  #     "Application.ReadWrite.OwnedBy"   = "18a4783c-866b-4cc7-a460-3d5e5662c884",
  #     "AppRoleAssignment.ReadWrite.All" = "06b708a9-e830-4db3-a914-8e69da51d44f",
  #     "ApprovalSolution.Read"           = "b0df437d-d341-4df0-aa3e-89ca81a1207f",
  #     "ApprovalSolution.Read.All"       = "9f265de7-8d5e-4e9a-a805-5e8bbc49656f",
  #     "ApprovalSolution.ReadWrite"      = "6768d3af-4562-48ff-82d2-c5e19eb21b9c",
  #     "ApprovalSolution.ReadWrite.All"  = "45583558-1113-4d06-8969-e79a28edc9ad",
  #     "ApprovalSolutionResponse.ReadWrite" = "89d944f2-2011-44ad-830c-aa9bf5ef2319",
  #     "AttackSimulation.Read.All"       = "93283d0a-6322-4fa8-966b-8c121624760d",
  #     "AttackSimulation.ReadWrite.All"  = "e125258e-8c8a-42a8-8f55-ab502afa52f3",
  #     "AuditLog.Read.All"               = "b0afded3-3588-46d8-8b3d-9842eff778da",
  #     "AuditLogsQuery-CRM.Read.All"     = "20e6f8e4-ffac-4cf7-82f7-70ddb7564318",
  #     "AuditLogsQuery-Endpoint.Read.All"= "0bc85aed-7b0b-437a-bac8-3b29a1b84c99",
  #     "AuditLogsQuery-Entra.Read.All"   = "7276d950-48fc-4269-8348-f22f2bb296d0",
  #     "AuditLogsQuery-Exchange.Read.All"= "6b0d2622-d34e-4470-935b-b96550e5ca8d",
  #     "AuditLogsQuery-OneDrive.Read.All"= "8a169a81-841c-45fd-ad43-96aede8801a0",
  #     "AuditLogsQuery-SharePoint.Read.All"= "91c64a47-a524-4fce-9bf3-3d569a344ecf",
  #     "AuditLogsQuery.Read.All"         = "5e1e9171-754d-478c-812c-f1755a9a4c2d",
  #     "AuthenticationContext.Read.All"  = "381f742f-e1f8-4309-b4ab-e3d91ae4c5c1",
  #     "AuthenticationContext.ReadWrite.All" = "a88eef72-fed0-4bf7-a2a9-f19df33f8b83",
  #     // ... (many more entries) ...
  #     "User.Read"                      = "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
  #     "User.Read.All"                  = "df021288-bdef-4463-88db-98f22de89214",
  #     "User.ReadBasic.All"             = "97235f07-e226-4f63-ace3-39588e11d3a1",
  #     "User.ReadWrite"                 = "b4e74841-8e56-480b-be8b-910348b18b4c",
  #     "User.ReadWrite.All"             = "741f803b-c850-494e-b5df-cde7c675a1ca",
  #     "User.RevokeSessions.All"        = "77f3a031-c388-4f99-b373-dc68676a979e",
  #     "User.Invite.All"                = "09850681-111b-4a89-9bed-3f2cae46d706",
  #     "User.Export.All"                = "405a51b5-8d8d-430b-9842-8be4b0e9f324",
  #     "Directory.Read.All"             = "7ab1d382-f21e-4acd-a863-ba3e13f7da61",
  #     "Directory.ReadWrite.All"        = "19dbc75e-c2e2-444c-a770-ec69d8559fc7",
  #     "Directory.AccessAsUser.All"     = "0e263e50-5827-48a4-b97c-d940288653c7",
  #     "openid"             = "openid"   # OIDC scope – not a GUID
  #     "profile"            = "profile"  # OIDC scope – not a GUID
  #     "email"              = "email"    # OIDC scope – not a GUID
  #     "Group.Read.All"     = "5b567255-7703-4780-807c-7be8301ae99b"
  #     "Mail.Read"          = "e383f46d-24c2-4e18-b0e9-1e7f1750d7c4"
  #     "Calendars.Read"     = "5a0e369a-05cc-47f2-99d3-eac094af6b16"
  #     "Files.Read"         = "dbef0c0a-3c53-45e3-8f3d-9c6c3b1b0f8d"
  #     // (the list continues for all other Microsoft Graph permissions)
  # }
}