variable "app_name" {
  description = "Amplify application name"
  type        = string
}

variable "branch_name" {
  description = "Branch to watch for changes"
  type        = string
}

variable "build_spec" {
  description = "Build spec for the Amplify application"
  type        = string
}

variable "repository" {
  description = "Github repository url"
  type        = string
}

variable "token" {
  description = "Github access token"
  sensitive   = true
  type        = string
}

variable "amplify_role_arn" {
  description = "Amplify service role arn"
  type        = string
}

variable "environment" {
  description = "Environment variables for the Amplify app"
  type        = map(any)
}

variable "domain_name" {
  description = "Domain name for the Amplify app"
  type        = string
}
