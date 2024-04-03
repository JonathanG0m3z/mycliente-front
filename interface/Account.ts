'use client'
export interface Account {
    deleted_at: null | Date
    email: string
    expiration: Date
    id: string
    password: string
    profiles: number
    service: {
        name: string
    }
    serviceId: string
    userId: string
  }

export interface AccountData {
  accounts: Account[]
  total: number
}
