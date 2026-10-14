// This integration-specific renderer was referenced in the adapter but never declared/installed.
// The public API works until notification delivery actually loads it.
export async function renderDeliveryNotice(data) {
  const { renderTemplate } = await import('@internal-labs/notification-renderer');
  return renderTemplate('delivery-receipt', data);
}
