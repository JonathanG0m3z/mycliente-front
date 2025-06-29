'use client'
import { LabeledValue } from 'antd/es/select'
import type { Dayjs } from 'dayjs'

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
    extras?: {
      comment?: string
    }
  }

export interface AccountData {
  accounts: Account[]
  total: number
}

export interface AccountFilters {
    page: number
    pageSize: number
    search: string
    is_deleted?: boolean
    expiration_range?: [Dayjs, Dayjs]
    order?: string
    service?: LabeledValue[]
}
