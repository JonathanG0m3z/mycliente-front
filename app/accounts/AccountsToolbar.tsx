'use client'
import { Button, Row } from 'antd'

interface Props {
    onCreate: () => void
}

const AccountsToolbar = ({ onCreate }: Props) => {
  return (
    <Row>
      <Button shape='round' type='primary' onClick={onCreate}>
        Crear
      </Button>
    </Row>
  )
}

export default AccountsToolbar
