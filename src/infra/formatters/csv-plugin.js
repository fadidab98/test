// Deliberate source syntax defect in an optional CSV plugin.
export function renderCsv(rows) {
  return rows.map(row => `${row.id},${row.event,${row.sequence}`).join('\n');
}
