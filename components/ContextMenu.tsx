import { Menu } from 'antd'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import React, {
  MouseEvent,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
interface ContextMenuState {
  visible: boolean
  x: number
  y: number
}
interface Props {
  items?: ItemType<MenuItemType>[]
}
export interface ContextMenuRef {
  onContextMenu: (event: MouseEvent<any, MouseEvent>) => void
}
const ContextMenu = forwardRef<ContextMenuRef, Props>(function ContextMenu (
  { items },
  ref
) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0
  })
  const onContextMenu = (event: MouseEvent<any, MouseEvent>) => {
    event.preventDefault()
    if (!contextMenu.visible) {
      document.addEventListener('click', function onClickOutside () {
        setContextMenu({ ...contextMenu, visible: false })
        document.removeEventListener('click', onClickOutside)
      })
    }
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY
    })
  }
  useImperativeHandle(ref, () => ({
    onContextMenu (e) {
      onContextMenu(e)
    }
  }))

  const options: ItemType<MenuItemType>[] = useMemo(() => {
    if (items === null || items === undefined) {
      return []
    }
    return items.map(item => {
      if (item === null || item === undefined) {
        throw new Error('Invalid item found in items array')
      }
      return {
        ...item,
        style: { padding: 0, marginTop: 0, marginBottom: 0 }
      }
    })
  }, [items])

  return (
    <>
      {contextMenu.visible
        ? (
          <Menu
            items={options}
            className='popup'
            style={{
              left: `${contextMenu.x - 0}px`,
              top: `${contextMenu.y - 0}px`,
              transform: `translate(${window.innerWidth - contextMenu.x < 230 ? '-100%' : '0'}, ${document.documentElement.scrollHeight - contextMenu.y < (options.length ?? 0) * 40 ? '-100%' : '0'})`
            }}
          />
          )
        : null}
    </>
  )
})
export default ContextMenu
