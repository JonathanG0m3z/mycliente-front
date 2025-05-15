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
import { useRouter } from 'next/navigation'
import React from 'react'

const NEXT_PUBLIC_IPTV_DISCOUNT = process.env.NEXT_PUBLIC_IPTV_DISCOUNT
const { Text } = Typography

interface Props {
  onCancel: () => void
}

const RenewForm: React.FC<Props> = ({ onCancel }) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const { loading: loadingSubmit, fetchApiData: renewAccount } = useLazyFetch()
  const discount: number = Number(NEXT_PUBLIC_IPTV_DISCOUNT ?? 0)
  const isDiscount: boolean = !!NEXT_PUBLIC_IPTV_DISCOUNT
  const onFinish = (values: any) => {
    renewAccount('bots/iptvPremiun/renew', 'POST', {
      demo: false,
      account_id: values?.account?.length === 1 ? encryptValue(values?.account?.[0]?.value) : undefined,
      months: values?.months || 1
    })
      .then((res: any) => {
        notification.success(res)
        form.resetFields()
        onCancel()
        router.push('/botExecutions')
      })
      .catch(err => {
        Modal.destroyAll()
        notification.error({
          message: 'Error',
          description: err
        })
      })
    onCancel()
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
              <Select.Option value={1}>1 mes <Text delete={isDiscount}>(1.75 USD)</Text>{isDiscount && `(${2 - (2 * discount / 100)})`}</Select.Option>
              {/* <Select.Option value={1.5}>1 mes + 15 días (1.5 USD)</Select.Option> */}
              <Select.Option value={2}>2 meses <Text delete={isDiscount}>(2.75 USD)</Text>{isDiscount && `(${4 - (4 * discount / 100)})`}</Select.Option>
              <Select.Option value={3}>3 meses <Text delete={isDiscount}>(3.5 USD)</Text>{isDiscount && `(${4.5 - (4.5 * discount / 100)})`}</Select.Option>
              <Select.Option value={6}>6 meses <Text delete={isDiscount}>(6.5USD)</Text>{isDiscount && `(${8 - (8 * discount / 100)})`}</Select.Option>
              <Select.Option value={12}>12 meses <Text delete={isDiscount}>(12 USD)</Text>{isDiscount && `(${15 - (15 * discount / 100)})`}</Select.Option>
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
    </Form>
  )
}

export default RenewForm
