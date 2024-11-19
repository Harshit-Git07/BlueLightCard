variable "stage" {
  description = "stage"
  type        = string
}

variable "region" {
  default = "eu-west-2"
  type    = string
}

variable "TFC_WORKSPACE_NAME" {
  type        = string
  description = "Workspace name"
  default     = ""
}

variable "dynamodb_identity_mapping_tag_map_migrated" {
  type        = string
  description = "map migrated tag"
  default     = ""
}

variable "ddsNew_lambda_config-pre_token_generation-arn" {
  type = string
}

variable "ddsNew_lambda_config-user_migration-arn" {
  type = string
}

variable "ddsNew_lambda_config-pre_authentication-arn" {
  type = string
}

variable "ddsNew_lambda_config-post_authentication-arn" {
  type = string
}

variable "dds_lambda_config-pre_token_generation-arn" {
  type = string
}

variable "dds_lambda_config-user_migration-arn" {
  type = string
}

variable "dds_lambda_config-pre_authentication-arn" {
  type = string
}

variable "dds_lambda_config-post_authentication-arn" {
  type = string
}

variable "blcNew_lambda_config-pre_token_generation-arn" {
  type = string
}

variable "blcNew_lambda_config-user_migration-arn" {
  type = string
}

variable "blcNew_lambda_config-pre_authentication-arn" {
  type = string
}

variable "blcNew_lambda_config-post_authentication-arn" {
  default = ""
}

variable "blcNew_sms_sns_caller_arn" {
  default = ""
}

variable "blcNew_sms_external_id" {
  default = ""
}

variable "blcNew_pre_token_generation_config_arn" {
  default = ""
}

variable "blc_lambda_config-post_authentication-arn" {
  default = ""
}

variable "blc_lambda_config-pre_token_generation-arn" {
  default = ""
}

variable "blc_lambda_config-user_migration-arn" {
  default = ""
}

variable "blc_lambda_config-pre_authentication-arn" {
  default = ""
}

variable "blc_sms_external_id" {
  default = ""
}

variable "blc_sms_sns_caller_arn" {
  default = ""
}

variable "blc_pre_token_generation_config_arn" {
  default = ""
}
