import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface FraudFlag {
  entryId: string
  reason: string
  userId: string
  amount: number
  timestamp: string
  status: 'pending' | 'resolved' | 'rejected'
  resolvedAt?: string
}

export interface AuditLog {
  entryId: string
  changes: string
  timestamp: string
  userId: string
  adminId: string
  action: string
}

export interface User {
  userId: string
  username: string
  balance: number
  status: 'active' | 'flagged' | 'suspended'
}

export interface CreditConfig {
  contestWin: number
  referral: number
  contentSubmission: number
  follow: number
  purchase: number
  dailyLimit: number
  maxSingleTransaction: number
}

// API functions
export const fraudApi = {
  getFlags: async (status?: string): Promise<FraudFlag[]> => {
    const response = await api.get('/api/fraud/flags', {
      params: status ? { status } : undefined,
    })
    return response.data.data
  },

  resolveFlag: async (entryId: string, action: 'approve' | 'reject' | 'investigate') => {
    const response = await api.post('/api/fraud/resolve', {
      entryId,
      action,
    })
    return response.data
  },
}

export const auditApi = {
  getLogs: async (limit: number = 50, offset: number = 0): Promise<{
    data: AuditLog[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }> => {
    const response = await api.get('/api/audit/logs', {
      params: { limit, offset },
    })
    return response.data
  },
}

export const adminApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users')
    return response.data.data
  },

  getConfig: async (): Promise<CreditConfig> => {
    const response = await api.get('/api/admin/config')
    return response.data.data
  },

  updateConfig: async (config: Partial<CreditConfig>): Promise<CreditConfig> => {
    const response = await api.put('/api/admin/config', config)
    return response.data.data
  },
}

export const systemApi = {
  healthCheck: async () => {
    const response = await api.get('/health')
    return response.data
  },
} 