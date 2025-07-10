'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { adminApi, fraudApi, auditApi, type User, type FraudFlag, type AuditLog } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react'

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [fraudFlags, setFraudFlags] = useState<FraudFlag[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [fraudFilter, setFraudFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('pending')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, flagsData, logsData] = await Promise.all([
          adminApi.getUsers(),
          fraudApi.getFlags(),
          auditApi.getLogs(10, 0)
        ])
        
        setUsers(usersData)
        setFraudFlags(flagsData)
        setAuditLogs(logsData.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleResolveFraud = async (entryId: string, action: 'approve' | 'reject') => {
    try {
      await fraudApi.resolveFlag(entryId, action)
      // Refresh fraud flags
      const updatedFlags = await fraudApi.getFlags()
      setFraudFlags(updatedFlags)
    } catch (error) {
      console.error('Failed to resolve fraud flag:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  // Filter fraud flags based on current filter
  const getFilteredFraudFlags = () => {
    if (fraudFilter === 'all') return fraudFlags
    return fraudFlags.filter(flag => flag.status === fraudFilter)
  }

  const filteredFraudFlags = getFilteredFraudFlags()

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    flaggedUsers: users.filter(u => u.status === 'flagged').length,
    pendingFlags: fraudFlags.filter(f => f.status === 'pending').length,
    totalBalance: users.reduce((sum, user) => sum + user.balance, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Universal Credit Wallet Admin</h1>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('overview')}
                size="sm"
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('users')}
                size="sm"
              >
                Users
              </Button>
              <Button
                variant={activeTab === 'fraud' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('fraud')}
                size="sm"
              >
                Fraud Flags
              </Button>
              <Button
                variant={activeTab === 'audit' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('audit')}
                size="sm"
              >
                Audit Logs
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeUsers} active, {stats.flaggedUsers} flagged
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Flags</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingFlags}</div>
                  <p className="text-xs text-muted-foreground">
                    Require immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all user accounts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{auditLogs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Actions logged today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Fraud Flags ({stats.pendingFlags})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudFlags
                    .filter(flag => flag.status === 'pending')
                    .slice(0, 5)
                    .map((flag) => (
                    <div key={flag.entryId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{flag.userId}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(flag.status)}`}>
                            {flag.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{flag.reason}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(flag.timestamp)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveFraud(flag.entryId, 'approve')}
                          disabled={flag.status !== 'pending'}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveFraud(flag.entryId, 'reject')}
                          disabled={flag.status !== 'pending'}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {stats.pendingFlags === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      🎉 No pending fraud flags! All clear.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.username}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {user.userId}</p>
                      <p className="text-lg font-semibold">{formatCurrency(user.balance)}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'fraud' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Fraud Flags Management ({filteredFraudFlags.length})</CardTitle>
                  {fraudFilter !== 'all' && (
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={fraudFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFraudFilter('all')}
                  >
                    All ({fraudFlags.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={fraudFilter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFraudFilter('pending')}
                  >
                    Pending ({fraudFlags.filter(f => f.status === 'pending').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={fraudFilter === 'resolved' ? 'default' : 'outline'}
                    onClick={() => setFraudFilter('resolved')}
                  >
                    Resolved ({fraudFlags.filter(f => f.status === 'resolved').length})
                  </Button>
                  <Button
                    size="sm"
                    variant={fraudFilter === 'rejected' ? 'default' : 'outline'}
                    onClick={() => setFraudFilter('rejected')}
                  >
                    Rejected ({fraudFlags.filter(f => f.status === 'rejected').length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFraudFlags.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No fraud flags found for "{fraudFilter}" status.
                  </div>
                ) : (
                  filteredFraudFlags.map((flag) => (
                    <div key={flag.entryId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{flag.userId}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(flag.status)}`}>
                            {flag.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{flag.reason}</p>
                        <p className="text-sm">Amount: {formatCurrency(flag.amount)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(flag.timestamp)}</p>
                        {flag.resolvedAt && (
                          <p className="text-xs text-muted-foreground">
                            Resolved: {formatDate(flag.resolvedAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleResolveFraud(flag.entryId, 'approve')}
                          disabled={flag.status !== 'pending'}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleResolveFraud(flag.entryId, 'reject')}
                          disabled={flag.status !== 'pending'}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'audit' && (
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.entryId} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                      <span className="px-2 py-1 bg-secondary rounded-full text-xs">{log.action}</span>
                    </div>
                    <p className="text-sm">{log.changes}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      User: {log.userId} | Admin: {log.adminId}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
