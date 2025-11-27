import React, { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

// contexts/ToastContext.tsx
interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number,
    action?: { label: string; onClick: () => void }
  ) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      duration: number = 3000,
      action?: { label: string; onClick: () => void }
    ) => {
      const id = Date.now().toString()
      const newToast: Toast = { id, message, type, duration, action }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id)
        }, duration)
      }
    },
    []
  )

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
