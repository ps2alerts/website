terraform {
  required_providers {
    digitalocean = {
      source = "terraform-providers/digitalocean"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    datadog = {
      source = "DataDog/datadog"
    }
  }
  required_version = ">= 0.13"
}
