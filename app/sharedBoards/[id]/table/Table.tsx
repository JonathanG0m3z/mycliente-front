'use client'
import { ContextMenuRef } from '@/components/ContextMenu'
import {
  SharedBoard,
  SharedBoardAccountFilters,
  SharedBoardAccountsData
} from '@/interface/SharedBoard'
import { useLazyFetch } from '@/utils/useFetch'
import {
  faCalendarCheck,
  faClipboard,
  faEdit,
  faKey,
  faRepeat,
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
import Toolbar from './Toolbar'
import SharedBoardModel from '@/model/SharedBoard'
import { SorterResult } from 'antd/es/table/interface'
import GlobalModel from '@/model/GlobalModel'

interface Props {
  sharedBoardId: string
  onChangePassword: (record: Account) => void
  onEdit: (record: Account) => void
  onDelete: (record: Account) => void
  createAccount: () => void
  onRenew: (record: Account) => void
  onReactivate: (record: Account) => void
  onViewInfo: (record: Account) => void
}
export interface SharedBoardsTableRef {
  refresh: () => void
}

const DEFAULT_FILTERS: SharedBoardAccountFilters = {
  page: 1,
  pageSize: 10,
  search: '',
  is_deleted: false,
  order: 'expiration ASC'
}

const AccountsTable = forwardRef<SharedBoardsTableRef, Props>(
  function AccountsTable (
    { sharedBoardId, onChangePassword, onEdit, onDelete, createAccount, onRenew, onReactivate, onViewInfo },
    ref
  ) {
    const {
      data,
      loading,
      fetchApiData: getData
    } = useLazyFetch<SharedBoardAccountsData>()
    const [localFilters, setLocalFilters] =
      useState<SharedBoardAccountFilters>(DEFAULT_FILTERS)
    const applyFilters = (filters = localFilters) => {
      setLocalFilters(filters)
      getData(
        `sharedBoards/accounts/${sharedBoardId}${SharedBoardModel.transformFilterToUrl(filters)}`,
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
          disabled: !(
            data?.permissions === 'admin' ||
            data?.permissions?.includes('CAMBIAR CONTRASEÑA')
          ),
          onClick: onChangePassword
        },
        {
          key: 'viewInfo',
          label: 'Ver información',
          icon: <FontAwesomeIcon icon={faClipboard} />,
          disabled: false,
          onClick: onViewInfo
        },
        {
          key: 'renew',
          label: 'Renovar cuenta',
          icon: <FontAwesomeIcon icon={faRepeat} />,
          disabled: !(
            data?.permissions === 'admin' ||
            data?.permissions?.includes('RENOVAR')
          ),
          onClick: onRenew
        },
        {
          key: 'edit',
          label: 'Editar cuenta',
          icon: <FontAwesomeIcon icon={faEdit} />,
          disabled: !(
            data?.permissions === 'admin' ||
            data?.permissions?.includes('EDITAR')
          ),
          onClick: onEdit
        },
        {
          key: 'delete',
          label: 'Eliminar cuenta',
          icon: <FontAwesomeIcon icon={faTrash} />,
          disabled: !(
            data?.permissions === 'admin' ||
            data?.permissions?.includes('ELIMINAR')
          ),
          onClick: onDelete
        },
        {
          key: 'activate',
          label: 'Reactivar cuenta',
          icon: <FontAwesomeIcon icon={faCalendarCheck} />,
          disabled: !(
            data?.permissions === 'admin' ||
            data?.permissions?.includes('ELIMINAR')
          ),
          onClick: onReactivate,
          showOption: (record) => !!record?.deleted_at
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

    const onChangeOrder = (pagination: any, filters: any, sorter: SorterResult<Account>) => {
      applyFilters({ ...localFilters, order: GlobalModel.generateOrder(sorter) })
    }

    useEffect(() => {
      applyFilters()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
      <>
        <Toolbar tableData={data} onCreate={createAccount} onChangeFilters={applyFilters} filters={localFilters} />
        <Table
          loading={loading}
          dataSource={data?.accounts}
          columns={TableColumns({ contextMenuOptions, filters: localFilters })}
          scroll={{ x: 'max-content' }}
          pagination={false}
          onRow={record => onRow(record)}
          onChange={onChangeOrder as any}
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
