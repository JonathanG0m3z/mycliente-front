'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Col,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Row,
  Tooltip,
  notification,
  theme
} from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCirclePlay,
  faEnvelope,
  faMoneyBill,
  faRightFromBracket,
  faShareNodes,
  faStore,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { TokenType } from '@/utils/authMiddleware'
import { jwtDecode } from 'jwt-decode'
import { MenuProps } from 'antd/lib'
import { usePathname, useRouter } from 'next/navigation'
import { encryptValue } from '@/utils/cryptoHooks'
import { validatePermission } from '@/utils/validatePermission'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const { Header, Content, Footer } = Layout

interface Props {
  children: React.ReactNode
}

const Navbar: (props: Props) => React.ReactNode = ({ children }: Props) => {
  const router = useRouter()
  const [decodedToken, setDecodedToken] = useState<TokenType | undefined>(
    undefined
  )
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const route = usePathname()
  const currentModule = route?.split('/')[1] ?? 'sales'

  const closeSession = () => {
    Modal.confirm({
      title: 'Cierre de sesión',
      content: '¿Estás seguro de cerrar la sesión?',
      onOk: () => {
        return new Promise((resolve, reject) => {
          fetch(`${NEXT_PUBLIC_BACKEND_URL}/users/logOut`, {
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
                  resolve(true)
                  localStorage.removeItem('token')
                  router.push('/login')
                })
              }
            })
            .catch(error => {
              reject(error)
              notification.error({
                message: 'Algo salió mal',
                description: error.message
              })
            })
        })
      }
    })
  }

  const navbarItems: ItemType<MenuItemType>[] = useMemo(() => [
    {
      key: 'sales',
      label: 'Ventas',
      icon: <FontAwesomeIcon icon={faMoneyBill} />,
      onClick: () => router.push('/sales'),
      disabled: !validatePermission('sales')
    },
    {
      key: 'accounts',
      label: 'Cuentas',
      icon: <FontAwesomeIcon icon={faEnvelope} />,
      onClick: () => router.push('/accounts'),
      disabled: !validatePermission('accounts')
    },
    {
      key: 'services',
      label: 'Servicios',
      icon: <FontAwesomeIcon icon={faCirclePlay} />,
      onClick: () => router.push('/services'),
      disabled: !validatePermission('services')
    },
    {
      key: 'sharedBoards',
      label: 'Tableros compartidos',
      icon: <FontAwesomeIcon icon={faShareNodes} />,
      onClick: () => router.push('/sharedBoards')
    },
    {
      key: 'store',
      label: '',
      icon: <Tooltip title='Tienda'><FontAwesomeIcon icon={faStore} /></Tooltip>,
      onClick: () => router.push('/store'),
      disabled: !validatePermission('store')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [])

  const avatarOptions: MenuProps['items'] = useMemo(() => [
    {
      key: 'log_out',
      label: 'Cerrar sesión',
      icon: <FontAwesomeIcon icon={faRightFromBracket} />,
      onClick: closeSession
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [])

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
              // theme='dark'
              mode='horizontal'
              selectedKeys={[currentModule]}
              items={navbarItems}
              style={{ flex: 1, minWidth: '100%', maxHeight: '55px' }}
            />
          </Col>
          <Col span={1} style={{ backgroundColor: colorBgContainer }}>
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
