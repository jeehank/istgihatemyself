'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogIn, Home, Newspaper, Users } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Check if current page needs solid background (not homepage)
  const needsSolidBackground = pathname !== '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/#clubs', label: 'Clubs', icon: Users },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || needsSolidBackground
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F9c5249cc4ac34ee58fc514520c67d898%2Fd83b398e8e8246e0a5520439e34c4aa3?format=webp&width=100"
                  alt="St.Xavier's Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className={`font-inter text-xl font-bold transition-colors duration-300 ${
                  scrolled || needsSolidBackground ? 'text-gray-900 dark:text-white' : 'text-white'
                }`}>
                  X-CLUBS
                </h1>
                <p className={`font-calibri text-xs transition-colors duration-300 ${
                  scrolled || needsSolidBackground ? 'text-gray-600 dark:text-gray-400' : 'text-white/80'
                }`}>
                  St.Xavier's Collegiate School
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-calibri transition-all duration-300 ${
                      isActive(link.href)
                        ? scrolled || needsSolidBackground
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'bg-white/20 text-white'
                        : scrolled || needsSolidBackground
                          ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Dark Mode Toggle & Login Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <DarkModeToggle
                className={`${
                  scrolled || needsSolidBackground
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                }`}
              />
              <Link
                href="/member/login"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-calibri font-semibold transition-all duration-300 transform hover:scale-105 ${
                  scrolled || needsSolidBackground
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Member Login</span>
              </Link>
              <Link
                href="/admin/login"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-calibri font-semibold transition-all duration-300 transform hover:scale-105 ${
                  scrolled || needsSolidBackground
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                scrolled || needsSolidBackground ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 md:top-20 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-8 py-6">
              <div className="space-y-4">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-calibri transition-all duration-300 ${
                        isActive(link.href)
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
                
                {/* Dark Mode Toggle */}
                <div className="flex justify-center py-2">
                  <DarkModeToggle className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" />
                </div>

                {/* Mobile Login Buttons */}
                <Link
                  href="/member/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-calibri font-semibold transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>Member Login</span>
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-calibri font-semibold transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Admin Login</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 md:h-20"></div>
    </>
  )
}
