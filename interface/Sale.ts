export type SaleData = {
  message: string
  sale: {
    id: number
    userId: string
    price: number | null
    profile: string | null
    pin: string | null
    expiration: string
    accountId: number
    clientId: string
    updatedAt: string
    createdAt: string
  }
  account: {
    id: string
    email: string
    password: string
    expiration: Date
    profiles: number
    serviceId: string
    userId: string
    service: {
      name: string
    }
    deleted_at: null | Date
  }
  client: {
    id: string
    name: string
    phone: string | null
    email: string | null
    userId: string
    country: string
    deleted_at: null | Date
  }
}

export type Sale = {
  id: number
  userId: string
  price: number | null
  profile: string | null
  pin: string | null
  expiration: string
  accountId: number
  clientId: string
  updatedAt: string
  createdAt: string
  account: SaleData['account']
  client: SaleData['client']
}
