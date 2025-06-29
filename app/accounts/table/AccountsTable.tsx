'use client'
import { ContextMenuRef } from '@/components/ContextMenu'
import { Account, AccountData, AccountFilters } from '@/interface/Account'
import { useLazyFetch } from '@/utils/useFetch'
import { faEdit, faRepeat, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import AccountModel from '@/model/Account'
import dayjs from 'dayjs'
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
  setFilters: (filters: AccountFilters) => void
}

const DEFAULT_FILTERS: AccountFilters = {
  page: 1,
  pageSize: 10,
  search: '',
  is_deleted: false,
  expiration_range: [dayjs().subtract(5, 'day'), dayjs().add(3, 'month')],
  order: 'expiration ASC'
}

const AccountsTable = forwardRef<AccountsTableRef, Props>(function SalesTable (
  { onEdit, onDelete, onRenew },
  ref
) {
  const { data, loading, fetchApiData: getData } = useLazyFetch<AccountData>()
  const [localFilters, setLocalFilters] = useState<AccountFilters>(DEFAULT_FILTERS)
  const applyFilters = (filters: AccountFilters = localFilters) => {
    setLocalFilters(filters)
    getData(
      `accounts${AccountModel.transformFiltersToUrl(filters)}`,
      'GET'
    ).catch(err =>
      notification.error({
        message: 'Algo salió mal',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useImperativeHandle(ref, () => ({
    refresh () {
      applyFilters()
    },
    setFilters (filters: AccountFilters) {
      applyFilters(filters)
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
