'use client'
import { useLazyFetch } from '@/utils/useFetch'
import { faClipboard, faCopy, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Pagination, Row, Table, Tooltip, notification } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BotExecutionsTableColumns } from './BotExecutionTableColumns'
import { ContextMenuRef } from '@/components/ContextMenu'
import { CustomMenuItem } from '@/interface/ContextMenu'
import { BotExecution, BotExecutionData } from '@/interface/BotExecution'
import BotExecutionsContextMenu from './BotExecutionsContextMenu'

interface Props {
  onViewInfo: (record: BotExecution) => void
  copyResponseToClipboard: (record: BotExecution) => void
  //   onDelete: (record: SharedBoard) => void
}

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10
}

const BotExecutionsTable: React.FC<Props> = ({
  onViewInfo, copyResponseToClipboard
}) => {
  const {
    data,
    loading,
    fetchApiData: getData
  } = useLazyFetch<BotExecutionData>()
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  const applyFilters = (filters = localFilters) => {
    setLocalFilters(filters)
    getData(
      `bots/executions?page=${filters.page}&limit=${filters.pageSize}`,
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
  const [selectedRecord, setSelectedRecord] = useState<BotExecution | null>(null)
  const onRow = (record: any) => ({
    onContextMenu: (e: any) => {
      setSelectedRecord(record)
      contextMenuRef.current?.onContextMenu(e)
    }
  })
  const contextMenuOptions: CustomMenuItem[] = useMemo(
    () => [
      {
        key: 'viewInfo',
        label: 'Ver información',
        icon: <FontAwesomeIcon icon={faClipboard} />,
        disabled: false,
        onClick: onViewInfo
      },
      {
        key: 'copyResponse',
        label: 'Copiar respuesta bot',
        icon: <FontAwesomeIcon icon={faCopy} />,
        disabled: false,
        onClick: copyResponseToClipboard
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Table
        loading={loading}
        dataSource={data?.botExecutions}
        columns={BotExecutionsTableColumns({
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
          showTotal={total => `${data?.botExecutions?.length} de ${total} resultados`}
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
      <BotExecutionsContextMenu
        contextMenuRef={contextMenuRef}
        record={selectedRecord}
        items={contextMenuOptions}
      />
    </>
  )
}

export default BotExecutionsTable
