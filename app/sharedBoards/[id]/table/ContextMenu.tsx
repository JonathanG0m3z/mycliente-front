'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { SharedBoard } from '@/interface/SharedBoard'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: SharedBoard | null
  items: CustomMenuItem[]
}

const SharedBoardsContextMenu = ({ record, contextMenuRef, items }: Props) => {
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

export default SharedBoardsContextMenu
