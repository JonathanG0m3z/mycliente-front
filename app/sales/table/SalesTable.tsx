'use client'
import { useLazyFetch } from '@/utils/useFetch'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import { SaleTableColumns } from './SaleTableColumns'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faRepeat, faSync, faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons'
import SalesContextMenu from './SalesContextMenu'
import { Sale, SaleFilters } from '@/interface/Sale'
import { ContextMenuRef } from '@/components/ContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'
import SalesToolbar from './SalesToolbar'
import SaleModel from '@/model/Sale'

const DEFAULT_FILTERS: SaleFilters = {
  page: 1,
  pageSize: 10,
  search: ''
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
  const [localFilters, setLocalFilters] = useState<SaleFilters>(DEFAULT_FILTERS)
  const applyFilters = (filters: SaleFilters) => {
    setLocalFilters(filters)
    getData(
      `sales${SaleModel.transformFiltersToUrl(filters)}`,
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
  const contextMenuOptions: CustomMenuItem[] = useMemo(() => [
    {
      key: 'edit',
      label: 'Editar venta',
      icon: <FontAwesomeIcon icon={faEdit} />,
      onClick: onEdit
    },
    {
      key: 'delete',
      label: 'Eliminar venta',
      icon: <FontAwesomeIcon icon={faTrash} />,
      onClick: onDelete
    },
    {
      key: 'renew',
      label: 'Renovar',
      icon: <FontAwesomeIcon icon={faRepeat} />,
      onClick: onRenew
    },
    {
      key: 'editClient',
      label: 'Editar cliente',
      icon: <FontAwesomeIcon icon={faUserPen} />,
      onClick: onEditClient
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [])

  useImperativeHandle(ref, () => ({
    refresh () {
      applyFilters(localFilters)
    }
  }))

  useEffect(() => {
    applyFilters(localFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <SalesToolbar filters={localFilters} onChangeFilters={applyFilters} />
      <Table
        loading={loading}
        dataSource={data?.sales}
        columns={SaleTableColumns({ contextMenuOptions })}
        scroll={{ x: 'max-content' }}
        pagination={false}
        onRow={record => onRow(record)}
        rowKey={record => record.id}
      />
      <Row justify='center'>
        <Pagination
          current={localFilters?.page}
          pageSize={localFilters?.pageSize}
          total={data?.total}
          onChange={(page, pageSize) => {
            applyFilters({ ...localFilters, page, pageSize })
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
            onClick={() => applyFilters(localFilters)}
          />
        </Tooltip>
      </Row>
      <SalesContextMenu
        contextMenuRef={contextMenuRef}
        record={selectedRecord}
        items={contextMenuOptions}
      />
    </>
  )
})
