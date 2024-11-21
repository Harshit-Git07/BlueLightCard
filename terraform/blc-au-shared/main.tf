locals {
  app   = "blc-mono"
  brand = "blc-au"

  my_workspace_env = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "${local.app}-${local.brand}-shared-") : terraform.workspace
}

# ACM Certificate
resource "aws_acm_certificate" "default" {
  domain_name = var.aws_acm_domain_name

  tags = {
    Name = "${var.stage}-${local.app}-global/Certificate"
  }

  validation_method = "DNS"
}

# BastionHost
module "bastionhost" {
  source = "git@github.com:bluelightcard/terraform-modules.git//aws/ec2/bastionhost?ref=v1.6.6"

  aws_region = var.aws_region
  aws_vpc_id = module.vpc.vpc.id

  defaults = {
    app   = local.app
    stage = var.stage
  }
}

# CloudWatch Event Bus
resource "aws_cloudwatch_event_bus" "default" {
  name = "${var.stage}-${local.app}-eventBus"
}

# Firehose Streams
module "firehose_streams" {
  source = "git@github.com:bluelightcard/terraform-modules.git//aws/firehose?ref=v1.6.6"

  brand  = local.brand
  config = var.firehose_config

  defaults = {
    app   = local.app
    stage = var.stage
  }
}

# VPC
module "vpc" {
  source = "git@github.com:bluelightcard/terraform-modules.git//aws/network/vpc?ref=v1.6.6"

  aws_availability_zones = var.aws_availability_zones
  aws_region             = var.aws_region
  aws_vpc_name           = "vpc-shared"

  defaults = {
    app   = local.app
    stage = var.stage
  }
}

# WAF WebACL
resource "aws_wafv2_web_acl" "default" {
  # TODO
  # name = "WebACL-${var.stage}-${local.app}"
  name = var.aws_wafv2_web_acl_name

  default_action {
    allow {}
  }

  scope = "REGIONAL"

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "waf"
    sampled_requests_enabled   = true
  }
}
