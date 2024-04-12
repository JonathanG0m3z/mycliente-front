'use client'
import { Account } from '@/interface/Account'
import AccountModel from '@/model/Account'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Button,
  Col, Form,
  Input, Row,
  notification
} from 'antd'

interface Props {
  record: Account | null
  onCancel: () => void
  onSave: () => void
}

const SharedBoardsForm = ({ record, onCancel, onSave }: Props) => {
  const { loading: loadingSubmit, fetchApiData: fetchAccount } = useLazyFetch()
  const onFinish = (values: any) => {
    const body = AccountModel.fromUiToApi(values)
    if (record) {
      fetchAccount(`sharedBoards/${record.id}`, 'POST', body)
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
      fetchAccount('sharedBoards', 'POST', {
        ...body,
        users: {
          [values?.user]: ['VER', 'CAMBIAR CONTRASEÑA']
        }
      })
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
            name='name'
            label='Nombre'
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input placeholder='Nombre' />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name='user'
            label='Email de usuario a compartir'
            rules={[{ required: true, message: 'El email es requerido' }]}
          >
            <Input placeholder='example@gmail.com' />
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

export default SharedBoardsForm
