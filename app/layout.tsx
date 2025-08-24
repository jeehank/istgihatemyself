import './globals.css'
import { Inter } from 'next/font/google'
import SecretAccessProvider from '@/components/SecretAccessProvider'
import { DarkModeProvider } from '@/components/DarkModeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'X-CLUBS | St.Xavier\'s Collegiate School',
  description: 'Discover and join the amazing clubs at St.Xavier\'s Collegiate School',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>
          <SecretAccessProvider>
            {children}
          </SecretAccessProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
