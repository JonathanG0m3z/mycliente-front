'use client'
import { Col, Card, Row } from 'antd'
import LoginForm from './LoginForm'
import { useEffect, useState } from 'react'
import RegisterForm from './RegisterForm'
import { TokenType } from '@/utils/authMiddleware'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

export default function Login () {
  const router = useRouter()
  const [cardState, setCardState] = useState<'LOGIN' | 'REGISTER'>('LOGIN')

  const onChangeForm = (value: 'LOGIN' | 'REGISTER') => {
    setCardState(value)
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken: TokenType = jwtDecode(token)
      const currentTime = Date.now() / 1000
      if (decodedToken.exp > currentTime) {
        router.push('/home')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
            {
              cardState === 'LOGIN' ? <LoginForm onChangeForm={onChangeForm} /> : <RegisterForm onChangeForm={onChangeForm} />
            }
          </Card>
        </Col>
      </Row>
    </div>
  )
}
