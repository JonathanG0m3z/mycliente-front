'use client'
export interface Service {
  id: string
  name: string
  userId: null
}

export interface ServiceData {
  services: Service[]
  total: number
}
