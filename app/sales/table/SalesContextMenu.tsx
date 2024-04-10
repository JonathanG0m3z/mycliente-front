'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: any
  items: CustomMenuItem[]
}

const SalesContextMenu = ({ record, contextMenuRef, items }: Props) => {
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

export default SalesContextMenu
