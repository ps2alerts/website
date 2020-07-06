variable "namespace" {
  default = "ps2alerts"
}

variable "identifier" {
  default = "ps2alerts"
}

variable "environment" {
  default = "dev"
}

variable "url" {
  default = "https://ps2alerts.com"
}

variable "api_url" {
  default = "https://api.ps2alerts.com"
}

# This therefore requires the CLI variable to be defined or this module will fail! (which is a good thing)
variable "checksum_version" {
  default = "0.0.1"
}
