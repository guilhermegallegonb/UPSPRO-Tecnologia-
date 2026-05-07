'use client'
import { useState } from 'react'
import { CheckoutResponse, PaymentStatus } from '@/types'
import { usePayment } from '@/hooks/usePayment'

interface Props {
  checkout: CheckoutResponse
  tributeId: string
  onSuccess: (tributeId: string) => void
  onBack: () => void
}

export function PixCheckout({ checkout, tributeId, onSuccess, onBack }: Props) {
  const [copied, setCopied] = useState(false)
  const { status } = usePayment(checkout.paymentId)

  if (status === 'approved') {
    onSuccess(tributeId)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(checkout.pixCopyPaste)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="text-center">
        <p className="font-semibold text-lg mb-1" style={{ color: 'var(--c-text)' }}>Escaneie o QR Code</p>
        <p className="text-sm" style={{ color: 'var(--c-text2)' }}>ou copie o código PIX abaixo</p>
      </div>

      {/* QR Code */}
      {checkout.pixQrCode && (
        <div className="p-3 bg-white rounded-2xl shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${checkout.pixQrCode}`}
            alt="QR Code PIX"
            width={200}
            height={200}
            className="block"
          />
        </div>
      )}

      {/* Copiar código */}
      <button
        onClick={copy}
        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm transition-all"
        style={{ background: copied ? '#10b981' : 'var(--c-surface)', border: '1px solid var(--c-border)', color: copied ? '#fff' : 'var(--c-text)' }}
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Código copiado!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copiar código PIX
          </>
        )}
      </button>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--c-text2)' }}>
        {status === 'pending' && (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Aguardando pagamento…
          </>
        )}
        {status === 'rejected' && <span className="text-red-400">Pagamento recusado. Tente novamente.</span>}
      </div>

      <button onClick={onBack} className="text-sm underline" style={{ color: 'var(--c-text2)' }}>
        ← Voltar aos planos
      </button>
    </div>
  )
}
