'use client'
import { Account } from '@/interface/Account'
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

  static createInitialValues (record: Account | null) {
    return {
      ...record ?? {},
      expiration: record ? dayjs(record.expiration) : dayjs().add(1, 'month'),
      service: record ? [{ label: record.service.name, value: record.serviceId }] : undefined,
      password: record ? decryptValue(record.password) : undefined,
      comment: record?.extras?.comment
    }
  }
}

export default SharedBoardModel
