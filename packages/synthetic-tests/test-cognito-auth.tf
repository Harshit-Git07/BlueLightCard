resource "datadog_synthetics_test" "cognito_auth_test" {
  message   = "Multi-step synthetic test for Cognito authentication and API calls"
  name      = "Cognito authentication Test  - ${var.stage}"
  locations = ["aws:eu-west-2"]
  type      = "api"
  subtype   = "multi"
  status    = var.stage == "develop" ? "paused" : "live"
  api_step {
    name = "Authenticate to Cognito"
    request_definition {
      method = "POST"
      url    = "https://cognito-idp.eu-west-2.amazonaws.com/"
      body = jsonencode({
        AuthParameters = {
          USERNAME    = var.cognito_username
          PASSWORD    = var.cognito_password
          SECRET_HASH = var.cognito_secret_hash
        }
        AuthFlow = "USER_PASSWORD_AUTH"
        ClientId = var.cognito_client_id
      })
    }
    request_headers = {
      "Content-Type" = "application/x-amz-json-1.1"
      "X-Amz-Target" = "AWSCognitoIdentityProviderService.InitiateAuth"
    }

    assertion {
      type     = "statusCode"
      operator = "is"
      target   = 200
    }

    assertion {
      type     = "responseTime"
      operator = "lessThan"
      target   = 1000
    }

    extracted_value {
      name = "auth_token"
      type = "http_body"
      parser {
        type  = "json_path"
        value = "$.AuthenticationResult.IdToken"
      }
    }
  }

  api_step {
    name = "Get Promos"
    request_definition {
      method = "GET"
      url    = "https://${var.host}/api/4/offer/promos_new.php?uid=${var.userid}"
    }
    request_headers = {
      "Authorization" = "Bearer {{ auth_token }}"
    }

    assertion {
      type     = "statusCode"
      operator = "is"
      target   = 200
    }

    assertion {
      type     = "responseTime"
      operator = "lessThan"
      target   = 1000
    }

    assertion {
      type     = "header"
      property = "Content-Type"
      operator = "is"
      target   = "application/json; charset=utf-8"
    }

    assertion {
      type     = "body"
      operator = "validatesJSONSchema"
      targetjsonschema {
        jsonschema = jsonencode(file("${path.module}/data/promos-schema.json"))
      }
    }

    assertion {
      type     = "body"
      operator = "validatesJSONPath"
      targetjsonpath {
        jsonpath         = "$.data.deal[0].items"
        operator         = "contains"
        elementsoperator = "everyElementMatches"
        targetvalue      = "offername"
      }
    }

    assertion {
      type     = "body"
      operator = "validatesJSONPath"
      targetjsonpath {
        jsonpath         = "$.data.flexible.items"
        operator         = "contains"
        elementsoperator = "everyElementMatches"
        targetvalue      = "imagehome"
      }
    }

    assertion {
      type     = "body"
      operator = "validatesJSONPath"
      targetjsonpath {
        jsonpath         = "$.data.groups[0].items"
        operator         = "contains"
        elementsoperator = "everyElementMatches"
        targetvalue      = "compid"
      }
    }
  }

  api_step {
    name = "Get Message Count"
    request_definition {
      method = "GET"
      url    = "https://${var.host}/api/4/user/message/count.php"
    }
    request_headers = {
      "Authorization" = "Bearer {{ auth_token }}"
    }

    assertion {
      type     = "statusCode"
      operator = "is"
      target   = 200
    }

    assertion {
      type     = "responseTime"
      operator = "lessThan"
      target   = 1000
    }
  }
  options_list {
    tick_every          = 300
    min_location_failed = 1
    follow_redirects    = true
  }
}

# resource "datadog_monitor" "synthetics_anomaly_detection" {
#   name  = "Anomaly Detection for Cognito Synthetic Test  - ${var.stage}"
#   type  = "query alert"
#   query = "avg(last_10m):anomalies(avg:synthetics.http.response.time{check_id:${datadog_synthetics_test.cognito_auth_test.id}}.as_count(), 'basic', 2, direction='both', alert_window='last_5m', interval=60, count_default_zero='true') > 0"
#   # https://docs.datadoghq.com/monitors/notify/variables/?tab=is_alert#:~:text=template%20variables.-,Conditional%20variables,-Conditional%20variables%20use
#   message            = <<-EOT
#   {{#is_alert}}@webhook-${datadog_webhook.slack_test_cognito_auth_errors_webhook.name}{{/is_alert}}
#   {{#is_recovery}}@webhook-${datadog_webhook.slack_test_cognito_auth_recovery_webhook.name}{{/is_recovery}}
#   {{#is_renotify}}@webhook-${datadog_webhook.slack_test_cognito_auth_recovery_webhook.name}{{/is_renotify}}
#   {{#is_no_data}}@webhook-${datadog_webhook.slack_test_cognito_auth_no-data_webhook.name}{{/is_no_data}}
#   EOT
#   escalation_message = "Please investigate the issue immediately."
#   tags               = ["synthetics", "anomaly_detection"]
#   priority           = 1
#
#   monitor_thresholds {
#     critical = 0
#   }
#
#   notify_no_data    = true
#   renotify_interval = 60
#
#   notify_audit = true
#   timeout_h    = 0
# }

# resource "datadog_webhook" "slack_test_cognito_auth_errors_webhook" { # spaces added on purpose to fail the step
#   name           = "slack_test_cognito_auth_errors_webhook_${var.stage}"
#   url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
#   encode_as      = "json"
#   custom_headers = jsonencode({ "Content-type" : "application/json" })
#   payload        = jsonencode({ "text" : "⚠️[THIS IS A TEST] [SYNTHETIC TEST: ${var.stage}] : Cognito auth : Anomaly detected :\n https://app.datadoghq.eu/synthetics/details/${datadog_synthetics_test.cognito_auth_test.id}\n https://app.datadoghq.eu/monitors/manage?q=anomaly%20detection&order=desc" })
#   depends_on     = [datadog_synthetics_test.cognito_auth_test]
# }
#
# resource "datadog_webhook" "slack_test_cognito_auth_recovery_webhook" {
#   name           = "slack_test_cognito_auth_recovery_webhook_${var.stage}"
#   url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
#   encode_as      = "json"
#   custom_headers = jsonencode({ "Content-type" : "application/json" })
#   payload        = jsonencode({ "text" : "✅[THIS IS A TEST] [SYNTHETIC TEST: ${var.stage}] : Cognito auth : Recovered" })
# }
#
# resource "datadog_webhook" "slack_test_cognito_auth_renotify_webhook" {
#   name           = "slack_test_cognito_auth_renotify_webhook_${var.stage}"
#   url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
#   encode_as      = "json"
#   custom_headers = jsonencode({ "Content-type" : "application/json" })
#   payload        = jsonencode({ "text" : "🛑[THIS IS A TEST] [SYNTHETIC TEST: ${var.stage}] : Cognito auth : Please investigate the issue immediately" })
# }
#
# resource "datadog_webhook" "slack_test_cognito_auth_no-data_webhook" {
#   name           = "slack_test_cognito_auth_no-data_webhook_${var.stage}"
#   url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
#   encode_as      = "json"
#   custom_headers = jsonencode({ "Content-type" : "application/json" })
#   payload        = jsonencode({ "text" : "[THIS IS A TEST] [SYNTHETIC TEST: ${var.stage}] : Cognito auth : No data" })
# }
