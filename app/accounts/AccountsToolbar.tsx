'use client'
import { AccountFilters } from '@/interface/Account'
import AccountModel from '@/model/Account'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Col, Input } from 'antd'
import React from 'react'

interface Props {
    filters: AccountFilters
    handleSearchChange: (value: string) => void
    openFilters: () => void
}

const AccountsToolbar: React.FC<Props> = ({ filters, handleSearchChange, openFilters }) => {
  return (
    <Col
      flex='auto'
      style={{ display: 'flex', alignItems: 'center', padding: '8px' }}
    >
      <Input.Search
        onChange={e => handleSearchChange(e.target.value)}
        value={filters.search}
        allowClear
        style={{ flex: 1, marginRight: '8px' }}
      />
      <Badge
        size='small'
        style={{ color: 'white' }}
        count={AccountModel.countActiveFilters(filters)}
        color='#5A54F9'
      >
        <Button shape='circle' onClick={openFilters}>
          <FontAwesomeIcon icon={faSliders} />
        </Button>
      </Badge>
    </Col>
  )
}

export default AccountsToolbar
