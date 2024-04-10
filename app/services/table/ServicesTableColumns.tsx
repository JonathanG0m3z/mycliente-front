'use client'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { Service } from '@/interface/Service'
import { useGetPayload } from '@/utils/useGetPayload'
import { CustomMenuItem } from '@/interface/ContextMenu'

interface Props {
  contextMenuOptions: CustomMenuItem[]
}

export const ServicesTableColumns: (props: Props) => ColumnsType<Service> = ({
  contextMenuOptions
}) => {
  const userId = useGetPayload()?.id
  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (value, record) => (
        `${value} ${record.userId !== null ? '' : '(Servicio común)'}`
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
              (record) => record?.userId !== userId
            )
          }}
          trigger={['click']}
          disabled={record.userId === null}
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
