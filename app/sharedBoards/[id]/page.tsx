'use client'

import { useCallback, useRef, useState } from 'react'
import { Modal, notification } from 'antd'
import AccountsForm from './form/AccountForm'
import AccountsTable from './table/Table'
import { Account } from '@/interface/Account'
import { SharedBoardsTableRef } from '../table/SharedBoardTable'
import { useLazyFetch } from '@/utils/useFetch'

function SharedBoardView ({ params }: { params: { id: string } }) {
  const accountRef = useRef<SharedBoardsTableRef>(null)
  const refreshTable = useCallback(() => {
    accountRef.current?.refresh()
  }, [])
  const [selectedRecord, setSelectedRecord] = useState<Account | null>(null)
  /** CREATE ACCOUNT CODE */
  const [isOpenForm, setIsOpenForm] = useState(false)
  const createAccount = useCallback(() => {
    setIsOpenForm(true)
  }, [])
  const closeForm = useCallback(() => {
    setIsOpenForm(false)
    setSelectedRecord(null)
    setIsChangePassword(false)
    setIsRenew(false)
  }, [])
  const onSaveAccount = useCallback(() => {
    notification.success({
      message: 'Información guardada'
    })
    refreshTable()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /** CHANGE PASSWORD CODE */
  const [isChangePassword, setIsChangePassword] = useState(false)
  const onChangePassword = useCallback((account: Account) => {
    setIsOpenForm(true)
    setIsChangePassword(true)
    setSelectedRecord(account)
  }, [])
  /** EDIT CODE */
  const onEdit = useCallback((account: Account) => {
    setIsOpenForm(true)
    setSelectedRecord(account)
  }, [])
  /** DELETE CODE */
  const { fetchApiData: fetchDelete } = useLazyFetch()
  const onDelete = (record: Account) => {
    Modal.confirm({
      title: 'Eliminar cuenta',
      content: '¿Estás seguro de eliminar esta cuenta?',
      onOk: () => {
        return new Promise((resolve, reject) => {
          fetchDelete(`sharedBoards/accounts/${record.id}`, 'DELETE')
            .then(() => {
              notification.success({
                message: 'Cuenta eliminada'
              })
              refreshTable()
              resolve(null)
            })
            .catch(err => {
              notification.error({
                message: 'Error',
                description: err
              })
              reject(err)
            })
        })
      }
    })
  }
  /** RENEW CODE */
  const [isRenew, setIsRenew] = useState(false)
  const onRenew = useCallback((account: Account) => {
    setIsOpenForm(true)
    setSelectedRecord(account)
    setIsRenew(true)
  }, [])
  return (
    <>
      <AccountsTable
        ref={accountRef}
        sharedBoardId={params.id}
        onChangePassword={onChangePassword}
        onEdit={onEdit}
        onDelete={onDelete}
        createAccount={createAccount}
        onRenew={onRenew}
      />
      <Modal
        open={isOpenForm}
        title={`${selectedRecord ? 'Editar' : 'Crear'} cuenta`}
        onCancel={closeForm}
        footer={null}
        destroyOnClose
      >
        <AccountsForm
          onCancel={closeForm}
          onSave={onSaveAccount}
          record={selectedRecord}
          sharedBoardId={params.id}
          isChangePassword={isChangePassword}
          isRenew={isRenew}
        />
      </Modal>
    </>
  )
}

export default SharedBoardView
