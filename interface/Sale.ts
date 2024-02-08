export type AddSaleResponse = {
  message: string
  sale: {
    id: number
    userId: string
    price: number
    profile: string
    pin: string
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
    email: string
    userId: string
  }
}
