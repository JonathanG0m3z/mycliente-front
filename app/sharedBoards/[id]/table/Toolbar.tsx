import {
  SharedBoardAccountFilters,
  SharedBoardAccountsData
} from '@/interface/SharedBoard'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, FloatButton, Form, Input, Row } from 'antd'
import { useMemo, useState } from 'react'

interface Props {
  filters: SharedBoardAccountFilters
  onChangeFilters: (filters: SharedBoardAccountFilters) => void
  onCreate: () => void
  tableData: SharedBoardAccountsData | null
}

const Toolbar = ({ onCreate, onChangeFilters, filters, tableData }: Props) => {
  const [timer, setTimer] = useState<any | null>(null)

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

  const doIHaveCreatePermission: boolean = useMemo(() => {
    return !!(
      tableData?.permissions === 'admin' ||
      tableData?.permissions?.includes('CREAR')
    )
  }, [tableData?.permissions])

  return (
    <>
      <Form>
        <Row
          gutter={[8, 8]}
          justify='space-between'
          align='middle'
          style={{ padding: '4px 0 4px 0' }}
        >
          <Col span={24}>
            <Form.Item name='search' noStyle>
              <Input.Search
                onChange={e => handleSearchChange(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <FloatButton.Group
        trigger='click'
        style={{ right: 24 }}
        icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
        tooltip='Opciones'
      >
        {doIHaveCreatePermission && (
          <FloatButton
            onClick={onCreate}
            tooltip='Crear cuenta'
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        )}
      </FloatButton.Group>
    </>
  )
}

export default Toolbar
