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
    id: number
    email: string
    password: string
    expiration: string
    profiles: number
    serviceId: number
    userId: string
    service: {
      name: string
    }
  }
  client: {
    id: string
    name: string
    phone: string | null
    email: string | null
    userId: string
    country: string
  }
}
