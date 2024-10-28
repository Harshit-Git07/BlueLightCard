terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "bluelightcard"

    workspaces {
      prefix = "blc-mono-dds-shared-"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.72.0"
    }
  }

  required_version = ">= 1.9.0"
}
