import { decryptValue } from '@/utils/cryptoHooks'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { MenuProps } from 'antd/lib'
import SaleModel from '@/model/Sale'
import PasswordColumn from '@/app/sales/table/PasswordColumn'
import { Account } from '@/interface/Account'

interface Props {
  contextMenuOptions: MenuProps['items']
  functionsDictionary: { [key: string]: (record: any) => void }
}

export const AccountsTableColumns: (props: Props) => ColumnsType<Account> = ({
  contextMenuOptions,
  functionsDictionary
}) => {
  return [
    {
      title: 'Cuenta',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
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
      align: 'center'
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
      title: 'Perfiles',
      dataIndex: 'profiles',
      key: 'profiles',
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
