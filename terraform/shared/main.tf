locals {
  app = "blc-mono"

  my_workspace_env = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "${local.app}-shared-") : terraform.workspace
}

# SES
resource "aws_sesv2_email_identity" "default" {
  email_identity = var.aws_ses_email_identity
}

resource "aws_sesv2_email_identity_mail_from_attributes" "default" {
  email_identity = var.aws_ses_email_identity

  behavior_on_mx_failure = "USE_DEFAULT_VALUE"
  mail_from_domain       = "noreply.${var.aws_ses_email_identity}"
}
