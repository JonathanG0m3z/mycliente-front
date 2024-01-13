'use client'
import { useRouter } from 'next/navigation'

export default function Page () {
  const router = useRouter()
  router.push('/login')
  return (
    <div>
      <h1>Page</h1>
    </div>
  )
}
