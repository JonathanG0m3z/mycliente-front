// app/sales/table/FiltersForm.tsx
import RemoteCombobox from '@/components/RemoteCombobox'
import { SaleFilters } from '@/interface/Sale' // Usar SaleFilters
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, DatePicker, Form, Select } from 'antd'
import dayjs from 'dayjs'

interface Props {
  currentFilters: SaleFilters
  onChangeFilters: (filters: SaleFilters) => void
  onClose: () => void
}

const FiltersForm = ({ currentFilters, onChangeFilters, onClose }: Props) => {
  const onFinish = (values: any) => {
    const newFilters = { ...currentFilters, ...values }
    if (values.expiration_range && values.expiration_range[0] && values.expiration_range[1]) {
        newFilters.expiration_range = [
            dayjs(values.expiration_range[0]).format('YYYY-MM-DD'),
            dayjs(values.expiration_range[1]).format('YYYY-MM-DD')
        ];
    } else {
        if (!values.expiration_range) {
            newFilters.expiration_range = undefined;
        } else {
             newFilters.expiration_range = values.expiration_range;
        }
    }

    if (values.service && values.service.length === 0) {
        newFilters.service = undefined;
    }


    onChangeFilters(newFilters)
    onClose()
  }
  return (
    <Form
      layout='vertical'
      initialValues={{
        ...currentFilters,
        expiration_range: currentFilters.expiration_range?.length === 2 && currentFilters.expiration_range[0] && currentFilters.expiration_range[1]
            ? [dayjs(currentFilters.expiration_range[0]), dayjs(currentFilters.expiration_range[1])]
            : undefined
      }}
      onFinish={onFinish}
    >
      <Col span={24}>
        <Form.Item
          name='service'
          label='Servicio'
        >
          <RemoteCombobox
            originalQuery='services/combobox'
            pageSize={5}
            dataKey='services'
            optionValueKey='id'
            optionLabelKey='name'
            mode='multiple'
            maxTagCount='responsive'
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
            name='expiration_range'
            label='Fecha de expiración'
        >
          <DatePicker.RangePicker
            format='DD/MM/YYYY'
            style={{ width: '100%' }}
            allowEmpty={[true, true]}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
            name='is_deleted'
            label='Mostrar'
        >
          <Select
            placeholder='Todas'
            options={[
              { value: false, label: 'Activas' },
              { value: true, label: 'Eliminadas' }
            ]}
            allowClear
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item>
          <Button
            type='primary'
            icon={<FontAwesomeIcon icon={faFilter} />}
            style={{ width: '100%' }}
            htmlType='submit'
          >
            Aplicar filtros
          </Button>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item>
          <Button danger style={{ width: '100%' }} onClick={onClose}>
            Cancelar
          </Button>
        </Form.Item>
      </Col>
    </Form>
  )
}

export default FiltersForm
