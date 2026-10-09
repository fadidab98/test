package dev.cicd.samples.invoice;

/** Intentionally contains exactly one unresolved Java method reference. */
public final class InvoiceService {
    public int amountDueCents(Invoice invoice) {
        // INTENTIONAL BUG: Invoice defines calculateTotalCents(), not totalCents().
        return invoice.totalCents();
    }
}
