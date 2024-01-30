import RemoteCombobox from '@/components/RemoteCombobox'
import { Button, Form } from 'antd'

export default function SalesForm () {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }
  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name='account'
        rules={[
          { required: true, message: 'Por favor, selecciona una cuenta' }
        ]}
      >
        <RemoteCombobox
          originalQuery='accounts/combobox'
          pageSize={5}
          dataKey='accounts'
          optionValueKey='id'
          optionLabelKey='email'
          mode='tags'
          maxCount={1}
          placeholder='Selecciona una cuenta o agregala'
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit'>Aceptar</Button>
      </Form.Item>
    </Form>
  )
}
