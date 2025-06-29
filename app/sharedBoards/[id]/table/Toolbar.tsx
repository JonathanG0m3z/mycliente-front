import {
  SharedBoardAccountFilters,
  SharedBoardAccountsData
} from '@/interface/SharedBoard'
import {
  faArrowLeft,
  faEllipsisVertical,
  faPlus,
  faSliders
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Drawer, FloatButton, Form, Input, Row } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import FiltersForm from './FiltersForm'
import SharedBoardModel from '@/model/SharedBoard'

interface Props {
  filters: SharedBoardAccountFilters
  onChangeFilters: (filters: SharedBoardAccountFilters) => void
  onCreate: () => void
  tableData: SharedBoardAccountsData | null
}

const Toolbar = ({ onCreate, onChangeFilters, filters, tableData }: Props) => {
  const [timer, setTimer] = useState<any | null>(null)
  const router = useRouter()

  const onChangeToolbarFilters = (filters: SharedBoardAccountFilters) => {
    onChangeFilters({ ...filters, page: 1 })
  }

  const handleSearchChange = (value: string) => {
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        onChangeToolbarFilters({ ...filters, search: value })
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

  /** FILTER DRAWER CODE */
  const [showFilters, setShowFilters] = useState(false)
  const openFilters = useCallback(() => {
    setShowFilters(true)
  }, [])
  const closeFilters = useCallback(() => {
    setShowFilters(false)
  }, [])

  return (
    <>
      <Form
        initialValues={filters}
      >
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
          <Col flex='none'>
            <Badge size='small' style={{ color: 'white' }} count={SharedBoardModel.countActiveFilters(filters)} color='#5A54F9'>
              <Button shape='circle' onClick={openFilters}>
                <FontAwesomeIcon icon={faSliders} />
              </Button>
            </Badge>
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
      <Drawer
        open={showFilters}
        title='Filtros'
        onClose={closeFilters}
        destroyOnClose
      >
        <FiltersForm
          currentFilters={filters}
          onChangeFilters={onChangeToolbarFilters}
          onClose={closeFilters}
        />
      </Drawer>
    </>
  )
}

export default Toolbar
