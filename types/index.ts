// Webhook response types
export interface WebhookResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

// KPI Data Types
export interface CashOnHand {
  amount: number
  currency?: string
  lastUpdated?: string
  propertyId?: string
  propertyName?: string
}

export interface Occupancy {
  occupied: number
  total: number
  percentage: number
  propertyId?: string
  propertyName?: string
}

export interface Collections {
  collected: number
  expected: number
  percentage: number
  propertyId?: string
  propertyName?: string
}

export interface DebtRatio {
  ratio: number
  debt: number
  assets: number
  propertyId?: string
  propertyName?: string
  type?: 'location' | 'mortgage'
}

export interface KeyManagement {
  keysIssued: number
  keysReturned: number
  keysOutstanding: number
  propertyId?: string
  propertyName?: string
}

export interface VacancyLoss {
  vacantUnits: number
  totalUnits: number
  lossAmount: number
  percentage: number
  propertyId?: string
  propertyName?: string
}

export interface NOI {
  income: number
  expenses: number
  noi: number
  propertyId?: string
  propertyName?: string
}

export interface DaysOnMarket {
  averageDOM: number
  properties: number
  propertyId?: string
  propertyName?: string
}

export interface MoveInsClosings {
  moveIns: number
  closings: number
  projectedCash: number
  propertyId?: string
  propertyName?: string
}

export interface ExpenseRatio {
  ratio: number
  expenses: number
  income: number
  propertyId?: string
  propertyName?: string
}

export interface CapexBudget {
  budget: number
  actual: number
  variance: number
  percentage: number
  propertyId?: string
  propertyName?: string
}

export interface OpsBudget {
  budget: number
  actual: number
  variance: number
  percentage: number
  propertyId?: string
  propertyName?: string
}

export interface UtilityRecapture {
  recaptured: number
  expected: number
  percentage: number
  propertyId?: string
  propertyName?: string
}

export interface Property {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  role?: string
}

// Aggregated data types
export type KPIData = 
  | CashOnHand
  | Occupancy
  | Collections
  | DebtRatio
  | KeyManagement
  | VacancyLoss
  | NOI
  | DaysOnMarket
  | MoveInsClosings
  | ExpenseRatio
  | CapexBudget
  | OpsBudget
  | UtilityRecapture

export interface DashboardData {
  cashOnHand: CashOnHand[]
  occupancy: Occupancy[]
  collections: Collections[]
  debtRatioLocation: DebtRatio[]
  debtRatioMortgage: DebtRatio[]
  keyManagement: KeyManagement[]
  vacancyLoss: VacancyLoss[]
  noi: NOI[]
  daysOnMarket: DaysOnMarket[]
  moveInsClosings: MoveInsClosings[]
  expenseRatio: ExpenseRatio[]
  capexBudget: CapexBudget[]
  opsBudget: OpsBudget[]
  utilityRecapture: UtilityRecapture[]
  properties: Property[]
}


