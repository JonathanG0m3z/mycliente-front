'use client'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { MenuProps } from 'antd/lib'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { SharedBoard } from '@/interface/SharedBoard'

interface Props {
  contextMenuOptions: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

export const SharedBoardsTableColumns: (
  props: Props
) => ColumnsType<SharedBoard> = ({ contextMenuOptions, functionsDictionary }) => {
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
              contextMenuOptions,
              functionsDictionary
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
