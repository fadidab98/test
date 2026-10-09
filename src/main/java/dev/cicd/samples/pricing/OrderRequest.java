package dev.cicd.samples.pricing;

/** A request carrying a quantity entered as text. This class is valid Java 17. */
public final class OrderRequest {
    private final String quantity;

    public OrderRequest(String quantity) {
        this.quantity = quantity;
    }

    public String quantity() {
        return quantity;
    }
}
