import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import SaleModel from '@/model/Sale'
import { MenuProps } from 'antd/lib'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: any
  items: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

const SalesContextMenu = ({ record, contextMenuRef, items, functionsDictionary }: Props) => {
  return (
    <ContextMenu
      ref={contextMenuRef}
      items={SaleModel.createMenuContext(
        record,
        items,
        functionsDictionary
      )}
    />
  )
}

export default SalesContextMenu
