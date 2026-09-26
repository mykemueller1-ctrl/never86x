/** Sample-only demo numbers. Never treat as Verified operator dollars. */
export const SAMPLE_MOZZ = {
  label: "Mozzarella · same 20 lb case",
  previous: 48,
  latest: 56,
  delta: 8,
  honesty: "Sample" as const,
};

/**
 * Labor hours from the public sample walkthrough.
 * Straight-time dollars are the published sample total.
 * Itemized rates are not on the sample schedule, so they stay Missing.
 */
export const SAMPLE_LABOR = {
  honesty: "Sample" as const,
  scheduleLabel: "Friday schedule",
  scheduleDate: "September 11",
  coverage: "Kitchen + front of house",
  plan: "Scheduled until 9",
  actual: "Stayed until 11",
  extraHours: 2,
  fewerHours: 0.5,
  netHours: 1.5,
  straightTimeDollars: 31,
  ratesHonesty: "Missing" as const,
};

/** Plate cost from the public sample recipe card. */
export const SAMPLE_PLATE = {
  honesty: "Sample" as const,
  name: "House cheese pizza",
  menuPrice: 16,
  ingredientCost: 4,
  ingredientPercent: 25,
  leftBeforeLabor: 12,
  lines: [
    { name: "Whole milk mozzarella", amount: 1.4, note: "per batch · usable" },
    { name: "Prepared dough ball", amount: 1.5, note: "each · purchased" },
    { name: "Prepared sauce portion", amount: 0.7, note: "per serving" },
    { name: "Oil and seasoning portion", amount: 0.4, note: "per serving" },
  ],
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
