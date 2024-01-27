import React from 'react'
import { Layout, Menu, theme } from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'

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
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  //   const route = usePathname()
  //   const arrayRoute = route?.split('/').filter(item => item !== '')

  return (
    <Layout>
      <Header style={{ padding: 0 }}>
        <div className='demo-logo' />
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['sales']}
          items={items}
          style={{ flex: 1, minWidth: '100%' }}
        />
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
            minHeight: 'calc(100vh - 169px)',
            borderRadius: borderRadiusLG
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        MyCliente ©{new Date().getFullYear()} Created by{' '}
        <a target='_blank' href='https://github.com/JonathanG0m3z'>
          JonathanG0m3z
        </a>
      </Footer>
    </Layout>
  )
}

export default Navbar
