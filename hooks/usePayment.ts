'use client'
import { useState, useEffect, useRef } from 'react'
import { PaymentStatus } from '@/types'

const POLL_INTERVAL = 3000   // 3 segundos
const MAX_POLLS     = 300    // 15 minutos máximo

export function usePayment(paymentId: string | null) {
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [tributeId, setTributeId] = useState<string | null>(null)
  const polls = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!paymentId) return
    setStatus('pending')
    polls.current = 0

    const poll = async () => {
      if (polls.current >= MAX_POLLS) { setStatus('error'); return }
      polls.current++

      try {
        const res  = await fetch(`/api/checkout/status?paymentId=${paymentId}`)
        const data = await res.json()

        if (data.paid) {
          setStatus('approved')
          setTributeId(data.tributeId)
          return
        }
        if (data.status === 'rejected') {
          setStatus('rejected')
          return
        }
        timer.current = setTimeout(poll, POLL_INTERVAL)
      } catch {
        timer.current = setTimeout(poll, POLL_INTERVAL)
      }
    }

    poll()
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [paymentId])

  return { status, tributeId }
}
