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
}

export default SaleModel
