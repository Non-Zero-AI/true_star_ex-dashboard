'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Users, Lock, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { User } from '@/types'

export default function SettingsPage() {
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!isAdmin) {
      router.push('/')
      return
    }

    fetchUsers()
  }, [user, isAdmin, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users')
      const result = await response.json()
      if (result.success && result.data) {
        setUsers(Array.isArray(result.data) ? result.data : [result.data])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeUserPassword = async () => {
    if (!newUserPassword) {
      setError('Please enter a new password')
      return
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          newPassword: newUserPassword,
          passwordType: 'user',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSuccess('User password updated successfully')
        setNewUserPassword('')
        setError(null)
      } else {
        setError(result.error || 'Failed to update password')
      }
    } catch (err) {
      setError('An error occurred while updating password')
    }
  }

  const handleChangeAdminPassword = async () => {
    if (!newAdminPassword) {
      setError('Please enter a new password')
      return
    }

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          newPassword: newAdminPassword,
          passwordType: 'admin',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSuccess('Admin password updated successfully. All admins will need to use the new password.')
        setNewAdminPassword('')
        setError(null)
      } else {
        setError(result.error || 'Failed to update password')
      }
    } catch (err) {
      setError('An error occurred while updating password')
    }
  }

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) {
      return
    }

    setRemovingUserId(userId)
    try {
      const response = await fetch('/api/auth/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()
      if (result.success) {
        setSuccess('User removed successfully')
        fetchUsers()
      } else {
        setError(result.error || 'Failed to remove user')
      }
    } catch (err) {
      setError('An error occurred while removing user')
    } finally {
      setRemovingUserId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Admin Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage users and passwords
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <p>{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change User Password
            </CardTitle>
            <CardDescription>
              Update the password for all non-admin users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="user-password" className="text-sm font-medium">
                New User Password
              </label>
              <input
                id="user-password"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <Button onClick={handleChangeUserPassword}>
              Update User Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Admin Password
            </CardTitle>
            <CardDescription>
              Update the password for all admin users. This will trigger a notification webhook.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">
                New Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <Button onClick={handleChangeAdminPassword}>
              Update Admin Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground">No users found</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      {u.role === 'admin' && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
                          Admin
                        </span>
                      )}
                    </div>
                    {u.email !== user?.email && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveUser(u.id)}
                        disabled={removingUserId === u.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {removingUserId === u.id ? 'Removing...' : 'Remove'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


