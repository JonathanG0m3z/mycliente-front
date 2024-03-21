import { ContextMenuRef } from '@/components/ContextMenu'
import { Account, AccountData } from '@/interface/Account'
import { useLazyFetch } from '@/utils/useFetch'
import { faEdit, faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table, notification } from 'antd'
import { MenuProps } from 'antd/lib'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { AccountsTableColumns } from './AccountsTableColumns'

interface Props {}
interface AccountsTableRef {}

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}

const AccountsTable = forwardRef<AccountsTableRef, Props>(function SalesTable (
  props,
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
  const contextMenuOptions: MenuProps['items'] = useMemo(
    () => [
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
      }
    ],
    []
  )

  // const functionsDictionary = useMemo(
  //   () => ({
  //     edit: onEdit,
  //     delete: onDelete,
  //     renew: onRenew
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }),
  //   []
  // )

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
        //   columns={SaleTableColumns({
        //     contextMenuOptions,
        //     functionsDictionary
        //   })}
        columns={AccountsTableColumns({})}
        scroll={{ x: 'max-content' }}
        pagination={false}
        onRow={record => onRow(record)}
      />
    </>
  )
})

export default AccountsTable
