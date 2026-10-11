"use strict";

function total(values) {
  if (!Array.isArray(values)) throw new TypeError("values must be an array");
  return values.reduce((sum, value) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError("all values must be finite numbers");
    }
    return sum + value;
  }, 0);
}

module.exports = { total };
