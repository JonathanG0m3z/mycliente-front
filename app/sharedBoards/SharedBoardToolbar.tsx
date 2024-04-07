'use client'
import { Button, Row } from 'antd'

interface Props {
  onCreate: () => void
}

const SharedBoardsToolbar = ({ onCreate }: Props) => {
  return (
    <Row>
      <Button type='primary' shape='round' onClick={onCreate}>
        Crear
      </Button>
    </Row>
  )
}

export default SharedBoardsToolbar
