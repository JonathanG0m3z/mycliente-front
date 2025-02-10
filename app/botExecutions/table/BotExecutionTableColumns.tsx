'use client'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { CustomMenuItem } from '@/interface/ContextMenu'
import dayjs from 'dayjs'
import { BotExecution } from '@/interface/BotExecution'

interface Props {
  contextMenuOptions: CustomMenuItem[]
}

export const BotExecutionsTableColumns: (
  props: Props
) => ColumnsType<BotExecution> = ({ contextMenuOptions }) => {
  return [
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      align: 'center'
    },
    {
      title: 'Fecha creacion',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: value => dayjs(value).format('DD-MM-YYYY HH:mm:ss')
    },
    {
      title: 'Cuenta',
      dataIndex: ['account', 'email'],
      key: 'account',
      align: 'center'
    },
    {
      title: 'Servicio',
      dataIndex: ['account', 'service', 'name'],
      key: 'service',
      align: 'center'
    },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      render: value => dayjs(value).format('DD-MM-YYYY HH:mm:ss')
    },
    {
      title: 'Opciones',
      dataIndex: '',
      key: '',
      render: (value, record) => (
        <Dropdown
          menu={{
            items: ContextMenuModel.createMenuContext(
              record,
              contextMenuOptions
            )
          }}
          trigger={['click']}
        >
          <Button
            shape='circle'
            icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
          />
        </Dropdown>
      ),
      align: 'center'
    }
  ]
}
