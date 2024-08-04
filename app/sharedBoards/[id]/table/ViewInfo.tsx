import { Account } from '@/interface/Account'
import { decryptValue } from '@/utils/cryptoHooks'
import { Button, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
  record: Account | null
  onCancel: () => void
}

const ViewInfo: React.FC<Props> = ({ record, onCancel }) => {
  const isIptvPremiun =
    record?.serviceId === 'de24f168-4f18-4a1d-a437-192fa9477df5'

  const iptvPremiunText = `*Velocidad mínima requerida: 25 Megas de Internet.*
Nombre: IPTV Premium
Usuario: ${record?.email}
Contraseña: ${decryptValue(record?.password ?? '')}
URL: http://iptvpremium.ink:55577
Vecha vencimiento: ${
    record?.expiration ? dayjs(record?.expiration).format('DD/MM/YYYY') : ''
  }`

  const iptvPremiunHtml = (
    <>
      *Velocidad mínima requerida: 25 Megas de Internet.*
      <br />
      Nombre: IPTV Premium
      <br />
      Usuario: {record?.email}
      <br />
      Contraseña: {decryptValue(record?.password ?? '')}
      <br />
      URL: http://iptvpremium.ink:55577
      <br />
      Vecha vencimiento:{' '}
      {record?.expiration ? dayjs(record?.expiration).format('DD/MM/YYYY') : ''}
    </>
  )
  const defaultCopyText = `*Cuenta de ${record?.service.name}*
Email: ${record?.email}
Contraseña: ${decryptValue(record?.password ?? '')}
Vecha vencimiento: ${
    record?.expiration ? dayjs(record?.expiration).format('DD/MM/YYYY') : ''
  }`
  const defaultHtml = (
    <>
      Cuenta de {record?.service.name}
      <br />
      Email: {record?.email}
      <br />
      Contraseña: {decryptValue(record?.password ?? '')}
      <br />
      Vecha vencimiento:{' '}
      {record?.expiration ? dayjs(record?.expiration).format('DD/MM/YYYY') : ''}
    </>
  )
  return (
    <>
      <Typography.Text
        copyable={{
          text: isIptvPremiun ? iptvPremiunText : defaultCopyText
        }}
      >
        {isIptvPremiun ? iptvPremiunHtml : defaultHtml}
      </Typography.Text>
      <br />
      <Button type='primary' onClick={onCancel} shape='round'>
        Aceptar
      </Button>
    </>
  )
}

export default ViewInfo
