'use client'

import RemoteCombobox from '@/components/RemoteCombobox'
import { encryptValue } from '@/utils/cryptoHooks'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Button,
  Col,
  Form, Modal,
  notification, Row,
  Select,
  Typography
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
  onCancel: () => void
}

const RenewForm: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm()
  const { loading: loadingSubmit, fetchApiData: createAccount } = useLazyFetch()
  const [informationModalOpen, setInformationModalOpen] = React.useState(false)
  const [newAccountData, setNewAccountData] = React.useState<{
    exp: string
    username: string
    password: string
  } | null>(null)
  const onOpenDialog = (data: any) => {
    setInformationModalOpen(true)
    setNewAccountData(data)
  }
  const onCloseDialog = () => {
    setInformationModalOpen(false)
    setNewAccountData(null)
    onCancel()
  }
  const onFinish = (values: any) => {
    Modal.confirm({
      title: 'Bot ejecutado',
      content:
        'El bot tardará unos momentos en crear la cuenta. Puedes cerrar esta ventana mientras él trabaja y te llegará un correo de confirmación. O puedes esperar en esta ventana',
      onOk: onCancel,
      okText: 'Cerrar ventana',
      cancelText: 'Esperar'
    })
    createAccount('bots/iptvPremiun/renew', 'POST', {
      demo: false,
      account_id: values?.account?.length === 1 ? encryptValue(values?.account?.[0]?.value) : undefined,
      months: values?.months || 1
    })
      .then((res: any) => {
        onOpenDialog(res)
        form.resetFields()
      })
      .catch(err => {
        notification.error({
          message: 'Error',
          description: err
        })
      })
  }
  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={{ months: 1 }}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]} justify='center'>
        <Col span={24}>
          <Form.Item name='account' rules={[{ required: true, message: 'Campo requerido' }]} label='Cuenta'>
            <RemoteCombobox
              originalQuery='sharedBoards/renewIptvAccounts/2243e6ec-eb5b-456a-931a-9de58fda5af8'
              pageSize={5}
              dataKey='accounts'
              optionValueKey='id'
              optionLabelKey='email'
              labelTemplate='{{email}} - ({{expiration}})'
              mode='tags'
              maxCount={1}
              placeholder='Selecciona una cuenta'
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name='months'
            label='Meses'
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select allowClear>
              <Select.Option value={1}>1 mes (2 USD)</Select.Option>
              <Select.Option value={2}>2 meses (4 USD)</Select.Option>
              <Select.Option value={3}>3 meses (4.5 USD)</Select.Option>
              <Select.Option value={6}>6 meses (8 USD) </Select.Option>
              <Select.Option value={12}>12 meses (15 USD)</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify='space-around'>
        <Form.Item>
          <Button loading={loadingSubmit} type='primary' htmlType='submit'>
            Crear
          </Button>
        </Form.Item>
        <Form.Item>
          <Button danger onClick={onCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Row>
      <Modal open={informationModalOpen} onCancel={onCloseDialog} footer={null}>
        <Typography.Title level={5}>
          ¡Cuenta renovada exitosamente!
        </Typography.Title>
        <Typography.Text copyable={{
          text: `${newAccountData?.username} ha sido renovada hasta el ${newAccountData?.exp ? dayjs(newAccountData?.exp).format('DD-MM-YYYY') : ''}.
Gracias por su renovación`
        }}
        >
          {newAccountData?.username} ha sido renovada hasta el {newAccountData?.exp ? dayjs(newAccountData?.exp).format('DD-MM-YYYY') : ''}.
          Gracias por su renovación
        </Typography.Text>
        <br />
        <Button type='primary' onClick={onCancel} shape='round'>
          Aceptar
        </Button>
      </Modal>
    </Form>
  )
}

export default RenewForm