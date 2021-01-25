terraform {
  backend "s3" {
    bucket = "ps2alerts"
    key    = "terraform/states/ps2alerts-website"
    region = "eu-west-2"
  }
}

data "digitalocean_kubernetes_cluster" "cluster" {
  name = "my-cluster"
}

provider "kubernetes" {
  host  = data.digitalocean_kubernetes_cluster.cluster.endpoint
  token = data.digitalocean_kubernetes_cluster.cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(
  data.digitalocean_kubernetes_cluster.cluster.kube_config[0].cluster_ca_certificate
  )
}
