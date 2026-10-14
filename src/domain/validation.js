export function nonEmpty(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} must be nonempty`);
  return value.trim();
}
export function positiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
  return value;
}
