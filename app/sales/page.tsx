'use client'

import {
  faEllipsisVertical,
  faHandHoldingDollar,
  faMoneyBillTransfer,
  faPersonCircleQuestion
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FloatButton, Modal, Spin, notification } from 'antd'
import { Suspense, lazy, useCallback, useRef, useState } from 'react'
import { SalesTable, SalesTableRef } from './table/SalesTable'
import { Sale } from '@/interface/Sale'
import { useLazyFetch } from '@/utils/useFetch'
import { Account } from '@/interface/Account'
import UpdateBalanceForm from './updateBalance/UpdateBalanceForm'

const ClientForm = lazy(() => import('./client/ClientForm'))
const SalesForm = lazy(() => import('./form/SalesForm'))
const RenewForm = lazy(() => import('./renew/RenewForm'))
const RenewAccountForm = lazy(
  () => import('../accounts/renew/RenewAccountForm')
)

export default function Sales () {
  const salesTableRef = useRef<SalesTableRef>(null)
  const [isOpenForm, setIsOpenForm] = useState(false)
  const openForm = useCallback(() => {
    setIsOpenForm(true)
  }, [])
  const closeForm = useCallback(() => {
    setIsOpenForm(false)
    setSelectedSale(null)
  }, [])
  const onSaveSale = useCallback(() => {
    salesTableRef.current?.refresh()
  }, [])
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  /** EDIT */
  const onEdit = useCallback((record: Sale) => {
    setSelectedSale(record)
    openForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /** DELETE */
  const { fetchApiData: fetchApi } = useLazyFetch()
  const onDelete = (record: Sale) => {
    Modal.confirm({
      title: 'Eliminar venta',
      content: '¿Estás seguro de eliminar esta venta?',
      onOk: () => {
        return new Promise((resolve, reject) => {
          fetchApi(`sales/${record.id}`, 'DELETE')
            .then(() => {
              notification.success({
                message: 'Venta eliminada'
              })
              salesTableRef.current?.refresh()
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
  const openRenew = useCallback((record: Sale) => {
    setSelectedSale(record)
    setRenewIsOpen(true)
  }, [])
  const closeRenew = useCallback(() => {
    setRenewIsOpen(false)
    setSelectedSale(null)
  }, [])
  const onSaveRenew = useCallback(() => {
    salesTableRef.current?.refresh()
  }, [])
  /** RENEW ACCOUNT */
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [renewAccountFormOpen, setRenewAccountFormOpen] = useState(false)
  const onRenewAccount = useCallback((sale: Sale['account']) => {
    const account = sale
    setSelectedAccount(account)
    setRenewAccountFormOpen(true)
  }, [])
  const onCloseRenewAccountForm = useCallback(() => {
    setRenewAccountFormOpen(false)
    setSelectedAccount(null)
  }, [])
  const onSaveRenewAccount = useCallback(() => {
    salesTableRef.current?.refresh()
    notification.success({
      message: 'Cuenta renovada exitosamente'
    })
  }, [])
  /** EDIT CLIENT */
  const [selectedClient, setSelectedClient] = useState<Sale['client'] | null>(
    null
  )
  const [clientFormOpen, setClientFormOpen] = useState(false)
  const onEditClient = useCallback((sale: Sale) => {
    setSelectedClient(sale.client)
    setClientFormOpen(true)
  }, [])
  const onCloseClientForm = useCallback(() => {
    setClientFormOpen(false)
    setSelectedClient(null)
  }, [])
  const onSaveClient = useCallback(() => {
    salesTableRef.current?.refresh()
    onCloseClientForm()
    notification.success({
      message: 'Cliente editado exitosamente'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /** ACTUALIZAR SALDO */
  const [updateBalanceFormOpen, setUpdatebalanceFormOpen] = useState(false)
  const onUpdateBalance = useCallback(() => {
    setUpdatebalanceFormOpen(true)
  }, [])
  const onCloseUpdateBalance = useCallback(() => {
    setUpdatebalanceFormOpen(false)
  }, [])
  const onFetchClientBalance = useCallback(() => {
    return new Promise((resolve, reject) => {
      fetchApi('users/getAdminBalance/642b717f-3557-4eaa-8402-420b054f0a94', 'GET')
        .then(({ balance }) => {
          notification.success({
            message: `El saldo del cliente es: ${balance}`
          })
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
  }, [fetchApi])
  return (
    <>
      <SalesTable
        ref={salesTableRef}
        onEdit={onEdit}
        onDelete={onDelete}
        onRenew={openRenew}
        onEditClient={onEditClient}
      />
      <FloatButton.Group
        trigger='click'
        style={{ right: 24 }}
        icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
        tooltip='Opciones'
      >
        <FloatButton
          onClick={onFetchClientBalance}
          tooltip='Averiguar saldo cliente'
          icon={<FontAwesomeIcon icon={faPersonCircleQuestion} />}
        />
        <FloatButton
          onClick={onUpdateBalance}
          tooltip='Actualizar saldo'
          icon={<FontAwesomeIcon icon={faMoneyBillTransfer} />}
        />
        <FloatButton
          onClick={openForm}
          tooltip='Registrar venta'
          icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
        />
      </FloatButton.Group>
      <Modal
        open={isOpenForm}
        title={selectedSale ? 'Editar venta' : 'Registrar venta'}
        onCancel={closeForm}
        footer={null}
        destroyOnClose
      >
        <Suspense fallback={<Spin />}>
          <SalesForm
            onCancel={closeForm}
            onSave={onSaveSale}
            record={selectedSale}
          />
        </Suspense>
      </Modal>
      <Modal
        open={renewIsOpen}
        title='Renovar venta'
        onCancel={closeRenew}
        footer={null}
        destroyOnClose
      >
        <Suspense fallback={<Spin />}>
          <RenewForm
            onCancel={closeRenew}
            onSave={onSaveRenew}
            record={selectedSale}
            onRenewAccount={onRenewAccount}
          />
        </Suspense>
      </Modal>
      <Modal
        open={renewAccountFormOpen}
        title='Renovar cuenta'
        onCancel={onCloseRenewAccountForm}
        footer={null}
        destroyOnClose
      >
        <Suspense fallback={<Spin />}>
          <RenewAccountForm
            onCancel={onCloseRenewAccountForm}
            onSave={onSaveRenewAccount}
            record={selectedAccount}
          />
        </Suspense>
      </Modal>
      <Modal
        open={clientFormOpen}
        title='Editar cliente'
        onCancel={onCloseClientForm}
        footer={null}
        destroyOnClose
      >
        <Suspense fallback={<Spin />}>
          <ClientForm
            record={selectedClient}
            onCancel={onCloseClientForm}
            onSave={onSaveClient}
          />
        </Suspense>
      </Modal>
      <Modal
        open={updateBalanceFormOpen}
        title='Actualizar saldo'
        onCancel={onCloseUpdateBalance}
        footer={null}
        destroyOnClose
      >
        <Suspense fallback={<Spin />}>
          <UpdateBalanceForm onCancel={onCloseUpdateBalance} />
        </Suspense>
      </Modal>
    </>
  )
}
