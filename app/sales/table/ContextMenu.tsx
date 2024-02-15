import { Sale } from '@/interface/Sale'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu } from 'antd'

interface Props {
  record: any
  visible: boolean
  x: number
  y: number
  onEdit: (record: Sale) => void
}

const ContextMenu = ({ visible, x, y, record, onEdit }: Props) => {
  return visible
    ? <Menu
        items={[
          {
            key: 'edit',
            label: 'Editar venta',
            icon: <FontAwesomeIcon icon={faEdit} />,
            onClick: () => onEdit(record)
          }
        ]}
        className='popup'
        style={{ left: `${x}px`, top: `${y}px` }}
      />
    : null
}

export default ContextMenu
