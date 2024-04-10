'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { Account } from '@/interface/Account'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: Account | null
  items: CustomMenuItem[]
}

const AccountssContextMenu = ({ record, contextMenuRef, items }: Props) => {
  return (
    <ContextMenu
      ref={contextMenuRef}
      items={ContextMenuModel.createMenuContext(
        record,
        items
      )}
    />
  )
}

export default AccountssContextMenu
