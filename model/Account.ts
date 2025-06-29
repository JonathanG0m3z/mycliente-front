'use client'
import { Account, AccountFilters } from '@/interface/Account'
import { decryptValue, encryptValue } from '@/utils/cryptoHooks'
import dayjs from 'dayjs'

class AccountModel {
  static fromUiToApi (values: any) {
    return {
      ...values,
      expiration: dayjs(values.expiration).format('YYYY-MM-DD'),
      password: encryptValue(values.password),
      service: values.service?.[0]
    }
  }

  static createInitialValues (record: Account | null) {
    return {
      ...record ?? {},
      expiration: record ? dayjs(record.expiration) : dayjs(),
      service: record ? [{ label: record.service.name, value: record.serviceId }] : undefined,
      password: record ? decryptValue(record.password) : undefined
    }
  }

  static transformFiltersToUrl: (filters: AccountFilters) => string = (filters) => {
    const beginDate = filters.expiration_range?.[0] ? dayjs(filters.expiration_range[0]).format('YYYY-MM-DD') : ''
    const endDate = filters.expiration_range?.[1] ? dayjs(filters.expiration_range[1]).format('YYYY-MM-DD') : ''
    const url = `?page=${filters.page}&limit=${filters.pageSize}&search=${filters.search}` +
      `&is_deleted=${filters.is_deleted === undefined ? '' : filters.is_deleted}` +
      `&begin_date=${beginDate}&end_date=${endDate}` +
      `&service=${filters.service?.map(({ value }) => value) ?? ''}` +
      `&order=${filters.order ?? ''}`
    return url
  }

  static countActiveFilters (filters: AccountFilters) {
    let count = 0
    if (filters.expiration_range?.length) count++
    if (filters.is_deleted !== undefined) count++
    if (filters.service?.length) count++
    return count
  }
}

export default AccountModel
