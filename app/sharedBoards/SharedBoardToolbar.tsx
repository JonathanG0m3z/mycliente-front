'use client'
import { validatePermission } from '@/utils/validatePermission'
import { Button, Row } from 'antd'

interface Props {
  onCreate: () => void
}

const SharedBoardsToolbar = ({ onCreate }: Props) => {
  return (
    <Row>
      <Button disabled={!validatePermission('sharedBoards', 'CRUD')} type='primary' shape='round' onClick={onCreate}>
        Crear
      </Button>
    </Row>
  )
}

export default SharedBoardsToolbar
