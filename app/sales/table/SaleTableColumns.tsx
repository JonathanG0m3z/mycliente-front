import { Sale } from '@/interface/Sale'
import { decryptValue } from '@/utils/cryptoHooks'
import { WhatsAppOutlined } from '@ant-design/icons'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Spin, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import PasswordColumn from './PasswordColumn'
import { MenuProps } from 'antd/lib'
import SaleModel from '@/model/Sale'
import SaleReminderWpp from '../notification/SaleReminderWpp'
import { useState } from 'react'

interface Props {
  contextMenuOptions: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

export const SaleTableColumns: (props: Props) => ColumnsType<Sale> = ({
  contextMenuOptions,
  functionsDictionary
}) => {
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false)
  return [
    {
      title: 'Cliente',
      dataIndex: ['client', 'name'],
      key: 'client',
      align: 'center'
    },
    {
      title: 'Días para renovación',
      dataIndex: 'expiration',
      key: 'account',
      render: (value, record) => {
        const days = dayjs(value)
          .startOf('day')
          .diff(dayjs().startOf('day'), 'days')
        return (
          <Tag
            color={days <= 1 ? 'red' : days <= 5 ? 'warning' : undefined}
            bordered={days <= 5}
            icon={days <= 5 ? (loadingWhatsapp ? <Spin spinning size='small' /> : <WhatsAppOutlined />) : undefined}
            style={{ cursor: days <= 5 ? 'pointer' : undefined }}
            onClick={() => {
              setLoadingWhatsapp(true)
              SaleReminderWpp.sendByWhatsapp(record)
                .then(() => setLoadingWhatsapp(false))
            }}
          >
            {days}
          </Tag>
        )
      },
      align: 'center'
    },
    {
      title: 'Servicio',
      dataIndex: ['account', 'service', 'name'],
      key: 'account',
      align: 'center'
    },
    {
      title: 'Cuenta',
      dataIndex: ['account', 'email'],
      key: 'account',
      align: 'center'
    },
    {
      title: 'Contraseña',
      dataIndex: ['account', 'password'],
      key: 'account',
      render: value => <PasswordColumn value={decryptValue(value)} />,
      align: 'center'
    },
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      align: 'center'
    },
    {
      title: 'Pin',
      dataIndex: 'pin',
      key: 'pin',
      align: 'center'
    },
    {
      title: 'Teléfono cliente',
      dataIndex: ['client', 'phone'],
      key: 'client',
      align: 'center'
    },
    {
      title: 'Fecha de expiración',
      dataIndex: 'expiration',
      key: 'sale',
      render: value => dayjs(value).format('DD-MM-YYYY'),
      align: 'center'
    },
    {
      title: 'Opciones',
      dataIndex: '',
      key: '',
      render: (value, record) => (
        <Dropdown
          menu={{
            items: SaleModel.createMenuContext(
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
