variable "namespace" {
  default = "ps2alerts"
}

variable "identifier" {
  default = "ps2alerts"
}

variable "environment" {}
variable "urls" {}
variable "multi_urls" {}

variable "api_host" {}

variable "cpu_limit" {}
variable "mem_limit" {}
variable "cpu_request" {}
variable "mem_request" {}

variable "replicas" {}


# This therefore requires the CLI variable to be defined. If none is supplied it'll use this, which is wrong!
variable "checksum_version" {
  default = "UNKNOWN"
}

variable "application_version" {
  default = "UNKNOWN"
}
