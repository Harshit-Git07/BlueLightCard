locals {
  my_workspace_env = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "blc-2-0-shared-") : terraform.workspace
}

# vpc
module "vpc" {
  source = "git@github.com:bluelightcard/terraform-modules.git//aws/network/vpc?ref=v1.2.0"

  app          = "blc-mono"
  aws_region   = var.aws_region
  aws_vpc_name = "vpc-shared"

  default_tags = {
    "sst:app"   = var.app
    "sst:stage" = var.stage
  }

  stage = var.stage
}

# ses
# shared iam roles
# event bus
# acm certificates
# opensearch
# redshift
# s3
# streams
