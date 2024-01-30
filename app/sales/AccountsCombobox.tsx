'use client'
import { Col, Pagination, Row, Select, Tooltip, notification } from 'antd'
import { useLazyFetch } from '@/utils/useFetch'
import React, { useState } from 'react'
import { SelectProps } from 'antd/lib'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'

// types.ts
export interface OptionType {
  value: string
  label: string
}

// utils/api.ts

const { Option } = Select

interface RemoteComboboxProps extends SelectProps<string> {
  // fetchData: (variables: any) => void
  // data: any
  // dataKey: string
  // optionIdKey?: string
  // optionValueKey?: string
  // valueTemplate?: string
  // labelTemplate?: string
  pageSize?: number
  // defaultVariables?: any
  // error: any
  // addDropRender: React.ReactNode
}

const DEFAULT_FILTERS = {
  page: 1,
  search: ''
}

const Ejemplo: React.FC<RemoteComboboxProps> = ({
  // fetchData,
  // data,
  // dataKey,
  // optionIdKey,
  // optionValueKey,
  // valueTemplate,
  // labelTemplate,
  pageSize = 10,
  // defaultVariables = {},
  // error,
  // addDropRender,
  ...props
}) => {
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  const { data: apiData, loading, fetchApiData } = useLazyFetch()
  const applyFilters = (filters = localFilters) => {
    const newFilters = { ...localFilters, ...filters }
    const { page, search } = newFilters
    setLocalFilters(newFilters)
    fetchApiData(
      `accounts/combobox?search=${
        search !== '' ? search : ''
      }&page=${page}&limit=${pageSize || ''}`,
      'GET'
    ).catch(error => {
      notification.error({
        message: 'Upps, algo salió mal',
        description: error?.message
      })
    })
  }
  const onDropdownVisibleChange = (open: boolean) => {
    if (open) {
      applyFilters()
    }
  }

  const onSearch = (newValue: string) => {
    applyFilters({ ...localFilters, search: newValue, page: 1 })
  }

  const fetchNewPage = (page = 1) => {
    const pagination =
      pageSize >= 0
        ? {
            page
          }
        : {}
    applyFilters({ ...localFilters, ...pagination })
  }

  const dropdownRender = (menu: any) => {
    return (
      <>
        {menu}
        {pageSize >= 0 && (
          <>
            <Row>
              <Col flex='auto' style={{ width: '80%' }}>
                <Pagination
                  size='small'
                  current={localFilters.page}
                  pageSize={pageSize}
                  simple
                  onChange={fetchNewPage}
                  total={apiData?.total || 0}
                />
              </Col>
              <Col flex='auto' style={{ width: '20%' }}>
                <Tooltip title='Recargar'>
                  <FontAwesomeIcon
                    onClick={() => fetchNewPage(localFilters.page)}
                    icon={faRotateRight}
                  />
                </Tooltip>
              </Col>
              {/* {addDropRender && (
                <Col flex='auto' style={{ width: '100%' }}>
                  {addDropRender}
                </Col>
              )} */}
            </Row>
          </>
        )}
      </>
    )
  }

  return (
    <Select
      style={{ width: '100%' }}
      placeholder='Selecciona una opción'
      loading={loading}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onSearch={onSearch}
      showSearch
      filterOption={false}
      dropdownRender={dropdownRender}
      {...props}
    >
      {apiData?.accounts?.map((option: any) => (
        <Option key={option.id} value={option.id}>
          {option.email}
        </Option>
      ))}
    </Select>
  )
}

export default Ejemplo
