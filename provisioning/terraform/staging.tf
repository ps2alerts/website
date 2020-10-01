module "website_staging" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "staging"
  identifier       = "ps2alerts-website-staging"
  urls             = ["staging.ps2alerts.com"]
  multi_urls       = false
  checksum_version = var.checksum_version
  api_host         = "staging.api.ps2alerts.com"
  api_token        = var.api_token
  cpu_request      = "25m"
  mem_request      = "32Mi"
  cpu_limit        = "150m"
  mem_limit        = "64Mi"
}
