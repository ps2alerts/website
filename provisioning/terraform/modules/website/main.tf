resource "kubernetes_namespace" "ps2alerts_website" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_service" "ps2alerts_website_service" {
  metadata {
    name = var.identifier
    namespace = kubernetes_namespace.ps2alerts_website.metadata[0].name
    labels = {
      app = var.identifier
      environment = var.environment
    }
  }
  spec {
    type = "ClusterIP"
    selector = {
      app = var.identifier
      environment = var.environment
    }
    port {
      port = 80
      target_port = 80
    }
  }
}

resource "kubernetes_deployment" "ps2alerts_website_deployment" {
  metadata {
    name = var.identifier
    namespace = kubernetes_namespace.ps2alerts_website.metadata[0].name
    labels = {
      app = var.identifier
      environment = var.environment
    }
  }
  spec {
    replicas = 2
    revision_history_limit = 1
    selector {
      match_labels = {
        app = var.identifier
        environment = var.environment
      }
    }
    template {
      metadata {
        labels = {
          app = var.identifier
          environment = var.environment
        }
      }
      spec {
        image_pull_secrets {
          name = "regcreg"
        }
        container {
          name = var.identifier
          image = join("", ["maelstromeous/applications:", var.identifier, "-", var.checksum_version])
          port {
            container_port = 80
          }
          env {
            name = "ENVIRONMENT"
            value = var.environment
          }
          env {
            name = "VERSION"
            value = var.checksum_version
          }
          env {
            name = "BASE_URL"
            value = var.url
          }
          env {
            name = "API_URL"
            value = var.api_url
          }
        }
      }
    }
  }
}

// TODO: Add LE Certificate Issuer - Currently unable as we're unable to push custom CRDs via Terraform! :'(
// https://github.com/hashicorp/terraform-provider-kubernetes/issues/215

resource "kubernetes_ingress" "ps2alerts_website_ingress" {
  metadata {
    name = var.identifier
    labels = {
      app = var.identifier
      environment = var.environment
    }
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer" = var.identifier
      "nginx.ingress.kubernetes.io/proxy-body-size" = "10m"
    }
  }
  spec {
    tls {
      hosts = [var.url]
      secret_name = var.identifier
    }
    rule {
      http {
        path {
          backend {
            service_name = var.identifier
            service_port = 80
          }
        }
      }
    }
  }
}
