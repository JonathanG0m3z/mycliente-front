'use client'

import { encryptValue } from '@/utils/cryptoHooks'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Typography
} from 'antd'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
  onCancel: () => void
}

const LattvForm: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm()
  const { loading: loadingSubmit, fetchApiData: createAccount } = useLazyFetch()
  const isDemo: boolean = Form.useWatch('demo', form)
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
    createAccount('bots/lattv', 'POST', {
      ...values,
      password: encryptValue(values.password),
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
      initialValues={{ demo: false, months: 1 }}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]} justify='center'>
        <Col span={24}>
          <Form.Item
            name='username'
            label='Nombre de usuario'
            rules={[
              { required: true, message: 'Campo requerido' },
              { min: 8, message: 'Min. 8 caracteres' },
              {
                validator: (_, value) => {
                  if (value && value.trim() !== value) {
                    return Promise.reject(new Error('El valor no puede contener espacios en blanco'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              autoComplete='off'
              placeholder='(Min. 8 caracteres)'
              allowClear
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name='password'
            label='Contraseña'
            rules={[
              { required: true, message: 'Campo requerido' },
              { min: 8, message: 'Min. 8 caracteres' },
              {
                validator: (_, value) => {
                  if (value && value.trim() !== value) {
                    return Promise.reject(new Error('El valor no puede contener espacios en blanco'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input
              autoComplete='off'
              placeholder='(Min. 8 caracteres)'
              allowClear
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={isDemo ? 24 : 12}>
          <Form.Item name='demo' label='Tipo de cuenta'>
            <Radio.Group disabled>
              <Radio value={false}>Cuenta paga</Radio>
              <Radio value>Demo</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {!isDemo && (
          <Col span={12}>
            <Form.Item
              name='months'
              label='Meses'
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Select disabled allowClear>
                <Select.Option value={1}>1 mes (1.5 USD)</Select.Option>
                <Select.Option value={2}>2 meses (3 USD)</Select.Option>
                <Select.Option value={3}>3 meses + 15 días (4 USD) </Select.Option>
                <Select.Option value={4}>4 meses (5 USD)</Select.Option>
                <Select.Option value={6}>6 meses (6.5 USD)</Select.Option>
                <Select.Option value={8}>8 meses (8.5 USD)</Select.Option>
                <Select.Option value={12}>12 meses (12 USD) </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        )}
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
        <Typography.Text
          copyable={{
            text: `*Velocidad mínima requerida: 25 Megas de Internet.*
Nombre: LATTV
Usuario: ${newAccountData?.username}
Contraseña: ${newAccountData?.password}
URL: http://xyz.lattv.com.co:25461
Vecha vencimiento: ${newAccountData?.exp
                ? dayjs(newAccountData?.exp).format('DD/MM/YYYY hh:mm a')
                : ''
              }`
          }}
        >
          *Velocidad mínima requerida: 25 Megas de Internet.*
          <br />
          Nombre: LATTV
          <br />
          Usuario: {newAccountData?.username}
          <br />
          Contraseña: {newAccountData?.password}
          <br />
          URL: http://xyz.lattv.com.co:25461
          <br />
          Vecha vencimiento:{' '}
          {newAccountData?.exp
            ? dayjs(newAccountData?.exp).format('DD/MM/YYYY hh:mm a')
            : ''}
        </Typography.Text>
        <br />
        <Button type='primary' onClick={onCancel} shape='round'>
          Aceptar
        </Button>
      </Modal>
    </Form>
  )
}

export default LattvForm
