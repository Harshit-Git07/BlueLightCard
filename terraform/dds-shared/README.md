# Docs for Terraform: DDS


<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.9.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.73.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.73.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_bastionhost"></a> [bastionhost](#module\_bastionhost) | git@github.com:bluelightcard/terraform-modules.git//aws/ec2/bastionhost | v1.6.4 |
| <a name="module_firehose_streams"></a> [firehose\_streams](#module\_firehose\_streams) | git@github.com:bluelightcard/terraform-modules.git//aws/firehose | v1.6.4 |
| <a name="module_vpc"></a> [vpc](#module\_vpc) | git@github.com:bluelightcard/terraform-modules.git//aws/network/vpc | v1.6.4 |

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_cloudwatch_event_bus.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_bus) | resource |
| [aws_wafv2_web_acl.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_TFC_WORKSPACE_NAME"></a> [TFC\_WORKSPACE\_NAME](#input\_TFC\_WORKSPACE\_NAME) | An error occurs when you are running TF backend other than Terraform Cloud | `string` | `""` | no |
| <a name="input_aws_acm_domain_name"></a> [aws\_acm\_domain\_name](#input\_aws\_acm\_domain\_name) | AWS ACM Domain Name | `string` | `"*.blcshine.io"` | no |
| <a name="input_aws_availability_zones"></a> [aws\_availability\_zones](#input\_aws\_availability\_zones) | AWS Region | `list(string)` | <pre>[<br/>  "eu-west-2a",<br/>  "eu-west-2b",<br/>  "eu-west-2c"<br/>]</pre> | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS Region | `string` | `"eu-west-2"` | no |
| <a name="input_aws_wafv2_web_acl_name"></a> [aws\_wafv2\_web\_acl\_name](#input\_aws\_wafv2\_web\_acl\_name) | TEMPORARY: AWS WAF WebACL name | `string` | n/a | yes |
| <a name="input_firehose_config"></a> [firehose\_config](#input\_firehose\_config) | Temporary: stream-specific configurations for each Firehose stream, including log group, log stream, IAM role, and IAM policy. | <pre>object({<br/>    compAppClick = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>    compAppView = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>    compClick = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>    compView = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>    redemption = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>    vault = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>    vaultIntegrationCallback = object({<br/>      destination   = string<br/>      iam_policy    = string<br/>      iam_role      = string<br/>      log_group     = string<br/>      log_stream    = string<br/>      stream_config = any<br/>    })<br/>  })</pre> | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage name | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->