import { useLazyFetch } from '@/utils/useFetch'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import { SaleTableColumns } from './SaleTableColumns'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSync } from '@fortawesome/free-solid-svg-icons'
import { MenuProps } from 'antd/lib'
import ContextMenu from './ContextMenu'

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
  const applyFilters = (filters = localFilters) => {
    setLocalFilters(filters)
    getData(
      `sales?page=${filters.page}&limit=${filters.pageSize}`,
      'GET'
    ).catch(err =>
      notification.error({ message: 'Algo saió mal', description: err.message })
    )
  }
  /** CONTEXT MENU */
  const [menuContext, setMenuContext] = useState({
    popup: {
      record: [],
      visible: false,
      x: 0,
      y: 0
    }
  })
  const onRow = (record: any) => ({
    onContextMenu: (event: any) => {
      event.preventDefault()
      if (!menuContext.popup.visible) {
        document.addEventListener('click', function onClickOutside () {
          setMenuContext({
            popup: { record: [], visible: false, x: 0, y: 0 }
          })
          document.removeEventListener('click', onClickOutside)
        })
      }
      setMenuContext({
        popup: {
          record,
          visible: true,
          x: event.clientX,
          y: event.clientY
        }
      })
    }
  })
  const contextMenuOptions: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Editar venta',
      icon: <FontAwesomeIcon icon={faEdit} />
      // onClick: closeSession
    }
  ]

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
        columns={SaleTableColumns({ contextMenuOptions })}
        scroll={{ x: 'max-content' }}
        pagination={false}
        onRow={(record) => onRow(record)}
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
      <ContextMenu
        visible={menuContext.popup.visible}
        x={menuContext.popup.x}
        y={menuContext.popup.y}
        contextMenuOptions={contextMenuOptions}
      />
    </>
  )
})
