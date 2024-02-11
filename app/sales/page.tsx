'use client'

import {
  faEllipsisVertical,
  faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FloatButton, Modal } from 'antd'
import { useRef, useState } from 'react'
import SalesForm from './create/SalesForm'
import { SalesTable, SalesTableRef } from './table/SalesTable'

export default function Sales () {
  const salesTableRef = useRef<SalesTableRef>(null)
  const [isOpenForm, setIsOpenForm] = useState(false)
  const openForm = () => {
    setIsOpenForm(true)
  }
  const closeForm = () => {
    setIsOpenForm(false)
  }
  const onSaveSale = () => {
    salesTableRef.current?.refresh()
    closeForm()
  }
  return (
    <>
      <SalesTable ref={salesTableRef} />
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
        title='Registrar venta'
        // onOk={handleOk}
        onCancel={closeForm}
        footer={null}
      >
        <SalesForm onCancel={closeForm} onSave={onSaveSale} />
      </Modal>
    </>
  )
}
