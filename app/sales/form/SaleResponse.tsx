'use client'
import { SaleData } from '@/interface/Sale'
import { decryptValue } from '@/utils/cryptoHooks'
import { deleteSpaces } from '@/utils/deleteSpaces'
import { getDialByCountry } from '@/utils/getDialByCountry'
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
const SaleResponse = ({ sale, onClose }: Props) => {
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const sendByWhatsApp = () => {
    setWhatsappLoading(true)
    getDialByCountry(sale?.client.country ?? '').then((dial = '') => {
      const url = `https://api.whatsapp.com/send?phone=${dial}${
        sale?.client.phone
      }&text=¡Venta%20exitosa%20de%20${sale?.account.service.name.toLowerCase()}!%0A
😼Cliente%3A%20${sale?.client.name}%0A${
  `📝Cuenta%3A%20${
              sale?.account.email
          }%0A🔑Contraseña%3A%20${decryptValue(
              sale?.account.password ?? ''
            )}%0A`
      } ${sale?.sale.pin ? `*%EF%B8%8F⃣Pin%3A%20${sale?.sale.pin}%0A` : ''}${
        sale?.sale.profile ? `👤Perfil%3A%20${sale?.sale.profile}%0A` : ''
    }💵Precio%3A%20%24${
        sale?.sale.price
      }%0A🗓%EF%B8%8FFecha%20renovación%3A%20${dayjs(
        sale?.sale.expiration
      ).format('DD-MM-YYYY')}`
      window.open(url, '_blank')
      setWhatsappLoading(false)
    })
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
                Cuenta: <b>{sale.account.email}</b>
                <br />
                Contraseña: <b>{decryptValue(sale.account.password)}</b>
                <br />
                {sale.sale.profile && (
                  <>
                    Perfil: <b>{sale.sale.profile}</b>
                    <br />
                  </>
                )}
                {sale.sale.pin && (
                  <>
                    PIN: <b>{sale.sale.pin}</b>
                    <br />
                  </>
                )}
                Fecha de vencimiento:{' '}
                <b>{dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}</b>
              </Typography.Text>
            </Col>
          </Row>
          <Row justify='space-evenly'>
            <Typography.Text
              style={{ fontSize: '1.4rem' }}
              keyboard
              copyable={{
                text: deleteSpaces(`¡Venta exitosa de ${sale.account.service.name.toLowerCase()}!
Cuenta: ${sale.account.email}
Contraseña: ${decryptValue(sale.account.password)}
${sale.sale.profile ? `Perfil: ${sale.sale.profile}` : ''}
${sale.sale.pin ? `PIN: ${sale.sale.pin}` : ''}
Fecha de vencimiento: ${dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}`)
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

export default SaleResponse
