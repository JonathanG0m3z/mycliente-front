import { Menu } from 'antd'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import React, {
  MouseEvent,
  forwardRef,
  useImperativeHandle,
  useState
} from 'react'
interface ContextMenuState {
  popup: {
    visible: boolean
    x: number
    y: number
  }
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
    popup: {
      visible: false,
      x: 0,
      y: 0
    }
  })
  const onContextMenu = (event: MouseEvent<any, MouseEvent>) => {
    event.preventDefault()
    if (!contextMenu.popup.visible) {
      document.addEventListener('click', function onClickOutside () {
        setContextMenu({ popup: { ...contextMenu.popup, visible: false } })
        document.removeEventListener('click', onClickOutside)
      })
    }
    setContextMenu({
      popup: {
        visible: true,
        x: event.pageX,
        y: event.pageY
      }
    })
  }
  useImperativeHandle(ref, () => ({
    onContextMenu (e) {
      onContextMenu(e)
    }
  }))
  return (
    <>
      {contextMenu.popup.visible
        ? (
          <Menu
            items={items}
            className='popup'
            style={{
              left: `${contextMenu.popup.x - 0}px`,
              top: `${contextMenu.popup.y - 0}px`
            }}
          />
          )
        : null}
    </>
  )
})
export default ContextMenu
