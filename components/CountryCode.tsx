'use client'
import { Flex, Select, notification } from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const { Option } = Select

interface CountryCodeProps {
  onChange: (value: string) => void
}
export default function CountryCode ({ onChange }: CountryCodeProps) {
  const [countriesData, setCountriesData] = useState<any[]>([])
  const fields = 'fields=fifa,flags,idd,name'
  const url = `https://restcountries.com/v3.1/lang/spanish?${fields}`
  const getDialCodes = async () => {
    try {
      const response = await fetch(url)
      const result = await response.json()
      setCountriesData(result)
    } catch (error) {
      notification.error({
        message: 'Error en la autenticación',
        description: 'Por favor, intenta nuevamente'
      })
    }
  }
  const filterOption = (
    input: string,
    option?: { label: string; value: string; children: any }
  ) => {
    return (option?.children?.props?.children?.[1] ?? '')
      .toLowerCase()
      .includes(input.toLowerCase())
  }

  useEffect(() => {
    if (countriesData.length === 0) {
      getDialCodes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Select
      onChange={value => onChange(value)}
      allowClear
      showSearch
      optionFilterProp='children'
      filterOption={filterOption}
      labelInValue
    >
      {countriesData.map((country: any) => (
        <Option value={country.name.common} key={`${country.idd.root}${country.idd.suffixes[0]}`}>
          <Flex justify='left' align='center'>
            <Image
              src={country.flags.png}
              alt='dial-code'
              width={20}
              height={20}
              style={{ marginRight: 5 }}
            />
            {`${country.idd.root}${country.idd.suffixes[0]} ${country.name.common}`}
          </Flex>
        </Option>
      ))}
    </Select>
  )
}
