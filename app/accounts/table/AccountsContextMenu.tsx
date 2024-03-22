import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { Account } from '@/interface/Account'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { MenuProps } from 'antd/lib'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: Account | null
  items: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

const AccountssContextMenu = ({ record, contextMenuRef, items, functionsDictionary }: Props) => {
  return (
    <ContextMenu
      ref={contextMenuRef}
      items={ContextMenuModel.createMenuContext(
        record,
        items,
        functionsDictionary
      )}
    />
  )
}

export default AccountssContextMenu
