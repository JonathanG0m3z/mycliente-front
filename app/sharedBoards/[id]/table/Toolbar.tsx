import {
  SharedBoardAccountFilters,
  SharedBoardAccountsData
} from '@/interface/SharedBoard'
import { faArrowLeft, faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, FloatButton, Form, Input, Row } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  filters: SharedBoardAccountFilters
  onChangeFilters: (filters: SharedBoardAccountFilters) => void
  onCreate: () => void
  tableData: SharedBoardAccountsData | null
}

const Toolbar = ({ onCreate, onChangeFilters, filters, tableData }: Props) => {
  const [timer, setTimer] = useState<any | null>(null)
  const router = useRouter()

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

  const goBack = useCallback(() => {
    router.push('/sharedBoards')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Form>
        <Row
          gutter={[8, 8]}
          justify='space-between'
          align='middle'
          style={{ padding: '4px 0 4px 0' }}
        >
          <Col flex='none'>
            <Button shape='circle' onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </Col>
          <Col flex='auto'>
            <Form.Item name='search' noStyle>
              <Input.Search
                onChange={e => handleSearchChange(e.target.value)}
                allowClear
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
