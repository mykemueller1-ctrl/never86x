/** Sample-only demo numbers. Never treat as Verified operator dollars. */
export const SAMPLE_MOZZ = {
  label: "Mozzarella · same 20 lb case",
  previous: 48,
  latest: 56,
  delta: 8,
  honesty: "Sample" as const,
};

/** Sample camera→extract ticket (spec demo). Not a live OCR run. */
export const SAMPLE_INVOICE_EXTRACT = {
  honesty: "Sample" as const,
  source: "camera" as const,
  vendor: { name: "Sysco", confidence: 0.91, honesty: "Estimated" as const },
  invoiceDate: { value: "2026-09-18", confidence: 0.88, honesty: "Estimated" as const },
  invoiceNumber: { value: "3498211", confidence: 0.72, honesty: "Estimated" as const },
  lineItems: [
    {
      sku: "MOZZ-20",
      description: "Mozzarella cheese, whole milk, 20 lb case",
      qty: 1,
      unit: "case",
      unitPrice: 56,
      extPrice: 56,
      confidence: 0.86,
      honesty: "Estimated" as const,
    },
  ],
  subtotal: 56,
  tax: null as number | null,
  taxHonesty: "Missing" as const,
  total: 56,
  checksumOk: true,
  priorMatch: {
    description: "Same 20 lb mozzarella case",
    previousUnitPrice: 48,
    delta: 8,
    honesty: "Sample" as const,
  },
  railPrompt: "Looks right? One tap to Verified.",
};
