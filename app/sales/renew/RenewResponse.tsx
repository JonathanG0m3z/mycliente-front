import { Sale } from '@/interface/Sale'
import { deleteSpaces } from '@/utils/deleteSpaces'
import { WhatsAppOutlined } from '@ant-design/icons'
import { faPlay, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Tooltip, Typography, notification } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import SendMsgWhatsapp from '../../../utils/SendMsgWhatsapp'

interface Props {
  sale: Sale | null
  onClose: () => void
  onRenewAccount: (sale: Sale['account']) => void
}
const RenewResponse = ({ sale, onClose, onRenewAccount }: Props) => {
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const sendByWhatsApp = () => {
    if (sale) {
      setWhatsappLoading(true)
      SendMsgWhatsapp.sendRenewMsgByWhatsapp(sale)
        .then(() => setWhatsappLoading(false))
        .catch(() => {
          setWhatsappLoading(false)
          notification.error({
            message: 'Algo salio mal',
            description: 'No se pudo enviar por WhatsApp'
          })
        })
    }
  }
  return (
    <>
      {sale !== null && (
        <>
          <Row>
            <Col span={24}>
              <Typography.Title level={5}>
                Renovación exitosa de{' '}
                {sale.account.service.name.toLocaleLowerCase()}!
              </Typography.Title>
              <Typography.Text>
                Cuenta: <b>{sale.account.email}</b>
                <br />
                {sale.profile && (
                  <>
                    Perfil: <b>{sale.profile}</b>
                    <br />
                  </>
                )}
                {sale.pin && (
                  <>
                    PIN: <b>{sale.pin}</b>
                    <br />
                  </>
                )}
                Nueva fecha de vencimiento:{' '}
                <b>{dayjs(sale?.expiration).format('DD-MM-YYYY')}</b>
              </Typography.Text>
            </Col>
          </Row>
          <Row justify='space-evenly'>
            <Typography.Text
              style={{ fontSize: '1.4rem' }}
              keyboard
              copyable={{
                text: deleteSpaces(`¡Renovación exitosa de ${sale.account.service.name.toLowerCase()}!
Cuenta: ${sale.account.email}
${sale.profile ? `Perfil: ${sale.profile}` : ''}
${sale.pin ? `PIN: ${sale.pin}` : ''}
Nueva fecha de vencimiento: ${dayjs(sale?.expiration).format('DD-MM-YYYY')}`)
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
            <Tooltip title='También renovar cuenta'>
              <Button
                type='primary'
                icon={<FontAwesomeIcon icon={faPlay} />}
                onClick={() => onRenewAccount(sale.account)}
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

export default RenewResponse
