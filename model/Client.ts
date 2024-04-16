'use client'

import { Sale } from '@/interface/Sale'

class ClientModel {
  static fromUiToApi (values: any) {
    return {
      ...values,
      country: values.country?.value
    }
  }

  static createInitialValues (record: Sale['client'] | null) {
    return {
      ...(record ?? {}),
      country: record?.country ? { value: record?.country } : undefined
    }
  }
}

export default ClientModel
