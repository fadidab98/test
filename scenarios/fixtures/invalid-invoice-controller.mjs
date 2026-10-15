// INTENTIONALLY INVALID: only tools/build.mjs loads this source for scenario=compilation.
// Do not fix the syntax. It is a reproducible parser/compiler diagnostic benchmark.
export function calculateInvoice(lines) {
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  return { total, currency: 'EUR';
}
