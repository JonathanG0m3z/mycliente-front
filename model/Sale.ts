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

  static countActiveFilters (filters: SaleFilters): number {
    let count = 0
    if (filters.search && filters.search !== '') count++
    if (filters.service && filters.service.length > 0) count++
    if (filters.expiration_range && filters.expiration_range.length === 2) {
      count++
    }
    if (filters.is_deleted === true) count++
    return count
  }

  static transformFiltersToUrl: (filters: SaleFilters) => string = (filters) => {
    let url = `?page=${filters.page}&limit=${filters.pageSize}&search=${encodeURIComponent(filters.search)}`
    if (filters.order) {
      url += `&order=${encodeURIComponent(filters.order)}`
    }
    if (filters.service && filters.service.length > 0) {
      url += `&service=${filters.service.join(',')}`
    }
    if (filters.expiration_range && filters.expiration_range.length === 2) {
      url += `&expiration_start=${encodeURIComponent(dayjs(filters.expiration_range[0]).format('YYYY-MM-DD'))}`
      url += `&expiration_end=${encodeURIComponent(dayjs(filters.expiration_range[1]).format('YYYY-MM-DD'))}`
    }
    if (filters.is_deleted !== undefined) {
      url += `&is_deleted=${filters.is_deleted}`
    }
    return url
  }
}

export default SaleModel
