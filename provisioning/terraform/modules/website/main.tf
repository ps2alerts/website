resource "kubernetes_service" "ps2alerts_website_service" {
  metadata {
    name      = var.identifier
    namespace = var.namespace
    labels = {
      app         = var.identifier
      environment = var.environment
    }
  }
  spec {
    type = "ClusterIP"
    selector = {
      app         = var.identifier
      environment = var.environment
    }
    port {
      port        = 80
      target_port = 80
    }
  }
}

resource "kubernetes_deployment" "ps2alerts_website_deployment" {
  metadata {
    name      = var.identifier
    namespace = var.namespace
    labels = {
      app         = var.identifier
      environment = var.environment
    }
  }
  lifecycle {
    ignore_changes = ["spec[0].replicas"]
  }
  spec {
    replicas               = var.replicas
    revision_history_limit = 3
    selector {
      match_labels = {
        app         = var.identifier
        environment = var.environment
      }
    }
    template {
      metadata {
        labels = {
          app         = var.identifier
          environment = var.environment
        }
      }
      spec {
        image_pull_secrets {
          name = "regcred"
        }
        container {
          name  = var.identifier
          image = join("", ["maelstromeous/applications:", var.identifier, "-", var.environment, "-", var.checksum_version])
          liveness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 15
            success_threshold     = 1
            failure_threshold     = 4
            timeout_seconds       = 15
          }
          readiness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 15
            period_seconds        = 5
            success_threshold     = 1
            failure_threshold     = 4
            timeout_seconds       = 5
          }
          resources {
            limits = {
              cpu    = var.cpu_limit
              memory = var.mem_limit
            }
            requests = {
              cpu    = var.cpu_request
              memory = var.mem_request
            }
          }
          port {
            container_port = 443
          }
        }
      }
    }
  }
}

resource "kubernetes_ingress" "ps2alerts_website_ingress" {
  count = var.multi_urls ? 0 : 1
  metadata {
    name      = var.identifier
    namespace = var.namespace
    labels = {
      app         = var.identifier
      environment = var.environment
    }
    annotations = {
      "kubernetes.io/ingress.class"                 = "nginx"
      "cert-manager.io/cluster-issuer"              = var.identifier
      "nginx.ingress.kubernetes.io/proxy-body-size" = "10m"
    }
  }
  spec {
    backend {
      service_name = kubernetes_service.ps2alerts_website_service.metadata[0].name
      service_port = kubernetes_service.ps2alerts_website_service.spec[0].port[0].port
    }
    tls {
      hosts       = var.urls
      secret_name = var.identifier
    }
    rule {
      host = var.urls[0]
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

resource "kubernetes_ingress" "ps2alerts_website_ingress_multi" {
  count = var.multi_urls ? 1 : 0
  metadata {
    name      = var.identifier
    namespace = var.namespace
    labels = {
      app         = var.identifier
      environment = var.environment
    }
    annotations = {
      "kubernetes.io/ingress.class"                 = "nginx"
      "cert-manager.io/cluster-issuer"              = var.identifier
      "nginx.ingress.kubernetes.io/proxy-body-size" = "10m"
    }
  }
  spec {
    backend {
      service_name = kubernetes_service.ps2alerts_website_service.metadata[0].name
      service_port = kubernetes_service.ps2alerts_website_service.spec[0].port[0].port
    }
    tls {
      hosts       = var.urls
      secret_name = var.identifier
    }
    rule {
      host = var.urls[0]
      http {
        path {
          backend {
            service_name = var.identifier
            service_port = 80
          }
        }
      }
    }
    rule {
      host = var.urls[1]
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
