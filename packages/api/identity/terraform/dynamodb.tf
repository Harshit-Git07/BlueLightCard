resource "aws_dynamodb_table" "identity_table" {
  name         = "${var.stage}-blc-mono-identityTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "sk"
    range_key       = "pk"
    projection_type = "ALL"
  }

  tags = {
    "sst:stage"  = var.stage
    map-migrated = var.dynamodb_identity_mapping_tag_map_migrated
    "sst:app"    = "blc-mono"
    service      = "identity"
  }
}

resource "aws_dynamodb_table" "identity_id_mapping_table" {
  name                        = "${var.stage}-blc-mono-identityIdMappingTable"
  billing_mode                = "PAY_PER_REQUEST"
  hash_key                    = "legacy_id"
  range_key                   = "uuid"
  deletion_protection_enabled = true

  attribute {
    name = "legacy_id"
    type = "S"
  }

  attribute {
    name = "uuid"
    type = "S"
  }

  tags = {
    "sst:stage"  = var.stage
    map-migrated = var.dynamodb_identity_mapping_tag_map_migrated
    "sst:app"    = "blc-mono"
    service      = "identity"
  }
}
