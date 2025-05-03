'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { Account } from '@/interface/Account'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { getPayload } from '@/utils/getPayload'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: Account | null
  items: CustomMenuItem[]
}
const userId = getPayload()?.id

const AccountssContextMenu = ({ record, contextMenuRef, items }: Props) => {
  return (
    <ContextMenu
      ref={contextMenuRef}
      items={ContextMenuModel.createMenuContext(
        record,
        items,
        record => record?.userId !== userId || record?.createdInStore === true
      )}
    />
  )
}

export default AccountssContextMenu
