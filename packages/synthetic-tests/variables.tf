variable "datadog_api_key" {
  description = "Datadog API Key"
  type        = string
}

variable "datadog_app_key" {
  description = "Datadog App Key"
  type        = string
}

variable "cognito_client_id" {
  description = "AWS Cognito Client ID"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "AWS Cognito User Pool ID"
  type        = string
}

variable "cognito_username" {
  description = "AWS Cognito Username"
  type        = string
}

variable "cognito_password" {
  description = "AWS Cognito Password"
  type        = string
}

variable "cognito_secret_hash" {
  description = "AWS Cognito Secret Hash"
  type        = string
}

variable "host" {
  description = "API Host"
  type        = string
}

variable "userid" {
  description = "User ID"
  type        = string
}

variable "TFC_WORKSPACE_NAME" {
  type    = string
  default = "" # An error occurs when you are running TF backend other than Terraform Cloud
}

variable "stage" {
  description = "The deployment stage (e.g., 'dev', 'prod')"
  default     = ""
}

variable "slack_webhook_id" {
  description = "The webhook id for slack"
  default     = ""
}
