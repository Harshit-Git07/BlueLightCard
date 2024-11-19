terraform {

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "bluelightcard"

    workspaces {
      prefix = "identity-"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  stage_subdomain_name = var.stage == "production" ? "" : "-${var.stage}"
  my_workspace_env     = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "identity") : terraform.workspace
}

data "aws_caller_identity" "current" {}
