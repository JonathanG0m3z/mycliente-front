import RemoteCombobox from '@/components/RemoteCombobox'
import { SharedBoardAccountFilters } from '@/interface/SharedBoard'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, DatePicker, Form, Select } from 'antd'

interface Props {
  currentFilters: SharedBoardAccountFilters
  onChangeFilters: (filters: SharedBoardAccountFilters) => void
  onClose: () => void
}

const FiltersForm = ({ currentFilters, onChangeFilters, onClose }: Props) => {
  const onFinish = (values: any) => {
    onChangeFilters({ ...currentFilters, ...values })
    onClose()
  }
  return (
    <Form layout='vertical' initialValues={currentFilters} onFinish={onFinish}>
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
        <Form.Item name='expiration_range' label='Fecha de expiración'>
          <DatePicker.RangePicker
            format='DD/MM/YYYY'
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name='is_deleted' label='Mostrar'>
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
