'use client'
import { useRef, useState } from 'react'
import SharedBoardsToolbar from './SharedBoardToolbar'
import { Modal, notification } from 'antd'
import SharedBoardsForm from './form/SharedBoardsForm'
import SharedBoardsTable, {
  SharedBoardsTableRef
} from './table/SharedBoardTable'
import { SharedBoard } from '@/interface/SharedBoard'
import { useRouter } from 'next/navigation'

const SharedBoards = () => {
  const router = useRouter()
  const sharedBoardsTableRef = useRef<SharedBoardsTableRef>(null)
  /** CREATE CODE */
  const [isOpenForm, setIsOpenForm] = useState(false)
  const openForm = () => {
    setIsOpenForm(true)
  }
  const closeForm = () => {
    setIsOpenForm(false)
  }
  const onSaveSharedBoard = () => {
    notification.success({
      message: 'Información guardada'
    })
  }
  const openBoardView = (record: SharedBoard) => {
    router.push(`/sharedBoards/${record.id}`)
  }
  return (
    <>
      <SharedBoardsToolbar onCreate={openForm} />
      <SharedBoardsTable ref={sharedBoardsTableRef} openBoardView={openBoardView} />
      <Modal
        open={isOpenForm}
        title='Registrar tablero compartido'
        onCancel={closeForm}
        footer={null}
        destroyOnClose
      >
        <SharedBoardsForm
          onCancel={closeForm}
          onSave={onSaveSharedBoard}
          record={null}
        />
      </Modal>
    </>
  )
}

export default SharedBoards
