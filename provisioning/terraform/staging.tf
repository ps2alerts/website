module "website_staging" {
  source           = "./modules/website"
  namespace        = "ps2alerts"
  environment      = "staging"
  identifier       = "ps2alerts-website-staging"
  url              = "staging.ps2alerts.com"
  api_url          = "api.staging.ps2alerts.com"
  checksum_version = var.checksum_version
}
