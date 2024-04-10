'use client'
import { ContextMenuRef } from '@/components/ContextMenu'
import { Account, AccountData } from '@/interface/Account'
import { useLazyFetch } from '@/utils/useFetch'
import { faEdit, faRepeat, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { AccountsTableColumns } from './AccountsTableColumns'
import AccountssContextMenu from './AccountsContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'

interface Props {
  onEdit: (record: Account) => void
  onDelete: (record: Account) => void
  onRenew: (record: Account) => void
}
export interface AccountsTableRef {
  refresh: () => void
}

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}

const AccountsTable = forwardRef<AccountsTableRef, Props>(function SalesTable (
  { onEdit, onDelete, onRenew },
  ref
) {
  const { data, loading, fetchApiData: getData } = useLazyFetch<AccountData>()
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  const applyFilters = (filters = localFilters) => {
    setLocalFilters(filters)
    getData(
      `accounts?page=${filters.page}&limit=${filters.pageSize}`,
      'GET'
    ).catch(err =>
      notification.error({
        message: 'Algo saió mal',
        description: err.message
      })
    )
  }
  /** CONTEXT MENU */
  const contextMenuRef = useRef<ContextMenuRef>(null)
  const [selectedRecord, setSelectedRecord] = useState<Account | null>(null)
  const onRow = (record: any) => ({
    onContextMenu: (e: any) => {
      setSelectedRecord(record)
      contextMenuRef.current?.onContextMenu(e)
    }
  })
  const contextMenuOptions: CustomMenuItem[] = useMemo(
    () => [
      {
        key: 'edit',
        label: 'Editar cuenta',
        icon: <FontAwesomeIcon icon={faEdit} />,
        onClick: onEdit
      },
      {
        key: 'delete',
        label: 'Eliminar cuenta',
        icon: <FontAwesomeIcon icon={faTrash} />,
        onClick: onDelete
      },
      {
        key: 'renew',
        label: 'Renovar',
        icon: <FontAwesomeIcon icon={faRepeat} />,
        onClick: onRenew
      }
    ],
    []
  )

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
        dataSource={data?.accounts}
        columns={AccountsTableColumns({
          contextMenuOptions
        })}
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
          showTotal={total => `${data?.accounts?.length} de ${total} resultados`}
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
      <AccountssContextMenu
        contextMenuRef={contextMenuRef}
        record={selectedRecord}
        items={contextMenuOptions}
      />
    </>
  )
})

export default AccountsTable
