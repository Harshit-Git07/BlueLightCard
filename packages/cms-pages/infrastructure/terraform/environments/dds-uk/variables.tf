variable "TFC_WORKSPACE_NAME" {
  type        = string
  description = "An error occurs when you are running TF backend other than Terraform Cloud"

  default = ""
}

variable "stage" {
  description = "The stage tag (dev, staging, production)"
  type        = string
  default     = "develop"
}

variable "brand" {
  description = "The brand name"
  type        = string
  default     = "blc-aus"
}

variable "github_token" {
  description = "Github access token"
  sensitive   = true
  type        = string
}

variable "sanity_token" {
  description = "Sanity access token"
  sensitive   = true
  type        = string
}

variable "sanity_project_id" {
  description = "The ID for the Sanity project"
  type        = string
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

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

variable "dataset_name" {
  description = "Sanity dataset name"
  type        = string
  default     = "develop"
}

