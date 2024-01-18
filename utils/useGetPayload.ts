import { jwtDecode } from 'jwt-decode'
import { TokenType } from './authMiddleware'
import { notification } from 'antd'
import { useRouter } from 'next/navigation'

export const useGetPayload = () => {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken: TokenType = jwtDecode(token)
      return decodedToken
    } else {
      notification.warning({
        message: 'Sesión expirada',
        description: 'Por favor ingresar de nuevo'
      })
      router.push('/login')
    }
  }
}
