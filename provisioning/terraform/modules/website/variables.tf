variable "namespace" {
  default = "ps2alerts"
}

variable "identifier" {
  default = "ps2alerts"
}

variable "environment" {}
variable "urls" {}
variable "multi_urls" {}

variable "api_token" {
  default = "foo"
}

variable "cpu_limit" {
  default = "250m"
}

variable "mem_limit" {
  default = "2Gi"
}

variable "cpu_request" {
  default = "250m"
}

variable "mem_request" {
  default = "2Gi"
}

variable "replicas" {}

variable "base_url" {
  default = "http://dev.ps2alerts.com"
}

# This therefore requires the CLI variable to be defined. If none is supplied it'll use this, which is wrong!
variable "checksum_version" {
  default = "UNKNOWN"
}

variable "application_version" {
  default = "UNKNOWN"
}
