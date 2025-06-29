'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

function parseParam<T> (value: string | null, defaultValue: T): T {
  if (!value) return defaultValue
  try {
    return JSON.parse(decodeURIComponent(value)) as T
  } catch (e) {
    return defaultValue
  }
}

export function useUrlState<T extends object> (key: string, defaultValue: T) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = useMemo(() => {
    return parseParam<T>(searchParams.get(key), defaultValue)
  }, [searchParams, key, defaultValue])

  const createURL = useCallback((updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    updater(params)
    router.replace(`${pathname}?${params.toString()}`)
  }, [searchParams, router, pathname])

  const setValue = useCallback(
    (val: T) => {
      createURL(params => params.set(key, encodeURIComponent(JSON.stringify(val))))
    },
    [key, createURL]
  )

  const remove = useCallback(() => {
    createURL(params => params.delete(key))
  }, [key, createURL])

  return [value, setValue, remove] as const
}

export default useUrlState
