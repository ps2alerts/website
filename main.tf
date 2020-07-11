terraform {
  backend "s3" {
    bucket = "ps2alerts"
    key    = "terraform/states/ps2alerts"
    region = "eu-west-2"
  }
}

data "digitalocean_kubernetes_cluster" "cluster" {
  name = "my-cluster"
}

provider "kubernetes" {
  load_config_file = false
  host             = data.digitalocean_kubernetes_cluster.cluster.endpoint
  token            = data.digitalocean_kubernetes_cluster.cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(
    data.digitalocean_kubernetes_cluster.cluster.kube_config[0].cluster_ca_certificate
  )
}

resource "digitalocean_kubernetes_cluster" "mycluster" {
  name    = "my-cluster"
  region  = "lon1"
  version = "1.17.6-do.0"

  node_pool {
    name       = "web-pool"
    size       = "s-1vcpu-2gb"
    node_count = 2
    min_nodes  = 1
    max_nodes  = 3
  }
}

module "website_staging" {
  source           = "./provisioning/terraform/modules/website"
  namespace        = "ps2alerts-website"
  environment      = "staging"
  identifier       = "ps2alerts-website-staging"
  url              = "staging.ps2alerts.com"
  api_url          = "api.staging.ps2alerts.com"
  checksum_version = var.checksum_version
}
