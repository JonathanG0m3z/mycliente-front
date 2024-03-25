import CountryCode from '@/components/CountryCode'
import RemoteCombobox from '@/components/RemoteCombobox'
import { useLazyFetch } from '@/utils/useFetch'
import {
  Alert,
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
import SaleModel from '../../../model/Sale'
import { Sale, SaleData } from '@/interface/Sale'
import { useState } from 'react'
import SaleResponse from './SaleResponse'

interface Props {
  record: Sale | null
  onCancel: () => void
  onSave: () => void
}
export default function SalesForm ({ onCancel, onSave, record }: Props) {
  const [form] = Form.useForm()
  const account = Form.useWatch(['account', 'email'], form)
  const client = Form.useWatch(['client', 'search'], form)
  const { loading: loadingSubmit, fetchApiData: fetchSale } = useLazyFetch()
  const [modalSettings, setModalSettings] = useState<{
    open: boolean
    sale: null | SaleData
  }>({
    open: false,
    sale: null
  })
  const onOpenDialog = (sale: SaleData) => {
    setModalSettings({
      open: true,
      sale
    })
  }
  const onCloseDialog = () => {
    setModalSettings({
      open: false,
      sale: null
    })
    onCancel()
  }
  const onFinish = (values: any) => {
    const body = SaleModel.fromUiToApi(values)
    if (record) {
      fetchSale(`sales/${record.id}`, 'POST', body)
        .then((res: SaleData) => {
          onOpenDialog(res)
          onSave()
          form.resetFields()
        })
        .catch(err => {
          notification.error({
            message: 'Error',
            description: err
          })
        })
    } else {
      fetchSale('sales', 'POST', body)
        .then((res: SaleData) => {
          onOpenDialog(res)
          onSave()
          form.resetFields()
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
    <>
      <Form
        onFinish={onFinish}
        form={form}
        initialValues={SaleModel.createInitialValues(record)}
        layout='vertical'
      >
        <Col span={24}>
          <Form.Item
            name={['client', 'search']}
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
        {client?.length > 0 &&
          client[0].label === undefined &&
          client[0].value !== undefined && (
            <Row gutter={8}>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name={['client', 'name']}
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, ingresa un nombre'
                    }
                  ]}
                  label='Nombre'
                >
                  <Input placeholder='Nombre del cliente' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item name={['client', 'email']} label='Email'>
                  <Input placeholder='Email del cliente (Opcional)' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name={['client', 'country']}
                  label='Código - país'
                  rules={[
                    { required: true, message: 'Por favor, ingresa un país' }
                  ]}
                >
                  <CountryCode placeholder='Pais y código' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item name={['client', 'phone']} label='Télefono'>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder='Télefono o whatsapp (Opcional)'
                  />
                </Form.Item>
              </Col>
            </Row>
        )}
        {client?.length > 0 &&
          client[0].label !== undefined &&
          client[0].value !== undefined && (
            <Alert
              message='Ya se tiene la información del cliente'
              type='success'
            />
        )}
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
        <Divider>Datos de la venta</Divider>
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
            <Form.Item name='price' label='Precio de venta'>
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
      <Modal
        open={modalSettings.open}
        title={null}
        onCancel={onCloseDialog}
        footer={null}
      >
        <SaleResponse sale={modalSettings.sale} onClose={onCloseDialog} />
      </Modal>
    </>
  )
}
