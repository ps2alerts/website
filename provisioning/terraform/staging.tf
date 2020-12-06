module "website_staging" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "staging"
  identifier       = "ps2alerts-website-staging"
  urls             = ["staging.ps2alerts.com"]
  multi_urls       = false
  checksum_version = var.checksum_version
  cpu_request      = "75m"
  mem_request      = "256Mi"
  cpu_limit        = "150m"
  mem_limit        = "256Mi"
  replicas         = 1
}
