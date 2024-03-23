import { Account } from '@/interface/Account'
import { decryptValue, encryptValue } from '@/utils/cryptoHooks'
import { useLazyFetch } from '@/utils/useFetch'
import { Button, Col, DatePicker, Form, Input, Row, notification } from 'antd'
import dayjs from 'dayjs'

interface Props {
  record: Account | null
  onCancel: () => void
  onSave: () => void
}

const RenewAccountForm = ({ record, onCancel, onSave }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchRenew } = useLazyFetch()
  const onFinish = (values: any) => {
    if (record) {
      fetchRenew(`accounts/renew/${record.id}`, 'POST', {
        ...values,
        expiration: dayjs(values.expiration).format('YYYY-MM-DD'),
        password: encryptValue(values.password)
      })
        .then((res: any) => {
          onSave()
          onCancel()
        })
        .catch(err => {
          notification.error({
            message: 'Error',
            description: err
          })
        })
    }
  }
  return (
    <Form
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        ...(record ?? {}),
        expiration: dayjs(record?.expiration).add(1, 'month'),
        password: decryptValue(record?.password ?? '')
      }}
    >
      <Row gutter={8}>
        <Col span={24}>
          <Form.Item name='email' label='Email'>
            <Input disabled placeholder='ejemplo@ejemplo.com' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa la contraseña'
              }
            ]}
            label='Contraseña'
          >
            <Input placeholder='Contraseña de la cuenta' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name='expiration'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa la fecha de vencimiento'
              }
            ]}
            label='Fecha de vencimiento'
          >
            <DatePicker
              placeholder='Fecha de vencimiento cuenta'
              style={{ width: '100%' }}
              format='DD/MM/YYYY'
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify='space-around'>
        <Form.Item>
          <Button type='primary' loading={loadingSubmit} htmlType='submit'>
            Renovar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button danger loading={loadingSubmit} onClick={onCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default RenewAccountForm
