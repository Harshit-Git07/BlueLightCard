terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "bluelightcard"

    workspaces {
      prefix = "datadog-"
    }
  }
}

locals {
  stage_subdomain_name = var.stage == "production" ? "" : "-${var.stage}"
  my_workspace_env     = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "datadog") : terraform.workspace
}

provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
  api_url = "https://api.datadoghq.eu/"
}








