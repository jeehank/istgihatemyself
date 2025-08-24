'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './DarkModeProvider'

interface DarkModeToggleProps {
  className?: string
}

export default function DarkModeToggle({ className = '' }: DarkModeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  )
}
