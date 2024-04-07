'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { SharedBoard } from '@/interface/SharedBoard'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { MenuProps } from 'antd/lib'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: SharedBoard | null
  items: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

const SharedBoardsContextMenu = ({ record, contextMenuRef, items, functionsDictionary }: Props) => {
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

export default SharedBoardsContextMenu
