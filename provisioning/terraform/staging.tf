module "website_staging" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "staging"
  identifier       = "ps2alerts-website-staging"
  urls             = ["staging.ps2alerts.com"]
  multi_urls       = false
  checksum_version = var.checksum_version
  cpu_request      = "25m"
  mem_request      = "128Mi"
  cpu_limit        = "50m"
  mem_limit        = "128Mi"
  replicas         = 1
}
