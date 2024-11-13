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

variable "firehose_config" {
  # TODO
  description = "Temporary: stream-specific configurations for each Firehose stream, including log group, log stream, IAM role, and IAM policy."
  type = object({
    compAppClick = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
    compAppView = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
    compClick = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
    compView = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
    redemption = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
    vault = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
    vaultIntegrationCallback = object({
      destination   = string
      iam_policy    = string
      iam_role      = string
      log_group     = string
      log_stream    = string
      stream_config = any
    })
  })
}

variable "stage" {
  type        = string
  description = "Stage name"
}
