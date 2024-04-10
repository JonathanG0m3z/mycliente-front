'use client'
import { ContextMenuRef } from '@/components/ContextMenu'
import { SharedBoard, SharedBoardAccountsData } from '@/interface/SharedBoard'
import { useLazyFetch } from '@/utils/useFetch'
import {
  faEdit,
  faKey,
  faSync,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
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
import { TableColumns } from './TableColumns'
import ContextMenu from './ContextMenu'
import { Account } from '@/interface/Account'
import { CustomMenuItem } from '@/interface/ContextMenu'

interface Props {
  sharedBoardId: string
  onChangePassword: (record: Account) => void
  onEdit: (record: Account) => void
  onDelete: (record: Account) => void
}
export interface SharedBoardsTableRef {
  refresh: () => void
}

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}

const AccountsTable = forwardRef<SharedBoardsTableRef, Props>(
  function AccountsTable (
    { sharedBoardId, onChangePassword, onEdit, onDelete },
    ref
  ) {
    const { data, loading, fetchApiData: getData } = useLazyFetch<SharedBoardAccountsData>()
    const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
    const applyFilters = (filters = localFilters) => {
      setLocalFilters(filters)
      getData(
        `sharedBoards/accounts/${sharedBoardId}?page=${filters.page}&limit=${filters.pageSize}`,
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
    const [selectedRecord, setSelectedRecord] = useState<SharedBoard | null>(
      null
    )
    const onRow = (record: any) => ({
      onContextMenu: (e: any) => {
        setSelectedRecord(record)
        contextMenuRef.current?.onContextMenu(e)
      }
    })
    const contextMenuOptions: CustomMenuItem[] = useMemo(
      () => [
        {
          key: 'changePassword',
          label: 'Cambiar contraseña',
          icon: <FontAwesomeIcon icon={faKey} />,
          disabled: !(data?.permissions === 'admin' || data?.permissions?.includes('CAMBIAR CONTRASEÑA')),
          onClick: onChangePassword
        },
        {
          key: 'edit',
          label: 'Editar cuenta',
          icon: <FontAwesomeIcon icon={faEdit} />,
          disabled: !(data?.permissions === 'admin' || data?.permissions?.includes('EDITAR')),
          onClick: onEdit
        },
        {
          key: 'delete',
          label: 'Eliminar cuenta',
          icon: <FontAwesomeIcon icon={faTrash} />,
          disabled: !(data?.permissions === 'admin' || data?.permissions?.includes('ELIMINAR')),
          onClick: onDelete
        }
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data]
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
          columns={TableColumns({ contextMenuOptions })}
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
            showTotal={total =>
              `${data?.accounts?.length} de ${total} resultados`}
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
          contextMenuRef={contextMenuRef}
          record={selectedRecord}
          items={contextMenuOptions}
        />
      </>
    )
  }
)

export default AccountsTable
