'use client'
import { notification } from 'antd'

const NEXT_PUBLIC_COUUNTRY_API_URL = process.env.NEXT_PUBLIC_COUUNTRY_API_URL

export const getDialByCountry: (country: string) => Promise<string | undefined> = async (country: string) => {
  const fields = 'fields=idd'
  const url = `${NEXT_PUBLIC_COUUNTRY_API_URL}/name/${country}?${fields}`
  try {
    const response: any = (await fetch(url))
    const responseJson = await response.json()
    if (!responseJson || responseJson?.length < 1) throw new Error('No se encontró el código del país')
    const countryData = responseJson[0]
    const dial = `${countryData.idd.root}${countryData.idd.suffixes[0]}`
    return dial ?? ''
  } catch (error) {
    notification.error({
      message: 'Error en la validación',
      description: 'Por favor, intenta nuevamente'
    })
  }
}
