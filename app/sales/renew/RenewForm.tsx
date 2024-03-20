import { Sale } from '@/interface/Sale'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row
} from 'antd'
import dayjs from 'dayjs'

interface Props {
  record: Sale | null
  onCancel: () => void
}

const RenewForm = ({ record, onCancel }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchRenew } = useLazyFetch()
  const onFinish = (values: any) => {
    console.log('values:', values)
  }
  return (
    <Form
      initialValues={{
        ...(record ?? {}),
        expiration: record?.expiration
          ? dayjs(record.expiration).add(1, 'month')
          : undefined
      }}
      layout='vertical'
      onFinish={onFinish}
    >
      <Form.Item name={['client', 'name']} label='Cliente'>
        <Input disabled />
      </Form.Item>
      <Form.Item name={['account', 'email']} label='Cuenta'>
        <Input disabled />
      </Form.Item>
      <Divider>Datos de la renovación</Divider>
      <Row gutter={8}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name='expiration'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa la fecha de renovación'
              }
            ]}
            label='Fecha de renovación'
          >
            <DatePicker
              placeholder='Fecha de vencimiento cliente'
              style={{ width: '100%' }}
              format='DD/MM/YYYY'
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item name='price' label='Precio de renovación'>
            <InputNumber
              style={{ width: '100%' }}
              placeholder='Precio (Opcional)'
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item name='profile' label='Perfil'>
            <Input placeholder='Perfil (Opcional)' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item name='pin' label='Pin'>
            <InputNumber
              style={{ width: '100%' }}
              placeholder='Pin (Opcional)'
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

export default RenewForm
