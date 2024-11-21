# Define the Amplify integration
resource "aws_amplify_app" "amplify" {
  build_spec            = var.build_spec
  environment_variables = var.environment
  name                  = var.app_name
  access_token          = var.token
  repository            = var.repository
  iam_service_role_arn  = var.amplify_role_arn
  platform              = "WEB_COMPUTE"

  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }
}

resource "aws_amplify_branch" "amplify_branch" {
  app_id      = aws_amplify_app.amplify.id
  branch_name = var.branch_name
  stage       = "PRODUCTION"
}

# resource "aws_amplify_webhook" "amplify_webhook" {
#   app_id      = aws_amplify_app.amplify.id
#   branch_name = aws_amplify_branch.amplify_branch.branch_name
#   description = "Trigger ${aws_amplify_branch.amplify_branch.branch_name}"
# }
