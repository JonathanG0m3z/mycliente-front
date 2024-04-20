'use client'
import { Sale, SaleFilters } from '@/interface/Sale'
import { encryptValue } from '@/utils/cryptoHooks'
import dayjs from 'dayjs'

class SaleModel {
  static fromUiToApi (values: any) {
    return {
      ...values,
      account: {
        ...values.account,
        email: values.account.email?.[0],
        password: encryptValue(values.account.password),
        service: values.account.service?.[0],
        expiration: dayjs(values.account.expiration).format('YYYY-MM-DD')
      },
      client: {
        ...values.client,
        country: values.client.country?.value,
        search: values.client.search?.[0]
      },
      expiration: dayjs(values.expiration).format('YYYY-MM-DD')
    }
  }

  static createInitialValues (record: Sale | null) {
    return {
      account: {
        expiration: record
          ? dayjs(record.account.expiration)
          : dayjs().add(1, 'month'),
        email: record
          ? [{
              label: record.account.email,
              value: record.account.id
            }]
          : undefined
      },
      client: {
        search: record
          ? [{
              label: record?.client?.name,
              value: record?.client.id
            }]
          : undefined
      },
      expiration: record
        ? dayjs(record.expiration)
        : dayjs().add(1, 'month'),
      price: record?.price,
      profile: record?.profile,
      pin: record?.pin
    }
  }

  static transformFiltersToUrl: (filters: SaleFilters) => string = (filters) => {
    const url = `?page=${filters.page}&limit=${filters.pageSize}&search=${filters.search}`
    return url
  }
}

export default SaleModel
