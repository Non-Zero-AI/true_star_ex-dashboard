import { NextRequest, NextResponse } from 'next/server'
import { WEBHOOK_ENDPOINTS } from '@/lib/webhooks'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(WEBHOOK_ENDPOINTS.users, {
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
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Call users webhook to remove user
    // Note: This assumes the webhook supports DELETE or a remove action
    const response = await fetch(WEBHOOK_ENDPOINTS.users, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'remove', userId }),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error removing user:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


