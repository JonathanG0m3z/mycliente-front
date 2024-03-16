import { Sale } from '@/interface/Sale'
import { encryptValue } from '@/utils/cryptoHooks'
import { MenuProps } from 'antd/lib'
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

  static createMenuContext: (
    record: any,
    itemList: MenuProps['items'],
    functions: { [key: string]: (record: any) => void }
  ) => MenuProps['items'] = (record, itemList, functions) => {
      return itemList?.map(item => {
        if (!item) {
          throw new Error('Invalid item found in itemList')
        }
        const key = item.key
        if (!key) {
          throw new Error('Invalid item found in itemList, key is missing')
        }
        const onClickFunction = functions[`${key}`]
        if (typeof onClickFunction !== 'function') {
          throw new Error(`Invalid function for key: ${key}`)
        }
        return {
          ...item,
          onClick: () => onClickFunction(record)
        }
      }) ?? []
    }
}

export default SaleModel
