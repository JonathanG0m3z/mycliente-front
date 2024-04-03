'use client'
import RemoteCombobox from '@/components/RemoteCombobox'
import { Account } from '@/interface/Account'
import AccountModel from '@/model/Account'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  notification
} from 'antd'

interface Props {
  record: Account | null
  onCancel: () => void
  onSave: () => void
}

const AccountsForm = ({ record, onCancel, onSave }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchAccount } = useLazyFetch()
  const onFinish = (values: any) => {
    const body = AccountModel.fromUiToApi(values)
    if (record) {
      fetchAccount(`accounts/${record.id}`, 'POST', body)
        .then((res: Account) => {
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
      fetchAccount('accounts', 'POST', body)
        .then((res: Account) => {
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
      initialValues={AccountModel.createInitialValues(record)}
    >
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
        <Col xs={24} sm={12} md={12} lg={12}>
          <Form.Item
            name='service'
            rules={[
              {
                required: true,
                message: 'Por favor, selecciona un servicio'
              }
            ]}
            label='Servicio'
          >
            <RemoteCombobox
              originalQuery='services/combobox'
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
            name='profiles'
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

export default AccountsForm
