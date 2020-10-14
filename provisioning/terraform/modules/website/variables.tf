variable "namespace" {
  default = "ps2alerts"
}

variable "identifier" {
  default = "ps2alerts"
}

variable "environment" {
  default = "dev"
}

variable "urls" {}

variable "multi_urls" {}

variable "api_host" {
  default = "foo"
}

variable "api_token" {
  default = "foo"
}

variable "cpu_limit" {
  default = "250m"
}

variable "mem_limit" {
  default = "256Mi"
}

variable "cpu_request" {
  default = "250m"
}

variable "mem_request" {
  default = "256Mi"
}

# This therefore requires the CLI variable to be defined. If none is supplied it'll use this, which is wrong!
variable "checksum_version" {
  default = "UNKNOWN"
}