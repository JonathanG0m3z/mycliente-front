'use client'
import {
  Button,
  Form,
  Input,
  Checkbox,
  Col,
  Card,
  Row,
  Flex,
  Divider,
  notification
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { decryptValue, encryptValue } from '@/utils/cryptoHooks'
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

export default function Login () {
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
    fetch(`${NEXT_PUBLIC_BACKEND_URL}users/signin`, {
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
            router.push('/home')
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
    console.log('values:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div
      style={{
        height: '100vh'
      }}
    >
      <Row>
        <Col
          xs={0}
          sm={0}
          md={0}
          lg={16}
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/5082567/pexels-photo-5082567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            backgroundSize: 'cover',
            height: '100vh'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: 'rgb(17 24 39 / 0.4)'
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.5rem',
                  lineHeight: '2rem',
                  fontWeight: '700'
                }}
              >
                MyCliente2
              </h2>
              <p
                style={{
                  maxWidth: '36rem',
                  marginTop: '0.75rem',
                  color: 'rgb(209 213 219)'
                }}
              >
                La mejor aplicación de registro de ventas para cuentas de
                streaming y entretenimiento. Estás a un paso de cambiar tu forma
                de trabajar.
              </p>
            </div>
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Card hoverable style={{ width: '92%', cursor: 'default' }}>
            <Form
              name='signin'
              form={form}
              initialValues={{
                remember: false
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
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
                <Input placeholder='ejemplo@ejemplo.com' size='large' />
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
                <Input.Password placeholder='Contraseña' size='large' />
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
                <Divider />
                <GoogleLogin
                  onError={handleErrorGoogle}
                  onSuccess={handleSuccesGoogle}
                  theme='filled_black'
                  width='30px'
                />
              </Flex>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
