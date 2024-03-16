'use client'

import {
  faEllipsisVertical,
  faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FloatButton, Modal } from 'antd'
import { useCallback, useRef, useState } from 'react'
import SalesForm from './create/SalesForm'
import { SalesTable, SalesTableRef } from './table/SalesTable'
import { Sale } from '@/interface/Sale'

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
  const [selectedSale, setSelectedSale] = useState<Sale| null>(null)
  /** EDIT */
  const onEdit = (record: Sale) => {
    setSelectedSale(record)
    openForm()
  }
  return (
    <>
      <SalesTable ref={salesTableRef} onEdit={onEdit} />
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
        <SalesForm onCancel={closeForm} onSave={onSaveSale} record={selectedSale} />
      </Modal>
    </>
  )
}
