'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = variant === 'primary' ? 'btn-primary' :
               variant === 'secondary' ? 'btn-secondary' :
               'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all'

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  )
}
