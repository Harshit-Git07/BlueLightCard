variable "branch_name" {
  description = "Branch to watch for changes"
  type        = string
  default     = "feat/DISCO-1179-Landing-Pages-setup"
}

variable "dataset_name" {
  description = "Sanity dataset name"
  type        = string
  default     = "develop"
}

variable "preview_app_name" {
  description = "CMS Pages Amplify application name"
  type        = string
  default     = "cms-pages"
}

variable "preview_build_spec" {
  description = "Build spec for the Amplify app"
  type        = string
  default     = <<-EOT
version: 1
applications:
  -  frontend:
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - .next/cache/**/*
          - .npm/**/*
      phases:
        preBuild:
          commands:
            - env | grep -e NEXT_PUBLIC_ >> .env.production
            - npm ci --cache .npm --prefer-offline --ignore-scripts
        build:
          commands:
            - npm run build
     appRoot: packages/cms-pages
EOT
}

variable "cms_pages_env" {
  description = "Environment variables for CMS Pages"
  type        = map(any)
  default = {
    AMPLIFY_DIFF_DEPLOY           = false
    AMPLIFY_MONOREPO_APP_ROOT     = "packages/cms-pages"
    NEXT_PUBLIC_REVALIDATE        = 3600
  }
}

variable "token" {
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
  description = "Sanity project ID"
  sensitive   = true
  type        = string
}

variable "amplify_role_arn" {
  description = "ARN for the Amplify Service Role"
  type        = string
}

variable "subdomain_prefix" {
  description = "Subdomain prefix for the Amplify app"
  type        = string
  default     = "cms-pages"
}

variable "subdomain_suffix" {
  description = "Subdomain suffix for the Amplify app"
  type        = string
  default     = "-develop"
}

variable "domain_host" {
  description = "Domain name for the Amplify app"
  type        = string
  default     = "blcshine.io"
}

locals {
  cms_pages_env = merge(
    var.cms_pages_env,
    {
      NEXT_PUBLIC_SANITY_DATASET_NAME = var.dataset_name
      NEXT_PUBLIC_SANITY_TOKEN      = var.sanity_token
      NEXT_PUBLIC_SANITY_PROJECT_ID = var.sanity_project_id
      SANITY_STUDIO_PREVIEW_URL       = "https://${var.subdomain_prefix}${var.subdomain_suffix}.${var.domain_host}"
    },
  )
}
