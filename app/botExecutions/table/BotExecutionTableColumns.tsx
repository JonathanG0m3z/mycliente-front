'use client'
import { faEllipsisVertical, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Button, Dropdown, Space, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ContextMenuModel } from '@/utils/GlobalModel'
import { CustomMenuItem } from '@/interface/ContextMenu'
import dayjs from 'dayjs'
import { BotExecution } from '@/interface/BotExecution'
import { CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, SyncOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'

interface Props {
  contextMenuOptions: CustomMenuItem[]
}

const BotExecutionStatus: { [key: string]: ReactNode | undefined } = {
  PROCESO: <Tag color='processing' icon={<SyncOutlined spin />}>PROCESO</Tag>,
  ERROR: <Tag color='error' icon={<CloseCircleOutlined />}>ERROR</Tag>,
  CREADA: <Tag color='green' icon={<CheckCircleOutlined />}>CREADA</Tag>,
  RENOVADA: <Tag color='green' icon={<CheckCircleOutlined />}>RENOVADA</Tag>
}

const getParamsJson = (params: any) => {
  try {
    return JSON.parse(params?.body ?? {})
  } catch {
    return {}
  }
}

export const BotExecutionsTableColumns: (
  props: Props
) => ColumnsType<BotExecution> = ({ contextMenuOptions }) => {
  return [
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value, record) => {
        const paramsJson = getParamsJson(record?.params)
        return (
          <Space direction='horizontal'>
            {BotExecutionStatus[value] ?? value}
            {
              paramsJson?.demo === true && <FontAwesomeIcon icon={faStopwatch} />
            }
          </Space>
        )
      }
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
      title: 'Meses',
      dataIndex: 'params',
      key: 'params',
      align: 'center',
      render: (value, record) => {
        const paramsJson = getParamsJson(record?.params)
        const months = paramsJson?.months
        const hasPassword = !!paramsJson?.password
        return <Tag color='default' icon={hasPassword ? <DollarOutlined /> : <SyncOutlined spin />}>{months}</Tag>
      }
    },
    // {
    //   title: 'Servicio',
    //   dataIndex: ['account', 'service', 'name'],
    //   key: 'service',
    //   align: 'center'
    // },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      render: value => dayjs(value).format('DD-MM-YYYY HH:mm:ss')
    },
    {
      title: 'Usuario',
      dataIndex: ['user', 'name'],
      key: 'user',
      align: 'center',
      render: (value, record) => (
        <Tooltip title={value}>
          <Avatar style={{ backgroundColor: '#f56a00' }} src={record.user.picture}>{value[0]}</Avatar>
        </Tooltip>
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
