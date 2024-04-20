'use client'
import { Col, Pagination, Row, Select, Tooltip, notification } from 'antd'
import React, { useState } from 'react'
import { SelectProps } from 'antd/lib'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { useLazyFetch } from '@/utils/useFetch'
import Mustache from 'mustache'

export interface OptionType {
  value: string
  label: string
}

const { Option } = Select

interface RemoteComboboxProps extends SelectProps<string> {
  originalQuery: string
  dataKey: string
  optionValueKey: string
  optionLabelKey: string
  // valueTemplate?: string
  labelTemplate?: string
  pageSize?: number
  // defaultVariables?: any
  // error: any
  addDropRender?: React.ReactNode
}

const DEFAULT_FILTERS = {
  page: 1,
  search: ''
}

const RemoteCombobox: React.FC<RemoteComboboxProps> = ({
  originalQuery,
  dataKey,
  optionValueKey,
  optionLabelKey,
  // valueTemplate,
  labelTemplate,
  pageSize = 10,
  // defaultVariables = {},
  // error,
  addDropRender,
  ...props
}) => {
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS)
  const { data: apiData, loading, fetchApiData } = useLazyFetch()
  const applyFilters = (filters = localFilters) => {
    const newFilters = { ...localFilters, ...filters }
    const { page, search } = newFilters
    setLocalFilters(newFilters)
    fetchApiData(
      `${originalQuery}?search=${search}&page=${page}&limit=${pageSize || ''}`,
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

  const [timer, setTimer] = useState<any | null>(null)

  const onSearch = (newValue: string) => {
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        applyFilters({ ...localFilters, search: newValue, page: 1 })
      }, 300)
    )
  }

  const fetchNewPage = (page = 1) => {
    const pagination =
      pageSize >= 0 ? { page } : {}
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
              {addDropRender && (
                <Col flex='auto' style={{ width: '100%' }}>
                  {addDropRender}
                </Col>
              )}
            </Row>
          </>
        )}
      </>
    )
  }

  const onSelectValue = () => {
    applyFilters({ ...localFilters, search: '' })
  }
  return (
    <Select
      style={{ width: '100%' }}
      placeholder='Selecciona una opción'
      onDropdownVisibleChange={onDropdownVisibleChange}
      onSearch={onSearch}
      showSearch
      filterOption={false}
      dropdownRender={dropdownRender}
      loading={loading}
      labelInValue
      // searchValue={localFilters.search}
      onSelect={onSelectValue}
      allowClear
      // mode='tags'
      // maxCount={1}
      {...props}
    >
      {apiData?.[dataKey]?.map((option: any) => (
        <Option key={option?.[optionValueKey]} value={option?.[optionValueKey]}>
          {labelTemplate ? Mustache.render(labelTemplate, option) : option?.[optionLabelKey]}
        </Option>
      ))}
    </Select>
  )
}

export default RemoteCombobox
