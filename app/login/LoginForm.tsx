import { decryptValue, encryptValue } from '@/utils/cryptoHooks'
import {
  faEnvelope,
  faKey,
  faRightToBracket
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  notification
} from 'antd'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface GoogleAuthData {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  nbf: number
  name: string
  picture: string
  given_name: string
  family_name: string
  locale: string
  iat: number
  exp: number
  jti: string
}

interface LoginFormProps {
  onChangeForm: (value: 'LOGIN' | 'REGISTER') => void
}

export default function LoginForm ({ onChangeForm }: LoginFormProps) {
  const [form] = Form.useForm()
  const router = useRouter()
  const handleErrorGoogle = () => {
    notification.error({
      message: 'Error en la autenticación',
      description: 'Por favor, intenta nuevamente'
    })
  }
  const handleSuccesGoogle = (credentialResponse: CredentialResponse) => {
    const token: GoogleAuthData = jwtDecode(credentialResponse.credential ?? '')
    fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: token.name,
        email: token.email,
        picture: token.picture,
        password: encryptValue(token.sub)
      })
    })
      .then(response => {
        if (response.ok) {
          response.json().then(res => {
            localStorage.setItem('token', decryptValue(res.token))
            router.push('/sales')
          })
        } else {
          response.json().then(res => {
            notification.error({
              message: 'Credenciales incorrectas',
              description: res.message
            })
          })
        }
      })
      .catch(error => {
        notification.error({
          message: 'Algo salió mal',
          description: error.message
        })
      })
  }

  const onFinish = (values: any) => {
    fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...values,
        password: encryptValue(values.password)
      })
    })
      .then(response => {
        if (response.ok) {
          response.json().then(res => {
            localStorage.setItem('token', decryptValue(res.token))
            router.push('/sales')
          })
        } else {
          response.json().then(res => {
            notification.error({
              message: 'Credenciales incorrectas',
              description: res.message
            })
          })
        }
      })
      .catch(error => {
        notification.error({
          message: 'Algo salió mal',
          description: error.message
        })
      })
  }
  return (
    <>
      <Form
        name='signin'
        form={form}
        initialValues={{
          remember: false
        }}
        onFinish={onFinish}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center'
          }}
        >
          <Image src='/favicon.ico' width={45} height={45} alt='' />
        </div>
        <Form.Item
          name='email'
          hasFeedback
          label='Correo electrónico'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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
        >
          <Input
            prefix={<FontAwesomeIcon icon={faEnvelope} />}
            placeholder='ejemplo@ejemplo.com'
            size='large'
          />
        </Form.Item>

        <Form.Item
          name='password'
          hasFeedback
          label='Contraseña'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Ingresa tú contraseña'
            },
            {
              min: 6,
              message: 'Tú contraseña debe tener mínimo 6 caracteres'
            }
          ]}
        >
          <Input.Password
            prefix={<FontAwesomeIcon icon={faKey} />}
            placeholder='Contraseña'
            size='large'
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox>Mantener sesión</Checkbox>
          </Form.Item>

          <a className='login-form-forgot' href='#'>
            ¿Olvidaste la contraseña?
          </a>
        </Form.Item>
        <Flex justify='center' vertical align='center'>
          <Button
            // loading={auth.loading}
            type='primary'
            htmlType='submit'
            shape='round'
            icon={<FontAwesomeIcon icon={faRightToBracket} />}
            size='large'
          >
            Ingresar
          </Button>
          <Divider>O ingresa con Google</Divider>
          <GoogleLogin
            onError={handleErrorGoogle}
            onSuccess={handleSuccesGoogle}
            theme='filled_black'
            width='30px'
          />
        </Flex>
      </Form>
      <Flex vertical align='center' style={{ marginTop: '1rem' }}>
        <label>¿Aún no tienes una cuenta?</label>
        <a
          className='login-form-forgot'
          href='#'
          onClick={() => onChangeForm('REGISTER')}
        >
          Registrate aqui
        </a>
      </Flex>
    </>
  )
}
