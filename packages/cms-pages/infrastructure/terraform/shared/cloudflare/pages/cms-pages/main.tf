module "cms_pages" {
  source                = "../../../../modules/cloudflare/pages"
  branch_name           = var.branch_name
  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_api_token  = var.cloudflare_api_token
  cloudflare_zone_id    = var.cloudflare_zone_id
  domain_name           = "${var.subdomain_prefix}-cms-pages${var.subdomain_suffix}.${var.domain_host}"
  environment_variables = local.cms_pages_env
  project_name          = var.project_name
  repo_name             = var.repo_name
  repo_owner            = var.repo_owner
  root_dir              = var.root_dir
}
