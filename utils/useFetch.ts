'use client'
import { notification } from 'antd'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { encryptValue } from './cryptoHooks'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const useFetch = <T = any>(
  endPoint: string,
  method: string,
  body: any = undefined
) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const request = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/${endPoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(
            localStorage.getItem('token') ?? ''
          )}`
        },
        body: JSON.stringify(body)
      })
      if (request.status === 401) {
        router.push('/login')
        notification.destroy()
        notification.error({
          message: 'Token invalido',
          description: 'Favor iniciar sesión de nuevo'
        })
        localStorage.removeItem('token')
        return
      }
      const response = await request.json()
      if (request.ok) {
        setData(response)
        setLoading(false)
      } else {
        throw new Error(response.message)
      }
    } catch (err: any) {
      setError(err)
      setLoading(false)
      throw err.message
    }
  }, [endPoint, method, body, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchData()
    return data
  }, [fetchData, data])

  return { data, error, loading, refetch }
}

export const useLazyFetch = <T = any>() => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const fetchApiData = async (
    endPoint: string,
    method: string,
    body: any = undefined
  ) => {
    try {
      setLoading(true)
      const request = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/${endPoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(
            localStorage.getItem('token') ?? ''
          )}`
        },
        body: JSON.stringify(body)
      })
      if (request.status === 401) {
        notification.destroy()
        notification.error({
          message: 'Token invalido',
          description: 'Favor iniciar sesión de nuevo'
        })
        router.push('/login')
        localStorage.removeItem('token')
        return
      }
      const response = await request.json()
      if (request.ok) {
        setData(response)
        setLoading(false)
        return response
      } else {
        throw new Error(response.message)
      }
    } catch (err: any) {
      setError(err)
      setLoading(false)
      throw err.message
    }
  }

  return { data, error, loading, fetchApiData }
}
