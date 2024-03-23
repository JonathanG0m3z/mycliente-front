'use client'

import { useCallback, useRef, useState } from 'react'
import AccountsTable, { AccountsTableRef } from './table/AccountsTable'
import { Account } from '@/interface/Account'
import { useLazyFetch } from '@/utils/useFetch'
import { Modal, notification } from 'antd'
import AccountsToolbar from './AccountsToolbar'
import AccountsForm from './create/AccountsForm'
import RenewAccountForm from './renew/RenewAccountForm'

const Accounts = () => {
  const AccountsTableRef = useRef<AccountsTableRef>(null)
  const refreshTable = () => {
    AccountsTableRef.current?.refresh()
  }
  const [isOpenForm, setIsOpenForm] = useState(false)
  const openForm = useCallback(() => {
    setIsOpenForm(true)
  }, [])
  const closeForm = useCallback(() => {
    setIsOpenForm(false)
    setSelectedAccount(null)
  }, [])
  const onSaveAccount = useCallback(() => {
    notification.success({
      message: 'Información guardada'
    })
    refreshTable()
  }, [])
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  /** EDIT */
  const onEdit = useCallback((record: Account) => {
    setSelectedAccount(record)
    openForm()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /** DELETE */
  const { fetchApiData: fetchDelete } = useLazyFetch()
  const onDelete = (record: Account) => {
    Modal.confirm({
      title: 'Eliminar cuenta',
      content: '¿Estás seguro de eliminar esta cuenta?',
      onOk: () => {
        return new Promise((resolve, reject) => {
          fetchDelete(`accounts/${record.id}`, 'DELETE')
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
  /** RENEW */
  const [renewIsOpen, setRenewIsOpen] = useState(false)
  const openRenew = useCallback((record: Account) => {
    setSelectedAccount(record)
    setRenewIsOpen(true)
  }, [])
  const closeRenew = useCallback(() => {
    setRenewIsOpen(false)
    setSelectedAccount(null)
  }, [])
  const onSaveRenew = useCallback(() => {
    notification.success({
      message: 'Renovación exitosa'
    })
    refreshTable()
  }, [])
  return (
    <>
      <AccountsToolbar onCreate={openForm} />
      <AccountsTable
        ref={AccountsTableRef}
        onEdit={onEdit}
        onDelete={onDelete}
        onRenew={openRenew}
      />
      <Modal
        open={isOpenForm}
        title={selectedAccount ? 'Editar cuenta' : 'Registrar cuenta'}
        onCancel={closeForm}
        footer={null}
        destroyOnClose
      >
        <AccountsForm
          onCancel={closeForm}
          onSave={onSaveAccount}
          record={selectedAccount}
        />
      </Modal>
      <Modal
        open={renewIsOpen}
        title='Renovar cuenta'
        onCancel={closeRenew}
        footer={null}
        destroyOnClose
      >
        <RenewAccountForm
          onCancel={closeRenew}
          onSave={onSaveRenew}
          record={selectedAccount}
        />
      </Modal>
    </>
  )
}

export default Accounts
