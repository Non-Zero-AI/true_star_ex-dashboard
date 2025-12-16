'use client'

import { KPICard } from './kpi-card'
import {
  aggregateCashOnHand,
  aggregateOccupancy,
  aggregateCollections,
  aggregateDebtRatio,
  aggregateKeyManagement,
  aggregateVacancyLoss,
  aggregateNOI,
  aggregateDaysOnMarket,
  aggregateMoveInsClosings,
  aggregateExpenseRatio,
  aggregateCapexBudget,
  aggregateOpsBudget,
  aggregateUtilityRecapture,
  filterByProperty,
} from '@/lib/data-aggregation'
import type { DashboardData } from '@/types'
import { DollarSign, Home, TrendingUp, Key, AlertCircle, Building2, Calendar, FileText, BarChart3, Wallet } from 'lucide-react'

interface DashboardContentProps {
  data: DashboardData
  selectedProperty: string | null
}

export function DashboardContent({ data, selectedProperty }: DashboardContentProps) {
  // Filter and aggregate data based on selected property
  const cashOnHandData = filterByProperty(data.cashOnHand || [], selectedProperty)
  const occupancyData = filterByProperty(data.occupancy || [], selectedProperty)
  const collectionsData = filterByProperty(data.collections || [], selectedProperty)
  const debtRatioLocationData = filterByProperty(data.debtRatioLocation || [], selectedProperty)
  const debtRatioMortgageData = filterByProperty(data.debtRatioMortgage || [], selectedProperty)
  const keyManagementData = filterByProperty(data.keyManagement || [], selectedProperty)
  const vacancyLossData = filterByProperty(data.vacancyLoss || [], selectedProperty)
  const noiData = filterByProperty(data.noi || [], selectedProperty)
  const daysOnMarketData = filterByProperty(data.daysOnMarket || [], selectedProperty)
  const moveInsClosingsData = filterByProperty(data.moveInsClosings || [], selectedProperty)
  const expenseRatioData = filterByProperty(data.expenseRatio || [], selectedProperty)
  const capexBudgetData = filterByProperty(data.capexBudget || [], selectedProperty)
  const opsBudgetData = filterByProperty(data.opsBudget || [], selectedProperty)
  const utilityRecaptureData = filterByProperty(data.utilityRecapture || [], selectedProperty)

  // Aggregate data
  const cashOnHand = cashOnHandData.length > 0 ? aggregateCashOnHand(cashOnHandData) : null
  const occupancy = occupancyData.length > 0 ? aggregateOccupancy(occupancyData) : null
  const collections = collectionsData.length > 0 ? aggregateCollections(collectionsData) : null
  const debtRatioLocation = debtRatioLocationData.length > 0 ? aggregateDebtRatio(debtRatioLocationData) : null
  const debtRatioMortgage = debtRatioMortgageData.length > 0 ? aggregateDebtRatio(debtRatioMortgageData) : null
  const keyManagement = keyManagementData.length > 0 ? aggregateKeyManagement(keyManagementData) : null
  const vacancyLoss = vacancyLossData.length > 0 ? aggregateVacancyLoss(vacancyLossData) : null
  const noi = noiData.length > 0 ? aggregateNOI(noiData) : null
  const daysOnMarket = daysOnMarketData.length > 0 ? aggregateDaysOnMarket(daysOnMarketData) : null
  const moveInsClosings = moveInsClosingsData.length > 0 ? aggregateMoveInsClosings(moveInsClosingsData) : null
  const expenseRatio = expenseRatioData.length > 0 ? aggregateExpenseRatio(expenseRatioData) : null
  const capexBudget = capexBudgetData.length > 0 ? aggregateCapexBudget(capexBudgetData) : null
  const opsBudget = opsBudgetData.length > 0 ? aggregateOpsBudget(opsBudgetData) : null
  const utilityRecapture = utilityRecaptureData.length > 0 ? aggregateUtilityRecapture(utilityRecaptureData) : null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cashOnHand && (
        <KPICard
          title="Cash On Hand"
          value={cashOnHand.amount}
          subtitle={cashOnHand.currency || 'USD'}
          icon={<DollarSign />}
        />
      )}

      {occupancy && (
        <KPICard
          title="Occupancy"
          value={`${occupancy.percentage.toFixed(1)}%`}
          subtitle={`${occupancy.occupied} / ${occupancy.total} units`}
          icon={<Home />}
        />
      )}

      {collections && (
        <KPICard
          title="Collections"
          value={`${collections.percentage.toFixed(1)}%`}
          subtitle={`$${collections.collected.toLocaleString()} / $${collections.expected.toLocaleString()}`}
          icon={<TrendingUp />}
        />
      )}

      {debtRatioLocation && (
        <KPICard
          title="Debt Ratio - Location"
          value={`${debtRatioLocation.ratio.toFixed(1)}%`}
          subtitle={`Debt: $${debtRatioLocation.debt.toLocaleString()}`}
          icon={<BarChart3 />}
        />
      )}

      {debtRatioMortgage && (
        <KPICard
          title="Debt Ratio - Mortgage"
          value={`${debtRatioMortgage.ratio.toFixed(1)}%`}
          subtitle={`Debt: $${debtRatioMortgage.debt.toLocaleString()}`}
          icon={<BarChart3 />}
        />
      )}

      {keyManagement && (
        <KPICard
          title="Key Management"
          value={keyManagement.keysOutstanding}
          subtitle={`${keyManagement.keysReturned} returned / ${keyManagement.keysIssued} issued`}
          icon={<Key />}
        />
      )}

      {vacancyLoss && (
        <KPICard
          title="Vacancy Loss"
          value={`${vacancyLoss.percentage.toFixed(1)}%`}
          subtitle={`${vacancyLoss.vacantUnits} vacant units | Loss: $${vacancyLoss.lossAmount.toLocaleString()}`}
          icon={<AlertCircle />}
        />
      )}

      {noi && (
        <KPICard
          title="Net Operating Income"
          value={noi.noi}
          subtitle={`Income: $${noi.income.toLocaleString()} | Expenses: $${noi.expenses.toLocaleString()}`}
          icon={<DollarSign />}
        />
      )}

      {daysOnMarket && (
        <KPICard
          title="Days on Market"
          value={`${daysOnMarket.averageDOM.toFixed(0)} days`}
          subtitle={`${daysOnMarket.properties} properties`}
          icon={<Calendar />}
        />
      )}

      {moveInsClosings && (
        <KPICard
          title="Move-ins / Closings"
          value={`${moveInsClosings.moveIns} / ${moveInsClosings.closings}`}
          subtitle={`Projected Cash: $${moveInsClosings.projectedCash.toLocaleString()}`}
          icon={<Building2 />}
        />
      )}

      {expenseRatio && (
        <KPICard
          title="Expense Ratio"
          value={`${expenseRatio.ratio.toFixed(1)}%`}
          subtitle={`Expenses: $${expenseRatio.expenses.toLocaleString()} / Income: $${expenseRatio.income.toLocaleString()}`}
          icon={<FileText />}
        />
      )}

      {capexBudget && (
        <KPICard
          title="Capex Budget"
          value={capexBudget.variance}
          subtitle={`Actual: $${capexBudget.actual.toLocaleString()} / Budget: $${capexBudget.budget.toLocaleString()}`}
          trend={{
            value: capexBudget.percentage,
            label: 'vs Budget',
            isPositive: capexBudget.percentage <= 0,
          }}
          icon={<Wallet />}
        />
      )}

      {opsBudget && (
        <KPICard
          title="Ops Budget vs Actual"
          value={opsBudget.variance}
          subtitle={`Actual: $${opsBudget.actual.toLocaleString()} / Budget: $${opsBudget.budget.toLocaleString()}`}
          trend={{
            value: opsBudget.percentage,
            label: 'vs Budget',
            isPositive: opsBudget.percentage <= 0,
          }}
          icon={<FileText />}
        />
      )}

      {utilityRecapture && (
        <KPICard
          title="Utility Recapture"
          value={`${utilityRecapture.percentage.toFixed(1)}%`}
          subtitle={`$${utilityRecapture.recaptured.toLocaleString()} / $${utilityRecapture.expected.toLocaleString()}`}
          icon={<TrendingUp />}
        />
      )}
    </div>
  )
}


