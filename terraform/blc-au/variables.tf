variable "TFC_WORKSPACE_NAME" {
  type        = string
  description = "An error occurs when you are running TF backend other than Terraform Cloud"

  default = ""
}

variable "aws_acm_domain_name" {
  type        = string
  description = "AWS ACM Domain Name"

  default = "*.blcshine.io"
}

variable "aws_availability_zones" {
  type        = list(string)
  description = "AWS Region"

  default = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
}

variable "aws_region" {
  type        = string
  description = "AWS Region"

  default = "eu-west-2"
}

variable "aws_wafv2_web_acl_name" {
  # TODO
  type        = string
  description = "TEMPORARY: AWS WAF WebACL name"
}

variable "stage" {
  type        = string
  description = "Stage name"
}
