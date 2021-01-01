module "website_production" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "production"
  identifier       = "ps2alerts-website-production"
  urls             = ["www.ps2alerts.com", "ps2alerts.com"]
  multi_urls       = true
  checksum_version = var.checksum_version
  cpu_request      = "50m"
  mem_request      = "128Mi"
  cpu_limit        = "150m"
  mem_limit        = "128Mi"
  replicas         = 2
  dd_api_key       = var.dd_api_key
  dd_app_key       = var.dd_app_key
}
