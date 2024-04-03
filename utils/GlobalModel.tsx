'use client'
import { MenuProps } from 'antd'

export class ContextMenuModel {
  static createMenuContext: (
    record: any,
    itemList: MenuProps['items'],
    functions: { [key: string]: (record: any) => void },
    disabledCondition?: (record: any) => boolean
  ) => MenuProps['items'] = (record, itemList, functions, disabledCondition) => {
      return (
        itemList?.map(item => {
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
            onClick: () => onClickFunction(record),
            disabled: disabledCondition ? disabledCondition(record) : false
          }
        }) ?? []
      )
    }
}
