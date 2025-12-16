import { NextRequest, NextResponse } from 'next/server'
import { WEBHOOK_ENDPOINTS } from '@/lib/webhooks'
import { isValidEmailDomain, isAdminEmail, getExpectedPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email domain
    if (!isValidEmailDomain(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email domain. Only @truestarcapital.com and @nonzeroai.com emails are allowed.' },
        { status: 403 }
      )
    }

    // Check password locally first (for quick validation)
    const expectedPassword = getExpectedPassword(email)
    if (password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Call authentication webhook
    try {
      const webhookResponse = await fetch(WEBHOOK_ENDPOINTS.authenticate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      })

      // Webhook returns 200 if password is correct
      if (webhookResponse.status === 200) {
        const webhookData = await webhookResponse.json().catch(() => ({}))
        
        return NextResponse.json({
          success: true,
          user: {
            id: webhookData.id || email,
            email,
            name: webhookData.name || email.split('@')[0],
            role: isAdminEmail(email) ? 'admin' : 'user',
          },
        })
      } else {
        return NextResponse.json(
          { success: false, error: 'Authentication failed' },
          { status: 401 }
        )
      }
    } catch (webhookError) {
      console.error('Webhook authentication error:', webhookError)
      // If webhook fails but password matches locally, still allow login
      // (for development/fallback scenarios)
      return NextResponse.json({
        success: true,
        user: {
          id: email,
          email,
          name: email.split('@')[0],
          role: isAdminEmail(email) ? 'admin' : 'user',
        },
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}


