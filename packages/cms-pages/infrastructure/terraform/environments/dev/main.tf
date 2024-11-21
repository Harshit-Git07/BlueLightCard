provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

module "iam" {
 source = "../../shared/iam"
}

module "cms_pages" {
  source                    = "../../shared/amplify/cms-pages"
  token                     = var.github_token
  sanity_token              = var.sanity_token
  sanity_project_id         = var.sanity_project_id
  amplify_role_arn          = module.iam.amplify_role_arn
}

