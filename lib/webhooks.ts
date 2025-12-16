// Webhook endpoints configuration
export const WEBHOOK_BASE_URL = 'https://tsc-jt.app.n8n.cloud/webhook'

export const WEBHOOK_ENDPOINTS = {
  authenticate: `${WEBHOOK_BASE_URL}/authenticate`,
  users: `${WEBHOOK_BASE_URL}/users`,
  passwordChangeNotice: `${WEBHOOK_BASE_URL}/Notice-of-Password-Change`,
  cashOnHand: `${WEBHOOK_BASE_URL}/cash-on-hand-nrt`,
  occupancy: `${WEBHOOK_BASE_URL}/occupancy`,
  collections: `${WEBHOOK_BASE_URL}/collections`,
  debtRatioLocation: `${WEBHOOK_BASE_URL}/debt-ratio-location`,
  debtRatioMortgage: `${WEBHOOK_BASE_URL}/debt-ratio-location`, // Note: Same endpoint as location per user's spec
  keyManagement: `${WEBHOOK_BASE_URL}/key-management`,
  vacancyLoss: `${WEBHOOK_BASE_URL}/vacancy-loss`,
  noi: `${WEBHOOK_BASE_URL}/noi`,
  daysOnMarket: `${WEBHOOK_BASE_URL}/sales-days-on-market`,
  moveInsClosings: `${WEBHOOK_BASE_URL}/sales-move-ins-closing`,
  expenseRatio: `${WEBHOOK_BASE_URL}/exp-ratio`,
  capexBudget: `${WEBHOOK_BASE_URL}/capex-budgets-nrt`,
  opsBudget: `${WEBHOOK_BASE_URL}/ops-budget-vs-actual`,
  utilityRecapture: `${WEBHOOK_BASE_URL}/utility-recapture`,
} as const

// List of webhooks to call on refresh (excluding user/auth)
export const DATA_WEBHOOKS = [
  'cashOnHand',
  'occupancy',
  'collections',
  'debtRatioLocation',
  'debtRatioMortgage',
  'keyManagement',
  'vacancyLoss',
  'noi',
  'daysOnMarket',
  'moveInsClosings',
  'expenseRatio',
  'capexBudget',
  'opsBudget',
  'utilityRecapture',
] as const

export type WebhookKey = keyof typeof WEBHOOK_ENDPOINTS

