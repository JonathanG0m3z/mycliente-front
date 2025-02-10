'use client'
import { ContextMenuRef } from '@/components/ContextMenu'
import { SharedBoard, SharedBoardData } from '@/interface/SharedBoard'
import { useLazyFetch } from '@/utils/useFetch'
import {
  faArrowUpRightFromSquare,
  faSync
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
import { SharedBoardsTableColumns } from './SharedBoardsTableColumns'
import SharedBoardsContextMenu from './SharedBoardsContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'

interface Props {
  openBoardView: (record: SharedBoard) => void
  //   onEdit: (record: SharedBoard) => void
  //   onDelete: (record: SharedBoard) => void
}
export interface SharedBoardsTableRef {
  refresh: () => void
}

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}

const SharedBoardsTable = forwardRef<SharedBoardsTableRef, Props>(
  function SharedBoardsTable ({ openBoardView /* onEdit, onDelete */ }, ref) {
    const {
      data,
      loading,
      fetchApiData: getData
    } = useLazyFetch<SharedBoardData>()
    const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
    const applyFilters = (filters = localFilters) => {
      setLocalFilters(filters)
      getData(
        `sharedBoards?page=${filters.page}&limit=${filters.pageSize}`,
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
          key: 'openView',
          label: 'Abrir tablero',
          icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} />,
          onClick: openBoardView
        }
        //   {
        //     key: 'edit',
        //     label: 'Editar cuenta',
        //     icon: <FontAwesomeIcon icon={faEdit} />
        //   },
        //   {
        //     key: 'delete',
        //     label: 'Eliminar cuenta',
        //     icon: <FontAwesomeIcon icon={faTrash} />
        //   },
        //   {
        //     key: 'renew',
        //     label: 'Renovar',
        //     icon: <FontAwesomeIcon icon={faRepeat} />
        //   }
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          dataSource={data?.boards}
          columns={SharedBoardsTableColumns({
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
            showTotal={total =>
              `${data?.boards?.length} de ${total} resultados`}
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
        <SharedBoardsContextMenu
          contextMenuRef={contextMenuRef}
          record={selectedRecord}
          items={contextMenuOptions}
        />
      </>
    )
  }
)

export default SharedBoardsTable
