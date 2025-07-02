'use client'

import {
  faEllipsisVertical,
  faHandHoldingDollar,
  faMoneyBillTransfer,
  faPersonCircleQuestion
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FloatButton, Modal, Spin, notification, Drawer } from 'antd' // Drawer añadido aquí
import { Suspense, lazy, useCallback, useRef, useState, useEffect } from 'react' // useEffect, useState añadidos aquí
import { SalesTable, SalesTableRef } from './table/SalesTable'
import { Sale, SaleFilters } from '@/interface/Sale'
import { useLazyFetch } from '@/utils/useFetch'
import { Account } from '@/interface/Account'
import UpdateBalanceForm from './updateBalance/UpdateBalanceForm'
import useUrlFilters from '@/utils/useUrlFilters'
import SalesToolbar from './table/SalesToolbar'
import FiltersForm from './table/FiltersForm'
import dayjs from 'dayjs'

const ClientForm = lazy(() => import('./client/ClientForm'))
const SalesForm = lazy(() => import('./form/SalesForm'))
const RenewForm = lazy(() => import('./renew/RenewForm'))
const RenewAccountForm = lazy(
  () => import('../accounts/renew/RenewAccountForm')
)

const DEFAULT_SALE_FILTERS: SaleFilters = {
  page: 1,
  pageSize: 10,
  search: '',
  is_deleted: false,
  expiration_range: [
    dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    dayjs().add(3, 'month').format('YYYY-MM-DD')
  ],
  order: 'expiration ASC',
};

export default function Sales () {
  const salesTableRef = useRef<SalesTableRef>(null)

  const [filtersInUrl, setFiltersInUrl] =
    useUrlFilters<SaleFilters>('sale_filters', DEFAULT_SALE_FILTERS)

  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const openFiltersDrawer = useCallback(() => {
    setShowFiltersDrawer(true)
  }, [])
  const closeFiltersDrawer = useCallback(() => {
    setShowFiltersDrawer(false)
  }, [])

  const onChangeMainFilters = useCallback((newPartialFilters: Partial<SaleFilters>) => {
    const updatedFilters = { ...filtersInUrl, ...newPartialFilters, page: 1 }
    setFiltersInUrl(updatedFilters)
  }, [filtersInUrl, setFiltersInUrl])

  const onTableFiltersChange = useCallback((newFilters: SaleFilters) => {
    setFiltersInUrl(newFilters)
  }, [setFiltersInUrl])

  useEffect(() => {
    if (salesTableRef.current) {
        salesTableRef.current.setFilters(filtersInUrl)
    }
  }, [filtersInUrl])

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
    closeForm();
    notification.success({ message: 'Venta guardada' });
  }, [closeForm])
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const { fetchApiData: fetchApi } = useLazyFetch()

  const onEdit = useCallback((record: Sale) => {
    setSelectedSale(record)
    openForm()
  }, [openForm])

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
                description: err.message || err
              })
              reject(err)
            })
        })
      }
    })
  }

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
    closeRenew();
    notification.success({ message: 'Venta renovada' });
  }, [closeRenew])

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [renewAccountFormOpen, setRenewAccountFormOpen] = useState(false)
  const onRenewAccount = useCallback((saleAccount: Sale['account']) => { // Renombrada la variable para evitar conflicto
    const account = saleAccount
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
    onCloseRenewAccountForm()
  }, [onCloseRenewAccountForm])

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
  }, [onCloseClientForm])

  const [updateBalanceFormOpen, setUpdatebalanceFormOpen] = useState(false)
  const onUpdateBalance = useCallback(() => {
    setUpdatebalanceFormOpen(true)
  }, [])
  const onCloseUpdateBalance = useCallback(() => {
    setUpdatebalanceFormOpen(false)
  }, [])
  const onFetchClientBalance = useCallback(() => {
    return new Promise((resolve, reject) => {
      // TODO: El ID del admin no debería estar hardcodeado.
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
            description: err.message || err
          })
          reject(err)
        })
    })
  }, [fetchApi])


  return (
    <>
      <SalesToolbar
        filters={filtersInUrl}
        onChangeFilters={onChangeMainFilters}
        openFilters={openFiltersDrawer}
      />
      <SalesTable
        ref={salesTableRef}
        onEdit={onEdit}
        onDelete={onDelete}
        onRenew={openRenew}
        onEditClient={onEditClient}
        onFiltersChange={onTableFiltersChange}
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

      <Drawer
        open={showFiltersDrawer}
        title='Filtros de Ventas'
        onClose={closeFiltersDrawer}
        destroyOnClose
        width={300}
      >
        <FiltersForm
          currentFilters={filtersInUrl}
          onChangeFilters={onChangeMainFilters}
          onClose={closeFiltersDrawer}
        />
      </Drawer>
    </>
  )
}
