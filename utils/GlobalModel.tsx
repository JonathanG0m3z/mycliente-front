import { MenuProps } from 'antd'

export class ContextMenuModel {
  static createMenuContext: (
    record: any,
    itemList: MenuProps['items'],
    functions: { [key: string]: (record: any) => void }
  ) => MenuProps['items'] = (record, itemList, functions) => {
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
            onClick: () => onClickFunction(record)
          }
        }) ?? []
      )
    }
}
