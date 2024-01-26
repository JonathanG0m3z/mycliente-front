'use client'
import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, ConfigProvider } from 'antd'
import theme from '../config/themeConfig'
import esES from 'antd/lib/locale/es_ES'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useAuthMiddleware } from '@/utils/authMiddleware'

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

const RootLayout = ({ children }: React.PropsWithChildren) => {
  useAuthMiddleware()
  return (
    <html lang='en'>
      <body style={{ backgroundColor: 'rgb(17 24 39)' }}>
        <AntdRegistry>
          <ConfigProvider locale={esES} theme={theme}>
            <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
              <App>{children}</App>
            </GoogleOAuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
