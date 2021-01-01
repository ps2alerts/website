module "website_staging" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "staging"
  identifier       = "ps2alerts-website-staging"
  urls             = ["staging.ps2alerts.com"]
  multi_urls       = false
  checksum_version = var.checksum_version
  cpu_request      = "250m"
  mem_request      = "128Mi"
  cpu_limit        = "500m"
  mem_limit        = "128Mi"
  replicas         = 1
  dd_api_key       = var.dd_api_key
  dd_app_key       = var.dd_app_key
}
