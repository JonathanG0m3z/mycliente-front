'use client'
import RemoteCombobox from '@/components/RemoteCombobox'
import { Account } from '@/interface/Account'
import SharedBoardModel from '@/model/SharedBoard'
import { useLazyFetch } from '@/utils/useFetch'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  notification
} from 'antd'

interface Props {
  sharedBoardId: string
  record: Account | null
  onCancel: () => void
  onSave: () => void
  isChangePassword?: boolean
}

const AccountsForm = ({ record, onCancel, onSave, sharedBoardId, isChangePassword }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchAccount } = useLazyFetch()
  const onFinish = (values: any) => {
    const body = SharedBoardModel.fromUiToApi({
      ...values,
      sharedBoardId
    })
    if (record) {
      fetchAccount(`sharedBoards/accounts/${record.id}`, 'POST', body)
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
      fetchAccount('sharedBoards/accounts', 'POST', body)
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
      initialValues={SharedBoardModel.createInitialValues(record)}
    >
      <Row gutter={8}>
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
            <Input prefix={<FontAwesomeIcon icon={faEnvelope} />} disabled={isChangePassword} placeholder='ejemplo@ejemplo.com' />
          </Form.Item>
        </Col>
        <Col span={24}>
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
            <Input prefix={<FontAwesomeIcon icon={faKey} />} placeholder='Contraseña de la cuenta' />
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
              disabled={isChangePassword}
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
              disabled={isChangePassword}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name='comment'
            label='Comentario'
          >
            <Input.TextArea disabled={isChangePassword} placeholder='Añadir comentario...' />
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
