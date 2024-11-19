resource "aws_cognito_user_pool" "ddsNew" {
  name                     = "${var.stage}-blc-mono-cognito_ddsNew"
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  username_attributes = [
    "email"
  ]

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    password_history_size = 0
    minimum_length        = 6
  }

  mfa_configuration = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    attribute_data_type      = "Boolean"
    developer_only_attribute = false
    mutable                  = true
    name                     = "migrated_old_pool"
    required                 = false
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_id"
    required                 = false

    string_attribute_constraints {}
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_uuid"
    required                 = false

    string_attribute_constraints {}
  }

  software_token_mfa_configuration {
    enabled = true
  }

  tags = {
    "sst:stage" = var.stage
    "sst:app"   = "blc-mono"
  }

  lambda_config {
    pre_token_generation = var.ddsNew_lambda_config-pre_token_generation-arn
    user_migration       = var.ddsNew_lambda_config-user_migration-arn
    pre_authentication   = var.ddsNew_lambda_config-pre_authentication-arn
    post_authentication  = var.ddsNew_lambda_config-post_authentication-arn
  }
}

//////////////////////////////////////////////////////////////////////////////////
resource "aws_cognito_user_pool" "dds" {
  name                     = "${var.stage}-blc-mono-cognito_dds"
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  software_token_mfa_configuration {
    enabled = true
  }


  username_attributes = [
    "email"
  ]

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    password_history_size = 0
    minimum_length        = 6
  }

  mfa_configuration = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 2
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 1
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_id"
    required                 = false

    string_attribute_constraints {}
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_uuid"
    required                 = false

    string_attribute_constraints {}
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "phone_number"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }


  tags = {
    "sst:stage" = var.stage
    "sst:app"   = "blc-mono"
  }

  lambda_config {
    pre_token_generation = var.dds_lambda_config-pre_token_generation-arn
    post_authentication  = var.dds_lambda_config-post_authentication-arn
  }
}

//////////////////////////////////////////////////////////////////////////////////
resource "aws_cognito_user_pool" "blcNew" {
  name                     = "${var.stage}-blc-mono-cognitoNew"
  auto_verified_attributes = ["email"]



  username_configuration {
    case_sensitive = false
  }

  software_token_mfa_configuration {
    enabled = true
  }


  username_attributes = [
    "email"
  ]

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    require_lowercase     = false
    require_numbers       = false
    require_symbols       = false
    require_uppercase     = false
    minimum_length        = 6
    password_history_size = 0

  }

  mfa_configuration = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }


  schema {
    attribute_data_type      = "Boolean"
    developer_only_attribute = false
    mutable                  = true
    name                     = "migrated_old_pool"
    required                 = false
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_id"
    required                 = false
    string_attribute_constraints {}
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_uuid"
    required                 = false
    string_attribute_constraints {}
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "e2e"
    required                 = false
    string_attribute_constraints {}
  }


  sms_configuration {
    external_id    = var.blcNew_sms_external_id
    sns_caller_arn = var.blcNew_sms_sns_caller_arn
    sns_region     = var.region
  }


  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "The verification code to your new account is {####}"
    email_subject        = "Verify your new account"
    sms_message          = "The verification code to your new account is {####}"
  }


  tags = {
    "sst:stage" = var.stage
    "sst:app"   = "blc-mono"
  }

  lambda_config {
    pre_token_generation = var.blcNew_lambda_config-pre_token_generation-arn
    pre_token_generation_config {
      lambda_arn     = var.blcNew_pre_token_generation_config_arn
      lambda_version = "V1_0"
    }
    post_authentication = var.blcNew_lambda_config-post_authentication-arn
    pre_authentication  = var.blcNew_lambda_config-pre_authentication-arn
    user_migration      = var.blcNew_lambda_config-user_migration-arn
  }
}

//////////////////////////////////////////////////////////////////////////////////
resource "aws_cognito_user_pool" "blc" {
  name                     = "${var.stage}-blc-mono-cognito"
  auto_verified_attributes = ["email"]



  username_configuration {
    case_sensitive = false
  }

  software_token_mfa_configuration {
    enabled = true
  }


  username_attributes = [
    "email"
  ]

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  password_policy {
    require_lowercase     = false
    require_numbers       = false
    require_symbols       = false
    require_uppercase     = false
    minimum_length        = 6
    password_history_size = 0

  }

  mfa_configuration = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 2
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 1
    }
  }


  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_id"
    required                 = false

    string_attribute_constraints {}
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "blc_old_uuid"
    required                 = false

    string_attribute_constraints {}
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "phone_number"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }


  sms_configuration {
    external_id    = var.blc_sms_external_id
    sns_caller_arn = var.blc_sms_sns_caller_arn
    sns_region     = var.region
  }


  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "The verification code to your new account is {####}"
    email_subject        = "Verify your new account"
    sms_message          = "The verification code to your new account is {####}"
  }


  tags = {
    "sst:stage" = var.stage
    "sst:app"   = "blc-mono"
  }

  lambda_config {
    pre_token_generation = var.blc_lambda_config-pre_token_generation-arn
    pre_token_generation_config {
      lambda_arn     = var.blc_pre_token_generation_config_arn
      lambda_version = "V1_0"
    }
    post_authentication = var.blc_lambda_config-post_authentication-arn
    pre_authentication  = var.blc_lambda_config-pre_authentication-arn
    user_migration      = var.blc_lambda_config-user_migration-arn
  }
}
