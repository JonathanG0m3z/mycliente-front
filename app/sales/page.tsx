'use client'

import {
  faEllipsisVertical,
  faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FloatButton, Modal } from 'antd'
import { useState } from 'react'
import SalesForm from './SalesForm'

export default function Sales () {
  const [isOpenForm, setIsOpenForm] = useState(false)
  const openForm = () => {
    setIsOpenForm(true)
  }
  const closeForm = () => {
    setIsOpenForm(false)
  }
  return (
    <>
      <div>
        <h1>Ventas</h1>
      </div>
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
        <SalesForm />
      </Modal>
    </>
  )
}
