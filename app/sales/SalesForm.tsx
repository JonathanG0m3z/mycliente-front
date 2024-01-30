import { Button, Form, Input } from 'antd'
import Ejemplo from './AccountsCombobox'

export default function SalesForm () {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }
  return (
    <Form onFinish={onFinish}>
      <Form.Item
        rules={[{ required: true, message: 'Por favor, ingresa el total' }]}
        name='total'
      >
        <Input style={{ width: '100%' }} placeholder='Total' />
      </Form.Item>
      <Form.Item name='account' rules={[{ required: true, message: 'Por favor, selecciona una cuenta' }]}>
        <Ejemplo allowClear pageSize={5} />
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit'>Aceptar</Button>
      </Form.Item>
    </Form>
  )
}
