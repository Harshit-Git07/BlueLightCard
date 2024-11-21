module "cms_pages" {
  source      = "../../../modules/amplify"
  app_name    = var.preview_app_name
  branch_name = var.branch_name
  build_spec  = var.preview_build_spec
  domain_name = "${var.subdomain_prefix}-preview${var.subdomain_suffix}${var.domain_host}"
  environment = local.cms_pages_env
  repository  = "https://github.com/bluelightcard/BlueLightCard-2.0.git"
  token       = var.token
  amplify_role_arn = var.amplify_role_arn
}
