terraform {
  backend "s3" {
    bucket = "ps2alerts"
    key    = "terraform/states/ps2alerts-website"
    region = "eu-west-2"
  }
}

provider "kubernetes" {
  config_path = var.config_path
}
