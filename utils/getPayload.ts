'use client'
import { jwtDecode } from 'jwt-decode'
import { TokenType } from './authMiddleware'

export const getPayload = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken: TokenType = jwtDecode(token)
      return decodedToken
    }
  }
}
