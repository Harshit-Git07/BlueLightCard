resource "datadog_synthetics_test" "basic_user_flow" {
  name   = "Basic User Flow - ${var.stage}"
  type   = "browser"
  status = var.stage == "develop" ? "paused" : "live"
  #message    = "Notify @qa"
  device_ids = ["laptop_large"]
  locations  = ["aws:eu-west-2"]
  tags       = []
  set_cookie = "cga=1; cgc=1; cfb=1; cfb_share=1; cvwo=1;" # Make marketing preferences disappear

  request_definition {
    method          = "GET"
    url             = "https://${var.host}/"
    persist_cookies = true
  }

  browser_step {
    name = "Click on button #save_all"
    type = "click"
    params {
      element_user_locator {
        value {
          value = "#save_all"
        }
      }
    }
  }

  browser_step {
    name = "Click on login button"
    type = "click"
    params {
      element_user_locator {
        value {
          value = "nav.main-navigation ul li:nth-child(6) a"
        }
      }
    }
  }

  browser_step {
    name = "Sign in: Email"
    type = "typeText"
    params {
      element = jsonencode({
        "multiLocator" : {
          "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"form\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"input\"][1]"
          "at" : ""
          "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" visible-lg \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" cognito-asf \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" form-control \")][1]"
          "co" : "[{\"text\":\"email\",\"textType\":\"innerText\"},{\"relation\":\"AFTER\",\"tagName\":\"DIV\",\"text\":\" sign in with your email and password email password forgot your password? \",\"textType\":\"innerText\"}]"
          "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" visible-lg \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" cognito-asf \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" form-control \")][1]"
        },
        "targetOuterHTML" : "<input id=\"signInFormUsername\" name=\"username\" type=\"text\" class=\"form-control inputField-customizable\" placeholder=\"name@host.com\" autocapitalize=\"none\" required=\"\" value=\"\">"
      })
      value = var.cognito_username
    }
  }

  browser_step {
    name = "Sign in: Password"
    type = "typeText"
    params {
      element = jsonencode({
        "multiLocator" : {
          "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"form\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"input\"][1]",
          "at" : "",
          "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" visible-lg \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" cognito-asf \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" form-control \")][2]",
          "co" : "[{\"text\":\"password\",\"textType\":\"innerText\"},{\"relation\":\"AFTER\",\"tagName\":\"DIV\",\"text\":\" sign in with your email and password email password forgot your password? \",\"textType\":\"innerText\"}]",
          "ro" : "//*[local-name()=\"div\"][2]/*[1]/*[1]/*[local-name()=\"form\"][1]/*[5]/*",
          "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" visible-lg \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" cognito-asf \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" form-control \")][2]"
        },
        "targetOuterHTML" : "<input id=\"signInFormPassword\" name=\"password\" type=\"password\" class=\"form-control inputField-customizable\" placeholder=\"Password\" required=\"\">"
      })
      value = var.cognito_password
    }
  }

  browser_step {
    name = "Click on sign in button"
    type = "click"
    params {
      element = jsonencode({
        "multiLocator" : {
          "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"form\"][1]/*[local-name()=\"input\"][3]",
          "at" : "",
          "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" visible-lg \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" btn \")]",
          "co" : "[{\"tagName\":\"INPUT\",\"text\":\"submit\",\"textType\":\"aria-label\"},{\"relation\":\"AFTER\",\"tagName\":\"DIV\",\"text\":\" sign in with your email and password email password forgot your password? \",\"textType\":\"innerText\"}]",
          "ro" : "//*[local-name()=\"div\"][2]/*[1]/*[1]/*[local-name()=\"form\"][1]/*[8]",
          "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" visible-lg \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" btn \")]"
        },
        "targetOuterHTML" : "<input name=\"signInSubmitButton\" type=\"Submit\" value=\"Sign in\" class=\"btn btn-primary submitButton-customizable\" aria-label=\"submit\">"
      })
    }
  }

  browser_step {
    name = "Click on search button"
    type = "click"
    params {
      element = jsonencode({
        "url" : "https://${var.host}/members-home",
        "multiLocator" : {
          "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"nav\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"svg\"][1]",
          "at" : "",
          "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" fa-magnifying-glass \")]",
          "co" : "",
          "ro" : "//*[contains(concat(' ', normalize-space(@class), ' '), \" svg-inline--fa \") and contains(concat(' ', normalize-space(@class), ' '), \" fa-magnifying-glass \") and contains(concat(' ', normalize-space(@class), ' '), \" fa-lg \") and contains(concat(' ', normalize-space(@class), ' '), \" w-full \") and contains(concat(' ', normalize-space(@class), ' '), \" self-center \")]",
          "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" fa-magnifying-glass \")]"
        },
        "targetOuterHTML" : "<svg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"far\" data-icon=\"magnifying-glass\" class=\"svg-inline--fa fa-magnifying-glass fa-lg w-full self-center\" role=\"img\" xmlns=\"http://www.w3.org/2000/sv"
      })
    }
  }

  dynamic "browser_step" {
    for_each = var.stage == "production" ? [1] : []
    content {
      name = "Production: Search for superdry"
      type = "typeText"
      params {
        element = jsonencode({
          "url" : "https://${var.host}/members-home",
          "multiLocator" : {
            "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"input\"][1]",
            "at" : "/descendant::*[@type=\"text\" and @value=\"\"]",
            "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" border-neutrals-type-1-400 \")]",
            "co" : "[{\"text\":\"or by phrase\",\"textType\":\"innerText\"}]",
            "ro" : "//*[local-name()=\"input\"]",
            "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" border-neutrals-type-1-400 \")]"
          },
          "targetOuterHTML" : "<input class=\"border-neutrals-type-1-400 dark:border-palette-neutral-dark bg-palette-white focus:border-border-focus focus:dark:border-border-dark  w-full rounded-md py-2 px-3 border focus:outline-non"
        })
        value = "Superdry"
      }
    }
  }

  dynamic "browser_step" {
    for_each = var.stage == "develop" ? [1] : []
    content {
      name = "Staging: Search for gym"
      type = "typeText"
      params {
        element = jsonencode({
          "url" : "https://${var.host}/members-home",
          "multiLocator" : {
            "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"input\"][1]",
            "at" : "/descendant::*[@type=\"text\" and @value=\"\"]",
            "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" border-neutrals-type-1-400 \")]",
            "co" : "[{\"text\":\"or by phrase\",\"textType\":\"innerText\"}]",
            "ro" : "//*[local-name()=\"input\"]",
            "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" border-neutrals-type-1-400 \")]"
          },
          "targetOuterHTML" : "<input class=\"border-neutrals-type-1-400 dark:border-palette-neutral-dark bg-palette-white focus:border-border-focus focus:dark:border-border-dark  w-full rounded-md py-2 px-3 border focus:outline-non ..."
        })
        value = "gym"
      }
    }
  }

  browser_step {
    name = "Submit search"
    type = "click"
    params {
      element = jsonencode({
        "url" : "https://${var.host}/members-home",
        "multiLocator" : {
          "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"button\"][1]",
          "at" : "",
          "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" bg-background-cta-standard-primary-enabled-base \")]",
          "co" : "[{\"text\":\"search now\",\"textType\":\"directText\"}]",
          "ro" : "//*[local-name()=\"button\"]",
          "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" bg-background-cta-standard-primary-enabled-base \")]"
        },
        "targetOuterHTML" : "<button type=\"button\" class=\" py-1.5 px-5 rounded-md transition border-2 focus:outline outline-2 outline-offset-2  text-font-cta-standard-primary-base dark:text-font-cta-standard-primary-dark hover:bg"
      })
    }
  }

  dynamic "browser_step" {
    for_each = var.stage == "production" ? [1] : []
    content {
      name = "Click on image result"
      type = "click"
      params {
        element = jsonencode({
          "url" : "https://${var.host}/search?issuer=&q=Superdry",
          "multiLocator" : {
            "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][3]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"img\"][1]",
            "at" : "/*[local-name()=\"html\"]/*[local-name()=\"body\"]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][3]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/descendant::*[@alt=\"\" and @loading=\"lazy\"]",
            "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" !relative \")][1]",
            "co" : "[{\"relation\":\"BEFORE\",\"tagName\":\"IMG\",\"text\":\" online offersuperdry\",\"textType\":\"innerText\"}]",
            "ro" : "//*[1]/*[1]/*[local-name()=\"div\"][1]/*[local-name()=\"img\"][1]",
            "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" !relative \")][1]"
          },
          "targetOuterHTML" : "<img alt=\"\" loading=\"lazy\" width=\"0\" height=\"0\" decoding=\"async\" data-nimg=\"1\" class=\"h-auto w-full  !relative\" sizes=\"100vw\" srcset=\"https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=640,quality=75"
        })
      }
    }
  }

  dynamic "browser_step" {
    for_each = var.stage == "production" ? [1] : []
    content {
      name = "Copy discount code"
      type = "click"
      params {
        element = jsonencode({
          "url" : "https://${var.host}/search?issuer=&q=Superdry",
          "multiLocator" : {
            "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"button\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"span\"][1]",
            "at" : "",
            "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" bg-white \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" dark:text-magicButton-default-label-colour-dark \")]",
            "co" : "",
            "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" bg-white \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" dark:text-magicButton-default-label-colour-dark \")]"
          },
          "targetOuterHTML" : "<span class=\"text-magicButton-default-label-colour dark:text-magicButton-default-label-colour-dark font-magicButton-label-font font-magicButton-label-font-weight text-magicButton-label-font tracking-m"
        })
      }
    }
  }

  dynamic "browser_step" {
    for_each = var.stage == "develop" ? [1] : []
    content {
      name = "Click on offer"
      type = "click"
      params {
        element = jsonencode({
          "url" : "https://${var.host}/offers.php?type=1&opensearch=1&search=gym",
          "multiLocator" : {
            "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"img\"][1]",
            "at" : "/*[local-name()=\"html\"]/*[local-name()=\"body\"]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/descendant::*[@alt=\"\" and @loading=\"lazy\"]",
            "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" laptop:grid-cols-3 \")][1]/*[local-name()=\"div\"][1]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" !relative \")]",
            "co" : "[{\"relation\":\"BEFORE\",\"tagName\":\"IMG\",\"text\":\" online offerthe gym king\",\"textType\":\"innerText\"},{\"relation\":\"BEFORE\",\"tagName\":\"DIV\",\"text\":\"20% off full priced items\",\"textType\":\"innerText\"}]",
            "ro" : "//*[1]/*[1]/*[local-name()=\"div\"][1]/*[local-name()=\"img\"][1]",
            "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" laptop:grid-cols-3 \")][1]/*[local-name()=\"div\"][1]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" !relative \")]"
          },
          "targetOuterHTML" : "<img alt=\"\" loading=\"lazy\" width=\"0\" height=\"0\" decoding=\"async\" data-nimg=\"1\" class=\"h-auto w-full  !relative\" sizes=\"100vw\" srcset=\"https://cdn.bluelightcard.co.uk/cdn-cgi/image/width=640,quality=75 ..."
        })
      }
    }
  }

  dynamic "browser_step" {
    for_each = var.stage == "develop" ? [1] : []
    content {
      name = "Test div \"20% off full priced items Gym ...\" content"
      type = "assertElementContent"
      params {
        check = "contains"
        value = "20% off full priced items\n\nGym King are offering Blue Light card members"
        element = jsonencode({
          "url" : "https://www.bluelightcard.co.uk/search?issuer=&q=gym",
          "multiLocator" : {
            "ab" : "/*[local-name()=\"html\"][1]/*[local-name()=\"body\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][2]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]/*[local-name()=\"div\"][1]",
            "at" : "",
            "cl" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" bg-white \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" p-[24px_24px_14px_24px] \")]/*[local-name()=\"div\"][1]",
            "co" : "",
            "clt" : "/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" bg-white \")]/descendant::*[contains(concat(' ', normalize-space(@class), ' '), \" p-[24px_24px_14px_24px] \")]/*[local-name()=\"div\"][1]"
          },
          "targetOuterHTML" : "<div><div class=\"flex justify-center\"><img alt=\"The Gym King logo\" loading=\"lazy\" width=\"100\" height=\"64\" decoding=\"async\" data-nimg=\"1\" class=\"!relative object-contain object-center rounded ..."
        })
      }
    }
  }

  options_list {
    tick_every = 300
  }
}

