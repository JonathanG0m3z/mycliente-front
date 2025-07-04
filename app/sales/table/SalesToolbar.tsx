'use client'
import { faArrowLeft, faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Form, Input, Row } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
// import SharedBoardModel from '@/model/SharedBoard' // Ya no se usa
import SaleModel from '@/model/Sale' // Importar SaleModel
import { SaleFilters } from '@/interface/Sale'

interface Props {
  filters: SaleFilters
  onChangeFilters: (filters: SaleFilters) => void
  openFilters: () => void // Nueva prop
}

const SalesToolbar = ({
  onChangeFilters,
  filters,
  openFilters // Recibir la nueva prop
}: Props) => {
  const [timer, setTimer] = useState<any | null>(null)
  const router = useRouter()

  const onChangeToolbarFilters = (newFilters: SaleFilters) => { // Renombrado para claridad
    onChangeFilters({ ...filters, ...newFilters, page: 1 })
  }

  const handleSearchChange = (value: string) => {
    // Actualizar solo el search en filters, y dejar que onChangeToolbarFilters maneje el resto
    const currentFilters = filters
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        onChangeToolbarFilters({ ...currentFilters, search: value })
      }, 300)
    )
  }

  const goBack = useCallback(() => {
    router.push('/sharedBoards')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Form> {/* Considerar si este Form es necesario aquí si solo contiene el input y botones */}
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
            {/* El Form.Item no es estrictamente necesario si el Input.Search maneja su propio estado o se pasa via filters */}
            <Input.Search
              value={filters.search} // Controlar el valor desde los filtros
              onChange={e => handleSearchChange(e.target.value)}
              allowClear
            />
          </Col>
          <Col flex='none'>
            <Badge
              size='small'
              style={{ color: 'white' }}
              count={SaleModel.countActiveFilters(filters)} // Usar SaleModel
              color='#5A54F9'
            >
              <Button shape='circle' onClick={openFilters} /* Habilitar y usar openFilters */>
                <FontAwesomeIcon icon={faSliders} />
              </Button>
            </Badge>
          </Col>
        </Row>
      </Form>
      {/* El Drawer y FiltersForm se manejarán en app/sales/page.tsx */}
    </>
  )
}

export default SalesToolbar
