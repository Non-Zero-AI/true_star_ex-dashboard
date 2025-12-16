import { NextRequest, NextResponse } from 'next/server'
import { WEBHOOK_ENDPOINTS, DATA_WEBHOOKS } from '@/lib/webhooks'
import type { DashboardData } from '@/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get('endpoint')

  if (!endpoint || !(endpoint in WEBHOOK_ENDPOINTS)) {
    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    )
  }

  try {
    const url = WEBHOOK_ENDPOINTS[endpoint as keyof typeof WEBHOOK_ENDPOINTS]
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'refresh-all') {
      // Fetch all data webhooks in parallel
      const webhookPromises = DATA_WEBHOOKS.map(async (key) => {
        const url = WEBHOOK_ENDPOINTS[key]
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          })

          if (!response.ok) {
            throw new Error(`Webhook ${key} returned ${response.status}`)
          }

          const data = await response.json()
          return { key, success: true, data }
        } catch (error) {
          console.error(`Error fetching ${key}:`, error)
          return {
            key,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })

      const results = await Promise.all(webhookPromises)

      // Transform results into DashboardData structure
      const dashboardData: Partial<DashboardData> = {}
      
      results.forEach((result) => {
        if (result.success && result.data) {
          switch (result.key) {
            case 'cashOnHand':
              dashboardData.cashOnHand = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'occupancy':
              dashboardData.occupancy = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'collections':
              dashboardData.collections = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'debtRatioLocation':
              dashboardData.debtRatioLocation = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'debtRatioMortgage':
              dashboardData.debtRatioMortgage = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'keyManagement':
              dashboardData.keyManagement = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'vacancyLoss':
              dashboardData.vacancyLoss = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'noi':
              dashboardData.noi = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'daysOnMarket':
              dashboardData.daysOnMarket = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'moveInsClosings':
              dashboardData.moveInsClosings = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'expenseRatio':
              dashboardData.expenseRatio = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'capexBudget':
              dashboardData.capexBudget = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'opsBudget':
              dashboardData.opsBudget = Array.isArray(result.data) ? result.data : [result.data]
              break
            case 'utilityRecapture':
              dashboardData.utilityRecapture = Array.isArray(result.data) ? result.data : [result.data]
              break
          }
        }
      })

      // Extract unique properties from all data
      const propertiesSet = new Set<string>()
      Object.values(dashboardData).forEach((dataArray) => {
        if (Array.isArray(dataArray)) {
          dataArray.forEach((item: any) => {
            if (item.propertyId && item.propertyName) {
              propertiesSet.add(JSON.stringify({ id: item.propertyId, name: item.propertyName }))
            }
          })
        }
      })

      dashboardData.properties = Array.from(propertiesSet).map((str) => JSON.parse(str))

      return NextResponse.json({
        success: true,
        data: dashboardData,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in refresh-all:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


