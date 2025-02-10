'use client'
import BotExecutionsTable from './table/BotExecutionsTable'
import { useCallback, useState } from 'react'
import { Modal, notification } from 'antd'
import ViewInfo from '@/components/ViewInfo'
import { BotExecution } from '@/interface/BotExecution'

const BotExecutions = () => {
  const [selectedRecord, setSelectedRecord] = useState<BotExecution | null>(
    null
  )
  /** VIEW INFO CODE */
  const [viewInfoOpen, setViewInfoOpen] = useState(false)
  const onViewInfo = useCallback((record: BotExecution) => {
    setViewInfoOpen(true)
    setSelectedRecord(record)
  }, [])

  const closeViewInfo = useCallback(() => {
    setViewInfoOpen(false)
    setSelectedRecord(null)
  }, [])
  const copyResponseToClipboard = useCallback((record: BotExecution) => {
    const jsonString = JSON.stringify(record.response ?? {}, null, 2)
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        notification.success({
          message: 'Copiado al portapapeles'
        })
      })
      .catch(() => {
        notification.error({
          message: 'Algo salió mal',
          description: 'No se pudo copiar al portapapeles'
        })
      })
  }, [])
  return (
    <>
      {/* <SharedBoardsToolbar onCreate={openForm} /> */}
      <BotExecutionsTable
        onViewInfo={onViewInfo}
        copyResponseToClipboard={copyResponseToClipboard}
      />
      <Modal
        open={viewInfoOpen}
        title='Información de cuenta'
        onCancel={closeViewInfo}
        footer={null}
        destroyOnClose
      >
        <ViewInfo
          accountId={selectedRecord?.accountId}
          onCancel={closeViewInfo}
        />
      </Modal>
    </>
  )
}

export default BotExecutions
