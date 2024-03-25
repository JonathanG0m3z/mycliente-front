import { Button, Row } from 'antd'

interface Props {
  onCreate: () => void
}
const ServicesToolbar = ({ onCreate }: Props) => {
  return (
    <Row>
      <Button type='primary' onClick={onCreate}>Crear</Button>
    </Row>
  )
}

export default ServicesToolbar