resource "datadog_monitor" "synthetics_anomaly_detection_basic_user_flow" {
  name  = "Anomaly Detection for Basic User Flow Test - ${var.stage}"
  type  = "query alert"
  query = "avg(last_7m):anomalies(avg:synthetics.http.response_time{synthetics_test_id:datadog_synthetics_test.basic_user_flow.id}.as_count(), 'basic', 2, direction='both', alert_window='last_7m', interval=60, count_default_zero='true') > 0"
  # https://docs.datadoghq.com/monitors/notify/variables/?tab=is_alert#:~:text=template%20variables.-,Conditional%20variables,-Conditional%20variables%20use
  message            = <<-EOT
  {{#is_alert}}@webhook-${datadog_webhook.slack_basic_user_flow_errors_webhook.name}{{/is_alert}}
  {{#is_recovery}}@webhook-${datadog_webhook.slack_basic_user_flow_recovery_webhook.name}{{/is_recovery}}
  {{#is_renotify}}@webhook-${datadog_webhook.slack_basic_user_flow_recovery_webhook.name}{{/is_renotify}}
  {{#is_no_data}}@webhook-${datadog_webhook.slack_basic_user_flow_no-data_webhook.name}{{/is_no_data}}
  EOT
  escalation_message = "Please investigate the issue immediately."
  tags               = ["synthetics", "anomaly_detection"]
  priority           = 1

  monitor_thresholds {
    critical = 0
  }

  notify_no_data    = true
  renotify_interval = 60

  notify_audit = true
  timeout_h    = 0
}

resource "datadog_webhook" "slack_basic_user_flow_errors_webhook" {
  name           = "slack_basic_user_flow_errors_webhook_${var.stage}"
  url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
  encode_as      = "json"
  custom_headers = jsonencode({ "Content-type" : "application/json" })
  payload        = jsonencode({ "text" : "⚠️[${var.stage}] : Basic user flow : Anomaly detected" })
}

resource "datadog_webhook" "slack_basic_user_flow_recovery_webhook" {
  name           = "slack_basic_user_flow_recovery_webhook_${var.stage}"
  url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
  encode_as      = "json"
  custom_headers = jsonencode({ "Content-type" : "application/json" })
  payload        = jsonencode({ "text" : "✅[${var.stage}] : Basic user flow : Recovered" })
}

resource "datadog_webhook" "slack_basic_user_flow_renotify_webhook" {
  name           = "slack_basic_user_flow_renotify_webhook_${var.stage}"
  url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
  encode_as      = "json"
  custom_headers = jsonencode({ "Content-type" : "application/json" })
  payload        = jsonencode({ "text" : "🛑[${var.stage}] : Basic user flow : Please investigate the issue immediately" })
}

resource "datadog_webhook" "slack_basic_user_flow_no-data_webhook" {
  name           = "slack_basic_user_flow_no-data_webhook_${var.stage}"
  url            = "https://hooks.slack.com/services/${var.slack_webhook_id}"
  encode_as      = "json"
  custom_headers = jsonencode({ "Content-type" : "application/json" })
  payload        = jsonencode({ "text" : "[${var.stage}] : Basic user flow : No data" })
}



