'use client'
import { Account } from '@/interface/Account'
import { SharedBoardAccountFilters } from '@/interface/SharedBoard'
import { decryptValue, encryptValue } from '@/utils/cryptoHooks'
import dayjs from 'dayjs'

class SharedBoardModel {
  static fromUiToApi (values: any) {
    return {
      ...values,
      expiration: dayjs(values.expiration).format('YYYY-MM-DD'),
      password: encryptValue(values.password),
      service: values.service?.[0],
      extras: {
        comment: values.comment ?? ''
      }
    }
  }

  static createInitialValues (record: Account | null, isRenew?: boolean) {
    return {
      ...record ?? {},
      expiration: record
        ? (isRenew ? dayjs(record.expiration).add(1, 'month') : dayjs(record.expiration))
        : dayjs().add(1, 'month'),
      service: record ? [{ label: record.service.name, value: record.serviceId }] : undefined,
      password: record ? decryptValue(record.password) : undefined,
      comment: record?.extras?.comment
    }
  }

  static transformFilterToUrl: (filters: SharedBoardAccountFilters) => string = (filters) => {
    const beginDate = filters.expiration_range?.[0] ? dayjs(filters.expiration_range?.[0]).format('YYYY-MM-DD') : ''
    const endDate = filters.expiration_range?.[1] ? dayjs(filters.expiration_range?.[1]).format('YYYY-MM-DD') : ''
    const url = `?page=${filters.page}&limit=${filters.pageSize}&search=${filters.search}
&is_deleted=${filters.is_deleted === undefined ? '' : filters.is_deleted}
&begin_date=${beginDate}&end_date=${endDate}
&order=${filters.order}`
    return url
  }

  static countActiveFilters (filters: SharedBoardAccountFilters) {
    let count = 0
    if (filters.expiration_range?.length) count++
    if (filters.is_deleted !== undefined) count++
    return count
  }
}

export default SharedBoardModel
