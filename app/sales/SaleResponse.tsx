import { AddSaleResponse } from '@/interface/Sale'
import { decryptValue } from '@/utils/cryptoHooks'
import { WhatsAppOutlined } from '@ant-design/icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'

const YOUTUBE_ACTIVATION = 'Activación youtube'

interface Props {
  sale: null | AddSaleResponse
  onClose: () => void
}
const SaleResponse = ({ sale, onClose }: Props) => {
  const sendByWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${sale?.client.phone}&text=😼Cliente%3A%20${sale?.client.name}%0A${
      !sale?.account.service.name.includes(YOUTUBE_ACTIVATION)
        ? `📝Cuenta%3A%20${sale?.account.email}%0A🔑Contraseña%3A%20${decryptValue(sale?.account.password ?? '')}%0A`
        : ''
    } ${sale?.sale.pin ? `*%EF%B8%8F⃣Pin%3A%20${sale?.sale.pin}%0A` : ''}${
      sale?.sale.profile ? `👤Perfil%3A%20${sale?.sale.profile}%0A` : ''
    }💵Precio%3A%20%24${sale?.sale.price}%0A🗓%EF%B8%8FFecha%20renovación%3A%20${dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}`
    window.open(url, '_blank')
  }
  return (
    <>
      {sale !== null && (
        <>
          <Row>
            <Col span={24}>
              <Typography.Title level={5}>¡Venta exitosa!</Typography.Title>
              <Typography.Text>
                Cuenta: <b>{sale.account.email}</b>
                <br />
                Contraseña: <b>{decryptValue(sale.account.password)}</b>
                <br />
                {sale.sale.profile !== null && (
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
                Fecha de vencimiento: <b>{dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}</b>
              </Typography.Text>
            </Col>
          </Row>
          <Row justify='space-evenly'>
            <Typography.Text
              style={{ fontSize: '1.4rem' }}
              keyboard
              copyable={{
                text: `¡Venta exitosa!
Cuenta: ${sale.account.email}
Contraseña: ${decryptValue(sale.account.password)}
${sale.sale.profile !== null && `Perfil: ${sale.sale.profile}`}
${sale.sale.pin && `PIN: ${sale.sale.pin}`}
Fecha de vencimiento: ${dayjs(sale?.sale.expiration).format('DD-MM-YYYY')}`
              }}
            />
            <Tooltip title='Envíar datos al whatsapp'>
              <Button
                type='primary'
                style={{ backgroundColor: '#25D366' }}
                icon={<WhatsAppOutlined />}
                onClick={sendByWhatsApp}
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
