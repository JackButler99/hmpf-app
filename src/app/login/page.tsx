// pages/login.tsx
'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-blue-900 to-black">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to HMPF UGM</h1>
        <p className="mb-6 text-gray-600">Login with your <strong>@mail.ugm.ac.id</strong> email</p>
        <button
          onClick={() => signIn('google', {callbackUrl:"/"})}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}
