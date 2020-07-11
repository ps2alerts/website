module "website_production" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "production"
  identifier       = "ps2alerts-website-production"
  url              = "ps2alerts.com"
  api_url          = "api.ps2alerts.com"
  checksum_version = var.checksum_version
}
