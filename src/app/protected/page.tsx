'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-center mt-20">Checking authentication...</div>
  }

  if (status === 'authenticated') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
        <h1 className="text-4xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
        <p className="text-lg">You are now logged in with {session.user?.email}</p>
      </main>
    )
  }

  return null
}
