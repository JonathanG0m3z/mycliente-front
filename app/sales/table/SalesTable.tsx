import { useLazyFetch } from '@/utils/useFetch'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import { SaleTableColumns } from './SaleTableColumns'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}
export interface SalesTableRef {
  refresh: () => void
}

export const SalesTable = forwardRef<SalesTableRef>(function SalesTable (
  props,
  ref
) {
  const { data, loading, fetchApiData: getData } = useLazyFetch()
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  console.log('data:', data)
  const applyFilters = (filters = localFilters) => {
    setLocalFilters(filters)
    getData(
      `sales?page=${filters.page}&limit=${filters.pageSize}`,
      'GET'
    ).catch(err =>
      notification.error({ message: 'Algo saió mal', description: err.message })
    )
  }

  useImperativeHandle(ref, () => ({
    refresh () {
      applyFilters()
    }
  }))

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Table
        loading={loading}
        dataSource={data?.sales}
        columns={SaleTableColumns()}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
      <Row justify='center'>
        <Pagination
          current={localFilters?.page}
          pageSize={localFilters?.pageSize}
          total={data?.total}
          onChange={(page, pageSize) => {
            applyFilters({ page, pageSize })
          }}
          showSizeChanger
          showTotal={total => `${data?.sales?.length} de ${total} resultados`}
          disabled={loading}
          style={{ marginRight: 7 }}
          pageSizeOptions={[5, 10, 50, 100]}
        />
        <Tooltip title='Recargar'>
          <Button
            loading={loading}
            shape='circle'
            icon={<FontAwesomeIcon icon={faSync} />}
            onClick={() => applyFilters()}
          />
        </Tooltip>
      </Row>
    </>
  )
})
