module "website_production" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "production"
  identifier       = "ps2alerts-website-production"
  urls             = ["ps2alerts.com", "www.ps2alerts.com"]
  multi_urls       = true
  checksum_version = var.checksum_version
  api_host         = "api.ps2alerts.com"
  api_token        = var.api_token
  cpu_request      = "100m"
  mem_request      = "64Mi"
  cpu_limit        = "150m"
  mem_limit        = "64Mi"
  replicas         = 2
}
