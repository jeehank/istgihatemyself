'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="font-inter text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              X-CLUBS
            </h3>
            <p className="font-calibri text-gray-300 dark:text-gray-400 mb-6 max-w-md">
              Empowering students at St.Xavier's Collegiate School through diverse clubs and extracurricular activities. Join us in building a community of learning, growth, and excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-700 hover:bg-blue-600 rounded-full transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-700 hover:bg-blue-400 rounded-full transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-700 hover:bg-pink-600 rounded-full transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-700 hover:bg-red-600 rounded-full transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-inter text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-calibri">
              <li>
                <Link href="/" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  News
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Admin Login
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Made by Credit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <p className="font-calibri text-gray-300 dark:text-gray-400">
              Made by Jeehan
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-calibri text-gray-400 dark:text-gray-500 text-center md:text-left mb-4 md:mb-0"
            >
              © 2024 St.Xavier's Collegiate School. All rights reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex space-x-6 font-calibri text-sm"
            >
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
