'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PropertyFilter } from '@/components/dashboard/property-filter'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { useAuth } from '@/contexts/auth-context'
import type { DashboardData, Property } from '@/types'
import { RefreshCw, Settings, LogOut } from 'lucide-react'

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData>({
    cashOnHand: [],
    occupancy: [],
    collections: [],
    debtRatioLocation: [],
    debtRatioMortgage: [],
    keyManagement: [],
    vacancyLoss: [],
    noi: [],
    daysOnMarket: [],
    moveInsClosings: [],
    expenseRatio: [],
    capexBudget: [],
    opsBudget: [],
    utilityRecapture: [],
    properties: [],
  })
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'refresh-all' }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      if (result.success && result.data) {
        setData({
          cashOnHand: result.data.cashOnHand || [],
          occupancy: result.data.occupancy || [],
          collections: result.data.collections || [],
          debtRatioLocation: result.data.debtRatioLocation || [],
          debtRatioMortgage: result.data.debtRatioMortgage || [],
          keyManagement: result.data.keyManagement || [],
          vacancyLoss: result.data.vacancyLoss || [],
          noi: result.data.noi || [],
          daysOnMarket: result.data.daysOnMarket || [],
          moveInsClosings: result.data.moveInsClosings || [],
          expenseRatio: result.data.expenseRatio || [],
          capexBudget: result.data.capexBudget || [],
          opsBudget: result.data.opsBudget || [],
          utilityRecapture: result.data.utilityRecapture || [],
          properties: result.data.properties || [],
        })
        setError(null)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      fetchData()
    }
  }, [user, isLoading, router])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Property Management KPIs and Metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <PropertyFilter
                properties={data.properties}
                selectedProperty={selectedProperty}
                onPropertyChange={setSelectedProperty}
              />
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {user && (
                <>
                  {user.role === 'admin' && (
                    <Button
                      onClick={() => router.push('/settings')}
                      variant="outline"
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      logout()
                      router.push('/login')
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive font-medium">Error: {error}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please check your webhook connections and try refreshing.
            </p>
          </div>
        )}

        {data.properties.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No data available. Please ensure your webhooks are configured and try refreshing.
            </p>
          </div>
        )}

        <DashboardContent data={data} selectedProperty={selectedProperty} />
      </div>
    </div>
  )
}

