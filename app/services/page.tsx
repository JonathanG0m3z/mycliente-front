'use client'

import { useCallback, useRef, useState } from 'react'
import ServicesTable, { ServicesTableRef } from './table/ServicesTable'
import { FloatButton, Modal, notification } from 'antd'
import { Service } from '@/interface/Service'
import { useLazyFetch } from '@/utils/useFetch'
import ServicesForm from './form/ServicesForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'

const Services = () => {
  const ServicesTableRef = useRef<ServicesTableRef>(null)
  const refreshTable = () => {
    ServicesTableRef.current?.refresh()
  }
  const [isOpenForm, setIsOpenForm] = useState(false)
  const openForm = useCallback(() => {
    setIsOpenForm(true)
  }, [])
  const closeForm = useCallback(() => {
    setIsOpenForm(false)
    setSelectedService(null)
  }, [])
  const onSaveService = useCallback(() => {
    notification.success({
      message: 'Información guardada'
    })
    refreshTable()
  }, [])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  /** EDIT */
  const onEdit = useCallback((record: Service) => {
    setSelectedService(record)
    openForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /** DELETE */
  const { fetchApiData: fetchDelete } = useLazyFetch()
  const onDelete = (record: Service) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este servicio?',
      content:
        'No podrás deshacer esta accion.',
      okType: 'danger',
      okButtonProps: { type: 'primary' },
      okText: 'Sí, eliminar',
      cancelText: 'No',
      onOk: () => {
        return new Promise((resolve, reject) => {
          fetchDelete(`services/${record.id}`, 'DELETE')
            .then(() => {
              notification.success({
                message: 'Servicio eliminado',
                description: 'Se eliminó el servicio junto con todas sus cuentas y ventas asociadas'
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
  return (
    <>
      <ServicesTable onDelete={onDelete} onEdit={onEdit} ref={ServicesTableRef} />
      <FloatButton.Group
        trigger='click'
        style={{ right: 24 }}
        icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
        tooltip='Opciones'
      >
        <FloatButton
          onClick={openForm}
          tooltip='Crear servicio'
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      </FloatButton.Group>
      <Modal
        open={isOpenForm}
        title={selectedService ? 'Editar servicio' : 'Registrar servicio'}
        onCancel={closeForm}
        footer={null}
        destroyOnClose
      >
        <ServicesForm
          onCancel={closeForm}
          onSave={onSaveService}
          record={selectedService}
        />
      </Modal>
    </>
  )
}

export default Services
