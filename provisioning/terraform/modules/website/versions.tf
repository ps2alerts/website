terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    datadog = {
      source  = "DataDog/datadog"
    }
  }
  required_version = ">= 0.13"
}
