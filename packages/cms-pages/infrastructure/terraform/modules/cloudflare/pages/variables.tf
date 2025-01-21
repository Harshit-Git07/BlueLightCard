variable "branch_name" {
  description = "Branch to watch for changes"
  type        = string
  default     = "main"
}

variable "build_command" {
  description = "Build command"
  type        = string
  default     = "npm run build --ignore-scripts"
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

variable "compatibility_date" {
  description = "Compatibility date"
  type        = string
  default     = "2022-08-16"
}

variable "compatibility_flags" {
  description = "Compatibility flags"
  type        = list(string)
  default     = ["nodejs_compat", "streams_enable_constructors"]
}

variable "deployments_enabled" {
  description = "Enable deployments"
  type        = bool
  default     = true
}

variable "destination_dir" {
  description = "Destination directory"
  type        = string
  default     = "dist"
}

variable "domain_name" {
  description = "Domain name"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the app"
  type        = map(any)
}

variable "pr_comments_enabled" {
  description = "Enable PR comments"
  type        = bool
  default     = true
}

variable "production_deployment_enabled" {
  description = "Enable production deployments"
  type        = bool
  default     = true
}

variable "project_name" {
  description = "Pages project name"
  type        = string
}

variable "repo_name" {
  description = "GitHub repository name"
  type        = string
}

variable "repo_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "bluelightcard"
}

variable "root_dir" {
  description = "Root directory of the project"
  type        = string
  default     = "sanity"
}

variable "vcs" {
  description = "Version control system"
  type        = string
  default     = "github"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type        = string
}

locals {
  domain_parts = split(".", var.domain_name)

  root_domain = join(".", slice(local.domain_parts, length(local.domain_parts) - 2, length(local.domain_parts)))

  subdomain = join(".", slice(local.domain_parts, 0, length(local.domain_parts) - 2))
}
