'use client'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { MenuProps } from 'antd/lib'

export class ContextMenuModel {
  static createMenuContext: (
    record: any,
    itemList: CustomMenuItem[],
    disabledCondition?: (record: any) => boolean
  ) => MenuProps['items'] = (record, itemList, disabledCondition) => {
      return (
        itemList?.map(item => {
          if (!item) {
            throw new Error('Invalid item found in itemList')
          }
          const key = item.key
          if (!key) {
            throw new Error('Invalid item found in itemList, key is missing')
          }
          return {
            ...item,
            onClick: () => item.onClick(record),
            disabled: (item.disabled) || (disabledCondition ? disabledCondition(record) : false)
          }
        }) ?? []
      )
    }
}
