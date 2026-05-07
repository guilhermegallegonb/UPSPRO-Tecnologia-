export type Theme = 'rose' | 'gold' | 'floral' | 'dark' | 'parchment'
export type Plan = 'basic' | 'premium'
export type Occasion =
  | 'Dia das Mães'
  | 'Aniversário'
  | 'Dia das Mulheres'
  | 'Natal'
  | 'Só porque sim'
  | string

export interface Track {
  id: string
  name: string
  artist: string
  category: 'piano' | 'romantica' | 'instrumental' | 'inspiradora' | 'especial'
  categoryLabel: string
  file: string
  duration: number
  previewStart?: number
}

export interface Tribute {
  id: string
  created_at: string
  updated_at: string
  mom_name: string
  sender_name: string
  occasion: Occasion
  message: string | null
  phrases: string[]
  theme: Theme
  music_track_id: string | null
  music_track_name: string | null
  photo_urls: string[]
  paid: boolean
  plan: Plan | null
  payment_id: string | null
  payment_status: 'pending' | 'approved' | 'rejected' | null
  paid_at: string | null
  amount_paid: number | null
  share_token: string
  expires_at: string | null
}

export interface TributeFormData {
  id: string
  momName: string
  senderName: string
  occasion: Occasion
  message: string
  phrases: string[]
  theme: Theme
  musicTrackId: string | null
  musicTrackName: string | null
  photoUrls: string[]
}

export interface CheckoutResponse {
  paymentId: string
  pixQrCode: string
  pixCopyPaste: string
  expiresAt: string
}

export type PaymentStatus = 'idle' | 'pending' | 'approved' | 'rejected' | 'error'
