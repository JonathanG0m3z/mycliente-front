'use client'
import ContextMenu, { ContextMenuRef } from '@/components/ContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { Service } from '@/interface/Service'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { useGetPayload } from '@/utils/useGetPayload'
import { RefObject } from 'react'

interface Props {
  contextMenuRef: RefObject<ContextMenuRef>
  record: Service | null
  items: CustomMenuItem[]
}

const ServicesContextMenu = ({
  record,
  contextMenuRef,
  items
}: Props) => {
  const userId = useGetPayload()?.id
  return (
    <ContextMenu
      ref={contextMenuRef}
      items={ContextMenuModel.createMenuContext(
        record,
        items,
        record => record?.userId !== userId
      )}
    />
  )
}

export default ServicesContextMenu
