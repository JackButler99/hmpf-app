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
    pathname === path ? 'text-blue-400' : 'text-white'

  const handleGoogleLogin = async () => {
    try {
      await signIn('google')
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div>
          <Link href="/" passHref>
            <span className="text-2xl font-bold cursor-pointer">HMPF UGM</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {[{ href: '/', label: 'Home' }, { href: '/news', label: 'News' }, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }].map(
            ({ href, label }) => (
              <Link key={href} href={href} passHref>
                <span className={`text-lg cursor-pointer ${isActive(href)}`}>{label}</span>
              </Link>
            )
          )}

          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-300">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="ml-4 px-3 py-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded cursor-pointer"
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

      {/* Mobile Menu Items */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white py-4">
          <div className="flex flex-col items-center space-y-4">
            {[{ href: '/', label: 'Home' }, { href: '/news', label: 'News' }, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }].map(
              ({ href, label }) => (
                <Link key={href} href={href} passHref>
                  <span onClick={handleLinkClick} className={`text-lg cursor-pointer ${isActive(href)}`}>
                    {label}
                  </span>
                </Link>
              )
            )}

            {status === 'authenticated' ? (
              <>
                <span className="text-sm text-gray-300">{session.user?.name}</span>
                <button
                  onClick={() => {
                    handleLinkClick()
                    signOut()
                  }}
                  className="px-3 py-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded text-sm"
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
                className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded"
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
