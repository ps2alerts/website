module "website_staging" {
  source              = "./modules/website"
  namespace           = "ps2alerts"
  environment         = "staging"
  identifier          = "ps2alerts-website-staging"
  urls                = ["staging.ps2alerts.com"]
  base_url            = "staging.ps2alerts.com"
  multi_urls          = false
  checksum_version    = var.checksum_version
  application_version = 'v3.0.0-prealpha'
  api_host            = 'https://staging.api.ps2alerts.com'
  cpu_request         = "75m"
  mem_request         = "256Mi"
  cpu_limit           = "150m"
  mem_limit           = "256Mi"
  replicas            = 1
}
