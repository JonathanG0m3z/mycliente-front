import RemoteCombobox from '@/components/RemoteCombobox'
import { Account } from '@/interface/Account'
import { Button, Col, DatePicker, Form, Input, InputNumber, Row } from 'antd'

interface Props {
  record: Account | null
  onCancel: () => void
  onSave: () => void
}

const AccountsForm = ({ record, onCancel, onSave }: Props) => {
  return (
    <Form layout='vertical'>
      <Row>
        <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa el correo'
              }
            ]}
            label='Correo'
            name='email'
          >
            <Input placeholder='ejemplo@ejemplo.com' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name={['account', 'password']}
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
            name={['account', 'expiration']}
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
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name={['account', 'service']}
            rules={[
              {
                required: true,
                message: 'Por favor, selecciona un servicio'
              }
            ]}
            label='Servicio'
          >
            <RemoteCombobox
              originalQuery='services'
              pageSize={5}
              dataKey='services'
              optionValueKey='id'
              optionLabelKey='name'
              mode='tags'
              maxCount={1}
              placeholder='Selecciona un servicio o agregalo'
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name={['account', 'profiles']}
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa la cantidad de perfiles'
              }
            ]}
            label='Perfiles'
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder='Cantidad de perfiles'
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify='space-around'>
        <Form.Item>
          <Button type='primary' loading={false} htmlType='submit'>
            {record ? 'Actualizar' : 'Crear'}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button danger loading={false} onClick={onCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default AccountsForm
