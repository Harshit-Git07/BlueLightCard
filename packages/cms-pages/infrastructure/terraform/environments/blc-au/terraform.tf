terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "bluelightcard"

    workspaces {
      prefix = "blc-mono-blc-uk-cms-pages-"
    }
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  required_version = ">= 1.9.0"
}
