import { useLazyFetch } from '@/utils/useFetch'
import { Button, Col, Form, InputNumber, notification, Row } from 'antd'
import React from 'react'

interface Props {
  onCancel: () => void
}

const UpdateBalanceForm: React.FC<Props> = ({ onCancel }) => {
  const { fetchApiData: fetchApi, loading } = useLazyFetch()
  const onFinish = (values: any) => {
    fetchApi('users/updateBalance', 'POST', {
      id: '642b717f-3557-4eaa-8402-420b054f0a94',
      amount: values.amount
    })
      .then(() => {
        notification.success({
          message: 'Saldo reseteado exitosamente'
        })
        onCancel()
      })
      .catch(err => {
        notification.error({
          message: 'Error',
          description: err
        })
      })
  }
  return (
    <Form layout='vertical' onFinish={onFinish}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Form.Item
            name='amount'
            rules={[{ required: true, message: 'Campo requerido' }]}
            label='Valor'
          >
            <InputNumber
              placeholder='Cantidad a sumar al saldo'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify='space-around'>
        <Form.Item>
          <Button loading={loading} type='primary' htmlType='submit'>
            Actualizar
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

export default UpdateBalanceForm
