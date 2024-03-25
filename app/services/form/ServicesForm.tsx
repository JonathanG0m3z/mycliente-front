import { Service } from '@/interface/Service'
import { useLazyFetch } from '@/utils/useFetch'
import { Button, Col, Form, Input, Row, notification } from 'antd'

interface Props {
  record: Service | null
  onSave: () => void
  onCancel: () => void
}

const ServicesForm = ({ record, onSave, onCancel }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchService } = useLazyFetch()
  const onFinish = (values: any) => {
    if (record) {
      fetchService(`services/${record.id}`, 'POST', values)
        .then((res: Service) => {
          onSave()
          onCancel()
        })
        .catch(err => {
          notification.error({
            message: 'Error',
            description: err
          })
        })
    } else {
      fetchService('services', 'POST', values)
        .then((res: Service) => {
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
      initialValues={{
        name: record?.name
      }}
      onFinish={onFinish}
    >
      <Col span={24}>
        <Form.Item
          name='name'
          label='Nombre'
          rules={[{ required: true }]}
          initialValue={record?.name}
        >
          <Input placeholder='Nombre del servicio' />
        </Form.Item>
      </Col>
      <Row justify='space-around'>
        <Form.Item noStyle>
          <Button type='primary' loading={loadingSubmit} htmlType='submit'>
            {record ? 'Actualizar' : 'Crear'}
          </Button>
        </Form.Item>
        <Form.Item noStyle>
          <Button danger loading={loadingSubmit} onClick={onCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default ServicesForm
