/** Sample-only demo numbers. Never treat as Verified operator dollars. */
export const SAMPLE_MOZZ = {
  label: "Mozzarella · same 20 lb case",
  previous: 48,
  latest: 56,
  delta: 8,
  honesty: "Sample" as const,
};

/**
 * Labor hours from the public sample walkthrough (screen map: Alex and Jordan,
 * unpaid break, $20/h and $18/h). Straight-time difference is math on those
 * rates: +2 h × $20 and −0.5 h × $18 = $31. Not a guessed payroll number.
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
  alexRate: 20,
  jordanRate: 18,
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

/** Fictional papers the free tools can paste. Same published figures as above. */
export const SAMPLE_INVOICE_EARLIER = `Vendor: Sample Foods
Date: 2026-09-04
Mozzarella cheese whole milk 20 lb case $48.00
`;

export const SAMPLE_INVOICE_LATER = `Vendor: Sample Foods
Date: 2026-09-18
Mozzarella cheese whole milk 20 lb case $56.00
`;

export const SAMPLE_RECIPE_PASTE = `House cheese pizza | sell $16.00
Whole milk mozzarella — $1.40
Prepared dough ball — $1.50
Prepared sauce — $0.70
Oil and seasoning — $0.40
`;

export const SAMPLE_SCHEDULE_PASTE = `Alex in 4:00pm out 9:00pm break 30 rate 20
Jordan in 5:00pm out 9:00pm break 0 rate 18
`;

export const SAMPLE_CLOCK_PASTE = `Alex in 4:00pm out 11:00pm break 30
Jordan in 5:00pm out 8:30pm break 0
`;

export function papersMatch(a: string, b: string): boolean {
  return a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim();
}
