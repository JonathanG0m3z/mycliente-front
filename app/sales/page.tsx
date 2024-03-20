'use client'

import {
  faEllipsisVertical,
  faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FloatButton, Modal, notification } from 'antd'
import { useCallback, useRef, useState } from 'react'
import SalesForm from './create/SalesForm'
import { SalesTable, SalesTableRef } from './table/SalesTable'
import { Sale } from '@/interface/Sale'
import { useLazyFetch } from '@/utils/useFetch'
import RenewForm from './renew/RenewForm'

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
  const onSaveSale = () => {
    salesTableRef.current?.refresh()
  }
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  /** EDIT */
  const onEdit = (record: Sale) => {
    setSelectedSale(record)
    openForm()
  }
  /** DELETE */
  const { fetchApiData: fetchDelete } = useLazyFetch()
  const onDelete = (record: Sale) => {
    Modal.confirm({
      title: 'Eliminar venta',
      content: '¿Estás seguro de eliminar esta venta?',
      onOk: () => {
        return new Promise((resolve, reject) => {
          fetchDelete(`sales/${record.id}`, 'DELETE')
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
  const openRenew = (record: Sale) => {
    setSelectedSale(record)
    setRenewIsOpen(true)
  }
  const closeRenew = () => {
    setRenewIsOpen(false)
    setSelectedSale(null)
  }
  return (
    <>
      <SalesTable
        ref={salesTableRef}
        onEdit={onEdit}
        onDelete={onDelete}
        onRenew={openRenew}
      />
      <FloatButton.Group
        trigger='click'
        style={{ right: 24 }}
        icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
        tooltip='Opciones'
      >
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
        <SalesForm
          onCancel={closeForm}
          onSave={onSaveSale}
          record={selectedSale}
        />
      </Modal>
      <Modal
        open={renewIsOpen}
        title='Renovar venta'
        onCancel={closeRenew}
        footer={null}
        destroyOnClose
      >
        <RenewForm
          onCancel={closeRenew}
          // onSave={onSaveSale}
          record={selectedSale}
        />
      </Modal>
    </>
  )
}
