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

  const setValue = useCallback(
    (val: T) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, encodeURIComponent(JSON.stringify(val)))
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, key, router, pathname]
  )

  const remove = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    router.replace(`${pathname}?${params.toString()}`)
  }, [searchParams, key, router, pathname])

  return [value, setValue, remove] as const
}

export default useUrlState
