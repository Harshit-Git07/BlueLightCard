# Docs for Terraform: BLC


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
| <a name="module_vpc"></a> [vpc](#module\_vpc) | git@github.com:bluelightcard/terraform-modules.git//aws/network/vpc | v1.3.0 |

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
| <a name="input_stage"></a> [stage](#input\_stage) | Stage name | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->