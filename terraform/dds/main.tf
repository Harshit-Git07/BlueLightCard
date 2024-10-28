locals {
  app = "blc-mono"

  my_workspace_env = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "${local.app}-dds-shared-") : terraform.workspace
}

# vpc
module "vpc" {
  source = "git@github.com:bluelightcard/terraform-modules.git//aws/network/vpc?ref=v1.2.0"

  app = local.app

  aws_availability_zones = var.aws_availability_zones
  aws_region             = var.aws_region
  aws_vpc_name           = "vpc-shared-dds"

  default_tags = {
    "sst:app"   = local.app
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
