import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Space, Tag, Typography } from 'antd'
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
      <Tag color='blue'>{visible ? <Typography.Text copyable>{value}</Typography.Text> : '***'}</Tag>
      <Button
        size='small'
        shape='circle'
        icon={<FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />}
        onClick={changeState}
      />
    </Space>
  )
}

export default PasswordColumn
