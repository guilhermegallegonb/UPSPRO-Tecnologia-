'use client'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warn' | 'error'
  onClose: () => void
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'bg-emerald-500' :
             type === 'warn'    ? 'bg-amber-500' :
             type === 'error'   ? 'bg-red-500' :
             'bg-gray-800'

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-full text-white text-sm font-semibold shadow-xl ${bg} animate-fade-in whitespace-nowrap`}>
      {message}
    </div>
  )
}

// Hook global de toast
import { createContext, useContext, useCallback, ReactNode } from 'react'

interface ToastCtx { show: (msg: string, type?: ToastProps['type']) => void }
const ToastContext = createContext<ToastCtx>({ show: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastProps['type'] }>>([])
  let counter = 0

  const show = useCallback((message: string, type: ToastProps['type'] = 'info') => {
    const id = ++counter
    setToasts(prev => [...prev.slice(-2), { id, message, type }])
  }, [])  // eslint-disable-line

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(p => p.filter(x => x.id !== t.id))} />
      ))}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
