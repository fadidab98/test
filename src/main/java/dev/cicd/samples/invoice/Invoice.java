package dev.cicd.samples.invoice;

/** A valid Java 17 domain class. */
public final class Invoice {
    private final int subtotalCents;
    private final int taxCents;

    public Invoice(int subtotalCents, int taxCents) {
        this.subtotalCents = subtotalCents;
        this.taxCents = taxCents;
    }

    public int calculateTotalCents() {
        return subtotalCents + taxCents;
    }
}
