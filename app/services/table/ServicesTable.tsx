'use client'

import { ContextMenuRef } from '@/components/ContextMenu'
import { Service, ServiceData } from '@/interface/Service'
import { useLazyFetch } from '@/utils/useFetch'
import { faEdit, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
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
import ServicesContextMenu from './ServicesContextMenu'
import { ServicesTableColumns } from './ServicesTableColumns'
// import ServicesToolbar from './ServicesToolbar'
import { CustomMenuItem } from '@/interface/ContextMenu'

interface Props {
  onEdit: (record: Service) => void
  onDelete: (record: Service) => void
}
export interface ServicesTableRef {
  refresh: () => void
}

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}
const ServicesTable = forwardRef<ServicesTableRef, Props>(
  function ServicesTable ({ onEdit, onDelete }, ref) {
    const { data, loading, fetchApiData: getData } = useLazyFetch<ServiceData>()
    const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
    const applyFilters = (filters = localFilters) => {
      setLocalFilters(filters)
      getData(
        `services?page=${filters.page}&limit=${filters.pageSize}`,
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
    const [selectedRecord, setSelectedRecord] = useState<Service | null>(null)
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
          label: 'Editar servicio',
          icon: <FontAwesomeIcon icon={faEdit} />,
          onClick: onEdit
        },
        {
          key: 'delete',
          label: 'Eliminar servicio',
          icon: <FontAwesomeIcon icon={faTrash} />,
          onClick: onDelete
        }
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
        {/* <ServicesToolbar onCreate={onCreate} /> */}
        <Table
          loading={loading}
          dataSource={data?.services}
          columns={ServicesTableColumns({ contextMenuOptions })}
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
              `${data?.services?.length} de ${total} resultados`}
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
        <ServicesContextMenu
          contextMenuRef={contextMenuRef}
          record={selectedRecord}
          items={contextMenuOptions}
        />
      </>
    )
  }
)

export default ServicesTable
