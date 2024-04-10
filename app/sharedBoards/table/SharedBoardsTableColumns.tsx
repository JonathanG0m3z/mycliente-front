'use client'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { SharedBoard } from '@/interface/SharedBoard'
import { CustomMenuItem } from '@/interface/ContextMenu'

interface Props {
  contextMenuOptions: CustomMenuItem[]
}

export const SharedBoardsTableColumns: (
  props: Props
) => ColumnsType<SharedBoard> = ({ contextMenuOptions }) => {
  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'Usuarios',
      dataIndex: 'users',
      key: 'users',
      align: 'center',
      render: value => (
        Object.keys(value ?? {}).map(email => (
          <Tag key={email}>{email}</Tag>
        ))
      )
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
