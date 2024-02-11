import { SaleData } from '@/interface/Sale'
import { decryptValue } from '@/utils/cryptoHooks'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

export const SaleTableColumns: () => ColumnsType<SaleData> = () => [
  {
    title: 'Cliente',
    dataIndex: ['client', 'name'],
    key: 'client'
  },
  {
    title: 'Días para renovación',
    dataIndex: 'expiration',
    key: 'account',
    render: (value) => dayjs(value).diff(dayjs(), 'days')
  },
  {
    title: 'Servicio',
    dataIndex: ['account', 'service', 'name'],
    key: 'account'
  },
  {
    title: 'Cuenta',
    dataIndex: ['account', 'email'],
    key: 'account'
  },
  {
    title: 'Contraseña',
    dataIndex: ['account', 'password'],
    key: 'account',
    render: (value) => decryptValue(value)
  },
  {
    title: 'Profile',
    dataIndex: 'profile',
    key: 'profile'
  },
  {
    title: 'Pin',
    dataIndex: 'pin',
    key: 'pin'
  },
  {
    title: 'Teléfono cliente',
    dataIndex: ['client', 'phone'],
    key: 'client'
  },
  {
    title: 'Fecha de expiración',
    dataIndex: 'expiration',
    key: 'sale',
    render: (value) => dayjs(value).format('DD-MM-YYYY')
  }
]
