export function createHealthReport({ serviceName, version, uptimeSeconds }) {
  return {
    service: serviceName,
    status: 'ok',
    version,
    uptime_seconds: Math.max(0, Math.floor(uptimeSeconds))
  };
}

export function isHealthy(report) {
  return report?.status === 'ok' && Boolean(report.service);
}
