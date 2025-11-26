'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const handleLinkClick = () => setIsMobileMenuOpen(false)

  const isActive = (path: string) =>
    pathname === path
      ? 'text-blue-300 font-semibold'
      : 'text-white hover:text-blue-200'

  const handleGoogleLogin = async () => {
    try {
      await signIn('google')
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-md text-white py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" passHref>
          <span className="text-2xl font-extrabold tracking-wide cursor-pointer bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            HMPF UGM
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">

          {/* Menu Items (UPDATED - news & contact removed) */}
          {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }].map(
            ({ href, label }) => (
              <Link key={href} href={href} passHref>
                <span className={`text-lg cursor-pointer transition ${isActive(href)}`}>
                  {label}
                </span>
              </Link>
            )
          )}

          {/* Auth Section */}
          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-300">
                {session.user?.name}
              </span>

              <button
                onClick={() => signOut()}
                className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 rounded-lg text-sm shadow"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg cursor-pointer shadow"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button
            onClick={toggleMenu}
            className="flex cursor-pointer flex-col justify-between w-6 h-6 focus:outline-none"
          >
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ease-in-out 
                ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ease-in-out 
                ${isMobileMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ease-in-out 
                ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white py-5 shadow-lg border-t border-slate-700">
          <div className="flex flex-col items-center space-y-5">

            {/* Menu Items (UPDATED - removed news & contact) */}
            {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }].map(
              ({ href, label }) => (
                <Link key={href} href={href} passHref>
                  <span
                    onClick={handleLinkClick}
                    className={`text-lg cursor-pointer transition ${isActive(href)}`}
                  >
                    {label}
                  </span>
                </Link>
              )
            )}

            {/* Auth Action */}
            {status === 'authenticated' ? (
              <>
                <span className="text-sm text-gray-300">{session.user?.name}</span>

                <button
                  onClick={() => {
                    handleLinkClick()
                    signOut()
                  }}
                  className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 rounded-lg text-sm shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLinkClick()
                  handleGoogleLogin()
                }}
                className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
