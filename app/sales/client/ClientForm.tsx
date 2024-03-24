import CountryCode from '@/components/CountryCode'
import { Sale } from '@/interface/Sale'
import { useLazyFetch } from '@/utils/useFetch'
import { Button, Col, Form, Input, InputNumber, Row } from 'antd'

interface Props {
  record: null | Sale['client']
  onCancel: () => void
  onSave: () => void
}

const ClientForm = ({ record, onCancel, onSave }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchSale } = useLazyFetch()
  return (
    <Form layout='vertical' initialValues={{ ...(record ?? {}) }}>
      <Row gutter={8}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name='name'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa un nombre'
              }
            ]}
            label='Nombre'
          >
            <Input placeholder='Nombre del cliente' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item name='email' label='Email'>
            <Input placeholder='Email del cliente (Opcional)' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name='country'
            label='Código - país'
            rules={[{ required: true, message: 'Por favor, ingresa un país' }]}
          >
            <CountryCode placeholder='Pais y código' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item name='phone' label='Télefono'>
            <InputNumber
              style={{ width: '100%' }}
              placeholder='Télefono o whatsapp (Opcional)'
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify='space-around'>
        <Form.Item>
          <Button type='primary' loading={loadingSubmit} htmlType='submit'>
            {record ? 'Actualizar' : 'Crear'}
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

export default ClientForm
