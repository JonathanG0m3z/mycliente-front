'use client'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { notification } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

export interface TokenType {
  id: string
  name: string
  password: null
  phone: null | string
  email: string
  picture: string | null
  google_account: boolean
  permission: { [key: string] : string | undefined } | null
  createdAt: string
  updatedAt: string
  iat: number
  exp: number
}

let times = 0

export function useAuthMiddleware () {
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (times > 0) return
    times++
    if (path === '/login' || path === '/' || path === '/store') return
    const token = localStorage.getItem('token')

    if (!token) {
      notification.error({
        description: 'No se encontraron datos de sesión',
        message: 'Por favor ingresar'
      })
      router.push('/login')
    } else {
      const decodedToken: TokenType = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token')
        notification.warning({
          message: 'Inicio de sesión expirado',
          description: 'Por favor ingresar de nuevo'
        })
        router.push('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
