'use client'
import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, ConfigProvider } from 'antd'
import theme from '../config/themeConfig'
import esES from 'antd/lib/locale/es_ES'
import '@fortawesome/fontawesome-svg-core/styles.css'

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang='en'>
    <body style={{ backgroundColor: 'rgb(17 24 39)' }}>
      <AntdRegistry>
        <ConfigProvider locale={esES} theme={theme}>
          <App>{children}</App>
        </ConfigProvider>
      </AntdRegistry>
    </body>
  </html>
)

export default RootLayout
