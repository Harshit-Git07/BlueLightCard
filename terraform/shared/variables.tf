variable "TFC_WORKSPACE_NAME" {
  type        = string
  description = "An error occurs when you are running TF backend other than Terraform Cloud"

  default = ""
}

variable "aws_region" {
  type        = string
  description = "AWS Region"

  default = "eu-west-2"
}

variable "aws_ses_email_identity" {
  type        = string
  description = "AWS SES Email Identity"

  default = "bluelightcard.co.uk"
}
