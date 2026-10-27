class Ledger { value() { return this.#hours; } }
export function total() {return new Ledger().value();}
