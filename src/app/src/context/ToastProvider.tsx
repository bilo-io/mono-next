// app/providers/ToastProvider.tsx
'use client'

import clsx from 'clsx'
import { createContext, useCallback, useContext, useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineInfoCircle, AiOutlineWarning, AiOutlineCloseCircle } from 'react-icons/ai'
import { useTheme } from './ThemeContext'

type ToastType = 'success' | 'info' | 'error' | 'warning'

interface Toast {
    id: string
    message: React.ReactNode
    type: ToastType
}

interface ToastContextType {
    showToast: (message: React.ReactNode, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = (): ToastContextType => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside ToastProvider')
    return ctx
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])
    const { theme } = useTheme();

    const showToast = useCallback((message: React.ReactNode, type: ToastType = 'info') => {
        const id = Date.now().toString()
        const toast: Toast = { id, message, type }
        setToasts((prev) => [...prev, toast])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 4000)
    }, [])

    const icons = {
        success: <AiOutlineCheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />,
        info: <AiOutlineInfoCircle className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />,
        warning: <AiOutlineWarning className="text-yellow-500 w-5 h-5 shrink-0 mt-0.5" />,
        error: <AiOutlineCloseCircle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />,
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            'flex items-start gap-2 p-4 rounded-md shadow-md border transition-opacity duration-300 opacity-100 animate-fade-in',
                            {
                                'border-green-500': toast.type === 'success',
                                'border-blue-500': toast.type === 'info',
                                'border-yellow-500': toast.type === 'warning',
                                'border-red-500': toast.type === 'error',
                            }
                        )}
                        style={{
                            backgroundColor: theme.BACKGROUND
                        }}
                    >
                        {icons[toast.type]}
                        <div
                            className="text-sm"
                            style={{
                                color: theme.TEXT
                            }}
                        >{toast.message}</div>
                    </div>
                ))}
            </div>

            {/* Animation keyframes (only needed once in your app) */}
            <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </ToastContext.Provider>
    )
}
