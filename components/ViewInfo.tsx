import { Account } from '@/interface/Account'
import { decryptValue } from '@/utils/cryptoHooks'
import { useFetch } from '@/utils/useFetch'
import { Button, Spin, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
  accountId: string | null | undefined
  onCancel: () => void
}

const ViewInfo: React.FC<Props> = ({ accountId, onCancel }) => {
  const { data, loading } = useFetch<Account>(
    `accounts/${accountId}`,
    'GET',
    undefined
  )
  console.log('data:', data)
  const isIptvPremiun =
    data?.serviceId === 'de24f168-4f18-4a1d-a437-192fa9477df5'

  const iptvPremiunText = `*Velocidad mínima requerida: 25 Megas de Internet.*
Nombre: IPTV Premium
Usuario: ${data?.email}
Contraseña: ${decryptValue(data?.password ?? '')}
URL: http://iptvpremium.ink:55577
Vecha vencimiento: ${
    data?.expiration ? dayjs(data?.expiration).format('DD/MM/YYYY') : ''
  }`

  const iptvPremiunHtml = (
    <>
      *Velocidad mínima requerida: 25 Megas de Internet.*
      <br />
      Nombre: IPTV Premium
      <br />
      Usuario: {data?.email}
      <br />
      Contraseña: {decryptValue(data?.password ?? '')}
      <br />
      URL: http://iptvpremium.ink:55577
      <br />
      Vecha vencimiento:{' '}
      {data?.expiration ? dayjs(data?.expiration).format('DD/MM/YYYY') : ''}
    </>
  )
  const defaultCopyText = `*Cuenta de ${data?.service.name}*
Email: ${data?.email}
Contraseña: ${decryptValue(data?.password ?? '')}
Vecha vencimiento: ${
    data?.expiration ? dayjs(data?.expiration).format('DD/MM/YYYY') : ''
  }`
  const defaultHtml = (
    <>
      Cuenta de {data?.service.name}
      <br />
      Email: {data?.email}
      <br />
      Contraseña: {decryptValue(data?.password ?? '')}
      <br />
      Vecha vencimiento:{' '}
      {data?.expiration ? dayjs(data?.expiration).format('DD/MM/YYYY') : ''}
    </>
  )
  return (
    <Spin spinning={loading}>
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
    </Spin>
  )
}

export default ViewInfo
