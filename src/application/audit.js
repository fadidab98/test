export function auditEvent(type, subject, at = '2026-10-01T00:00:00.000Z') {
  return Object.freeze({ type, subject, at });
}
