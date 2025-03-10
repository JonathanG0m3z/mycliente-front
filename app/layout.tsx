'use client'
import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, ConfigProvider } from 'antd'
import theme from '../config/themeConfig'
import esES from 'antd/lib/locale/es_ES'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useAuthMiddleware } from '@/utils/authMiddleware'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'
import '../styles/globals.css'

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

const RootLayout = ({ children }: React.PropsWithChildren) => {
  useAuthMiddleware()
  return (
    <html lang='en'>
      <title>MyCliente</title>
      <body style={{ backgroundColor: 'rgb(17 24 39)' }}>
        <AntdRegistry>
          <ConfigProvider locale={esES} theme={theme}>
            <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
              <App>
                {usePathname() === '/login' ? (children) : (<Navbar>{children}</Navbar>)}
              </App>
            </GoogleOAuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
