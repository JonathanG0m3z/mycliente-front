'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { BotExecution } from '@/interface/BotExecution'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: BotExecution | null
  items: CustomMenuItem[]
}

const BotExecutionsContextMenu = ({ record, contextMenuRef, items }: Props) => {
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

export default BotExecutionsContextMenu
