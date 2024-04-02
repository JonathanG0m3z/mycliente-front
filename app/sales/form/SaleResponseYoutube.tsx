import { SaleData } from '@/interface/Sale'
import SendMsgWhatsapp from '@/utils/SendMsgWhatsapp'
import { deleteSpaces } from '@/utils/deleteSpaces'
import { WhatsAppOutlined } from '@ant-design/icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

interface Props {
  sale: null | SaleData
  onClose: () => void
}
const SaleResponseYoutube = ({ sale, onClose }: Props) => {
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const sendByWhatsApp = () => {
    setWhatsappLoading(true)
    SendMsgWhatsapp.sendGenericMsg(
      sale,
      `¡Ya se efectuó el proceso!
Revisa el correo electrónico ${sale?.client.email} y acepta la invitación a nuestro grupo familiar
Cinco días antes de la renovación te llegará un recordatorio por correo electrónico y whatsapp, allí encontrarás métodos de pago, planes y contacto
Próxima fecha de renovación: ${dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}`
    )
      .then(() => setWhatsappLoading(false))
  }
  return (
    <>
      {sale !== null && (
        <>
          <Row>
            <Col span={24}>
              <Typography.Title level={5}>
                ¡Venta exitosa de{' '}
                {sale.account.service.name.toLocaleLowerCase()}!
              </Typography.Title>
              <Typography.Text>
                ¡Ya se efectuó el proceso!
                Revisa el correo electrónico {sale?.client.email} y acepta la invitación a nuestro grupo familiar
                Cinco días antes de la renovación te llegará un recordatorio por correo electrónico y whatsapp, allí encontrarás métodos de pago, planes y contacto
                Próxima fecha de renovación: {dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}
              </Typography.Text>
            </Col>
          </Row>
          <Row justify='space-evenly'>
            <Typography.Text
              style={{ fontSize: '1.4rem' }}
              keyboard
              copyable={{
                text: deleteSpaces(`¡Ya se efectuó el proceso!
Revisa el correo electrónico ${sale?.client.email} y acepta la invitación a nuestro grupo familiar
Cinco días antes de la renovación te llegará un recordatorio por correo electrónico y whatsapp, allí encontrarás métodos de pago, planes y contacto
Próxima fecha de renovación: ${dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}`)
              }}
            />
            <Tooltip
              title={
                sale.client.phone
                  ? 'Envíar datos al whatsapp'
                  : 'Para habilitar el envío a whatsapp debes ingresar un número de teléfono'
              }
            >
              <Button
                type='primary'
                style={{
                  backgroundColor: !sale.client.phone ? '#075E54' : '#25D366'
                }}
                icon={<WhatsAppOutlined />}
                onClick={sendByWhatsApp}
                loading={whatsappLoading}
                disabled={!sale.client.phone || sale.client.phone === null}
              />
            </Tooltip>
            <Tooltip title='Cerrar'>
              <Button
                danger
                type='primary'
                icon={<FontAwesomeIcon icon={faXmark} />}
                onClick={onClose}
              />
            </Tooltip>
          </Row>
        </>
      )}
    </>
  )
}

export default SaleResponseYoutube
