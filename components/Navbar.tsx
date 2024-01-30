'use client'
import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  notification,
  theme
} from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCirclePlay,
  faRightFromBracket,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { TokenType } from '@/utils/authMiddleware'
import { jwtDecode } from 'jwt-decode'
import { MenuProps } from 'antd/lib'
import { useRouter } from 'next/navigation'
import { encryptValue } from '@/utils/cryptoHooks'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const { Header, Content, Footer } = Layout

interface Props {
  children: React.ReactNode
}

const items: ItemType<MenuItemType>[] = [
  {
    key: 'sales',
    label: 'Ventas',
    icon: <FontAwesomeIcon icon={faCirclePlay} />
  }
]

const Navbar: (props: Props) => React.ReactNode = ({ children }: Props) => {
  const router = useRouter()
  const [decodedToken, setDecodedToken] = useState<TokenType | undefined>(
    undefined
  )
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const closeSession = () => {
    fetch(`${NEXT_PUBLIC_BACKEND_URL}users/logOut`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${encryptValue(
          localStorage.getItem('token') ?? ''
        )}`
      }
    })
      .then(response => {
        if (response.ok) {
          response.json().then(() => {
            localStorage.removeItem('token')
            router.push('/login')
          })
        } else {
          response.json().then(res => {
            notification.error({
              message: 'Token invalido',
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
  const avatarOptions: MenuProps['items'] = [
    {
      key: 'log_out',
      label: 'Cerrar sesión',
      icon: <FontAwesomeIcon icon={faRightFromBracket} />,
      onClick: closeSession
    }
  ]

  //   const route = usePathname()
  //   const arrayRoute = route?.split('/').filter(item => item !== '')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedToken = localStorage.getItem('token')
      const decodedToken: TokenType | undefined = cachedToken
        ? jwtDecode(cachedToken)
        : undefined
      setDecodedToken(decodedToken)
    }
  }, [])

  return (
    <Layout>
      <Header style={{ padding: 0, maxHeight: '55px' }}>
        <Row>
          <Col span={23}>
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={['sales']}
              items={items}
              style={{ flex: 1, minWidth: '100%', maxHeight: '55px' }}
            />
          </Col>
          <Col span={1}>
            <Dropdown menu={{ items: avatarOptions }} trigger={['click']}>
              <Avatar
                src={decodedToken?.picture}
                icon={<FontAwesomeIcon icon={faUser} />}
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '0 15px' }}>
        {/* <Breadcrumb style={{ margin: '14px 0' }}>
          {arrayRoute.map((item, index) => (
            <Breadcrumb.Item key={index + 1}>{item}</Breadcrumb.Item>
          ))}
        </Breadcrumb> */}
        <div
          style={{
            background: colorBgContainer,
            // minHeight: '77vh',
            minHeight: 'calc(100vh - 132px)',
            minWidth: '100%',
            borderRadius: borderRadiusLG
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', padding: 10 }}>
        MyCliente ©{new Date().getFullYear()} Created by{' '}
        <a target='_blank' href='https://github.com/JonathanG0m3z'>
          JonathanG0m3z
        </a>
      </Footer>
    </Layout>
  )
}

export default Navbar
