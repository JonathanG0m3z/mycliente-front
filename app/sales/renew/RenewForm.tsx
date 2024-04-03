'use client'
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
  Modal,
  Row,
  notification
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import RenewResponse from './RenewResponse'

interface Props {
  record: Sale | null
  onCancel: () => void
  onSave: () => void
  onRenewAccount: (sale: Sale['account']) => void
}

const RenewForm = ({ record, onCancel, onSave, onRenewAccount }: Props) => {
  const [msgModalSettings, setMsgModalSettings] = useState({
    open: false,
    sale: record
  })
  const { loading: loadingSubmit, fetchApiData: fetchRenew } = useLazyFetch()
  const onFinish = (values: any) => {
    if (record) {
      fetchRenew(`sales/renew/${record.id}`, 'POST', {
        ...values,
        expiration: dayjs(values.expiration).format('YYYY-MM-DD')
      })
        .then((res: any) => {
          setMsgModalSettings({
            open: true,
            sale: { ...record, ...res.renewedSale }
          })
          onSave()
        })
        .catch(err => {
          notification.error({
            message: 'Error',
            description: err
          })
        })
    }
  }
  const onCloseMsgModal = () => {
    setMsgModalSettings({ ...msgModalSettings, open: false })
    onCancel()
  }
  const renewAccount = (account: Sale['account']) => {
    onRenewAccount(account)
    onCloseMsgModal()
    onCancel()
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
            Renovar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button danger loading={loadingSubmit} onClick={onCancel}>
            Cancelar
          </Button>
        </Form.Item>
      </Row>
      <Modal
        open={msgModalSettings.open}
        title={null}
        onCancel={onCloseMsgModal}
        footer={null}
        destroyOnClose
      >
        <RenewResponse
          sale={msgModalSettings.sale}
          onClose={onCloseMsgModal}
          onRenewAccount={renewAccount}
        />
      </Modal>
    </Form>
  )
}

export default RenewForm
