variable "branch_name" {
  description = "Branch to watch for changes"
  type        = string
  default     = "main"
}

variable "dataset_name" {
  description = "Sanity dataset name"
  type        = string
  default     = "develop"
}

variable "project_name" {
  description = "CMS Pages cloudflare pages project name"
  type        = string
  default     = "cms-pages"
}

variable "cms_pages_env" {
  description = "Environment variables for CMS Pages"
  type        = map(any)
  default = {
    NEXT_PUBLIC_REVALIDATE        = 3600
  }
}

variable "sanity_token" {
  description = "Sanity access token"
  sensitive   = true
  type        = string
}

variable "sanity_project_id" {
  description = "Sanity project ID"
  sensitive   = true
  type        = string
}

variable "subdomain_prefix" {
  description = "Subdomain prefix for the app"
  type        = string
  default     = "cms"
}

variable "subdomain_suffix" {
  description = "Subdomain suffix for the app"
  type        = string
  default     = ""
}

variable "domain_host" {
  description = "Domain name for the app"
  type        = string
  default     = "blcshine.io"
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  sensitive   = true
  type        = string
}

variable "repo_name" {
  description = "Repository name"
  type        = string
  default     = "BlueLightCard-2.0"
}

variable "repo_owner" {
  description = "Repository owner"
  type        = string
  default     = "bluelightcard"
}

variable "root_dir" {
  description = "Root directory of the preview project"
  type        = string
  default     = "packages/cms-pages"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

locals {
  cms_pages_env = merge(
    var.cms_pages_env,
    {
      NEXT_PUBLIC_SANITY_DATASET_NAME = var.dataset_name
      NEXT_PUBLIC_SANITY_TOKEN      = var.sanity_token
      NEXT_PUBLIC_SANITY_PROJECT_ID = var.sanity_project_id
    },
  )
}
