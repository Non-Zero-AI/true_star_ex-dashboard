import type {
  CashOnHand,
  Occupancy,
  Collections,
  DebtRatio,
  KeyManagement,
  VacancyLoss,
  NOI,
  DaysOnMarket,
  MoveInsClosings,
  ExpenseRatio,
  CapexBudget,
  OpsBudget,
  UtilityRecapture,
} from '@/types'

// Helper function to filter data by property
export function filterByProperty<T extends { propertyId?: string }>(
  data: T[],
  propertyId: string | null
): T[] {
  if (!propertyId || propertyId === 'all') {
    return data
  }
  return data.filter((item) => item.propertyId === propertyId)
}

// Aggregation functions
export function aggregateCashOnHand(data: CashOnHand[]): CashOnHand {
  const total = data.reduce((sum, item) => sum + (item.amount || 0), 0)
  return {
    amount: total,
    currency: data[0]?.currency || 'USD',
    lastUpdated: new Date().toISOString(),
  }
}

export function aggregateOccupancy(data: Occupancy[]): Occupancy {
  const total = data.reduce((sum, item) => sum + (item.total || 0), 0)
  const occupied = data.reduce((sum, item) => sum + (item.occupied || 0), 0)
  return {
    occupied,
    total,
    percentage: total > 0 ? (occupied / total) * 100 : 0,
  }
}

export function aggregateCollections(data: Collections[]): Collections {
  const collected = data.reduce((sum, item) => sum + (item.collected || 0), 0)
  const expected = data.reduce((sum, item) => sum + (item.expected || 0), 0)
  return {
    collected,
    expected,
    percentage: expected > 0 ? (collected / expected) * 100 : 0,
  }
}

export function aggregateDebtRatio(data: DebtRatio[]): DebtRatio {
  const debt = data.reduce((sum, item) => sum + (item.debt || 0), 0)
  const assets = data.reduce((sum, item) => sum + (item.assets || 0), 0)
  return {
    ratio: assets > 0 ? (debt / assets) * 100 : 0,
    debt,
    assets,
    type: data[0]?.type,
  }
}

export function aggregateKeyManagement(data: KeyManagement[]): KeyManagement {
  const keysIssued = data.reduce((sum, item) => sum + (item.keysIssued || 0), 0)
  const keysReturned = data.reduce((sum, item) => sum + (item.keysReturned || 0), 0)
  return {
    keysIssued,
    keysReturned,
    keysOutstanding: keysIssued - keysReturned,
  }
}

export function aggregateVacancyLoss(data: VacancyLoss[]): VacancyLoss {
  const vacantUnits = data.reduce((sum, item) => sum + (item.vacantUnits || 0), 0)
  const totalUnits = data.reduce((sum, item) => sum + (item.totalUnits || 0), 0)
  const lossAmount = data.reduce((sum, item) => sum + (item.lossAmount || 0), 0)
  return {
    vacantUnits,
    totalUnits,
    lossAmount,
    percentage: totalUnits > 0 ? (vacantUnits / totalUnits) * 100 : 0,
  }
}

export function aggregateNOI(data: NOI[]): NOI {
  const income = data.reduce((sum, item) => sum + (item.income || 0), 0)
  const expenses = data.reduce((sum, item) => sum + (item.expenses || 0), 0)
  return {
    income,
    expenses,
    noi: income - expenses,
  }
}

export function aggregateDaysOnMarket(data: DaysOnMarket[]): DaysOnMarket {
  const totalDOM = data.reduce((sum, item) => sum + (item.averageDOM || 0) * (item.properties || 1), 0)
  const totalProperties = data.reduce((sum, item) => sum + (item.properties || 1), 0)
  return {
    averageDOM: totalProperties > 0 ? totalDOM / totalProperties : 0,
    properties: totalProperties,
  }
}

export function aggregateMoveInsClosings(data: MoveInsClosings[]): MoveInsClosings {
  const moveIns = data.reduce((sum, item) => sum + (item.moveIns || 0), 0)
  const closings = data.reduce((sum, item) => sum + (item.closings || 0), 0)
  const projectedCash = data.reduce((sum, item) => sum + (item.projectedCash || 0), 0)
  return {
    moveIns,
    closings,
    projectedCash,
  }
}

export function aggregateExpenseRatio(data: ExpenseRatio[]): ExpenseRatio {
  const expenses = data.reduce((sum, item) => sum + (item.expenses || 0), 0)
  const income = data.reduce((sum, item) => sum + (item.income || 0), 0)
  return {
    ratio: income > 0 ? (expenses / income) * 100 : 0,
    expenses,
    income,
  }
}

export function aggregateCapexBudget(data: CapexBudget[]): CapexBudget {
  const budget = data.reduce((sum, item) => sum + (item.budget || 0), 0)
  const actual = data.reduce((sum, item) => sum + (item.actual || 0), 0)
  return {
    budget,
    actual,
    variance: actual - budget,
    percentage: budget > 0 ? ((actual - budget) / budget) * 100 : 0,
  }
}

export function aggregateOpsBudget(data: OpsBudget[]): OpsBudget {
  const budget = data.reduce((sum, item) => sum + (item.budget || 0), 0)
  const actual = data.reduce((sum, item) => sum + (item.actual || 0), 0)
  return {
    budget,
    actual,
    variance: actual - budget,
    percentage: budget > 0 ? ((actual - budget) / budget) * 100 : 0,
  }
}

export function aggregateUtilityRecapture(data: UtilityRecapture[]): UtilityRecapture {
  const recaptured = data.reduce((sum, item) => sum + (item.recaptured || 0), 0)
  const expected = data.reduce((sum, item) => sum + (item.expected || 0), 0)
  return {
    recaptured,
    expected,
    percentage: expected > 0 ? (recaptured / expected) * 100 : 0,
  }
}


