module "website_staging" {
  source             = "./modules/website"
  namespace          = "ps2alerts"
  environment        = "staging"
  identifier         = "ps2alerts-website-staging"
  url                = "staging.ps2alerts.com"
  checksum_version   = var.checksum_version
  api_host           = "api.staging.ps2alerts.com"
  api_token          = var.api_token
  cpu_limit          = "250m"
  mem_limit          = "128Mi"
  cpu_request        = "125m"
  mem_request        = "64Mi"
}
