// components/Toast/Toast.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/app/context/toastContext'
import { RightIcon } from '@/app/assets/icons'

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast()

  const getIcon = (type: string) => {
    const iconProps = { className: 'w-5 h-5 flex-shrink-0' }

    switch (type) {
      case 'success':
        return <RightIcon {...iconProps} className="w-5 h-5 text-green-500" />
      // case 'error':
      //   return <XCircle {...iconProps} className="w-5 h-5 text-red-500" />
      // case 'warning':
      //   return <AlertCircle {...iconProps} className="w-5 h-5 text-amber-500" />
      // case 'info':
      // default:
      //   return <Info {...iconProps} className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="fixed top-5 left-1/2 translate-x-[-50%] z-[9999] flex flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 0, y: 20, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="min-w-[300px] px-4 py-3 rounded-xl bg-white shadow-lg border border-gray-100 flex items-center gap-3 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => hideToast(toast.id)}
          >
            {getIcon(toast.type)}

            <div className="flex-1 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-900">
                {toast.message}
              </span>

              {toast.action && (
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    toast.action?.onClick()
                  }}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
