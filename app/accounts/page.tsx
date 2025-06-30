'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import AccountsTable, { AccountsTableRef } from './table/AccountsTable'
import { Account, AccountFilters } from '@/interface/Account'
import { useLazyFetch } from '@/utils/useFetch'
import {
  FloatButton,
  Modal,
  notification, Drawer
} from 'antd'
import AccountsForm from './create/AccountsForm'
import RenewAccountForm from './renew/RenewAccountForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisVertical,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import FiltersForm from './table/FiltersForm'
import useUrlFilters from '@/utils/useUrlFilters'
import AccountsToolbar from './AccountsToolbar'

const DEFAULT_FILTERS: AccountFilters = {
  page: 1,
  pageSize: 10,
  search: '',
  is_deleted: false,
  expiration_range: [dayjs().subtract(5, 'day'), dayjs().add(3, 'month')],
  order: 'expiration ASC'
}

const Accounts = () => {
  const [filtersInUrl, setFiltersInUrl] =
    useUrlFilters<AccountFilters>('filters', DEFAULT_FILTERS)
  const onChangeFilters = (newFilters: AccountFilters) => {
    setFiltersInUrl(newFilters)
    AccountsTableRef.current?.setFilters(newFilters)
  }
  const onTableFiltersChange = (newFilters: AccountFilters) => {
    setFiltersInUrl(newFilters)
  }

  useEffect(() => {
    AccountsTableRef.current?.setFilters(filtersInUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersInUrl])
  const [timer, setTimer] = useState<any | null>(null)

  const onChangeToolbarFilters = (filters: AccountFilters) => {
    onChangeFilters({ ...filters, page: 1 })
  }

  const handleSearchChange = (value: string) => {
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        onChangeToolbarFilters({ ...filtersInUrl, search: value })
      }, 300)
    )
  }

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
  const [showFilters, setShowFilters] = useState(false)
  const openFilters = useCallback(() => {
    setShowFilters(true)
  }, [])
  const closeFilters = useCallback(() => {
    setShowFilters(false)
  }, [])
  return (
    <>
      <AccountsToolbar
        filters={filtersInUrl}
        handleSearchChange={handleSearchChange}
        openFilters={openFilters}
      />
      <AccountsTable
        ref={AccountsTableRef}
        onEdit={onEdit}
        onDelete={onDelete}
        onRenew={openRenew}
        onFiltersChange={onTableFiltersChange}
      />
      <FloatButton.Group
        trigger='click'
        style={{ right: 24 }}
        icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
        tooltip='Opciones'
      >
        <FloatButton
          onClick={openForm}
          tooltip='Registrar cuenta'
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      </FloatButton.Group>
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
      <Drawer
        open={showFilters}
        title='Filtros'
        onClose={closeFilters}
        destroyOnClose
      >
        <FiltersForm
          currentFilters={filtersInUrl}
          onChangeFilters={onChangeToolbarFilters}
          onClose={closeFilters}
        />
      </Drawer>
    </>
  )
}

export default Accounts
