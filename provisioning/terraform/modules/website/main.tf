resource "kubernetes_service" "ps2alerts_website_service" {
  metadata {
    name = var.identifier
    namespace = var.namespace
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
    namespace = var.namespace
    labels = {
      app = var.identifier
    }
  }
  spec {
    replicas = 2
    revision_history_limit = 1
    selector {
      match_labels = {
        app = var.identifier
      }
    }
    template {
      metadata {
        app = var.identifier
        environment = var.environment
      }
      spec {
        image_pull_secrets {
          name = "regcreg"
        }
        container {
          name = var.identifier
          image: concat("maelstromeous/applications:", var.identifier, "-", var.checksum_version)
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
        }
      }
    }
  }
}
