import { Button, Row } from 'antd'

interface Props {
  onCreate: () => void
}

const Toolbar = ({ onCreate }: Props) => {
  return (
    <Row justify='end'>
      <Button onClick={onCreate} shape='round' type='primary'>
        Crear cuenta
      </Button>
    </Row>
  )
}

export default Toolbar
