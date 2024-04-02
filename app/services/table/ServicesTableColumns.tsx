import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { MenuProps } from 'antd/lib'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { Service } from '@/interface/Service'
import { useGetPayload } from '@/utils/useGetPayload'

interface Props {
  contextMenuOptions: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

export const ServicesTableColumns: (props: Props) => ColumnsType<Service> = ({
  contextMenuOptions,
  functionsDictionary
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
              functionsDictionary,
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
