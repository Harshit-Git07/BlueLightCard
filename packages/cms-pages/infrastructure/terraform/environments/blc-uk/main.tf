locals {
  app   = "blc-mono-cms-pages"

  my_workspace_env = var.TFC_WORKSPACE_NAME != "" ? trimprefix(var.TFC_WORKSPACE_NAME, "${local.app}-${var.brand}-") : terraform.workspace
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "cms_pages" {
  source = "../../shared/cloudflare/pages/cms-pages"
  sanity_token              = var.sanity_token
  sanity_project_id         = var.sanity_project_id
  cloudflare_account_id     = var.cloudflare_account_id
  cloudflare_api_token      = var.cloudflare_api_token
  cloudflare_zone_id        = var.cloudflare_zone_id
  dataset_name              = var.dataset_name
  domain_host               = "blcshine.io"
  subdomain_prefix          = var.brand
  subdomain_suffix          = var.stage
  project_name              = "blc-mono-${var.brand}-cms-pages-${var.stage}"
}

output "kv_namespace_id" {
  value = module.cms_pages.cloudflare_workers_kv_namespace_id
}
