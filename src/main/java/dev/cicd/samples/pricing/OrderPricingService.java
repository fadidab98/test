package dev.cicd.samples.pricing;

/** Demonstrates a deliberately incorrect assignment between Java types. */
public final class OrderPricingService {
    public int totalCents(OrderRequest request) {
        // INTENTIONAL COMPILE ERROR: quantity() returns String, not int.
        int quantity = request.quantity();
        return quantity * 1299;
    }
}
