# STAGING
terraform import aws_dynamodb_table.identity_table arn:aws:dynamodb:eu-west-2:314658777488:table/staging-blc-mono-identityTable
terraform import aws_dynamodb_table.identity_id_mapping_table arn:aws:dynamodb:eu-west-2:314658777488:table/staging-blc-mono-identityIdMappingTable
terraform import aws_cognito_user_pool.ddsNew eu-west-2_VdsvVVUrI
terraform import aws_cognito_user_pool.dds eu-west-2_jbLX0JEdN
terraform import aws_cognito_user_pool.blcNew eu-west-2_Ow2L8azIb
terraform import aws_cognito_user_pool.blc eu-west-2_rNmQEiFS4

# PRODUCTION
terraform import aws_dynamodb_table.identity_table arn:aws:dynamodb:eu-west-2:676719682338:table/production-blc-mono-identityTable
terraform import aws_dynamodb_table.identity_id_mapping_table arn:aws:dynamodb:eu-west-2:676719682338:table/production-blc-mono-identityIdMappingTable
terraform import aws_cognito_user_pool.ddsNew eu-west-2_3WlS5ZkAh
terraform import aws_cognito_user_pool.dds eu-west-2_y2KyCUbVT
terraform import aws_cognito_user_pool.blcNew eu-west-2_D3aAVuWHo
terraform import aws_cognito_user_pool.blc eu-west-2_jrwTfFRgM

