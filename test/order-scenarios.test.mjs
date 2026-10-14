import test from 'node:test';
import assert from 'node:assert/strict';
import { orderSummary } from '../src/order-service.mjs';
import { loadScenarios } from './support/scenario-loader.mjs';

test('configured order scenarios match totals', async (t) => {
  const scenarios = await loadScenarios();
  for (const scenario of scenarios) {
    await t.test(scenario.name, () => {
      assert.equal(orderSummary(scenario.order).subtotalCents, scenario.expectedSubtotalCents);
    });
  }
});
