import { useLazyFetch } from '@/utils/useFetch'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import { SaleTableColumns } from './SaleTableColumns'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faRepeat, faSync, faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { MenuProps } from 'antd/lib'
import SalesContextMenu from './SalesContextMenu'
import { Sale } from '@/interface/Sale'
import { ContextMenuRef } from '@/components/ContextMenu'

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}
export interface SalesTableRef {
  refresh: () => void
}

interface Props {
  onEdit: (record: Sale) => void
  onDelete: (record: Sale) => void
  onRenew: (record: Sale) => void
  onEditClient: (record: Sale) => void
}

export const SalesTable = forwardRef<SalesTableRef, Props>(function SalesTable (
  { onEdit, onDelete, onRenew, onEditClient },
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
  const contextMenuRef = useRef<ContextMenuRef>(null)
  const [selectedRecord, setSelectedRecord] = useState<Sale | null>(null)
  const onRow = (record: any) => ({
    onContextMenu: (e: any) => {
      setSelectedRecord(record)
      contextMenuRef.current?.onContextMenu(e)
    }

  })
  const contextMenuOptions: MenuProps['items'] = useMemo(() => [
    {
      key: 'edit',
      label: 'Editar venta',
      icon: <FontAwesomeIcon icon={faEdit} />
    },
    {
      key: 'delete',
      label: 'Eliminar venta',
      icon: <FontAwesomeIcon icon={faTrash} />
    },
    {
      key: 'renew',
      label: 'Renovar',
      icon: <FontAwesomeIcon icon={faRepeat} />
    },
    {
      key: 'editClient',
      label: 'Editar cliente',
      icon: <FontAwesomeIcon icon={faUserPen} />
    }
  ], [])

  const functionsDictionary = useMemo(() => ({
    edit: onEdit,
    delete: onDelete,
    renew: onRenew,
    editClient: onEditClient
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

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
        columns={SaleTableColumns({ contextMenuOptions, functionsDictionary })}
        scroll={{ x: 'max-content' }}
        pagination={false}
        onRow={record => onRow(record)}
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
      <SalesContextMenu
        contextMenuRef={contextMenuRef}
        record={selectedRecord}
        items={contextMenuOptions}
        functionsDictionary={functionsDictionary}
      />
    </>
  )
})
