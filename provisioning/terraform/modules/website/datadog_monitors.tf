resource datadog_monitor "website_not_running" {
  name = "PS2Alerts Website not running [${var.environment}]"
  type = "metric alert"
  query = "max(last_1m):avg:kubernetes.pods.running{kube_deployment:ps2alerts-website-${var.environment}} <= 0"
  message = templatefile("${path.module}/../../dd-monitor-message.tmpl", {environment: var.environment, application: "Website", description: "not running"})

  thresholds = {
    critical = 0
  }

  notify_no_data = true
  require_full_window = false
  no_data_timeframe = 10

  tags = jsondecode(templatefile("${path.module}/../../dd-tags.tmpl", {environment: var.environment, application: "website"}))
}

resource datadog_monitor "website_high_mem" {
  name = "PS2Alerts Website high memory [${var.environment}]"
  type = "metric alert"
  query = "max(last_5m):avg:kubernetes.memory.rss{kube_container_name:ps2alerts-website-${var.environment}} > 104858000"
  message = templatefile("${path.module}/../../dd-monitor-message.tmpl", {environment: var.environment, application: "Website", description: "high memory"})

  thresholds = {
    critical = 104858000 # 100MB
  }

  notify_no_data = true
  require_full_window = false
  no_data_timeframe = 10

  tags = jsondecode(templatefile("${path.module}/../../dd-tags.tmpl", {environment: var.environment, application: "website"}))
}

resource datadog_monitor "website_high_cpu" {
  name = "PS2Alerts Website high CPU [${var.environment}]"
  type = "metric alert"
  query = "avg(last_5m):avg:kubernetes.cpu.usage.total{kube_container_name:ps2alerts-website-${var.environment}} > 400000000"
  message = templatefile("${path.module}/../../dd-monitor-message.tmpl", {environment: var.environment, application: "Website", description: "high CPU"})

  thresholds = {
    critical = 400000000 // 0.4 CPU
  }

  notify_no_data = true
  require_full_window = false
  no_data_timeframe = 10

  tags = jsondecode(templatefile("${path.module}/../../dd-tags.tmpl", {environment: var.environment, application: "website"}))
}

resource datadog_monitor "website_high_errors" {
  name = "PS2Alerts Website high errors [${var.environment}]"
  type = "log alert"
  query = "logs(\"container_name:*website\\-${var.environment}* status:error\").index(\"*\").rollup(\"count\").last(\"10m\") > 5"
  message = templatefile("${path.module}/../../dd-monitor-message.tmpl", {environment: var.environment, application: "Website", description: "high errors"})

  thresholds = {
    critical = 5
  }

  notify_no_data = true
  require_full_window = false
  no_data_timeframe = 10

  tags = jsondecode(templatefile("${path.module}/../../dd-tags.tmpl", {environment: var.environment, application: "website"}))
}


resource datadog_monitor "website_high_restarts" {
  name = "PS2Alerts Website restarts [${var.environment}]"
  type = "query alert"
  query = "change(sum(last_5m),last_5m):avg:kubernetes.containers.restarts{kube_deployment:ps2alerts-website-${var.environment}} > 0.5"
  message = templatefile("${path.module}/../../dd-monitor-message.tmpl", {environment: var.environment, application: "Website", description: "restarts"})

  thresholds = {
    critical = 0.5
  }

  notify_no_data = true
  require_full_window = false
  no_data_timeframe = 10

  tags = jsondecode(templatefile("${path.module}/../../dd-tags.tmpl", {environment: var.environment, application: "website"}))
}
