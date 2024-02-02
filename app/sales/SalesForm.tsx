import RemoteCombobox from '@/components/RemoteCombobox'
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row
} from 'antd'
import dayjs from 'dayjs'

export default function SalesForm () {
  const [form] = Form.useForm()
  const account = Form.useWatch(['account', 'email'], form)
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }
  return (
    <Form
      onFinish={onFinish}
      form={form}
      initialValues={{
        account: {
          expiration: dayjs().add(1, 'month')
        }
      }}
      layout='vertical'
    >
      <Col span={24}>
        <Form.Item
          name={['client', 'name']}
          rules={[
            { required: true, message: 'Por favor, selecciona un cliente' }
          ]}
          label='Cliente'
        >
          <RemoteCombobox
            originalQuery='clients/combobox'
            pageSize={5}
            dataKey='clients'
            optionValueKey='id'
            optionLabelKey='name'
            labelTemplate='{{name}} - ({{phone}})'
            mode='tags'
            maxCount={1}
            placeholder='Selecciona un cliente o agregalo'
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name={['account', 'email']}
          rules={[
            { required: true, message: 'Por favor, selecciona una cuenta' }
          ]}
          label='Cuenta'
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
      </Col>
      {account?.length > 0 &&
        account[0].label === undefined &&
        account[0].value !== undefined && (
          <Row gutter={8}>
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
      )}
      {account?.length > 0 &&
        account[0].label !== undefined &&
        account[0].value !== undefined && (
          <Alert
            message='Ya se tiene la información de la cuenta'
            type='success'
          />
      )}
      <Form.Item>
        <Button htmlType='submit'>Aceptar</Button>
      </Form.Item>
    </Form>
  )
}
