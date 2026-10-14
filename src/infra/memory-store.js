export class MemoryStore {
  #items = new Map();
  save(key, value) { this.#items.set(key, structuredClone(value)); }
  get(key) { const value = this.#items.get(key); return value === undefined ? null : structuredClone(value); }
  count() { return this.#items.size; }
}
