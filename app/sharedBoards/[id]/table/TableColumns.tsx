'use client'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { Account } from '@/interface/Account'
import dayjs from 'dayjs'
import PasswordColumn from '@/app/sales/table/PasswordColumn'
import { decryptValue } from '@/utils/cryptoHooks'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { SharedBoardAccountFilters } from '@/interface/SharedBoard'
import GlobalModel from '@/model/GlobalModel'
import { SyncOutlined } from '@ant-design/icons'

interface Props {
  contextMenuOptions: CustomMenuItem[]
  filters: SharedBoardAccountFilters
}

export const TableColumns: (
  props: Props
) => ColumnsType<Account> = ({ contextMenuOptions, filters }) => {
  return [
    {
      title: 'Cuenta',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      render: value => <Typography.Text copyable>{value}</Typography.Text>
    },
    {
      title: 'Días para renovación',
      dataIndex: 'expiration',
      key: 'account',
      render: (value) => {
        const days = dayjs(value)
          .startOf('day')
          .diff(dayjs().startOf('day'), 'days')
        return (
          <Tag
            color={days <= 1 ? 'red' : days <= 5 ? 'warning' : undefined}
            bordered={days <= 5}
          >
            {days}
          </Tag>
        )
      },
      align: 'center',
      sorter: true,
      defaultSortOrder: GlobalModel.getOrderFromFilters('expiration', filters.order)
    },
    {
      title: 'Servicio',
      dataIndex: ['service', 'name'],
      key: 'service',
      align: 'center'
    },
    {
      title: 'Contraseña',
      dataIndex: 'password',
      key: 'password',
      render: value => <PasswordColumn value={decryptValue(value)} />,
      align: 'center'
    },
    {
      title: 'Fecha de expiración',
      dataIndex: 'expiration',
      key: 'expiration',
      render: value => dayjs(value).format('DD-MM-YYYY'),
      align: 'center'
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: value => value === 'ERROR'
        ? <Tag color='red'>{value}</Tag>
        : value === 'CREANDO'
          ? <Tag color='processing' icon={<SyncOutlined spin />}>{value}</Tag>
          : value === 'ACTIVA' ? <Tag color='green'>{value}</Tag> : <Tag color='blue'>{value}</Tag>,
      align: 'center'
    },
    {
      title: 'Comentario',
      dataIndex: ['extras', 'comment'],
      key: 'extras',
      align: 'center'
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
