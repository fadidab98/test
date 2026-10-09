package dev.cicd.samples.pricing;

public final class OrderPricingService {
    public int totalCents(int quantity, int unitPriceCents) {
        return quantity * unitPriceCents;
    }

    // Intentionally duplicated signature for a controlled compilation failure.
    public int totalCents(int quantity, int unitPriceCents) {
        return quantity * unitPriceCents;
    }
}
