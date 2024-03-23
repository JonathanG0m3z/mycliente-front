import { Account } from '@/interface/Account'
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
}

export default AccountModel
