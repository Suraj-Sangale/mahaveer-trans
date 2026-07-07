// ─────────────────────────────────────────────────────────
// quote.js — data & pure helper functions for the QuoteForm
// (no React here — keeps the component focused on UI/state)
// ─────────────────────────────────────────────────────────

export const SERVICES = {
  air: {
    key: 'air',
    name: 'Air Freight',
    icon: '✈️',
    desc: 'Time-critical, global. Next-flight-out available.',
    base: 4500,
    unit: 'per kg',
    transit: '1–3 days',
    carbon: 'High',
    sla: 'Express',
  },
  ocean: {
    key: 'ocean',
    name: 'Sea Freight',
    icon: '🚢',
    desc: 'FCL & LCL, cost-effective for bulk cargo.',
    base: 35000,
    unit: 'per container',
    transit: '14–28 days',
    carbon: 'Low',
    sla: 'Standard',
  },
  road: {
    key: 'road',
    name: 'Road Transport',
    icon: '🚛',
    desc: 'FTL & LTL, GPS-tracked nationwide network.',
    base: 12000,
    unit: 'per trip',
    transit: '1–5 days',
    carbon: 'Medium',
    sla: 'Standard',
  },
  cold: {
    key: 'cold',
    name: 'Cold Chain',
    icon: '❄️',
    desc: 'Pharma & food, real-time temp monitoring.',
    base: 8500,
    unit: 'per pallet/day',
    transit: '2–7 days',
    carbon: 'Medium',
    sla: 'GDP Cert.',
  },
  warehouse: {
    key: 'warehouse',
    name: 'Warehousing & 3PL',
    icon: '🏭',
    desc: 'Smart storage with WMS integration & fulfilment.',
    base: 18,
    unit: 'per sq.ft/mo',
    transit: 'Same-day disp.',
    carbon: 'Minimal',
    sla: '3PL',
  },
  lastmile: {
    key: 'lastmile',
    name: 'Last Mile Delivery',
    icon: '🛵',
    desc: 'Urban e-commerce delivery, live tracking link.',
    base: 49,
    unit: 'per delivery',
    transit: 'Same/Next day',
    carbon: 'Low',
    sla: 'B2C',
  },
};

export const SERVICE_LIST = Object.values(SERVICES);

export const TICKER_ITEMS = [
  'Air Freight', 'Ocean Shipping', 'Road Transport', 'Cold Chain',
  'Customs Clearance', 'Warehousing & 3PL', 'Last Mile Delivery',
  'Express Courier', 'Reverse Logistics', 'Hazmat Handling',
  'FTL & LTL', 'FCL & LCL',
];

export const COMMODITY_OPTIONS = [
  'General cargo', 'Pharmaceuticals / Biotech', 'Perishable food',
  'Electronics & technology', 'Automotive parts', 'Apparel & textiles',
  'Chemicals (non-hazmat)', 'Hazardous materials (IMDG/IATA)',
  'Industrial machinery', 'Construction materials', 'Other',
];

export const PACKAGING_OPTIONS = [
  'Pallets (EUR 120×80cm)', 'Pallets (custom size)', 'Cartons / boxes',
  'Drums / barrels', 'Crates / wooden boxes', 'Loose / bulk',
  'Full container (FCL)', 'Bags / sacks', 'Reels / rolls',
];

export const SPECIAL_HANDLING_OPTIONS = [
  'Fragile / handle with care', 'Hazardous (DG)', 'Stack restrict',
  'Oversize / OOG', 'Temperature-controlled',
];

export const PICKUP_OPTIONS = [
  'Door pickup (from my address)', 'Port / terminal drop-off', 'From MahaveerTrans warehouse',
];

export const DELIVERY_OPTIONS = [
  'Door delivery (to recipient address)', 'Port / terminal pickup', 'To MahaveerTrans warehouse',
];

export const FREQUENCY_OPTIONS = [
  'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Ad-hoc / as needed',
];

export const INCOTERMS = ['EXW', 'FOB', 'CIF', 'DDP', 'DAP', 'FCA', 'CPT', 'CIP'];

export const ADDONS = [
  { key: 'insurance', name: 'Cargo Insurance', icon: '🔒', price: 3500, desc: "Full replacement value via Lloyd's underwriters · 0.15% of cargo value" },
  { key: 'customs', name: 'Customs Clearance', icon: '📋', price: 1200, desc: 'Full import/export documentation & duty filing at both ends' },
  { key: 'tracking', name: 'Premium Live Tracking', icon: '📍', price: 800, desc: '5-minute GPS pings, WhatsApp & email alerts, shareable link' },
  { key: 'fulfilment', name: 'Pick, Pack & Label', icon: '🏷️', price: 2200, desc: 'Warehouse fulfilment — we pick, pack, label & dispatch for you' },
];

export const URGENCY_COUNTS = [41, 47, 53, 38, 62, 44];

export const STEP_PROGRESS = [5, 30, 55, 80, 100];

// ── helpers ──────────────────────────────────────────────

export function formatINR(n) {
  return Math.round(n).toLocaleString('en-IN');
}

/**
 * Mirrors the pricing formula from the original inline <script>.
 */
export function calcEstimate(serviceKey, weightKg, addonTotal = 0) {
  const svc = SERVICES[serviceKey];
  if (!svc) return 0;
  const w = Number(weightKg) > 0 ? Number(weightKg) : 1;
  let est;
  switch (serviceKey) {
    case 'air':
      est = svc.base * Math.max(w, 1);
      break;
    case 'ocean':
      est = svc.base;
      break;
    case 'road':
      est = svc.base + (w > 500 ? (w - 500) * 15 : 0);
      break;
    case 'cold':
      est = svc.base * Math.ceil(w / 600);
      break;
    case 'warehouse':
      est = svc.base * 100;
      break;
    default:
      est = svc.base * Math.max(w, 1);
  }
  return est + addonTotal;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Builds the next 5 selectable dates (starting tomorrow), plus a
 * trailing "custom" option — matching the original date strip.
 */
export function buildDateOptions() {
  const now = new Date();
  const options = [];
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    options.push({
      id: d.toLocaleDateString(),
      day: d.getDate(),
      label: `${WEEKDAY_LABELS[d.getDay()]} ${MONTH_LABELS[d.getMonth()]}`,
    });
  }
  options.push({ id: 'custom', day: null, label: 'Pick date' });
  return options;
}

export function pickRandomUrgencyCount() {
  return URGENCY_COUNTS[Math.floor(Math.random() * URGENCY_COUNTS.length)];
}

export function generateReference() {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 90000 + 10000);
  return `#MT-${year}-${num}`;
}