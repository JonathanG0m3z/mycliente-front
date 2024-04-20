'use client'
import { faArrowLeft, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Form, Input, Row } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import SharedBoardModel from '@/model/SharedBoard'
import { SaleFilters } from '@/interface/Sale'

interface Props {
  filters: SaleFilters
  onChangeFilters: (filters: SaleFilters) => void
}

const SalesToolbar = ({
  onChangeFilters,
  filters
}: Props) => {
  const [timer, setTimer] = useState<any | null>(null)
  const router = useRouter()

  const onChangeToolbarFilters = (filters: SaleFilters) => {
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

  const goBack = useCallback(() => {
    router.push('/sharedBoards')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** FILTER DRAWER CODE */
  //   const [showFilters, setShowFilters] = useState(false)
  //   const openFilters = useCallback(() => {
  //     setShowFilters(true)
  //   }, [])
  //   const closeFilters = useCallback(() => {
  //     setShowFilters(false)
  //   }, [])

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
          <Col flex='none'>
            <Badge
              size='small'
              style={{ color: 'white' }}
              count={SharedBoardModel.countActiveFilters(filters)}
              color='#5A54F9'
            >
              <Button disabled shape='circle' onClick={() => {}}>
                <FontAwesomeIcon icon={faSliders} />
              </Button>
            </Badge>
          </Col>
        </Row>
      </Form>
      {/* <Drawer
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
      </Drawer> */}
    </>
  )
}

export default SalesToolbar
