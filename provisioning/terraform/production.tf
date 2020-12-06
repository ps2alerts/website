module "website_staging" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "production"
  identifier       = "ps2alerts-website-production"
  urls             = ["www.ps2alerts.com", "ps2alerts.com"]
  multi_urls       = true
  checksum_version = var.checksum_version
  cpu_request      = "75m"
  mem_request      = "256Mi"
  cpu_limit        = "150m"
  mem_limit        = "256Mi"
  replicas         = 2
}
