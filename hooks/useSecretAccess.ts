'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useSecretAccess() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Alt + Ctrl combination
      if (event.altKey && event.ctrlKey) {
        event.preventDefault()
        
        // Show a cool notification
        const notification = document.createElement('div')
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          z-index: 9999;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          animation: slideIn 0.5s ease-out;
        `
        notification.innerHTML = '🔓 Secret Access Granted! Redirecting...'
        
        // Add animation keyframes
        const style = document.createElement('style')
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
        document.head.appendChild(style)
        document.body.appendChild(notification)

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/tech-team')
          // Remove notification after redirect
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
            if (document.head.contains(style)) {
              document.head.removeChild(style)
            }
          }, 1000)
        }, 1500)
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])
}
