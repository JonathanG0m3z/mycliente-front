import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Space, Tag } from 'antd'
import { useState } from 'react'

interface Props {
  value: string
}

const PasswordColumn = ({ value }: Props) => {
  const [visible, setVisible] = useState(false)

  const changeState = () => {
    setVisible(!visible)
  }
  return (
    <Space>
      <Tag color='blue'>{visible ? value : '***'}</Tag>
      <Button
        size='small'
        shape='circle'
        icon={<FontAwesomeIcon icon={faEye} />}
        onClick={changeState}
      />
    </Space>
  )
}

export default PasswordColumn
