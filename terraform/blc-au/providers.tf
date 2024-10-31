provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      "sst:app"   = local.app
      "sst:stage" = var.stage
    }
  }
}
