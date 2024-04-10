import { SharedBoardAccountFilters } from '@/interface/SharedBoard'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Form, Input, Row } from 'antd'
import { useState } from 'react'

interface Props {
  filters: SharedBoardAccountFilters
  onChangeFilters: (filters: SharedBoardAccountFilters) => void
  onCreate: () => void
}

const Toolbar = ({ onCreate, onChangeFilters, filters }: Props) => {
  const [timer, setTimer] = useState<number | null>(null)

  const handleSearchChange = (value: string) => {
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        onChangeFilters({ ...filters, search: value })
      }, 300)
    )
  }

  return (
    <Form>
      <Row gutter={[8, 8]} justify='space-between' align='middle'>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item name='search' noStyle>
            <Input.Search onChange={e => handleSearchChange(e.target.value)} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4} xl={4}>
          <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={onCreate}
            shape='round'
            type='primary'
            block
          >
            Crear cuenta
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default Toolbar
