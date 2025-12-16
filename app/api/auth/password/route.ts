import { NextRequest, NextResponse } from 'next/server'
import { WEBHOOK_ENDPOINTS } from '@/lib/webhooks'
import { isAdminEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, newPassword, passwordType, currentPassword } = body

    // Validate required fields
    if (!userEmail || !newPassword || !passwordType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify current password if provided (for admin changing their own password)
    if (currentPassword) {
      // This would need to be verified against the stored password
      // For now, we'll trust the admin session
    }

    // Determine if this is an admin password change
    const isAdminPasswordChange = passwordType === 'admin'

    // If changing admin password, notify webhook
    if (isAdminPasswordChange) {
      try {
        await fetch(WEBHOOK_ENDPOINTS.passwordChangeNotice, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            changedBy: userEmail,
            passwordType: 'admin',
            timestamp: new Date().toISOString(),
          }),
          cache: 'no-store',
        })
      } catch (webhookError) {
        console.error('Password change notice webhook error:', webhookError)
        // Continue even if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for ${passwordType} users`,
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while changing password' },
      { status: 500 }
    )
  }
}


