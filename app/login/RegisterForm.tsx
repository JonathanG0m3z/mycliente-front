import CountryCode from '@/components/CountryCode'
import {
  faCircleUser,
  faEnvelope,
  faKey,
  faMobileScreenButton
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Checkbox, Flex, Form, Input, InputNumber } from 'antd'

interface DataNodeType {
  value: string
  label: string
  children?: DataNodeType[]
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
}

interface RegisterFormProps {
  onChangeForm: (value: 'LOGIN' | 'REGISTER') => void
}

export default function RegisterForm ({ onChangeForm }: RegisterFormProps) {
  const [form] = Form.useForm()

  const handleCountryChange = (value: string) => {
    form.setFieldsValue({ country: value })
  }

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      name='register'
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86'
      }}
      style={{ maxWidth: 600 }}
      scrollToFirstError
      layout='vertical'
    >
      <Form.Item
        name='email'
        label='Correo electrónico'
        rules={[
          {
            required: true,
            message: 'Ingresa tú correo electrónico'
          },
          {
            type: 'email',
            message: 'Tú correo no es válido'
          }
        ]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input
          prefix={<FontAwesomeIcon icon={faEnvelope} />}
          placeholder='ejemplo@ejemplo.com'
          size='large'
        />
      </Form.Item>

      <Form.Item
        name='name'
        label='Nombre'
        rules={[
          {
            required: true,
            message: 'Ingresa tú nombre'
          }
        ]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input
          prefix={<FontAwesomeIcon icon={faCircleUser} />}
          placeholder='Jhon Alejandro Gonzalez'
          size='large'
        />
      </Form.Item>

      <Form.Item
        name='password'
        label='Contraseña'
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa contraseña'
          },
          {
            min: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
          },
          {
            pattern:
              /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
            message:
              'La contraseña debe contener al menos una mayúscula, un número y un carácter especial'
          }
        ]}
        hasFeedback
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password
          prefix={<FontAwesomeIcon icon={faKey} />}
          placeholder='Contraseña'
          size='large'
        />
      </Form.Item>

      <Form.Item
        name='confirm'
        label='Confirma contraseña'
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Por favor, confirma tu contraseña!'
          },
          ({ getFieldValue }) => ({
            validator (_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error('La contraseña y la confirmación no coinciden!')
              )
            }
          })
        ]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password
          prefix={<FontAwesomeIcon icon={faKey} />}
          placeholder='Confirma tu contraseña'
          size='large'
        />
      </Form.Item>

      <Form.Item
        name='country'
        label='País'
        rules={[{ required: true, message: 'Por favor, ingresa un país' }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <CountryCode onChange={handleCountryChange} />
      </Form.Item>

      <Form.Item
        name='phone'
        label='Número de celular'
        rules={[{ required: true, message: 'Por favor, ingresa tu número' }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <InputNumber
          style={{ width: '100%' }}
          prefix={<FontAwesomeIcon icon={faMobileScreenButton} />}
          placeholder='3214567890'
          size='large'
        />
      </Form.Item>

      {/* <Form.Item
        name='agreement'
        valuePropName='checked'
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error('Should accept agreement'))
          }
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href=''>agreement</a>
        </Checkbox>
      </Form.Item> */}
      <Flex justify='space-around' align='start'>
        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
            Registrar
          </Button>
        </Form.Item>
        <Button type='default' danger onClick={() => onChangeForm('LOGIN')}>
          Cancelar
        </Button>
      </Flex>
    </Form>
  )
}
