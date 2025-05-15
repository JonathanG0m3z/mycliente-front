'use client'

import { encryptValue } from '@/utils/cryptoHooks'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Button,
  Col,
  Form,
  Input, notification,
  Radio,
  Row,
  Select,
  Typography
} from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

const NEXT_PUBLIC_IPTV_DISCOUNT = process.env.NEXT_PUBLIC_IPTV_DISCOUNT
const { Text } = Typography

interface Props {
  onCancel: () => void
}

const IptvPremiunForm: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const username = Form.useWatch('username', form)
  const { loading: loadingSubmit, fetchApiData: createAccount } = useLazyFetch()
  const isDemo: boolean = Form.useWatch('demo', form)
  const discount: number = Number(NEXT_PUBLIC_IPTV_DISCOUNT ?? 0)
  const isDiscount: boolean = !!NEXT_PUBLIC_IPTV_DISCOUNT
  const onFinish = (values: any) => {
    createAccount('bots/iptvPremiun', 'POST', {
      ...values,
      password: encryptValue(values.password),
      months: values?.months || 1
    })
      .then((res: any) => {
        notification.success(res)
        form.resetFields()
        onCancel()
        router.push('/botExecutions')
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
              },
              {
                validator: (_, value) => {
                  if (value === username) {
                    return Promise.reject(new Error('La contraseña y usuario no pueden ser las mismas'))
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
            />
          </Form.Item>
        </Col>
        <Col span={isDemo ? 24 : 12}>
          <Form.Item name='demo' label='Tipo de cuenta'>
            <Radio.Group>
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
              <Select allowClear>
                <Select.Option value={1}>1 mes <Text delete={isDiscount}>(1.75 USD)</Text>{isDiscount && `(${2 - (2 * discount / 100)})`}</Select.Option>
                {/* <Select.Option value={1.5}>1 mes + 15 días (1.5 USD)</Select.Option> */}
                <Select.Option value={2}>2 meses <Text delete={isDiscount}>(2.75 USD)</Text>{isDiscount && `(${4 - (4 * discount / 100)})`}</Select.Option>
                <Select.Option value={3}>3 meses <Text delete={isDiscount}>(3.5 USD)</Text>{isDiscount && `(${4.5 - (4.5 * discount / 100)})`}</Select.Option>
                <Select.Option value={6}>6 meses <Text delete={isDiscount}>(6.5 USD)</Text>{isDiscount && `(${8 - (8 * discount / 100)})`}</Select.Option>
                <Select.Option value={12}>12 meses <Text delete={isDiscount}>(12 USD)</Text>{isDiscount && `(${15 - (15 * discount / 100)})`}</Select.Option>
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
    </Form>
  )
}

export default IptvPremiunForm
