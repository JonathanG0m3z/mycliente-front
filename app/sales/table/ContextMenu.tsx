import { Menu, MenuProps } from 'antd'

interface Props {
  visible: boolean
  x: number
  y: number
  contextMenuOptions: MenuProps['items']
}

const ContextMenu = ({ visible, x, y, contextMenuOptions }: Props) => {
  return visible ? (
    <Menu
      items={contextMenuOptions}
      className='popup'
      style={{ left: `${x}px`, top: `${y}px` }}
    />
  ) : null
}

export default ContextMenu
