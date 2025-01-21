resource "cloudflare_workers_kv_namespace" "NEXT_CACHE_WORKERS_KV" {
  account_id = var.cloudflare_account_id
  title      = "${var.project_name}-kv"
}