terraform {
  required_providers {
    digitalocean = {
      source = "terraform-providers/digitalocean"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
  required_version = ">= 0.13"
}
